const { auth } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * Simple in-memory token cache (TTL: 5 minutes)
 * Reduces Firebase Auth verifyIdToken calls on every request
 */
// ponytail: Map cache → switch to lru-cache with TTL when >1k daily active users
const tokenCache = new Map();
const TOKEN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000;

const getCachedToken = (token) => {
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.ts < TOKEN_CACHE_TTL) {
    return cached.decodedToken;
  }
  tokenCache.delete(token);
  return null;
};

const setCachedToken = (token, decodedToken) => {
  if (tokenCache.size >= MAX_CACHE_SIZE) {
    const oldest = tokenCache.keys().next().value;
    tokenCache.delete(oldest);
  }
  tokenCache.set(token, { decodedToken, ts: Date.now() });
};

/**
 * Authentication middleware
 * Verifies Firebase ID token from Authorization header
 * Attaches decoded user info to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No authentication token provided. Use Authorization: Bearer <token>',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    // Check cache first
    const cached = getCachedToken(token);
    if (cached) {
      req.user = cached;
      return next();
    }

    const decodedToken = await auth.verifyIdToken(token, true);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
      picture: decodedToken.picture || null,
      emailVerified: decodedToken.email_verified || false,
    };

    setCachedToken(token, req.user);

    next();
  } catch (error) {
    logger.warn({ err: error, cid: req.correlationId }, 'Auth middleware error');

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: 'Token Expired',
        message: 'Your session has expired. Please sign in again.',
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        error: 'Token Revoked',
        message: 'Your session has been revoked. Please sign in again.',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid authentication token.',
    });
  }
};

module.exports = { authenticate };
