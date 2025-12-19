import { Locale, uiTexts } from "@/lib/uiTexts";

export const TTSDisclaimer = ({ locale, className = "" }: { locale: Locale; className?: string }) => {
  const texts = uiTexts[locale].ttsDisclaimer;
  
  return (
    <div className={`rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 ${className}`}>
      <div className="flex gap-2 items-start">
        <span className="shrink-0 text-amber-600 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </span>
        <p>
          <span className="font-bold block sm:inline mr-1">{texts.title}:</span>
          {texts.text}
        </p>
      </div>
    </div>
  );
};



