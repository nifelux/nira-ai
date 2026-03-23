// src/lib/basic/engine.ts

import { Mode, EngineResponse } from "@/types/chat";
import { detectIntent, STRONG_CAREER_SIGNALS, STRONG_STUDY_SIGNALS } from "@/lib/basic/intents";
import { buildIntentResponse } from "@/lib/basic/intentResponses";
import { getFromCache, setInCache } from "@/lib/basic/cache";
import { findStudyAnswer } from "@/lib/basic/studyKnowledgeBase";
import { findCareerAnswer } from "@/lib/basic/careerKnowledgeBase";
import { formatKnowledgeBaseResponse } from "@/lib/basic/formatResponse";
import { performSearch, formatSearchResults } from "@/lib/basic/search";
import { buildFallbackResponse, appendUpgradePrompt } from "@/lib/basic/fallback";

// -------------------------
// Extract the latest user message
// from the messages array
// -------------------------

interface IncomingMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

function extractUserQuery(messages: IncomingMessage[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return "";
  return userMessages[userMessages.length - 1].content.trim();
}

// -------------------------
// Cross-mode resolver
// Detects when a query clearly belongs
// to a different mode than selected
// and returns the correct effective mode
// -------------------------

function resolveEffectiveMode(query: string, selectedMode: Mode): Mode {
  const normalized = query.trim().toLowerCase();

  const hasCareerSignal = STRONG_CAREER_SIGNALS.some((signal) =>
    normalized.includes(signal)
  );

  const hasStudySignal = STRONG_STUDY_SIGNALS.some((signal) =>
    normalized.includes(signal)
  );

  if (selectedMode === "study" && hasCareerSignal && !hasStudySignal) {
    console.log("[NIRA ENGINE] Cross-mode: career signal in study mode — routing to career KB");
    return "career";
  }

  if (selectedMode === "career" && hasStudySignal && !hasCareerSignal) {
    console.log("[NIRA ENGINE] Cross-mode: study signal in career mode — routing to study KB");
    return "study";
  }

  return selectedMode;
}

// -------------------------
// Step 1 — Intent detection
// Direct-response intents bypass
// all other layers
// -------------------------

function checkIntent(query: string, mode: Mode): EngineResponse | null {
  const intent = detectIntent(query);

  if (intent === "unknown") return null;

  console.log(`[NIRA ENGINE] Intent detected: ${intent}`);

  return buildIntentResponse(intent, mode);
}

// -------------------------
// Step 2 — Cache lookup
// -------------------------

function checkCache(query: string, mode: Mode): EngineResponse | null {
  const cached = getFromCache(query, mode);
  if (cached) {
    console.log("[NIRA ENGINE] Cache hit");
    return cached;
  }
  return null;
}

// -------------------------
// Step 3 — Knowledge base lookup
// KB answer passes through the
// formatter before being returned
// Raw KB content is never sent
// directly to the user
// -------------------------

function checkKnowledgeBase(
  query: string,
  mode: Mode
): EngineResponse | null {
  const entry =
    mode === "study" ? findStudyAnswer(query) : findCareerAnswer(query);

  if (!entry) return null;

  console.log(`[NIRA ENGINE] Knowledge base hit — mode: ${mode}`);

  // --- Format the KB answer before returning ---
  const formatted = formatKnowledgeBaseResponse(entry, mode, query);

  const response: EngineResponse = {
    content: formatted.content,
    source: "knowledge_base",
    mode,
    cached: false,
  };

  // Cache the formatted response
  setInCache(query, mode, response);

  return response;
}

// -------------------------
// Step 4 — Search fallback
// -------------------------

async function checkSearch(
  query: string,
  mode: Mode
): Promise<{ response: EngineResponse | null; exhausted: boolean }> {
  const searchResult = await performSearch(query, mode);

  if (searchResult.exhausted) {
    console.log("[NIRA ENGINE] Search quota exhausted");
    return { response: null, exhausted: true };
  }

  if (!searchResult.success || searchResult.results.length === 0) {
    console.log("[NIRA ENGINE] Search returned no results");
    return { response: null, exhausted: false };
  }

  console.log("[NIRA ENGINE] Search hit");

  const content = formatSearchResults(searchResult.results, query);

  const response: EngineResponse = {
    content: appendUpgradePrompt(content),
    source: "search",
    mode,
    cached: false,
    upgradePrompt: undefined,
  };

  setInCache(query, mode, response);

  return { response, exhausted: false };
}

// -------------------------
// Main engine entry point
// Intent → Cross-mode resolve →
// Cache → Knowledge Base (formatted) →
// Search → Fallback
// -------------------------

export async function runBasicEngine(
  messages: IncomingMessage[],
  mode: Mode
): Promise<EngineResponse> {
  const query = extractUserQuery(messages);

  if (!query) {
    return buildFallbackResponse(mode, false);
  }

  // --- Step 1: Intent detection ---
  const intentResponse = checkIntent(query, mode);
  if (intentResponse) return intentResponse;

  // --- Step 2: Cross-mode resolution ---
  const effectiveMode = resolveEffectiveMode(query, mode);

  // --- Step 3: Cache ---
  const cached = checkCache(query, effectiveMode);
  if (cached) return cached;

  // --- Step 4: Knowledge base + formatter ---
  const knowledgeResponse = checkKnowledgeBase(query, effectiveMode);
  if (knowledgeResponse) return knowledgeResponse;

  // --- Step 5: Search ---
  const { response: searchResponse, exhausted } = await checkSearch(
    query,
    effectiveMode
  );
  if (searchResponse) return searchResponse;

  // --- Step 6: Fallback ---
  console.log("[NIRA ENGINE] All sources missed — returning fallback");
  return buildFallbackResponse(effectiveMode, exhausted);
}
