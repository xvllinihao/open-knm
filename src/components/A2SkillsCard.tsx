'use client';

import Link from 'next/link';
import { useState } from 'react';

interface A2SkillsCardProps {
  locale: string;
  isZh: boolean;
}

export function A2SkillsCard({ locale, isZh }: A2SkillsCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="group w-full flex items-center p-4 sm:p-5 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl sm:text-2xl mr-4 sm:mr-5 group-hover:scale-110 transition-transform shrink-0">
          📝
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate min-w-0">
              {isZh ? 'A2 考试单项突破' : 'A2 Exam Skills'}
            </h3>
            <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide shrink-0">
              Practice
            </span>
          </div>
          <p className="text-slate-500 text-sm truncate">
            {isZh
              ? '阅读 · 写作 · 听力 · 口语'
              : 'Reading · Writing · Listening · Speaking'}
          </p>
        </div>
        <div className="ml-2 sm:ml-3 shrink-0">
          <span
            className={`text-slate-400 text-lg transition-transform duration-200 inline-block ${open ? 'rotate-90' : ''}`}
          >
            →
          </span>
        </div>
      </button>

      {/* Expanded list */}
      {open && (
        <div className="border-t border-slate-100 flex flex-col divide-y divide-slate-100">
          <Link href={`/${locale}/listening`} className="group flex items-center px-4 sm:px-5 py-3 hover:bg-amber-50 transition-colors">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-base mr-4 group-hover:scale-110 transition-transform shrink-0 border border-amber-100">
              🎧
            </div>
            <span className="flex-1 text-sm font-semibold text-slate-800">{isZh ? '听力' : 'Listening'}</span>
            <span className="text-slate-300 group-hover:text-amber-500 transition-colors text-base">→</span>
          </Link>
          <Link href={`/${locale}/reading`} className="group flex items-center px-4 sm:px-5 py-3 hover:bg-purple-50 transition-colors">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-base mr-4 group-hover:scale-110 transition-transform shrink-0 border border-purple-100">
              📖
            </div>
            <span className="flex-1 text-sm font-semibold text-slate-800">{isZh ? '阅读' : 'Reading'}</span>
            <span className="text-slate-300 group-hover:text-purple-500 transition-colors text-base">→</span>
          </Link>
          <Link href={`/${locale}/writing`} className="group flex items-center px-4 sm:px-5 py-3 hover:bg-emerald-50 transition-colors">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-base mr-4 group-hover:scale-110 transition-transform shrink-0 border border-emerald-100">
              ✍️
            </div>
            <span className="flex-1 text-sm font-semibold text-slate-800">{isZh ? '写作' : 'Writing'}</span>
            <span className="text-slate-300 group-hover:text-emerald-500 transition-colors text-base">→</span>
          </Link>
          <Link href={`/${locale}/speaking`} className="group flex items-center px-4 sm:px-5 py-3 hover:bg-blue-50 transition-colors">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base mr-4 group-hover:scale-110 transition-transform shrink-0 border border-blue-100">
              🗣️
            </div>
            <span className="flex-1 text-sm font-semibold text-slate-800">{isZh ? '口语' : 'Speaking'}</span>
            <div className="flex items-center gap-1.5">
              <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded">Beta</span>
              <span className="text-slate-300 group-hover:text-blue-500 transition-colors text-base">→</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
