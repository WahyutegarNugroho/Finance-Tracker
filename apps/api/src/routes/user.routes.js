const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const userService = require('../services/user.service');
const response = require('../utils/response');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req.user.uid);

    if (!profile) {
      return response.notFound(res, 'User profile');
    }

    return response.success(res, profile);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put(
  '/profile',
  validate([
    body('displayName').optional().trim().notEmpty().withMessage('Display name cannot be empty'),
    body('currency')
      .optional()
      .isIn(['IDR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD'])
      .withMessage('Invalid currency code'),
    body('darkMode').optional().isBoolean().withMessage('darkMode must be a boolean'),
    body('photoURL').optional().isURL().withMessage('photoURL must be a valid URL'),
  ]),
  async (req, res, next) => {
    try {
      const profile = await userService.updateProfile(req.user.uid, req.body);
      return response.success(res, profile, 'Profile updated successfully.');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
