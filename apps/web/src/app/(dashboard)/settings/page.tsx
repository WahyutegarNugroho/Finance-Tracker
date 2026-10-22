"use client";

import React, { useState, useEffect } from "react";
import ProfileSection from "@/components/settings/ProfileSection";
import AppearanceSection from "@/components/settings/AppearanceSection";
import CategoryManager from "@/components/settings/CategoryManager";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, UserProfile, ApiResponse, FirebaseAuthError } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Settings() {
  const { user, logout, setCurrency: setGlobalCurrency } = useAuth();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [isCategoryConfirmOpen, setIsCategoryConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const resetDataMutation = useMutation({
    mutationFn: () => api.post("/users/reset", { confirm: "RESET" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("settings_page.reset_success"));
    },
    onError: () => toast.error(t("settings_page.reset_error")),
  });

  const { data: profileData, isLoading: profileLoading, isError: profileError } = useQuery<ApiResponse<UserProfile>>({
    queryKey: ["profile"],
    queryFn: () => api.get("/users/profile"),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  const profile = profileData?.data;

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  useEffect(() => {
    if (profile) {
      const timer = setTimeout(() => {
        setDisplayName(profile.displayName || user?.displayName || "");
        setCurrency(profile.currency || "IDR");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile, user]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => api.put("/users/profile", data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (res.data?.currency) setGlobalCurrency(res.data.currency);
      toast.success(t("settings_page.profile_updated"));
    },
    onError: () => toast.error(t("settings_page.profile_error")),
  });

  const addCategoryMutation = useMutation({
    mutationFn: (cat: Partial<Category>) => api.post("/categories", cat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("settings_page.category_added"));
    },
    onError: () => toast.error(t("settings_page.category_add_error")),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) => api.put(`/categories/${id}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("settings_page.category_updated"));
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("settings_page.category_deleted"));
    },
    onError: (err: unknown) => {
      const fbErr = err as FirebaseAuthError;
      const msg = fbErr?.data?.message || fbErr?.message || "";
      if (msg.includes("transactions") || msg.includes("Cannot delete")) {
        toast.error(t("settings_page.category_has_transactions"));
      } else {
        toast.error(t("settings_page.category_delete_error"));
      }
    }
  });

  const handleSaveProfile = () => {
    if (!displayName.trim()) return;
    updateProfileMutation.mutate({ displayName, currency });
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) deleteCategoryMutation.mutate(categoryToDelete);
    setIsCategoryConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmResetData = () => {
    resetDataMutation.mutate();
    setIsResetConfirmOpen(false);
  };

  if (profileError) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="p-5 bg-[#FB923C]/10 border-2 border-[#FB923C] text-[#FB923C] rounded-2xl font-mono text-sm inline-block shadow-[4px_4px_0px_#08110A]">
          {t("dashboard_page.load_error")}
        </div>
      </div>
    );
  }

  if (profileLoading && !profile) return <SettingsSkeleton />;

  return (
    <div className="flex flex-col gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both pb-12">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 text-[#08110A] dark:text-[#F5EFE6] w-fit shadow-[2px_2px_0px_#08110A] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.1)]">
          <span className="w-2 h-2 rounded-full bg-[#39E75F]"></span>
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
            {language === "id" ? "PREFERENSI" : "PREFERENCES"}
          </span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#08110A] dark:text-[#F5EFE6] tracking-tight">
          {t("settings_page.title")}
        </h2>
        <p className="text-sm font-mono text-[#08110A]/60 dark:text-[#F5EFE6]/60">
          {t("settings_page.subtitle")}
        </p>
      </div>

      <ProfileSection 
        displayName={displayName}
        setDisplayName={setDisplayName}
        currency={currency}
        setCurrency={setCurrency}
        user={user}
        onSave={handleSaveProfile}
        isSaving={updateProfileMutation.isPending}
      />

      <AppearanceSection />

      <CategoryManager 
        categories={categories}
        isCategoriesLoading={categoriesLoading}
        onAddCategory={(cat) => addCategoryMutation.mutate(cat)}
        onUpdateCategory={(id, name) => updateCategoryMutation.mutate({ id, name })}
        onDeleteCategory={(id) => { setCategoryToDelete(id); setIsCategoryConfirmOpen(true); }}
        isAdding={addCategoryMutation.isPending}
        isUpdating={updateCategoryMutation.isPending}
        isDeleting={deleteCategoryMutation.isPending}
      />

      <section className="bg-[#FB923C]/5 dark:bg-[#FB923C]/10 border-2 border-[#FB923C]/30 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FB923C]/20 border-2 border-[#FB923C] flex items-center justify-center text-[#FB923C]">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-[#08110A] dark:text-[#F5EFE6]">
              {t("settings_page.danger_zone.title")}
            </h3>
            <p className="text-xs font-mono text-[#FB923C] uppercase tracking-wider font-bold">
              Irreversible Actions
            </p>
          </div>
        </div>
        <p className="text-sm text-[#08110A]/70 dark:text-[#F5EFE6]/70 mb-6">
          {t("settings_page.danger_zone.desc")}
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={logout}
            className="min-h-[44px] bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 text-[#08110A] dark:text-[#F5EFE6] font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#08110A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            {t("common.logout")}
          </button>
          <button 
            onClick={() => setIsResetConfirmOpen(true)} 
            disabled={resetDataMutation.isPending}
            className="min-h-[44px] bg-[#FB923C] text-[#08110A] border-2 border-[#08110A] font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-full shadow-[3px_3px_0px_#08110A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#08110A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB923C] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            {t("settings_page.danger_zone.reset_all")}
          </button>
        </div>
      </section>

      <ConfirmDialog 
        isOpen={isCategoryConfirmOpen}
        title={t("settings_page.delete_category_confirm")}
        message={t("settings_page.delete_category_message")}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => { setIsCategoryConfirmOpen(false); setCategoryToDelete(null); }}
      />

      <ConfirmDialog 
        isOpen={isResetConfirmOpen}
        title={t("settings_page.reset_confirm_title")}
        message={t("settings_page.reset_confirm_message")}
        onConfirm={handleConfirmResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
        confirmText={t("settings_page.reset_confirm_button")}
      />
    </div>
  );
}
