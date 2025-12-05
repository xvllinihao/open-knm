"use client";

import Link from "next/link";
import { useState } from "react";
import { Locale, getLocalizedPath } from "@/lib/uiTexts";
import {
  examFlowSteps,
  examOverviewCards,
  expressionToolbox,
  heroStats,
  rescuePhrases,
  speakingCopy,
  speakingQuestions,
  speakingTemplates,
  speakingThemes,
  speakingWarnings,
  TriText,
} from "@/data/speaking";

type Props = {
  locale: Locale;
};

type TriLangProps = {
  text: TriText;
  containerClass?: string;
  nlClass?: string;
  zhClass?: string;
  enClass?: string;
};

function TriLangStack({
  text,
  containerClass,
  nlClass,
  zhClass,
  enClass,
}: TriLangProps) {
  return (
    <div className={containerClass}>
      <p className={nlClass ?? "text-sm font-semibold text-slate-900"}>{text.nl}</p>
      <p className={zhClass ?? "text-sm text-slate-500"}>{text.zh}</p>
      <p className={enClass ?? "text-sm text-slate-400"}>{text.en}</p>
    </div>
  );
}

export function SpeakingContent({ locale }: Props) {
  const [activeTopic, setActiveTopic] = useState(speakingThemes[0].id);
  const filteredQuestions = speakingQuestions.filter(
    (item) => item.topic === activeTopic,
  );
  const activeTheme =
    speakingThemes.find((theme) => theme.id === activeTopic) ?? speakingThemes[0];

  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="space-y-3 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">
            {speakingCopy.heroBadge.nl}
          </p>
          <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            <span className="block">{speakingCopy.heroTitle.nl}</span>
            <span className="text-2xl text-slate-600">{speakingCopy.heroTitle.zh}</span>
            <span className="text-lg text-slate-400">{speakingCopy.heroTitle.en}</span>
          </h1>
          <TriLangStack
            text={speakingCopy.heroSubtitle}
            containerClass="space-y-1"
            nlClass="text-lg text-slate-600 font-semibold"
            zhClass="text-sm text-slate-500"
            enClass="text-sm text-slate-400"
          />
          <TriLangStack
            text={speakingCopy.heroLead}
            containerClass="space-y-1"
            nlClass="text-sm text-slate-500"
            zhClass="text-xs text-slate-500"
            enClass="text-xs text-slate-400"
          />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {heroStats.map((stat) => (
            <article
              key={stat.id}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label.nl}
              </p>
              <p className="mt-1 text-sm text-slate-600">{stat.label.zh}</p>
              <p className="text-xs text-slate-400">{stat.label.en}</p>
              <p className="mt-3 text-base font-semibold text-slate-900">{stat.value.nl}</p>
              <p className="text-sm text-slate-500">{stat.value.zh}</p>
              <p className="text-xs text-slate-400">{stat.value.en}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#themes"
            className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
          >
            {speakingCopy.heroPrimaryAction.nl}
          </a>
          <a
            href="#templates"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            {speakingCopy.heroSecondaryAction.nl}
          </a>
          <Link
            href={getLocalizedPath(locale, "/resources")}
            className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-300 px-5 py-2 text-sm font-semibold text-[var(--primary)] transition hover:border-[var(--primary)]"
          >
            {locale === "zh" ? "更多资源" : "More resources"}
          </Link>
        </div>
      </section>

      <section className="space-y-4" aria-label="Exam overview">
        <h2 className="text-2xl font-bold text-slate-900">Exam overzicht / 考试速览 / Overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {examOverviewCards.map((card) => (
            <article
              key={card.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <TriLangStack
                text={card.title}
                nlClass="text-lg font-bold text-slate-900"
                zhClass="text-sm text-slate-500"
                enClass="text-xs text-slate-400"
              />
              <TriLangStack
                text={card.detail}
                containerClass="mt-3 space-y-1"
                nlClass="text-sm text-slate-700"
                zhClass="text-xs text-slate-500"
                enClass="text-xs text-slate-400"
              />
              {card.note && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
                  <TriLangStack text={card.note} containerClass="space-y-0" />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="themes" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Thema's / 主题 / Themes</h2>
            <p className="text-sm text-slate-500">
              {locale === "zh"
                ? "选择一个主题后查看设计好的问答。"
                : "Pick a theme to see tailored question-answer sets."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {speakingThemes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setActiveTopic(theme.id)}
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                activeTopic === theme.id
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="block">{theme.title.nl}</span>
              <span className="text-[10px] uppercase tracking-widest">
                {theme.title.en}
              </span>
            </button>
          ))}
        </div>
        <TriLangStack
          text={activeTheme.description}
          containerClass="space-y-0 text-sm text-slate-500"
          nlClass="text-sm font-medium text-slate-600"
          zhClass="text-xs text-slate-500"
          enClass="text-xs text-slate-400"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {filteredQuestions.map((question) => (
            <article
              key={question.id}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>{question.topic.toUpperCase()}</span>
                <span>{locale === "zh" ? "提示" : "Tip"}</span>
              </div>
              <TriLangStack
                text={question.question}
                containerClass="space-y-1"
                nlClass="text-lg font-bold text-slate-900"
                zhClass="text-sm text-slate-600"
                enClass="text-xs text-slate-400"
              />
              <div className="mt-3 space-y-1 rounded-2xl border border-slate-200 bg-white p-3">
                <TriLangStack
                  text={question.answer}
                  containerClass="space-y-0"
                  nlClass="text-sm font-semibold text-slate-900"
                  zhClass="text-xs text-slate-600"
                  enClass="text-xs text-slate-400"
                />
              </div>
              {question.variations && (
                <div className="mt-3 space-y-2 rounded-2xl border border-slate-100 bg-white p-3 text-xs text-slate-500">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Variaties / 替代表达 / Variations
                  </p>
                  {question.variations.map((variation, index) => (
                    <TriLangStack
                      key={`${question.id}-variation-${index}`}
                      text={variation}
                      containerClass="space-y-0"
                      nlClass="text-sm text-slate-700"
                      zhClass="text-xs text-slate-500"
                      enClass="text-xs text-slate-400"
                    />
                  ))}
                </div>
              )}
              <div className="mt-3 rounded-2xl border border-dashed border-[var(--primary)] bg-white/80 p-3 text-xs text-slate-500">
                <TriLangStack
                  text={question.tip}
                  containerClass="space-y-0"
                  nlClass="text-sm font-semibold text-[var(--primary)]"
                  zhClass="text-xs text-slate-600"
                  enClass="text-xs text-slate-400"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="templates" className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Templates / 模板 / Templates</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {speakingTemplates.map((template) => (
            <article
              key={template.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <TriLangStack
                text={template.label}
                nlClass="text-lg font-semibold text-slate-900"
                zhClass="text-sm text-slate-500"
                enClass="text-xs text-slate-400"
              />
              <TriLangStack
                text={template.sentence}
                containerClass="mt-3 space-y-1"
                nlClass="text-sm text-slate-700"
                zhClass="text-xs text-slate-600"
                enClass="text-xs text-slate-400"
              />
              {template.note && (
                <TriLangStack
                  text={template.note}
                  containerClass="mt-2 space-y-0"
                  nlClass="text-xs text-slate-500"
                  zhClass="text-[11px] text-slate-500"
                  enClass="text-[11px] text-slate-400"
                />
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Expressie toolbox / 表达工具箱 / Toolbox</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {expressionToolbox.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 shadow-sm"
              >
                <TriLangStack
                  text={item.label}
                  nlClass="text-base font-semibold text-slate-900"
                  zhClass="text-xs text-slate-500"
                  enClass="text-xs text-slate-400"
                />
                <TriLangStack
                  text={item.usage}
                  containerClass="mt-2 space-y-0"
                  nlClass="text-xs text-slate-600"
                  zhClass="text-[11px] text-slate-500"
                  enClass="text-[11px] text-slate-400"
                />
                <TriLangStack
                  text={item.example}
                  containerClass="mt-3 space-y-0 rounded-2xl border border-slate-100 bg-white p-3"
                  nlClass="text-sm font-semibold text-slate-900"
                  zhClass="text-xs text-slate-500"
                  enClass="text-xs text-slate-400"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Exam flow / 流程演练 / Flow
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {examFlowSteps.map((step) => (
            <article
              key={step.id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <TriLangStack
                text={step.title}
                nlClass="text-sm font-semibold text-slate-900"
                zhClass="text-[11px] text-slate-500"
                enClass="text-[11px] text-slate-400"
              />
              <TriLangStack
                text={step.detail}
                containerClass="mt-2 space-y-0"
                nlClass="text-xs text-slate-600"
                zhClass="text-[11px] text-slate-500"
                enClass="text-[11px] text-slate-400"
              />
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Rescue & tips / 救场 & 提示 / Rescue</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Rescue phrases</p>
            <div className="mt-3 space-y-3">
              {rescuePhrases.map((phrase) => (
                <TriLangStack
                  key={phrase.nl}
                  text={phrase}
                  containerClass="space-y-0"
                  nlClass="text-sm font-semibold text-[var(--primary)]"
                  zhClass="text-xs text-slate-600"
                  enClass="text-xs text-slate-400"
                />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Warnings</p>
            <div className="mt-3 space-y-3">
              {speakingWarnings.map((warning) => (
                <TriLangStack
                  key={warning.nl}
                  text={warning}
                  containerClass="space-y-0"
                  nlClass="text-sm text-slate-700"
                  zhClass="text-xs text-slate-500"
                  enClass="text-xs text-slate-400"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--primary)] bg-[var(--primary)]/95 p-8 text-white shadow-lg">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">
            {locale === "zh" ? "想要更多练习？" : "Need more practice?"}
          </h2>
          <p className="text-sm text-white/90">
            {locale === "zh"
              ? "查看资源页或 AI 助教来听发音、获得更多题目。"
              : "Visit the resources page or the AI Assistant for pronunciations and extra prompts."}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={getLocalizedPath(locale, "/resources")}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[var(--primary)] shadow hover:bg-slate-100"
          >
            {locale === "zh" ? "去资源页" : "Go to resources"}
          </Link>
          <Link
            href={getLocalizedPath(locale, "/ai-assistant")}
            className="rounded-full border border-white/70 px-5 py-2 text-sm font-semibold text-white hover:border-white"
          >
            {locale === "zh" ? "试试 AI 助教" : "Try AI Assistant"}
          </Link>
        </div>
      </section>
    </div>
  );
}

