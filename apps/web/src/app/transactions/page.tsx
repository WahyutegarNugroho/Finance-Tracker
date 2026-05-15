"use client";

import React, { useState, useEffect, Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import FilterBar from "@/components/transactions/FilterBar";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionModal from "@/components/TransactionModal";
import TransactionsSkeleton from "@/components/transactions/TransactionsSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Transaction, ApiResponse } from "@/types";

// Formatter for date
const formatDate = (dateString: string, lang: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

function TransactionsContent() {
  const { user, loading: authLoading, formatCurrency } = useAuth();
  const { language, t, tCategory } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("all"); // 'all', 'income', 'expense'
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

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

  // Query
  const { data: transactionsData, isLoading: transactionsLoading, isError } = useQuery<ApiResponse<Transaction[]>>({
    queryKey: ["transactions", page, typeFilter],
    queryFn: () => {
      let url = `/transactions?page=${page}&limit=10`;
      if (typeFilter !== "all") url += `&type=${typeFilter}`;
      return api.get(url);
    },
    enabled: !!user,
  });

  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;

  // Client-side filtering for search (if backend doesn't support search parameter yet)
  const filteredTransactions = debouncedSearch 
    ? transactions.filter((tx) => 
        (tx.note && tx.note.toLowerCase().includes(debouncedSearch.toLowerCase())) || 
        (tx.categoryName && tx.categoryName.toLowerCase().includes(debouncedSearch.toLowerCase()))
      )
    : transactions;

  // Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData(["transactions", page, typeFilter]);

      // Optimistically update to the new value
      queryClient.setQueryData(["transactions", page, typeFilter], (old: ApiResponse<Transaction[]> | undefined) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((tx: Transaction) => tx.id !== id),
        };
      });

      // Return a context object with the snapshotted value
      return { previousTransactions };
    },
    onSuccess: () => {
      toast.success(language === 'id' ? "Transaksi dihapus!" : "Transaction deleted!");
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTransactions) {
        queryClient.setQueryData(["transactions", page, typeFilter], context.previousTransactions);
      }
      toast.error(language === 'id' ? "Gagal menghapus transaksi." : "Failed to delete transaction.");
    },
    onSettled: () => {
      // Always refetch after error or success to keep server in sync
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm(language === 'id' ? "Apakah Anda yakin ingin menghapus transaksi ini?" : "Are you sure you want to delete this transaction?")) return;
    deleteMutation.mutate(id);
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) return;
    
    const headers = ["Date", "Category", "Note", "Amount", "Type"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(tx => [
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

  if (authLoading || (transactionsLoading && transactions.length === 0)) {
    return (
      <div className="bg-background min-h-screen">
        <Topbar />
        <Sidebar activePath="/transactions" />
        <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen">
          <TransactionsSkeleton />
        </main>
        <BottomNav activePath="/transactions" />
      </div>
    );
  }

  return (
    <div className="text-on-background antialiased bg-background min-h-screen w-full flex flex-col">
      <Topbar />
      <Sidebar activePath="/transactions" />

      {/* Main Content Area */}
      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen w-full">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">
                {t("transactions_page.title")}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {t("transactions_page.subtitle")}
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
              {t("transactions_page.add_new")}
            </button>
          </div>

          {isError && (
            <div className="p-4 bg-error-container text-error rounded-xl">
              Failed to load transactions.
            </div>
          )}

          <FilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onExport={handleExport}
            setPage={setPage}
          />

          <TransactionTable 
            transactions={filteredTransactions}
            isLoading={transactionsLoading}
            onEdit={(tx) => {
              setTransactionToEdit(tx);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
            formatDate={formatDate}
          />

          {/* Pagination */}
          <div className="mt-auto px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest/50 rounded-xl bg-surface/80">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {t("transactions_page.pagination.showing")} {page} {t("transactions_page.pagination.of")} {Math.max(1, totalPages)} ({totalItems} {t("transactions_page.pagination.total")})
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
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
