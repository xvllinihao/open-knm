"use client";

import { use, Suspense, useEffect, useState } from "react";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { FlashcardGame } from "@/components/FlashcardGame";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { activateLicense } from "@/app/actions/license";

function ResourcesContent({ locale }: { locale: Locale }) {
  const { profile, user } = useAuth();
  const texts = uiTexts[locale].resources;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState("");
  
  const isPro = profile?.tier === "pro";
  const isZh = locale === "zh";

  useEffect(() => {
    if (searchParams.get("purchase_success") === "true") {
      setShowSuccessModal(true);
      const timer = setTimeout(() => setShowSuccessModal(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  
  const handlePurchase = () => {
    if (!user) {
      router.push(`/${locale}/login?returnTo=/${locale}/resources`);
      return;
    }

    const checkoutUrl = "https://open-knm.lemonsqueezy.com/checkout/buy/64c4ef33-597f-4571-8b3f-e58091a817fb";
    const params = new URLSearchParams();
    params.set("checkout[email]", user.email || "");
    params.set("checkout[custom][user_id]", user.id);
    
    window.location.href = `${checkoutUrl}?${params.toString()}`;
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/${locale}/login?returnTo=/${locale}/resources`);
      return;
    }

    if (!activationCode.trim()) return;

    setIsActivating(true);
    setActivationError("");

    try {
      const result = await activateLicense(activationCode, user.id);
      if (result.success) {
        setShowSuccessModal(true);
        setActivationCode("");
        // 3秒后自动刷新页面以更新 AuthContext 中的 profile 状态
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setActivationError(result.error || texts.activation.error);
      }
    } catch {
      setActivationError(texts.activation.error);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 px-4 relative overflow-hidden">
      
      {/* Success Toast */}
      {showSuccessModal && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-500">
            <div className="bg-white/20 rounded-full p-1">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold">
              {texts.activation.success}
            </span>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[400px] h-[400px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <span>✨</span>
          {isZh ? '学习资源' : 'Premium Resources'}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {texts.title}
        </h1>
        <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
          {isPro ? texts.proDescription : texts.description}
        </p>
      </div>

      {/* Flashcard Section */}
      <div className="w-full max-w-4xl mx-auto mb-16">
        <div className="relative">
           <FlashcardGame locale={locale} limit={5} />
        </div>
        <p className="text-center text-sm text-slate-400 mt-4">
          {isZh ? '👆 左右滑动卡片进行练习' : '👆 Swipe cards to practice'}
        </p>
      </div>

      {/* Pricing & Activation Section - Only shown for non-activated users */}
      {!isPro && (
        <div className="w-full max-w-2xl mx-auto space-y-8">
          
          {/* Main Pricing Card */}
          <div className="relative group">
            <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{texts.cta.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{texts.cta.footer}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="block text-4xl font-black text-[var(--primary)]">{texts.cta.price}</span>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {texts.cta.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handlePurchase}
                className="block w-full py-4 px-6 rounded-xl bg-[var(--primary)] text-white text-lg font-bold text-center hover:bg-orange-600 hover:scale-[1.02] transition-all shadow-lg shadow-orange-500/20"
              >
                {texts.cta.action}
              </button>
            </div>
          </div>

          {/* Manual Activation Card */}
          <div className="bg-purple-50 rounded-2xl border border-purple-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                🔑
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-900">{texts.activation.title}</h3>
                <p className="text-purple-600 text-sm">{texts.activation.subtitle}</p>
              </div>
            </div>

            {isZh && (
              <div className="mb-6 p-3 bg-white/50 border border-purple-200 rounded-xl text-xs text-purple-700 leading-relaxed">
                {texts.activation.xhsNotice}
              </div>
            )}

            <form onSubmit={handleActivate} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder={texts.activation.placeholder}
                  className="flex-1 px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 placeholder:text-slate-400"
                  disabled={isActivating}
                />
                <button
                  type="submit"
                  disabled={isActivating || !activationCode.trim()}
                  className="bg-purple-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isActivating ? "..." : texts.activation.button}
                </button>
              </div>
              {activationError && (
                <p className="text-sm text-red-600 font-medium animate-shake">
                  {activationError}
                </p>
              )}
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

export default function ResourcesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ResourcesContent locale={locale} />
    </Suspense>
  );
}
