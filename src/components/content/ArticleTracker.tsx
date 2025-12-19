"use client";

import { useEffect } from "react";
import { Locale } from "@/lib/uiTexts";
import { syncKnmProgress } from "@/app/actions/progress";

const STORAGE_KEY = "knm-bookmark";
const HISTORY_KEY = "knm-read-history";

type BookmarkPayload = {
  slug: string;
  title: string;
  locale: Locale;
  updatedAt: number;
};

type ArticleTrackerProps = {
  slug: string;
  title: string;
  locale: Locale;
};

export function ArticleTracker({ slug, title, locale }: ArticleTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateAndSync = async () => {
      try {
        const now = Date.now();
        
        // 1. Update Local Storage Bookmark
        const payload: BookmarkPayload = {
          slug,
          title,
          locale,
          updatedAt: now,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

        // 2. Update Local Read History
        const historyRaw = window.localStorage.getItem(HISTORY_KEY);
        const history: string[] = historyRaw ? JSON.parse(historyRaw) : [];
        if (!history.includes(slug)) {
          history.push(slug);
          window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }

        // 3. Sync with Server (optimistic, fire and forget)
        await syncKnmProgress({
           last_read_slug: slug,
           read_history: history,
           updated_at: now
        });
        
      } catch (error) {
        console.error("Failed to track article progress:", error);
      }
    };

    updateAndSync();

    return () => {
      try {
        window.sessionStorage.setItem(
          "knm-last-article-exit",
          Date.now().toString()
        );
      } catch {
        // ignore
      }
    };
  }, [slug, title, locale]);

  return null;
}
