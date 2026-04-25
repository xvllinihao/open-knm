"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { vocabularyList, VocabularyItem } from "@/data/vocabulary";
import { useWebSpeech } from "@/hooks/useWebSpeech";
import { useAuth } from "@/contexts/AuthContext";
import { syncFlashcardWords, syncFlashcardProgress } from "@/app/actions/progress";
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
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
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
  const { profile, user } = useAuth();
  const isPro = profile?.tier === "pro";

  // PRO 特权：无限刷词
  const effectiveLimit = isPro ? 9999 : limit;

  const [deck, setDeck] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  
  // 3 modes: sequential (顺序背词), unknown (只背生词), review (复习模式)
  // Only sequential mode preserves progress
  const [currentMode, setCurrentMode] = useState<'sequential' | 'unknown' | 'review'>('sequential');
  const [activeLevel, setActiveLevel] = useState<"A2" | "B1" | "Mix">("A2");
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [pendingProgress, setPendingProgress] = useState<{
    level: "A2" | "B1" | "Mix";
    current_index: number;
    deck_ids: string[];
    is_reverse: boolean;
    is_review_mode: boolean;
    is_review_known_mode?: boolean;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [knownWords, setKnownWords] = useState<VocabularyItem[]>([]);
  const [unknownWords, setUnknownWords] = useState<VocabularyItem[]>([]);
  const [wordsLoaded, setWordsLoaded] = useState(false);

  // Debounced server sync for known/unknown words (Pro only).
  // Per-swipe writes were causing one full UPDATE round-trip per card and triggered
  // refreshProfile cascades that re-rendered the whole tree. Batch instead.
  const pendingWordsRef = useRef<{ unknown: VocabularyItem[]; known: VocabularyItem[] } | null>(null);
  const wordsSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProRef = useRef(isPro);
  useEffect(() => { isProRef.current = isPro; }, [isPro]);

  const flushWordsSync = useCallback(async () => {
    if (!isProRef.current || !pendingWordsRef.current) {
      console.log('[FlashcardGame] flushWordsSync skipped:', !isProRef.current ? 'not pro' : 'no pending data');
      return;
    }
    const { unknown, known } = pendingWordsRef.current;
    console.log('[FlashcardGame] Syncing to Supabase:', { unknown: unknown.length, known: known.length });
    pendingWordsRef.current = null;
    try {
      const result = await syncFlashcardWords(
        unknown.map(i => i.dutch),
        known.map(i => i.dutch),
      );
      if (!result.success) {
        console.error("syncFlashcardWords error:", result.error);
      } else {
        console.log('[FlashcardGame] Sync to Supabase succeeded');
      }
    } catch (e) {
      console.error("syncFlashcardWords threw:", e);
    }
  }, []);

  const queueWordsSync = useCallback((unknown: VocabularyItem[], known: VocabularyItem[]) => {
    if (!isProRef.current) {
      console.log('[FlashcardGame] queueWordsSync skipped: not pro');
      return;
    }
    console.log('[FlashcardGame] Queueing words sync:', { unknown: unknown.length, known: known.length });
    pendingWordsRef.current = { unknown, known };
    if (wordsSyncTimerRef.current) clearTimeout(wordsSyncTimerRef.current);
    wordsSyncTimerRef.current = setTimeout(() => {
      wordsSyncTimerRef.current = null;
      flushWordsSync();
    }, 800);
  }, [flushWordsSync]);

  // Flush any pending sync on unmount or tab hide
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && pendingWordsRef.current) {
        flushWordsSync();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wordsSyncTimerRef.current) {
        clearTimeout(wordsSyncTimerRef.current);
        wordsSyncTimerRef.current = null;
      }
      flushWordsSync();
    };
  }, [flushWordsSync]);

  // Touch handling state
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const currentCard = deck[currentIndex];

  // Hydrate known/unknown words once per user identity. We deliberately do NOT
  // re-run on every `profile` reference change — otherwise unrelated profile
  // updates (or our own optimistic syncs) would clobber fresh in-session state.
  const lastLoadedUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    // For Pro hydration we need the profile to be loaded; if it isn't yet,
    // wait for the next profile change before claiming "loaded for this user".
    if (currentUserId && isPro && !profile) return;
    if (lastLoadedUserIdRef.current === currentUserId && wordsLoaded) return;

    const hydrate = async () => {
      const idMap = new Map(vocabularyList.map(i => [i.id, i]));

      if (currentUserId && isPro && profile) {
        const findId = (dutch: string) => vocabularyList.find(i => i.dutch === dutch)?.id;
        
        const unknownIds = (profile.unknown_words ?? [])
          .map(d => findId(d))
          .filter((id): id is string => !!id);
        const serverUnknown = unknownIds
          .map(id => idMap.get(id))
          .filter((item): item is VocabularyItem => !!item);
          
        const knownIds = (profile.known_words ?? [])
          .map(d => findId(d))
          .filter((id): id is string => !!id);
        const serverKnown = knownIds
          .map(id => idMap.get(id))
          .filter((item): item is VocabularyItem => !!item);
          
        localStorage.setItem('vocabulary-unknown', JSON.stringify(serverUnknown));
        localStorage.setItem('vocabulary-known', JSON.stringify(serverKnown));
        setUnknownWords(serverUnknown);
        setKnownWords(serverKnown);
      } else {
        const savedKnown: VocabularyItem[] = JSON.parse(localStorage.getItem('vocabulary-known') || '[]');
        const savedUnknown: VocabularyItem[] = JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]');
        const knownFilter = savedKnown.filter(item => idMap.has(item.id));
        const unknownFilter = savedUnknown.filter(item => idMap.has(item.id));
        localStorage.setItem('vocabulary-known', JSON.stringify(knownFilter));
        localStorage.setItem('vocabulary-unknown', JSON.stringify(unknownFilter));
        setKnownWords(knownFilter);
        setUnknownWords(unknownFilter);
      }

      lastLoadedUserIdRef.current = currentUserId;
      setWordsLoaded(true);
    };

    hydrate();
  }, [isPro, profile, user, wordsLoaded]);

  // Sync flashcard progress with server (Pro) and detect resumable state
  useEffect(() => {
    const sync = async () => {
      const raw = localStorage.getItem(`flashcard-progress-${activeLevel}`);
      const localData = raw ? JSON.parse(raw) : null;

      let serverData = null;
      if (isPro) {
        try {
          const result = await syncFlashcardProgress({
            level: activeLevel,
            current_index: localData?.current_index || 0,
            deck_ids: localData?.deck_ids || [],
            is_reverse: localData?.is_reverse || false,
            is_review_mode: localData?.is_review_mode || false,
            is_review_known_mode: localData?.is_review_known_mode || false,
            updated_at: localData?.updated_at || 0
          });
          if (result.success) serverData = result.data;
        } catch (e) {
          console.error("Sync failed", e);
        }
      }

      const finalData = (serverData?.updated_at || 0) > (localData?.updated_at || 0) ? serverData : localData;

      // Check if this progress belongs to current level (for backward compatibility with old data without level field)
      const progressLevel = finalData?.level || (activeLevel === "A2" ? "A2" : null);
      if (user && finalData && finalData.current_index > 0 && progressLevel === activeLevel) {
        setPendingProgress(finalData);
      }
    };

    sync();
  }, [isPro, user, activeLevel]);

  // Build the initial deck once known/unknown words are loaded
  useEffect(() => {
    if (isInitialized || !wordsLoaded) return;

    const build = async () => {
      let items = [...vocabularyList];
      if (activeLevel !== "Mix") {
        items = items.filter(item => item.level === activeLevel);
      }

      if (currentMode === 'sequential') {
        const knownSet = new Set(knownWords.map(w => w.id));
        const unknownSet = new Set(unknownWords.map(w => w.id));
        items = items.filter(i => !knownSet.has(i.id) && !unknownSet.has(i.id));
      } else if (currentMode === 'unknown') {
        const unknownSet = new Set(unknownWords.map(w => w.id));
        items = items.filter(i => unknownSet.has(i.id)).sort(() => Math.random() - 0.5);
      } else if (currentMode === 'review') {
        const knownSet = new Set(knownWords.map(w => w.id));
        const unknownSet = new Set(unknownWords.map(w => w.id));
        items = items.filter(i => knownSet.has(i.id) || unknownSet.has(i.id)).sort(() => Math.random() - 0.5);
      }

      setDeck(items.slice(0, effectiveLimit));
      setIsInitialized(true);
    };

    build();
  }, [wordsLoaded, isInitialized, activeLevel, currentMode, effectiveLimit, knownWords, unknownWords]);

  const updateDeck = useCallback((mode: 'sequential' | 'unknown' | 'review', level: "A2" | "B1" | "Mix" = activeLevel) => {
    let baseItems = [...vocabularyList];
    if (level !== "Mix") {
      baseItems = baseItems.filter(item => item.level === level);
    }

    if (mode === 'sequential') {
      const knownSet = new Set(knownWords.map(w => w.id));
      const unknownSet = new Set(unknownWords.map(w => w.id));
      baseItems = baseItems.filter(i => !knownSet.has(i.id) && !unknownSet.has(i.id));
    } else if (mode === 'unknown') {
      const unknownSet = new Set(unknownWords.map(w => w.id));
      baseItems = baseItems.filter(i => unknownSet.has(i.id)).sort(() => Math.random() - 0.5);
    } else if (mode === 'review') {
      const knownSet = new Set(knownWords.map(w => w.id));
      const unknownSet = new Set(unknownWords.map(w => w.id));
      baseItems = baseItems.filter(i => knownSet.has(i.id) || unknownSet.has(i.id)).sort(() => Math.random() - 0.5);
    }

    setDeck(baseItems.slice(0, effectiveLimit));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0 });
    setIsSessionComplete(false);
  }, [effectiveLimit, activeLevel, knownWords, unknownWords]);

  const handleResume = () => {
    if (!pendingProgress) return;
    
    let baseItems: VocabularyItem[] = [];
    
    if (pendingProgress.is_review_mode) {
      const savedUnknown = JSON.parse(localStorage.getItem('vocabulary-unknown') || '[]');
      baseItems = savedUnknown.filter((item: VocabularyItem) => 
        pendingProgress.level === "Mix" || item.level === pendingProgress.level
      );
    } else if (pendingProgress.is_review_known_mode) {
      const savedKnown = JSON.parse(localStorage.getItem('vocabulary-known') || '[]');
      baseItems = savedKnown.filter((item: VocabularyItem) => 
        pendingProgress.level === "Mix" || item.level === pendingProgress.level
      );
    } else {
      const idMap = new Map(vocabularyList.map(i => [i.id, i]));
      baseItems = pendingProgress.deck_ids
        .map(id => idMap.get(id))
        .filter((item): item is VocabularyItem => 
          !!item && (pendingProgress.level === "Mix" || item.level === pendingProgress.level)
        );
    }

    setDeck(baseItems);
    setCurrentIndex(pendingProgress.current_index);
    if (pendingProgress.is_review_mode) {
      setCurrentMode('review');
    } else if (pendingProgress.is_review_known_mode) {
      setCurrentMode('unknown');
    } else {
      setCurrentMode('sequential');
    }
    setPendingProgress(null);
  };

  // Sync Progress (per level)
  useEffect(() => {
    if (!isInitialized) return;

    const now = Date.now();
    const payload = {
      level: activeLevel,
      current_index: currentIndex,
      deck_ids: deck.map(i => i.id),
      is_reverse: currentMode === 'sequential',
      is_review_mode: currentMode === 'review',
      is_review_known_mode: currentMode === 'unknown',
      updated_at: now
    };

    localStorage.setItem(`flashcard-progress-${activeLevel}`, JSON.stringify(payload));

    if (isPro) {
      console.log('[FlashcardGame] Syncing flashcard progress for Pro user');
      syncFlashcardProgress(payload).catch(console.error);
    }
  }, [currentIndex, deck, currentMode, isPro, isInitialized, activeLevel]);

  // Handle swipe/answer
  const handleAnswer = useCallback((correct: boolean) => {
    if (isSessionComplete) return;

    setSwipeDirection(correct ? 'right' : 'left');

    // 记录不认识/认识的单词进度 (Pro 同步到服务器，非 Pro 仅保存在本地)
if (currentCard) {
      const currentId = currentCard.id;
      let newUnknown = [...unknownWords];
      let newKnown = [...knownWords];
      let changed = false;

      if (!correct) {
        const hasInUnknown = newUnknown.some(item => item.id === currentId);
        const hasInKnown = newKnown.some(item => item.id === currentId);
        if (!hasInUnknown) {
          newUnknown.push(currentCard);
          changed = true;
        }
        if (hasInKnown) {
          newKnown = newKnown.filter(item => item.id !== currentId);
          changed = true;
        }
      } else {
        const hasInKnown = newKnown.some(item => item.id === currentId);
        const hasInUnknown = newUnknown.some(item => item.id === currentId);
        if (!hasInKnown) {
          newKnown.push(currentCard);
          changed = true;
        }
        if (hasInUnknown) {
          newUnknown = newUnknown.filter(item => item.id !== currentId);
          changed = true;
        }
      }

      if (changed) {
        // Optimistic update: local state + localStorage drive the UI immediately.
        setUnknownWords(newUnknown);
        setKnownWords(newKnown);

        localStorage.setItem('vocabulary-unknown', JSON.stringify(newUnknown));
        localStorage.setItem('vocabulary-known', JSON.stringify(newKnown));

        // Pro: queue a debounced server write. We deliberately don't refreshProfile()
        // here — local state is canonical for the rest of the session, and a refresh
        // would cascade through AuthContext and re-run loadWords on every swipe.
        queueWordsSync(newUnknown, newKnown);
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
  }, [isSessionComplete, currentIndex, deck.length, isFlipped, currentCard, knownWords, unknownWords, queueWordsSync]);

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

  const setMode = (mode: 'sequential' | 'unknown' | 'review') => {
    if (!isPro) return;

    if (mode === 'sequential' && pendingProgress && pendingProgress.level === activeLevel && !pendingProgress.is_review_mode && !pendingProgress.is_review_known_mode) {
      handleResume();
      return;
    }

    setCurrentMode(mode);
    updateDeck(mode);
  };

  const reviewedCount = sessionStats.correct + sessionStats.incorrect;

  const displayProgressCount = currentMode === 'sequential' 
    ? currentIndex + 1 
    : reviewedCount;
  const displayTotalCount = effectiveLimit === 9999 ? deck.length : effectiveLimit;

  const resetSession = () => {
    updateDeck(currentMode);
  };

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
      modeSequentialDesc: "按顺序学习新单词，自动保存进度",
      modeUnknownDesc: "专注生词，随机抽取未掌握的单词",
      modeReviewDesc: "混合复习已学单词，巩固记忆",
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
      modeSequentialDesc: "Learn new words in order, progress auto-saved",
      modeUnknownDesc: "Focus on new words, randomly select unlearned",
      modeReviewDesc: "Mixed review of learned words, strengthen memory",
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
      {/* Level Selector */}
      {!isSessionComplete && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => {
                setActiveLevel("A2");
                updateDeck(currentMode, "A2");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLevel === "A2"
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-slate-600 hover:text-slate-700"
              }`}
            >
              A2
            </button>
            <button
              onClick={() => {
                setActiveLevel("B1");
                updateDeck(currentMode, "B1");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLevel === "B1"
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-slate-600 hover:text-slate-700"
              }`}
            >
              B1
            </button>
            <button
              onClick={() => {
                setActiveLevel("Mix");
                updateDeck(currentMode, "Mix");
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLevel === "Mix"
                  ? "bg-white text-[var(--primary)] shadow-sm"
                  : "text-slate-600 hover:text-slate-700"
              }`}
            >
              Mix
            </button>
          </div>
        </div>
      )}

      {/* Study Pack Controls */}
      {isPro && !isSessionComplete && (
        <div className="flex flex-col gap-3 mb-4 px-1">
          {/* Mode Description Banner */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl px-4 py-3 border border-slate-200">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                currentMode === 'sequential' ? 'bg-orange-500' : 
                currentMode === 'unknown' ? 'bg-purple-500' : 'bg-green-500'
              }`} />
              <span className="text-sm font-medium text-slate-700">
                {currentMode === 'sequential' ? texts.modeSequentialDesc :
                 currentMode === 'unknown' ? texts.modeUnknownDesc : texts.modeReviewDesc}
              </span>
            </div>
          </div>
          
          {/* Mode Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMode('sequential')}
              className={`py-2 px-1 rounded-xl text-center transition-all border ${
                currentMode === 'sequential'
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" 
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="text-[10px] sm:text-xs font-bold">{texts.modeSequential}</div>
            </button>
            <button
              onClick={() => setMode('unknown')}
              className={`py-2 px-1 rounded-xl text-center transition-all border ${
                currentMode === 'unknown'
                  ? "bg-purple-600 text-white border-purple-600 shadow-md" 
                  : "bg-white text-purple-600 border-purple-200 hover:bg-purple-50"
              }`}
            >
              <div className="text-[10px] sm:text-xs font-bold">{texts.modeUnknown}</div>
            </button>
            <button
              onClick={() => setMode('review')}
              className={`py-2 px-1 rounded-xl text-center transition-all border ${
                currentMode === 'review'
                  ? "bg-green-600 text-white border-green-600 shadow-md" 
                  : "bg-white text-green-600 border-green-200 hover:bg-green-50"
              }`}
            >
              <div className="text-[10px] sm:text-xs font-bold">{texts.modeReview}</div>
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {!isSessionComplete && deck.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
<span className="text-sm font-bold text-slate-700">
                {currentMode === 'sequential' ? texts.descSequential : currentMode === 'unknown' ? texts.descUnknown : texts.descReview}
              </span>
             <span className="text-xs text-slate-600">{texts.progress}: {displayProgressCount} / {displayTotalCount}</span>
           </div>
           <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-[var(--primary)] transition-all duration-300"
               style={{ width: `${(displayProgressCount / displayTotalCount) * 100}%` }}
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
                <div className="text-xs text-slate-600">{texts.correct}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-red-400">{sessionStats.incorrect}</div>
                <div className="text-xs text-slate-600">{texts.incorrect}</div>
              </div>
            </div>

            <p className="text-slate-600 mb-6 text-sm">
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
              {texts.limitReached}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {currentMode === 'sequential' ? texts.descSequential : currentMode === 'unknown' ? texts.descUnknown : texts.descReview}
            </p>
            
            <button
              onClick={() => setCurrentMode(currentMode === 'sequential' ? 'unknown' : 'sequential')}
              className="mt-8 px-6 py-2 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-all"
            >
              {currentMode === 'sequential' ? texts.modeUnknown : texts.modeSequential}
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
          <FlashcardStats locale={locale} knownWords={knownWords} unknownWords={unknownWords} level={activeLevel} />
        </div>
      )}
      {/* Paywall Modal */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                {locale === 'zh' ? '解锁高级词汇' : 'Unlock Premium Vocabulary'}
              </h3>
              <p className="text-slate-600 mb-8">
                {locale === 'zh' 
                  ? '升级以解锁 B1 级别词汇库、无限闪卡刷词，以及更多高级功能。' 
                  : 'Upgrade to unlock the B1 vocabulary list, unlimited flashcards, and more premium features.'}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/${locale}/resources`}
                  className="w-full py-3.5 bg-[var(--primary)] text-white font-bold rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                >
                  {locale === 'zh' ? '查看升级方案' : 'View Premium Plans'}
                </Link>
                <button
                  onClick={() => setShowPaywallModal(false)}
                  className="w-full py-3.5 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-all"
                >
                  {locale === 'zh' ? '暂不升级' : 'Not Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

