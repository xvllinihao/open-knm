"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { WaitlistForm } from "@/components/WaitlistForm";
import { FlashcardDemo } from "@/components/FlashcardDemo";
import { useAuth } from "@/contexts/AuthContext";
import { checkWishlistStatus, leaveWishlist } from "@/app/actions/waitlist";

export default function PricingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const { user } = useAuth();
  const wishlistTexts = uiTexts[locale].wishlist;
  const pricingTexts = uiTexts[locale].pricing;
  const [isOnWishlist, setIsOnWishlist] = useState(false);
  const [isLeavingWishlist, setIsLeavingWishlist] = useState(false);
  const isZh = locale === "zh";

  // 检查是否已加入心愿单
  useEffect(() => {
    async function checkStatus() {
      if (user?.email) {
        const onWishlist = await checkWishlistStatus(user.email);
        setIsOnWishlist(onWishlist);
      }
    }
    checkStatus();
  }, [user?.email]);

  const handleLeaveWishlist = async () => {
    if (!user?.email) return;
    setIsLeavingWishlist(true);
    try {
      const result = await leaveWishlist(user.email);
      if (result.success) {
        setIsOnWishlist(false);
      }
    } catch (error) {
      console.error("Leave wishlist error:", error);
    } finally {
      setIsLeavingWishlist(false);
    }
  };

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const flashcardTexts = {
    zh: {
      title: "闪卡刷词",
      subtitle: "像真正的背单词 App 一样，左滑右滑高效记忆",
      cta: "立即体验闪卡刷词",
      demoTitle: "抢先预览",
    },
    en: {
      title: "Flash Cards",
      subtitle: "Swipe left or right to memorize words efficiently",
      cta: "Try Flash Cards Now",
      demoTitle: "Sneak Peek",
    }
  }[locale];

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-orange-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
        <div className="absolute top-[0%] right-[10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-[30%] w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 mb-16 animate-fade-in-up">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
          {pricingTexts.title}
        </h1>
        <p className="text-lg sm:text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
          {pricingTexts.description}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full mx-auto mb-20 px-2 sm:px-6">
        
        {/* Free Plan */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{pricingTexts.free.title}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">{pricingTexts.free.price}</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {pricingTexts.free.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <Link 
            href={`/${locale}/login`}
            className="w-full py-3 px-6 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors text-center"
          >
            {pricingTexts.free.action}
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-white rounded-3xl p-8 border-2 border-[var(--primary)] shadow-xl shadow-orange-500/10 flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-2">
            <span className="bg-[var(--primary)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
              Coming Soon
            </span>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{pricingTexts.pro.title}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">{pricingTexts.pro.price}</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {pricingTexts.pro.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <svg className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <button 
            onClick={scrollToWaitlist}
            className="w-full py-3 px-6 rounded-xl bg-[var(--primary)] text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/20"
          >
            {pricingTexts.pro.action}
          </button>
        </div>
      </div>

      {/* Flashcard Demo Section - BEFORE Waitlist */}
      <div className="w-full max-w-4xl mx-auto py-16 border-t border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider shadow-sm mb-4">
            <span>✨</span>
            {flashcardTexts.title}
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3">
            {flashcardTexts.demoTitle}
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            {flashcardTexts.subtitle}
          </p>
        </div>
        
        <FlashcardDemo locale={locale} />
        
        {/* CTA Button */}
        <div className="text-center mt-10">
          <Link
            href={`/${locale}/flashcards`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-white font-bold rounded-full hover:brightness-110 transition-all shadow-lg shadow-orange-200 hover:scale-105 text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
              <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
              <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
            </svg>
            {flashcardTexts.cta}
          </Link>
        </div>
      </div>

      {/* Wishlist Section - AFTER Demo */}
      <div id="waitlist-form" className="w-full max-w-3xl mx-auto text-center space-y-8 py-16 border-t border-slate-100">
        {isOnWishlist ? (
          // 已加入心愿单
          <>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isZh ? "已加入" : "Joined"}
            </div>
            
            <div className="max-w-md mx-auto bg-green-50 border border-green-100 rounded-2xl p-8">
              <div className="text-4xl mb-4">💎</div>
              <h2 className="text-2xl font-black text-green-800 mb-2">
                {isZh ? "已将会员计划加入心愿单" : "Membership plan added to Wishlist"}
              </h2>
              <p className="text-green-700 mb-4">
                {isZh 
                  ? "Pro 上线时我们会第一时间通知你，届时还有 50% 早鸟优惠。" 
                  : "We'll notify you when Pro launches with 50% early bird discount."}
              </p>
              <button
                onClick={handleLeaveWishlist}
                disabled={isLeavingWishlist}
                className="text-sm text-green-600 hover:text-green-800 underline underline-offset-2 disabled:opacity-50"
              >
                {isLeavingWishlist 
                  ? (isZh ? "退出中..." : "Leaving...") 
                  : (isZh ? "退出心愿单" : "Leave Wishlist")}
              </button>
            </div>
          </>
        ) : (
          // 未加入心愿单
          <>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              {wishlistTexts.heroBadge}
            </div>
            
            <h2 className="text-3xl font-black text-slate-900">
              {wishlistTexts.title}
            </h2>
            
            <p className="text-slate-500 max-w-xl mx-auto">
              {wishlistTexts.description}
            </p>

            <div className="max-w-md mx-auto">
              <WaitlistForm locale={locale} onSuccess={() => setIsOnWishlist(true)} />
            </div>
          </>
        )}
      </div>
      
    </div>
  );
}
