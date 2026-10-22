"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import FilterBar from "@/components/transactions/FilterBar";
import TransactionTable from "@/components/transactions/TransactionTable";
import TransactionModal from "@/components/TransactionModal";
import TransactionsSkeleton from "@/components/transactions/TransactionsSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Transaction, ApiResponse } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";
import { formatDate } from "@/lib/formatting";

function TransactionsContent() {
  const { user, formatCurrency } = useAuth();
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<Array<string | null>>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  interface TransactionSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }

  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      toast.success(t("common.online"));
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning(t("common.offline"));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryClient, t]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCursor(null);
      setCursorStack([]);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, setDebouncedSearch, setCursor, setCursorStack]);

  const { data: transactionsData, isLoading: transactionsLoading, isError, refetch: refetchTransactions } = useQuery<ApiResponse<Transaction[]>>({
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

  // Self-healing cursor: asynchronously reset to page 1 if an invalid cursor caused an error
  useEffect(() => {
    if (isError && cursor) {
      const timer = setTimeout(() => {
        setCursor(null);
        setCursorStack([]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isError, cursor]);

  const { data: summaryData, isError: isSummaryError, refetch: refetchSummary } = useQuery<ApiResponse<TransactionSummary>>({
    queryKey: ["transactions-summary"],
    queryFn: () => api.get("/transactions/summary"),
    staleTime: 60 * 1000,
    enabled: !!user,
  });
  
  const summary = summaryData?.data;

  const transactions = transactionsData?.data || [];
  const pagination = transactionsData?.pagination;
  const hasMore = pagination?.hasMore ?? false;
  const canGoBack = cursorStack.length > 0;
  const searchTruncated = !!transactionsData?.pagination?.searchTruncated;
  const filteredTransactions = Array.isArray(transactions) ? transactions : [];

  const resetPagination = useCallback(() => {
    setCursor(null);
    setCursorStack([]);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["transactions"] });
      const queryKey = ["transactions", cursor, typeFilter, debouncedSearch];
      const previousTransactions = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: ApiResponse<Transaction[]> | undefined) => {
        if (!old || !Array.isArray(old.data)) return old;
        return { ...old, data: old.data.filter((tx: Transaction) => tx.id !== id) };
      });
      return { previousTransactions, queryKey };
    },
    onSuccess: () => toast.success(t("transactions_page.delete_success")),
    onError: (err, id, context) => {
      if (context?.previousTransactions && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousTransactions);
      }
      toast.error(t("transactions_page.delete_error"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
    },
  });

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteMutation.mutate(transactionToDelete, {
        onSettled: () => {
          setIsConfirmOpen(false);
          setTransactionToDelete(null);
        },
      });
    }
  };

  const handleBatchDelete = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    setIsBatchDeleting(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => api.delete(`/transactions/${id}`))
      );
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (failed === 0) {
        toast.success(
          t("transactions_page.batch_delete_success").replace("{count}", String(succeeded))
        );
      } else if (succeeded > 0) {
        toast.warning(
          t("transactions_page.batch_delete_partial")
            .replace("{success}", String(succeeded))
            .replace("{failed}", String(failed))
        );
      } else {
        toast.error(t("transactions_page.delete_error"));
      }
    } catch {
      toast.error(t("transactions_page.delete_error"));
    } finally {
      setIsBatchDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
    }
  };

  const sanitizeCSV = (value: string): string => {
    const s = String(value);
    const dangerousChars = ['=', '+', '-', '@', '|', '%', '\t', '\r'];
    if (dangerousChars.some(c => s.trimStart().startsWith(c)) || s.includes('\n')) {
      return `"'${s.replace(/"/g, '""')}`;
    }
    return s.replace(/"/g, '""');
  };

  const handleExport = async () => {
    try {
      toast.loading(t("transactions_page.exporting"), { id: "export-csv" });
      const limit = 500;
      let cursor = null;
      let allTx: Transaction[] = [];
      let hasMore = true;
      let pageCount = 0;
      const MAX_PAGES = 50;

      while (hasMore && pageCount < MAX_PAGES) {
        pageCount++;
        let url = `/transactions?limit=${limit}`;
        if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
        if (typeFilter !== "all") url += `&type=${typeFilter}`;
        if (debouncedSearch) url += `&search=${encodeURIComponent(debouncedSearch)}`;
        const res = await api.get(url);
        const page = Array.isArray(res?.data) ? res.data : [];
        allTx = allTx.concat(page);
        hasMore = Boolean(res?.pagination?.hasMore && res?.pagination?.nextCursor);
        cursor = res?.pagination?.nextCursor || null;
      }

      if (allTx.length === 0) {
        toast.error(t("transactions_page.no_export_data"), { id: "export-csv" });
        return;
      }

      const headers = [
        t("transactions_page.csv_header_date"),
        t("transactions_page.csv_header_category"),
        t("transactions_page.csv_header_note"),
        t("transactions_page.csv_header_amount"),
        t("transactions_page.csv_header_type"),
        t("transactions_page.csv_header_currency"),
        t("transactions_page.csv_header_tags"),
      ];
      const csvContent = [
        headers.join(","),
        ...allTx.map((tx: Transaction) => {
          let dateStr = "";
          try {
            const d = new Date(tx.date);
            dateStr = isNaN(d.getTime()) ? (tx.date || "") : d.toISOString().split("T")[0];
          } catch {
            dateStr = tx.date || "";
          }
          return [
            dateStr,
            `"${sanitizeCSV(tx.categoryName || "")}"`,
            `"${sanitizeCSV(tx.note || "")}"`,
            isNaN(Number(tx.amount)) ? 0 : Number(tx.amount),
            tx.type,
            tx.currency || "",
            `"${sanitizeCSV((tx.tags || []).join("; "))}"`,
          ].join(",");
        }),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const downloadUrl = URL.createObjectURL(blob);
      link.setAttribute("href", downloadUrl);
      link.setAttribute("download", `transactions_export_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      toast.success(t("transactions_page.export_success"), { id: "export-csv" });
    } catch {
      toast.error(t("transactions_page.export_error"), { id: "export-csv" });
    }
  };

  if (transactionsLoading && transactions.length === 0) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {!isOnline && (
        <div className="sticky top-0 z-30 p-3 bg-amber-50 dark:bg-amber-950/70 border-2 border-[#08110A] dark:border-amber-500/40 text-amber-900 dark:text-amber-200 rounded-2xl shadow-[3px_3px_0px_#08110A] flex items-center justify-between gap-3 font-mono text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-400">wifi_off</span>
            <span>{t("common.offline")}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              refetchTransactions();
              refetchSummary();
            }}
            className="px-2.5 py-1 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-lg hover:opacity-90 font-mono text-[11px] font-bold cursor-pointer transition-opacity"
          >
            {t("common.try_again")}
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border-2 border-[#08110A] bg-[#39E75F] text-[#08110A] font-display font-black text-[10px] uppercase shadow-[2px_2px_0px_#08110A]">
              {language === "id" ? "BUKU KAS" : "LEDGER"}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#08110A] dark:text-white">
            {t("transactions_page.title")}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#08110A]/70 dark:text-[#F5EFE6]/70 mt-1">
            {t("transactions_page.subtitle")}
          </p>
        </div>
        <button 
          onClick={() => { setTransactionToEdit(null); setIsModalOpen(true); }}
          className="min-h-[44px] bg-[#39E75F] hover:bg-[#2ed652] active:translate-y-0.5 text-[#08110A] font-display text-xs sm:text-sm font-black uppercase tracking-wider px-5 py-2.5 rounded-full border-2 border-[#08110A] shadow-[3px_3px_0px_#08110A] focus-visible:ring-2 focus-visible:ring-[#08110A] focus-visible:ring-offset-2 focus-visible:outline-none transition-all flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] font-bold">add</span>
          <span>{t("transactions_page.add_new")}</span>
        </button>
      </div>

      {isError && (
        <div className="p-4 bg-[#FEE2E2] text-[#991B1B] rounded-2xl border-2 border-[#08110A] shadow-[2px_2px_0px_#991B1B] flex items-center justify-between gap-4 font-mono text-xs font-bold">
          <span>{t("transactions_page.error_load")}</span>
          <button 
            disabled={transactionsLoading}
            onClick={() => refetchTransactions()}
            className="bg-[#991B1B] text-white px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            {transactionsLoading && (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{t("error_page.try_again")}</span>
          </button>
        </div>
      )}

      {isSummaryError ? (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-[#08110A] dark:border-amber-400/30 rounded-2xl p-3 flex items-center justify-between font-mono text-xs text-amber-800 dark:text-amber-300 shadow-[2px_2px_0px_#08110A]">
          <span>{language === "id" ? "Gagal memuat ringkasan bulan ini." : "Failed to load monthly summary."}</span>
          <button
            type="button"
            onClick={() => refetchSummary()}
            className="underline font-bold cursor-pointer hover:opacity-80"
          >
            {t("error_page.try_again")}
          </button>
        </div>
      ) : summary ? (
        <div className="bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 rounded-2xl p-4 shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(57,231,95,0.25)] flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#08110A]/60 dark:text-[#F5EFE6]/60 mb-0.5">{t("common.income") || "Income"}</p>
              <p className="text-[#166534] dark:text-[#39E75F] font-black font-mono text-sm sm:text-base">+{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div className="w-[2px] bg-[#08110A]/15 dark:bg-white/15"></div>
            <div>
              <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#08110A]/60 dark:text-[#F5EFE6]/60 mb-0.5">{t("common.expense") || "Expense"}</p>
              <p className="text-[#991B1B] dark:text-[#FB923C] font-black font-mono text-sm sm:text-base">-{formatCurrency(summary.totalExpense)}</p>
            </div>
            <div className="w-[2px] bg-[#08110A]/15 dark:bg-white/15 hidden sm:block"></div>
            <div className="hidden sm:block">
              <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#08110A]/60 dark:text-[#F5EFE6]/60 mb-0.5">{t("common.balance") || "Balance"}</p>
              <p className="text-[#08110A] dark:text-white font-black font-mono text-sm sm:text-base">{formatCurrency(summary.balance)}</p>
            </div>
          </div>
          <span className="font-mono text-[10px] font-black uppercase tracking-wider text-[#08110A] dark:text-[#39E75F] bg-[#FAF8F5] dark:bg-white/10 border border-[#08110A]/20 dark:border-white/20 px-3 py-1 rounded-full">
            {language === "id" ? "Bulan Berjalan" : "Current Month"}
          </span>
        </div>
      ) : null}

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
        onEdit={(tx) => { setTransactionToEdit(tx); setIsModalOpen(true); }}
        onDelete={handleDeleteClick}
        onBatchDelete={handleBatchDelete}
        formatDate={formatDate}
        searchQuery={searchQuery}
        typeFilter={typeFilter}
        onClearSearch={() => setSearchQuery("")}
        onClearFilter={() => setTypeFilter("all")}
        onAddNew={() => { setTransactionToEdit(null); setIsModalOpen(true); }}
        isBatchDeleting={isBatchDeleting}
      />

      <div className="mt-auto px-6 py-4 border-2 border-[#08110A] dark:border-white/20 shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(57,231,95,0.25)] flex items-center justify-between bg-white dark:bg-[#0D1910] rounded-2xl">
        <span className="font-mono text-xs font-bold text-[#08110A]/70 dark:text-[#F5EFE6]/70">
          {filteredTransactions.length > 0
            ? t("transactions_page.transaction_count").replace("{count}", String(filteredTransactions.length))
            : ''}
        </span>
        {searchTruncated && (
          <span className="font-mono text-xs font-bold text-[#991B1B]">
            {t("transactions_page.search_truncated")}
          </span>
        )}
        <div className="flex items-center gap-2">
          <button onClick={() => { const prev = cursorStack[cursorStack.length - 1] || null; if (prev !== undefined) { setCursorStack(prev => prev.slice(0, -1)); setCursor(prev); } }}
            disabled={!canGoBack}
            aria-disabled={!canGoBack}
            className="px-3 py-1.5 rounded-full border border-[#08110A]/20 dark:border-white/20 font-mono text-xs font-bold hover:bg-[#FAF8F5] dark:hover:bg-white/10 text-[#08110A] dark:text-[#F5EFE6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            <span>{t("transactions_page.pagination.previous") || "Previous"}</span>
          </button>
          <button onClick={() => { if (hasMore && pagination?.nextCursor) { setCursorStack(prev => [...prev, cursor]); setCursor(pagination.nextCursor!); } }}
            disabled={!hasMore}
            aria-disabled={!hasMore}
            className="px-3 py-1.5 rounded-full border border-[#08110A]/20 dark:border-white/20 font-mono text-xs font-bold hover:bg-[#FAF8F5] dark:hover:bg-white/10 text-[#08110A] dark:text-[#F5EFE6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer">
            <span>{t("transactions_page.pagination.next") || "Next"}</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => { setTransactionToEdit(null); setIsModalOpen(true); }}
        aria-label={t("transactions_page.add_new")}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-[#39E75F] text-[#08110A] border-2 border-[#08110A] rounded-full shadow-[4px_4px_0px_#08110A] flex items-center justify-center hover:bg-[#2ed652] focus:outline-none focus:ring-2 focus:ring-[#08110A] transition-all z-40 active:translate-y-0.5 cursor-pointer">
        <span className="material-symbols-outlined text-[28px] font-bold" aria-hidden="true">add</span>
      </button>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { resetPagination(); queryClient.invalidateQueries({ queryKey: ["transactions"] }); }}
        transactionToEdit={transactionToEdit}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title={t("transactions_page.delete_title")}
        message={t("transactions_page.delete_message")}
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setIsConfirmOpen(false);
            setTransactionToDelete(null);
          }
        }}
      />
    </div>
  );
}

export default function Transactions() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <TransactionsContent />
    </Suspense>
  );
}
