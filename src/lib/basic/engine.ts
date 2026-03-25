// src/lib/basic/engine.ts
// NIRA Engine v2

import { Mode, EngineResponse, SubjectDetectionResult } from "@/types/chat";
import { detectIntent, STRONG_CAREER_SIGNALS, STRONG_STUDY_SIGNALS } from "@/lib/basic/intents";
import { buildIntentResponse } from "@/lib/basic/intentResponses";
import { detectSubject } from "@/lib/basic/detectSubject";
import { getFromCache, setInCache } from "@/lib/basic/cache";
import { findStudyAnswer } from "@/lib/basic/studyKnowledgeBase";
import { findCareerAnswer } from "@/lib/basic/careerKnowledgeBase";
import { formatKnowledgeBaseResponse } from "@/lib/basic/formatResponse";
import { searchVideoKnowledge } from "@/lib/basic/videoSearch";
import { formatVideoResponse, VIDEO_RESPONSE_MARKER } from "@/lib/basic/formatVideoResponse";
import { scoreTextResult, scoreVideoResult, resolveDecision } from "@/lib/basic/scorer";
import { buildFallbackResponse } from "@/lib/basic/fallback";
import { formatTimestamp } from "@/lib/basic/videoSearch";

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
// Step 4 — Ranked search
// Searches text KB and video KB
// simultaneously, scores both,
// and resolves the best response
// -------------------------

function buildCombinedContent(
  textContent: string,
  videoResult: import("@/types/chat").VideoSearchResult,
  query: string
): string {
  const startLabel = formatTimestamp(videoResult.startSeconds);
  const endLabel = formatTimestamp(videoResult.endSeconds);

  const videoBlock = [
    "",
    "---",
    `📹 **Related video: ${videoResult.title}**`,
    `⏱ Timestamp: ${startLabel} – ${endLabel}`,
    "",
    `${VIDEO_RESPONSE_MARKER}${JSON.stringify({
      embedUrl: videoResult.embedUrl,
      watchUrl: videoResult.watchUrl,
      title: videoResult.title,
      startLabel,
      endLabel,
    })}`,
  ].join("\n");

  return textContent + videoBlock;
}

async function runRankedSearch(
  query: string,
  mode: Mode,
  subject: SubjectDetectionResult | null
): Promise<EngineResponse> {
  // --- Search text KB ---
  const rawTextEntry =
    mode === "study" ? findStudyAnswer(query) : findCareerAnswer(query);

  const scoredText = rawTextEntry
    ? scoreTextResult(query, rawTextEntry, subject)
    : null;

  // --- Search video KB (study mode only) ---
  const rawVideoResult =
    mode === "study"
      ? searchVideoKnowledge(query, subject?.subject)
      : null;

  const scoredVideo =
    rawVideoResult
      ? scoreVideoResult(query, rawVideoResult.result, rawVideoResult.score, subject)
      : null;

  console.log(
    `[NIRA ENGINE v2] Text score: ${scoredText?.score ?? 0} (${scoredText?.strength ?? "weak"}) | ` +
    `Video score: ${scoredVideo?.score ?? 0} (${scoredVideo?.strength ?? "weak"})`
  );

  // --- Resolve decision ---
  const { decision, textResult, videoResult } = resolveDecision(
    scoredText,
    scoredVideo
  );

  console.log(`[NIRA ENGINE v2] Decision: ${decision}`);

  // --- Build response based on decision ---

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
    const combinedContent = buildCombinedContent(
      formatted.content,
      videoResult.result,
      query
    );
    const response: EngineResponse = {
      content: combinedContent,
      source: "combined",
      mode,
      cached: false,
      videoResult: videoResult.result,
    };
    setInCache(query, mode, response);
    return response;
  }

  // Safety fallback
  return buildFallbackResponse(mode, false);
}

// -------------------------
// Main engine entry point
//
// Flow:
// 1. Intent detection
// 2. Subject detection
// 3. Cross-mode resolution
// 4. Cache
// 5. Ranked search (text + video scored in parallel)
// 6. Fallback
// -------------------------

export async function runBasicEngine(
  messages: IncomingMessage[],
  mode: Mode
): Promise<EngineResponse> {
  const query = extractUserQuery(messages);

  if (!query) {
    return buildFallbackResponse(mode, false);
  }

  // Step 1: Intent
  const intentResponse = checkIntent(query, mode);
  if (intentResponse) return intentResponse;

  // Step 2: Subject detection
  const subject = runSubjectDetection(query, mode);

  // Step 3: Cross-mode resolution
  const effectiveMode = resolveEffectiveMode(query, mode);

  // Step 4: Cache
  const cached = checkCache(query, effectiveMode);
  if (cached) return cached;

  // Step 5: Ranked search → decision → response
  return await runRankedSearch(query, effectiveMode, subject);
}
