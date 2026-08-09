export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  currency: string;
  photoURL?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: "expense" | "income";
  userId: string;
}

export interface Attachment {
  name?: string;
  url: string;
  type?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "expense" | "income";
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  note: string;
  date: string;
  userId: string;
  currency?: string;
  color?: string;
  isRecurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  recurringEndDate?: string;
  recurringNextDate?: string;
  tags?: string[];
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CashFlowEntry {
  month: string;
  label: string;
  income: number;
  expense: number;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface DashboardOverview {
  balance: number;
  balanceChange: number;
  income: number;
  incomeChange: number;
  expense: number;
  expenseChange: number;
  budgetUsage: number;
  budgetLimit: number;
  recentTransactions: Transaction[];
  expenseByCategory: ExpenseCategory[];
  month: number;
  year: number;
}

export interface BudgetWithSpent extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
  status: "good" | "warning" | "critical";
}

export interface FirebaseAuthError {
  code?: string;
  message?: string;
  data?: { message?: string };
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  limitAmount: number;
  period: "monthly" | "weekly" | "yearly";
  month: number;
  year: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "good" | "warning" | "critical";
  userId: string;
}

export interface AnalyticsOverview {
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface AnalyticsCategories {
  totalExpense: number;
  categories: CategoryBreakdownItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    hasMore: boolean;
    nextCursor?: string | null;
    itemsPerPage: number;
    searchTruncated?: boolean;
  };
}
