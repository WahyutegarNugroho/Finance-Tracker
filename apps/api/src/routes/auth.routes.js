const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const authService = require('../services/auth.service');
const response = require('../utils/response');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user with email and password
 */
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('displayName')
      .notEmpty()
      .trim()
      .withMessage('Display name is required'),
  ]),
  async (req, res, next) => {
    try {
      const { email, password, displayName } = req.body;
      const user = await authService.registerUser(email, password, displayName);
      return response.created(res, user, 'User registered successfully.');
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        return response.error(res, 'Email already in use.', 409);
      }
      if (error.code === 'auth/invalid-password') {
        return response.error(res, 'Password must be at least 6 characters.', 400);
      }
      next(error);
    }
  }
);

/**
 * POST /api/auth/google
 * Handle Google Sign-In (called after frontend Firebase Google auth)
 * Frontend sends the user info after successful Google sign-in
 */
router.post(
  '/google',
  authenticate,
  async (req, res, next) => {
    try {
      const { uid, email, name, picture } = req.user;
      const user = await authService.handleGoogleSignIn(uid, email, name, picture);
      return response.success(res, user, 'Google sign-in successful.');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const profile = await authService.getUserProfile(req.user.uid);

    if (!profile) {
      return response.notFound(res, 'User profile');
    }

    return response.success(res, profile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
