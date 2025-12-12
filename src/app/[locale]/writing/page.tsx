import type { Metadata } from "next";
import { Locale } from "@/lib/uiTexts";
import { absoluteUrl } from "@/lib/siteConfig";
import { WritingContent } from "@/components/WritingContent";

const writingPageMeta: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "A2 Writing Practice & Crash Course | Open KNM",
    description: "Master the Dutch A2 writing exam with our crash course. Learn golden rules, sentence structure, email templates, and practice with mock exams.",
    keywords: [
      "Dutch writing practice",
      "Inburgering writing exam",
      "A2 writing",
      "Dutch email templates",
      "writing mock exam",
      "learn Dutch writing",
      "Inburgering exam A2",
    ],
  },
  zh: {
    title: "A2 写作速成与模拟练习 | Open KNM",
    description: "荷兰语 A2 写作考试速成指南。掌握三大黄金法则、万能邮件模板和高频场景句式，配合全真模拟题，轻松通过融入考试写作部分。",
    keywords: [
      "荷兰语写作练习",
      "融入考试写作",
      "Inburgering A2 写作",
      "荷兰语邮件模板",
      "荷兰语写作模拟",
      "荷兰语写作速成",
      "荷兰语语法",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fallback: Locale = "zh";
  const resolvedLocale = ["zh", "en"].includes(locale) ? locale : fallback;
  const meta = writingPageMeta[resolvedLocale];
  const canonical = absoluteUrl(`/${resolvedLocale}/writing`);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl("/en/writing"),
        zh: absoluteUrl("/zh/writing"),
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

export default async function WritingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <WritingContent locale={locale} />;
}
