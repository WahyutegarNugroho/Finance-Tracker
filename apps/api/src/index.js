const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL environment variable is required in production.');
}

// ─── Security Middleware ───
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://lh3.googleusercontent.com", "https://firebasestorage.googleapis.com"],
      connectSrc: ["'self'", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ─── Global Rate Limiter ───
app.use(globalLimiter);

// ─── CORS Configuration ───
app.use(
  cors({
    // ponytail: hardcoded CORS fallback → require FRONTEND_URL env in production startup check
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Body Parsing ───
app.use(express.json({ limit: '1mb' }));

// ─── Correlation ID Middleware ───
app.use((req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || crypto.randomUUID();
  res.setHeader('X-Correlation-Id', req.correlationId);
  next();
});

// ─── Request Logging ───
morgan.token('cid', (req) => req.correlationId || '-');
app.use(morgan(':method :url :status :response-time ms - :cid', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// ─── API Routes ───
app.use('/api', routes);

// ─── Root Route ───
app.get('/', (req, res) => {
  res.json({ name: 'FinTrack API', version: '1.0.0' });
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
  logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'FinTrack API server started');
});

module.exports = app;
