const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const categoryService = require('../services/category.service');
const response = require('../utils/response');

const router = express.Router();

// All category routes require authentication
router.use(authenticate);

/**
 * GET /api/categories
 * List all categories for the current user
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories(req.user.uid);
    return response.success(res, categories);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/categories
 * Create a new category
 */
router.post(
  '/',
  validate([
    body('name').notEmpty().trim().withMessage('Category name is required'),
    body('icon').optional().trim(),
    body('color')
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage('Color must be a valid hex color (e.g. #4648d4)'),
    body('type')
      .optional()
      .isIn(['income', 'expense', 'both'])
      .withMessage('Type must be income, expense, or both'),
  ]),
  async (req, res, next) => {
    try {
      const category = await categoryService.createCategory(req.user.uid, req.body);
      return response.created(res, category, 'Category created successfully.');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/categories/:id
 * Update a category
 */
router.put(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Category ID is required'),
    body('name').optional().trim().notEmpty(),
    body('icon').optional().trim(),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
    body('type').optional().isIn(['income', 'expense', 'both']),
  ]),
  async (req, res, next) => {
    try {
      const category = await categoryService.updateCategory(
        req.user.uid,
        req.params.id,
        req.body
      );

      if (!category) {
        return response.notFound(res, 'Category');
      }

      return response.success(res, category, 'Category updated successfully.');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/categories/:id
 * Delete a category
 */
router.delete(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Category ID is required'),
  ]),
  async (req, res, next) => {
    try {
      const result = await categoryService.deleteCategory(
        req.user.uid,
        req.params.id
      );

      if (!result.success && result.reason === 'not_found') {
        return response.notFound(res, 'Category');
      }

      if (!result.success && result.reason === 'has_transactions') {
        return response.error(res, result.message, 409);
      }

      return response.success(res, null, 'Category deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
