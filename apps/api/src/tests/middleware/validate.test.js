import { describe, it, expect, vi } from 'vitest';

describe('Validate Middleware', () => {
  it('exports validate function', async () => {
    const { validate } = await import('../../middleware/validate.js');
    expect(typeof validate).toBe('function');
  });

  it('returns errors when validation fails', async () => {
    const { body } = await import('express-validator');
    const { validate } = await import('../../middleware/validate.js');

    const req = { body: { email: 'not-an-email' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const middleware = validate([
      body('email').isEmail(),
    ]);

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'Validation Error' })
    );
  });

  it('calls next when validation passes', async () => {
    const { body } = await import('express-validator');
    const { validate } = await import('../../middleware/validate.js');

    const req = { body: { email: 'test@test.com' } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    const next = vi.fn();

    const middleware = validate([
      body('email').isEmail(),
    ]);

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
