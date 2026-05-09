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

  // Current month date range
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1).getTime();
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999).getTime();

  // Previous month date range (for comparison)
  const startOfPrevMonth = new Date(currentYear, currentMonth - 2, 1).getTime();
  const endOfPrevMonth = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59, 999).getTime();

  // Get ALL transactions for user to filter in-memory (avoids composite index)
  const allSnapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .get();

  const allTx = allSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dateValue: (data.date?.toDate?.() || new Date(data.date)).getTime(),
      dateObj: data.date?.toDate?.() || new Date(data.date),
    };
  });

  // Calculate current month totals
  let currentIncome = 0;
  let currentExpense = 0;
  const currentMonthTx = allTx.filter(tx => tx.dateValue >= startOfMonth && tx.dateValue <= endOfMonth);
  currentMonthTx.forEach((tx) => {
    if (tx.type === 'income') currentIncome += tx.amount;
    else currentExpense += tx.amount;
  });

  // Calculate previous month totals
  let prevIncome = 0;
  let prevExpense = 0;
  const prevMonthTx = allTx.filter(tx => tx.dateValue >= startOfPrevMonth && tx.dateValue <= endOfPrevMonth);
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

  // Get recent transactions (last 5)
  const recentTransactions = allTx
    .sort((a, b) => b.dateValue - a.dateValue)
    .slice(0, 5)
    .map(tx => ({ ...tx, date: tx.dateObj }));

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

  // Calculate category breakdown for current month
  const categoryMap = {};
  currentMonthTx.forEach((tx) => {
    if (tx.type === 'expense') {
      if (!categoryMap[tx.categoryId]) {
        categoryMap[tx.categoryId] = {
          name: tx.categoryName,
          amount: 0,
          color: tx.categoryColor || '#4648d4'
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
  const startDateValue = new Date(now.getFullYear(), now.getMonth() - months + 1, 1).getTime();

  const snapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .get();

  // Group by month
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
    
    if (date.getTime() >= startDateValue) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyData[key]) {
        if (data.type === 'income') {
          monthlyData[key].income += data.amount;
        } else {
          monthlyData[key].expense += data.amount;
        }
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

  const startDateValue = new Date(y, m - 1, 1).getTime();
  const endDateValue = new Date(y, m, 0, 23, 59, 59, 999).getTime();

  const snapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
    .get();

  // Group by category
  const categoryMap = {};
  let totalExpense = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const dateValue = (data.date?.toDate?.() || new Date(data.date)).getTime();

    if (data.type === 'expense' && dateValue >= startDateValue && dateValue <= endDateValue) {
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
    }
  });

  // Calculate percentages and sort by amount
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

  const startOfPrevYearValue = new Date(prevYear, 0, 1).getTime();
  const endOfCurrentYearValue = new Date(currentYear, 11, 31, 23, 59, 59, 999).getTime();

  const snapshot = await db
    .collection(TRANSACTIONS_COLLECTION)
    .where('userId', '==', userId)
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
    const dateValue = date.getTime();
    
    if (dateValue >= startOfPrevYearValue && dateValue <= endOfCurrentYearValue) {
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
