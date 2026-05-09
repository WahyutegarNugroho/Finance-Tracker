const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const budgetService = require('../services/budget.service');
const response = require('../utils/response');

const router = express.Router();

// All budget routes require authentication
router.use(authenticate);

/**
 * GET /api/budgets/summary
 * Get overall budget summary
 * Must be before /:id to avoid route conflict
 */
router.get('/summary', async (req, res, next) => {
  try {
    const month = parseInt(req.query.month, 10) || undefined;
    const year = parseInt(req.query.year, 10) || undefined;

    const summary = await budgetService.getBudgetSummary(
      req.user.uid,
      month,
      year
    );

    return response.success(res, summary);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/budgets
 * List all budgets for current or specified month
 */
router.get('/', async (req, res, next) => {
  try {
    const month = parseInt(req.query.month, 10) || undefined;
    const year = parseInt(req.query.year, 10) || undefined;

    const budgets = await budgetService.getBudgets(
      req.user.uid,
      month,
      year
    );

    return response.success(res, budgets);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/budgets
 * Create a new budget
 */
router.post(
  '/',
  validate([
    body('categoryId').notEmpty().withMessage('Category ID is required'),
    body('categoryName').notEmpty().trim().withMessage('Category name is required'),
    body('categoryIcon').optional().trim(),
    body('limitAmount')
      .isFloat({ min: 1 })
      .withMessage('Limit amount must be a positive number'),
    body('period')
      .optional()
      .isIn(['monthly', 'weekly', 'yearly'])
      .withMessage('Period must be monthly, weekly, or yearly'),
    body('month')
      .optional()
      .isInt({ min: 1, max: 12 })
      .withMessage('Month must be between 1-12'),
    body('year')
      .optional()
      .isInt({ min: 2020, max: 2099 })
      .withMessage('Year must be between 2020-2099'),
  ]),
  async (req, res, next) => {
    try {
      const result = await budgetService.createBudget(req.user.uid, req.body);

      if (result.success === false) {
        return response.error(res, result.message, 409);
      }

      return response.created(res, result, 'Budget created successfully.');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/budgets/:id
 * Update a budget
 */
router.put(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Budget ID is required'),
    body('limitAmount').optional().isFloat({ min: 1 }),
    body('categoryId').optional().notEmpty(),
    body('categoryName').optional().trim().notEmpty(),
    body('categoryIcon').optional().trim(),
    body('period').optional().isIn(['monthly', 'weekly', 'yearly']),
  ]),
  async (req, res, next) => {
    try {
      const budget = await budgetService.updateBudget(
        req.user.uid,
        req.params.id,
        req.body
      );

      if (!budget) {
        return response.notFound(res, 'Budget');
      }

      return response.success(res, budget, 'Budget updated successfully.');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/budgets/:id
 * Delete a budget
 */
router.delete(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Budget ID is required'),
  ]),
  async (req, res, next) => {
    try {
      const deleted = await budgetService.deleteBudget(
        req.user.uid,
        req.params.id
      );

      if (!deleted) {
        return response.notFound(res, 'Budget');
      }

      return response.success(res, null, 'Budget deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
