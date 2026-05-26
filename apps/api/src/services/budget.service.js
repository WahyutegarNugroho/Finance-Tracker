const { db } = require('../config/firebase');
const { serializeDoc, now } = require('../utils/firestore');

const BUDGETS_COLLECTION = 'budgets';
const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Get all budgets for a user in a specific month
 * Calculates spent amount from transactions in real-time
 */
const getDateRangeForPeriod = (period, month, year) => {
  const periodKey = period || 'monthly';
  if (periodKey === 'yearly') {
    return {
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31, 23, 59, 59, 999),
    };
  }
  if (periodKey === 'weekly') {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const weekNumber = Math.ceil(dayOfMonth / 7);
    const startDay = (weekNumber - 1) * 7 + 1;
    const lastDay = new Date(year, month, 0).getDate();
    const endDay = Math.min(weekNumber * 7, lastDay);
    return {
      start: new Date(year, month - 1, startDay),
      end: new Date(year, month - 1, endDay, 23, 59, 59, 999),
    };
  }
  // monthly (default)
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 0, 23, 59, 59, 999),
  };
};

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

  // Determine the widest date range across all budgets based on their period
  const budgetsData = budgetSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  let globalStart = new Date(y, m - 1, 1);
  let globalEnd = new Date(y, m, 0, 23, 59, 59, 999);

  budgetsData.forEach((b) => {
    const range = getDateRangeForPeriod(b.period, m, y);
    if (range.start < globalStart) globalStart = range.start;
    if (range.end > globalEnd) globalEnd = range.end;
  });

  const txSnapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('type', '==', 'expense')
    .where('date', '>=', globalStart)
    .where('date', '<=', globalEnd)
    .get();

  // Calculate spent per budget considering its period date range
  const budgets = budgetsData.map((budget) => {
    const range = getDateRangeForPeriod(budget.period, m, y);
    let spent = 0;

    txSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.categoryId === budget.categoryId) {
        const txDate = data.date?.toDate?.() || new Date(data.date);
        if (txDate >= range.start && txDate <= range.end) {
          spent += data.amount;
        }
      }
    });

    const percentage = budget.limitAmount > 0 ? Math.round((spent / budget.limitAmount) * 100) : 0;

    let status = 'good';
    if (percentage >= 95) status = 'critical';
    else if (percentage >= 75) status = 'warning';

    return {
      id: budget.id,
      ...budget,
      spent,
      remaining: Math.max(0, budget.limitAmount - spent),
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
 * Create a new budget (atomic check+insert via Firestore transaction)
 */
const createBudget = async (userId, data) => {
  const now = new Date();
  const month = data.month || now.getMonth() + 1;
  const year = data.year || now.getFullYear();

  try {
    const result = await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(
        db.collection(BUDGETS_COLLECTION)
          .where('userId', '==', userId)
          .where('categoryId', '==', data.categoryId)
          .where('month', '==', month)
          .where('year', '==', year)
          .limit(1)
      );

      if (!existing.empty) {
        throw new Error('DUPLICATE_BUDGET');
      }

      const budgetData = {
        userId,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        categoryIcon: data.categoryIcon || 'category',
        limitAmount: Math.abs(data.limitAmount),
        period: data.period || 'monthly',
        month,
        year,
        createdAt: now(),
        updatedAt: now(),
      };

      const docRef = db.collection(BUDGETS_COLLECTION).doc();
      transaction.set(docRef, budgetData);

      return { success: true, id: docRef.id, ...budgetData };
    });

    return result;
  } catch (error) {
    if (error.message === 'DUPLICATE_BUDGET') {
      return {
        success: false,
        reason: 'duplicate',
        message: 'A budget for this category already exists this month.',
      };
    }
    throw error;
  }
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

  updateData.updatedAt = now();

  await db.collection(BUDGETS_COLLECTION).doc(budgetId).update(updateData);

  // Return constructed object from original data + updates instead of re-fetching
  return { id: budgetId, ...doc.data(), ...updateData, updatedAt: new Date() };
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
