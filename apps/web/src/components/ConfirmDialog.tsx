"use client";

import React, { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  isDestructive = true,
}: ConfirmDialogProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="bg-surface w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/20 flex flex-col p-6 gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-error-container/20 text-error' : 'bg-primary-container/20 text-primary'}`}>
            <span className="material-symbols-outlined text-[24px]">
              {isDestructive ? 'warning' : 'info'}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-background">
              {title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onCancel}
            className="font-body-sm text-body-sm font-semibold text-on-surface-variant hover:bg-surface-variant/50 px-4 py-2 rounded-lg transition-colors"
          >
            {cancelText || t("common.cancel") || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={`font-body-sm text-body-sm font-semibold text-white px-5 py-2 rounded-lg transition-all hover:scale-[1.02] shadow-sm ${isDestructive ? 'bg-error hover:bg-error/95' : 'bg-primary hover:bg-primary/95'}`}
          >
            {confirmText || t("common.confirm") || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
