"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { AiDisclaimer } from "./AiDisclaimer";
import { AuthButton } from "./AuthButton";
import { LoginBanner } from "./LoginBanner";
import { Locale, getLocalizedPath, uiTexts } from "../lib/uiTexts";
import { useAuth } from "@/contexts/AuthContext";
import { OfficialPracticeBanner } from "./OfficialPracticeBanner";

type SiteLayoutProps = {
  children: React.ReactNode;
  locale: Locale;
};

export function SiteLayout({ children, locale }: SiteLayoutProps) {
  const texts = uiTexts[locale];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [bannerReady, setBannerReady] = useState(false);

  // Delay showing banner to avoid flash
  useEffect(() => {
    if (!authLoading && !user && !bannerDismissed) {
      const timer = setTimeout(() => setBannerReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user, bannerDismissed]);

  // Derived state: show banner only when ready and user not logged in
  const showLoginBanner = bannerReady && !authLoading && !user && !bannerDismissed;

  const navLinks = [
    { 
      href: getLocalizedPath(locale, "/knm"), 
      label: texts.nav.knm,
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/></svg>
    },
    { 
      href: getLocalizedPath(locale, "/vocabulary"), 
      label: texts.nav.vocabulary,
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    },
    { 
      label: locale === 'zh' ? 'A2 备考' : 'A2 Exams',
      highlight: true,
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
      children: [
        { href: getLocalizedPath(locale, "/listening"), label: texts.nav.listening },
        { href: getLocalizedPath(locale, "/reading"), label: texts.nav.reading },
        { href: getLocalizedPath(locale, "/writing"), label: texts.nav.writing },
        { href: getLocalizedPath(locale, "/speaking"), label: texts.nav.speaking },
      ]
    },
    { 
      href: getLocalizedPath(locale, "/ai-assistant"), 
      label: texts.nav.assistant,
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4M3 5h4"/></svg>
    },
    { 
      href: getLocalizedPath(locale, "/resources"), 
      label: texts.nav.resources,
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
    },
    { 
      href: getLocalizedPath(locale, "/about"), 
      label: texts.nav.about,
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    },
  ];

  return (
    <div
      lang={locale}
      className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]"
    >
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-white/90 backdrop-blur-md shadow-sm transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link
            href={getLocalizedPath(locale)}
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Logo locale={locale} />
          </Link>
          <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
            {/* Desktop nav */}
            <nav className="hidden items-center gap-4 lg:gap-6 text-sm font-medium text-slate-700 md:flex">
              {navLinks.map((item, idx) => {
                if (item.children) {
                  const isActive = item.children.some(child => pathname?.startsWith(child.href));
                  return (
                    <div key={idx} className="relative group">
                      <button className={[
                        "flex items-center gap-1.5 transition-colors border-b-2 border-transparent pb-1 hover:text-[var(--primary)]",
                        isActive
                          ? "text-[var(--primary)] border-[var(--primary)] font-semibold"
                          : item.highlight ? "text-orange-600 font-medium" : "text-slate-700",
                      ].join(" ")}>
                        {item.icon && (
                          <span className={isActive ? "text-[var(--primary)]" : item.highlight ? "text-orange-500" : "text-slate-400"}>
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={item.highlight && !isActive ? "text-orange-400" : ""}><path d="m6 9 6 6 6-6"/></svg>
                      </button>
                      <div className="absolute left-0 top-full mt-2 w-40 rounded-xl bg-white shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-50">
                        <div className="py-2">
                          {item.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[var(--primary)]"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                const isActive = pathname?.startsWith(item.href!);
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "group flex items-center gap-1.5 transition-colors border-b-2 border-transparent pb-1 hover:text-[var(--primary)]",
                      isActive
                        ? "text-[var(--primary)] border-[var(--primary)] font-semibold"
                        : "text-slate-700",
                    ].join(" ")}
                  >
                    {item.icon && (
                      <span className={isActive ? "text-[var(--primary)]" : "text-slate-400 group-hover:text-[var(--primary)]"}>
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:block h-6 w-[1px] bg-slate-200"></div>

            <AuthButton locale={locale} />

            {/* Mobile: Compact Language Switcher */}
            <div className="md:hidden">
              <LanguageSwitcher currentLocale={locale} compact />
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span className="sr-only">Toggle navigation</span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Desktop: Full Language Switcher */}
            <div className="hidden md:block pl-2 border-l border-slate-200">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-3 text-sm font-medium text-slate-700">
              {navLinks.map((item, idx) => {
                if (item.children) {
                  return (
                    <div key={idx} className="flex flex-col gap-1 py-1">
                      <div className="px-2 py-1.5 text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        {item.icon && (
                          <span className={item.highlight ? "text-orange-500" : "text-slate-400"}>
                            {item.icon}
                          </span>
                        )}
                        <span className={item.highlight ? "text-orange-600" : ""}>{item.label}</span>
                      </div>
                      {item.children.map(child => {
                        const isActive = pathname?.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={[
                              "flex items-center justify-between rounded-lg px-2 py-1.5 pl-4",
                              isActive
                                ? "bg-slate-100 text-slate-900 font-semibold"
                                : "hover:bg-slate-50 text-slate-700",
                            ].join(" ")}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span>{child.label}</span>
                            <span className="text-slate-300">→</span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                const isActive = pathname?.startsWith(item.href!);
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={[
                      "flex items-center justify-between rounded-lg px-2 py-1.5",
                      isActive
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700",
                    ].join(" ")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <span className="text-slate-400">{item.icon}</span>}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <AiDisclaimer locale={locale} />
      
      {showLoginBanner && (
        <LoginBanner locale={locale} onDismiss={() => setBannerDismissed(true)} />
      )}

      <main className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:py-10">{children}</div>
      </main>

      <OfficialPracticeBanner locale={locale} />

      <footer className="border-t border-[var(--border-subtle)] bg-white text-sm text-slate-600">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
             <span className="font-bold text-slate-700">open-knm</span>
             <span className="h-3 w-[1px] bg-slate-300"></span>
             <span>{texts.footer.tagline}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link
              href={getLocalizedPath(locale, "/faq")}
              className="text-slate-600 hover:text-[var(--primary)] transition-colors"
            >
              {locale === "zh" ? "常见问题" : "FAQ"}
            </Link>
            <Link
              href={getLocalizedPath(locale, "/privacy")}
              className="text-slate-600 hover:text-[var(--primary)] transition-colors"
            >
              {locale === "zh" ? "隐私政策" : "Privacy Policy"}
            </Link>
            <a
              href="/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-[#5865F2] transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
              </svg>
              <span className="font-medium">{texts.footer.discord}</span>
            </a>
            <p className="text-slate-400">{texts.footer.note}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
