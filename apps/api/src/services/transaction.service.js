const { db, admin } = require('../config/firebase');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');

const COLLECTION = 'transactions';

/**
 * Get transactions with filtering, search, and pagination
 */
const getTransactions = async (userId, queryParams) => {
  const { page, limit } = parsePagination(queryParams);

  // Fetch ALL transactions for this user (single-field query, no composite index needed)
  const snapshot = await db.collection(COLLECTION).where('userId', '==', userId).get();

  // Map docs to plain objects
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

  // Filter by type (in-memory)
  if (queryParams.type && queryParams.type !== 'all') {
    transactions = transactions.filter((tx) => tx.type === queryParams.type);
  }

  // Filter by search query (in-memory)
  if (queryParams.search) {
    const searchLower = queryParams.search.toLowerCase();
    transactions = transactions.filter((tx) => 
      (tx.note && tx.note.toLowerCase().includes(searchLower)) ||
      (tx.categoryName && tx.categoryName.toLowerCase().includes(searchLower))
    );
  }

  // Filter by category (in-memory)
  if (queryParams.categoryId) {
    transactions = transactions.filter((tx) => tx.categoryId === queryParams.categoryId);
  }

  // Filter by date range (in-memory)
  if (queryParams.startDate) {
    const start = new Date(queryParams.startDate).getTime();
    transactions = transactions.filter((tx) => new Date(tx.date).getTime() >= start);
  }
  if (queryParams.endDate) {
    const end = new Date(queryParams.endDate).getTime();
    transactions = transactions.filter((tx) => new Date(tx.date).getTime() <= end);
  }

  // Sort (in-memory)
  const sortBy = queryParams.sortBy || 'date';
  const order = queryParams.order || 'desc';
  transactions.sort((a, b) => {
    const aVal = a[sortBy] instanceof Date ? a[sortBy].getTime() : a[sortBy];
    const bVal = b[sortBy] instanceof Date ? b[sortBy].getTime() : b[sortBy];
    return order === 'desc' ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
  });

  const totalItems = transactions.length;

  // Paginate (in-memory)
  const offset = (page - 1) * limit;
  transactions = transactions.slice(offset, offset + limit);

  const pagination = buildPaginationMeta(page, limit, totalItems);

  return { transactions, pagination };
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
  const transactionData = {
    userId,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    categoryIcon: data.categoryIcon,
    type: data.type,
    amount: Math.abs(data.amount),
    note: data.note || '',
    date: data.date ? new Date(data.date) : new Date(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

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
    'type', 'amount', 'note', 'date',
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
  const startDate = new Date(year, month - 1, 1).getTime();
  const endDate = new Date(year, month, 0, 23, 59, 59, 999).getTime();

  const snapshot = await db
    .collection(COLLECTION)
    .where('userId', '==', userId)
    .get();

  let totalIncome = 0;
  let totalExpense = 0;
  let transactionCount = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const dateValue = (data.date?.toDate?.() || new Date(data.date)).getTime();
    
    if (dateValue >= startDate && dateValue <= endDate) {
      transactionCount++;
      if (data.type === 'income') {
        totalIncome += data.amount;
      } else {
        totalExpense += data.amount;
      }
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
