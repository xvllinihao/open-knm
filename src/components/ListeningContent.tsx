"use client";

import { useState, useEffect } from "react";
import { courseData, TriText, ListeningInfo, ListeningStrategy, ListeningCategory, ListeningExercise } from "@/data/listening";
import { Locale } from "@/lib/uiTexts";

// --- Icons ---
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);
const HeadphonesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
);
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
);
const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>
);

// --- Helpers ---
function getTriText(text: TriText, locale: Locale) {
    if (locale === 'zh') return text.zh;
    return text.en;
}

function SectionHeader({ title, description, icon, locale }: { title: TriText, description?: TriText, icon?: React.ReactNode, locale: Locale }) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
                {icon && <div className="p-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl">{icon}</div>}
                <h2 className="text-2xl font-bold text-slate-900">{getTriText(title, locale)}</h2>
            </div>
            {description && (
                <p className="text-slate-700 ml-1">{getTriText(description, locale)}</p>
            )}
            {title.nl && <p className="text-sm text-slate-400 font-medium ml-1 mt-1">{title.nl}</p>}
        </div>
    );
}

function InfoCard({ item, locale }: { item: ListeningInfo, locale: Locale }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 text-[var(--primary)]"><InfoIcon /></div>
                <div>
                    {item.content.nl && <p className="font-bold text-slate-800 text-lg mb-1">{item.content.nl}</p>}
                    <p className={`text-slate-700 ${!item.content.nl ? 'font-medium' : ''}`}>{getTriText(item.content, locale)}</p>
                </div>
            </div>
        </div>
    );
}

function StrategyCard({ item, locale }: { item: ListeningStrategy, locale: Locale }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-[var(--primary)] mb-2">{getTriText(item.title, locale)}</h3>
            {item.title.nl && <p className="text-sm text-slate-400 font-medium mb-4">{item.title.nl}</p>}
            <div className="space-y-2">
                {item.content.nl && <p className="font-medium text-slate-800">{item.content.nl}</p>}
                <p className="text-slate-600 text-sm">{getTriText(item.content, locale)}</p>
            </div>
        </div>
    );
}

function PracticeExerciseCard({ exercise, locale }: { exercise: ListeningExercise, locale: Locale }) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const isCorrect = selectedOption === exercise.correctAnswer;

    useEffect(() => {
        return () => {
            if (isPlaying) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isPlaying]);

    const handlePlayAudio = () => {
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(exercise.text.nl);
        utterance.lang = "nl-NL";
        utterance.rate = 0.85; // Slightly slower for A2 level

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6 flex flex-col items-center justify-center bg-slate-50 p-8 rounded-xl border border-slate-100">
                 <button 
                    onClick={handlePlayAudio}
                    className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all hover:scale-105 ${isPlaying ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' : 'bg-[var(--primary)] text-white hover:bg-orange-600'}`}
                    aria-label={isPlaying ? "Stop audio" : "Play audio"}
                 >
                    {isPlaying ? <StopIcon /> : <PlayIcon />}
                 </button>
                 <p className="mt-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    {isPlaying ? (locale === 'zh' ? "播放中..." : "Playing...") : (locale === 'zh' ? "点击播放音频" : "Click to play audio")}
                 </p>
            </div>

            <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {locale === 'zh' ? "问题" : "Question"}
                </h4>
                <p className="font-bold text-slate-800 text-lg mb-1">{exercise.question.nl}</p>
                <p className="text-slate-600 text-sm mb-4">{getTriText(exercise.question, locale)}</p>

                <div className="space-y-3">
                    {exercise.options.map((option) => {
                        const isSelected = selectedOption === option.id;
                        const isCorrectOption = option.id === exercise.correctAnswer;
                        
                        let optionClass = "border-slate-200 hover:border-[var(--primary)]/50 hover:bg-slate-50";
                        if (showExplanation) {
                            if (isCorrectOption) {
                                optionClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
                            } else if (isSelected && !isCorrectOption) {
                                optionClass = "border-red-300 bg-red-50 text-red-900";
                            } else {
                                optionClass = "border-slate-200 opacity-50";
                            }
                        } else if (isSelected) {
                            optionClass = "border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]";
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => {
                                    if (!showExplanation) {
                                        setSelectedOption(option.id);
                                    }
                                }}
                                disabled={showExplanation}
                                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-3 ${optionClass}`}
                            >
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                                    showExplanation && isCorrectOption ? "bg-emerald-500 text-white" :
                                    showExplanation && isSelected && !isCorrectOption ? "bg-red-400 text-white" :
                                    isSelected ? "bg-[var(--primary)] text-white" : "bg-slate-100 text-slate-500"
                                }`}>
                                    {option.id}
                                </span>
                                <span className="font-medium">{option.text}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                {!showExplanation && selectedOption && (
                    <button 
                        onClick={() => setShowExplanation(true)}
                        className="px-8 py-3 rounded-full bg-[var(--primary)] text-white font-bold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        {locale === 'zh' ? "提交答案" : "Submit Answer"}
                    </button>
                )}

                {showExplanation && (
                    <div className="w-full animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className={`rounded-xl p-5 border mb-4 ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                            <h4 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                                {isCorrect ? '✅ ' : '❌ '}
                                {isCorrect 
                                    ? (locale === 'zh' ? "回答正确！" : "Correct!") 
                                    : (locale === 'zh' ? "回答错误" : "Incorrect")}
                            </h4>
                        </div>
                        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                             <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                                {locale === 'zh' ? "听力原文与解析" : "Transcript & Explanation"}
                            </h4>
                            <div className="mb-4 p-3 bg-white rounded-lg border border-blue-100">
                                <p className="font-medium text-slate-800 whitespace-pre-line">{exercise.text.nl}</p>
                            </div>
                            <p className="font-medium text-slate-800 mb-1">{exercise.explanation.nl}</p>
                            <p className="text-sm text-slate-700">
                                {getTriText(exercise.explanation, locale)}
                            </p>
                        </div>
                        <button 
                            onClick={() => {
                                setSelectedOption(null);
                                setShowExplanation(false);
                            }}
                            className="mt-4 px-6 py-2 rounded-full bg-white border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
                        >
                            {locale === 'zh' ? "重试本题" : "Try Again"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function PracticeSection({ categories, locale }: { categories: ListeningCategory[], locale: Locale }) {
    const [activeTab, setActiveTab] = useState(categories[0].id);
    const activeCategory = categories.find(c => c.id === activeTab) || categories[0];

    return (
        <div>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                            activeTab === cat.id
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md transform scale-105"
                                : "bg-white text-slate-700 border-slate-200 hover:border-[var(--primary)]/30 hover:text-[var(--primary)]"
                        }`}
                    >
                        {getTriText(cat.title, locale)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-8 max-w-3xl mx-auto">
                {activeCategory.exercises.map((ex) => (
                    <PracticeExerciseCard key={ex.id} exercise={ex} locale={locale} />
                ))}
            </div>
        </div>
    );
}

// --- Main Component ---
export function ListeningContent({ locale }: { locale: Locale }) {
    const { meta, sections } = courseData;

    return (
        <div className="space-y-16 pb-20">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 sm:p-12 shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[var(--primary)] rounded-full blur-[100px] opacity-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
                
                <div className="relative z-10 max-w-3xl">
                     <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[var(--primary)] backdrop-blur-sm border border-white/10 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                        A2 Listening
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 leading-[1.1]">
                        {getTriText(meta.title, locale)}
                    </h1>
                    <p className="text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
                        {getTriText(meta.description, locale)}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#exam_info" className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] text-white px-6 py-3 text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-900/20">
                            {locale === 'zh' ? "开始学习" : "Start Learning"}
                        </a>
                        <a href="#practice_exercises" className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white border border-white/20 px-6 py-3 text-sm font-bold hover:bg-white/20 transition-colors">
                            {locale === 'zh' ? "直接练习" : "Go to Practice"} →
                        </a>
                    </div>
                </div>
            </section>

            {/* SECTIONS */}
            <div className="grid gap-16">
                {sections.map((section) => {
                    if (section.id === "exam_info") {
                        return (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <SectionHeader title={section.title} description={section.description} icon={<InfoIcon />} locale={locale} />
                                <div className="grid gap-4 md:grid-cols-2">
                                    {section.items?.map((item, idx) => (
                                        <InfoCard key={idx} item={item as ListeningInfo} locale={locale} />
                                    ))}
                                </div>
                            </section>
                        );
                    }
                    if (section.id === "listening_strategies") {
                        return (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <SectionHeader title={section.title} description={section.description} icon={<HeadphonesIcon />} locale={locale} />
                                <div className="grid gap-4 md:grid-cols-3">
                                     {section.items?.map((item, idx) => (
                                        <StrategyCard key={idx} item={item as ListeningStrategy} locale={locale} />
                                    ))}
                                </div>
                            </section>
                        );
                    }
                    if (section.id === "practice_exercises") {
                        return (
                             <section key={section.id} id={section.id} className="scroll-mt-24 pt-10 border-t border-slate-100">
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">
                                        {getTriText(section.title, locale)}
                                    </h2>
                                    {section.title.nl && <p className="text-slate-600">{section.title.nl}</p>}
                                </div>
                                <PracticeSection categories={section.categories || []} locale={locale} />
                             </section>
                        );
                   }
                   return null;
                })}
            </div>
        </div>
    );
}
