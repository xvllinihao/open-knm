import type { Metadata } from "next";
import { Locale } from "@/lib/uiTexts";
import { absoluteUrl } from "@/lib/siteConfig";
import { SpeakingContent } from "@/components/SpeakingContent";

const speakingPageMeta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "A2 Speaking Practice | Open KNM",
    description:
      "Tri-language guidance for the Dutch A2 speaking exam—mock questions, templates, and exam flow reminders.",
  },
  zh: {
    title: "A2 口语练习 | Open KNM",
    description: "三语示例、模拟问答、流程教具，帮助你自信通过 A2 口语。",
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
  const meta = speakingPageMeta[resolvedLocale];
  const canonical = absoluteUrl(`/${resolvedLocale}/speaking`);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        en: absoluteUrl("/en/speaking"),
        zh: absoluteUrl("/zh/speaking"),
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

export default async function SpeakingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <SpeakingContent locale={locale} />;
}

