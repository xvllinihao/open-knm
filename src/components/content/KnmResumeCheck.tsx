"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { ResumePrompt } from "@/components/ResumePrompt";
import { getArticleBySlug } from "@/lib/articles";

const STORAGE_KEY = "knm-bookmark";

type BookmarkData = {
  slug: string;
  title: string;
  locale: Locale;
  updatedAt: number;
};

export function KnmResumeCheck({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);

  const checkBookmark = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed: BookmarkData = JSON.parse(raw);
      if (parsed?.slug && parsed?.locale) {
        // Check if we just came from an article (within last 1s)
        const lastExit = window.sessionStorage.getItem("knm-last-article-exit");
        const now = Date.now();
        // If we just left an article, don't show the prompt
        if (lastExit && now - Number(lastExit) < 1000) {
          return;
        }
        
        setTimeout(() => setBookmark(parsed), 0);
      }
    } catch (error) {
      console.error("Failed to read KNM bookmark:", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial check
    checkBookmark();

    // Re-check when returning to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkBookmark();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (!bookmark) return null;

  const prompts = uiTexts[locale].vocabulary.bookmarkPrompt;
  const article = getArticleBySlug(bookmark.slug);
  const displayTitle = article ? article.titles[locale] : bookmark.title;

  const handleConfirm = () => {
    router.push(`/${bookmark.locale}/articles/${bookmark.slug}`);
    setBookmark(null); // Hide after action
  };

  const handleDismiss = () => {
    setBookmark(null);
  };

  return (
    <ResumePrompt
      message={`${prompts.resume} “${displayTitle}”`}
      confirmText={prompts.continueReading}
      dismissText={prompts.dismiss}
      onConfirm={handleConfirm}
      onDismiss={handleDismiss}
    />
  );
}
