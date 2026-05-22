import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock rate-limit before importing
vi.mock('express-rate-limit', () => {
  return {
    default: (_options) => {
      return (req, res, next) => {
        next();
      };
    },
  };
});

describe('Rate Limiter Middleware', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports globalLimiter, authLimiter, resetLimiter', async () => {
    const rateLimiter = await import('../../middleware/rateLimiter.js');
    expect(rateLimiter).toHaveProperty('globalLimiter');
    expect(rateLimiter).toHaveProperty('authLimiter');
    expect(rateLimiter).toHaveProperty('resetLimiter');
  });

  it('globalLimiter is a function (middleware)', async () => {
    const rateLimiter = await import('../../middleware/rateLimiter.js');
    expect(typeof rateLimiter.globalLimiter).toBe('function');
  });

  it('authLimiter has a different config from globalLimiter', async () => {
    const rateLimiter = await import('../../middleware/rateLimiter.js');
    // They should be different middleware instances
    expect(rateLimiter.globalLimiter).not.toBe(rateLimiter.authLimiter);
  });
});
