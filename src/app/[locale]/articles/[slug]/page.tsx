import type { Metadata } from "next";
import { Locale, isLocale } from "@/lib/uiTexts";
import { getArticleBySlug, getAdjacentArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/siteConfig";
import { ArticleNavigation } from "@/components/ArticleNavigation";
import { LegalDisclaimer } from "@/components/content/ArticleComponents";

import KnmHistoryZh from "@/data/articles/knm-history-william-of-orange.zh.mdx";
import KnmHistoryEn from "@/data/articles/knm-history-william-of-orange.en.mdx";
import KnmHistoryWw2Zh from "@/data/articles/knm-history-ww2.zh.mdx";
import KnmHistoryWw2En from "@/data/articles/knm-history-ww2.en.mdx";
import KnmGeoZh from "@/data/articles/knm-geography-water-management.zh.mdx";
import KnmGeoEn from "@/data/articles/knm-geography-water-management.en.mdx";
import KnmPoliticsZh from "@/data/articles/knm-politics-democracy.zh.mdx";
import KnmPoliticsEn from "@/data/articles/knm-politics-democracy.en.mdx";
import KnmLawZh from "@/data/articles/knm-law-constitution.zh.mdx";
import KnmLawEn from "@/data/articles/knm-law-constitution.en.mdx";
import KnmEduZh from "@/data/articles/knm-education-system.zh.mdx";
import KnmEduEn from "@/data/articles/knm-education-system.en.mdx";
import KnmHealthZh from "@/data/articles/knm-health-huisarts.zh.mdx";
import KnmHealthEn from "@/data/articles/knm-health-huisarts.en.mdx";
import KnmWorkZh from "@/data/articles/knm-work-contracts.zh.mdx";
import KnmWorkEn from "@/data/articles/knm-work-contracts.en.mdx";
import KnmWelfareZh from "@/data/articles/knm-social-welfare-allowances.zh.mdx";
import KnmWelfareEn from "@/data/articles/knm-social-welfare-allowances.en.mdx";
import KnmHousingZh from "@/data/articles/knm-housing-household.zh.mdx";
import KnmHousingEn from "@/data/articles/knm-housing-household.en.mdx";
import KnmEnvZh from "@/data/articles/knm-environment-waste.zh.mdx";
import KnmEnvEn from "@/data/articles/knm-environment-waste.en.mdx";
import KnmHealthMatZh from "@/data/articles/knm-healthcare-maternity.zh.mdx";
import KnmHealthMatEn from "@/data/articles/knm-healthcare-maternity.en.mdx";
import KnmSocialZh from "@/data/articles/knm-social-etiquette.zh.mdx";
import KnmSocialEn from "@/data/articles/knm-social-etiquette.en.mdx";
import KnmHolidaysZh from "@/data/articles/knm-culture-holidays.zh.mdx";
import KnmHolidaysEn from "@/data/articles/knm-culture-holidays.en.mdx";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

const DEFAULT_PUBLISHED_AT = "2024-11-01T00:00:00.000Z";

const articleBodies: Record<string, Partial<Record<Locale, ComponentType>>> = {
  "knm-history-william-of-orange": {
    zh: KnmHistoryZh,
    en: KnmHistoryEn,
  },
  "knm-history-ww2": {
    zh: KnmHistoryWw2Zh,
    en: KnmHistoryWw2En,
  },
  "knm-geography-water-management": {
    zh: KnmGeoZh,
    en: KnmGeoEn,
  },
  "knm-politics-democracy": {
    zh: KnmPoliticsZh,
    en: KnmPoliticsEn,
  },
  "knm-law-constitution": {
    zh: KnmLawZh,
    en: KnmLawEn,
  },
  "knm-education-system": {
    zh: KnmEduZh,
    en: KnmEduEn,
  },
  "knm-health-huisarts": {
    zh: KnmHealthZh,
    en: KnmHealthEn,
  },
  "knm-work-contracts": {
    zh: KnmWorkZh,
    en: KnmWorkEn,
  },
  "knm-social-welfare-allowances": {
    zh: KnmWelfareZh,
    en: KnmWelfareEn,
  },
  "knm-housing-household": {
    zh: KnmHousingZh,
    en: KnmHousingEn,
  },
  "knm-environment-waste": {
    zh: KnmEnvZh,
    en: KnmEnvEn,
  },
  "knm-healthcare-maternity": {
    zh: KnmHealthMatZh,
    en: KnmHealthMatEn,
  },
  "knm-social-etiquette": {
    zh: KnmSocialZh,
    en: KnmSocialEn,
  },
  "knm-culture-holidays": {
    zh: KnmHolidaysZh,
    en: KnmHolidaysEn,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return { title: 'Not Found' };
  }

  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Not Found",
    };
  }

  const title = article.titles[locale];
  const description = article.descriptions[locale];
  const canonicalUrl = absoluteUrl(`/${locale}/articles/${slug}`);
  const publishedAt = article.publishedAt ?? DEFAULT_PUBLISHED_AT;
  const updatedAt = article.updatedAt ?? publishedAt;
  const localeKeywords =
    locale === "zh"
      ? ["荷兰融入考试", "KNM", "荷兰社会知识"]
      : ["KNM exam", "Dutch society", "Inburgering"];
  const keywords = Array.from(new Set([...(article.tags ?? []), ...localeKeywords]));

  return {
    title: `${title} | Open KNM`,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: SITE_NAME,
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: ["Open KNM Team"],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: absoluteUrl(`/en/articles/${slug}`),
        zh: absoluteUrl(`/zh/articles/${slug}`),
      },
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  
  if (!isLocale(locale)) {
    notFound();
  }

  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const isZh = locale === "zh";
  const BodyComponent = articleBodies[article.slug]?.[locale];
  const canonicalUrl = absoluteUrl(`/${locale}/articles/${slug}`);
  const localeCode = isZh ? "zh-CN" : "en-US";
  const publishedAt = article.publishedAt ?? DEFAULT_PUBLISHED_AT;
  const updatedAt = article.updatedAt ?? publishedAt;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titles[locale],
    description: article.descriptions[locale],
    inLanguage: localeCode,
    keywords: (article.tags ?? []).join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: [
      {
        "@type": "Person",
        name: "Li Xu",
        url: absoluteUrl(`/${locale}/about`),
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-open-knm.svg"),
      },
    },
  };

  const { prev, next } = getAdjacentArticles(slug);

  return (
    <article className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="space-y-4 border-b border-slate-100 pb-8">
        <div className="flex gap-2">
          <Link
            href={`/${locale}/${article.category}`}
            className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest hover:text-orange-700 transition-colors"
          >
            {article.category === "knm"
              ? isZh
                ? "KNM 考试专区"
                : "KNM Exam Zone"
              : isZh
                ? "荷兰社会"
                : "Dutch Society"}
          </Link>
          {article.tags?.map((tag) => (
            <span key={tag} className="text-xs font-semibold text-slate-400">
              / {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
          {article.titles[locale]}
        </h1>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span>📅</span>
          <time dateTime={updatedAt}>
            {isZh ? '最后更新于' : 'Last updated:'} {new Date(updatedAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>

        <p className="text-xl text-slate-600 leading-relaxed font-light">
          {article.descriptions[locale]}
        </p>
      </div>

      <div className="prose prose-slate prose-lg max-w-none">
        {BodyComponent ? (
          <>
            <BodyComponent />
            <LegalDisclaimer locale={locale} />
          </>
        ) : (
          <div className="bg-slate-50 p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
            <div className="inline-block p-3 rounded-full bg-slate-100 mb-2">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isZh ? "内容正在撰写中" : "Content Writing in Progress"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {isZh
                ? "本文的大纲已确认，正文内容正在编写和校对中。我们很快就会上线详细的 KNM 考点解析。"
                : "The outline is confirmed, and the full content is being written and proofread. Detailed KNM explanations will be online soon."}
            </p>
            <div className="pt-4">
              <Link
                href={`/${locale}/knm`}
                className="text-sm font-bold text-[var(--primary)] hover:underline"
              >
                ← {isZh ? "返回列表" : "Back to list"}
              </Link>
            </div>
          </div>
        )}
      </div>

      <ArticleNavigation prev={prev} next={next} locale={locale} />
    </article>
  );
}
