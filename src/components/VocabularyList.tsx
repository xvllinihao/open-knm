"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { vocabularyList, VocabularyItem } from "@/data/vocabulary";
import { TTSDisclaimer } from "@/components/TTSDisclaimer";
import { ResumePrompt } from "@/components/ResumePrompt";

type ViewMode = 'card' | 'list';

type VocabBookmark = {
  category: string;
  page: number;
  viewMode: ViewMode;
  updatedAt: number;
};

const STORAGE_KEY = "vocab-bookmark";

// Custom hook for audio playback
function useAudio(text: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const voicesHandlerRef = useRef<(() => void) | null>(null);
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPendingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (voicesHandlerRef.current) {
          window.speechSynthesis.removeEventListener('voiceschanged', voicesHandlerRef.current);
        }
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
        }
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const play = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlaying || isPendingRef.current) return;

    isPendingRef.current = true;
    window.speechSynthesis.cancel();

    // Clear any pending listeners/timeouts
    if (voicesHandlerRef.current) {
      window.speechSynthesis.removeEventListener('voiceschanged', voicesHandlerRef.current);
      voicesHandlerRef.current = null;
    }
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }

    const runSpeak = (voices: SpeechSynthesisVoice[]) => {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a Dutch voice
      // Explicitly try to find a voice for the requested language
      // This ensures we get a Dutch voice instead of the system default (which might be English)
      const lang = 'nl-NL';
      const dutchVoice = 
        voices.find(v => v.lang === lang) || 
        voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
        voices.find(v => v.lang.includes('nl')); // Fallback to any Dutch voice
        
      if (dutchVoice) {
        utterance.voice = dutchVoice;
      }
      
      utterance.lang = lang;
      utterance.rate = 0.9;

      // @ts-expect-error - attaching to window to prevent GC
      window.currentUtterance = utterance;

      utterance.onstart = () => {
        setIsPlaying(true);
        isPendingRef.current = false;
      };
      utterance.onend = () => {
        setIsPlaying(false);
        isPendingRef.current = false;
        // @ts-expect-error - cleanup
        delete window.currentUtterance;
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        isPendingRef.current = false;
        // @ts-expect-error - cleanup
        delete window.currentUtterance;
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error("Speech synthesis failed:", error);
        isPendingRef.current = false;
      }
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      runSpeak(voices);
    } else {
      const handleVoicesChanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        if (updatedVoices.length > 0) {
          if (voiceTimeoutRef.current) {
            clearTimeout(voiceTimeoutRef.current);
            voiceTimeoutRef.current = null;
          }
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
          voicesHandlerRef.current = null;
          runSpeak(updatedVoices);
        }
      };

      voicesHandlerRef.current = handleVoicesChanged;
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

      voiceTimeoutRef.current = setTimeout(() => {
        if (voicesHandlerRef.current) {
          window.speechSynthesis.removeEventListener('voiceschanged', voicesHandlerRef.current);
          voicesHandlerRef.current = null;
          runSpeak([]);
        }
      }, 3000);
    }
  };

  return { isPlaying, play };
}

export default function VocabularyList({ locale }: { locale: Locale }) {
  const texts = uiTexts[locale].vocabulary;
  
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [hideTranslations, setHideTranslations] = useState(false);
  const [pendingBookmark, setPendingBookmark] = useState<VocabBookmark | null>(null);
  const [isResumeVisible, setIsResumeVisible] = useState(false);

  const itemsPerPage = viewMode === 'card' ? 6 : 50;

  const categories = [
    { id: "all", label: texts.categories.all },
    { id: "daily", label: texts.categories.daily },
    { id: "work", label: texts.categories.work },
    { id: "housing", label: texts.categories.housing },
    { id: "health", label: texts.categories.health },
    { id: "geography", label: texts.categories.geography },
    { id: "politics", label: texts.categories.politics },
    { id: "history", label: texts.categories.history },
    { id: "education", label: texts.categories.education },
    { id: "culture", label: texts.categories.culture },
    { id: "law", label: texts.categories.law },
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return vocabularyList;
    }
    return vocabularyList.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      
      const parsed: VocabBookmark = JSON.parse(raw);
      if (
        parsed &&
        parsed.category &&
        typeof parsed.page === "number" &&
        (parsed.viewMode === "card" || parsed.viewMode === "list")
      ) {
        // Only show if different from default or current (if current is default)
        // Actually, just show if valid. But checking against "all" and page 1 might be nice.
        // But user might want to resume even if they just left.
        // Let's check if it matches current state? 
        // Current state is initial (all, 1, card).
        if (
          parsed.category !== "all" ||
          parsed.page !== 1 ||
          parsed.viewMode !== "card"
        ) {
           setTimeout(() => {
             setPendingBookmark(parsed);
             setIsResumeVisible(true);
           }, 0);
        }
      }
    } catch (error) {
      console.error("Failed to read vocabulary bookmark:", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload: VocabBookmark = {
      category: activeCategory,
      page: currentPage,
      viewMode,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error("Failed to save vocabulary bookmark:", error);
    }
  }, [activeCategory, currentPage, viewMode]);

  const handleResume = () => {
    if (!pendingBookmark) return;
    setActiveCategory(pendingBookmark.category);
    setViewMode(pendingBookmark.viewMode);
    setCurrentPage(pendingBookmark.page);
    setIsResumeVisible(false);
    setPendingBookmark(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDismissResume = () => {
    setIsResumeVisible(false);
  };

  return (
    <div className="space-y-12">
      {pendingBookmark && isResumeVisible && (
        <ResumePrompt
          message={`${texts.bookmarkPrompt.resume} “${
            categories.find((c) => c.id === pendingBookmark.category)?.label || pendingBookmark.category
          }” - ${texts.viewMode[pendingBookmark.viewMode]} ${
            pendingBookmark.page > 1
              ? locale === "zh"
                ? `(第 ${pendingBookmark.page} 页)`
                : `(Page ${pendingBookmark.page})`
              : ""
          }`}
          confirmText={texts.bookmarkPrompt.continueStudying}
          dismissText={texts.bookmarkPrompt.dismiss}
          onConfirm={handleResume}
          onDismiss={handleDismissResume}
        />
      )}
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          {texts.title}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          {texts.description}
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <TTSDisclaimer locale={locale} />
      </div>

      {/* Controls Section */}
      <div className="flex flex-col items-center gap-6">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-[var(--primary)] text-white shadow-md shadow-orange-200 transform scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Options Bar */}
        <div className="bg-slate-100 p-1 rounded-lg inline-flex items-center shadow-inner gap-1">
          <button
            onClick={() => handleViewModeChange('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'card'
                ? "bg-white text-[var(--primary)] shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="inline">{texts.viewMode.card}</span>
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'list'
                ? "bg-white text-[var(--primary)] shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="inline">{texts.viewMode.list}</span>
          </button>

          {/* Divider and Hide Option (List Mode Only) */}
          {viewMode === 'list' && (
            <>
              <div className="w-px h-5 bg-slate-300 mx-1" />
              <button
                onClick={() => setHideTranslations((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  hideTranslations
                    ? "bg-white text-[var(--primary)] shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
                title={hideTranslations ? texts.showTranslations : texts.hideTranslations}
              >
                {hideTranslations ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
                <span>{hideTranslations ? texts.showTranslations : texts.hideTranslations}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'card' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <VocabularyCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleItems.map((item, index) => (
            <VocabularyListItem
              key={item.id}
              item={item}
              locale={locale}
              index={index}
              hideTranslations={hideTranslations}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 pt-8 border-t border-slate-100">
          <p className="text-slate-400 text-sm font-medium">
            {texts.showing} <span className="text-slate-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredItems.length)}</span> {texts.of} <span className="text-slate-900">{filteredItems.length}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Smart pagination logic: show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                        currentPage === page
                          ? "bg-[var(--primary)] text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-slate-300 px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function VocabularyCard({ item, locale }: { item: VocabularyItem; locale: Locale }) {
  const isZh = locale === 'zh';
  const texts = uiTexts[locale].vocabulary;
  const wordToSpeak = item.article ? `${item.article} ${item.dutch}` : item.dutch;
  const { isPlaying, play } = useAudio(wordToSpeak);
  const { isPlaying: isExamplePlaying, play: playExample } = useAudio(item.example?.dutch || "");
  
  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Top decorative bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
          {item.level}
        </span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
            {item.category}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {texts.partOfSpeech[item.partOfSpeech]}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[var(--primary)] transition-colors">
            {item.article && (
              <span className="text-xl font-normal text-slate-400 mr-2">{item.article}</span>
            )}
            {item.dutch}
          </h3>
          <button
            onClick={play}
            disabled={isPlaying}
            aria-label="Play pronunciation"
            className="p-2 rounded-full transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 text-slate-400 hover:text-[var(--primary)] hover:bg-orange-50 disabled:opacity-50"
          >
            {isPlaying ? (
              <span className="flex space-x-1 h-4 items-center">
                <span className="w-1 h-2 bg-current rounded-full animate-[bounce_1s_infinite]"></span>
                <span className="w-1 h-3 bg-current rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                <span className="w-1 h-2 bg-current rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
              </span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-lg font-medium text-slate-600 border-b border-slate-100 pb-3">
          {item.translations[locale]}
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-50 rounded-xl p-3 text-sm leading-relaxed text-slate-600">
          <span className="block font-semibold text-slate-400 text-xs uppercase mb-1 tracking-wider">
            {isZh ? '笔记' : 'Note'}
          </span>
          {item.notes[locale] || (isZh ? "暂无笔记" : "No notes")}
        </div>

        {item.example && (
          <div className="bg-orange-50/50 rounded-xl p-3 text-sm leading-relaxed text-slate-600 border border-orange-100/50">
            <div className="flex justify-between items-start">
              <span className="block font-semibold text-orange-400 text-xs uppercase mb-1 tracking-wider">
                {texts.example}
              </span>
              <button
                onClick={playExample}
                disabled={isExamplePlaying}
                aria-label="Play example"
                className="p-1 rounded-full text-orange-300 hover:text-orange-500 hover:bg-orange-100 transition-colors"
              >
                {isExamplePlaying ? (
                  <span className="flex space-x-0.5 h-3 items-center">
                    <span className="w-0.5 h-2 bg-current rounded-full animate-[bounce_1s_infinite]"></span>
                    <span className="w-0.5 h-2.5 bg-current rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                    <span className="w-0.5 h-2 bg-current rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
                  </span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="font-medium text-slate-800 mb-0.5">{item.example.dutch}</p>
            <p className="text-slate-500 text-xs">{item.example[locale]}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function VocabularyListItem({
  item,
  locale,
  hideTranslations,
}: {
  item: VocabularyItem;
  locale: Locale;
  index: number;
  hideTranslations: boolean;
}) {
  const isZh = locale === 'zh';
  const texts = uiTexts[locale].vocabulary;
  const wordToSpeak = item.article ? `${item.article} ${item.dutch}` : item.dutch;
  const { isPlaying, play } = useAudio(wordToSpeak);
  const { isPlaying: isExamplePlaying, play: playExample } = useAudio(item.example?.dutch || "");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`group bg-white rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer
        ${isExpanded ? 'border-[var(--primary)] shadow-md ring-1 ring-[var(--primary)]' : 'border-slate-100 hover:border-slate-200'}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-3 sm:p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-6 text-xs font-mono text-slate-300 text-center">
             {/* You could put numbering here if you had global index, but index is local to page */}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className={`text-lg font-bold truncate transition-colors ${isExpanded ? 'text-[var(--primary)]' : 'text-slate-900'}`}>
                {item.article && (
                  <span className="text-sm font-normal text-slate-400 mr-1.5">{item.article}</span>
                )}
                {item.dutch}
              </h3>
              <span
                className={`text-slate-500 text-sm truncate transition-opacity ${
                  hideTranslations && !isExpanded ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                }`}
              >
                {item.translations[locale]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
            {item.level}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {texts.partOfSpeech[item.partOfSpeech]}
          </span>
          <button
            onClick={play}
            disabled={isPlaying}
            className="p-1.5 rounded-full transition-all active:scale-95 hover:bg-orange-50 text-slate-400 hover:text-[var(--primary)]"
          >
             {isPlaying ? (
              <span className="flex space-x-0.5 h-3 items-center px-0.5">
                <span className="w-0.5 h-1.5 bg-current rounded-full animate-[bounce_1s_infinite]"></span>
                <span className="w-0.5 h-2.5 bg-current rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                <span className="w-0.5 h-1.5 bg-current rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
              </span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
              </svg>
            )}
          </button>
          <div className={`transform transition-transform duration-200 text-slate-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-64 opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-3 sm:p-4 bg-slate-50/50 text-sm text-slate-600 space-y-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{isZh ? '笔记' : 'Note'}</span>
               <span className="text-xs text-slate-400 px-1.5 py-0.5 bg-white rounded border border-slate-200">{item.category}</span>
               <span className="text-xs text-slate-400 px-1.5 py-0.5 bg-blue-50 rounded border border-blue-100">{texts.partOfSpeech[item.partOfSpeech]}</span>
            </div>
            {item.notes[locale] || (isZh ? "暂无笔记" : "No notes")}
          </div>

          {item.example && (
            <div className="bg-orange-50/50 rounded-lg p-2.5 border border-orange-100/50">
              <div className="flex justify-between items-start">
               <span className="block font-semibold text-orange-400 text-xs uppercase mb-1 tracking-wider">
                {texts.example}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playExample(e);
                }}
                disabled={isExamplePlaying}
                aria-label="Play example"
                className="p-1 rounded-full text-orange-300 hover:text-orange-500 hover:bg-orange-100 transition-colors"
              >
                {isExamplePlaying ? (
                  <span className="flex space-x-0.5 h-3 items-center">
                    <span className="w-0.5 h-2 bg-current rounded-full animate-[bounce_1s_infinite]"></span>
                    <span className="w-0.5 h-2.5 bg-current rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                    <span className="w-0.5 h-2 bg-current rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
                  </span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                    <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                  </svg>
                )}
              </button>
              </div>
              <p className="font-medium text-slate-800 mb-0.5">{item.example.dutch}</p>
              <p className="text-slate-500 text-xs">{item.example[locale]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
