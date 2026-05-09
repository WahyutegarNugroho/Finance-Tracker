"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import BottomNav from "@/components/BottomNav";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function Settings() {
  const { user, loading: authLoading, logout, setCurrency: setGlobalCurrency } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("IDR");

  // Category management state
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("category");
  const [newCatType, setNewCatType] = useState<"expense" | "income">("expense");
  const [addingCat, setAddingCat] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [catError, setCatError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [profileRes, categoriesRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/categories")
        ]);
        
        setProfile(profileRes.data);
        setDisplayName(profileRes.data.displayName || "");
        setCurrency(profileRes.data.currency || "IDR");
        
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Failed to load settings data", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    setCatError("");
    try {
      await api.post("/categories", {
        name: newCatName.trim(),
        icon: newCatIcon || "category",
        type: newCatType,
      });
      setNewCatName("");
      setNewCatIcon("category");
      setNewCatType("expense");
      setShowAddCat(false);
      await fetchCategories();
    } catch (err: any) {
      setCatError("Failed to add category.");
    } finally {
      setAddingCat(false);
    }
  };

  const handleEditCategory = async (catId: string) => {
    if (!editCatName.trim()) return;
    setCatError("");
    try {
      await api.put(`/categories/${catId}`, { name: editCatName.trim() });
      setEditingCatId(null);
      setEditCatName("");
      await fetchCategories();
    } catch (err: any) {
      setCatError("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    setCatError("");
    try {
      const res = await api.delete(`/categories/${catId}`);
      if (res.data?.success === false) {
        setCatError(res.data.message || "Cannot delete this category.");
        return;
      }
      await fetchCategories();
    } catch (err: any) {
      // The backend returns a 400 with a message if the category has transactions
      const msg = err?.data?.message || err?.message || "";
      if (msg.includes("transactions") || msg.includes("Cannot delete")) {
        setCatError(`Cannot delete "${catName}" — it has existing transactions. Delete or reassign them first.`);
      } else {
        setCatError(`Failed to delete "${catName}".`);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) return;
    
    setSaving(true);
    try {
      await api.put("/users/profile", {
        displayName,
        currency
      });
      // Update the global currency in AuthContext so all pages reflect the change immediately
      setGlobalCurrency(currency);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
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
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col w-full">
      <Topbar />
      <Sidebar activePath="/settings" />
      <BottomNav activePath="/settings" />

      {/* Main Content */}
      <main className="pt-[88px] pb-[88px] md:pb-8 px-4 md:pl-[284px] md:pr-8 min-h-screen w-full">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-background">{t("settings_page.title")}</h2>
              <p className="font-body-lg text-body-lg text-outline mt-1">{t("settings_page.subtitle")}</p>
            </div>
            
            <button 
              onClick={logout}
              className="bg-error/10 text-error hover:bg-error/20 font-label-caps text-label-caps px-4 py-2 rounded-lg transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              {t("common.logout")}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Profile & Appearance */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Profile Section */}
              <section className="bg-surface/80 backdrop-blur-[12px] border border-white/10 border-outline-variant/20 rounded-xl p-6 shadow-sm">
                <h3 className="font-headline-md text-headline-md text-on-background mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  {t("settings_page.profile_section.title")}
                </h3>
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-8">
                  <div className="relative">
                    <img 
                      alt={displayName} 
                      className="w-24 h-24 rounded-full border-2 border-primary/20 shadow-sm object-cover bg-surface-variant flex items-center justify-center text-on-surface-variant font-display text-4xl" 
                      src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`}
                    />
                  </div>
                  <div className="flex-grow w-full">
                    <div className="mb-4">
                      <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase">{t("settings_page.profile_section.full_name")}</label>
                      <input 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-surface-variant/30 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-lg text-body-lg text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                        type="text" 
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase">{t("settings_page.profile_section.email")}</label>
                      <input 
                        value={user?.email || ""}
                        disabled
                        className="w-full bg-surface-variant/10 border border-outline-variant/10 rounded-lg px-4 py-2 font-body-lg text-body-lg text-outline outline-none cursor-not-allowed" 
                        type="email" 
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-6">
                  <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase">{t("settings_page.profile_section.primary_currency")}</label>
                  <div className="relative w-full sm:w-1/2">
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full appearance-none bg-surface-variant/30 border border-outline-variant/30 rounded-lg px-4 py-3 font-body-lg text-body-lg text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer pr-10"
                    >
                      <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
                      <option value="USD">USD ($) - United States Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-lg hover:scale-[1.02] hover:bg-primary-container transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                      t("settings_page.profile_section.save_changes")
                    )}
                  </button>
                </div>
              </section>

              {/* Appearance Section */}
              <section className="bg-surface/80 backdrop-blur-[12px] border border-white/10 border-outline-variant/20 rounded-xl p-6 shadow-sm">
                <h3 className="font-headline-md text-headline-md text-on-background mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">palette</span>
                  {t("settings_page.appearance_section.title")}
                </h3>
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 border border-outline-variant/30 rounded-lg bg-surface-variant/20 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-variant/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface">dark_mode</span>
                    </div>
                    <div>
                      <h4 className="font-body-lg text-body-lg font-medium text-on-surface">{t("common.dark_mode")}</h4>
                      <p className="font-body-sm text-body-sm text-outline">{t("settings_page.appearance_section.dark_mode_desc")}</p>
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      className="sr-only peer" 
                      type="checkbox" 
                      checked={theme === 'dark'} 
                      onChange={toggleTheme} 
                    />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Language Selector */}
                <div className="flex items-center justify-between p-4 border border-outline-variant/30 rounded-lg bg-surface-variant/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-variant/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface">language</span>
                    </div>
                    <div>
                      <h4 className="font-body-lg text-body-lg font-medium text-on-surface">{t("settings_page.appearance_section.language")}</h4>
                      <p className="font-body-sm text-body-sm text-outline">{t("settings_page.appearance_section.language_desc")}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="appearance-none bg-surface-variant/30 border border-outline-variant/30 rounded-lg px-4 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer pr-10"
                    >
                      <option value="en">English (US)</option>
                      <option value="id">Bahasa Indonesia</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[18px]">expand_more</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Category Management */}
            <div className="lg:col-span-5">
              <section className="bg-surface/80 backdrop-blur-[12px] border border-white/10 border-outline-variant/20 rounded-xl p-6 shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">category</span>
                    {t("settings_page.categories_section.title")}
                  </h3>
                  <button 
                    onClick={() => { setShowAddCat(!showAddCat); setCatError(""); }}
                    className="flex items-center gap-1 text-primary font-label-caps text-label-caps hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">{showAddCat ? 'close' : 'add'}</span>
                    {showAddCat ? t("common.cancel") : t("settings_page.categories_section.add_new")}
                  </button>
                </div>
                <p className="font-body-sm text-body-sm text-outline mb-4">{t("settings_page.categories_section.subtitle")}</p>

                {catError && (
                  <div className="mb-4 p-3 bg-error-container/50 text-error text-sm rounded-lg flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">warning</span>
                    <span>{catError}</span>
                    <button onClick={() => setCatError("")} className="ml-auto shrink-0 hover:bg-error/10 rounded-full p-0.5">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                )}

                {/* Add Category Form */}
                {showAddCat && (
                  <div className="mb-4 p-4 border border-primary/30 rounded-xl bg-primary/5 flex flex-col gap-3">
                    <input
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 bg-surface border border-outline-variant/30 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder={t("settings_page.categories_section.category_name")}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <div className="flex gap-3">
                      <input
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        className="flex-1 px-3 py-2 bg-surface border border-outline-variant/30 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder={t("settings_page.categories_section.icon_name")}
                      />
                      <select
                        value={newCatType}
                        onChange={(e) => setNewCatType(e.target.value as "expense" | "income")}
                        className="px-3 py-2 bg-surface border border-outline-variant/30 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                      >
                        <option value="expense">{t("common.expense")}</option>
                        <option value="income">{t("common.income")}</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${newCatType === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-sm">{newCatIcon || 'category'}</span>
                      </div>
                      <span className="text-sm text-on-surface-variant">{t("settings_page.categories_section.preview")}</span>
                      <button
                        onClick={handleAddCategory}
                        disabled={addingCat || !newCatName.trim()}
                        className="ml-auto bg-primary text-on-primary text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {addingCat ? t("common.loading") : t("common.add")}
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 flex-grow overflow-y-auto pr-2 max-h-[500px]">
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 border border-outline-variant/30 rounded-lg bg-surface-variant/10 hover:bg-surface-variant/30 transition-colors group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-full shrink-0 ${c.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-sm">{c.icon || 'category'}</span>
                        </div>
                        
                        {editingCatId === c.id ? (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <input
                              autoFocus
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditCategory(c.id);
                                if (e.key === 'Escape') { setEditingCatId(null); setEditCatName(""); }
                              }}
                              className="flex-1 min-w-0 px-2 py-1 bg-surface border border-primary/50 rounded text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <button onClick={() => handleEditCategory(c.id)} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors shrink-0">
                              <span className="material-symbols-outlined text-[18px]">check</span>
                            </button>
                            <button onClick={() => { setEditingCatId(null); setEditCatName(""); }} className="text-outline hover:bg-surface-variant p-1 rounded transition-colors shrink-0">
                              <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-body-sm text-body-sm font-medium text-on-surface truncate">{c.name}</span>
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${c.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>{c.type}</span>
                          </>
                        )}
                      </div>
                      
                      {editingCatId !== c.id && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                          <button 
                            onClick={() => { setEditingCatId(c.id); setEditCatName(c.name); setCatError(""); }}
                            className="text-outline hover:text-primary transition-colors p-1.5 rounded hover:bg-primary/10"
                            title={t("common.edit")}
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="text-outline hover:text-error transition-colors p-1.5 rounded hover:bg-error/10"
                            title={t("common.delete")}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
