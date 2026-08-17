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
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      titleId="confirm-dialog-title"
      maxWidthClass="max-w-sm"
      initialFocusRef={cancelBtnRef}
    >
      <div className="flex flex-col p-6 gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive
                ? "bg-error-container/20 text-error"
                : "bg-primary-container/20 text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isDestructive ? "warning" : "info"}
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h3
              id="confirm-dialog-title"
              className="font-headline-sm text-headline-sm font-bold text-on-background"
            >
              {title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="font-body-sm text-body-sm font-semibold text-on-surface-variant hover:bg-surface-variant/50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            {cancelText || t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`font-body-sm text-body-sm font-semibold text-white px-5 py-2 rounded-lg transition-all hover:scale-[1.02] shadow-sm cursor-pointer ${
              isDestructive
                ? "bg-error hover:bg-error/95"
                : "bg-primary hover:bg-primary/95"
            }`}
          >
            {confirmText || t("common.confirm")}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
