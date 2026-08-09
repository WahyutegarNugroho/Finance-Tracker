const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (query) => {
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  return { limit };
};

const toDate = (value) => {
  if (value && typeof value.toDate === 'function') return value.toDate();
  return value;
};

const buildCursor = (doc, sortBy = 'date') => {
  const data = typeof doc.data === 'function' ? doc.data() : doc.data;
  const cursor = { id: doc.id };
  const dateValue = toDate(data.date);
  const isoDate = dateValue instanceof Date ? dateValue.toISOString() : dateValue;

  if (sortBy === 'amount') {
    cursor.sortValue = data.amount;
    cursor.sortField = 'amount';
    cursor.date = isoDate;
  } else {
    cursor.sortValue = isoDate;
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
