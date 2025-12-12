"use client";

import { useState } from "react";
import { courseData, TriText, WritingRule, GrammarRule, Connector, EmailTemplatePart, Scenario, PracticeCategory, PracticeExercise } from "@/data/writing";
import { Locale } from "@/lib/uiTexts";

// --- Icons ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
);
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
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
                <p className="text-slate-600 ml-1">{getTriText(description, locale)}</p>
            )}
            <p className="text-sm text-slate-400 font-medium ml-1 mt-1">{title.nl}</p>
        </div>
    );
}

function RuleCard({ item, locale }: { item: WritingRule, locale: Locale }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0"><CheckIcon /></div>
                <div>
                    <p className="font-bold text-slate-800 text-lg mb-1">{item.content.nl}</p>
                    <p className="text-slate-600">{getTriText(item.content, locale)}</p>
                    {item.example && (
                        <div className="mt-3 bg-slate-50 p-3 rounded-lg text-sm border-l-4 border-[var(--primary)]/30">
                            <p className="font-medium text-slate-700">{item.example.nl}</p>
                            <p className="text-slate-500 mt-1">{getTriText(item.example, locale)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function GrammarCard({ item, locale }: { item: GrammarRule, locale: Locale }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-[var(--primary)] mb-2">{item.topic}</h3>
            <div className="mb-4">
                <p className="font-mono bg-slate-50 p-2 rounded text-slate-700 font-medium text-center border border-slate-100">
                    {item.explanation.nl}
                </p>
                <p className="text-center text-xs text-slate-400 mt-1">{getTriText(item.explanation, locale)}</p>
            </div>
            <div className="space-y-2">
                {item.examples.map((ex, idx) => (
                    <div key={idx} className="flex flex-col text-sm">
                        <span className="font-medium text-slate-800">{ex.nl}</span>
                        <span className="text-slate-500 text-xs">{getTriText(ex, locale)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ConnectorCard({ item, locale }: { item: Connector, locale: Locale }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-[var(--primary)]/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-slate-900">{item.word}</span>
                <span className="text-sm font-medium px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-md">
                    {getTriText(item.meaning, locale)}
                </span>
            </div>
            {item.note && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mb-3">
                    💡 {locale === 'zh' ? item.note.zh : item.note.en}
                </p>
            )}
            {item.example && (
                <div className="text-sm">
                    <p className="text-slate-800 font-medium">{item.example.nl}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{getTriText(item.example, locale)}</p>
                </div>
            )}
        </div>
    );
}

function EmailTemplateSection({ items, locale }: { items: EmailTemplatePart[], locale: Locale }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    {locale === 'zh' ? "正式邮件 (Formal)" : "Formal Email"}
                </h3>
                <div className="space-y-6">
                    {items.map((part, idx) => (
                        <div key={idx}>
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                {part.part}
                             </span>
                             <p className="font-medium text-slate-800 text-lg">{part.formal.nl}</p>
                             <p className="text-sm text-slate-500">{getTriText(part.formal, locale)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--primary)]/10 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-[var(--primary)] rounded-full"></span>
                    {locale === 'zh' ? "非正式邮件 (Informal)" : "Informal Email"}
                </h3>
                <div className="space-y-6">
                    {items.map((part, idx) => (
                        <div key={idx}>
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                {part.part}
                             </span>
                             <p className="font-medium text-slate-800 text-lg">{part.informal.nl}</p>
                             <p className="text-sm text-slate-500">{getTriText(part.informal, locale)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ScenarioCard({ item, locale }: { item: Scenario, locale: Locale }) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:border-[var(--primary)]/20 transition-all">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">{getTriText(item.title, locale)}</h3>
                <span className="text-xs font-medium text-slate-500">{item.title.nl}</span>
            </div>
            <div className="p-5 space-y-4">
                {item.phrases.map((phrase, idx) => (
                    <div key={idx} className="group">
                        <p className="font-medium text-slate-800 group-hover:text-[var(--primary)] transition-colors">
                            {phrase.nl}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {getTriText(phrase, locale)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PracticeExerciseCard({ exercise, locale }: { exercise: PracticeExercise, locale: Locale }) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {locale === 'zh' ? "任务" : "Task"}
                 </h4>
                 <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-line leading-relaxed border border-slate-100">
                    <p className="font-medium text-indigo-900 mb-2">{exercise.task.nl}</p>
                    <p className="text-sm text-slate-500">{getTriText(exercise.task, locale)}</p>
                 </div>
            </div>

            <div className="flex justify-center mb-6">
                <button 
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold hover:border-[var(--primary)]/30 hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all shadow-sm"
                >
                    {showAnswer ? (
                        <>
                           <span className="text-lg">🙈</span> 
                           {locale === 'zh' ? "隐藏参考答案" : "Hide Answer"}
                        </>
                    ) : (
                        <>
                           <span className="text-lg">👀</span> 
                           {locale === 'zh' ? "查看参考答案" : "Show Answer"}
                        </>
                    )}
                </button>
            </div>

            {showAnswer && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 mb-4">
                        <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                            {locale === 'zh' ? "参考范文 (Dutch Only)" : "Model Answer (Dutch Only)"}
                        </h4>
                        <p className="font-handwriting text-xl text-slate-800 whitespace-pre-line font-medium">
                            {exercise.answer.nl}
                        </p>
                    </div>
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                         <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                            {locale === 'zh' ? "解析" : "Explanation"}
                        </h4>
                        <p className="text-sm text-slate-600">
                            {getTriText(exercise.answer.explanation, locale)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function PracticeSection({ categories, locale }: { categories: PracticeCategory[], locale: Locale }) {
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
                                : "bg-white text-slate-600 border-slate-200 hover:border-[var(--primary)]/30 hover:text-[var(--primary)]"
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
export function WritingContent({ locale }: { locale: Locale }) {
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
                        A2 Writing
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 leading-[1.1]">
                        {getTriText(meta.title, locale)}
                    </h1>
                    <p className="text-lg text-slate-300 max-w-xl leading-relaxed mb-8">
                        {getTriText(meta.description, locale)}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#golden_rules" className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] text-white px-6 py-3 text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-900/20">
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
                    // Render logic based on section ID
                    if (section.id === "golden_rules") {
                        return (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <SectionHeader title={section.title} icon={<BookOpenIcon />} locale={locale} />
                                <div className="grid gap-4 md:grid-cols-3">
                                    {section.items?.map((item, idx) => (
                                        <RuleCard key={idx} item={item as WritingRule} locale={locale} />
                                    ))}
                                </div>
                            </section>
                        );
                    }
                    if (section.id === "sentence_structure") {
                        return (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <SectionHeader title={section.title} description={section.description} icon={<PencilIcon />} locale={locale} />
                                <div className="grid gap-4 md:grid-cols-2">
                                     {section.items?.map((item, idx) => (
                                        <GrammarCard key={idx} item={item as GrammarRule} locale={locale} />
                                    ))}
                                </div>
                            </section>
                        );
                    }
                    if (section.id === "connectors") {
                        return (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <SectionHeader title={section.title} description={section.description} icon={<CheckIcon />} locale={locale} />
                                <div className="grid gap-4 sm:grid-cols-3">
                                     {section.items?.map((item, idx) => (
                                        <ConnectorCard key={idx} item={item as Connector} locale={locale} />
                                    ))}
                                </div>
                            </section>
                        );
                    }
                    if (section.id === "email_templates") {
                         return (
                            <section key={section.id} id={section.id} className="scroll-mt-24">
                                <SectionHeader title={section.title} icon={<MailIcon />} locale={locale} />
                                <EmailTemplateSection items={section.items as EmailTemplatePart[]} locale={locale} />
                            </section>
                        );
                    }
                    if (section.id === "useful_scenarios") {
                        return (
                           <section key={section.id} id={section.id} className="scroll-mt-24">
                               <SectionHeader title={section.title} icon={<ChatIcon />} locale={locale} />
                               <div className="grid gap-6 md:grid-cols-3">
                                   {section.items?.map((item, idx) => (
                                       <ScenarioCard key={idx} item={item as Scenario} locale={locale} />
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
                                    <p className="text-slate-500">{section.title.nl}</p>
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
