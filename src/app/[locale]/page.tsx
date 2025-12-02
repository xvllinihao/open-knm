import { Locale, uiTexts, isLocale } from "@/lib/uiTexts";
import Link from "next/link";
import { notFound } from "next/navigation";
import FlashCard from "@/components/FlashCard";

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
              ? '你的荷兰融入考试（Inburgering）终极指南。' 
              : 'Your ultimate guide to the Dutch Civic Integration exam.'}
          </p>
          
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {isZh 
              ? '这是一个免费开源的项目，旨在帮助你深入了解荷兰这个国家，同时也为你准备 KNM (Kennis van de Nederlandse Maatschappij) 考试提供最佳辅助。' 
              : 'A free and open-source project designed to help you understand the Netherlands, while providing the best preparation for your KNM exam.'}
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
          {/* FlashCard goes here, after hero summary/buttons, before right-column grid */}
          <div className="mt-8 lg:mt-10"><FlashCard locale={locale} /></div>
        </section>

        {/* Right: KNM Topics Grid (Compact) */}
        <section className="flex-1 w-full max-w-md lg:max-w-lg">
          <div className="grid gap-8 py-8">
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

             {/* Vocabulary Promo Card (New) */}
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
                    {isZh ? '200+ 核心词汇，覆盖生活全场景。' : '200+ core words for daily life & exam.'}
                  </p>
                </div>
                <div className="ml-3 relative z-10">
                  <span className="text-orange-600 group-hover:text-orange-700 transition-colors text-lg">→</span>
                </div>
             </Link>

             {/* Card 1: History & Geography */}
             <Link
               href={`/${locale}/knm?topic=history-geography`}
               className="group flex items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
             >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">🇳🇱</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {isZh ? '荷兰历史与地理' : 'History & Geography'}
                  </h3>
                  <p className="text-slate-500 text-sm truncate">
                    {isZh ? '威廉奥兰治、二战、地理常识。' : 'William of Orange, WWII, geography.'}
                  </p>
                </div>
                <div className="ml-3">
                  <span className="text-slate-300 group-hover:text-[var(--primary)] transition-colors text-lg">→</span>
                </div>
             </Link>

             {/* Card 2: Law & Government */}
             <Link
               href={`/${locale}/knm?topic=law-government`}
               className="group flex items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
             >
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">⚖️</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {isZh ? '法律与政府' : 'Law & Government'}
                  </h3>
                  <p className="text-slate-500 text-sm truncate">
                    {isZh ? '民主制度、宪法权利、首相与国王。' : 'Democracy, rights, PM & King.'}
                  </p>
                </div>
                <div className="ml-3">
                  <span className="text-slate-300 group-hover:text-[var(--primary)] transition-colors text-lg">→</span>
                </div>
             </Link>

             {/* Card 3: Health & Education */}
             <Link
               href={`/${locale}/knm?topic=health-education`}
               className="group flex items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
             >
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">🏥</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {isZh ? '医疗与教育' : 'Health & Education'}
                  </h3>
                  <p className="text-slate-500 text-sm truncate">
                    {isZh ? '家庭医生、学校类型与保险体系。' : 'GP system, schools, insurance.'}
                  </p>
                </div>
                <div className="ml-3">
                  <span className="text-slate-300 group-hover:text-[var(--primary)] transition-colors text-lg">→</span>
                </div>
             </Link>

             {/* Card 4: Work & Income */}
             <Link
               href={`/${locale}/knm?topic=work-income`}
               className="group flex items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
             >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">💼</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">
                    {isZh ? '工作与收入' : 'Work & Income'}
                  </h3>
                  <p className="text-slate-500 text-sm truncate">
                    {isZh ? '合同、解雇保护、福利与税务。' : 'Contracts, dismissal, benefits & taxes.'}
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
