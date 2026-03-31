// src/lib/db/preferences.ts

import { supabase } from "@/lib/db/supabaseClient";
import { UserPreferences } from "@/types/chat";

const DEFAULT_PREFERENCES: UserPreferences = {
  allowVideo: true,
};

export async function getPreferences(
  userId: string | null
): Promise<UserPreferences> {
  if (!userId) return { ...DEFAULT_PREFERENCES };

  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("allow_video")
      .eq("user_id", userId)
      .single();

    if (error || !data) return { ...DEFAULT_PREFERENCES };

    return {
      allowVideo: data.allow_video ?? true,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export async function setPreference(
  userId: string | null,
  updates: Partial<UserPreferences>
): Promise<void> {
  if (!userId) return;

  try {
    const row: Record<string, unknown> = { user_id: userId };
    if (updates.allowVideo !== undefined) row.allow_video = updates.allowVideo;

    await supabase
      .from("user_preferences")
      .upsert(row, { onConflict: "user_id" });
  } catch (err) {
    console.error("[NIRA PREFERENCES] Failed to persist preference:", err);
  }
}
