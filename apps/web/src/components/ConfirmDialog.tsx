"use client";

import React, { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Dialog from "@/components/ui/Dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
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
  isLoading = false,
}: ConfirmDialogProps) {
  const { t } = useLanguage();
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onCancel}
      titleId="confirm-dialog-title"
      maxWidthClass="max-w-sm"
      initialFocusRef={cancelBtnRef}
    >
      <div className="flex flex-col p-6 gap-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl border-2 border-[#08110A] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#08110A] ${
              isDestructive
                ? "bg-[#FB923C] text-[#08110A]"
                : "bg-[#7DD3FC] text-[#08110A]"
            }`}
          >
            <span className="material-symbols-outlined text-[24px] font-bold">
              {isDestructive ? "warning" : "info"}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h3
              id="confirm-dialog-title"
              className="font-display font-black text-lg uppercase tracking-tight text-[#08110A] dark:text-white"
            >
              {title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#08110A]/70 dark:text-[#F5EFE6]/70 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="font-display font-black text-xs uppercase tracking-wider text-[#08110A] dark:text-[#F5EFE6] border-2 border-[#08110A]/20 dark:border-white/20 hover:bg-[#FAF8F5] dark:hover:bg-white/10 px-5 py-2.5 rounded-full transition-colors cursor-pointer min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {cancelText || t("common.cancel")}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`font-display font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-full border-2 border-[#08110A] transition-all shadow-[2px_2px_0px_#08110A] active:translate-y-0.5 cursor-pointer min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
              isDestructive
                ? "bg-[#FB923C] hover:bg-[#f97316] text-[#08110A]"
                : "bg-[#39E75F] hover:bg-[#2ed652] text-[#08110A]"
            }`}
          >
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-[#08110A] border-t-transparent rounded-full animate-spin" />
            )}
            <span>{isLoading ? t("common.deleting") : (confirmText || t("common.confirm"))}</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
