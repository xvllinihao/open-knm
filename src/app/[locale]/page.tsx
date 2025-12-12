import { Locale, uiTexts, isLocale } from "@/lib/uiTexts";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const isZh = locale === 'zh';
  const { assistant } = uiTexts[locale];

  return (
    <div className="flex flex-col gap-12 lg:gap-20 h-full">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        {/* Left: Hero Section */}
        <section className="flex-1 text-center lg:text-left space-y-6 max-w-3xl lg:max-w-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            {isZh ? '免费 · 开源 · 荷兰指南' : 'Free · Open Source · NL Guide'}
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            Open <span className="text-[var(--primary)]">KNM</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed font-light">
            {isZh 
              ? '你的荷兰融入考试 (Inburgering) 通关指南。' 
              : 'Your essential guide to the Dutch Civic Integration exam.'}
          </p>
          
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {isZh 
              ? '这是一个免费开源的项目。不仅为你梳理 KNM 考试核心考点，更助你真正读懂荷兰社会规则，让备考与生活都更从容。' 
              : 'An open-source knowledge base designed to help you navigate Dutch society. We provide the key insights you need to pass the KNM exam and settle in with confidence.'}
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
             <Link 
               href={`/${locale}/knm`}
               className="h-12 px-8 rounded-full bg-[var(--primary)] text-white font-bold text-base flex items-center hover:bg-orange-600 transition-all hover:scale-105 shadow-md shadow-orange-200"
             >
               {isZh ? '开始学习' : 'Start Learning'}
             </Link>
             <Link 
               href={`/${locale}/vocabulary`}
               className="h-12 px-8 rounded-full bg-white text-slate-700 font-bold text-base border border-slate-200 flex items-center hover:bg-slate-50 transition-all"
             >
               {isZh ? '高频词汇' : 'Vocabulary'}
             </Link>
          </div>
        </section>

        {/* Right: Feature Cards */}
        <section className="flex-1 w-full max-w-md lg:max-w-lg">
          <div className="grid gap-4">
             {/* AI Assistant Promo Card */}
             <Link
               href={`/${locale}/ai-assistant`}
               className="group flex items-center p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg shadow-slate-900/20 hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden relative"
             >
                {/* Ambient Glow */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--primary)] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform border border-white/10">
                  🤖
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="text-lg font-bold text-white truncate flex items-center gap-2">
                    {assistant.promoTitle}
                    <span className="inline-flex h-2 w-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
                  </h3>
                  <p className="text-slate-400 text-sm truncate">
                    {assistant.promoDesc}
                  </p>
                </div>
                <div className="ml-3 relative z-10">
                  <span className="text-[var(--primary)] font-bold text-sm group-hover:text-white transition-colors">
                    {assistant.promoAction}
                  </span>
                </div>
             </Link>

             {/* Writing Promo Card */}
             <Link
               href={`/${locale}/writing`}
               className="group flex items-center p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden relative"
             >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform border border-emerald-100 shadow-sm">
                  ✍️
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="text-lg font-bold text-slate-900 truncate flex items-center gap-2">
                    {isZh ? 'A2 写作速成' : 'Writing Crash Course'}
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">New</span>
                  </h3>
                  <p className="text-slate-600 text-sm truncate">
                    {isZh ? '万能模板 + 全真模拟题库。' : 'Templates, rules & mock exams.'}
                  </p>
                </div>
                <div className="ml-3 relative z-10">
                  <span className="text-emerald-600 group-hover:text-emerald-700 transition-colors text-lg">→</span>
                </div>
             </Link>

             {/* Vocabulary Promo Card */}
             <Link
               href={`/${locale}/vocabulary`}
               className="group flex items-center p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden relative"
             >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform border border-orange-100 shadow-sm">
                  📚
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="text-lg font-bold text-slate-900 truncate flex items-center gap-2">
                    {isZh ? 'A2 高频词汇表' : 'Essential Vocabulary'}
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wide">New</span>
                  </h3>
                  <p className="text-slate-600 text-sm truncate">
                    {isZh ? '500+ 核心词汇，覆盖生活全场景。' : '500+ core words for daily life & exam.'}
                  </p>
                </div>
                <div className="ml-3 relative z-10">
                  <span className="text-orange-600 group-hover:text-orange-700 transition-colors text-lg">→</span>
                </div>
             </Link>

             {/* Speaking Promo Card */}
             <Link
               href={`/${locale}/speaking`}
               className="group flex items-center p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden relative"
             >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform border border-blue-100 shadow-sm">
                  🗣️
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="text-lg font-bold text-slate-900 truncate flex items-center gap-2">
                    {isZh ? 'A2 口语模拟' : 'Speaking Practice'}
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">Beta</span>
                  </h3>
                  <p className="text-slate-600 text-sm truncate">
                    {isZh ? '实时语音反馈，模拟真实考试场景。' : 'Interactive practice with real-time feedback.'}
                  </p>
                </div>
                <div className="ml-3 relative z-10">
                  <span className="text-blue-600 group-hover:text-blue-700 transition-colors text-lg">→</span>
                </div>
             </Link>

             {/* Unified KNM Card */}
             <Link
               href={`/${locale}/knm`}
               className="group flex items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
             >
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">
                  🇳🇱
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {isZh ? 'KNM 知识考点' : 'Knowledge of Dutch Society'}
                  </h3>
                  <p className="text-slate-500 text-sm truncate">
                    {isZh ? '历史、法律、医疗、工作全覆盖。' : 'History, Law, Health, Work & Regulations.'}
                  </p>
                </div>
                <div className="ml-3">
                  <span className="text-slate-300 group-hover:text-[var(--primary)] transition-colors text-lg">→</span>
                </div>
             </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
