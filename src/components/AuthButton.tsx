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
  const { user, loading } = useAuth();
  const texts = uiTexts[locale].auth;

  if (loading) {
    if (mobile) {
      return <div className="h-9 w-20 animate-pulse bg-slate-100 rounded" />;
    }
    return <div className="h-9 w-20 animate-pulse bg-slate-100 rounded-full" />;
  }

  // 已登录 - 显示账户链接
  if (user) {
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
      </Link>
    );
  }

  // 未登录 - 显示登录按钮（更显眼的样式）
  if (mobile) {
    return (
      <Link
        href={getLocalizedPath(locale, "/login")}
        onClick={onClose}
        className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 bg-[var(--primary)] text-white font-bold hover:brightness-110 transition-all mb-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
        </svg>
        <span>{texts.login}</span>
      </Link>
    );
  }

  return (
    <Link
      href={getLocalizedPath(locale, "/login")}
      className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white shadow-sm hover:brightness-110 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd" />
      </svg>
      <span>{texts.login}</span>
    </Link>
  );
}
