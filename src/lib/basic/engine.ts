// src/lib/basic/engine.ts
// NIRA Engine v2 — with follow-up continuation support

import { Mode, EngineResponse, SubjectDetectionResult, KnowledgeEntry } from "@/types/chat";
import { detectIntent, STRONG_CAREER_SIGNALS, STRONG_STUDY_SIGNALS } from "@/lib/basic/intents";
import { buildIntentResponse } from "@/lib/basic/intentResponses";
import { detectSubject } from "@/lib/basic/detectSubject";
import { detectContinuation } from "@/lib/basic/continuationDetector";
import { getFromCache, setInCache } from "@/lib/basic/cache";
import { studyTextKnowledge, allStudyTextKnowledge } from "@/lib/basic/textKnowledge/index";
import { findCareerAnswer } from "@/lib/basic/careerKnowledgeBase";
import { formatKnowledgeBaseResponse } from "@/lib/basic/formatResponse";
import { searchVideoKnowledge } from "@/lib/basic/videoSearch";
import { formatVideoResponse, buildVideoAttachment } from "@/lib/basic/formatVideoResponse";
import { scoreTextResult, scoreVideoResult, resolveDecision } from "@/lib/basic/scorer";
import { buildFallbackResponse } from "@/lib/basic/fallback";

// -------------------------
// Incoming message shape
// -------------------------

interface IncomingMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// -------------------------
// Extract latest user query
// -------------------------

function extractUserQuery(messages: IncomingMessage[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return "";
  return userMessages[userMessages.length - 1].content.trim();
}

// -------------------------
// Cross-mode resolver
// -------------------------

function resolveEffectiveMode(query: string, selectedMode: Mode): Mode {
  const normalized = query.trim().toLowerCase();

  const hasCareerSignal = STRONG_CAREER_SIGNALS.some((s) =>
    normalized.includes(s)
  );
  const hasStudySignal = STRONG_STUDY_SIGNALS.some((s) =>
    normalized.includes(s)
  );

  if (selectedMode === "study" && hasCareerSignal && !hasStudySignal) {
    console.log("[NIRA ENGINE v2] Cross-mode: career signal in study mode");
    return "career";
  }
  if (selectedMode === "career" && hasStudySignal && !hasCareerSignal) {
    console.log("[NIRA ENGINE v2] Cross-mode: study signal in career mode");
    return "study";
  }

  return selectedMode;
}

// -------------------------
// Step 1 — Intent detection
// Only runs on the resolved query,
// not on raw continuation words
// -------------------------

function checkIntent(query: string, mode: Mode): EngineResponse | null {
  const intent = detectIntent(query);
  if (intent === "unknown") return null;
  console.log(`[NIRA ENGINE v2] Intent: ${intent}`);
  return buildIntentResponse(intent, mode);
}

// -------------------------
// Step 2 — Subject detection
// -------------------------

function runSubjectDetection(
  query: string,
  mode: Mode
): SubjectDetectionResult | null {
  if (mode !== "study") return null;
  const result = detectSubject(query);
  if (result) {
    console.log(
      `[NIRA ENGINE v2] Subject: ${result.subject} (confidence: ${result.confidence})`
    );
  }
  return result;
}

// -------------------------
// Step 3 — Cache lookup
// -------------------------

function checkCache(query: string, mode: Mode): EngineResponse | null {
  const cached = getFromCache(query, mode);
  if (cached) {
    console.log("[NIRA ENGINE v2] Cache hit");
    return cached;
  }
  return null;
}

// -------------------------
// Bidirectional keyword matcher
// -------------------------

function keywordMatches(query: string, keyword: string): boolean {
  const q = query.trim().toLowerCase();
  const kw = keyword.trim().toLowerCase();

  if (q === kw) return true;
  if (q.includes(kw)) return true;
  if (kw.includes(q)) return true;

  const queryWords = q.split(/\s+/).filter((w) => w.length > 3);
  if (queryWords.length > 0) {
    const allMatch = queryWords.every((w) => kw.includes(w));
    if (allMatch) return true;
    const someMatch = queryWords.some((w) => kw.includes(w));
    if (someMatch) return true;
  }

  return false;
}

function entryMatchesQuery(entry: KnowledgeEntry, query: string): boolean {
  return entry.keywords.some((kw) => keywordMatches(query, kw));
}

function scoreEntryMatch(entry: KnowledgeEntry, query: string): number {
  const q = query.trim().toLowerCase();
  let score = 0;

  for (const kw of entry.keywords) {
    const keyword = kw.trim().toLowerCase();

    if (q === keyword) {
      score += 30;
    } else if (q.includes(keyword)) {
      score += 20;
    } else if (keyword.includes(q)) {
      score += 15;
    } else {
      const queryWords = q.split(/\s+/).filter((w) => w.length > 3);
      const matched = queryWords.filter((w) => keyword.includes(w)).length;
      score += matched * 5;
    }
  }

  return score;
}

// -------------------------
// Subject-aware study text lookup
// with bidirectional matching
// -------------------------

function findStudyTextEntry(
  query: string,
  subject: SubjectDetectionResult | null
): KnowledgeEntry | null {

  // Targeted: search detected subject first
  if (subject) {
    const subjectEntries = studyTextKnowledge[subject.subject] ?? [];
    const matches = subjectEntries.filter((e) => entryMatchesQuery(e, query));

    if (matches.length > 0) {
      const best = matches.reduce((a, b) =>
        scoreEntryMatch(a, query) >= scoreEntryMatch(b, query) ? a : b
      );
      console.log(
        `[NIRA ENGINE v2] Text KB hit — subject: ${subject.subject} (targeted)`
      );
      return best;
    }
  }

  // Broad: search all subjects
  const allMatches = allStudyTextKnowledge.filter((e) =>
    entryMatchesQuery(e, query)
  );

  if (allMatches.length > 0) {
    const best = allMatches.reduce((a, b) =>
      scoreEntryMatch(a, query) >= scoreEntryMatch(b, query) ? a : b
    );
    console.log("[NIRA ENGINE v2] Text KB hit — broad search");
    return best;
  }

  return null;
}

// -------------------------
// Step 4 — Ranked search
// -------------------------

async function runRankedSearch(
  query: string,
  mode: Mode,
  subject: SubjectDetectionResult | null
): Promise<EngineResponse> {

  const rawTextEntry =
    mode === "study"
      ? findStudyTextEntry(query, subject)
      : findCareerAnswer(query);

  const scoredText = rawTextEntry
    ? scoreTextResult(query, rawTextEntry, subject)
    : null;

  const rawVideoResult =
    mode === "study"
      ? searchVideoKnowledge(query, subject?.subject)
      : null;

  const scoredVideo = rawVideoResult
    ? scoreVideoResult(
        query,
        rawVideoResult.result,
        rawVideoResult.score,
        subject
      )
    : null;

  console.log(
    `[NIRA ENGINE v2] Text: ${scoredText?.score ?? 0} (${scoredText?.strength ?? "weak"}) | ` +
    `Video: ${scoredVideo?.score ?? 0} (${scoredVideo?.strength ?? "weak"})`
  );

  const { decision, textResult, videoResult } = resolveDecision(
    scoredText,
    scoredVideo
  );

  console.log(`[NIRA ENGINE v2] Decision: ${decision}`);

  if (decision === "fallback") {
    return buildFallbackResponse(mode, false);
  }

  if (decision === "text_only" && textResult) {
    const formatted = formatKnowledgeBaseResponse(
      textResult.entry,
      mode,
      query
    );
    const response: EngineResponse = {
      content: formatted.content,
      source: "knowledge_base",
      mode,
      cached: false,
    };
    setInCache(query, mode, response);
    return response;
  }

  if (decision === "video_only" && videoResult) {
    const response = formatVideoResponse(videoResult.result, query, mode);
    setInCache(query, mode, response);
    return response;
  }

  if (decision === "combined" && textResult && videoResult) {
    const formatted = formatKnowledgeBaseResponse(
      textResult.entry,
      mode,
      query
    );
    const videoAttachment = buildVideoAttachment(videoResult.result);
    const response: EngineResponse = {
      content: formatted.content + videoAttachment,
      source: "combined",
      mode,
      cached: false,
      videoResult: videoResult.result,
    };
    setInCache(query, mode, response);
    return response;
  }

  return buildFallbackResponse(mode, false);
}

// -------------------------
// Main engine entry point
//
// Full flow:
// 0. Continuation detection (NEW)
//    - if user says "yes/ok/next/continue"
//    - extract next topic from prior assistant context
//    - use that as the effective query
// 1. Intent detection (on effective query)
// 2. Subject detection
// 3. Cross-mode resolution
// 4. Cache
// 5. Ranked search (text + video)
// 6. Fallback (only if all sources miss)
// -------------------------

export async function runBasicEngine(
  messages: IncomingMessage[],
  mode: Mode
): Promise<EngineResponse> {
  const rawQuery = extractUserQuery(messages);

  if (!rawQuery) {
    return buildFallbackResponse(mode, false);
  }

  // --- Step 0: Continuation detection ---
  // Resolves short follow-up replies into
  // the real topic the user wants to continue
  const continuation = detectContinuation(rawQuery, messages);

  let effectiveQuery: string;

  if (continuation.isContinuation) {
    if (continuation.effectiveQuery) {
      // Use the extracted next topic as the real query
      effectiveQuery = continuation.effectiveQuery;
      console.log(
        `[NIRA ENGINE v2] Continuation resolved: "${rawQuery}" → "${effectiveQuery}"`
      );
    } else {
      // Continuation word but no prior context available
      // Fall through to normal flow with the raw query
      // (intent detection may handle "next", "help" etc.)
      effectiveQuery = rawQuery;
      console.log(
        "[NIRA ENGINE v2] Continuation detected but no prior context. Using raw query."
      );
    }
  } else {
    effectiveQuery = rawQuery;
  }

  // --- Step 1: Intent detection ---
  // Runs on effectiveQuery so "yes" expanded to
  // "explain the first law of thermodynamics"
  // does not accidentally match a greeting intent
  const intentResponse = checkIntent(effectiveQuery, mode);
  if (intentResponse) return intentResponse;

  // --- Step 2: Subject detection ---
  const subject = runSubjectDetection(effectiveQuery, mode);

  // --- Step 3: Cross-mode resolution ---
  const resolvedMode = resolveEffectiveMode(effectiveQuery, mode);

  // --- Step 4: Cache ---
  const cached = checkCache(effectiveQuery, resolvedMode);
  if (cached) return cached;

  // --- Step 5: Ranked search + decision ---
  return await runRankedSearch(effectiveQuery, resolvedMode, subject);
}
