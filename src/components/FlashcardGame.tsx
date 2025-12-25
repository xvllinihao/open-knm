"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { vocabularyList, VocabularyItem } from "@/data/vocabulary";
import { useWebSpeech } from "@/hooks/useWebSpeech";
import { useAuth } from "@/contexts/AuthContext";
import { syncFlashcardWords, syncFlashcardProgress } from "@/app/actions/progress";
import { ResumePrompt } from "@/components/ResumePrompt";
import { FlashcardStats } from "@/components/FlashcardStats";

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
  const { profile, refreshProfile, user } = useAuth();
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
  const [isReviewKnownMode, setIsReviewKnownMode] = useState(false);
  const [pendingProgress, setPendingProgress] = useState<{
    current_index: number;
    deck_ids: string[];
    is_reverse: boolean;
    is_review_mode: boolean;
    is_review_known_mode?: boolean;
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
      if (isPro && !isInitialized) {
        try {
          const result = await syncFlashcardProgress({
            current_index: localData?.current_index || 0,
            deck_ids: localData?.deck_ids || [],
            is_reverse: localData?.is_reverse || false,
            is_review_mode: localData?.is_review_mode || false,
            is_review_known_mode: localData?.is_review_known_mode || false,
            updated_at: localData?.updated_at || 0
          });
          if (result.success) serverData = result.data;

          // Sync known/unknown words from profile to local storage (Initial load only)
          if (profile) {
            const idMap = new Map(vocabularyList.map(i => [i.dutch, i]));
            
            if (profile.unknown_words && profile.unknown_words.length > 0) {
              const serverItems = profile.unknown_words.map(d => idMap.get(d)).filter(Boolean);
              localStorage.setItem('vocabulary-unknown', JSON.stringify(serverItems));
            }
            
            if (profile.known_words && profile.known_words.length > 0) {
              const serverItems = profile.known_words.map(d => idMap.get(d)).filter(Boolean);
              localStorage.setItem('vocabulary-known', JSON.stringify(serverItems));
            }
          }
        } catch (e) {
          console.error("Sync failed", e);
        }
      }

      const finalData = (serverData?.updated_at || 0) > (localData?.updated_at || 0) ? serverData : localData;

      if (user && finalData && finalData.current_index > 0) {
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
  }, [isPro, effectiveLimit, profile, isInitialized, isReverse, user]);

  // Handle deck updates (mode changes)
  const updateDeck = useCallback((review: boolean, reverse: boolean, reviewKnown: boolean = false) => {
    let baseItems: VocabularyItem[] = [];
    
    if (review) {
      baseItems = JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]');
    } else if (reviewKnown) {
      const knownItems = JSON.parse(localStorage.getItem('vocabulary-known') || '[]');
      baseItems = [...knownItems].sort(() => Math.random() - 0.5).slice(0, 10);
    } else {
      baseItems = [...vocabularyList];
    }
    
    if (baseItems.length === 0 && (review || reviewKnown)) {
      setDeck([]);
    } else {
      if (!reverse && !review && !reviewKnown) {
        baseItems = baseItems.sort(() => Math.random() - 0.5);
      }
      setDeck(baseItems.slice(0, effectiveLimit));
    }

    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
    setIsSessionComplete(false);
  }, [effectiveLimit]);

  const handleResume = () => {
    if (!pendingProgress) return;
    
    // Restore deck state
    let baseItems: VocabularyItem[] = [];
    
    if (pendingProgress.is_review_mode) {
      baseItems = JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]');
    } else if (pendingProgress.is_review_known_mode) {
      baseItems = JSON.parse(localStorage.getItem('vocabulary-known') || '[]');
    } else {
      baseItems = [...vocabularyList];
    }
    
    // If we're resuming a specific random deck, we should ideally have the IDs
    if (pendingProgress.deck_ids.length > 0) {
      const idMap = new Map(vocabularyList.map(i => [i.id, i]));
      baseItems = pendingProgress.deck_ids.map(id => idMap.get(id)).filter(Boolean) as VocabularyItem[];
    } else if (pendingProgress.is_reverse) {
      // already in original order
      if (!pendingProgress.is_review_mode && !pendingProgress.is_review_known_mode) {
        baseItems = baseItems.reverse();
      }
    } else if (!pendingProgress.is_review_mode && !pendingProgress.is_review_known_mode) {
      // was random but no ids? shuffle again (fallback)
      baseItems = baseItems.sort(() => Math.random() - 0.5);
    }

    setDeck(baseItems);
    setCurrentIndex(pendingProgress.current_index);
    setIsReverse(pendingProgress.is_reverse);
    setIsReviewMode(pendingProgress.is_review_mode);
    setIsReviewKnownMode(pendingProgress.is_review_known_mode || false);
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
      is_review_known_mode: isReviewKnownMode,
      updated_at: now
    };
    
    localStorage.setItem("flashcard-progress", JSON.stringify(payload));
    
    if (isPro) {
      syncFlashcardProgress(payload).catch(console.error);
    }
  }, [currentIndex, deck, isReverse, isReviewMode, isReviewKnownMode, isPro, isInitialized]);

  // Handle swipe/answer
  const handleAnswer = useCallback((correct: boolean) => {
    if (isSessionComplete) return;

    setSwipeDirection(correct ? 'right' : 'left');
    
    // 记录不认识/认识的单词进度 (Pro 同步到服务器，非 Pro 仅保存在本地)
    if (currentCard) {
      const savedUnknown: VocabularyItem[] = JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]');
      const savedKnown: VocabularyItem[] = JSON.parse(localStorage.getItem('vocabulary-known') || '[]');
      
      let newUnknown = [...savedUnknown];
      let newKnown = [...savedKnown];
      let changed = false;
      
      if (!correct) {
        // 标记为“不认识”：加入不认识列表，从认识列表移除
        if (!savedUnknown.find((item: VocabularyItem) => item.dutch === currentCard.dutch)) {
          newUnknown.push(currentCard);
          changed = true;
        }
        const initialKnownCount = newKnown.length;
        newKnown = newKnown.filter((item: VocabularyItem) => item.dutch !== currentCard.dutch);
        if (newKnown.length < initialKnownCount) changed = true;
      } else {
        // 标记为“认识”：加入认识列表，从不认识列表移除
        if (!savedKnown.find((item: VocabularyItem) => item.dutch === currentCard.dutch)) {
          newKnown.push(currentCard);
          changed = true;
        }
        const initialUnknownCount = newUnknown.length;
        newUnknown = newUnknown.filter((item: VocabularyItem) => item.dutch !== currentCard.dutch);
        if (newUnknown.length < initialUnknownCount) changed = true;
      }

      if (changed) {
        localStorage.setItem('vocabulary-unknown', JSON.stringify(newUnknown));
        localStorage.setItem('vocabulary-known', JSON.stringify(newKnown));
        if (isPro) {
          // Sync to Supabase if Pro
          syncFlashcardWords(
            newUnknown.map((i: VocabularyItem) => i.dutch),
            newKnown.map((i: VocabularyItem) => i.dutch)
          ).then(() => {
            // Refresh profile to keep AuthContext in sync
            refreshProfile();
          }).catch(console.error);
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

    setSessionStats(prev => {
      const newStats = {
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
      };
      
      // Update daily count in localStorage
      const today = new Date().toISOString().split('T')[0];
      const lastUpdate = localStorage.getItem('flashcard-last-update');
      let dailyCount = 0;
      
      if (lastUpdate === today) {
        dailyCount = parseInt(localStorage.getItem('flashcard-today-count') || '0', 10);
      }
      
      localStorage.setItem('flashcard-today-count', (dailyCount + 1).toString());
      localStorage.setItem('flashcard-last-update', today);
      
      return newStats;
    });

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
  }, [isSessionComplete, currentIndex, deck.length, isFlipped, isPro, currentCard, refreshProfile]);

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
      cardRef.current.style.transform = '';
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
      cardRef.current.style.transform = '';
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

  const setMode = (mode: 'sequential' | 'random' | 'unknown' | 'review') => {
    if (!isPro) return;
    
    let newReview = false;
    let newReverse = false;
    let newReviewKnown = false;

    if (mode === 'sequential') {
      newReverse = true;
    } else if (mode === 'unknown') {
      newReview = true;
    } else if (mode === 'review') {
      newReviewKnown = true;
    }
    // random is false for all

    setIsReviewMode(newReview);
    setIsReverse(newReverse);
    setIsReviewKnownMode(newReviewKnown);
    updateDeck(newReview, newReverse, newReviewKnown);
  };

  const reviewedCount = sessionStats.correct + sessionStats.incorrect;

  const resetSession = () => {
    updateDeck(isReviewMode, isReverse, isReviewKnownMode);
  };

  // Get current mastery counts
  const savedKnown = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vocabulary-known') || '[]') : [];
  const savedUnknown = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]') : [];
  const knownCount = isPro ? (profile?.known_words?.length || savedKnown.length) : savedKnown.length;
  const unknownCount = isPro ? (profile?.unknown_words?.length || savedUnknown.length) : savedUnknown.length;

  const texts = {
    zh: {
      tapToFlip: "点击翻转",
      correct: "认识",
      incorrect: "不认识",
      progress: "进度",
      limitReached: "本轮练习已完成！",
      loginToUnlock: isPro ? "太棒了！您已掌握以上单词。" : "注册账户以永久保存背词进度",
      restart: "再来一轮",
      unlockAction: "免费注册/登录",
      sessionResult: "本轮练习结果",
      proFeature: "单词包",
      infinite: "无限模式",
      unknownRecorded: "已记录生词",
      resumeMsg: "是否回到上次刷到的位置？",
      resumeBtn: "恢复进度",
      dismissBtn: "不了，谢谢",
      modeSequential: "顺序背词",
      modeRandom: "乱序背词",
      modeUnknown: "只背生词",
      modeReview: "复习模式",
      modeUnknownEmpty: "没有生词了！快去复习模式巩固一下吧。",
      modeReviewEmpty: "你还没有掌握任何单词，先去背词吧！",
      descSequential: "顺序背词模式",
      descRandom: "乱序挑战模式",
      descUnknown: "生词强化模式",
      descReview: "已掌握词复习模式",
    },
    en: {
      tapToFlip: "Tap to flip",
      correct: "Know",
      incorrect: "Don't know",
      progress: "Progress",
      limitReached: "Session Complete!",
      loginToUnlock: isPro ? "Great job! You've reviewed all cards." : "Sign up to save your learning progress",
      restart: "Review Again",
      unlockAction: "Sign Up / Log In",
      sessionResult: "Session Result",
      proFeature: "Unlocked",
      infinite: "Infinite mode active",
      unknownRecorded: "New words recorded",
      resumeMsg: "Do you want to resume from where you left off?",
      resumeBtn: "Resume Progress",
      dismissBtn: "No, thanks",
      modeSequential: "Sequential",
      modeRandom: "Random",
      modeUnknown: "New Words Only",
      modeReview: "Review Mode",
      modeUnknownEmpty: "No new words! Time to review what you've learned.",
      modeReviewEmpty: "No mastered words yet. Start learning some first!",
      descSequential: "Sequential Mode",
      descRandom: "Random Mode",
      descUnknown: "New Words Mode",
      descReview: "Review Mode",
    }
  }[locale];

  if (!isInitialized) {
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

      {/* Study Pack Controls */}
      {isPro && !isSessionComplete && (
        <div className="flex flex-col gap-3 mb-4 px-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setMode('sequential')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                !isReviewMode && !isReviewKnownMode && isReverse 
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {texts.modeSequential}
            </button>
            <button
              onClick={() => setMode('random')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                !isReviewMode && !isReviewKnownMode && !isReverse 
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {texts.modeRandom}
            </button>
            <button
              onClick={() => setMode('unknown')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                isReviewMode 
                  ? "bg-purple-600 text-white border-purple-600 shadow-md" 
                  : "bg-white text-purple-600 border-purple-200 hover:bg-purple-50"
              }`}
            >
              {texts.modeUnknown}
            </button>
            <button
              onClick={() => setMode('review')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all border ${
                isReviewKnownMode 
                  ? "bg-green-600 text-white border-green-600 shadow-md" 
                  : "bg-white text-green-600 border-green-200 hover:bg-green-50"
              }`}
            >
              {texts.modeReview}
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {!isSessionComplete && deck.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-700">
              {isReviewMode ? texts.descUnknown : isReviewKnownMode ? texts.descReview : isReverse ? texts.descSequential : texts.descRandom}
            </span>
            <span className="text-xs text-slate-500">{texts.progress}: {reviewedCount} / {effectiveLimit === 9999 ? deck.length : effectiveLimit}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${(reviewedCount / (effectiveLimit === 9999 ? deck.length : effectiveLimit)) * 100}%` }}
            />
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-[10px] font-bold text-green-600">{sessionStats.correct} ✓</span>
          </div>
        </div>
      )}

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
        ) : deck.length === 0 ? (
          // Empty State Screen
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {isReviewMode ? texts.modeUnknown : texts.modeReview}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {isReviewMode ? texts.modeUnknownEmpty : texts.modeReviewEmpty}
            </p>
            
            <button
              onClick={() => setMode(isReviewMode ? 'review' : 'random')}
              className="mt-8 px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-full hover:bg-slate-200 transition-all"
            >
              {isReviewMode ? texts.modeReview : texts.modeRandom}
            </button>
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
      {!isSessionComplete && deck.length > 0 && (
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

      {/* Mastery Stats at Bottom */}
      {isPro && !isSessionComplete && (
        <div className="mt-12 pt-8 border-t border-slate-100">
          <FlashcardStats locale={locale} knownCount={knownCount} unknownCount={unknownCount} />
        </div>
      )}
    </div>
  );
}

