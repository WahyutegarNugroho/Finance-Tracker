const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss' } }
    : undefined,
  serializers: {
    req: (req) => ({ method: req.method, url: req.url, cid: req.correlationId }),
    err: (err) => ({ message: err.message, stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined }),
  },
});

module.exports = logger;
