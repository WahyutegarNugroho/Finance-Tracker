const { db, admin } = require('../config/firebase');

const BUDGETS_COLLECTION = 'budgets';
const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Get all budgets for a user in a specific month
 * Calculates spent amount from transactions in real-time
 */
const getBudgets = async (userId, month, year) => {
  // Default to current month/year
  const now = new Date();
  const m = month || now.getMonth() + 1;
  const y = year || now.getFullYear();

  // Get budgets
  const budgetSnapshot = await db
    .collection(BUDGETS_COLLECTION)
    .where('userId', '==', userId)
    .where('month', '==', m)
    .where('year', '==', y)
    .get();

  if (budgetSnapshot.empty) {
    return [];
  }

  // Get all transactions for this month to calculate spent (filtered in memory to avoid composite index)
  const startDate = new Date(y, m - 1, 1).getTime();
  const endDate = new Date(y, m, 0, 23, 59, 59, 999).getTime();

  const txSnapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .get();

  // Build category-to-spent map
  const spentByCategory = {};
  txSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const dateValue = (data.date?.toDate?.() || new Date(data.date)).getTime();
    
    if (data.type === 'expense' && dateValue >= startDate && dateValue <= endDate) {
      if (!spentByCategory[data.categoryId]) {
        spentByCategory[data.categoryId] = 0;
      }
      spentByCategory[data.categoryId] += data.amount;
    }
  });

  // Combine budget data with spent amounts
  const budgets = budgetSnapshot.docs.map((doc) => {
    const data = doc.data();
    const spent = spentByCategory[data.categoryId] || 0;
    const percentage = data.limitAmount > 0 ? Math.round((spent / data.limitAmount) * 100) : 0;

    let status = 'good';
    if (percentage >= 95) status = 'critical';
    else if (percentage >= 75) status = 'warning';

    return {
      id: doc.id,
      ...data,
      spent,
      remaining: Math.max(0, data.limitAmount - spent),
      percentage,
      status,
    };
  });

  return budgets;
};

/**
 * Get overall budget summary for a month
 */
const getBudgetSummary = async (userId, month, year) => {
  const budgets = await getBudgets(userId, month, year);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return {
    totalBudget,
    totalSpent,
    totalRemaining,
    overallPercentage,
    categoryCount: budgets.length,
    month: month || new Date().getMonth() + 1,
    year: year || new Date().getFullYear(),
  };
};

/**
 * Create a new budget
 */
const createBudget = async (userId, data) => {
  const now = new Date();

  // Check if budget already exists for this category + month
  const existing = await db
    .collection(BUDGETS_COLLECTION)
    .where('userId', '==', userId)
    .where('categoryId', '==', data.categoryId)
    .where('month', '==', data.month || now.getMonth() + 1)
    .where('year', '==', data.year || now.getFullYear())
    .limit(1)
    .get();

  if (!existing.empty) {
    return {
      success: false,
      reason: 'duplicate',
      message: 'A budget for this category already exists this month.',
    };
  }

  const budgetData = {
    userId,
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    categoryIcon: data.categoryIcon || 'category',
    limitAmount: Math.abs(data.limitAmount),
    period: data.period || 'monthly',
    month: data.month || now.getMonth() + 1,
    year: data.year || now.getFullYear(),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const docRef = await db.collection(BUDGETS_COLLECTION).add(budgetData);

  return { success: true, id: docRef.id, ...budgetData };
};

/**
 * Update a budget
 */
const updateBudget = async (userId, budgetId, data) => {
  const doc = await db.collection(BUDGETS_COLLECTION).doc(budgetId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return null;
  }

  const allowedFields = ['limitAmount', 'categoryId', 'categoryName', 'categoryIcon', 'period'];
  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === 'limitAmount') {
        updateData[field] = Math.abs(data[field]);
      } else {
        updateData[field] = data[field];
      }
    }
  }

  updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  await db.collection(BUDGETS_COLLECTION).doc(budgetId).update(updateData);

  const updated = await db.collection(BUDGETS_COLLECTION).doc(budgetId).get();
  return { id: updated.id, ...updated.data() };
};

/**
 * Delete a budget
 */
const deleteBudget = async (userId, budgetId) => {
  const doc = await db.collection(BUDGETS_COLLECTION).doc(budgetId).get();

  if (!doc.exists || doc.data().userId !== userId) {
    return false;
  }

  await db.collection(BUDGETS_COLLECTION).doc(budgetId).delete();
  return true;
};

module.exports = {
  getBudgets,
  getBudgetSummary,
  createBudget,
  updateBudget,
  deleteBudget,
};
