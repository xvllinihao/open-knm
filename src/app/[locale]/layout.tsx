import type { Metadata } from "next";
import "../globals.css";
import { locales, Locale } from "@/lib/i18n";
import { SiteLayout } from "@/components/SiteLayout";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL, GA_ID } from "@/lib/siteConfig";
import { PostHogProvider } from "@/components/PostHogProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
    title: "Open KNM - Dutch Society & Life Guide",
    description:
      "Bilingual guide for living in the Netherlands and passing the KNM exam. Free, open-source, and community-driven.",
    keywords: [
      "KNM exam",
      "Inburgering",
      "Dutch civic integration",
      "KNM study guide",
      "Dutch society",
      "Open Source KNM",
      "KNM notes",
      "living in Netherlands",
      "荷兰生活指南",
    ],
    openGraphLocale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  zh: {
    title: "Open KNM - 荷兰融入考试与生活指南",
    description:
      "中英双语的荷兰融入考试（KNM）学习资料，帮助你理解荷兰社会、医疗、法律与生活。免费开源，社区维护。",
    keywords: [
      "荷兰融入考试",
      "KNM",
      "Inburgering",
      "荷兰社会指南",
      "荷兰生活",
      "KNM 复习资料",
      "荷兰社会知识",
      "Open Source KNM",
      "Dutch society",
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
        <PostHogProvider>
          <SiteLayout locale={validLocale}>
            {children}
          </SiteLayout>
          <Analytics />
          <GoogleAnalytics gaId={GA_ID} />
        </PostHogProvider>
      </body>
    </html>
  );
}
