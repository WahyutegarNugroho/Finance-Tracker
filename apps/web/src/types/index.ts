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

export interface Transaction {
  id: string;
  amount: number;
  type: "expense" | "income";
  categoryName: string;
  categoryIcon: string;
  note: string;
  date: string;
  userId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
