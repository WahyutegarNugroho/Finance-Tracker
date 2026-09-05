import { describe, it, expect } from 'vitest';
import { initObservability } from '../lib/observability';

describe('Observability Tracker', () => {
  it('initializes without throwing in DOM environment', () => {
    expect(() => initObservability()).not.toThrow();
  });
});