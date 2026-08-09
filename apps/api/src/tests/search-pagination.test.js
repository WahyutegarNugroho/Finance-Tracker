import { describe, it, expect } from 'vitest';
import { matchesSearch, scanForMatches } from '../utils/search.js';

function makeDocs(notes) {
  return notes.map((note, i) => ({
    id: `d${String(i + 1).padStart(2, '0')}`,
    data: { note, categoryName: 'Food', amount: 100 + i },
  }));
}

function inMemoryFetcher(docs) {
  let offset = 0;
  return async (count) => {
    if (offset >= docs.length) return null;
    const page = docs.slice(offset, offset + count);
    offset += page.length;
    return page;
  };
}

describe('matchesSearch', () => {
  it('matches note case-insensitively', () => {
    expect(matchesSearch({ note: 'Nasi Goreng', categoryName: '' }, 'goreNG')).toBe(true);
  });

  it('matches categoryName', () => {
    expect(matchesSearch({ note: '', categoryName: 'Transportation' }, 'trans')).toBe(true);
  });

  it('does not match unrelated docs', () => {
    expect(matchesSearch({ note: 'kopi', categoryName: '' }, 'bakso')).toBe(false);
  });
});

describe('scanForMatches', () => {
  const docs = makeDocs(
    Array.from({ length: 60 }, (_, i) => (i < 40 ? `burger deal` : `pizza promo`))
  );
  const LIMIT = 10;

  async function collectAll() {
    const collected = [];
    let nextId = null;
    for (let guard = 0; guard < 20; guard++) {
      const start = nextId === null ? 0 : docs.findIndex((d) => d.id === nextId) + 1;
      const res = await scanForMatches({
        fetchPage: inMemoryFetcher(docs.slice(start)),
        searchTerm: 'burger',
        limit: LIMIT,
      });
      collected.push(...res.transactions.map((d) => d.id));
      if (!res.hasMore) return { collected, res };
      nextId = res.nextCursorDoc.id;
    }
    throw new Error('scan did not terminate');
  }

  it('pages through all 40 matches without loss or duplication', async () => {
    const { collected, res } = await collectAll();
    expect(collected.length).toBe(40);
    expect(new Set(collected).size).toBe(40);
    expect(res.hasMore).toBe(false);
    expect(res.truncated).toBe(false);
  });

  it('keeps the page slice within limit while reporting hasMore', async () => {
    const res = await scanForMatches({
      fetchPage: inMemoryFetcher(docs),
      searchTerm: 'burger',
      limit: LIMIT,
    });
    expect(res.transactions.length).toBe(LIMIT);
    expect(res.hasMore).toBe(true);
    expect(res.nextCursorDoc.id).toBe('d' + String(LIMIT).padStart(2, '0'));
  });

  it('flags truncated when the raw scan cap is hit before finding enough matches', async () => {
    const res = await scanForMatches({
      fetchPage: inMemoryFetcher(makeDocs(Array.from({ length: 25 }, (_, i) => (i % 5 === 0 ? 'kopi' : 'teh')))),
      searchTerm: 'kopi',
      limit: 5,
      rawCap: 12,
    });
    expect(res.transactions.length).toBe(3);
    expect(res.hasMore).toBe(false);
    expect(res.truncated).toBe(true);
  });
});