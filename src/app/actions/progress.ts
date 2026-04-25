"use server";

import { createClient } from "@/utils/supabase/server";

export async function syncKnmProgress(localData: {
  last_read_slug: string | null;
  read_history: string[];
  updated_at: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, data: localData };

  const { data: remoteData } = await supabase
    .from("knm_progress")
    .select("last_read_slug, read_history, updated_at")
    .eq("user_id", user.id)
    .single();

  if (!remoteData) {
    // No remote data, insert local
    await supabase.from("knm_progress").insert({
      user_id: user.id,
      last_read_slug: localData.last_read_slug,
      read_history: localData.read_history,
      updated_at: new Date(localData.updated_at).toISOString(),
    });
    return { success: true, data: localData };
  }

  const remoteTime = new Date(remoteData.updated_at).getTime();

  if (localData.updated_at > remoteTime) {
    // Local is newer, update remote
    await supabase.from("knm_progress").upsert({
      user_id: user.id,
      last_read_slug: localData.last_read_slug,
      read_history: localData.read_history,
      updated_at: new Date(localData.updated_at).toISOString(),
    });
    return { success: true, data: localData };
  } else {
    // Remote is newer (or equal), return remote
    return {
      success: true,
      data: {
        last_read_slug: remoteData.last_read_slug,
        read_history: remoteData.read_history as string[],
        updated_at: remoteTime,
      },
    };
  }
}

export async function syncVocabProgress(localData: {
  category: string;
  page: number;
  view_mode: string;
  updated_at: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, data: localData };

  const { data: remoteData } = await supabase
    .from("vocab_progress")
    .select("category, page, view_mode, updated_at")
    .eq("user_id", user.id)
    .single();

  if (!remoteData) {
    await supabase.from("vocab_progress").insert({
      user_id: user.id,
      category: localData.category,
      page: localData.page,
      view_mode: localData.view_mode,
      updated_at: new Date(localData.updated_at).toISOString(),
    });
    return { success: true, data: localData };
  }

  const remoteTime = new Date(remoteData.updated_at).getTime();

  if (localData.updated_at > remoteTime) {
    await supabase.from("vocab_progress").upsert({
      user_id: user.id,
      category: localData.category,
      page: localData.page,
      view_mode: localData.view_mode,
      updated_at: new Date(localData.updated_at).toISOString(),
    });
    return { success: true, data: localData };
  } else {
    return {
      success: true,
      data: {
        category: remoteData.category,
        page: remoteData.page,
        view_mode: remoteData.view_mode,
        updated_at: remoteTime,
      },
    };
  }
}

export async function incrementFlashcardUsage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { allowed: true, count: 0, limit: 3 }; // Unregistered limit handled in UI, but safe default

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  if (profile?.tier === "pro") return { allowed: true, count: 0, limit: Infinity };

  const today = new Date().toISOString().split("T")[0];
  const { data: usage, error } = await supabase
    .from("daily_usage")
    .select("count")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  let count = usage?.count || 0;
  
  if (count >= 20) return { allowed: false, count, limit: 20 };

  // Increment
  if (!usage && !error) {
     // Row might not exist
     await supabase.from("daily_usage").insert({ user_id: user.id, date: today, count: 1 });
     count = 1;
  } else {
     await supabase.from("daily_usage").upsert({
         user_id: user.id,
         date: today,
         count: count + 1
     });
     count += 1;
  }

  return { allowed: true, count, limit: 20 };
}

export async function getFlashcardUsage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { count: 0, allowed: true, limit: 3 };

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  if (profile?.tier === "pro") return { count: 0, allowed: true, limit: Infinity };

  const today = new Date().toISOString().split("T")[0];
  const { data: usage } = await supabase
    .from("daily_usage")
    .select("count")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  return { 
    count: usage?.count || 0, 
    allowed: (usage?.count || 0) < 20, 
    limit: 20 
  };
}

export async function syncFlashcardWords(unknownWords: string[], knownWords: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const { error } = await supabase.from("profiles").update({
    unknown_words: unknownWords,
    known_words: knownWords,
  }).eq("id", user.id);

  if (error) {
    console.error("syncFlashcardWords failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function syncFlashcardProgress(localData: {
  level: "A2" | "B1" | "Mix";
  current_index: number;
  deck_ids: string[];
  is_reverse: boolean;
  is_review_mode?: boolean;
  is_review_known_mode?: boolean;
  updated_at: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, data: localData };

  const { data: remoteData } = await supabase
    .from("flashcard_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("level", localData.level)
    .single();

if (!remoteData || localData.updated_at > new Date(remoteData.updated_at).getTime()) {
    await supabase.from("flashcard_progress").upsert({
      user_id: user.id,
      level: localData.level,
      current_index: localData.current_index,
      deck_ids: localData.deck_ids,
      is_reverse: localData.is_reverse,
      is_review_mode: localData.is_review_mode ?? false,
      is_review_known_mode: localData.is_review_known_mode ?? false,
      updated_at: new Date(localData.updated_at).toISOString(),
    });
    return { success: true, data: localData };
  }

  return {
    success: true,
    data: {
      level: remoteData.level as "A2" | "B1" | "Mix",
      current_index: remoteData.current_index,
      deck_ids: remoteData.deck_ids as string[],
      is_reverse: remoteData.is_reverse as boolean,
      is_review_mode: remoteData.is_review_mode as boolean,
      is_review_known_mode: remoteData.is_review_known_mode as boolean,
      updated_at: new Date(remoteData.updated_at).getTime(),
    },
  };
}

