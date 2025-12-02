"use client";

import React, { useState, useMemo } from "react";
import flashcardsData from "@/data/knm_flashcards.json";
import { Locale } from "@/lib/uiTexts";

interface FlashCardProps {
  locale: Locale;
}

export const FlashCard: React.FC<FlashCardProps> = ({ locale }) => {
  const card = useMemo(() => {
    const idx = Math.floor(Math.random() * flashcardsData.length);
    return flashcardsData[idx];
  }, []);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Always show Dutch by default
  const question_nl = card["question_nl"];
  const options_nl = card["options_nl"];
  const answer_nl = card["answer_nl"];
  // Use user's locale for translation (fallback to English)
  const question_tr = (card as any)[`question_${locale}`] || card["question_en"];
  const options_tr = (card as any)[`options_${locale}`] || card["options_en"];
  const answer_tr = (card as any)[`answer_${locale}`] || card["answer_en"];
  const category = card.category;

  return (
    <div className="group flex items-start p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all mx-auto my-6 w-full max-w-2xl">
      {/* Icon section, similar to home cards */}
      <div className="w-12 h-12 flex-shrink-0 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mr-5 border border-orange-100 shadow-sm">
        🎲
      </div>
      {/* Content section */}
      <div className="flex-1 min-w-0 relative z-10">
        {/* Meta category and label */}
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wide border border-orange-100">Flashcard</span>
          <span className="text-xs text-slate-400 font-semibold ml-1">{category}</span>
        </div>
        <div className="mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-0.5">{question_nl}</h2>
          {showTranslation && (
            <div className="text-base text-blue-700/90 font-medium leading-tight mb-0.5 pt-1 pl-1">{question_tr}</div>
          )}
        </div>
        <div className="space-y-2 mb-5">
          {options_nl.map((opt: string, i: number) => (
            <div key={i} className="relative">
              <button
                type="button"
                disabled={revealed}
                onClick={() => setSelected(i)}
                className={`block w-full text-left px-4 py-2 rounded-xl border font-medium text-base shadow-sm cursor-pointer transition-all
                ${revealed
                  ? opt === answer_nl
                    ? "bg-green-50 border-green-300 text-green-800"
                    : i === selected
                    ? "bg-red-50 border-red-200 text-red-600 opacity-80"
                    : "bg-white border-slate-100 text-slate-800"
                  : i === selected
                  ? "bg-orange-100 border-orange-400 text-orange-900 scale-[1.03]"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-200"}
                `}
              >
                <span>{String.fromCharCode(65 + i)}. </span>
                {opt}
              </button>
              {showTranslation && (
                <span className="block ml-9 text-blue-700 text-sm pb-0.5">{options_tr[i]}</span>
              )}
            </div>
          ))}
        </div>
        {/* Actions & Feedback */}
        <div className="flex items-center gap-2 flex-wrap mt-3 mb-1">
          <button
            className="h-10 px-6 rounded-full bg-[var(--primary)] text-white font-bold text-base flex items-center hover:bg-orange-600 transition-all hover:scale-105 shadow-md shadow-orange-200 disabled:bg-slate-200 disabled:text-slate-400"
            disabled={typeof selected !== "number" || revealed}
            onClick={() => setRevealed(true)}
          >
            {locale === "zh" ? "查看答案" : "Check Answer"}
          </button>
          <button
            className="h-10 px-5 rounded-full bg-white text-[var(--primary)] font-bold text-base border border-orange-100 flex items-center hover:bg-orange-50 transition-all disabled:bg-slate-200 disabled:text-slate-300"
            type="button"
            aria-pressed={showTranslation}
            onClick={() => setShowTranslation((t) => !t)}
          >
            {showTranslation ? (locale === "zh" ? "隐藏翻译" : "Hide Translation") : (locale === "zh" ? "显示翻译" : "Show Translation")}
          </button>
          {revealed && (
            <span className={
              options_nl[selected!] === answer_nl ? "text-green-600 font-bold ml-2" : "text-red-500 font-bold ml-2"
            }>
              {options_nl[selected!] === answer_nl
                ? locale === "zh" ? "答对了！" : "Correct!"
                : `${locale === "zh" ? "正确答案：" : "Answer:"} ${answer_nl}`}
              {showTranslation && (
                <span className="block text-blue-700 text-xs mt-1">
                  {options_tr[selected!] === answer_tr
                    ? locale === "zh" ? "翻译：答对了" : "Translation: Correct!"
                    : `${locale === "zh" ? "翻译：" : "Translation:"} ${answer_tr}`}
                </span>
              )}
            </span>
          )}
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {locale === "zh" ? "新问题每次页面刷新时呈现" : "New question shows every visit"}
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
