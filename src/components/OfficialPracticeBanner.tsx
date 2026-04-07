"use client";

import { usePathname } from "next/navigation";
import { Locale } from "@/lib/uiTexts";

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

export function OfficialPracticeBanner({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  
  // Show only on skill and KNM pages
  const allowedPaths = ['/listening', '/reading', '/writing', '/speaking', '/knm'];
  if (!allowedPaths.some(p => pathname?.includes(p))) {
    return null;
  }

  const isZh = locale === 'zh';

  return (
    <div className="max-w-3xl mx-auto px-6 mt-8 mb-12">
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0 mx-auto sm:mx-0">
            <span className="text-xl">🎓</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-0.5">
              {isZh ? "准备好实战了吗？" : "Ready for the real thing?"}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              {isZh ? "前往 DUO 官网进行官方模拟考试" : "Go to DUO for official practice exams"}
            </p>
          </div>
        </div>
        <a 
          href="https://www.inburgeren.nl/examen-doen/oefenen.jsp" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="shrink-0 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-full hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm flex items-center gap-2"
        >
          {isZh ? "做官方模拟题" : "DUO Practice Exams"}
          <ExternalLinkIcon />
        </a>
      </div>
    </div>
  );
}
