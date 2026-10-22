"use client";

import React from "react";
import { Category } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryManagerProps {
  categories: Category[];
  isCategoriesLoading: boolean;
  onAddCategory: (cat: { name: string; icon: string; type: "expense" | "income" }) => void;
  onUpdateCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function CategoryManager({
  categories,
  isCategoriesLoading,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  isAdding,
  isUpdating,
  isDeleting,
}: CategoryManagerProps) {
  const { language, t, tCategory } = useLanguage();
  const [showAddCat, setShowAddCat] = React.useState(false);
  const [newCatName, setNewCatName] = React.useState("");
  const [newCatIcon] = React.useState("category");
  const [newCatType, setNewCatType] = React.useState<"expense" | "income">("expense");
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null);
  const [editCatName, setEditCatName] = React.useState("");
  const [catError, setCatError] = React.useState("");

  const handleAdd = () => {
    if (!newCatName) {
      setCatError(language === 'id' ? "Nama kategori tidak boleh kosong" : "Category name cannot be empty");
      return;
    }
    onAddCategory({ name: newCatName, icon: newCatIcon, type: newCatType });
    setNewCatName("");
    setShowAddCat(false);
    setCatError("");
  };

  const handleEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
  };

  const handleSaveEdit = () => {
    if (!editCatName || !editingCatId) return;
    onUpdateCategory(editingCatId, editCatName);
    setEditingCatId(null);
  };

  return (
    <section className="bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-white/20 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)]">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b-2 border-[#08110A]/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#39E75F]/20 border-2 border-[#08110A] dark:border-[#39E75F] flex items-center justify-center text-[#08110A] dark:text-[#39E75F]">
            <span className="material-symbols-outlined text-[20px]">category</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-[#08110A] dark:text-[#F5EFE6]">
              {t("settings_page.category_section.title")}
            </h3>
            <p className="text-xs font-mono text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider">
              Classification & Buckets
            </p>
          </div>
        </div>

        <button 
          type="button"
          onClick={() => setShowAddCat(!showAddCat)}
          className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#0D1910] text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A] dark:border-white/20 shadow-[3px_3px_0px_#08110A] dark:shadow-[3px_3px_0px_rgba(255,255,255,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#08110A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39E75F] transition-all font-mono text-xs uppercase tracking-wider font-bold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t("settings_page.category_section.add_new")}
        </button>
      </div>

      {showAddCat && (
        <div className="mb-6 p-5 border-2 border-[#08110A] dark:border-white/20 rounded-2xl bg-[#FAF8F5] dark:bg-[#08110A] shadow-[4px_4px_0px_#08110A] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.08)] animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="new-cat-name" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70 mb-1.5">{t("settings_page.category_section.name")}</label>
              <input 
                id="new-cat-name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full min-h-[44px] bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/20 dark:border-white/20 rounded-xl px-4 py-2.5 text-sm text-[#08110A] dark:text-[#F5EFE6] outline-none focus:border-[#08110A] dark:focus:border-[#39E75F]"
                type="text" 
                placeholder="Ex: Food, Rent..."
              />
            </div>
            <div>
              <label htmlFor="new-cat-type" className="block text-xs font-mono font-bold uppercase tracking-wider text-[#08110A]/70 dark:text-[#F5EFE6]/70 mb-1.5">{t("common.type")}</label>
              <select 
                id="new-cat-type"
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value as "expense" | "income")}
                className="w-full min-h-[44px] bg-white dark:bg-[#0D1910] border-2 border-[#08110A]/20 dark:border-white/20 rounded-xl px-4 py-2.5 font-mono text-sm font-semibold text-[#08110A] dark:text-[#F5EFE6] outline-none focus:border-[#08110A] dark:focus:border-[#39E75F] cursor-pointer"
              >
                <option value="expense">{t("common.expense")}</option>
                <option value="income">{t("common.income")}</option>
              </select>
            </div>
          </div>
          {catError && <p className="text-[#FB923C] font-mono text-xs mb-3 font-semibold">{catError}</p>}
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setShowAddCat(false)}
              className="min-h-[44px] px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold text-[#08110A]/70 dark:text-[#F5EFE6]/70 hover:text-[#08110A] dark:hover:text-[#F5EFE6] rounded-xl transition-colors cursor-pointer"
            >
              {t("common.cancel")}
            </button>
            <button 
              type="button"
              onClick={handleAdd}
              disabled={isAdding}
              className="min-h-[44px] bg-[#39E75F] text-[#08110A] border-2 border-[#08110A] px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-[3px_3px_0px_#08110A] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50"
            >
              {isAdding ? "..." : t("common.add")}
            </button>
          </div>
        </div>
      )}

      {isCategoriesLoading ? (
        <div className="py-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-[#39E75F] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.isArray(categories) && categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3.5 border-2 border-[#08110A]/15 dark:border-white/15 rounded-2xl bg-[#FAF8F5] dark:bg-[#08110A] group hover:border-[#08110A] dark:hover:border-white/30 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border-2 border-[#08110A]/20 dark:border-white/20 flex items-center justify-center ${
                  cat.type === 'income' 
                    ? 'bg-[#39E75F]/20 text-[#08110A] dark:text-[#39E75F]' 
                    : 'bg-[#FB923C]/20 text-[#FB923C]'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">{cat.icon || 'category'}</span>
                </div>
                {editingCatId === cat.id ? (
                  <input 
                    autoFocus
                    aria-label={t("settings_page.category_section.name")}
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    onBlur={handleSaveEdit}
                    disabled={isUpdating}
                    className="min-h-[40px] bg-white dark:bg-[#0D1910] border-2 border-[#08110A] dark:border-[#39E75F] rounded-lg px-3 py-1 font-mono text-sm text-[#08110A] dark:text-[#F5EFE6] outline-none w-36 disabled:opacity-50"
                  />
                ) : (
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#08110A] dark:text-[#F5EFE6]">{tCategory(cat.name)}</h4>
                    <p className="text-[10px] font-mono text-[#08110A]/60 dark:text-[#F5EFE6]/60 uppercase tracking-wider">{cat.type === 'income' ? t("common.income") : t("common.expense")}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {editingCatId !== cat.id && (
                  <>
                    <button 
                      type="button"
                      onClick={() => handleEdit(cat)}
                      aria-label={`${t("common.edit")} ${tCategory(cat.name)}`}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#08110A]/60 dark:text-[#F5EFE6]/60 hover:text-[#08110A] dark:hover:text-[#39E75F] hover:bg-[#08110A]/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => onDeleteCategory(cat.id)}
                      disabled={isDeleting}
                      aria-label={`${t("common.delete")} ${tCategory(cat.name)}`}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#08110A]/60 dark:text-[#F5EFE6]/60 hover:text-[#FB923C] hover:bg-[#FB923C]/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
