import type { Metadata } from "next";
import "../globals.css";
import { locales, Locale } from "@/lib/i18n";
import { SiteLayout } from "@/components/SiteLayout";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL, GA_ID } from "@/lib/siteConfig";
import { PostHogProvider } from "@/components/PostHogProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AuthProvider } from "@/contexts/AuthContext";

const metadataPerLocale: Record<
  Locale,
  {
    title: string;
    description: string;
    keywords: string[];
    openGraphLocale: "en_US" | "zh_CN";
    alternateLocale: string[];
  }
> = {
  en: {
    title: "Open KNM - Fast Track to Dutch Integration Exam",
    description:
      "The fast-track guide to passing the Dutch Civic Integration (KNM) exam. Free summaries, A2 vocabulary, and practice questions for speaking and writing. Open-source and community-driven.",
    keywords: [
      "KNM exam",
      "Inburgering exam",
      "Dutch civic integration exam",
      "Inburgeringsexamen",
      "KNM practice",
      "KNM summary",
      "Dutch A2 level",
      "Dutch speaking practice",
      "Dutch writing exam",
      "free KNM guide",
      "Dutch society",
      "Open Source KNM",
      "KNM notes",
      "living in Netherlands",
      "Dutch citizenship exam",
      "mvv exam preparation",
      "basisexamen inburgering",
    ],
    openGraphLocale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  zh: {
    title: "Open KNM - 荷兰融入考试 (Inburgering) 极速通关指南",
    description:
      "免费高效的荷兰融入考试（KNM）备考指南。提供核心考点总结、A2 高频词汇表、口语写作模拟题。开源社区维护，助你极速通关 Inburgering。",
    keywords: [
      "荷兰融入考试",
      "KNM 考试",
      "Inburgering",
      "Inburgeringsexamen",
      "KNM 试题",
      "荷兰语 A2",
      "荷兰语口语",
      "荷兰语写作",
      "KNM 总结",
      "KNM 笔记",
      "荷兰社会指南",
      "荷兰生活",
      "Open Source KNM",
      "荷兰语考试",
      "MVV 考试",
      "荷兰永居考试",
      "荷兰入籍考试",
    ],
    openGraphLocale: "zh_CN",
    alternateLocale: ["en_US"],
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale: requestedLocale } = await params;
  const locale =
    locales.includes(requestedLocale as Locale) && requestedLocale
      ? (requestedLocale as Locale)
      : ("zh" as Locale);
  const localeMeta = metadataPerLocale[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: localeMeta.title,
      template: "%s | Open KNM",
    },
    description: localeMeta.description,
    keywords: localeMeta.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        zh: "/zh",
      },
    },
    openGraph: {
      type: "website",
      locale: localeMeta.openGraphLocale,
      alternateLocale: localeMeta.alternateLocale,
      siteName: "Open KNM",
      title: localeMeta.title,
      description: localeMeta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: localeMeta.title,
      description: localeMeta.description,
    },
    icons: {
      icon: "/logo-open-knm.svg",
      shortcut: "/logo-open-knm.svg",
      apple: "/logo-open-knm.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Validate locale or default to 'zh' if somehow invalid (though generateStaticParams prevents this for static export)
  const validLocale = (locales.includes(locale as Locale) ? locale : 'zh') as Locale;

  return (
    <html lang={validLocale}>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <PostHogProvider>
            <SiteLayout locale={validLocale}>
              {children}
            </SiteLayout>
            <Analytics />
            <GoogleAnalytics gaId={GA_ID} />
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
