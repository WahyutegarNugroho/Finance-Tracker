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
  isDeleting: boolean;
}

export default function CategoryManager({
  categories,
  isCategoriesLoading,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  isAdding,
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
    <section className="bg-surface/80 backdrop-blur-[12px] border border-white/10 border-outline-variant/20 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">category</span>
          {t("settings_page.category_section.title")}
        </h3>
        <button 
          onClick={() => setShowAddCat(!showAddCat)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-label-caps text-label-caps"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t("settings_page.category_section.add_new")}
        </button>
      </div>

      {showAddCat && (
        <div className="mb-6 p-4 border border-outline-variant/30 rounded-xl bg-surface-variant/10 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-outline mb-1 uppercase tracking-wider">{t("settings_page.category_section.name")}</label>
              <input 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-body-sm outline-none focus:border-primary"
                type="text" 
                placeholder="Ex: Food, Rent..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-outline mb-1 uppercase tracking-wider">{t("common.type")}</label>
              <select 
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value as "expense" | "income")}
                className="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 text-body-sm outline-none focus:border-primary"
              >
                <option value="expense">{t("common.expense")}</option>
                <option value="income">{t("common.income")}</option>
              </select>
            </div>
          </div>
          {catError && <p className="text-error text-[11px] mb-3">{catError}</p>}
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowAddCat(false)}
              className="px-4 py-1.5 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button 
              onClick={handleAdd}
              disabled={isAdding}
              className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-body-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
            >
              {isAdding ? "..." : t("common.add")}
            </button>
          </div>
        </div>
      )}

      {isCategoriesLoading ? (
        <div className="py-8 flex justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 border border-outline-variant/20 rounded-lg bg-surface-variant/5 group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-[20px]">{cat.icon || 'category'}</span>
                </div>
                {editingCatId === cat.id ? (
                  <input 
                    autoFocus
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    onBlur={handleSaveEdit}
                    className="bg-surface border border-primary/30 rounded px-2 py-1 text-body-sm outline-none w-32"
                  />
                ) : (
                  <div>
                    <h4 className="font-body-sm text-body-sm font-medium text-on-surface">{tCategory(cat.name)}</h4>
                    <p className="text-[10px] text-outline uppercase tracking-wider">{cat.type === 'income' ? t("common.income") : t("common.expense")}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingCatId !== cat.id && (
                  <>
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 text-outline hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => onDeleteCategory(cat.id)}
                      disabled={isDeleting}
                      className="p-1.5 text-outline hover:text-error transition-colors"
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
