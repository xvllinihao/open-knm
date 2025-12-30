import type { Metadata } from "next";
import { Locale } from "@/lib/i18n";
import { getArticlesByCategory, KnmTheme } from "@/lib/articles";
import { ArticleList } from "@/components/ArticleList";
import { KnmResumeCheck } from "@/components/content/KnmResumeCheck";
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
      "Dutch history for exam",
      "Dutch politics explained",
      "Dutch health insurance system",
      "Dutch education system",
      "Kennis van de Nederlandse Maatschappij",
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
      "荷兰历史考点",
      "荷兰政治制度",
      "荷兰医疗保险",
      "荷兰教育体系",
      "KNM 考试题目",
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

  const topicKeys = [
    "history-geography",
    "housing",
    "politics-law",
    "work-income",
    "institutions",
    "education",
    "values-norms",
    "healthcare",
  ] as const;
  type TopicKey = (typeof topicKeys)[number] | "all";

  const isValidTopic = (value: string | undefined): value is TopicKey =>
    !!value && (topicKeys as readonly string[]).includes(value);

  const activeTopic: TopicKey = isValidTopic(topicParam) ? topicParam : "all";

  const topicThemeMap: Record<Exclude<TopicKey, "all">, KnmTheme> = {
    "history-geography": "geschiedenis en geografie",
    housing: "wonen",
    "politics-law": "staatsinrichting en rechtsstaat",
    "work-income": "werk en inkomen",
    institutions: "instanties",
    education: "onderwijs en opvoeding",
    "values-norms": "omgangsvormen, waarden en normen",
    healthcare: "gezondheid en gezondheidszorg",
  };

  const filteredArticles =
    activeTopic === "all"
      ? allArticles
      : allArticles.filter((article) => article.theme === topicThemeMap[activeTopic]);

  const filters: { key: TopicKey; zh: string; en: string }[] = [
    { key: "all", zh: "全部", en: "All topics" },
    { key: "history-geography", zh: "历史与地理", en: "History & Geography" },
    { key: "housing", zh: "住房与生活", en: "Housing" },
    { key: "politics-law", zh: "政治与法治", en: "Politics & Law" },
    { key: "work-income", zh: "工作与收入", en: "Work & Income" },
    { key: "institutions", zh: "公共机构", en: "Institutions" },
    { key: "education", zh: "教育与抚育", en: "Education" },
    { key: "values-norms", zh: "价值观与礼仪", en: "Values & Norms" },
    { key: "healthcare", zh: "医疗与健康", en: "Healthcare" },
  ];

  return (
    <div className="space-y-8">
      <KnmResumeCheck locale={locale} />
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
            ? "考试题型为单选题，一共有40道题，题干通常以日常生活情境出现，考察你理解荷兰制度与公共服务的能力。考完一般3天出成绩。"
            : "The exam contains 40 single-choice questions framed around everyday civic scenarios so you demonstrate understanding of Dutch institutions and services. It usually takes 3 days to get the results."}
        </p>
        <p>
          {isZh
            ? "常见主题包括：历史与地理 (geschiedenis en geografie)、住房 (wonen)、政治与法治 (staatsinrichting en rechtsstaat)、工作与收入 (werk en inkomen)、公共机构 (instanties)、教育与抚育 (onderwijs en opvoeding)、价值观与礼仪 (omgangsvormen, waarden en normen) 以及医疗与健康 (gezondheid en gezondheidszorg)。"
            : "Topics include: History & Geography (geschiedenis en geografie), Housing (wonen), Politics & Law (staatsinrichting en rechtsstaat), Work & Income (werk en inkomen), Institutions (instanties), Education (onderwijs en opvoeding), Values & Norms (omgangsvormen, waarden en normen), and Healthcare (gezondheid en gezondheidszorg)."}
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
