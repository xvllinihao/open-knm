"use client";

import Link from "next/link";
import { Article } from "@/lib/articles";
import { Locale } from "@/lib/uiTexts";
import { useEffect, useState } from "react";

export function ArticleList({ articles, locale }: { articles: Article[]; locale: Locale }) {
  const isZh = locale === "zh";
  const [readHistory, setReadHistory] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("knm-read-history");
      if (raw) {
        setTimeout(() => setReadHistory(JSON.parse(raw)), 0);
      }
    } catch {
      // ignore
    }
  }, []);

  if (articles.length === 0) {
    return (
      <div className="text-center py-10 text-slate-600">
        {isZh ? "暂无内容" : "No content available yet"}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => {
        const isRead = readHistory.includes(article.slug);
        return (
          <Link
            key={article.slug}
            href={`/${locale}/articles/${article.slug}`}
            className={`group block h-full bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden ${
              isRead ? "border-slate-200/60 opacity-80" : "border-slate-100"
            }`}
          >
            {isRead && (
              <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 px-2 py-1 text-[10px] font-bold uppercase rounded-bl-lg z-10">
                {isZh ? "已读" : "Read"}
              </div>
            )}
            <div className="flex flex-col h-full">
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h3
                className={`text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2 ${
                  isRead ? "text-slate-700 font-medium" : "text-slate-900"
                }`}
              >
                {article.titles[locale]}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-1">
                {article.descriptions[locale]}
              </p>

              <div className="flex items-center text-xs font-semibold text-[var(--primary)] mt-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                {isZh ? "阅读更多" : "Read More"} <span className="ml-1">→</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

