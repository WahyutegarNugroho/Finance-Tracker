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

export default function Settings() {
  const { user, loading: authLoading, logout, setCurrency: setGlobalCurrency } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t, tCategory } = useLanguage();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Settings state
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("IDR");

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

  const categories = categoriesData?.data || [];

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
              if (confirm(language === 'id' ? "Hapus kategori ini?" : "Delete this category?")) {
                deleteCategoryMutation.mutate(id);
              }
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
                className="bg-error text-on-error font-label-caps text-label-caps px-6 py-2.5 rounded-lg hover:bg-error/90 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                {t("common.logout")}
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNav activePath="/settings" />
    </div>
  );
}
