"use client";

import React, { useEffect, useState } from "react";

type ResumePromptProps = {
  message: string;
  confirmText: string;
  dismissText: string;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function ResumePrompt({
  message,
  confirmText,
  dismissText,
  onConfirm,
  onDismiss,
}: ResumePromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transform rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 transition-all duration-500 ease-out sm:bottom-8 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-700">{message}</p>
        <div className="flex gap-2 sm:shrink-0">
          <button
            onClick={onDismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {dismissText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-orange-200 hover:brightness-110 active:scale-95 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
