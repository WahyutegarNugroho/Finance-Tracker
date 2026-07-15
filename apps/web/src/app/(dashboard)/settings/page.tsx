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
  const { t } = useLanguage();
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
        <div className="p-4 bg-error-container/50 text-error rounded-xl border border-error/20 inline-block">
          {t("dashboard_page.load_error")}
        </div>
      </div>
    );
  }

  if (profileLoading && !profile) return <SettingsSkeleton />;

  return (
    <div className="flex flex-col gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div>
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">{t("settings_page.title")}</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t("settings_page.subtitle")}</p>
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

      <section className="bg-error-container/10 border border-error/20 rounded-xl p-6 shadow-sm mb-12">
        <h3 className="font-headline-md text-headline-md text-error mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">warning</span>
          {t("settings_page.danger_zone.title")}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{t("settings_page.danger_zone.desc")}</p>
        <div className="flex flex-wrap gap-4">
          <button onClick={logout}
            className="bg-surface border border-outline-variant/30 text-on-surface hover:bg-surface-variant/30 font-body-sm text-body-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            {t("common.logout")}
          </button>
          <button onClick={() => setIsResetConfirmOpen(true)} disabled={resetDataMutation.isPending}
            className="bg-error text-on-error hover:bg-error/90 disabled:opacity-50 font-body-sm text-body-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
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
