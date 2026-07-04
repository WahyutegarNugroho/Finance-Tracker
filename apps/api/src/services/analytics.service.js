const { db } = require('../config/firebase');
const { fromFirestoreTimestamp, mapSnapshot } = require('../utils/firestore');

const TRANSACTIONS_COLLECTION = 'transactions';

const fromTs = (ts) => fromFirestoreTimestamp(ts);

const computePeriod = (year, month, offset) => ({
  start: new Date(year, month - 1 + offset, 1),
  end: new Date(year, month + offset, 0, 23, 59, 59, 999),
});

/**
 * Dashboard overview data
 * Returns summary cards + recent transactions
 * Optimized: 3 queries instead of 5 (merged current/prev month, removed categories query)
 */
// ponytail: 10k cap → use Firestore aggregation query when users exceed 5k monthly tx
const getDashboardOverview = async (userId) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { start: startOfMonth, end: endOfMonth } = computePeriod(currentYear, currentMonth, 0);
  const { start: startOfPrevMonth } = computePeriod(currentYear, currentMonth, -1);

  // Single query spanning both months — split client-side (saves 1 read)
  const bothSnapshots = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('date', '>=', startOfPrevMonth)
    .where('date', '<=', endOfMonth)
    .orderBy('date', 'desc')
    .limit(10000)
    .get();

  let currentIncome = 0;
  let currentExpense = 0;
  let prevIncome = 0;
  let prevExpense = 0;

  bothSnapshots.docs.forEach((doc) => {
    const data = doc.data();
    const txDate = fromTs(data.date);
    const isCurrent = txDate >= startOfMonth;

    if (isCurrent) {
      if (data.type === 'income') currentIncome += data.amount;
      else currentExpense += data.amount;
    } else {
      if (data.type === 'income') prevIncome += data.amount;
      else prevExpense += data.amount;
    }
  });

  // ponytail: toFixed→parseFloat round-trip → Math.round(n * 10) / 10 for one-decimal rounding
  // Percentage changes
  const incomeChange = prevIncome > 0
    ? (((currentIncome - prevIncome) / prevIncome) * 100).toFixed(1)
    : 0;
  const expenseChange = prevExpense > 0
    ? (((currentExpense - prevExpense) / prevExpense) * 100).toFixed(1)
    : 0;

  const currentBalance = currentIncome - currentExpense;
  const prevBalance = prevIncome - prevExpense;
  const balanceChange = prevBalance !== 0
    ? (((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100).toFixed(1)
    : 0;

  // Derive recent 5 from the main snapshot (already sorted desc by date with limit)
  const recentTransactions = mapSnapshot(bothSnapshots).slice(0, 5);

  const getColorForCategory = (name) => {
    const idx = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 10;
    return ['#4648d4', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#6366f1', '#ef4444', '#c7c4d7', '#006c49'][idx];
  };

  // Build category spending from current month transactions
  const categoryMap = {};
  bothSnapshots.docs.forEach((doc) => {
    const data = doc.data();
    const txDate = fromTs(data.date);
    if (txDate >= startOfMonth && data.type === 'expense') {
      if (!categoryMap[data.categoryId]) {
        categoryMap[data.categoryId] = {
          name: data.categoryName,
          amount: 0,
          color: data.categoryColor || getColorForCategory(data.categoryName),
        };
      }
      categoryMap[data.categoryId].amount += data.amount;
    }
  });

  // Get budget summary (parallel)
  const budgetSnapshot = await db
    .collection('budgets')
    .where('userId', '==', userId)
    .where('month', '==', currentMonth)
    .where('year', '==', currentYear)
    .get();

  let totalBudgetLimit = 0;
  budgetSnapshot.docs.forEach((doc) => {
    totalBudgetLimit += doc.data().limitAmount;
  });

  const budgetUsage = totalBudgetLimit > 0
    ? Math.round((currentExpense / totalBudgetLimit) * 100)
    : 0;

  const expenseByCategory = Object.values(categoryMap)
    .map(cat => ({
      ...cat,
      percentage: currentExpense > 0 ? Math.round((cat.amount / currentExpense) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    balance: currentIncome - currentExpense,
    balanceChange: parseFloat(balanceChange),
    income: currentIncome,
    incomeChange: parseFloat(incomeChange),
    expense: currentExpense,
    expenseChange: parseFloat(expenseChange),
    budgetUsage,
    budgetLimit: totalBudgetLimit,
    recentTransactions,
    expenseByCategory,
    month: currentMonth,
    year: currentYear,
  };
};

/**
 * Cash flow data for chart (income vs expense by month)
 */
// ponytail: 10k cap → aggregate monthly sub-queries when tx count exceeds 5k
const getCashFlow = async (userId, months = 6) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const snapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('date', '>=', startDate)
    .orderBy('date', 'asc')
    .limit(10000)
    .get();

  const monthlyData = {};

  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    // ponytail: server-side month names → return month index only, format on client via Intl
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthlyData[key] = {
      month: key,
      label: monthNames[date.getMonth()],
      income: 0,
      expense: 0,
    };
  }

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const date = fromTs(data.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (monthlyData[key]) {
      if (data.type === 'income') {
        monthlyData[key].income += data.amount;
      } else {
        monthlyData[key].expense += data.amount;
      }
    }
  });

  return Object.values(monthlyData);
};

/**
 * Spending breakdown by category for a month
 */
const getCategoryBreakdown = async (userId, month, year) => {
  const now = new Date();
  const m = month || now.getMonth() + 1;
  const y = year || now.getFullYear();

  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);

  const snapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('type', '==', 'expense')
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .get();

  const categoryMap = {};
  let totalExpense = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    totalExpense += data.amount;
    const catId = data.categoryId;

    if (!categoryMap[catId]) {
      categoryMap[catId] = {
        categoryId: catId,
        categoryName: data.categoryName,
        categoryIcon: data.categoryIcon,
        amount: 0,
        count: 0,
      };
    }

    categoryMap[catId].amount += data.amount;
    categoryMap[catId].count++;
  });

  const categories = Object.values(categoryMap)
    .map((cat) => ({
      ...cat,
      percentage: totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    categories,
    totalExpense,
    month: m,
    year: y,
  };
};

/**
 * Year-over-year trends comparison
 */
// ponytail: 20k cap → paginated year-by-year queries when tx/year exceeds 10k
const getTrends = async (userId) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const prevYear = currentYear - 1;

  const startOfPrevYear = new Date(prevYear, 0, 1);
  const endOfCurrentYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

  const snapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('date', '>=', startOfPrevYear)
    .where('date', '<=', endOfCurrentYear)
    .orderBy('date', 'asc')
    .limit(20000)
    .get();

  let currentYearIncome = 0;
  let currentYearExpense = 0;
  let currentYearMonths = 0;
  let prevYearIncome = 0;
  let prevYearExpense = 0;
  let prevYearMonths = 0;

  const monthsSeen = { current: new Set(), prev: new Set() };

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const date = fromTs(data.date);
    const yr = date.getFullYear();
    const mo = date.getMonth();

    if (yr === currentYear) {
      monthsSeen.current.add(mo);
      if (data.type === 'income') currentYearIncome += data.amount;
      else currentYearExpense += data.amount;
    } else if (yr === prevYear) {
      monthsSeen.prev.add(mo);
      if (data.type === 'income') prevYearIncome += data.amount;
      else prevYearExpense += data.amount;
    }
  });

  currentYearMonths = monthsSeen.current.size || 1;
  prevYearMonths = monthsSeen.prev.size || 1;

  const avgCurrentIncome = currentYearIncome / currentYearMonths;
  const avgCurrentExpense = currentYearExpense / currentYearMonths;
  const avgPrevIncome = prevYearIncome / prevYearMonths;
  const avgPrevExpense = prevYearExpense / prevYearMonths;

  return {
    currentYear: {
      year: currentYear,
      totalIncome: currentYearIncome,
      totalExpense: currentYearExpense,
      avgIncome: Math.round(avgCurrentIncome),
      avgExpense: Math.round(avgCurrentExpense),
      savings: currentYearIncome - currentYearExpense,
    },
    previousYear: {
      year: prevYear,
      totalIncome: prevYearIncome,
      totalExpense: prevYearExpense,
      avgIncome: Math.round(avgPrevIncome),
      avgExpense: Math.round(avgPrevExpense),
      savings: prevYearIncome - prevYearExpense,
    },
    changes: {
      incomeChange: avgPrevIncome > 0
        ? parseFloat((((avgCurrentIncome - avgPrevIncome) / avgPrevIncome) * 100).toFixed(1))
        : 0,
      expenseChange: avgPrevExpense > 0
        ? parseFloat((((avgCurrentExpense - avgPrevExpense) / avgPrevExpense) * 100).toFixed(1))
        : 0,
      savingsChange: avgPrevIncome - avgPrevExpense !== 0
        ? parseFloat(((((avgCurrentIncome - avgCurrentExpense) - (avgPrevIncome - avgPrevExpense)) / Math.abs(avgPrevIncome - avgPrevExpense)) * 100).toFixed(1))
        : 0,
    },
  };
};

module.exports = {
  getDashboardOverview,
  getCashFlow,
  getCategoryBreakdown,
  getTrends,
};
