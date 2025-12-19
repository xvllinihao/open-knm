"use client";

import Link from "next/link";
import { Locale, uiTexts } from "@/lib/uiTexts";

interface MembershipPromoProps {
  locale: Locale;
}

export function MembershipPromo({ locale }: MembershipPromoProps) {
  const texts = uiTexts[locale].membershipPromo;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-20 sm:px-10 sm:py-24 md:px-12 lg:px-20 mt-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[150%] bg-[var(--primary)] opacity-10 blur-3xl rounded-full rotate-12"></div>
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[80%] bg-blue-600 opacity-10 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
            <span>💎</span>
            {locale === 'zh' ? '会员计划' : 'Pro Membership'}
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            {texts.title}
          </h2>
          
          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            {texts.description}
          </p>

          <Link
            href={`/${locale}/pricing`}
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-slate-900 font-bold text-base hover:bg-slate-100 transition-all hover:scale-105 shadow-lg shadow-white/10"
          >
            {texts.action}
          </Link>
        </div>

        {/* Visual element (abstract cards) */}
        <div className="relative w-full max-w-sm aspect-square md:aspect-auto md:h-64 flex items-center justify-center">
             <div className="absolute w-48 h-32 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl transform -rotate-6 translate-y-4 translate-x-4"></div>
             <div className="absolute w-48 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl transform rotate-6 -translate-y-4 -translate-x-4 shadow-2xl"></div>
             <div className="absolute w-48 h-32 bg-gradient-to-br from-[var(--primary)] to-orange-600 rounded-xl shadow-2xl flex items-center justify-center text-white font-bold text-xl z-10 transform hover:scale-110 transition-transform duration-500">
                Pro
             </div>
        </div>
      </div>
    </section>
  );
}


