const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (query) => {
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return { limit };
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

module.exports = {
  parsePagination,
  buildCursor,
  encodeCursor,
};
