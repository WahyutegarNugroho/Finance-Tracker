import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Latency Middleware', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.SLOW_THRESHOLD_MS = '0';
  });

  it('sets X-Response-Time header', async () => {
    const latencyModule = await import('../../middleware/latency.js');
    const latency = latencyModule.default || latencyModule;
    let captured = null;
    const req = { correlationId: 'test-cid', method: 'GET', url: '/x' };
    const res = {
      setHeader: (k, v) => { if (k === 'X-Response-Time') captured = v; },
      end: function (...args) { return args; },
    };
    const next = () => res.end();
    latency(req, res, next);
    expect(captured).toBeTruthy();
  });

  it('exports a middleware function', async () => {
    const latencyModule = await import('../../middleware/latency.js');
    const latency = latencyModule.default || latencyModule;
    expect(typeof latency).toBe('function');
  });
});