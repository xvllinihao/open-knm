"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, use, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Locale } from "@/lib/uiTexts";
import { Turnstile } from '@marsidev/react-turnstile';

// 简洁的眼睛图标组件
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    // 睁眼 - 显示密码状态
    return (
      <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  // 闭眼 - 隐藏密码状态
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const { user, signInWithEmail, signUpWithEmail, resetPassword, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<any>(null);

  const isZh = locale === "zh";
  const texts = {
    title: isZh ? "登录 Open KNM" : "Sign in to Open KNM",
    registerTitle: isZh ? "注册 Open KNM" : "Create an Account",
    forgotTitle: isZh ? "重置密码" : "Reset Password",
    subtitle: isZh ? "同步进度、解锁 Pro 功能" : "Sync progress & unlock Pro features",
    forgotSubtitle: isZh ? "输入邮箱，我们将发送重置链接" : "Enter your email and we'll send a reset link",
    email: isZh ? "邮箱地址" : "Email address",
    password: isZh ? "密码" : "Password",
    confirmPassword: isZh ? "确认密码" : "Confirm password",
    passwordPlaceholder: isZh ? "输入密码" : "Enter password",
    newPasswordPlaceholder: isZh ? "至少 6 个字符" : "At least 6 characters",
    confirmPlaceholder: isZh ? "再次输入密码" : "Re-enter password",
    loginBtn: isZh ? "登录" : "Sign In",
    registerBtn: isZh ? "注册" : "Sign Up",
    resetBtn: isZh ? "发送重置邮件" : "Send Reset Email",
    noAccount: isZh ? "还没有账号？" : "Don't have an account?",
    hasAccount: isZh ? "已有账号？" : "Already have an account?",
    register: isZh ? "立即注册" : "Sign up",
    login: isZh ? "立即登录" : "Sign in",
    forgotPassword: isZh ? "忘记密码？" : "Forgot password?",
    backToLogin: isZh ? "返回登录" : "Back to login",
    passwordMismatch: isZh ? "两次输入的密码不一致" : "Passwords do not match",
    passwordTooShort: isZh ? "密码至少需要 6 个字符" : "Password must be at least 6 characters",
    registerSuccess: isZh ? "注册成功！请检查邮箱以验证账号。" : "Registration successful! Please check your email to verify your account.",
    resetSuccess: isZh ? "重置邮件已发送！请检查您的邮箱（包括垃圾邮件）。" : "Reset email sent! Please check your inbox (and spam folder).",
    invalidEmail: isZh ? "请输入有效的邮箱地址" : "Please enter a valid email address",
    showPassword: isZh ? "显示密码" : "Show password",
    hidePassword: isZh ? "隐藏密码" : "Hide password",
    authError: isZh ? "验证链接无效或已过期，请重试。" : "Authentication link is invalid or expired. Please try again.",
  };

  useEffect(() => {
    if (user && !loading) {
      router.push(`/${locale}`);
    }
  }, [user, loading, router, locale]);

  // Check for errors in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      // If it's our specific code, use translated message, otherwise show the error directly
      if (errorParam === 'AuthCodeError') {
        setError(texts.authError);
      } else {
        setError(decodeURIComponent(errorParam));
      }
    }
  }, [searchParams, texts.authError]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError(texts.invalidEmail);
      return;
    }

    // Forgot mode: only need email and captcha
    if (mode === "forgot") {
      if (!turnstileToken) {
        setError(isZh ? "请完成人机验证" : "Please complete the captcha");
        return;
      }
      
      setIsSubmitting(true);
      try {
        const result = await resetPassword(email, turnstileToken);
        if (result.success) {
          setSuccess(texts.resetSuccess);
          setEmail("");
          setTurnstileToken(""); // Clear token after successful use
          turnstileRef.current?.reset(); // Reset Turnstile widget
        } else {
          setError(result.error || "Failed to send reset email");
          setTurnstileToken(""); // Clear invalid token
          turnstileRef.current?.reset(); // Reset to get new token
        }
      } catch {
        setError("An unexpected error occurred");
        setTurnstileToken(""); // Clear token on error
        turnstileRef.current?.reset(); // Reset to get new token
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (password.length < 6) {
      setError(texts.passwordTooShort);
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError(texts.passwordMismatch);
      return;
    }

    if (!turnstileToken) {
        setError(isZh ? "请完成人机验证" : "Please complete the captcha");
        return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const result = await signInWithEmail(email, password, turnstileToken);
        if (!result.success) {
          setError(result.error || "Login failed");
          setTurnstileToken(""); // Clear token on failure
          turnstileRef.current?.reset(); // Reset to get new token
        } else {
          setTurnstileToken(""); // Clear token after successful use
          turnstileRef.current?.reset(); // Reset Turnstile widget
        }
      } else {
        const result = await signUpWithEmail(email, password, turnstileToken);
        if (result.success) {
          setSuccess(texts.registerSuccess);
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setTurnstileToken(""); // Clear token after successful use
          turnstileRef.current?.reset(); // Reset Turnstile widget
        } else {
          setError(result.error || "Registration failed");
          setTurnstileToken(""); // Clear token on failure
          turnstileRef.current?.reset(); // Reset to get new token
        }
      }
    } catch {
      setError("An unexpected error occurred");
      setTurnstileToken(""); // Clear token on error
      turnstileRef.current?.reset(); // Reset to get new token
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {mode === "login" ? texts.title : mode === "register" ? texts.registerTitle : texts.forgotTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {mode === "forgot" ? texts.forgotSubtitle : texts.subtitle}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm text-center">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              {texts.email}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password fields - hide in forgot mode */}
          {mode !== "forgot" && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  {texts.password}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-colors"
                    placeholder={mode === "login" ? texts.passwordPlaceholder : texts.newPasswordPlaceholder}
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
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
                {/* Forgot password link - only in login mode */}
                {mode === "login" && (
                  <div className="mt-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                        setSuccess("");
                        setTurnstileToken(""); // Reset token when switching modes
                        turnstileRef.current?.reset(); // Reset Turnstile widget
                      }}
                      className="text-xs text-slate-500 hover:text-[var(--primary)] transition-colors"
                    >
                      {texts.forgotPassword}
                    </button>
                  </div>
                )}
              </div>

              {mode === "register" && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    {texts.confirmPassword}
                  </label>
                  <div className="relative">
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
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "..." : mode === "login" ? texts.loginBtn : mode === "register" ? texts.registerBtn : texts.resetBtn}
          </button>

          {/* Turnstile Captcha */}
          <div className="flex justify-center pt-2">
            <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""} 
                onSuccess={setTurnstileToken}
                onExpire={() => {
                  setTurnstileToken(""); // Clear expired token
                }}
                onError={() => {
                  setTurnstileToken(""); // Clear token on error
                }}
                ref={turnstileRef}
                options={{ theme: 'light', size: 'normal' }}
            />
          </div>
        </form>

        {/* Switch Mode */}
        <p className="text-center text-sm text-slate-600">
          {mode === "forgot" ? (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
                setTurnstileToken(""); // Reset token when switching modes
                turnstileRef.current?.reset(); // Reset Turnstile widget
              }}
              className="font-semibold text-[var(--primary)] hover:text-orange-600"
            >
              ← {texts.backToLogin}
            </button>
          ) : (
            <>
              {mode === "login" ? texts.noAccount : texts.hasAccount}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setSuccess("");
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                  setTurnstileToken(""); // Reset token when switching modes
                  turnstileRef.current?.reset(); // Reset Turnstile widget
                }}
                className="font-semibold text-[var(--primary)] hover:text-orange-600"
              >
                {mode === "login" ? texts.register : texts.login}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
