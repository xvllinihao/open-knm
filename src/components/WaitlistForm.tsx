"use client";

import { useState, useEffect, useRef } from "react";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { joinWaitlist, getWaitlistCount } from "@/app/actions/waitlist";
import { useAuth } from "@/contexts/AuthContext";
import { Turnstile } from '@marsidev/react-turnstile';

interface WaitlistFormProps {
  locale: Locale;
  onSuccess?: () => void;
}

// 基础人数偏移
const BASE_COUNT_OFFSET = 37;

export function WaitlistForm({ locale, onSuccess }: WaitlistFormProps) {
  const { user } = useAuth();
  const texts = uiTexts[locale].wishlist;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "exists">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<any>(null);
  const isZh = locale === "zh";

  // 自动填充登录用户的邮箱
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    getWaitlistCount().then(setCount);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (!user && !turnstileToken) {
        setErrorMessage(isZh ? "请完成人机验证" : "Please complete the captcha");
        setStatus("error");
        return;
    }

    setStatus("loading");
    try {
      const result = await joinWaitlist(email, turnstileToken);
      if (result.success) {
        setTurnstileToken(""); // Clear token after successful use
        turnstileRef.current?.reset(); // Reset Turnstile widget
        if (result.message === "Already on the list!") {
          setStatus("exists");
          // 已在名单中也调用 onSuccess，更新父组件状态
          onSuccess?.();
        } else {
          setStatus("success");
          onSuccess?.();
        }
      } else {
        setStatus("error");
        setErrorMessage(result.error || texts.error);
        setTurnstileToken(""); // Clear invalid token
        turnstileRef.current?.reset(); // Reset to get new token
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(texts.error);
      setTurnstileToken(""); // Clear token on error
      turnstileRef.current?.reset(); // Reset to get new token
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      {/* Form Container */}
      <div className="w-full bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2">
        {status === "success" ? (
           <div className="w-full h-12 flex items-center justify-center text-green-600 font-bold bg-green-50 rounded-xl">
             {texts.success}
           </div>
        ) : status === "exists" ? (
           <div className="w-full h-12 flex items-center justify-center text-blue-600 font-bold bg-blue-50 rounded-xl">
             {texts.exists}
           </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
                {user?.email ? (
                // 已登录用户显示只读邮箱
                <div className="flex-1 min-w-0 px-4 py-3 text-slate-700 bg-slate-50 rounded-xl text-center sm:text-left flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                </div>
                ) : (
                <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent px-4 py-3 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-center sm:text-left"
                    placeholder={texts.placeholder}
                    disabled={status === "loading"}
                />
                )}
                <button
                type="submit"
                disabled={status === "loading" || !email}
                className="flex-none rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {status === "loading" ? "..." : texts.action}
                </button>
            </div>
            
            {/* Turnstile: Only show for non-logged in users */}
            {!user && (
                <div className="flex justify-center mt-1">
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
                        options={{ theme: 'light', size: 'flexible' }}
                    />
                </div>
            )}
          </form>
        )}
      </div>

      
      {/* Error Message */}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}

      {/* Offer Text */}
      <p className="mt-4 text-sm text-slate-400 font-medium">
        {texts.offer}
      </p>

      {/* Social Proof */}
      {count !== null && (
        <div className="mt-8 flex items-center gap-4 bg-white/60 px-4 py-2 rounded-full border border-slate-100/50 backdrop-blur-sm">
          <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full bg-orange-200 border-2 border-white"></div>
             <div className="w-8 h-8 rounded-full bg-orange-300 border-2 border-white"></div>
             <div className="w-8 h-8 rounded-full bg-green-300 border-2 border-white"></div>
             <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
          </div>
          <span className="text-sm font-bold text-slate-700">
            {count + BASE_COUNT_OFFSET} {texts.socialProof}
          </span>
        </div>
      )}
    </div>
  );
}
