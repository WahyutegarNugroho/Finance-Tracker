const SEARCH_RAW_PAGE_SIZE = 100;
const SEARCH_RAW_CAP = 1000;

/**
 * Case-insensitive substring match on note / categoryName
 */
const matchesSearch = (tx, searchTerm) => {
  const lower = String(searchTerm || '').toLowerCase();
  if (!lower) return false;
  return (
    String(tx.note || '').toLowerCase().includes(lower) ||
    String(tx.categoryName || '').toLowerCase().includes(lower)
  );
};

const getDocDate = (value) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value.toDate === 'function') return value.toDate();
  if (value._seconds) return new Date(value._seconds * 1000);
  return new Date(value);
};

/**
 * Evaluate if a document matches query filter criteria
 */
const matchesFilter = (tx, queryParams = {}) => {
  if (queryParams.type && queryParams.type !== 'all' && tx.type !== queryParams.type) {
    return false;
  }
  if (queryParams.categoryId && tx.categoryId !== queryParams.categoryId) {
    return false;
  }
  if (queryParams.startDate) {
    const txDate = getDocDate(tx.date);
    if (txDate < new Date(queryParams.startDate)) return false;
  }
  if (queryParams.endDate) {
    const txDate = getDocDate(tx.date);
    if (txDate > new Date(queryParams.endDate)) return false;
  }
  if (queryParams.search && !matchesSearch(tx, queryParams.search)) {
    return false;
  }
  return true;
};

/**
 * Bounded stream scan for search results.
 * `fetchPage(count)` must return the next `count` raw docs (array of { id, data })
 * in scan order, or null/[] when the stream is exhausted. The caller advances its
 * own Firestore cursor between pages.
 *
 * Returns:
 *  - transactions : page slice (≤ limit)
 *  - nextCursorDoc: last match already returned (startAfter anchor for the next scan), else null
 *  - hasMore      : whether more matches exist after this page
 *  - truncated    : true when the raw scan cap was hit before knowing whether more matches exist
 */
// ponytail: raw-cap scan → dedicated search service (Algolia/Typesense) when account growth matters
async function scanForMatches({ fetchPage, searchTerm, filterFn, limit, pageSize = SEARCH_RAW_PAGE_SIZE, rawCap = SEARCH_RAW_CAP }) {
  const matches = [];
  let hasMore = false;
  let truncated = false;
  let scanned = 0;

  const matchChecker = filterFn || ((data) => matchesSearch(data, searchTerm));

  while (!hasMore && !truncated) {
    const remaining = rawCap - scanned;
    if (remaining <= 0) {
      truncated = true;
      break;
    }

    const page = await fetchPage(Math.min(pageSize, remaining));
    if (!page || page.length === 0) break;

    for (const doc of page) {
      scanned++;
      if (matchChecker(doc.data)) {
        matches.push(doc);
        if (matches.length === limit + 1) {
          hasMore = true;
          break;
        }
      }
    }

    if (scanned >= rawCap) truncated = true;
  }

  return {
    transactions: matches.slice(0, limit),
    nextCursorDoc: hasMore ? matches[limit - 1] : null,
    hasMore,
    truncated,
  };
}

module.exports = { matchesSearch, matchesFilter, scanForMatches, SEARCH_RAW_PAGE_SIZE, SEARCH_RAW_CAP };