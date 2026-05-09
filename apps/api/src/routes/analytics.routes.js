const express = require('express');
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
router.get('/overview', async (req, res, next) => {
  try {
    const overview = await analyticsService.getDashboardOverview(req.user.uid);
    return response.success(res, overview);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/cashflow
 * Monthly income vs expense data for chart
 * Query: ?months=6 (default 6)
 */
router.get('/cashflow', async (req, res, next) => {
  try {
    const months = parseInt(req.query.months, 10) || 6;
    const cashflow = await analyticsService.getCashFlow(req.user.uid, months);
    return response.success(res, cashflow);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/categories
 * Spending breakdown by category
 * Query: ?month=5&year=2026
 */
router.get('/categories', async (req, res, next) => {
  try {
    const month = parseInt(req.query.month, 10) || undefined;
    const year = parseInt(req.query.year, 10) || undefined;

    const breakdown = await analyticsService.getCategoryBreakdown(
      req.user.uid,
      month,
      year
    );

    return response.success(res, breakdown);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/analytics/trends
 * Year-over-year comparison
 */
router.get('/trends', async (req, res, next) => {
  try {
    const trends = await analyticsService.getTrends(req.user.uid);
    return response.success(res, trends);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
