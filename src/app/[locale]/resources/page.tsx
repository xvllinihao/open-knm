"use client";

import { use } from "react";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { FlashcardGame } from "@/components/FlashcardGame";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ResourcesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const { profile, user } = useAuth();
  const texts = uiTexts[locale].resources;
  const router = useRouter();
  
  const isPro = profile?.tier === "pro";
  
  const handlePurchase = () => {
    if (!user) {
      // 未登录，先登录
      router.push(`/${locale}/login?returnTo=/${locale}/resources`);
      return;
    }

    // 已登录，跳转到 Lemon Squeezy，并透传 email 和 user_id
    const checkoutUrl = "https://open-knm.lemonsqueezy.com/checkout/buy/64c4ef33-597f-4571-8b3f-e58091a817fb";
    const params = new URLSearchParams();
    params.set("checkout[email]", user.email || "");
    params.set("checkout[custom][user_id]", user.id);
    
    window.location.href = `${checkoutUrl}?${params.toString()}`;
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[400px] h-[400px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider shadow-sm">
          <span>✨</span>
          {locale === 'zh' ? '学习资源' : 'Premium Resources'}
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
           <div className="absolute -inset-1 bg-gradient-to-r from-orange-200 to-purple-200 rounded-[2rem] blur opacity-30 -z-10"></div>
           <FlashcardGame locale={locale} limit={5} />
        </div>
        <p className="text-center text-sm text-slate-400 mt-4">
          {locale === 'zh' ? '👆 左右滑动卡片进行练习' : '👆 Swipe cards to practice'}
        </p>
      </div>

      {/* Pricing / CTA Card - Only shown for non-PRO users */}
      {!isPro && (
        <div className="w-full max-w-md mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-xl">
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{texts.cta.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{texts.cta.footer}</p>
              </div>
              <div className="text-right">
                <span className="block text-4xl font-black text-[var(--primary)]">{texts.cta.price}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {texts.cta.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">{feature}</span>
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
      )}

    </div>
  );
}
