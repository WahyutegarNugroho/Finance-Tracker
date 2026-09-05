import { describe, it, expect } from 'vitest';
import { cleanAmount, formatAmount, formatDate, getAvatarUrl } from '../lib/formatting';

describe('Formatting Utils', () => {
  it('cleanAmount removes non-digits for IDR', () => {
    expect(cleanAmount('100.000', 'IDR')).toBe('100000');
    expect(cleanAmount('abc50000', 'IDR')).toBe('50000');
  });

  it('cleanAmount preserves decimal point for USD', () => {
    expect(cleanAmount('123.45', 'USD')).toBe('123.45');
    expect(cleanAmount('123,45', 'USD')).toBe('123.45');
  });

  it('formatAmount formats with appropriate separators', () => {
    expect(formatAmount('1000000', 'IDR')).toBe('1.000.000');
    expect(formatAmount('1000.5', 'USD')).toBe('1,000.5');
  });

  it('formatDate formats date string properly', () => {
    const res = formatDate('2026-09-05T00:00:00.000Z', 'en');
    expect(res).toBeTruthy();
    expect(typeof res).toBe('string');
  });

  it('getAvatarUrl generates valid data URL', () => {
    const url = getAvatarUrl('John Doe');
    expect(url.startsWith('data:image/svg+xml;base64,')).toBe(true);
  });
});