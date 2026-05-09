const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ───
app.use(helmet());

// ─── CORS Configuration ───
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging ───
app.use(morgan('dev'));

// ─── API Routes ───
app.use('/api', routes);

// ─── Root Route ───
app.get('/', (req, res) => {
  res.json({
    name: 'FinTrack API',
    version: '1.0.0',
    description: 'Backend API for FinTrack Finance Tracker',
    docs: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        google: 'POST /api/auth/google',
        me: 'GET /api/auth/me',
      },
      transactions: {
        list: 'GET /api/transactions',
        create: 'POST /api/transactions',
        get: 'GET /api/transactions/:id',
        update: 'PUT /api/transactions/:id',
        delete: 'DELETE /api/transactions/:id',
        summary: 'GET /api/transactions/summary',
      },
      budgets: {
        list: 'GET /api/budgets',
        create: 'POST /api/budgets',
        update: 'PUT /api/budgets/:id',
        delete: 'DELETE /api/budgets/:id',
        summary: 'GET /api/budgets/summary',
      },
      categories: {
        list: 'GET /api/categories',
        create: 'POST /api/categories',
        update: 'PUT /api/categories/:id',
        delete: 'DELETE /api/categories/:id',
      },
      analytics: {
        overview: 'GET /api/analytics/overview',
        cashflow: 'GET /api/analytics/cashflow',
        categories: 'GET /api/analytics/categories',
        trends: 'GET /api/analytics/trends',
      },
      users: {
        profile: 'GET /api/users/profile',
        update: 'PUT /api/users/profile',
      },
    },
  });
});

// ─── 404 Handler ───
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ───
app.use(errorHandler);

// ─── Start Server ───
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║       🚀 FinTrack API Server             ║');
  console.log('╠══════════════════════════════════════════╣');
  console.log(`║  Local:  http://localhost:${PORT}            ║`);
  console.log(`║  Health: http://localhost:${PORT}/api/health  ║`);
  console.log('║  Env:    ' + (process.env.NODE_ENV || 'development') + '                     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
