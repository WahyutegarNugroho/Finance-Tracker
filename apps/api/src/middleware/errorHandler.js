/**
 * Global error handler middleware
 * Catches all unhandled errors and returns standardized response
 */
const errorHandler = (err, req, res, _next) => {
  console.error('─── Unhandled Error ───');
  console.error('Path:', req.method, req.originalUrl);
  console.error('Message:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error('Stack:', err.stack);
  }
  console.error('───────────────────────');

  // Firebase-specific errors
  if (err.code && typeof err.code === 'string' && err.code.startsWith('auth/')) {
    return res.status(400).json({
      success: false,
      error: 'Authentication Error',
      message: err.message,
    });
  }

  // Firestore errors
  if (err.code && (err.code === 'not-found' || err.code === 5)) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'The requested resource was not found.',
    });
  }

  if (err.code && (err.code === 'permission-denied' || err.code === 7)) {
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
  });
};

module.exports = { errorHandler };
