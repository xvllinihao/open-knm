"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { vocabularyList, VocabularyItem } from "@/data/vocabulary";
import { useWebSpeech } from "@/hooks/useWebSpeech";
import { useAuth } from "@/contexts/AuthContext";
import { syncUnknownWords, syncFlashcardProgress } from "@/app/actions/progress";
import { ResumePrompt } from "@/components/ResumePrompt";

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

type SwipeDirection = 'left' | 'right' | null;

interface FlashcardGameProps {
  locale: Locale;
  limit?: number;
  isDemo?: boolean;
}

export function FlashcardGame({ locale, limit = 5 }: FlashcardGameProps) {
  const { speak } = useWebSpeech();
  const { profile } = useAuth();
  const isPro = profile?.tier === "pro";
  
  // PRO 特权：无限刷词
  const effectiveLimit = isPro ? 9999 : limit;
  
  const [deck, setDeck] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [pendingProgress, setPendingProgress] = useState<{
    current_index: number;
    deck_ids: string[];
    is_reverse: boolean;
    is_review_mode: boolean;
  } | null>(null);
  const [isResumeVisible, setIsResumeVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Touch handling state
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const currentCard = deck[currentIndex];

  // Initialize deck and progress
  useEffect(() => {
    const init = async () => {
      // 1. Load Local Progress
      const raw = localStorage.getItem("flashcard-progress");
      const localData = raw ? JSON.parse(raw) : null;

      // 2. Sync with Server (PRO only)
      let serverData = null;
      if (isPro) {
        try {
          const result = await syncFlashcardProgress({
            current_index: localData?.current_index || 0,
            deck_ids: localData?.deck_ids || [],
            is_reverse: localData?.is_reverse || false,
            is_review_mode: localData?.is_review_mode || false,
            updated_at: localData?.updated_at || 0
          });
          if (result.success) serverData = result.data;

          // Sync unknown words from profile to local storage (Server is source of truth for PRO)
          if (profile?.unknown_words) {
            const serverDutches = profile.unknown_words;
            const idMap = new Map(vocabularyList.map(i => [i.dutch, i]));
            const serverItems = serverDutches.map(d => idMap.get(d)).filter(Boolean);
            localStorage.setItem('vocabulary-unknown', JSON.stringify(serverItems));
          }
        } catch (e) {
          console.error("Sync failed", e);
        }
      }

      const finalData = (serverData?.updated_at || 0) > (localData?.updated_at || 0) ? serverData : localData;

      if (finalData && finalData.current_index > 0) {
        setPendingProgress(finalData);
        setIsResumeVisible(true);
      }

      // Initial Deck Load
      if (!isInitialized) {
        let items = [...vocabularyList];
        if (isReverse) items = items.reverse();
        else items = items.sort(() => Math.random() - 0.5);
        
        setDeck(items.slice(0, effectiveLimit));
        setIsInitialized(true);
      }
    };

    init();
  }, [isPro, effectiveLimit, profile, isInitialized, isReverse]);

  // Handle deck updates (mode changes)
  const updateDeck = useCallback((review: boolean, reverse: boolean) => {
    let baseItems = review 
      ? JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]')
      : [...vocabularyList];
    
    if (baseItems.length === 0 && review) {
      // Fallback if no unknown words
      baseItems = [...vocabularyList];
      setIsReviewMode(false);
      review = false;
    }

    // mode logic:
    // if reverse is true -> sequential (original order)
    // if reverse is false and !review -> random shuffle
    // if review is true -> unknown words (keep their original relative order)
    
    if (!reverse && !review) {
      baseItems = baseItems.sort(() => Math.random() - 0.5);
    }

    setDeck(baseItems.slice(0, effectiveLimit));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
    setIsSessionComplete(false);
  }, [effectiveLimit]);

  const handleResume = () => {
    if (!pendingProgress) return;
    
    // Restore deck state
    let baseItems = pendingProgress.is_review_mode
      ? JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]')
      : [...vocabularyList];
    
    // If we're resuming a specific random deck, we should ideally have the IDs
    if (pendingProgress.deck_ids.length > 0) {
      const idMap = new Map(vocabularyList.map(i => [i.id, i]));
      baseItems = pendingProgress.deck_ids.map(id => idMap.get(id)).filter(Boolean) as VocabularyItem[];
    } else if (pendingProgress.is_reverse) {
      // already in original order
    } else if (!pendingProgress.is_review_mode) {
      // was random but no ids? shuffle again (fallback)
      baseItems = baseItems.sort(() => Math.random() - 0.5);
    }

    setDeck(baseItems);
    setCurrentIndex(pendingProgress.current_index);
    setIsReverse(pendingProgress.is_reverse);
    setIsReviewMode(pendingProgress.is_review_mode);
    setIsResumeVisible(false);
    setPendingProgress(null);
  };

  const handleDismissResume = () => {
    setIsResumeVisible(false);
    setPendingProgress(null);
  };

  // Sync Progress
  useEffect(() => {
    if (!isInitialized) return;
    
    const now = Date.now();
    const payload = {
      current_index: currentIndex,
      deck_ids: deck.map(i => i.id),
      is_reverse: isReverse,
      is_review_mode: isReviewMode,
      updated_at: now
    };
    
    localStorage.setItem("flashcard-progress", JSON.stringify(payload));
    
    if (isPro) {
      syncFlashcardProgress(payload).catch(console.error);
    }
  }, [currentIndex, deck, isReverse, isReviewMode, isPro, isInitialized]);

  // Handle swipe/answer
  const handleAnswer = useCallback((correct: boolean) => {
    if (isSessionComplete) return;

    setSwipeDirection(correct ? 'right' : 'left');
    
    // PRO 功能逻辑
    if (isPro && currentCard) {
      const savedUnknown: VocabularyItem[] = JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]');
      
      if (!correct) {
        // 记录不认识的单词
        if (!savedUnknown.find((item: VocabularyItem) => item.dutch === currentCard.dutch)) {
          const newUnknown = [...savedUnknown, currentCard];
          localStorage.setItem('vocabulary-unknown', JSON.stringify(newUnknown));
          // Sync to Supabase
          syncUnknownWords(newUnknown.map((i: VocabularyItem) => i.dutch)).catch(console.error);
        }
      } else {
        // 如果标记为“认识”，从不认识列表中移除
        const newUnknown = savedUnknown.filter((item: VocabularyItem) => item.dutch !== currentCard.dutch);
        if (newUnknown.length < savedUnknown.length) {
          localStorage.setItem('vocabulary-unknown', JSON.stringify(newUnknown));
          // Sync update to Supabase
          syncUnknownWords(newUnknown.map((i: VocabularyItem) => i.dutch)).catch(console.error);
        }
      }
    }

    // Set the final exit transform inline to ensure it works regardless of flip state
    // and avoids conflicts with CSS classes.
    if (cardRef.current) {
      const exitX = correct ? '120%' : '-120%';
      const exitRotate = correct ? '12deg' : '-12deg';
      const flip = isFlipped ? 'rotateY(180deg)' : '';
      cardRef.current.style.transition = 'all 0.3s ease';
      cardRef.current.style.transform = `translateX(${exitX}) rotate(${exitRotate}) ${flip}`;
      cardRef.current.style.opacity = '0';
    }

    setSessionStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));

    // Move to next card after animation
    setTimeout(() => {
      setSwipeDirection(null);
      setIsFlipped(false);
      
      if (currentIndex + 1 >= deck.length) {
        setIsSessionComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 300);
  }, [isSessionComplete, currentIndex, deck.length, isFlipped, isPro, currentCard]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX; // Initialize to prevent large diff on start
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)${isFlipped ? ' rotateY(180deg)' : ''}`;
      cardRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = 80;
    
    if (Math.abs(diff) > threshold) {
      handleAnswer(diff > 0);
    } else if (cardRef.current) {
      // Reset position if not swiped far enough
      cardRef.current.style.transition = 'transform 0.3s ease';
      cardRef.current.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    }
    
    startX.current = 0;
    currentX.current = 0;
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    currentX.current = e.clientX; // Initialize to prevent large diff on start
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.clientX;
    const diff = currentX.current - startX.current;
    
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)${isFlipped ? ' rotateY(180deg)' : ''}`;
      cardRef.current.style.transition = 'none';
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = 80;
    
    if (Math.abs(diff) > threshold) {
      handleAnswer(diff > 0);
    } else if (cardRef.current) {
      // Reset position if not swiped far enough
      cardRef.current.style.transition = 'transform 0.3s ease';
      cardRef.current.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    }

    startX.current = 0;
    currentX.current = 0;
  };

  const handleFlip = () => {
    // Only flip if it wasn't a significant swipe/drag
    const diff = Math.abs(currentX.current - startX.current);
    if (diff > 10) return;

    if (!isSessionComplete) {
      setIsFlipped(!isFlipped);
    }
  };

  const setMode = (mode: 'sequential' | 'random' | 'review') => {
    if (!isPro) return;
    
    let newReview = false;
    let newReverse = false;

    if (mode === 'sequential') {
      newReverse = true;
    } else if (mode === 'review') {
      newReview = true;
    }
    // random is false for both

    setIsReviewMode(newReview);
    setIsReverse(newReverse);
    updateDeck(newReview, newReverse);
  };

  const reviewedCount = sessionStats.correct + sessionStats.incorrect;

  const resetSession = () => {
    updateDeck(isReviewMode, isReverse);
  };

  const texts = {
    zh: {
      tapToFlip: "点击翻转",
      correct: "认识",
      incorrect: "不认识",
      progress: "进度",
      limitReached: isPro ? "本轮练习已完成！" : "访客预览结束",
      loginToUnlock: isPro ? "太棒了！您已掌握以上单词。" : "登录解锁每日 20 词",
      restart: isPro ? "再来一轮" : "再次体验",
      unlockAction: "免费注册/登录",
      sessionResult: "本轮练习结果",
      proFeature: "已解锁",
      infinite: "无限刷词已激活",
      unknownRecorded: "已记录不认识单词",
      resumeMsg: "是否回到上次刷到的位置？",
      resumeBtn: "恢复进度",
      dismissBtn: "从头开始",
      modeSequential: "顺序背词",
      modeRandom: "乱序背词",
      modeReview: "只背不会的",
    },
    en: {
      tapToFlip: "Tap to flip",
      correct: "Know",
      incorrect: "Don't know",
      progress: "Progress",
      limitReached: isPro ? "Session Complete!" : "Guest preview ended",
      loginToUnlock: isPro ? "Great job! You've reviewed all cards." : "Log in to unlock daily 20 words",
      restart: isPro ? "Review Again" : "Try Again",
      unlockAction: "Sign Up / Log In",
      sessionResult: "Session Result",
      proFeature: "Unlocked",
      infinite: "Infinite mode active",
      unknownRecorded: "Unknown words recorded",
      resumeMsg: "Do you want to resume from where you left off?",
      resumeBtn: "Resume Progress",
      dismissBtn: "Start Over",
      modeSequential: "Sequential",
      modeRandom: "Random",
      modeReview: "Unknown Only",
    }
  }[locale];

  if (deck.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Resume Prompt */}
      {isResumeVisible && pendingProgress && (
        <div className="mb-6">
          <ResumePrompt
            message={texts.resumeMsg}
            confirmText={texts.resumeBtn}
            dismissText={texts.dismissBtn}
            onConfirm={handleResume}
            onDismiss={handleDismissResume}
          />
        </div>
      )}

      {/* PRO Controls */}
      {isPro && !isSessionComplete && (
        <div className="flex flex-col gap-3 mb-4 px-1">
          <div className="flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            {texts.proFeature}: {texts.infinite}
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMode('sequential')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                !isReviewMode && isReverse 
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {texts.modeSequential}
            </button>
            <button
              onClick={() => setMode('random')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                !isReviewMode && !isReverse 
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {texts.modeRandom}
            </button>
            <button
              onClick={() => setMode('review')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                isReviewMode 
                  ? "bg-purple-600 text-white border-purple-600 shadow-md" 
                  : "bg-white text-purple-600 border-purple-200 hover:bg-purple-50"
              }`}
            >
              {texts.modeReview}
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{texts.progress}: {reviewedCount} / {effectiveLimit === 9999 ? deck.length : effectiveLimit}</span>
          <span className="text-green-600">{sessionStats.correct} ✓</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${(reviewedCount / (effectiveLimit === 9999 ? deck.length : effectiveLimit)) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Area */}
      <div className="relative w-full aspect-[3/4] mb-8 perspective-1000 touch-none">
        {isSessionComplete ? (
          // Session Complete Screen
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {texts.limitReached}
            </h3>
            
            {/* Session Stats */}
            <div className="flex gap-8 mb-6 mt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-green-500">{sessionStats.correct}</div>
                <div className="text-xs text-slate-500">{texts.correct}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-400">{sessionStats.incorrect}</div>
                <div className="text-xs text-slate-500">{texts.incorrect}</div>
              </div>
            </div>

            <p className="text-slate-500 mb-6 text-sm">
              {texts.loginToUnlock}
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              {!isPro && (
                <Link
                  href={`/${locale}/login`}
                  className="w-full py-3 bg-[var(--primary)] text-white font-bold rounded-full hover:brightness-110 transition-all shadow-lg shadow-orange-200"
                >
                  {texts.unlockAction}
                </Link>
              )}
              <button
                onClick={resetSession}
                className={`w-full py-3 font-bold rounded-full transition-all ${
                  isPro 
                    ? "bg-[var(--primary)] text-white shadow-lg shadow-orange-200 hover:brightness-110" 
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {texts.restart}
              </button>
            </div>
          </div>
        ) : currentCard ? (
          // Active Flashcard
          <div
            key={currentIndex}
            ref={cardRef}
            className={`absolute inset-0 cursor-pointer select-none transition-all duration-300 transform-style-3d touch-none
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
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center p-6 sm:p-8 backface-hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {currentCard.category}
              </span>
              <div className="flex-1 flex flex-col items-center w-full max-w-full px-2 pt-12 sm:pt-16">
                {currentCard.article && (
                  <span className="text-lg sm:text-xl font-normal text-slate-400 mb-1">{currentCard.article}</span>
                )}
                <h2 className={`font-black text-slate-900 text-center break-words hyphens-auto w-full ${
                  currentCard.dutch.length > 15 
                    ? 'text-2xl sm:text-3xl' 
                    : currentCard.dutch.length > 10 
                      ? 'text-3xl sm:text-4xl' 
                      : 'text-4xl sm:text-5xl'
                }`}>
                  {currentCard.dutch}
                </h2>
                {/* TTS Button */}
                <div className="mt-6">
                  <SpeakButton 
                    text={currentCard.article ? `${currentCard.article} ${currentCard.dutch}` : currentCard.dutch} 
                    speak={speak} 
                  />
                </div>
              </div>
              
              <div className="mt-auto text-slate-400 text-sm">{texts.tapToFlip}</div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 bg-[var(--primary)] rounded-3xl shadow-xl flex flex-col items-center p-6 sm:p-8 backface-hidden rotate-y-180 text-white overflow-hidden">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                {uiTexts[locale].vocabulary.partOfSpeech[currentCard.partOfSpeech]}
              </span>
              
              <div className="flex-1 flex flex-col items-center w-full pt-12 sm:pt-16 px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">
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
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Answer Buttons */}
      {!isSessionComplete && (
        <div className="flex gap-8 justify-center animate-fade-in">
          <button
            onClick={() => handleAnswer(false)}
            className="flex items-center justify-center w-14 h-14 bg-red-50 text-red-500 rounded-full hover:bg-red-100 hover:scale-110 transition-all shadow-sm border-2 border-red-100"
            aria-label={texts.incorrect}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex items-center justify-center w-14 h-14 bg-green-50 text-green-500 rounded-full hover:bg-green-100 hover:scale-110 transition-all shadow-sm border-2 border-green-100"
            aria-label={texts.correct}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

