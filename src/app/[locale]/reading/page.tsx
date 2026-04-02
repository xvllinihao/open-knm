import type { Metadata } from "next";
import { Locale } from "@/lib/uiTexts";
import { absoluteUrl } from "@/lib/siteConfig";
import { ReadingContent } from "@/components/ReadingContent";
import { JsonLd } from "@/components/StructuredData";
import { courseSchema, breadcrumbSchema, howToSchema } from "@/lib/structured-data";

const readingPageMeta: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "A2 Reading Practice & Guide | Open KNM",
    description: "Master the Dutch A2 reading exam. Learn reading strategies, practice with mock exams, and find official DUO practice materials.",
    keywords: [
      "Dutch reading practice",
      "Inburgering reading exam",
      "A2 reading",
      "reading mock exam",
      "learn Dutch reading",
      "Inburgering exam A2",
      "Dutch reading exam examples",
      "lezen examen inburgering",
    ],
  },
  zh: {
    title: "A2 阅读指南与模拟练习 | Open KNM",
    description: "荷兰语 A2 阅读考试指南。掌握阅读技巧、寻读方法，配合模拟题与官方题库，轻松通过融入考试阅读部分。",
    keywords: [
      "荷兰语阅读练习",
      "融入考试阅读",
      "Inburgering A2 阅读",
      "荷兰语阅读技巧",
      "荷兰语阅读模拟",
      "荷兰语阅读速成",
      "Inburgering 阅读真题",
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
  const meta = readingPageMeta[resolvedLocale];
  const canonical = absoluteUrl(`/${resolvedLocale}/reading`);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl("/en/reading"),
        zh: absoluteUrl("/zh/reading"),
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

export default async function ReadingPage({
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
      { name: isZh ? '阅读指南' : 'Reading Guide', url: `https://open-knm.com/${locale}/reading` },
    ]),
  ];

  return (
    <>
      <JsonLd schemas={schemas} />
      <ReadingContent locale={locale} />
    </>
  );
}
