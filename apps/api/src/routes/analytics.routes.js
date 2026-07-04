const express = require('express');
const { query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const analyticsService = require('../services/analytics.service');
const response = require('../utils/response');

const router = express.Router();

// All analytics routes require authentication
router.use(authenticate);

/**
 * GET /api/analytics/overview
 * Dashboard summary: balance, income, expense, budget usage, recent transactions
 */
router.get('/overview',
  validate([]),
  async (req, res, next) => {
    try {
      const overview = await analyticsService.getDashboardOverview(req.user.uid);
      return response.success(res, overview);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/analytics/cashflow
 * Monthly income vs expense data for chart
 * Query: ?months=6 (default 6)
 */
router.get('/cashflow',
  validate([
    query('months').optional().isInt({ min: 1, max: 60 }).toInt(),
  ]),
  async (req, res, next) => {
    try {
      const months = req.query.months || 6;
      const cashflow = await analyticsService.getCashFlow(req.user.uid, months);
      return response.success(res, cashflow);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/analytics/categories
 * Spending breakdown by category
 * Query: ?month=5&year=2026
 */
router.get('/categories',
  validate([
    query('month').optional().isInt({ min: 1, max: 12 }).toInt(),
    query('year').optional().isInt({ min: 2020, max: 2099 }).toInt(),
  ]),
  async (req, res, next) => {
    try {
      const month = req.query.month || undefined;
      const year = req.query.year || undefined;

      const breakdown = await analyticsService.getCategoryBreakdown(
        req.user.uid,
        month,
        year
      );

      return response.success(res, breakdown);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/analytics/trends
 * Year-over-year comparison
 */
router.get('/trends',
  validate([]),
  async (req, res, next) => {
    try {
      const trends = await analyticsService.getTrends(req.user.uid);
      return response.success(res, trends);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
