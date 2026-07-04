const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Catches all unhandled errors and returns standardized response
 */
const errorHandler = (err, req, res, _next) => {
  logger.error({ err, cid: req.correlationId, path: `${req.method} ${req.originalUrl}` }, 'Unhandled error');

  // Firebase-specific errors
  if (err.code && typeof err.code === 'string' && err.code.startsWith('auth/')) {
    return res.status(400).json({
      success: false,
      error: 'Authentication Error',
      message: err.message,
    });
  }

  // Firestore errors
  if (err.code === 'not-found') {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'The requested resource was not found.',
    });
  }

  if (err.code === 'permission-denied') {
    return res.status(403).json({
      success: false,
      error: 'Permission Denied',
      message: 'You do not have permission to perform this action.',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
    });
  }

  // Default 500 error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message,
    ...(statusCode === 500 && req.correlationId ? { correlationId: req.correlationId } : {}),
  });
};

module.exports = { errorHandler };
