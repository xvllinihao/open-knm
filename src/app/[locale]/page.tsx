import { Locale } from "@/lib/i18n";
import Link from "next/link";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 h-full">
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
             href={`/${locale}/society`}
             className="h-12 px-8 rounded-full bg-white text-slate-700 font-bold text-base border border-slate-200 flex items-center hover:bg-slate-50 transition-all"
           >
             {isZh ? '了解荷兰' : 'Discover NL'}
           </Link>
        </div>
      </section>

      {/* Right: KNM Topics Grid (Compact) */}
      <section className="flex-1 w-full max-w-md lg:max-w-lg">
        <div className="grid gap-4">
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
        </div>
      </section>
    </div>
  );
}
