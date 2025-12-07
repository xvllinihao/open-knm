"use client";

import { useState } from "react";
import Image from "next/image";
import { useWebSpeech } from "@/hooks/useWebSpeech";
import { SpeakingQuestion, TriText } from "@/data/speaking";
import { Locale } from "@/lib/uiTexts";

const DesktopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

type Props = {
  question: SpeakingQuestion;
  locale: Locale;
};

// --- Reusable Icons ---
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2c-.92 0-1.805.15-2.63.424A9.97 9.97 0 0112 14c5.523 0 10-4.477 10-10S17.523 2 12 2zM12 22a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M5.625 15.658a1.25 1.25 0 101.75 1.75 1.25 1.25 0 00-1.75-1.75zM3.875 11.033a1.25 1.25 0 101.75 1.75 1.25 1.25 0 00-1.75-1.75zM8.25 19.408a1.25 1.25 0 101.75 1.75 1.25 1.25 0 00-1.75-1.75z" clipRule="evenodd" />
  </svg>
);

const SpeedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);


// --- Sub-components ---

function TriLangDisplay({
  text,
  className,
  locale
}: {
  text: TriText;
  className?: string;
  locale: Locale;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {/* Support Language (Hero) */}
      <p className="text-lg font-bold text-slate-900 leading-snug">
        {locale === 'zh' ? text.zh : text.en}
      </p>
      {/* Dutch */}
      <div className="flex flex-col gap-0.5 border-l-2 border-slate-100 pl-3 mt-2">
           <p className="text-sm text-slate-600 font-medium">{text.nl}</p>
      </div>
    </div>
  );
}

export function SpeakingPracticeCard({ question, locale }: Props) {
  const { isListening, transcript, startListening, stopListening, speak, isSupported } =
    useWebSpeech();
  
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 0.75 | 1.0>(0.75);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  // Simple keyword matching
  const keywords = question.answer.nl
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter((w: string) => w.length > 3);

  const matchedKeywords = keywords.filter((k: string) =>
    transcript.toLowerCase().includes(k)
  );

  const uniqueKeywords = new Set(keywords);
  const uniqueMatches = new Set(matchedKeywords);
  const score = uniqueKeywords.size > 0 ? uniqueMatches.size / uniqueKeywords.size : 0;
  const isMatchHigh = score > 0.6;
  const isMatchMedium = score > 0.3 && score <= 0.6;

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeak = () => {
      // Pass the rate to the speak function
      speak(question.answer.nl, playbackSpeed);
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-orange-100">
      
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-50 to-orange-100 opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 ring-1 ring-slate-100">
          {question.topic}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        {question.image && (
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <div className="aspect-video w-full relative">
              <Image
                src={question.image}
                alt="Topic illustration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
              {locale === 'zh' ? "AI 生成图片" : "AI Generated Image"}
            </div>
          </div>
        )}
        <div className="flex justify-between items-start gap-4">
          <TriLangDisplay text={question.question} locale={locale} className="flex-1" />
          <button
              onClick={() => speak(question.question.nl)}
              className="flex-shrink-0 p-2.5 rounded-full bg-slate-50 text-slate-400 hover:text-[var(--primary)] hover:bg-orange-50 transition-colors ring-1 ring-slate-100"
              title={locale === "zh" ? "听问题" : "Listen to question"}
          >
              <PlayIcon />
          </button>
        </div>
      </div>

      {/* Answer Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-sm font-medium text-[var(--primary)] hover:underline focus:outline-none"
        >
          {showAnswer 
            ? (locale === 'zh' ? "隐藏参考答案" : "Hide Answer")
            : (locale === 'zh' ? "查看参考答案" : "Show Answer")
          }
        </button>
      </div>

      {/* Answer Area */}
      {showAnswer && (
        <div className="rounded-2xl bg-slate-50 p-5 mb-6 ring-1 ring-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                  <p className="text-base font-bold text-slate-800">{question.answer.nl}</p>
                  {locale === 'zh' ? (
                      <p className="text-sm text-slate-500">{question.answer.zh}</p>
                  ) : (
                      <p className="text-sm text-slate-500">{question.answer.en}</p>
                  )}
              </div>
              
              <div className="flex flex-col items-center gap-2 relative">
                   <button
                      onClick={handleSpeak}
                      className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-white text-[var(--primary)] shadow-sm hover:scale-105 active:scale-95 transition-all ring-1 ring-slate-100"
                      title={locale === "zh" ? "播放示范" : "Play demo"}
                  >
                      <PlayIcon />
                  </button>
                  
                  {/* Speed Toggle */}
                  <div className="relative">
                      <button 
                          onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                          className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-1 min-w-[3rem] justify-center"
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
          </div>
          
          {/* Tips */}
          <div className="mt-4 pt-4 border-t border-slate-200/60 flex gap-3 text-xs text-slate-500">
              <div className="mt-0.5 text-amber-400 shrink-0">
                  <LightbulbIcon />
              </div>
              <p>
                  <span className="font-semibold text-slate-700 block mb-0.5">Tip:</span>
                  {locale === "zh" ? question.tip.zh : question.tip.en}
              </p>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-50 pt-6 mt-2">
        {/* Main Action Button */}
        {isSupported ? (
            <>
                {/* Desktop: Show Button */}
                <button
                    onClick={toggleRecording}
                    className={`
                        hidden md:flex relative items-center justify-center gap-3 px-8 py-3 rounded-2xl w-full sm:w-auto text-sm font-bold transition-all duration-300 transform active:scale-95
                        ${isListening 
                            ? "bg-red-50 text-red-600 ring-1 ring-red-100" 
                            : "bg-[var(--primary)] text-white shadow-md shadow-orange-200 hover:shadow-lg hover:bg-orange-600"
                        }
                    `}
                >
                    {isListening ? (
                        <>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="w-16 text-center">{locale === "zh" ? "停止" : "Stop"}</span>
                        </>
                    ) : (
                        <>
                            <MicIcon />
                            <span>{locale === "zh" ? "开始练习" : "Start Practice"}</span>
                        </>
                    )}
                </button>

                {/* Mobile: Show Message */}
                <div className="md:hidden w-full p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
                        <DesktopIcon />
                        {locale === "zh" 
                            ? "由于浏览器限制，录音功能请在桌面端体验" 
                            : "Please use desktop for audio recording features"}
                    </p>
                </div>
            </>
        ) : (
            <div className="text-xs text-slate-400 italic w-full text-center">
                {locale === "zh" ? "浏览器不支持语音识别" : "Browser doesn't support speech"}
            </div>
        )}

        {/* Real-time Feedback Area - Only show on desktop when supported */}
        {isSupported && (
            <div className="hidden md:flex flex-1 w-full min-h-[48px] items-center justify-between gap-2">
                <div className="flex-1 relative">
                    {transcript ? (
                        <div className="text-sm text-slate-700 line-clamp-2 pl-2 border-l-2 border-slate-200 italic">
                            "{transcript}"
                        </div>
                    ) : isListening ? (
                         <div className="flex items-center gap-1 pl-2 text-sm text-slate-400">
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                         </div>
                    ) : (
                        <div className="text-xs text-slate-300 italic pl-2">
                             {locale === "zh" ? "点击按钮开始录音..." : "Click button to start recording..."}
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Result Badge Overlay */}
      {score > 0.1 && !isListening && (
          <div className={`
            absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border shadow-sm animate-in zoom-in spin-in-3 duration-300
            ${isMatchHigh 
                ? "bg-green-50 text-green-700 border-green-200" 
                : isMatchMedium 
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-50 text-slate-600 border-slate-200"
            }
          `}>
             {Math.round(score * 100)}% Match
          </div>
      )}
    </article>
  );
}
