import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { getArticlesByCategory } from "@/lib/articles";
import { ArticleList } from "@/components/ArticleList";
import Link from "next/link";
import { absoluteUrl } from "@/lib/siteConfig";

const knmPageMeta: Record<
  Locale,
  {
    title: string;
    description: string;
    keywords: string[];
  }
> = {
  en: {
    title: "KNM Exam Topics & Study Guide",
    description:
      "Curated KNM exam notes covering Dutch history, government, work, healthcare, education, and daily life. Bilingual explanations with topic filters.",
    keywords: [
      "KNM exam topics",
      "Dutch civic integration",
      "KNM study guide",
      "Inburgering resources",
      "Dutch society",
    ],
  },
  zh: {
    title: "KNM 考试重点与学习资料",
    description:
      "系统梳理 KNM 荷兰融入考试考点，涵盖历史地理、政府法律、医疗教育与工作生活，中英双语讲解可按主题筛选。",
    keywords: [
      "KNM 考点",
      "荷兰融入考试资料",
      "荷兰社会知识",
      "Inburgering 复习",
      "荷兰 KNM 学习",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fallbackLocale: Locale = "zh";
  const meta = knmPageMeta[locale] ?? knmPageMeta[fallbackLocale];
  const canonical = absoluteUrl(`/${locale}/knm`);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl("/en/knm"),
        zh: absoluteUrl("/zh/knm"),
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

type SearchParams = {
  topic?: string | string[];
};

export default async function KnmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ locale }, search] = await Promise.all([params, searchParams]);
  const isZh = locale === "zh";
  const allArticles = getArticlesByCategory("knm");

  const rawTopic = search?.topic;
  const topicParam =
    typeof rawTopic === "string" ? rawTopic : Array.isArray(rawTopic) ? rawTopic[0] : undefined;

  const topicKeys = ["history-geography", "law-government", "health-education", "work-income", "social-culture"] as const;
  type TopicKey = (typeof topicKeys)[number] | "all";

  const isValidTopic = (value: string | undefined): value is TopicKey =>
    !!value && (topicKeys as readonly string[]).includes(value);

  const activeTopic: TopicKey = isValidTopic(topicParam) ? topicParam : "all";

  const topicTagMap: Record<Exclude<TopicKey, "all">, string[]> = {
    "history-geography": ["History", "Geography"],
    "law-government": ["Politics", "Law"],
    "health-education": ["Health", "Education"],
    "work-income": ["Work", "Finance"],
    "social-culture": ["Culture"],
  };

  const filteredArticles =
    activeTopic === "all"
      ? allArticles
      : allArticles.filter((article) =>
          article.tags?.some((tag) => topicTagMap[activeTopic].includes(tag)),
        );

  const filters: { key: TopicKey; zh: string; en: string }[] = [
    { key: "all", zh: "全部", en: "All topics" },
    { key: "history-geography", zh: "历史与地理", en: "History & Geography" },
    { key: "law-government", zh: "法律与政府", en: "Law & Government" },
    { key: "health-education", zh: "医疗与教育", en: "Health & Education" },
    { key: "work-income", zh: "工作与收入", en: "Work & Income" },
    { key: "social-culture", zh: "社交与文化", en: "Social & Culture" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? "KNM 考试专区" : "KNM Exam Zone"}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          {isZh
            ? "这里汇集了 Kennis van de Nederlandse Maatschappij (KNM) 考试的核心考点。从历史、地理到法律与医疗，我们用双语为你拆解每一个必考话题。"
            : "The core topics for the Kennis van de Nederlandse Maatschappij (KNM) exam. From history and geography to law and healthcare, we explain every essential topic bilingually. "}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-slate-50 px-3 py-2 border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {isZh ? "按主题筛选" : "Filter by topic"}
          </span>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = activeTopic === filter.key;
              const href =
                filter.key === "all"
                  ? `/${locale}/knm`
                  : `/${locale}/knm?topic=${encodeURIComponent(filter.key)}`;

              return (
                <Link
                  key={filter.key}
                  href={href}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {isZh ? filter.zh : filter.en}
                </Link>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-slate-500">
          {isZh
            ? `当前共 ${filteredArticles.length} 篇文章。`
            : `Currently showing ${filteredArticles.length} article(s).`}
        </p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 space-y-3 text-sm text-slate-800">
        <p className="font-semibold text-slate-900">
          {isZh ? "什么是 KNM？" : "What is KNM?"}
        </p>
        <p>
          {isZh
            ? "KNM（Kennis van de Nederlandse Maatschappij）是荷兰社会知识考试的一部分，考察工作、健康、法律与政治等方面的常识与制度。"
            : "Kennis van de Nederlandse Maatschappij (KNM) is the civic integration exam’s knowledge component, covering society, work, health, law, and politics."}
        </p>
        <p>
          {isZh
            ? "考试包含选择题和短答题，题干通常以日常生活情境出现，考察你理解荷兰制度与公共服务的能力。"
            : "The exam mixes multiple-choice and short-open questions framed around everyday civic scenarios so you demonstrate understanding of Dutch institutions and services."}
        </p>
        <p>
          {isZh
            ? "常见主题包括就业与劳工、住房与保险、民主制度、历史地理、医疗与教育。"
            : "Topics include employment and labor, housing and insurance, democratic institutions, history and geography, plus healthcare and education."}
        </p>
        <p className="text-xs text-slate-600">
          {isZh
            ? "了解官方大纲可以帮助你更有针对性地准备 KNM 考试。"
            : "Reviewing the official syllabus helps focus your KNM preparation."}
        </p>
        <Link
          href="https://www.inburgeren.nl"
          className="inline-flex items-center gap-1 text-[var(--primary)] font-semibold"
          target="_blank"
          rel="noreferrer"
        >
          {isZh ? "访问官方页面了解更多" : "Visit the official site for details"}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <ArticleList articles={filteredArticles} locale={locale} />
    </div>
  );
}
