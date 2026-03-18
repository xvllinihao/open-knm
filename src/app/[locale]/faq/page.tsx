"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Locale, locales } from "@/lib/uiTexts";

export default function FAQPage() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>('zh');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Extract locale from pathname
    const pathLocale = pathname.split('/')[1] as Locale;
    if (locales.includes(pathLocale)) {
      setLocale(pathLocale);
    }
  }, [pathname]);

  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  const isZh = locale === 'zh';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {isZh ? '常见问题' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {isZh
            ? '关于荷兰融入考试（KNM/Inburgering）的常见问题解答'
            : 'Everything you need to know about the Dutch Civic Integration Exam'}
        </p>
      </div>

      {/* To be added message */}
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">
          {isZh ? '内容准备中' : 'Coming Soon'}
        </h2>
        <p className="text-slate-500 mb-6">
          {isZh ? '我们正在整理常见问题，敬请期待。' : 'We are compiling frequently asked questions. Stay tuned!'}
        </p>
        <p className="text-sm text-slate-400">
          {isZh ? '如有问题，请通过联系支持页面与我们联系。' : 'In the meantime, feel free to reach out through our contact support page.'}
        </p>
      </div>
    </div>
  );
}
