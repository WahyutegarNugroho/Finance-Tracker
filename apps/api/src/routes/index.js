const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const transactionRoutes = require('./transaction.routes');
const budgetRoutes = require('./budget.routes');
const categoryRoutes = require('./category.routes');
const analyticsRoutes = require('./analytics.routes');

const router = express.Router();

/**
 * API Route Aggregator
 * Mounts all domain-specific routes under /api prefix
 */

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FinTrack API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/categories', categoryRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
