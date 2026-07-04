const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const transactionService = require('../services/transaction.service');
const recurringService = require('../services/recurring.service');
const response = require('../utils/response');

const router = express.Router();

// All transaction routes require authentication
router.use(authenticate);

/**
 * POST /api/transactions/process-recurring
 * Process due recurring transactions for the authenticated user
 */
router.post('/process-recurring',
  validate([]),
  async (req, res, next) => {
    try {
      const result = await recurringService.processDueTransactions(req.user.uid);
      return response.success(res, result, `${result.processed} recurring transactions processed.`);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/transactions/summary
 * Get income/expense summary for a month
 * Must be before /:id to avoid route conflict
 */
router.get('/summary',
  validate([
    query('month').optional().isInt({ min: 1, max: 12 }).toInt(),
    query('year').optional().isInt({ min: 2020, max: 2099 }).toInt(),
  ]),
  async (req, res, next) => {
    try {
      const now = new Date();
      const month = req.query.month || now.getMonth() + 1;
      const year = req.query.year || now.getFullYear();

      const summary = await transactionService.getTransactionSummary(
        req.user.uid,
        month,
        year
      );

      return response.success(res, summary);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/transactions
 * List transactions with filtering, search, and pagination
 */
router.get('/',
  validate([
    query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
    query('sortBy').optional().isIn(['date', 'amount']).withMessage('sortBy must be date or amount'),
    query('categoryId').optional().isString().notEmpty(),
    query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO date'),
    query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO date'),
    query('search').optional().isString().trim(),
    query('cursor').optional().isString(),
  ]),
  async (req, res, next) => {
    try {
      const { transactions, pagination } = await transactionService.getTransactions(
        req.user.uid,
        req.query
      );

      return response.paginated(res, transactions, pagination);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/transactions/batch
 * Create multiple transactions in a single batch
 */
router.post('/batch',
  validate([
    body('transactions').isArray({ min: 1, max: 500 }).withMessage('transactions must be an array (1-500 items)'),
    body('transactions.*.categoryId').notEmpty().withMessage('Each transaction needs a categoryId'),
    body('transactions.*.categoryName').notEmpty().trim().withMessage('Each transaction needs a categoryName'),
    body('transactions.*.categoryIcon').optional().trim(),
    body('transactions.*.type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('transactions.*.amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
    body('transactions.*.currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
    body('transactions.*.isRecurring').optional().isBoolean(),
    body('transactions.*.recurringFrequency').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
    body('transactions.*.recurringEndDate').optional().isISO8601(),
    body('transactions.*.tags').optional().isArray(),
    body('transactions.*.tags.*').isString().trim().notEmpty(),
    body('transactions.*.attachments').optional().isArray(),
    body('transactions.*.attachments.*.name').optional().isString().trim(),
    body('transactions.*.attachments.*.url').optional().isString(),
    body('transactions.*.attachments.*.type').optional().isString(),
    body('transactions.*.note').optional().trim().isLength({ max: 1000 }).withMessage('Note must be at most 1000 characters'),
    body('transactions.*.date').optional().isISO8601().withMessage('Date must be a valid ISO date'),
  ]),
  async (req, res, next) => {
    try {
      const created = await transactionService.batchCreateTransactions(
        req.user.uid,
        req.body.transactions
      );

      return response.created(res, created, `${created.length} transactions created.`);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/transactions/batch
 * Delete multiple transactions by ID (ownership verified)
 */
router.delete('/batch',
  validate([
    body('ids').isArray({ min: 1, max: 100 }).withMessage('ids must be an array (1-100 items)'),
    body('ids.*').isString().notEmpty().withMessage('Each ID must be a valid string'),
  ]),
  async (req, res, next) => {
    try {
      const deletedCount = await transactionService.batchDeleteTransactions(req.user.uid, req.body.ids);
      return response.success(res, { deleted: deletedCount }, `${deletedCount} transactions deleted.`);
    } catch (error) {
      next(error);
    }
  }
);

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
    body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
    body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean'),
    body('recurringFrequency').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Frequency must be daily, weekly, monthly, or yearly'),
    body('recurringEndDate').optional().isISO8601().withMessage('recurringEndDate must be a valid ISO date'),
    body('tags').optional().isArray().withMessage('tags must be an array'),
    body('tags.*').isString().trim().notEmpty(),
    body('attachments').optional().isArray().withMessage('attachments must be an array'),
    body('attachments.*.name').optional().isString().trim(),
    body('attachments.*.url').optional().isString(),
    body('attachments.*.type').optional().isString(),
    body('note').optional().trim().isLength({ max: 1000 }).withMessage('Note must be at most 1000 characters'),
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
    body('currency').optional().isString().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-letter code'),
    body('isRecurring').optional().isBoolean().withMessage('isRecurring must be a boolean'),
    body('recurringFrequency').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Frequency must be daily, weekly, monthly, or yearly'),
    body('recurringEndDate').optional().isISO8601().withMessage('recurringEndDate must be a valid ISO date'),
    body('tags').optional().isArray().withMessage('tags must be an array'),
    body('tags.*').isString().trim().notEmpty(),
    body('attachments').optional().isArray().withMessage('attachments must be an array'),
    body('attachments.*.name').optional().isString().trim(),
    body('attachments.*.url').optional().isString(),
    body('attachments.*.type').optional().isString(),
    body('note').optional().trim().isLength({ max: 1000 }).withMessage('Note must be at most 1000 characters'),
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
