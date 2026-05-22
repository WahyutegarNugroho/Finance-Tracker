const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (query) => {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) page = 1;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return { page, limit };
};

const buildPaginationMeta = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const buildCursor = (doc, sortBy = 'date') => {
  const data = doc.data();
  const cursor = { id: doc.id };

  if (sortBy === 'amount') {
    cursor.sortValue = data.amount;
    cursor.sortField = 'amount';
    cursor.date = data.date instanceof Date ? data.date.toISOString() : data.date;
  } else {
    cursor.sortValue = data.date instanceof Date ? data.date.toISOString() : data.date;
    cursor.sortField = 'date';
  }

  return cursor;
};

const encodeCursor = (cursor) => {
  if (!cursor) return null;
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
};

const decodeCursor = (encoded) => {
  if (!encoded) return null;
  try {
    return JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
};

const parseCursor = (query) => {
  const cursorStr = query.cursor;
  if (!cursorStr) return {};
  return decodeCursor(cursorStr) || {};
};

module.exports = {
  parsePagination,
  buildPaginationMeta,
  buildCursor,
  encodeCursor,
  decodeCursor,
  parseCursor,
};
