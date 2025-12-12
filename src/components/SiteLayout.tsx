"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { AiDisclaimer } from "./AiDisclaimer";
import { Locale, getLocalizedPath, uiTexts } from "../lib/uiTexts";

type SiteLayoutProps = {
  children: React.ReactNode;
  locale: Locale;
};

export function SiteLayout({ children, locale }: SiteLayoutProps) {
  const texts = uiTexts[locale];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: getLocalizedPath(locale, "/knm"), label: texts.nav.knm },
    { href: getLocalizedPath(locale, "/vocabulary"), label: texts.nav.vocabulary },
    { href: getLocalizedPath(locale, "/speaking"), label: texts.nav.speaking },
    { href: getLocalizedPath(locale, "/writing"), label: texts.nav.writing },
    // { href: getLocalizedPath(locale, "/society"), label: texts.nav.society }, // Temporarily removed
    { href: getLocalizedPath(locale, "/life"), label: texts.nav.life },
    // { href: getLocalizedPath(locale, "/resources"), label: texts.nav.resources },
    { href: getLocalizedPath(locale, "/about"), label: texts.nav.about, isAccent: true },
  ];

  const aiAssistantLink = {
    href: getLocalizedPath(locale, "/ai-assistant"),
    label: texts.nav.assistant,
  };

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
          <div className="flex items-center gap-3 md:gap-6">
            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex md:text-base">
              {navLinks.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "transition-colors border-b-2 border-transparent pb-1",
                      item.isAccent
                        ? "font-semibold text-[var(--primary)] hover:text-[var(--primary)]"
                        : "hover:text-[var(--primary)]",
                      isActive
                        ? "text-[var(--primary)] border-[var(--primary)] font-semibold"
                        : "text-slate-600",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:block h-6 w-[1px] bg-slate-200"></div>

            <Link
              href={aiAssistantLink.href}
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-1.5 text-sm font-bold text-white shadow-md shadow-slate-900/20 transition-all hover:scale-105 hover:shadow-lg hover:from-black hover:to-slate-900"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
              </span>
              {aiAssistantLink.label}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] md:hidden"
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

            <div className="pl-2 border-l border-slate-200">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-3 text-sm font-medium text-slate-700">
              <Link
                 href={aiAssistantLink.href}
                 className="flex items-center justify-between rounded-lg px-2 py-2 bg-slate-900 text-white mb-2 shadow-md"
                 onClick={() => setIsMobileMenuOpen(false)}
              >
                 <span className="flex items-center gap-2 font-bold">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
                    </span>
                    {aiAssistantLink.label}
                 </span>
                 <span>→</span>
              </Link>
              
              {navLinks.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center justify-between rounded-lg px-2 py-1.5",
                      isActive
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700",
                    ].join(" ")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span
                      className={
                        item.isAccent
                          ? "font-semibold text-[var(--primary)]"
                          : undefined
                      }
                    >
                      {item.label}
                    </span>
                    <span className="text-slate-300">→</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <AiDisclaimer locale={locale} />

      <main className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:py-10">{children}</div>
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-white text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
             <span className="font-bold text-slate-700">open-knm</span>
             <span className="h-3 w-[1px] bg-slate-300"></span>
             <span>{texts.footer.tagline}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link
              href="https://discord.gg/9SaFjrhN"
              target="_blank"
              className="flex items-center gap-2 text-slate-500 hover:text-[#5865F2] transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
              </svg>
              <span className="font-medium">{texts.footer.discord}</span>
            </Link>
            <p className="text-slate-400">{texts.footer.note}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
