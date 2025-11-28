import { Locale } from "@/lib/i18n";
import { getArticlesByCategory } from "@/lib/articles";
import { ArticleList } from "@/components/ArticleList";
import Link from "next/link";

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

  const topicKeys = ["history-geography", "law-government", "health-education"] as const;
  type TopicKey = (typeof topicKeys)[number] | "all";

  const isValidTopic = (value: string | undefined): value is TopicKey =>
    !!value && (topicKeys as readonly string[]).includes(value);

  const activeTopic: TopicKey = isValidTopic(topicParam) ? topicParam : "all";

  const topicTagMap: Record<Exclude<TopicKey, "all">, string[]> = {
    "history-geography": ["History", "Geography"],
    "law-government": ["Politics", "Law"],
    "health-education": ["Health", "Education"],
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
            : "The core topics for the Kennis van de Nederlandse Maatschappij (KNM) exam. From history and geography to law and healthcare, we explain every essential topic bilingually."}
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

      <ArticleList articles={filteredArticles} locale={locale} />
    </div>
  );
}
