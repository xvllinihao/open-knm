"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale } from "@/lib/uiTexts";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

// 简洁的眼睛图标组件
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function ResetPasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const { updatePassword, loading, user } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extra loading state for force session check
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Force check session on mount to rescue lost cookie scenarios
  useEffect(() => {
    const checkSession = async () => {
      // If AuthContext is already loaded and has user, no need to check
      if (!loading && user) {
        setIsCheckingSession(false);
        return;
      }
      
      // If AuthContext loaded but no user, try one last force check
      if (!loading && !user) {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        if (data.session) {
           // If we found a session, just wait for AuthContext to pick it up (it listens to changes)
           // or we can just proceed if we trust this session. 
           // But AuthContext updates are usually fast.
           // Let's give it a small delay
           setTimeout(() => setIsCheckingSession(false), 500);
        } else {
           setIsCheckingSession(false);
        }
      }
    };
    
    checkSession();
  }, [loading, user]);

  const isZh = locale === "zh";
  const texts = {
    title: isZh ? "设置新密码" : "Set New Password",
    subtitle: isZh ? "请输入您的新密码" : "Please enter your new password",
    password: isZh ? "新密码" : "New Password",
    confirmPassword: isZh ? "确认新密码" : "Confirm New Password",
    passwordPlaceholder: isZh ? "至少 6 个字符" : "At least 6 characters",
    confirmPlaceholder: isZh ? "再次输入新密码" : "Re-enter new password",
    submit: isZh ? "更新密码" : "Update Password",
    passwordMismatch: isZh ? "两次输入的密码不一致" : "Passwords do not match",
    passwordTooShort: isZh ? "密码至少需要 6 个字符" : "Password must be at least 6 characters",
    successTitle: isZh ? "密码已更新！" : "Password Updated!",
    successMessage: isZh ? "您的密码已成功更新。" : "Your password has been successfully updated.",
    goToHome: isZh ? "返回首页" : "Go to Home",
    invalidLink: isZh ? "链接无效或已过期" : "Invalid or expired link",
    invalidLinkMessage: isZh ? "请尝试重新发送重置密码邮件。" : "Please try sending the reset password email again.",
    backToLogin: isZh ? "返回登录" : "Back to Login",
    showPassword: isZh ? "显示密码" : "Show password",
    hidePassword: isZh ? "隐藏密码" : "Hide password",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(texts.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(texts.passwordMismatch);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updatePassword(password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 3000);
      } else {
        setError(result.error || "Failed to update password");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isCheckingSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  // Session missing state
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {texts.invalidLink}
          </h2>
          <p className="text-sm text-slate-600">{texts.invalidLinkMessage}</p>
          <Link
            href={`/${locale}/login`}
            className="inline-block rounded-lg bg-[var(--primary)] px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-orange-600"
          >
            {texts.backToLogin}
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {texts.successTitle}
          </h2>
          <p className="text-sm text-slate-600">{texts.successMessage}</p>
          <Link
            href={`/${locale}`}
            className="inline-block rounded-lg bg-[var(--primary)] px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-orange-600"
          >
            {texts.goToHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {texts.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{texts.subtitle}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              {texts.password}
            </label>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors"
                placeholder={texts.passwordPlaceholder}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded"
                aria-label={showPassword ? texts.hidePassword : texts.showPassword}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
              {texts.confirmPassword}
            </label>
            <div className="relative group">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors"
                placeholder={texts.confirmPlaceholder}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors rounded"
                aria-label={showConfirmPassword ? texts.hidePassword : texts.showPassword}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {/* 密码匹配提示 */}
            {confirmPassword && password && (
              <p className={`text-xs mt-1.5 ${password === confirmPassword ? 'text-green-600' : 'text-amber-600'}`}>
                {password === confirmPassword 
                  ? (isZh ? '✓ 密码匹配' : '✓ Passwords match')
                  : (isZh ? '密码不匹配' : 'Passwords do not match')
                }
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (confirmPassword !== '' && password !== confirmPassword)}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "..." : texts.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

