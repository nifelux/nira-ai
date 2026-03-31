// src/lib/db/queryCache.ts

import { supabase } from "@/lib/db/supabaseClient";
import { Mode, EngineSource } from "@/types/chat";

const CACHE_TTL_HOURS = 24;

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export interface CachedEntry {
  response: string;
  source: EngineSource;
}

export async function getCachedResponse(
  query: string,
  mode: Mode
): Promise<CachedEntry | null> {
  const normalized = normalizeQuery(query);
  const cutoff = new Date(
    Date.now() - CACHE_TTL_HOURS * 60 * 60 * 1000
  ).toISOString();

  try {
    const { data, error } = await supabase
      .from("query_cache")
      .select("response, source, created_at")
      .eq("query", normalized)
      .eq("mode", mode)
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      response: data.response,
      source: data.source as EngineSource,
    };
  } catch {
    return null;
  }
}

export async function setCachedResponse(
  query: string,
  mode: Mode,
  response: string,
  source: EngineSource
): Promise<void> {
  const normalized = normalizeQuery(query);

  try {
    await supabase.from("query_cache").insert({
      query: normalized,
      mode,
      response,
      source,
    });
  } catch (err) {
    console.error("[NIRA CACHE] Failed to persist cache entry:", err);
  }
}
