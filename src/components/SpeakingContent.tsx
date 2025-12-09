"use client";

import { useState } from "react";
import { useWebSpeech } from "@/hooks/useWebSpeech";
import { Locale, uiTexts } from "@/lib/uiTexts";
import {
  examOverviewCards,
  speakingCopy,
  speakingQuestions,
  speakingThemes,
  SpeakingTheme,
  TriText,
  universalPhrases,
} from "@/data/speaking";
import { SpeakingPracticeCard } from "@/components/SpeakingPracticeCard";

// --- Icons ---
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
);
const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const DesktopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

// --- Helper Components ---
function TriLangStack({
  text,
  className = "",
  mainSize = "text-base",
  locale,
}: {
  text: TriText;
  className?: string;
  mainSize?: string;
  locale: Locale;
}) {
  return (
    <div className={className}>
      <p className={`${mainSize} font-bold text-slate-900`}>
        {locale === 'zh' ? text.zh : text.en}
      </p>
      <div className="flex flex-wrap gap-x-2 gap-y-0 mt-0.5">
         <span className="text-xs text-slate-500 font-medium">{text.nl}</span>
      </div>
    </div>
  );
}

function UniversalPhraseCard({
  group,
  locale,
  onSpeak,
}: {
  group: (typeof universalPhrases)[0];
  locale: Locale;
  onSpeak: (text: string, speed: number) => void;
}) {
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 0.75 | 1.0>(0.75);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const phrasesPerPage = 5;
  const totalPages = Math.ceil(group.phrases.length / phrasesPerPage);
  
  const currentPhrases = group.phrases.slice(
    page * phrasesPerPage, 
    (page + 1) * phrasesPerPage
  );

  return (
    <div className="group h-full p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all hover:border-orange-100 relative flex flex-col">
      <div className="mb-4 pb-3 border-b border-slate-50 flex justify-between items-start">
        <div>
            <h3 className="text-lg font-bold text-slate-900">
            {locale === 'zh' ? group.title.zh : group.title.en}
            </h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">
            {group.title.nl}
            </p>
        </div>
        {/* Speed Toggle - Local to card */}
        <div className="relative">
            <button 
                onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1 min-w-[3rem] justify-center"
                title={locale === "zh" ? "切换语速" : "Toggle speed"}
            >
                {playbackSpeed}x
            </button>
            {isSpeedMenuOpen && (
                <div className="absolute top-full right-0 mt-2 flex flex-col bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-10 w-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {[0.5, 0.75, 1.0].map((speed) => (
                        <button
                            key={speed}
                            onClick={() => {
                                setPlaybackSpeed(speed as 0.5 | 0.75 | 1.0);
                                setIsSpeedMenuOpen(false);
                            }}
                            className={`
                                px-3 py-2 text-xs font-medium text-left transition-colors hover:bg-slate-50
                                ${playbackSpeed === speed ? "text-[var(--primary)] bg-orange-50/50" : "text-slate-600"}
                            `}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
      
      <ul className="space-y-3">
        {currentPhrases.map((phrase, idx) => (
          <li key={`${page}-${idx}`} className="group/item flex items-start justify-between gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex-1">
              <p className="font-semibold text-slate-800 text-sm group-hover/item:text-[var(--primary)] transition-colors">
                {phrase.dutch}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {locale === 'zh' ? phrase.translation.zh : phrase.translation.en}
              </p>
            </div>
            <button
              onClick={() => {
                // Replace slashes with " of " (or) for better TTS pronunciation
                const ttsText = phrase.dutch.replace(/\s*\/\s*/g, " of ");
                onSpeak(ttsText, playbackSpeed);
              }}
              className="flex-shrink-0 p-2 rounded-full text-slate-400 bg-slate-50 hover:text-[var(--primary)] hover:bg-orange-50 transition-colors active:scale-95"
              title={locale === 'zh' ? "播放语音" : "Play audio"}
              aria-label={locale === 'zh' ? "播放语音" : "Play audio"}
            >
              <PlayIcon />
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
            <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 rounded-full text-slate-400 hover:text-[var(--primary)] hover:bg-orange-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`
                            w-2 h-2 rounded-full transition-all
                            ${page === i ? "bg-[var(--primary)] scale-110" : "bg-slate-200 hover:bg-slate-300"}
                        `}
                    />
                ))}
            </div>
            <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-1 rounded-full text-slate-400 hover:text-[var(--primary)] hover:bg-orange-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </div>
      )}
    </div>
  );
}

type Props = {
  locale: Locale;
};

export function SpeakingContent({ locale }: Props) {
  const { speak } = useWebSpeech();
  // Ensure we have a valid initial state from the (possibly updated) speakingThemes
  const initialTopic = speakingThemes.length > 0 ? speakingThemes[0].id : "type1_qa";
  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [questionPage, setQuestionPage] = useState(0);

  const filteredQuestions = speakingQuestions.filter(
    (item) => item.topic === activeTopic,
  );
  
  const QUESTIONS_PER_PAGE = 4;
  const totalQuestionPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = filteredQuestions.slice(
    questionPage * QUESTIONS_PER_PAGE,
    (questionPage + 1) * QUESTIONS_PER_PAGE
  );
  
  const isWideLayout = ["type3_comparison", "type4_story"].includes(activeTopic);

  // Reset page when topic changes
  const handleTopicChange = (topicId: string) => {
    setActiveTopic(topicId as SpeakingTheme["id"]);
    setQuestionPage(0);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 0. DESKTOP BANNER */}
      <div className="hidden md:flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-sm">
        <DesktopIcon />
        <p className="font-medium">
          {uiTexts[locale].speaking.desktopBanner}
        </p>
      </div>
      <div className="md:hidden flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm">
        <DesktopIcon />
        <p className="font-medium">
          {uiTexts[locale].speaking.desktopBanner}
        </p>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 sm:p-12 shadow-2xl shadow-slate-200">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[var(--primary)] rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--primary)] backdrop-blur-sm border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            {locale === 'zh' ? speakingCopy.heroBadge.zh : speakingCopy.heroBadge.en}
            <span className="ml-1 pl-2 border-l border-white/20 text-amber-300 font-bold tracking-wide">BETA</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            {locale === 'zh' ? speakingCopy.heroTitle.zh : speakingCopy.heroTitle.en}
            <span className="block text-2xl sm:text-3xl font-medium text-slate-400 mt-2">
               {speakingCopy.heroTitle.nl}
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 max-w-xl leading-relaxed mb-10">
            {locale === 'zh' ? speakingCopy.heroSubtitle.zh : speakingCopy.heroSubtitle.en}
          </p>

          <div className="flex flex-wrap gap-4">
             <a
               href="#practice"
               className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-900/20"
             >
                {locale === 'zh' ? speakingCopy.heroPrimaryAction.zh : speakingCopy.heroPrimaryAction.en}
                <ArrowRightIcon />
             </a>
          </div>
        </div>
      </section>

      {/* 2. EXAM INTEL (Overview Cards) */}
      <section>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <BookIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
                {locale === 'zh' ? speakingCopy.examOverviewTitle.zh : speakingCopy.examOverviewTitle.en}
            </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
            {examOverviewCards.map((card) => (
                <div key={card.id} className="group p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <TriLangStack text={card.title} mainSize="text-xl" locale={locale} />
                    <div className="mt-4 text-sm text-slate-600 leading-relaxed">
                        {locale === 'zh' ? card.detail.zh : card.detail.en}
                    </div>
                    {card.note && (
                        <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400 italic">
                            {locale === 'zh' ? card.note.zh : card.note.en}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* 3. A2-SPECIFIC UNIVERSAL PHRASES / GO-TO ANSWERS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <TimerIcon />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {locale === "zh"
                ? "荷兰语 A2 口试万能句式"
                : "Dutch A2 Speaking: Go-to Phrases"}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {locale === "zh"
                ? "熟记这些句式，在考试中灵活替换关键词，助你流利应答。"
                : "Memorise these patterns and swap words to build fluent answers."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {universalPhrases.map((group) => (
            <UniversalPhraseCard 
              key={group.id} 
              group={group} 
              locale={locale}
              onSpeak={(text, speed) => speak(text, speed)}
            />
          ))}
        </div>
      </section>

      {/* 4. PRACTICE ARENA (The Core) */}
      <section id="practice" className="scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[var(--primary)] font-bold text-sm uppercase tracking-widest mb-2 block">
                {locale === 'zh' ? speakingCopy.practiceArenaLabel.zh : speakingCopy.practiceArenaLabel.en}
            </span>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
                {locale === 'zh' ? speakingCopy.practiceArenaTitle.zh : speakingCopy.practiceArenaTitle.en}
            </h2>
            <p className="text-slate-500">
                {locale === 'zh' ? speakingCopy.practiceArenaSubtitle.zh : speakingCopy.practiceArenaSubtitle.en}
            </p>
        </div>

        {/* Floating Tab Bar for Topics */}
        <div className="sticky top-4 z-40 mb-8 mx-auto max-w-max">
            <div className="flex p-1.5 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full shadow-lg shadow-slate-200/50 overflow-x-auto max-w-[90vw] no-scrollbar">
                {speakingThemes.map((theme) => {
                    const isActive = activeTopic === theme.id;
                    return (
                        <button
                            key={theme.id}
                            onClick={() => handleTopicChange(theme.id)}
                            className={`
                                relative px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                                ${isActive ? "text-white" : "text-slate-500 hover:text-slate-800"}
                            `}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-[var(--primary)] rounded-full -z-10 shadow-sm" />
                            )}
                            {locale === 'zh' ? theme.title.zh : theme.title.en}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Questions Grid */}
        <div className={`grid gap-6 ${isWideLayout ? "w-full grid-cols-1" : "md:grid-cols-2"}`}>
            {currentQuestions.map((question) => (
                <SpeakingPracticeCard 
                    key={question.id} 
                    question={question} 
                    locale={locale} 
                />
            ))}
        </div>

        {/* Question Pagination */}
        {totalQuestionPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-4">
                 <button
                    onClick={() => setQuestionPage((p) => Math.max(0, p - 1))}
                    disabled={questionPage === 0}
                    className="p-2 rounded-full text-slate-400 bg-white border border-slate-100 hover:text-[var(--primary)] hover:border-orange-100 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                
                <div className="flex gap-2">
                    {Array.from({ length: totalQuestionPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setQuestionPage(i)}
                            className={`
                                w-2.5 h-2.5 rounded-full transition-all
                                ${questionPage === i ? "bg-[var(--primary)] scale-125" : "bg-slate-200 hover:bg-slate-300"}
                            `}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setQuestionPage((p) => Math.min(totalQuestionPages - 1, p + 1))}
                    disabled={questionPage === totalQuestionPages - 1}
                    className="p-2 rounded-full text-slate-400 bg-white border border-slate-100 hover:text-[var(--primary)] hover:border-orange-100 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-100 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        )}
      </section>
    </div>
  );
}
