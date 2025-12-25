"use client";

import { Locale } from "@/lib/uiTexts";
import { vocabularyList } from "@/data/vocabulary";

interface FlashcardStatsProps {
  locale: Locale;
  knownCount: number;
  unknownCount: number;
  isCompact?: boolean;
}

export function FlashcardStats({ locale, knownCount, unknownCount, isCompact = false }: FlashcardStatsProps) {
  const isZh = locale === "zh";
  const totalVocabulary = vocabularyList.length;
  const reviewedCount = knownCount + unknownCount;
  const masteryPercent = totalVocabulary > 0 ? Math.round((knownCount / totalVocabulary) * 100) : 0;

  const texts = {
    reviewed: isZh ? "已背单词" : "Reviewed",
    mastered: isZh ? "掌握单词" : "Mastered",
    unknown: isZh ? "生词/难点" : "Unknown",
    mastery: isZh ? "掌握度" : "Mastery",
  };

  if (isCompact) {
    return (
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 text-center border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase font-bold">{texts.reviewed}</div>
          <div className="text-sm font-black text-slate-700">{reviewedCount}</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 text-center border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase font-bold">{texts.mastered}</div>
          <div className="text-sm font-black text-green-600">{knownCount}</div>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 text-center border border-slate-100">
          <div className="text-[10px] text-slate-400 uppercase font-bold">{texts.unknown}</div>
          <div className="text-sm font-black text-orange-500">{unknownCount}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-500 mb-1 font-medium">{texts.reviewed}</div>
          <div className="text-xl font-black text-slate-800">{reviewedCount}</div>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100 shadow-sm">
          <div className="text-xs text-green-600 mb-1 font-medium">{texts.mastered}</div>
          <div className="text-xl font-black text-green-700">{knownCount}</div>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100 shadow-sm">
          <div className="text-xs text-orange-600 mb-1 font-medium">{texts.unknown}</div>
          <div className="text-xl font-black text-orange-700">{unknownCount}</div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-slate-700">{texts.mastery}</span>
          <span className="text-xs font-black text-[var(--primary)]">{masteryPercent}%</span>
        </div>
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${masteryPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          {isZh ? `全库共 ${totalVocabulary} 个 A2 高频词汇` : `${totalVocabulary} total A2 essential words`}
        </p>
      </div>
    </div>
  );
}

