// src/lib/db/conversationState.ts

import { supabase } from "@/lib/db/supabaseClient";
import { ConversationState, Mode } from "@/types/chat";

export async function getConversationState(
  userId: string | null
): Promise<ConversationState> {
  if (!userId) {
    return { lastSubject: null, lastMode: null, lastNextStep: null };
  }

  try {
    const { data, error } = await supabase
      .from("conversation_state")
      .select("last_subject, last_mode, last_next_step")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return { lastSubject: null, lastMode: null, lastNextStep: null };
    }

    return {
      lastSubject: data.last_subject ?? null,
      lastMode: (data.last_mode as Mode) ?? null,
      lastNextStep: data.last_next_step ?? null,
    };
  } catch {
    return { lastSubject: null, lastMode: null, lastNextStep: null };
  }
}

export async function setConversationState(
  userId: string | null,
  state: Partial<ConversationState>
): Promise<void> {
  if (!userId) return;

  try {
    const row: Record<string, unknown> = { user_id: userId };
    if (state.lastSubject !== undefined) row.last_subject = state.lastSubject;
    if (state.lastMode !== undefined) row.last_mode = state.lastMode;
    if (state.lastNextStep !== undefined) row.last_next_step = state.lastNextStep;

    await supabase
      .from("conversation_state")
      .upsert(row, { onConflict: "user_id" });
  } catch (err) {
    console.error("[NIRA STATE] Failed to persist conversation state:", err);
  }
}
