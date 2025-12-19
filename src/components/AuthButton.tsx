"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Locale, uiTexts, getLocalizedPath } from "@/lib/uiTexts";
import Link from "next/link";

interface AuthButtonProps {
  locale: Locale;
  mobile?: boolean;
  onClose?: () => void;
}

export function AuthButton({ locale, mobile, onClose }: AuthButtonProps) {
  const { user, profile, loading } = useAuth();
  const texts = uiTexts[locale].auth;

  if (loading) {
    if (mobile) {
      return <div className="h-9 w-20 animate-pulse bg-slate-100 rounded" />;
    }
    return <div className="h-9 w-20 animate-pulse bg-slate-100 rounded" />;
  }

  // 已登录 - 显示账户链接
  if (user) {
    const isPro = profile?.tier === "pro";
    
    if (mobile) {
      return (
        <Link
          href={getLocalizedPath(locale, "/profile")}
          onClick={onClose}
          className="w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-slate-700 hover:bg-slate-50"
        >
          <span className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </span>
            <span>{texts.myProfile}</span>
            {isPro && (
              <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full uppercase font-bold">Pro</span>
            )}
          </span>
          <span className="text-slate-300">→</span>
        </Link>
      );
    }

    return (
      <Link
        href={getLocalizedPath(locale, "/profile")}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[var(--primary)] transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {user.email?.charAt(0).toUpperCase() || "U"}
        </span>
        <span className="hidden lg:inline">{texts.myProfile}</span>
        {isPro && (
          <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full uppercase font-bold">Pro</span>
        )}
      </Link>
    );
  }

  // 未登录 - 显示登录链接
  if (mobile) {
    return (
      <Link
        href={getLocalizedPath(locale, "/login")}
        onClick={onClose}
        className="w-full text-left flex items-center justify-between rounded-lg px-2 py-1.5 text-slate-700 hover:bg-slate-50"
      >
        <span>{texts.login}</span>
        <span className="text-slate-300">→</span>
      </Link>
    );
  }

  return (
    <Link
      href={getLocalizedPath(locale, "/login")}
      className="text-sm font-medium text-slate-600 hover:text-[var(--primary)] transition-colors"
    >
      {texts.login}
    </Link>
  );
}
