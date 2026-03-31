// src/lib/db/retrievedKnowledge.ts
// Supabase-backed store for externally retrieved answers.
// Saves clean NIRA-formatted results from Wikipedia, Serper etc.
// Reused on future similar queries to avoid repeated external calls.

import { supabase } from "@/lib/db/supabaseClient";
import { Mode } from "@/types/chat";

// -------------------------
// Retrieved knowledge entry
// -------------------------

export interface RetrievedEntry {
  id: string;
  normalizedQuery: string;
  mode: Mode;
  subject: string | null;
  answer: string;
  sourceType: string;
  sourceUrl: string;
  confidenceScore: number;
  hitCount: number;
  createdAt: string;
}

// -------------------------
// Normalize query for storage
// and lookup
// -------------------------

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

// -------------------------
// Check if a retrieved answer
// exists for this query + mode
// Increments hit_count on reuse
// -------------------------

export async function getRetrievedAnswer(
  query: string,
  mode: Mode
): Promise<RetrievedEntry | null> {
  const normalized = normalizeQuery(query);

  try {
    const { data, error } = await supabase
      .from("retrieved_knowledge")
      .select("*")
      .eq("normalized_query", normalized)
      .eq("mode", mode)
      .order("confidence_score", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    // Increment hit count asynchronously
    supabase
      .from("retrieved_knowledge")
      .update({ hit_count: data.hit_count + 1 })
      .eq("id", data.id)
      .then(() => {});

    return {
      id: data.id,
      normalizedQuery: data.normalized_query,
      mode: data.mode as Mode,
      subject: data.subject ?? null,
      answer: data.answer,
      sourceType: data.source_type,
      sourceUrl: data.source_url,
      confidenceScore: data.confidence_score,
      hitCount: data.hit_count,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

// -------------------------
// Save a successful external
// result for future reuse.
// Only saves if:
// - answer is meaningful (>80 chars)
// - confidence is above threshold
// - not a fallback/error message
// -------------------------

export async function saveRetrievedAnswer(params: {
  query: string;
  mode: Mode;
  subject: string | null;
  answer: string;
  sourceType: string;
  sourceUrl: string;
  confidenceScore: number;
}): Promise<void> {
  const { query, mode, subject, answer, sourceType, sourceUrl, confidenceScore } = params;

  // Quality guard — do not save low-quality or error responses
  if (answer.length < 80) return;
  if (confidenceScore < 50) return;

  const SKIP_PHRASES = [
    "i could not find",
    "no information available",
    "please try again",
    "something went wrong",
    "share the specific values",
    "share the complete question",
  ];
  const lower = answer.toLowerCase();
  if (SKIP_PHRASES.some((p) => lower.includes(p))) return;

  const normalized = normalizeQuery(query);

  try {
    // Check if entry already exists to avoid duplicates
    const { data: existing } = await supabase
      .from("retrieved_knowledge")
      .select("id")
      .eq("normalized_query", normalized)
      .eq("mode", mode)
      .single();

    if (existing) {
      // Update existing entry with new answer and confidence
      await supabase
        .from("retrieved_knowledge")
        .update({
          answer,
          source_type: sourceType,
          source_url: sourceUrl,
          confidence_score: confidenceScore,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      // Insert new entry
      await supabase.from("retrieved_knowledge").insert({
        normalized_query: normalized,
        mode,
        subject,
        answer,
        source_type: sourceType,
        source_url: sourceUrl,
        confidence_score: confidenceScore,
        hit_count: 0,
      });
    }

    console.log(`[NIRA RETRIEVED KB] Saved: "${normalized}" (${sourceType})`);
  } catch (err) {
    console.error("[NIRA RETRIEVED KB] Failed to save:", err);
  }
}
