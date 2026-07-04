import { describe, it, expect } from 'vitest';
import {
  parsePagination,
  buildCursor,
  encodeCursor,
  decodeCursor,
} from '../utils/pagination.js';

describe('Pagination Utils', () => {
  describe('parsePagination', () => {
    it('defaults to limit 10', () => {
      const result = parsePagination({});
      expect(result.limit).toBe(10);
    });

    it('parses valid limit', () => {
      const result = parsePagination({ limit: '25' });
      expect(result.limit).toBe(25);
    });

    it('clamps limit to max 100', () => {
      const result = parsePagination({ limit: '999' });
      expect(result.limit).toBe(100);
    });
  });

  describe('cursor encoding/decoding', () => {
    it('encodes and decodes a cursor', () => {
      const cursor = { sortValue: '2026-05-22T00:00:00.000Z', sortField: 'date', id: 'abc123' };
      const encoded = encodeCursor(cursor);
      expect(encoded).toBeTruthy();
      const decoded = decodeCursor(encoded);
      expect(decoded).toEqual(cursor);
    });

    it('returns null for null/undefined input', () => {
      expect(encodeCursor(null)).toBeNull();
      expect(decodeCursor(null)).toBeNull();
    });

    it('returns null for invalid base64', () => {
      expect(decodeCursor('not-valid-base64!!')).toBeNull();
    });
  });

  describe('buildCursor', () => {
    it('builds cursor from doc (sortBy=date)', () => {
      const doc = {
        id: 'doc1',
        data: () => ({
          date: new Date('2026-05-22'),
          amount: 50000,
        }),
      };
      const cursor = buildCursor(doc, 'date');
      expect(cursor.id).toBe('doc1');
      expect(cursor.sortField).toBe('date');
      expect(cursor.sortValue).toBeTruthy();
    });

    it('builds cursor from doc (sortBy=amount)', () => {
      const doc = {
        id: 'doc2',
        data: () => ({
          date: new Date('2026-05-22'),
          amount: 75000,
        }),
      };
      const cursor = buildCursor(doc, 'amount');
      expect(cursor.id).toBe('doc2');
      expect(cursor.sortField).toBe('amount');
      expect(cursor.sortValue).toBe(75000);
    });
  });

});
