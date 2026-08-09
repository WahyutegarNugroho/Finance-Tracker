const { db } = require('../config/firebase');
const { serializeDoc, mapSnapshot, now, fromFirestoreTimestamp } = require('../utils/firestore');
const { parsePagination, encodeCursor, buildCursor } = require('../utils/pagination');
const { scanForMatches } = require('../utils/search');
const { calculateNextRecurringDate } = require('../utils/recurring');
const logger = require('../utils/logger');

const COLLECTION = 'transactions';
const USERS_COLLECTION = 'users';
const TX_DATE_FIELDS = ['date', 'createdAt', 'updatedAt'];

/**
 * Get transactions with server-side filtering, search, and cursor-based pagination
 */
const getTransactions = async (userId, queryParams) => {
  const { limit } = parsePagination(queryParams);

  let query = db.collection(COLLECTION).where('userId', '==', userId);

  if (queryParams.type && queryParams.type !== 'all') {
    query = query.where('type', '==', queryParams.type);
  }

  if (queryParams.categoryId) {
    query = query.where('categoryId', '==', queryParams.categoryId);
  }

  if (queryParams.startDate) {
    query = query.where('date', '>=', new Date(queryParams.startDate));
  }

  if (queryParams.endDate) {
    query = query.where('date', '<=', new Date(queryParams.endDate));
  }

  const order = queryParams.order === 'asc' ? 'asc' : 'desc';
  const sortBy = queryParams.sortBy === 'amount' ? 'amount' : 'date';
  query = query.orderBy(sortBy, order).orderBy('__name__', order);

  if (queryParams.cursor) {
    try {
      const cursor = JSON.parse(Buffer.from(queryParams.cursor, 'base64').toString('utf8'));
      if (cursor.sortValue !== undefined && cursor.id) {
        const sortValue = sortBy === 'amount' ? Number(cursor.sortValue) : new Date(cursor.sortValue);
        query = query.startAfter(sortValue, cursor.id);
      }
    } catch (decodeError) {
      logger.warn({ err: decodeError, cursor: queryParams.cursor }, 'Invalid cursor — resetting to start');
    }
  }

  const searchTerm = queryParams.search ? String(queryParams.search) : '';
  if (searchTerm) {
    return findTransactionsWithSearch(query, limit, sortBy, searchTerm);
  }

  const snapshot = await query.limit(limit + 1).get();

  let transactions = mapSnapshot(snapshot);

  const hasMore = transactions.length > limit;
  if (hasMore) {
    transactions = transactions.slice(0, limit);
  }

  const nextCursor = hasMore && snapshot.docs.length > 0
    ? encodeCursor(buildCursor(
        snapshot.docs.find(d => d.id === transactions[limit - 1]?.id) || snapshot.docs[snapshot.docs.length - 1],
        sortBy
      ))
    : null;

  return {
    transactions,
    pagination: { hasMore, nextCursor, itemsPerPage: limit },
  };
};

/**
 * Search + cursor-paginate by scanning raw Firestore pages until enough matches
 * are found (bounded by SCAN cap) — substring search has no native Firestore query.
 */
const findTransactionsWithSearch = async (baseQuery, limit, sortBy, searchTerm) => {
  let query = baseQuery;

  const result = await scanForMatches({
    searchTerm,
    limit,
    fetchPage: async (count) => {
      const snapshot = await query.limit(count).get();
      if (snapshot.empty) return null;
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
      query = query.startAfter(snapshot.docs[snapshot.docs.length - 1]);
      return docs;
    },
  });

  const transactions = result.transactions.map(({ id, data }) => {
    const doc = { id, ...data };
    for (const field of TX_DATE_FIELDS) {
      if (doc[field] !== undefined) doc[field] = fromFirestoreTimestamp(doc[field]);
    }
    return doc;
  });

  const nextCursor = result.nextCursorDoc
    ? encodeCursor(buildCursor(result.nextCursorDoc, sortBy))
    : null;

  return {
    transactions,
    pagination: {
      hasMore: result.hasMore,
      nextCursor,
      itemsPerPage: limit,
      ...(result.truncated ? { searchTruncated: true } : {}),
    },
  };
};

/**
 * Get a single transaction by ID
 */
const getTransactionById = async (userId, transactionId) => {
  const doc = await db.collection(COLLECTION).doc(transactionId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return null;
  }

  return serializeDoc(doc);
};

/**
 * Create a new transaction
 */
const createTransaction = async (userId, data) => {
  // Fetch user's currency for the transaction
  const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
  const userCurrency = userDoc.exists ? (userDoc.data().currency || 'IDR') : 'IDR';

  if (data.amount < 0) {
    throw new Error('Amount must be a positive number.');
  }
  const transactionData = {
    userId,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    categoryIcon: data.categoryIcon,
    type: data.type,
    amount: data.amount,
    currency: data.currency || userCurrency,
    note: data.note || '',
    date: data.date ? new Date(data.date) : new Date(),
    isRecurring: data.isRecurring || false,
    recurringFrequency: data.recurringFrequency || null,
    recurringEndDate: data.recurringEndDate ? new Date(data.recurringEndDate) : null,
    tags: data.tags || [],
    attachments: data.attachments || [],
    createdAt: now(),
    updatedAt: now(),
  };

  if (data.isRecurring && data.recurringFrequency) {
    transactionData.recurringNextDate = calculateNextRecurringDate(
      transactionData.date,
      data.recurringFrequency
    );
  }

  const docRef = await db.collection(COLLECTION).add(transactionData);

  return {
    id: docRef.id,
    ...transactionData,
  };
};

/**
 * Update a transaction
 */
const updateTransaction = async (userId, transactionId, data) => {
  const doc = await db.collection(COLLECTION).doc(transactionId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return null;
  }

  const allowedFields = [
    'categoryId', 'categoryName', 'categoryIcon',
    'type', 'amount', 'note', 'date', 'currency',
    'isRecurring', 'recurringFrequency', 'recurringEndDate',
    'tags', 'attachments',
  ];

  const updateData = {};

  if (data.amount !== undefined && data.amount < 0) {
    throw new Error('Amount must be a positive number.');
  }
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === 'amount') {
        updateData[field] = data[field];
      } else if (field === 'date') {
        updateData[field] = new Date(data[field]);
      } else {
        updateData[field] = data[field];
      }
    }
  }

  updateData.updatedAt = now();

  await db.collection(COLLECTION).doc(transactionId).update(updateData);

  // Construct response from original data + updates instead of re-fetching (saves 1 read)
  return {
    id: transactionId,
    ...doc.data(),
    ...updateData,
    date: updateData.date || (doc.data().date?.toDate?.() || doc.data().date),
    updatedAt: new Date(),
  };
};

/**
 * Delete a transaction
 */
const deleteTransaction = async (userId, transactionId) => {
  const doc = await db.collection(COLLECTION).doc(transactionId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return false;
  }

  await db.collection(COLLECTION).doc(transactionId).delete();
  return true;
};

/**
 * Get transaction summary for a specific month
 * Returns total income, total expense, and transaction count
 */
const getTransactionSummary = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const snapshot = await db
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .get();

  let totalIncome = 0;
  let totalExpense = 0;
  let transactionCount = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    transactionCount++;
    if (data.type === 'income') {
      totalIncome += data.amount;
    } else {
      totalExpense += data.amount;
    }
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount,
    month,
    year,
  };
};

/**
 * Batch create transactions
 * Uses Firestore batch write for atomic creation (max 500)
 */
const batchCreateTransactions = async (userId, transactionsData) => {
  const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
  const userCurrency = userDoc.exists ? (userDoc.data().currency || 'IDR') : 'IDR';

  if (transactionsData.length > 500) {
    throw new Error('Batch size exceeds Firestore limit of 500 operations.');
  }

  const batch = db.batch();
  const created = [];

  for (const tx of transactionsData) {
    const docRef = db.collection(COLLECTION).doc();
    if (tx.amount < 0) {
      throw new Error('Amount must be a positive number.');
    }
    const data = {
      userId,
      categoryId: tx.categoryId,
      categoryName: tx.categoryName,
      categoryIcon: tx.categoryIcon || '',
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency || userCurrency,
      note: tx.note || '',
      date: tx.date ? new Date(tx.date) : new Date(),
      isRecurring: tx.isRecurring || false,
      recurringFrequency: tx.recurringFrequency || null,
      recurringEndDate: tx.recurringEndDate ? new Date(tx.recurringEndDate) : null,
      tags: tx.tags || [],
      attachments: tx.attachments || [],
      createdAt: now(),
      updatedAt: now(),
    };

    if (tx.isRecurring && tx.recurringFrequency) {
      data.recurringNextDate = calculateNextRecurringDate(
        data.date,
        tx.recurringFrequency
      );
    }

    batch.set(docRef, data);
    created.push({ id: docRef.id, ...data });
  }

  await batch.commit();
  return created;
};

const batchDeleteTransactions = async (userId, ids) => {
  // ponytail: unbounded batch delete → chunk into 500-doc batches when max ID list exceeds 500
  const refs = ids.map(id => db.collection(COLLECTION).doc(id));
  const docs = await db.getAll(...refs);
  const batch = db.batch();
  let deletedCount = 0;

  docs.forEach((doc) => {
    if (doc.exists && doc.data().userId === userId) {
      batch.delete(doc.ref);
      deletedCount++;
    }
  });

  if (deletedCount > 0) {
    await batch.commit();
  }
  return deletedCount;
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  batchCreateTransactions,
  batchDeleteTransactions,
};
