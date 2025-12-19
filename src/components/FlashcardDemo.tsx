"use client";

import { useState } from "react";
import { Locale } from "@/lib/uiTexts";

interface FlashcardDemoProps {
  locale: Locale;
}

const DEMO_CARDS = {
  zh: [
    { front: "het huis", back: "房子 / 家" },
    { front: "de fiets", back: "自行车" },
    { front: "gezellig", back: "惬意 / 温馨 (形容氛围)" },
    { front: "de afspraak", back: "预约 / 约会" },
  ],
  en: [
    { front: "het huis", back: "the house" },
    { front: "de fiets", back: "the bicycle" },
    { front: "gezellig", back: "cozy / pleasant / social" },
    { front: "de afspraak", back: "appointment" },
  ],
};

export function FlashcardDemo({ locale }: FlashcardDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cards = DEMO_CARDS[locale];
  const currentCard = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000">
      <div 
        className="relative h-64 w-full cursor-pointer group"
        onClick={handleFlip}
      >
        <div 
          className={`absolute inset-0 h-full w-full rounded-2xl transition-all duration-500 transform-style-3d shadow-xl ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Front */}
          <div className="absolute inset-0 h-full w-full rounded-2xl bg-white p-8 flex flex-col items-center justify-center backface-hidden border border-slate-100">
             <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Dutch</span>
             <h3 className="text-3xl font-black text-slate-800 text-center">{currentCard.front}</h3>
             <div className="mt-8 text-sm text-slate-400">Click to flip</div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 h-full w-full rounded-2xl bg-[var(--primary)] p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 text-white">
             <span className="text-xs font-bold uppercase tracking-wider text-white/80 mb-4">Meaning</span>
             <h3 className="text-2xl font-bold text-center">{currentCard.back}</h3>
             
             <button 
               onClick={handleNext}
               className="mt-8 px-6 py-2 bg-white text-[var(--primary)] rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg"
             >
               Next Card →
             </button>
          </div>
        </div>
      </div>
      
      {/* Stack effect layers */}
      <div className="absolute top-2 left-2 right-2 h-64 bg-slate-100 rounded-2xl -z-10 transform scale-[0.98] translate-y-2 border border-slate-200"></div>
      <div className="absolute top-4 left-4 right-4 h-64 bg-slate-50 rounded-2xl -z-20 transform scale-[0.96] translate-y-4 border border-slate-200"></div>
    </div>
  );
}



