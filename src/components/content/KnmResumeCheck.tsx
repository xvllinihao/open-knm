"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Locale, uiTexts } from "@/lib/uiTexts";
import { ResumePrompt } from "@/components/ResumePrompt";
import { getArticleBySlug } from "@/lib/articles";
import { useAuth } from "@/contexts/AuthContext";
import { syncKnmProgress } from "@/app/actions/progress";

const STORAGE_KEY = "knm-bookmark";
const HISTORY_KEY = "knm-read-history";

type BookmarkData = {
  slug: string;
  title: string;
  locale: Locale;
  updatedAt: number;
};

export function KnmResumeCheck({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);

  const checkBookmark = useCallback(() => {
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
        
        // Ensure title is up to date if missing (from sync)
        if (!parsed.title) {
           const art = getArticleBySlug(parsed.slug);
           if (art) parsed.title = art.titles[locale];
        }

        setTimeout(() => setBookmark(parsed), 0);
      }
    } catch (error) {
      console.error("Failed to read KNM bookmark:", error);
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const init = async () => {
      // 1. Initial local check
      checkBookmark();
      
      // 2. Sync if user logged in
      if (!authLoading && user) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const localData = raw ? JSON.parse(raw) : null;
          const historyRaw = localStorage.getItem(HISTORY_KEY);
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          
          const result = await syncKnmProgress({
             last_read_slug: localData?.slug || null,
             read_history: history,
             updated_at: localData?.updatedAt || 0
          });
          
          if (result.success && result.data && result.data.last_read_slug) {
             const serverTime = result.data.updated_at;
             const localTime = localData?.updatedAt || 0;
             
             if (serverTime > localTime) {
                // Server is newer, update local
                const slug = result.data.last_read_slug;
                const article = getArticleBySlug(slug);
                const title = article ? article.titles[locale] : "Unknown";
                
                const newPayload: BookmarkData = {
                  slug,
                  title,
                  locale, // Default to current locale if syncing from another device
                  updatedAt: serverTime
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newPayload));
                
                // Also update history
                if (result.data.read_history && Array.isArray(result.data.read_history)) {
                   localStorage.setItem(HISTORY_KEY, JSON.stringify(result.data.read_history));
                }
                
                // Refresh prompt
                checkBookmark();
             }
          }
        } catch (e) {
          console.error("Sync failed", e);
        }
      }
    };

    init();

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
  }, [locale, user, authLoading, checkBookmark]);

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
