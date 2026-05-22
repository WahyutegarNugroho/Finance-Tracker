const { db } = require('../config/firebase');

const TRANSACTIONS_COLLECTION = 'transactions';

/**
 * Dashboard overview data
 * Returns summary cards + recent transactions
 */
const getDashboardOverview = async (userId) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

  const startOfPrevMonth = new Date(currentYear, currentMonth - 2, 1);
  const endOfPrevMonth = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59, 999);

  // Fetch only current month transactions
  const currentSnapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('date', '>=', startOfMonth)
    .where('date', '<=', endOfMonth)
    .get();

  const currentMonthTx = currentSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate?.() || new Date(data.date),
    };
  });

  // Fetch only previous month transactions
  const prevSnapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('date', '>=', startOfPrevMonth)
    .where('date', '<=', endOfPrevMonth)
    .get();

  const prevMonthTx = prevSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate?.() || new Date(data.date),
    };
  });

  let currentIncome = 0;
  let currentExpense = 0;
  currentMonthTx.forEach((tx) => {
    if (tx.type === 'income') currentIncome += tx.amount;
    else currentExpense += tx.amount;
  });

  let prevIncome = 0;
  let prevExpense = 0;
  prevMonthTx.forEach((tx) => {
    if (tx.type === 'income') prevIncome += tx.amount;
    else prevExpense += tx.amount;
  });

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

  // Get recent transactions (last 5) — server-side limit
  const recentSnapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('date', 'desc')
    .limit(5)
    .get();

  const recentTransactions = recentSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate?.() || new Date(data.date),
    };
  });

  // Get budget summary
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

  // Load category colors from Firestore
  const categorySnapshot = await db
    .collection('categories')
    .where('userId', '==', userId)
    .get();
  const categoryColorMap = {};
  categorySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    categoryColorMap[doc.id] = data.color || '#4648d4';
  });

  // Calculate category breakdown for current month
  const categoryMap = {};
  
  currentMonthTx.forEach((tx) => {
    if (tx.type === 'expense') {
      if (!categoryMap[tx.categoryId]) {
        categoryMap[tx.categoryId] = {
          name: tx.categoryName,
          amount: 0,
          color: categoryColorMap[tx.categoryId] || tx.categoryColor || '#4648d4'
        };
      }
      categoryMap[tx.categoryId].amount += tx.amount;
    }
  });

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
const getCashFlow = async (userId, months = 6) => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const snapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .where('date', '>=', startDate)
    .orderBy('date', 'asc')
    .get();

  const monthlyData = {};

  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
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
    const date = data.date?.toDate?.() || new Date(data.date);
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

    if (!categoryMap[data.categoryId]) {
      categoryMap[data.categoryId] = {
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        categoryIcon: data.categoryIcon,
        amount: 0,
        count: 0,
      };
    }

    categoryMap[data.categoryId].amount += data.amount;
    categoryMap[data.categoryId].count++;
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
    const date = data.date?.toDate?.() || new Date(data.date);
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
