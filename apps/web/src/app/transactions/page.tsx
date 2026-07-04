"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
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
import ConfirmDialog from "@/components/ConfirmDialog";
import { formatDate } from "@/lib/formatting";

function TransactionsContent() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Cursor-based Pagination & Filters
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  // Confirm Dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset pagination on new search
  useEffect(() => {
    setCursor(null);
    setCursorStack([]);
  }, [debouncedSearch]);

  // Reset cursor when type filter changes
  useEffect(() => {
    setCursor(null);
    setCursorStack([]);
  }, [typeFilter]);

  // Query
  const { data: transactionsData, isLoading: transactionsLoading, isError } = useQuery<ApiResponse<Transaction[]>>({
    queryKey: ["transactions", cursor, typeFilter, debouncedSearch],
    queryFn: ({ signal }) => {
      let url = `/transactions?limit=10`;
      if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
      if (typeFilter !== "all") url += `&type=${typeFilter}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      return api.get(url, { signal });
    },
    enabled: !!user,
  });

  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination;
  const hasMore = pagination?.hasMore ?? false;
  const canGoBack = cursorStack.length > 0;

  const filteredTransactions = Array.isArray(transactions) ? transactions : [];

  const resetPagination = useCallback(() => {
    setCursor(null);
    setCursorStack([]);
  }, []);

  // Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["transactions"] });

      // Snapshot the previous value
      const queryKey = ["transactions", cursor, typeFilter, debouncedSearch];
      const previousTransactions = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (old: ApiResponse<Transaction[]> | undefined) => {
        if (!old || !Array.isArray(old.data)) return old;
        return {
          ...old,
          data: old.data.filter((tx: Transaction) => tx.id !== id),
        };
      });

      // Return a context object with the snapshotted value
      return { previousTransactions, queryKey };
    },
    onSuccess: () => {
      toast.success(t("transactions_page.delete_success"));
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTransactions && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousTransactions);
      }
      toast.error(t("transactions_page.delete_error"));
    },
    onSettled: () => {
      // Always refetch after error or success to keep server in sync
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
    },
  });

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteMutation.mutate(transactionToDelete);
    }
    setIsConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const sanitizeCSV = (value: string): string => {
    const s = String(value);
    const dangerousChars = ['=', '+', '-', '@', '|', '%'];
    if (dangerousChars.some(c => s.trimStart().startsWith(c))) {
      return `"'${s.replace(/"/g, '""')}`;
    }
    return s.replace(/"/g, '""');
  };

  const handleExport = async () => {
    try {
      let url = `/transactions?page=1&limit=1000`;
      if (typeFilter !== "all") url += `&type=${typeFilter}`;
      if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
      
      toast.loading(t("transactions_page.exporting"), { id: "export-csv" });
      const res = await api.get(url);
      const allTx = res?.data || [];
      
      if (allTx.length === 0) {
        toast.error(t("transactions_page.no_export_data"), { id: "export-csv" });
        return;
      }
      
      const headers = [t("transactions_page.csv_header_date"), t("transactions_page.csv_header_category"), t("transactions_page.csv_header_note"), t("transactions_page.csv_header_amount"), t("transactions_page.csv_header_type"), t("transactions_page.csv_header_currency"), t("transactions_page.csv_header_tags")];
      const csvContent = [
        headers.join(","),
        ...allTx.map((tx: Transaction) => [
          new Date(tx.date).toISOString().split('T')[0],
          `"${sanitizeCSV(tx.categoryName || '')}"`,
          `"${sanitizeCSV(tx.note || '')}"`,
          tx.amount,
          tx.type,
          tx.currency || '',
          `"${sanitizeCSV((tx.tags || []).join('; '))}"`
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const downloadUrl = URL.createObjectURL(blob);
      link.setAttribute("href", downloadUrl);
      link.setAttribute("download", `transactions_export_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(t("transactions_page.export_success"), { id: "export-csv" });
    } catch (err) {
      console.error("Export failed", err);
      toast.error(t("transactions_page.export_error"), { id: "export-csv" });
    }
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
            <div className="p-4 bg-error-container text-error rounded-xl flex items-center justify-between gap-4">
              <span>{t("transactions_page.error_load")}</span>
              <button onClick={() => queryClient.invalidateQueries({ queryKey: ["transactions"] })}
                className="bg-error text-on-error px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-error/90 transition-colors shrink-0">
                {t("error_page.try_again")}
              </button>
            </div>
          )}

          <FilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onExport={handleExport}
            onResetPagination={resetPagination}
          />

          <TransactionTable 
            transactions={filteredTransactions}
            isLoading={transactionsLoading}
            onEdit={(tx) => {
              setTransactionToEdit(tx);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteClick}
            onBatchDelete={(ids) => {
              Promise.all(ids.map((id) => api.delete(`/transactions/${id}`))).then(() => {
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
                toast.success(`${ids.length} transactions deleted.`);
              }).catch(() => toast.error(t("transactions_page.delete_error")));
            }}
            formatDate={formatDate}
          />

          {/* Pagination */}
          <div className="mt-auto px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest/50 rounded-xl bg-surface/80">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {filteredTransactions.length > 0
                ? t("transactions_page.transaction_count").replace("{count}", String(filteredTransactions.length))
                : ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const prev = cursorStack[cursorStack.length - 1] || null;
                  if (prev !== undefined) {
                    setCursorStack(prev => prev.slice(0, -1));
                    setCursor(prev);
                  }
                }}
                disabled={!canGoBack}
                className="p-2 rounded-md hover:bg-surface-variant text-on-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                <span className="font-body-sm text-body-sm">{t("transactions_page.pagination.previous") || "Previous"}</span>
              </button>
              <button 
                onClick={() => {
                  if (hasMore && pagination?.nextCursor) {
                    setCursorStack(prev => [...prev, cursor]);
                    setCursor(pagination.nextCursor!);
                  }
                }}
                disabled={!hasMore}
                className="p-2 rounded-md hover:bg-surface-variant text-on-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
              >
                <span className="font-body-sm text-body-sm">{t("transactions_page.pagination.next") || "Next"}</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
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
          resetPagination();
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
        }}
        transactionToEdit={transactionToEdit}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title={t("transactions_page.delete_title")}
        message={t("transactions_page.delete_message")}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setTransactionToDelete(null);
        }}
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
