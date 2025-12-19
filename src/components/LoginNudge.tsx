"use client";

import Link from "next/link";
import { Locale, uiTexts } from "@/lib/uiTexts";

interface LoginNudgeProps {
  locale: Locale;
  isOpen: boolean;
  onDismiss: () => void;
}

export function LoginNudge({ locale, isOpen, onDismiss }: LoginNudgeProps) {
  const texts = uiTexts[locale].loginNudge;

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up px-4 max-w-sm w-full">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 overflow-hidden relative">
        {/* Background decorative blob */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

        <h4 className="font-bold text-slate-800 text-base mb-1 relative z-10 flex items-center gap-2">
          {texts.title}
        </h4>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed relative z-10">
          {texts.description}
        </p>
        
        <div className="flex items-center gap-3 relative z-10">
          <Link 
            href={`/${locale}/login`} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl text-center transition-colors shadow-lg shadow-blue-200"
          >
            {texts.action}
          </Link>
          <button 
            onClick={onDismiss} 
            className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            {texts.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}


