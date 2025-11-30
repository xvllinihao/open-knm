import { Locale } from "@/lib/i18n";
import Link from "next/link";

export function UnderConstruction({ locale, title }: { locale: Locale; title: string }) {
  const isZh = locale === 'zh';
  
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="bg-orange-50 rounded-full p-6 mb-6">
        <svg className="w-12 h-12 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        {title}
      </h1>
      <p className="text-lg text-slate-600 max-w-md mb-8">
        {isZh 
          ? '这个页面正在建设中。我们将很快为您带来精彩内容。' 
          : 'This page is currently under construction. We will bring you great content soon.'}
      </p>
      <Link 
        href={`/${locale}`}
        className="inline-flex items-center font-medium text-[var(--primary)] hover:underline"
      >
        ← {isZh ? '返回首页' : 'Back to Home'}
      </Link>
    </div>
  );
}


