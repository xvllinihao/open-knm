"use client";

import { useState } from "react";
import { VocabularyItem } from "@/data/vocabulary";
import { Locale } from "@/lib/uiTexts";

interface VocabMiniCardProps {
  item: VocabularyItem;
  locale: Locale;
  showTTS?: boolean;
}

const posColors: Record<string, string> = {
  noun: "bg-blue-50 text-blue-600",
  verb: "bg-emerald-50 text-emerald-600",
  adjective: "bg-purple-50 text-purple-600",
  adverb: "bg-amber-50 text-amber-600",
};

export function VocabMiniCard({ item, locale, showTTS = false }: VocabMiniCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const posColor = posColors[item.partOfSpeech] ?? "bg-slate-50 text-slate-500";

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(item.dutch);
    utterance.lang = "nl-NL";
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-1 p-3 bg-white rounded-xl border border-slate-200 hover:border-orange-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-1.5 flex-wrap">
        {item.article && (
          <span className="text-[10px] font-bold text-slate-400">{item.article}</span>
        )}
        <span className="font-bold text-slate-900 text-sm flex-1">{item.dutch}</span>
        {showTTS && (
          <button
            onClick={handlePlay}
            aria-label={isPlaying ? "Stop" : "Play pronunciation"}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              isPlaying
                ? "bg-orange-100 text-orange-600"
                : "bg-slate-100 text-slate-500 hover:bg-orange-50 hover:text-orange-500"
            }`}
          >
            {isPlaying ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${posColor}`}>
          {item.partOfSpeech}
        </span>
        <span className="text-xs text-slate-600 leading-snug">
          {locale === "zh" ? item.translations.zh : item.translations.en}
        </span>
      </div>
    </div>
  );
}
