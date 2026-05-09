"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import BudgetModal from "@/components/BudgetModal";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function Budget() {
  const { user, loading: authLoading, formatCurrency } = useAuth();
  const { language, t, tCategory } = useLanguage();
  const router = useRouter();

  const [budgets, setBudgets] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchBudgetData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [budgetsRes, summaryRes] = await Promise.all([
        api.get("/budgets"),
        api.get("/budgets/summary")
      ]);
      setBudgets(budgetsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error("Failed to fetch budget data", err);
      setError("Failed to load budget data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBudgetData();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget limit?")) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgetData();
    } catch (err) {
      alert("Failed to delete budget.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen antialiased flex flex-col">
      <Topbar />
      <Sidebar activePath="/budget" />
      
      {/* Main Content Wrapper */}
      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen w-full">
        <div className="max-w-[1440px] mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">{t("budget_page.title")}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">{t("budget_page.subtitle")}</p>
            </div>
            <button 
              onClick={() => {
                setBudgetToEdit(null);
                setIsModalOpen(true);
              }}
              className="bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] shadow-sm self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {t("budget_page.create_new")}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-error-container text-error rounded-xl">
              {error}
            </div>
          )}

          {/* Overall Budget Summary Card */}
          {summary && (
            <section className="glass-card bg-surface-container/70 rounded-xl p-6 md:p-8 mb-8 border border-outline-variant/30 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 relative z-10">
                <div>
                  <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-2">{language === 'id' ? 'Total Anggaran Bulanan' : 'Total Monthly Budget'}</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-display text-on-surface font-bold">{formatCurrency(summary.totalSpent)}</span>
                    <span className="font-body-lg text-body-lg text-outline">/ {formatCurrency(summary.totalBudget)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{language === 'id' ? 'Tersisa' : 'Remaining'}</span>
                    <span className="font-headline-md text-headline-md text-secondary font-semibold">{formatCurrency(summary.totalRemaining)}</span>
                  </div>
                  <div className="h-10 w-px bg-outline-variant/40"></div>
                  <div className="flex flex-col items-end">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{language === 'id' ? 'Terpakai' : 'Spent'}</span>
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold">{summary.overallPercentage}%</span>
                  </div>
                </div>
              </div>
              
              {/* Large Progress Bar */}
              <div className="relative w-full h-4 bg-surface-variant/80 rounded-full overflow-hidden border border-white/20 shadow-inner z-10">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    summary.overallPercentage >= 95 ? 'bg-error' : 
                    summary.overallPercentage >= 75 ? 'bg-tertiary' : 'bg-primary'
                  }`} 
                  style={{ width: `${Math.min(100, summary.overallPercentage)}%` }}
                ></div>
              </div>
            </section>
          )}

          {/* Category Breakdown Grid */}
          <div className="mb-4">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">{language === 'id' ? 'Rincian Kategori' : 'Category Breakdown'}</h3>
          </div>
          
          {budgets.length === 0 ? (
            <div className="text-center py-12 bg-surface/50 rounded-xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">account_balance_wallet</span>
              <p className="text-on-surface-variant">{language === 'id' ? 'Belum ada anggaran untuk bulan ini.' : 'No budgets set for this month.'}</p>
              <button 
                onClick={() => {
                  setBudgetToEdit(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                {language === 'id' ? 'Buat anggaran pertama Anda' : 'Create your first budget'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              {budgets.map((b) => {
                let statusColor = "text-primary";
                let bgColor = "bg-primary";
                let bgContainer = "bg-primary/10";
                let iconName = "check_circle";

                if (b.status === "critical") {
                  statusColor = "text-error";
                  bgColor = "bg-error";
                  bgContainer = "bg-error/10";
                  iconName = "error";
                } else if (b.status === "warning") {
                  statusColor = "text-tertiary";
                  bgColor = "bg-tertiary";
                  bgContainer = "bg-tertiary-container/20";
                  iconName = "warning";
                } else if (b.status === "good") {
                  statusColor = "text-secondary";
                  bgColor = "bg-secondary";
                  bgContainer = "bg-secondary/10";
                  iconName = "check_circle";
                }

                return (
                  <div key={b.id} className={`glass-card bg-surface-container-low/80 rounded-xl p-5 border ${b.status === 'critical' ? 'border-error/20 hover:border-error/40' : 'border-outline-variant/20 hover:shadow-md'} transition-shadow duration-300 flex flex-col justify-between h-48 relative overflow-hidden group`}>
                    {b.status === 'critical' && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-error/5 rounded-bl-full pointer-events-none"></div>
                    )}
                    
                    {/* Actions Menu */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-1">
                      <button 
                        onClick={() => { setBudgetToEdit(b); setIsModalOpen(true); }}
                        className="p-1.5 bg-surface rounded-md border border-outline-variant/20 hover:bg-surface-variant text-on-surface transition-colors"
                        title="Edit Budget"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 bg-surface rounded-md border border-outline-variant/20 hover:bg-error-container hover:text-error text-on-surface transition-colors"
                        title="Delete Budget"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${bgContainer} ${statusColor} flex items-center justify-center`}>
                          <span className="material-symbols-outlined">{b.categoryIcon || 'category'}</span>
                        </div>
                        <span className="font-body-lg text-body-lg font-medium text-on-surface truncate pr-8">{tCategory(b.categoryName)}</span>
                      </div>
                    </div>

                    <div className="mt-auto relative z-10">
                      <div className="flex justify-between items-end mb-2">
                        <span className={`font-numeric-data text-numeric-data font-semibold ${b.status === 'critical' ? 'text-error' : 'text-on-surface'}`}>
                          {formatCurrency(b.spent)} <span className="text-outline font-normal text-sm">/ {formatCurrency(b.limitAmount)}</span>
                        </span>
                        <span className={`font-label-caps text-label-caps ${statusColor}`}>{b.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                        <div className={`h-full ${bgColor} rounded-full`} style={{ width: `${Math.min(100, b.percentage)}%` }}></div>
                      </div>
                      {b.status === 'critical' && (
                        <p className="font-body-sm text-[11px] text-error mt-1.5 opacity-80">
                          {language === 'id' ? `Tersisa hanya ${formatCurrency(b.remaining)}` : `Only ${formatCurrency(b.remaining)} remaining`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav activePath="/budget" />

      <BudgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBudgetData}
        budgetToEdit={budgetToEdit}
      />
    </div>
  );
}
