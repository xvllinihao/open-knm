import type { Metadata } from "next";
import { Locale } from "@/lib/uiTexts";
import { changelogData } from "@/data/changelog";
import { absoluteUrl } from "@/lib/siteConfig";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === "zh";

  return {
    title: isZh ? "更新日志 | Open KNM" : "Changelog | Open KNM",
    description: isZh
      ? "Open KNM 的更新历史与版本说明。"
      : "Update history and release notes for Open KNM.",
    alternates: {
      canonical: absoluteUrl(`/${locale}/changelog`),
    },
  };
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {isZh ? "更新日志" : "Changelog"}
        </h1>
        <p className="text-lg text-slate-600">
          {isZh
            ? "我们会持续优化内容与体验，这里记录了每一次重要的更新。"
            : "We continuously improve content and experience. Here are the major updates."}
        </p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {changelogData.map((item, index) => (
          <div
            key={item.version}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-hover:bg-[var(--primary)] group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-slate-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {index === 0 ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
            </div>

            {/* Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-[var(--primary)]">
                  v{item.version}
                </span>
                <time className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {item.date}
                </time>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {item.title[isZh ? "zh" : "en"] || item.title["zh"]}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description[isZh ? "zh" : "en"] ||
                  item.description["zh"]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


