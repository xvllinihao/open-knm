import { Locale, isLocale } from "@/lib/uiTexts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { changelogData } from "@/data/changelog";
import { JsonLd } from "@/components/StructuredData";
import { courseSchema, breadcrumbSchema, howToSchema } from "@/lib/structured-data";
import { A2SkillsCard } from "@/components/A2SkillsCard";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const isZh = locale === 'zh';
  const latestUpdate = changelogData[0];

  // AEO: Add structured data for home page
  const schemas = [
    courseSchema(locale),
    howToSchema(locale),
    breadcrumbSchema([
      { name: isZh ? '首页' : 'Home', url: `https://open-knm.com/${locale}` },
    ]),
  ];

  return (
    <>
      <JsonLd schemas={schemas} />
      <main
        className="flex flex-col gap-12 lg:gap-20 h-full"
        itemScope
        itemType="https://schema.org/EducationEvent"
      >
        <meta itemProp="name" content={isZh ? "Open KNM 荷兰融入考试指南" : "Open KNM Dutch Integration Exam Guide"} />
        <meta itemProp="description" content={isZh
          ? "免费开源的荷兰融入考试备考平台"
          : "Free open-source platform for Dutch integration exam preparation"
        } />
        <meta itemProp="organizer" content="Open KNM" />

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Left: Hero Section */}
          <section
            className="w-full lg:flex-1 text-center lg:text-left space-y-6 max-w-3xl lg:max-w-none mx-auto lg:mx-0"
            itemScope
            itemType="https://schema.org/Event"
            itemProp="performer"
          >
            <meta itemProp="name" content={isZh ? "荷兰融入考试课程" : "Dutch Integration Exam Course"} />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              {isZh ? '免费 · 开源 · 社区驱动' : 'Free · Open Source · Community Driven'}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              Open <span className="text-[var(--primary)]">KNM</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed">
              {isZh
                ? '轻松备考，从容生活。你的荷兰融入考试开源指南。'
                : 'Pass the exam. Settle in. Your open-source guide to Dutch civic integration.'}
            </p>

            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {isZh
                ? '汇集了社区贡献的核心考点、高频词汇和实用练习，这里有一份更轻量的备考方案，帮你用最轻松的方式通过 Inburgering 考试，更快适应荷兰生活。'
                : 'Curated by the community, our essential topics, vocabulary, and practice questions offer a lighter way to prepare. A simpler path to passing the Inburgering exam and feeling at home in the Netherlands.'}
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
               <Link
                 href={`/${locale}/knm`}
                 className="h-12 px-8 rounded-full bg-[var(--primary)] text-white font-bold text-base flex items-center hover:bg-orange-600 transition-all hover:scale-105 shadow-md shadow-orange-200"
               >
                 {isZh ? 'KNM 知识考点' : 'KNM Topics'}
               </Link>
               <Link
                 href={`/${locale}/vocabulary`}
                 className="h-12 px-8 rounded-full bg-white text-slate-700 font-bold text-base border border-slate-200 flex items-center hover:bg-slate-50 transition-all"
               >
                 {isZh ? '高频词汇' : 'Vocabulary'}
               </Link>
            </div>

            {/* Latest Update */}
            <div className="pt-8 border-t border-slate-100 mt-8">
              <Link href={`/${locale}/changelog`} className="group block">
                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wide">
                    {isZh ? "最新更新" : "Latest Update"}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {latestUpdate.date}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                  {latestUpdate.title[isZh ? "zh" : "en"] || latestUpdate.title["zh"]} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </h3>
              </Link>
            </div>
          </section>

          {/* Right: Feature Cards */}
          <section className="w-full lg:flex-1 max-w-md lg:max-w-lg mx-auto">
            <div className="grid gap-4">

               {/* Vocabulary Promo Card */}
               <Link
                 href={`/${locale}/vocabulary`}
                 className="group flex items-center p-4 sm:p-5 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden relative"
               >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-xl sm:text-2xl mr-4 sm:mr-5 group-hover:scale-110 transition-transform border border-orange-100 shadow-sm shrink-0">
                    📚
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate min-w-0">
                        {isZh ? 'A2+B1 词汇表' : 'A2+B1 Vocabulary'}
                      </h3>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide shrink-0">Free</span>
                    </div>
                    <p className="text-slate-700 text-sm truncate">
                      {isZh ? '1300+ 词，完全免费，含 B1 进阶词汇。' : '1300+ words, completely free including B1 vocabulary.'}
                    </p>
                  </div>
                  <div className="ml-2 sm:ml-3 relative z-10">
                    <span className="text-orange-600 group-hover:text-orange-700 transition-colors text-lg">→</span>
                  </div>
               </Link>

               {/* Unified KNM Card */}
               <Link
                 href={`/${locale}/knm`}
                 className="group flex items-center p-4 sm:p-5 bg-sky-50 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
               >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-xl sm:text-2xl mr-4 sm:mr-5 group-hover:scale-110 transition-transform shrink-0 border border-sky-100 shadow-sm">
                    🇳🇱
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate min-w-0">
                      {isZh ? 'KNM 知识考点' : 'Knowledge of Dutch Society'}
                    </h3>
                    <p className="text-slate-700 text-sm truncate">
                      {isZh ? '历史、法律、医疗、工作全覆盖。' : 'History, Law, Health, Work & Regulations.'}
                    </p>
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <span className="text-sky-600 group-hover:text-sky-700 transition-colors text-lg">→</span>
                  </div>
               </Link>

               {/* A2 Exam Skills Card */}
               <A2SkillsCard locale={locale} isZh={isZh} />

               {/* AI Assistant Promo Card */}
               <Link
                 href={`/${locale}/ai-assistant`}
                 className="group flex items-center p-4 sm:p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden relative"
               >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-xl sm:text-2xl mr-4 sm:mr-5 group-hover:scale-110 transition-transform border border-indigo-100 shadow-sm shrink-0">
                    🤖
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate min-w-0">
                        {isZh ? 'AI 助教' : 'AI Assistant'}
                      </h3>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wide shrink-0">New</span>
                    </div>
                    <p className="text-slate-700 text-sm truncate">
                      {isZh ? '基于 NotebookLM，让 AI 帮你划重点、出模拟题。' : 'Powered by NotebookLM. Get summaries and mock questions instantly.'}
                    </p>
                  </div>
                  <div className="ml-2 sm:ml-3 relative z-10">
                    <span className="text-indigo-600 group-hover:text-indigo-700 transition-colors text-lg">→</span>
                  </div>
               </Link>

               {/* Resources / Support Promo Card */}
               <Link
                 href={`/${locale}/resources`}
                 className="group flex items-center p-4 sm:p-5 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden relative"
               >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center text-xl sm:text-2xl mr-4 sm:mr-5 group-hover:scale-110 transition-transform border border-rose-100 shadow-sm shrink-0">
                    🧋
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate min-w-0">
                        {isZh ? '闪卡刷词 & 支持' : 'Flashcards & Support'}
                      </h3>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wide shrink-0">€5</span>
                    </div>
                    <p className="text-slate-700 text-sm truncate">
                      {isZh ? '请喝一杯奶茶，解锁无限刷词功能。' : 'Buy me a tea to unlock unlimited flashcards.'}
                    </p>
                  </div>
                  <div className="ml-2 sm:ml-3 relative z-10">
                    <span className="text-rose-600 group-hover:text-rose-700 transition-colors text-lg">→</span>
                  </div>
               </Link>
            </div>
          </section>
        </div>

      </main>
    </>
  );
}
