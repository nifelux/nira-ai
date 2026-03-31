// src/lib/db/usage.ts

import { supabase } from "@/lib/db/supabaseClient";
import { UsageRecord } from "@/types/chat";

export type UsageType = "message" | "free_source" | "paid_api";

const TODAY = () => new Date().toISOString().split("T")[0];

export async function getUsage(
  userId: string | null
): Promise<UsageRecord> {
  if (!userId) {
    return { messageCount: 0, freeSourceCount: 0, paidApiCount: 0 };
  }

  try {
    const { data, error } = await supabase
      .from("usage_limits")
      .select("message_count, free_source_count, paid_api_count")
      .eq("user_id", userId)
      .eq("date", TODAY())
      .single();

    if (error || !data) {
      return { messageCount: 0, freeSourceCount: 0, paidApiCount: 0 };
    }

    return {
      messageCount: data.message_count ?? 0,
      freeSourceCount: data.free_source_count ?? 0,
      paidApiCount: data.paid_api_count ?? 0,
    };
  } catch {
    return { messageCount: 0, freeSourceCount: 0, paidApiCount: 0 };
  }
}

export async function incrementUsage(
  userId: string | null,
  type: UsageType
): Promise<void> {
  if (!userId) return;

  const columnMap: Record<UsageType, string> = {
    message: "message_count",
    free_source: "free_source_count",
    paid_api: "paid_api_count",
  };

  const column = columnMap[type];
  const today = TODAY();

  try {
    const { data: existing } = await supabase
      .from("usage_limits")
      .select("message_count, free_source_count, paid_api_count")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (existing) {
      await supabase
        .from("usage_limits")
        .update({ [column]: (existing[column as keyof typeof existing] as number) + 1 })
        .eq("user_id", userId)
        .eq("date", today);
    } else {
      await supabase
        .from("usage_limits")
        .insert({
          user_id: userId,
          date: today,
          message_count: type === "message" ? 1 : 0,
          free_source_count: type === "free_source" ? 1 : 0,
          paid_api_count: type === "paid_api" ? 1 : 0,
        });
    }
  } catch (err) {
    console.error("[NIRA USAGE] Failed to increment usage:", err);
  }
}
