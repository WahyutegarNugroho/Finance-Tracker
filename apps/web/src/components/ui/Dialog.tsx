"use client";

import React, { useEffect, useRef } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  titleId?: string;
  ariaLabel?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export default function Dialog({
  isOpen,
  onClose,
  titleId,
  ariaLabel,
  children,
  maxWidthClass = "max-w-md",
  initialFocusRef,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable && focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose, initialFocusRef]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={!titleId ? ariaLabel : undefined}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`bg-surface w-full ${maxWidthClass} rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/20`}
      >
        {children}
      </div>
    </div>
  );
}
