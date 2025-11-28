"use client";

import { useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { Locale, getLocalizedPath, uiTexts } from "../lib/uiTexts";

type SiteLayoutProps = {
  children: React.ReactNode;
  locale: Locale;
};

export function SiteLayout({ children, locale }: SiteLayoutProps) {
  const texts = uiTexts[locale];
  const year = new Date().getFullYear();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: getLocalizedPath(locale, "/knm"), label: texts.nav.knm },
    { href: getLocalizedPath(locale, "/society"), label: texts.nav.society },
    { href: getLocalizedPath(locale, "/life"), label: texts.nav.life },
    { href: getLocalizedPath(locale, "/resources"), label: texts.nav.resources },
    { href: getLocalizedPath(locale, "/about"), label: texts.nav.about, isAccent: true },
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
          <div className="flex items-center gap-3 md:gap-6">
            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex md:text-base">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "transition-colors",
                    item.isAccent
                      ? "font-semibold text-[var(--primary)] hover:text-[var(--primary)]"
                      : "hover:text-[var(--primary)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

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
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50"
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
              ))}
            </nav>
          </div>
        )}
      </header>

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
          <p className="text-slate-400">{texts.footer.note}</p>
        </div>
      </footer>
    </div>
  );
}
