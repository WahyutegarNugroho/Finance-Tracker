const { db, admin } = require('../config/firebase');
const { parsePagination, encodeCursor, buildCursor } = require('../utils/pagination');

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
    } catch {
      // Invalid cursor, ignore and start from beginning
    }
  }

  const fetchLimit = limit + 1;
  query = query.limit(fetchLimit);

  const snapshot = await query.get();

  let transactions = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate?.() || data.date,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    };
  });

  const hasMore = transactions.length > limit;
  if (hasMore) {
    transactions = transactions.slice(0, limit);
  }

  if (queryParams.search) {
    const searchLower = queryParams.search.toLowerCase();
    transactions = transactions.filter((tx) =>
      (tx.note && tx.note.toLowerCase().includes(searchLower)) ||
      (tx.categoryName && tx.categoryName.toLowerCase().includes(searchLower))
    );
  }

  const nextCursor = hasMore && snapshot.docs.length > 0
    ? encodeCursor(buildCursor(snapshot.docs[limit - 1], sortBy))
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

  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    date: data.date?.toDate?.() || data.date,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  };
};

/**
 * Create a new transaction
 */
const createTransaction = async (userId, data) => {
  // Fetch user's currency for the transaction
  const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
  const userCurrency = userDoc.exists ? (userDoc.data().currency || 'IDR') : 'IDR';

  const transactionData = {
    userId,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    categoryIcon: data.categoryIcon,
    type: data.type,
    amount: Math.abs(data.amount),
    currency: data.currency || userCurrency,
    note: data.note || '',
    date: data.date ? new Date(data.date) : new Date(),
    isRecurring: data.isRecurring || false,
    recurringFrequency: data.recurringFrequency || null,
    recurringEndDate: data.recurringEndDate ? new Date(data.recurringEndDate) : null,
    tags: data.tags || [],
    attachments: data.attachments || [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === 'amount') {
        updateData[field] = Math.abs(data[field]);
      } else if (field === 'date') {
        updateData[field] = new Date(data[field]);
      } else {
        updateData[field] = data[field];
      }
    }
  }

  updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await db.collection(COLLECTION).doc(transactionId).update(updateData);

  const updated = await db.collection(COLLECTION).doc(transactionId).get();
  const updatedData = updated.data();

  return {
    id: updated.id,
    ...updatedData,
    date: updatedData.date?.toDate?.() || updatedData.date,
    createdAt: updatedData.createdAt?.toDate?.() || updatedData.createdAt,
    updatedAt: updatedData.updatedAt?.toDate?.() || updatedData.updatedAt,
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

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};
