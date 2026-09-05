const logger = require('../utils/logger');

const SLOW_THRESHOLD_MS = parseInt(process.env.SLOW_THRESHOLD_MS, 10) || 200;

const latencyMiddleware = (req, res, next) => {
  const start = process.hrtime.bigint();
  const originalEnd = res.end;
  res.end = function (...args) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    res.setHeader('X-Response-Time', durationMs.toFixed(2));
    if (durationMs > SLOW_THRESHOLD_MS) {
      logger.warn({ cid: req.correlationId, durationMs: durationMs.toFixed(2), threshold: SLOW_THRESHOLD_MS, method: req.method, url: req.url }, 'Slow response detected');
    }
    return originalEnd.apply(res, args);
  };
  next();
};

module.exports = latencyMiddleware;
