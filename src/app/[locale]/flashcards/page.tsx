"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { vocabularyList, VocabularyItem } from "@/data/vocabulary";
import { useAuth } from "@/contexts/AuthContext";
import { LoginNudge } from "@/components/LoginNudge";
import { useWebSpeech } from "@/hooks/useWebSpeech";
import { incrementFlashcardUsage, getFlashcardUsage } from "@/app/actions/progress";

// Limits Configuration
const GUEST_LIMIT = 5;      // Guests can try 5 cards
const FREE_DAILY_LIMIT = 20; // Free users get 20/day (placeholder, not enforced server-side yet)

type SwipeDirection = 'left' | 'right' | null;

// TTS 播放按钮组件
function SpeakButton({ text, speak }: { text: string; speak: (text: string) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    speak(text);
    // 估算播放时间
    setTimeout(() => setIsPlaying(false), Math.max(text.length * 80, 800));
  };

  return (
    <button
      onClick={handleSpeak}
      className={`p-2 rounded-full transition-all ${
        isPlaying 
          ? 'bg-[var(--primary)] text-white scale-110' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
      }`}
      aria-label="Play pronunciation"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {isPlaying ? (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        ) : (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </>
        )}
      </svg>
    </button>
  );
}

export default function FlashcardsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const { user, profile, loading: authLoading } = useAuth();
  const { speak } = useWebSpeech();
  
  const [deck, setDeck] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [showLoginNudge, setShowLoginNudge] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [dailyUsageCount, setDailyUsageCount] = useState(0);
  
  // Touch handling state
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  // Determine user tier and limits
  const isPro = user && profile?.tier === 'pro';
  const isFree = user && profile?.tier !== 'pro';
  const isGuest = !user;

  const cardLimit = isGuest ? GUEST_LIMIT : (isFree ? FREE_DAILY_LIMIT : Infinity);

  // Helper: Pseudo-random shuffle based on date
  const getDailyDeck = useCallback(() => {
    // 1. Get today's date string (e.g., "2024-03-21")
    const today = new Date().toISOString().split("T")[0];
    
    // 2. Simple seeded RNG (mulberry32)
    // Create a seed from the date string
    let seed = 0;
    for (let i = 0; i < today.length; i++) {
        seed = (seed + today.charCodeAt(i)) | 0; // Hash
    }
    
    // Seeded random function
    const seededRandom = () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // 3. Shuffle a copy of the list
    const items = [...vocabularyList];
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
    
    return items;
  }, []);

  // Initialize deck
  useEffect(() => {
    if (authLoading) return;
    
    let items = [...vocabularyList];
    
    if (isPro) {
      if (isShuffled) {
        items = items.sort(() => Math.random() - 0.5);
      }
      // Else: sequential (default order)
    } else {
      // Free/Guest: Use daily date-based shuffle
      items = getDailyDeck();
    }

    setDeck(items);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
    setIsSessionComplete(false);
  }, [authLoading, isShuffled, isPro, getDailyDeck]);

  // Fetch daily usage for free users
  useEffect(() => {
    if (user && !isPro && !authLoading) {
      getFlashcardUsage().then(res => setDailyUsageCount(res.count));
    }
  }, [user, isPro, authLoading]);

  const currentCard = deck[currentIndex];
  const sessionTotal = sessionStats.correct + sessionStats.incorrect;
  const startCount = (user && !isPro) ? dailyUsageCount : 0;
  // totalReviewed represents the count against the limit (Daily for Free, Session for Guest/Pro)
  const totalReviewed = startCount + sessionTotal;
  
  const hasReachedLimit = totalReviewed >= cardLimit;
  const progressBase = cardLimit === Infinity ? deck.length : cardLimit;
  const progress = Math.min((totalReviewed / progressBase) * 100, 100);

  // Handle swipe/answer
  const handleAnswer = useCallback((correct: boolean) => {
    if (hasReachedLimit || isSessionComplete) return;

    setSwipeDirection(correct ? 'right' : 'left');
    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));

    // Sync usage for free users
    if (user && !isPro) {
      incrementFlashcardUsage();
    }

    // Show login nudge for guests after 3 cards
    if (isGuest && totalReviewed === 2 && !showLoginNudge) {
      setTimeout(() => setShowLoginNudge(true), 500);
    }

    // Move to next card after animation
    setTimeout(() => {
      setSwipeDirection(null);
      setIsFlipped(false);
      
      if (currentIndex + 1 >= deck.length || totalReviewed + 1 >= cardLimit) {
        setIsSessionComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  }, [hasReachedLimit, isSessionComplete, isGuest, totalReviewed, showLoginNudge, currentIndex, deck.length, cardLimit, user, isPro]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isFlipped) {
      startX.current = e.touches[0].clientX;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !isFlipped) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
      cardRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || !isFlipped) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = 80;
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease';
      cardRef.current.style.transform = '';
    }
    
    if (Math.abs(diff) > threshold) {
      handleAnswer(diff > 0); // Right = correct, Left = incorrect
    }
  };

  // Mouse handlers for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFlipped) {
      startX.current = e.clientX;
      isDragging.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !isFlipped) return;
    currentX.current = e.clientX;
    const diff = currentX.current - startX.current;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
      cardRef.current.style.transition = 'none';
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.current || !isFlipped) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = 80;
    
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease';
      cardRef.current.style.transform = '';
    }
    
    if (Math.abs(diff) > threshold) {
      handleAnswer(diff > 0);
    }
  };

  const handleFlip = () => {
    if (!hasReachedLimit && !isSessionComplete) {
      setIsFlipped(!isFlipped);
    }
  };

  const resetSession = () => {
    let items = [...vocabularyList];
    
    if (isPro) {
       if (isShuffled) {
         items = items.sort(() => Math.random() - 0.5);
       }
    } else {
       // Free/Guest: Use daily date-based shuffle
       items = getDailyDeck();
    }
    
    setDeck(items);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
    setIsSessionComplete(false);
  };

  const texts = {
    zh: {
      title: "闪卡刷词",
      subtitle: "左滑不认识，右滑认识。翻转卡片查看释义后再作答。",
      tapToFlip: "点击翻转",
      swipeHint: "← 不认识 | 认识 →",
      correct: "认识",
      incorrect: "不认识",
      progress: "进度",
      sessionComplete: "本轮练习完成！",
      correctCount: "认识",
      incorrectCount: "不认识",
      restart: "重新开始",
      backToVocab: "返回词汇表",
      limitReached: "今日练习已达上限",
      guestLimit: "访客预览结束",
      loginToUnlock: "登录解锁随机 20 词",
      upgradeForMore: "升级 Pro 获得无限练习",
      shuffleMode: "乱序模式",
      sequentialMode: "顺序模式",
      proFeature: "Pro 专属",
      cardsLeft: "剩余",
      dailyRandomHint: "今日随机 20 词",
    },
    en: {
      title: "Flash Cards",
      subtitle: "Swipe left if you don't know, right if you do. Tap to flip.",
      tapToFlip: "Tap to flip",
      swipeHint: "← Don't know | Know →",
      correct: "Know",
      incorrect: "Don't know",
      progress: "Progress",
      sessionComplete: "Session Complete!",
      correctCount: "Correct",
      incorrectCount: "Incorrect",
      restart: "Start Over",
      backToVocab: "Back to Vocabulary",
      limitReached: "Daily limit reached",
      guestLimit: "Guest preview ended",
      loginToUnlock: "Log in to unlock random 20 words",
      upgradeForMore: "Upgrade to Pro for unlimited",
      shuffleMode: "Shuffle",
      sequentialMode: "Sequential",
      proFeature: "Pro Feature",
      cardsLeft: "cards left",
      dailyRandomHint: "Today's Random 20",
    }
  }[locale];

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl font-black text-slate-900 mb-2">{texts.title}</h1>
        <p className="text-slate-500 text-sm">{texts.subtitle}</p>
        
        {/* Mode Toggle (Pro Only) */}
        <div className="mt-4 flex flex-col items-center gap-2">
          {!isPro && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium border border-orange-100">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
               </svg>
               {texts.dailyRandomHint}
            </div>
          )}
          
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => isPro && setIsShuffled(false)}
              disabled={!isPro}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isShuffled 
                  ? 'bg-[var(--primary)] text-white shadow-sm' 
                  : isPro 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {texts.sequentialMode}
            </button>
            <button
              onClick={() => isPro && setIsShuffled(true)}
              disabled={!isPro}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isShuffled 
                  ? 'bg-[var(--primary)] text-white shadow-sm' 
                  : isPro 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {texts.shuffleMode}
              {!isPro && (
                <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full uppercase font-bold">Pro</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{texts.progress}: {totalReviewed} / {cardLimit === Infinity ? deck.length : cardLimit}</span>
          <span className="text-green-600">{sessionStats.correct} ✓</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[var(--primary)] to-orange-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Area */}
      <div className="relative w-full max-w-md aspect-[3/4] mb-8 perspective-1000">
        {isSessionComplete || hasReachedLimit ? (
          // Session Complete / Limit Screen
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 text-center">
            {hasReachedLimit && !isSessionComplete ? (
              // Limit reached
              <>
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {isGuest ? texts.guestLimit : texts.limitReached}
                </h3>
                <p className="text-slate-500 mb-6">
                  {isGuest ? texts.loginToUnlock : texts.upgradeForMore}
                </p>
                {isGuest ? (
                  <Link
                    href={`/${locale}/login`}
                    className="px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-full hover:brightness-110 transition-all"
                  >
                    {locale === 'zh' ? '免费注册/登录' : 'Sign Up / Log In'}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/pricing`}
                    className="px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-full hover:brightness-110 transition-all"
                  >
                    {locale === 'zh' ? '升级 Pro' : 'Upgrade to Pro'}
                  </Link>
                )}
              </>
            ) : (
              // Session complete (went through all cards or reached limit naturally)
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{texts.sessionComplete}</h3>
                <div className="flex gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-black text-green-500">{sessionStats.correct}</div>
                    <div className="text-xs text-slate-500">{texts.correctCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-red-400">{sessionStats.incorrect}</div>
                    <div className="text-xs text-slate-500">{texts.incorrectCount}</div>
                  </div>
                </div>
                
                {/* Promote Pro for Free users who finished daily session */}
                {!isPro && !isGuest && (
                  <Link
                    href={`/${locale}/pricing`}
                    className="mb-6 text-sm text-[var(--primary)] font-medium hover:underline flex items-center gap-1 group"
                  >
                    <span>{texts.upgradeForMore}</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={resetSession}
                    className="px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-full hover:brightness-110 transition-all"
                  >
                    {texts.restart}
                  </button>
                  <Link
                    href={`/${locale}/vocabulary`}
                    className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-all"
                  >
                    {texts.backToVocab}
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : currentCard ? (
          // Active Flashcard
          <div
            ref={cardRef}
            className={`absolute inset-0 cursor-pointer select-none transition-all duration-300 transform-style-3d
              ${swipeDirection === 'right' ? 'translate-x-[120%] rotate-12 opacity-0' : ''}
              ${swipeDirection === 'left' ? '-translate-x-[120%] -rotate-12 opacity-0' : ''}
              ${isFlipped ? 'rotate-y-180' : ''}
            `}
            onClick={handleFlip}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 backface-hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {currentCard.category}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 text-center mb-2">
                {currentCard.article && (
                  <span className="text-2xl font-normal text-slate-400 mr-2">{currentCard.article}</span>
                )}
                {currentCard.dutch}
              </h2>
              {/* TTS Button */}
              <div className="mt-4">
                <SpeakButton 
                  text={currentCard.article ? `${currentCard.article} ${currentCard.dutch}` : currentCard.dutch} 
                  speak={speak} 
                />
              </div>
              <div className="mt-auto text-slate-400 text-sm">{texts.tapToFlip}</div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-orange-500 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden rotate-y-180 text-white">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider mb-4">
                {uiTexts[locale].vocabulary.partOfSpeech[currentCard.partOfSpeech]}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                {currentCard.translations[locale]}
              </h2>
              {currentCard.example && (
                <div className="bg-white/20 rounded-xl p-4 w-full max-w-xs text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className="text-sm font-medium">{currentCard.example.dutch}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentCard.example!.dutch);
                      }}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      aria-label="Play example"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-white/70">{currentCard.example[locale]}</p>
                </div>
              )}
              <div className="mt-auto text-white/80 text-sm font-medium">{texts.swipeHint}</div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Answer Buttons (visible when card is flipped) */}
      {isFlipped && !isSessionComplete && !hasReachedLimit && (
        <div className="flex gap-4 animate-fade-in">
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-600 font-bold rounded-full hover:bg-red-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {texts.incorrect}
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-600 font-bold rounded-full hover:bg-green-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {texts.correct}
          </button>
        </div>
      )}

      {/* Login Nudge */}
      <LoginNudge 
        locale={locale} 
        isOpen={showLoginNudge} 
        onDismiss={() => setShowLoginNudge(false)} 
      />
    </div>
  );
}

