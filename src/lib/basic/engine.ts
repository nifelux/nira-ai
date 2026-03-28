// src/lib/basic/engine.ts
// NIRA Engine v2
// Full pipeline with:
// - Continuation detection
// - Question type detection
// - Greeting handling
// - Solver routing for calculations
// - Subject-aware text KB lookup
// - Video KB + ranked scoring
// - Fallback

import { Mode, EngineResponse, SubjectDetectionResult, KnowledgeEntry } from "@/types/chat";
import { detectIntent, STRONG_CAREER_SIGNALS, STRONG_STUDY_SIGNALS } from "@/lib/basic/intents";
import { buildIntentResponse, buildConversationalGreeting } from "@/lib/basic/intentResponses";
import { detectSubject } from "@/lib/basic/detectSubject";
import { detectContinuation } from "@/lib/basic/continuationDetector";
import { detectQuestionType } from "@/lib/basic/questionTypeDetector";
import { runSolver } from "@/lib/basic/solver";
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
// Intent detection
// -------------------------

function checkIntent(query: string, mode: Mode): EngineResponse | null {
  const intent = detectIntent(query);
  if (intent === "unknown") return null;
  console.log(`[NIRA ENGINE v2] Intent: ${intent}`);
  return buildIntentResponse(intent, mode);
}

// -------------------------
// Subject detection
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
// Cache lookup
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
    if (queryWords.every((w) => kw.includes(w))) return true;
    if (queryWords.some((w) => kw.includes(w))) return true;
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
    if (q === keyword) score += 30;
    else if (q.includes(keyword)) score += 20;
    else if (keyword.includes(q)) score += 15;
    else {
      const qWords = q.split(/\s+/).filter((w) => w.length > 3);
      score += qWords.filter((w) => keyword.includes(w)).length * 5;
    }
  }

  return score;
}

// -------------------------
// Subject-aware study text lookup
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
// Ranked KB + video search
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
    ? scoreVideoResult(query, rawVideoResult.result, rawVideoResult.score, subject)
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
    const formatted = formatKnowledgeBaseResponse(textResult.entry, mode, query);
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
    const formatted = formatKnowledgeBaseResponse(textResult.entry, mode, query);
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
// Full pipeline:
//
// Step 0: Continuation detection
//   - "yes/ok/continue/next" → extract next-step topic
//   - effectiveQuery = extracted topic
//
// Step 1: Question type detection (on effectiveQuery)
//   - greeting  → return conversational greeting
//   - calculation → route to solver
//   - other types → continue to knowledge flow
//
// Step 2: Intent detection
//   - creator/who_are_you/help → direct response
//   - unknown → continue
//
// Step 3: Subject detection
// Step 4: Cross-mode resolution
// Step 5: Cache
// Step 6: Ranked search (text KB + video KB)
// Step 7: Fallback
// -------------------------

export async function runBasicEngine(
  messages: IncomingMessage[],
  mode: Mode
): Promise<EngineResponse> {
  const rawQuery = extractUserQuery(messages);

  if (!rawQuery) {
    return buildFallbackResponse(mode, false);
  }

  // =============================================
  // STEP 0: Continuation detection
  // =============================================
  const continuation = detectContinuation(rawQuery, messages);
  let effectiveQuery: string;

  if (continuation.isContinuation && continuation.effectiveQuery) {
    effectiveQuery = continuation.effectiveQuery;
    console.log(
      `[NIRA ENGINE v2] Continuation resolved: "${rawQuery}" → "${effectiveQuery}"`
    );
  } else if (continuation.isContinuation && !continuation.effectiveQuery) {
    // Continuation word but no prior context
    effectiveQuery = rawQuery;
    console.log("[NIRA ENGINE v2] Continuation with no prior context.");
  } else {
    effectiveQuery = rawQuery;
  }

  // =============================================
  // STEP 1: Question type detection
  // Runs on effectiveQuery so a continuation
  // resolved to a calculation gets solved,
  // and "how are you" gets a greeting response
  // =============================================
  const questionType = detectQuestionType(effectiveQuery);
  console.log(
    `[NIRA ENGINE v2] Question type: ${questionType.type} (confidence: ${questionType.confidence})`
  );

  // Handle greeting type — return immediately
  if (questionType.type === "greeting") {
    console.log("[NIRA ENGINE v2] Greeting detected — returning greeting response");
    return buildConversationalGreeting(mode);
  }

  // Handle calculation type — route to solver
  if (questionType.type === "calculation") {
    console.log("[NIRA ENGINE v2] Calculation detected — routing to solver");
    return await runSolver(effectiveQuery, mode);
  }

  // =============================================
  // STEP 2: Intent detection
  // =============================================
  const intentResponse = checkIntent(effectiveQuery, mode);
  if (intentResponse) return intentResponse;

  // =============================================
  // STEP 3: Subject detection
  // =============================================
  const subject = runSubjectDetection(effectiveQuery, mode);

  // =============================================
  // STEP 4: Cross-mode resolution
  // =============================================
  const resolvedMode = resolveEffectiveMode(effectiveQuery, mode);

  // =============================================
  // STEP 5: Cache
  // =============================================
  const cached = checkCache(effectiveQuery, resolvedMode);
  if (cached) return cached;

  // =============================================
  // STEP 6: Ranked search + decision
  // =============================================
  return await runRankedSearch(effectiveQuery, resolvedMode, subject);
}
