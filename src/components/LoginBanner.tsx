"use client";

import { Locale } from "@/lib/uiTexts";

interface LoginBannerProps {
  locale: Locale;
  onDismiss: () => void;
}

export function LoginBanner({ locale, onDismiss }: LoginBannerProps) {
  const isZh = locale === "zh";

  const message = isZh 
    ? "💡 登录即可多端同步学习进度" 
    : "💡 Log in to sync your progress across devices";

  return (
    <div className="bg-orange-50 border-b border-orange-100 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-4">
        <p className="text-sm text-orange-700 font-medium flex-1">
          {message}
        </p>
        
        <button
          onClick={onDismiss}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-orange-100 transition-colors flex-shrink-0"
          aria-label={isZh ? "关闭" : "Dismiss"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

