const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const transactionService = require('../services/transaction.service');
const response = require('../utils/response');

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

/**
 * GET /api/transactions/summary
 * Get income/expense summary for a month
 * Must be before /:id to avoid route conflict
 */
router.get('/summary', async (req, res, next) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    const summary = await transactionService.getTransactionSummary(
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
 * GET /api/transactions
 * List transactions with filtering, search, and pagination
 */
router.get('/', async (req, res, next) => {
  try {
    const { transactions, pagination } = await transactionService.getTransactions(
      req.user.uid,
      req.query
    );

    return response.paginated(res, transactions, pagination);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/transactions/:id
 * Get a single transaction
 */
router.get(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Transaction ID is required'),
  ]),
  async (req, res, next) => {
    try {
      const transaction = await transactionService.getTransactionById(
        req.user.uid,
        req.params.id
      );

      if (!transaction) {
        return response.notFound(res, 'Transaction');
      }

      return response.success(res, transaction);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/transactions
 * Create a new transaction
 */
router.post(
  '/',
  validate([
    body('categoryId').notEmpty().withMessage('Category ID is required'),
    body('categoryName').notEmpty().trim().withMessage('Category name is required'),
    body('categoryIcon').optional().trim(),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be "income" or "expense"'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive number'),
    body('note').optional().trim(),
    body('date').optional().isISO8601().withMessage('Date must be a valid ISO date'),
  ]),
  async (req, res, next) => {
    try {
      const transaction = await transactionService.createTransaction(
        req.user.uid,
        req.body
      );

      return response.created(res, transaction, 'Transaction created successfully.');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/transactions/:id
 * Update a transaction
 */
router.put(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Transaction ID is required'),
    body('categoryId').optional().notEmpty(),
    body('categoryName').optional().trim().notEmpty(),
    body('categoryIcon').optional().trim(),
    body('type').optional().isIn(['income', 'expense']),
    body('amount').optional().isFloat({ min: 0.01 }),
    body('note').optional().trim(),
    body('date').optional().isISO8601(),
  ]),
  async (req, res, next) => {
    try {
      const transaction = await transactionService.updateTransaction(
        req.user.uid,
        req.params.id,
        req.body
      );

      if (!transaction) {
        return response.notFound(res, 'Transaction');
      }

      return response.success(res, transaction, 'Transaction updated successfully.');
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
router.delete(
  '/:id',
  validate([
    param('id').notEmpty().withMessage('Transaction ID is required'),
  ]),
  async (req, res, next) => {
    try {
      const deleted = await transactionService.deleteTransaction(
        req.user.uid,
        req.params.id
      );

      if (!deleted) {
        return response.notFound(res, 'Transaction');
      }

      return response.success(res, null, 'Transaction deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
