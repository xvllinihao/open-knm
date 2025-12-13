import React from 'react';

export const ArticleSummary = ({ children, title = "本文摘要", icon = "📝" }: { children: React.ReactNode, title?: string, icon?: string }) => (
  <div className="not-prose my-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm ring-1 ring-slate-900/5">
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-900">{title}</h4>
        <div className="text-slate-600 leading-relaxed text-sm">{children}</div>
      </div>
    </div>
  </div>
);

export const BilingualGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="not-prose grid gap-x-12 gap-y-12 md:grid-cols-2 relative">
    {/* Hidden vertical divider for desktop */}
    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px -ml-px bg-slate-100" />
    {children}
  </div>
);

export const DutchColumn = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div className="space-y-4 relative">
    {title && (
      <div className="sticky top-4 z-10 bg-white/90 backdrop-blur py-2 -mx-2 px-2 border-b border-slate-100 mb-4">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 text-lg">
           <span className="text-xl shadow-sm rounded px-1 bg-orange-50">🇳🇱</span> {title}
        </h3>
      </div>
    )}
    <div className="prose prose-slate text-slate-800 leading-loose prose-p:my-4 prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-orange-600 prose-strong:font-bold prose-strong:bg-orange-50 prose-strong:px-1 prose-strong:rounded prose-ul:list-disc prose-ul:pl-4">
      {children}
    </div>
  </div>
);

export const ChineseColumn = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div className="space-y-4 relative">
    {title && (
      <div className="sticky top-4 z-10 bg-white/90 backdrop-blur py-2 -mx-2 px-2 border-b border-slate-100 mb-4">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 text-lg">
          <span className="text-xl shadow-sm rounded px-1 bg-blue-50">🇨🇳</span> {title}
        </h3>
      </div>
    )}
    <div className="prose prose-slate text-slate-600 leading-relaxed prose-p:my-4 prose-headings:text-slate-800 prose-headings:font-semibold prose-strong:text-slate-800 prose-strong:font-bold prose-ul:list-disc prose-ul:pl-4">
      {children}
    </div>
  </div>
);

export const EnglishColumn = ({ title, children }: { title?: string, children: React.ReactNode }) => (
  <div className="space-y-4 relative">
    {title && (
      <div className="sticky top-4 z-10 bg-white/90 backdrop-blur py-2 -mx-2 px-2 border-b border-slate-100 mb-4">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 text-lg">
          <span className="text-xl shadow-sm rounded px-1 bg-blue-50">🇬🇧</span> {title}
        </h3>
      </div>
    )}
    <div className="prose prose-slate text-slate-600 leading-relaxed prose-p:my-4 prose-headings:text-slate-800 prose-headings:font-semibold prose-strong:text-slate-800 prose-strong:font-bold prose-ul:list-disc prose-ul:pl-4">
      {children}
    </div>
  </div>
);

export const Vocabulary = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100/50 mx-0.5 inline-block">
    {children}
  </span>
);

export const SourceLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[var(--primary)] hover:text-orange-700 underline decoration-orange-200 hover:decoration-orange-500 transition-colors"
  >
    {children}
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
  </a>
);

export const LegalDisclaimer = ({ locale }: { locale: string }) => (
  <div className="not-prose bg-amber-50 text-amber-900/80 text-sm p-4 rounded-lg mt-8 border border-amber-100 flex gap-3 items-start shadow-sm">
    <span className="text-lg shrink-0 mt-0.5">⚠️</span>
    <div>
      <p className="font-bold mb-1 text-amber-900">
        {locale === 'zh' ? '免责声明' : 'Disclaimer'}
      </p>
      <p className="leading-relaxed">
        {locale === 'zh'
          ? '本文仅供参考，不构成法律、医疗或财务建议。官方政策可能随时调整，请务必以 IND、Belastingdienst 或 Rijksoverheid 的最新官方信息为准。'
          : 'This article is for informational purposes only and does not constitute legal, medical, or financial advice. Official policies may change; always refer to IND, Belastingdienst, or Rijksoverheid for the latest information.'}
      </p>
    </div>
  </div>
);

