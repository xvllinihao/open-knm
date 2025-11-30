import Link from "next/link";
import Image from "next/image";
import { Locale, uiTexts, isLocale } from "@/lib/uiTexts";
import { notFound } from "next/navigation";

const NOTEBOOKLM_LINK =
  "https://notebooklm.google.com/notebook/315b620a-f043-4fe9-a424-4cf3e1d4ddaf";

export default async function AIAssistantPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const { assistant } = uiTexts[locale];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:py-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[var(--primary)] blur-3xl opacity-20"></div>
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-blue-500 blur-3xl opacity-20"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 p-8 lg:p-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm border border-white/10 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
              </span>
              {assistant.badgeLabel}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              {assistant.aiAssistantTitle}
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              {assistant.aiAssistantDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={NOTEBOOKLM_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center px-8 rounded-full bg-[var(--primary)] text-white font-bold text-lg shadow-lg shadow-[var(--primary)]/30 transition-all hover:bg-orange-600 hover:scale-105 hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {assistant.openNotebook}
              </Link>
              <Link
                 href="#how-it-works"
                 className="inline-flex h-14 items-center justify-center px-8 rounded-full bg-white/10 text-white font-medium text-lg border border-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                 Learn More
              </Link>
            </div>
          </div>

          {/* Visual/Preview Area */}
          <div className="relative hidden lg:block">
             <div className="relative rounded-xl bg-white/5 border border-white/10 p-2 backdrop-blur-sm shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/assistant/preview-placeholder.svg"
                  alt="NotebookLM Preview"
                  width={640}
                  height={480}
                  priority
                  className="w-full rounded-lg shadow-inner bg-white/90"
                />
                <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-xl shadow-xl max-w-xs border border-slate-100">
                   <div className="flex gap-3 items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[var(--primary)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      </div>
                      <span className="font-bold text-sm">AI Power</span>
                   </div>
                   <p className="text-xs text-slate-600 leading-relaxed">
                     &ldquo;Explain the difference between Eerste Kamer and Tweede Kamer.&rdquo;
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Features / How it works */}
      <div id="how-it-works" className="mt-16 lg:mt-24 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">
            📚
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Read & Understand</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {assistant.detailLine1}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-4">
            💬
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Ask & Chat</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {assistant.detailLine2}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
           <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4">
            🔒
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Safe & Secure</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {assistant.detailLine3}
          </p>
        </div>
      </div>

      {/* Community Callout */}
      <div className="mt-12 p-8 rounded-2xl bg-orange-50 border border-orange-100 text-center">
         <p className="text-[var(--primary)] font-bold text-lg mb-2">
           {assistant.bannerTitle}
         </p>
         <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
           {assistant.highlightLine}
         </p>
         <Link
            href={NOTEBOOKLM_LINK}
            target="_blank"
            className="text-sm font-semibold text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center justify-center gap-1"
         >
           {assistant.openNotebook} <span aria-hidden="true">&rarr;</span>
         </Link>
      </div>
    </div>
  );
}
