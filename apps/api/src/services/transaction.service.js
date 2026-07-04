const { db } = require('../config/firebase');
const { serializeDoc, mapSnapshot, now } = require('../utils/firestore');
const { parsePagination, encodeCursor, buildCursor } = require('../utils/pagination');
const logger = require('../utils/logger');

const COLLECTION = 'transactions';
const USERS_COLLECTION = 'users';

const calculateNextRecurringDate = (fromDate, frequency) => {
  const date = new Date(fromDate);
  switch (frequency) {
    case 'daily': date.setDate(date.getDate() + 1); break;
    case 'weekly': date.setDate(date.getDate() + 7); break;
    case 'monthly': date.setMonth(date.getMonth() + 1); break;
    case 'yearly': date.setFullYear(date.getFullYear() + 1); break;
  }
  return date;
};

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

  // ponytail: 2x multiplier → add dedicated search service (Algolia/Typesense) when search precision matters
  const searchMultiplier = queryParams.search ? 2 : 1;
  const fetchLimit = (limit + 1) * searchMultiplier;
  query = query.limit(fetchLimit);

  const snapshot = await query.get();

  let transactions = mapSnapshot(snapshot);

  // Apply search filter before pagination to ensure correct hasMore detection
  if (queryParams.search) {
    const searchLower = queryParams.search.toLowerCase();
    transactions = transactions.filter((tx) =>
      (tx.note && tx.note.toLowerCase().includes(searchLower)) ||
      (tx.categoryName && tx.categoryName.toLowerCase().includes(searchLower))
    );
  }

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
