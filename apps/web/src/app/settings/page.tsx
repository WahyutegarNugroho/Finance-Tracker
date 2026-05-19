"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import ProfileSection from "@/components/settings/ProfileSection";
import AppearanceSection from "@/components/settings/AppearanceSection";
import CategoryManager from "@/components/settings/CategoryManager";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, UserProfile, ApiResponse } from "@/types";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Settings() {
  const { user, loading: authLoading, logout, setCurrency: setGlobalCurrency } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, tCategory } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Settings state
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("IDR");

  // Confirm Dialogs States
  const [isCategoryConfirmOpen, setIsCategoryConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const resetDataMutation = useMutation({
    mutationFn: () => api.delete("/users/reset"),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success(language === 'id' ? "Seluruh data Anda telah berhasil direset!" : "All your data has been successfully reset!");
    },
    onError: () => {
      toast.error(language === 'id' ? "Gagal mereset data." : "Failed to reset data.");
    }
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Queries
  const { data: profileData, isLoading: profileLoading } = useQuery<ApiResponse<UserProfile>>({
    queryKey: ["profile"],
    queryFn: () => api.get("/users/profile"),
    enabled: !!user,
  });

  const profile = profileData?.data;

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery<ApiResponse<Category[]>>({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories"),
    enabled: !!user,
  });

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  // Sync internal state with profile data
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || user?.displayName || "");
      setCurrency(profile.currency || "IDR");
    }
  }, [profile, user]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => api.put("/users/profile", data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (res.data?.currency) setGlobalCurrency(res.data.currency);
      toast.success(language === 'id' ? "Profil diperbarui!" : "Profile updated!");
    },
    onError: () => toast.error(language === 'id' ? "Gagal memperbarui profil." : "Failed to update profile.")
  });

  const addCategoryMutation = useMutation({
    mutationFn: (cat: Partial<Category>) => api.post("/categories", cat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(language === 'id' ? "Kategori ditambahkan!" : "Category added!");
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) => api.put(`/categories/${id}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(language === 'id' ? "Kategori diperbarui!" : "Category updated!");
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(language === 'id' ? "Kategori dihapus!" : "Category deleted!");
    },
    onError: (err: any) => {
      const msg = err?.data?.message || err?.message || "";
      if (msg.includes("transactions") || msg.includes("Cannot delete")) {
        toast.error(language === 'id' 
          ? `Tidak dapat menghapus kategori ini karena memiliki transaksi.` 
          : `Cannot delete this category because it has existing transactions.`);
      } else {
        toast.error(language === 'id' ? `Gagal menghapus kategori.` : `Failed to delete category.`);
      }
    }
  });

  const handleSaveProfile = () => {
    if (!displayName.trim()) return;
    updateProfileMutation.mutate({ displayName, currency });
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete);
    }
    setIsCategoryConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmResetData = () => {
    resetDataMutation.mutate();
    setIsResetConfirmOpen(false);
  };

  if (authLoading || (profileLoading && !profile)) {
    return (
      <div className="bg-background min-h-screen">
        <Topbar />
        <Sidebar activePath="/settings" />
        <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen">
          <SettingsSkeleton />
        </main>
        <BottomNav activePath="/settings" />
      </div>
    );
  }

  return (
    <div className="text-on-background antialiased bg-background min-h-screen flex flex-col">
      <Topbar />
      <Sidebar activePath="/settings" />

      {/* Main Content Area */}
      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-background">
              {t("settings_page.title")}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
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
            onDeleteCategory={(id) => {
              setCategoryToDelete(id);
              setIsCategoryConfirmOpen(true);
            }}
            isAdding={addCategoryMutation.isPending}
            isUpdating={updateCategoryMutation.isPending}
            isDeleting={deleteCategoryMutation.isPending}
          />

          {/* Dangerous Zone */}
          <section className="bg-error-container/10 border border-error/20 rounded-xl p-6 shadow-sm mb-12">
            <h3 className="font-headline-md text-headline-md text-error mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              {t("settings_page.danger_zone.title")}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              {t("settings_page.danger_zone.desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={logout}
                className="bg-surface border border-outline-variant/30 text-on-surface hover:bg-surface-variant/30 font-body-sm text-body-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {t("common.logout")}
              </button>
              <button 
                onClick={() => setIsResetConfirmOpen(true)}
                disabled={resetDataMutation.isPending}
                className="bg-error text-on-error hover:bg-error/90 disabled:opacity-50 font-body-sm text-body-sm font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                {language === 'id' ? 'Reset Semua Data' : 'Reset All Data'}
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNav activePath="/settings" />

      <ConfirmDialog 
        isOpen={isCategoryConfirmOpen}
        title={language === 'id' ? "Hapus Kategori" : "Delete Category"}
        message={language === 'id' ? "Apakah Anda yakin ingin menghapus kategori ini?" : "Are you sure you want to delete this category?"}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => {
          setIsCategoryConfirmOpen(false);
          setCategoryToDelete(null);
        }}
      />

      <ConfirmDialog 
        isOpen={isResetConfirmOpen}
        title={language === 'id' ? "Reset Semua Data Keuangan" : "Reset All Financial Data"}
        message={language === 'id' ? "Apakah Anda yakin ingin menghapus seluruh data transaksi, anggaran, dan kategori kustom? Tindakan ini bersifat permanen dan tidak dapat dibatalkan." : "Are you sure you want to delete all transaction history, budgets, and custom categories? This action is permanent and cannot be undone."}
        onConfirm={handleConfirmResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
        confirmText={language === 'id' ? "Ya, Reset Sekarang" : "Yes, Reset Now"}
      />
    </div>
  );
}
