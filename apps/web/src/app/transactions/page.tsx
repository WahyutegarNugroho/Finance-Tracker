"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import TransactionModal from "@/components/TransactionModal";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";



// Formatter for date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

function TransactionsContent() {
  const { user, loading: authLoading, formatCurrency } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'income', 'expense'
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let url = `/transactions?page=${page}&limit=10`;
      if (typeFilter !== "all") url += `&type=${typeFilter}`;
      
      const response = await api.get(url);
      
      // API returns { success, data: [...transactions], pagination: {...} }
      let filteredTx = response.data || [];
      if (debouncedSearch) {
        const lowerQ = debouncedSearch.toLowerCase();
        filteredTx = filteredTx.filter((tx: any) => 
          (tx.note && tx.note.toLowerCase().includes(lowerQ)) || 
          (tx.categoryName && tx.categoryName.toLowerCase().includes(lowerQ))
        );
      }

      setTransactions(filteredTx);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (err: any) {
      setError("Failed to load transactions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user, page, typeFilter, debouncedSearch]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [fetchTransactions, user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await api.delete(`/transactions/${id}`);
      // Refresh current page
      setPage(p => p); 
      // trigger re-fetch by doing a dummy state update
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  };

  const handleExport = () => {
    if (transactions.length === 0) return;
    
    const headers = ["Date", "Category", "Note", "Amount", "Type"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(tx => [
        new Date(tx.date).toISOString().split('T')[0],
        `"${tx.categoryName}"`,
        `"${tx.note || ''}"`,
        tx.amount,
        tx.type
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return <div className="bg-background min-h-screen"></div>;
  }

  return (
    <div className="text-on-background antialiased bg-background min-h-screen w-full flex flex-col">
      <Topbar />
      <Sidebar activePath="/transactions" />

      {/* Main Content Area */}
      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen w-full">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-6 h-full">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">
                Transactions
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Review and manage your financial history.
              </p>
            </div>
            <button 
              onClick={() => {
                setTransactionToEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Transaction
            </button>
          </div>

          {error && (
            <div className="p-4 bg-error-container text-error rounded-xl">
              {error}
            </div>
          )}

          {/* Toolbar & Filters */}
          <div className="bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-sm font-body-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-on-background placeholder:text-outline"
                placeholder="Search notes, categories..."
                type="text"
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Type Filter */}
              <div className="relative group">
                <select 
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none flex items-center gap-2 pl-3 pr-8 py-2 bg-surface border border-outline-variant/30 rounded-lg hover:bg-surface-variant/30 transition-colors font-body-sm text-body-sm text-on-surface-variant focus:outline-none"
                >
                  <option value="all">Type: All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-on-surface-variant">
                  expand_more
                </span>
              </div>
              
              <div className="w-[1px] h-6 bg-outline-variant/30 mx-1 hidden lg:block"></div>
              
              {/* Export */}
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-outline-variant/30 rounded-lg hover:bg-surface-variant/30 transition-colors font-body-sm text-body-sm text-primary font-medium ml-auto lg:ml-0"
              >
                <span className="material-symbols-outlined text-[18px]">
                  download
                </span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Transactions Data Table */}
          <div className="bg-surface/80 backdrop-blur-[12px] border border-white/10 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden flex-1 flex flex-col min-h-[400px]">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
                    <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">Date</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">Category</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider">Note</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider text-center">Type</th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-outline font-medium tracking-wider w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 relative">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-variant/20 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap font-body-sm text-body-sm text-on-surface">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              tx.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                            }`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {tx.categoryIcon || 'category'}
                              </span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface">
                              {tx.categoryName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant max-w-xs truncate">
                          {tx.note || "-"}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap font-numeric-data text-numeric-data text-right font-semibold ${
                          tx.type === 'income' ? 'text-secondary' : 'text-on-surface'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md font-label-caps text-label-caps text-[10px] ${
                            tx.type === 'income' 
                              ? 'bg-secondary/10 text-secondary' 
                              : 'bg-surface-variant/50 text-on-surface-variant'
                          }`}>
                            {tx.type === 'income' ? 'Credit' : 'Debit'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-outline transition-opacity relative group/menu">
                          <button className="p-1 hover:bg-surface-variant rounded-full transition-colors opacity-0 group-hover:opacity-100">
                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                          </button>
                          
                          {/* Dropdown Menu */}
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 bg-surface border border-outline-variant/20 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 flex flex-col overflow-hidden">
                            <button 
                              onClick={() => {
                                setTransactionToEdit(tx);
                                setIsModalOpen(true);
                              }}
                              className="text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant/50"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(tx.id)}
                              className="text-left px-4 py-2 text-sm text-error hover:bg-error-container/50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-auto px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest/50">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Showing page {page} of {Math.max(1, totalPages)} ({totalItems} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1 rounded-md hover:bg-surface-variant text-on-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="flex gap-1">
                  <span className="w-8 h-8 rounded-md bg-primary text-on-primary font-body-sm text-body-sm flex items-center justify-center">
                    {page}
                  </span>
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || totalPages === 0}
                  className="p-1 rounded-md hover:bg-surface-variant text-on-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={() => {
          setTransactionToEdit(null);
          setIsModalOpen(true);
        }}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all z-40 active:scale-95"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      <BottomNav activePath="/transactions" />
      
      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Re-fetch transactions
          setPage(1);
          fetchTransactions();
        }}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}

export default function Transactions() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <TransactionsContent />
    </Suspense>
  );
}
