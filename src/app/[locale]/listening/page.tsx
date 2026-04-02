import type { Metadata } from "next";
import { Locale } from "@/lib/uiTexts";
import { absoluteUrl } from "@/lib/siteConfig";
import { ListeningContent } from "@/components/ListeningContent";
import { JsonLd } from "@/components/StructuredData";
import { courseSchema, breadcrumbSchema, howToSchema } from "@/lib/structured-data";

const listeningPageMeta: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "A2 Listening Practice & Guide | Open KNM",
    description: "Master the Dutch A2 listening exam. Learn listening strategies, practice with mock exams using TTS, and find official DUO practice materials.",
    keywords: [
      "Dutch listening practice",
      "Inburgering listening exam",
      "A2 listening",
      "listening mock exam",
      "learn Dutch listening",
      "Inburgering exam A2",
      "Dutch listening exam examples",
      "luisteren examen inburgering",
    ],
  },
  zh: {
    title: "A2 听力指南与模拟练习 | Open KNM",
    description: "荷兰语 A2 听力考试指南。掌握听力技巧、抓取关键词，配合 TTS 语音模拟题与官方题库，轻松通过融入考试听力部分。",
    keywords: [
      "荷兰语听力练习",
      "融入考试听力",
      "Inburgering A2 听力",
      "荷兰语听力技巧",
      "荷兰语听力模拟",
      "荷兰语听力速成",
      "Inburgering 听力真题",
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
  const meta = listeningPageMeta[resolvedLocale];
  const canonical = absoluteUrl(`/${resolvedLocale}/listening`);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl("/en/listening"),
        zh: absoluteUrl("/zh/listening"),
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

export default async function ListeningPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isZh = locale === 'zh';
  
  const schemas = [
    courseSchema(locale),
    howToSchema(locale),
    breadcrumbSchema([
      { name: isZh ? '首页' : 'Home', url: `https://open-knm.com/${locale}` },
      { name: isZh ? '听力模拟' : 'Listening Guide', url: `https://open-knm.com/${locale}/listening` },
    ]),
  ];

  return (
    <>
      <JsonLd schemas={schemas} />
      <ListeningContent locale={locale} />
    </>
  );
}
