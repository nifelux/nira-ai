// src/lib/basic/engine.ts
// NIRA Engine — Stage 8
// Career mode now runs full external intelligence before fallback

import { Mode, EngineResponse, SubjectDetectionResult, KnowledgeEntry, UserTier } from "@/types/chat";
import { detectIntent, STRONG_CAREER_SIGNALS, STRONG_STUDY_SIGNALS } from "@/lib/basic/intents";
import { buildIntentResponse, buildConversationalGreeting, buildPreferenceResponse } from "@/lib/basic/intentResponses";
import { detectSubject } from "@/lib/basic/detectSubject";
import { detectContinuation } from "@/lib/basic/continuationDetector";
import { detectQuestionType } from "@/lib/basic/questionTypeDetector";
import { runSolver } from "@/lib/basic/solver";
import { canUseSource } from "@/lib/basic/sourcePolicy";
import { runExternalSearch } from "@/lib/basic/externalSearch";
import { getFromCache as getMemoryCache, setInCache as setMemoryCache } from "@/lib/basic/cache";
import { studyTextKnowledge, allStudyTextKnowledge } from "@/lib/basic/textKnowledge/index";
import { findCareerAnswer } from "@/lib/basic/careerKnowledgeBase";
import { formatKnowledgeBaseResponse } from "@/lib/basic/formatResponse";
import { searchVideoKnowledge } from "@/lib/basic/videoSearch";
import { formatVideoResponse, buildVideoAttachment } from "@/lib/basic/formatVideoResponse";
import { scoreTextResult, scoreVideoResult, resolveDecision } from "@/lib/basic/scorer";
import { buildFallbackResponse } from "@/lib/basic/fallback";
import { getPreferences } from "@/lib/db/preferences";
import { incrementUsage } from "@/lib/db/usage";
import { getCachedResponse, setCachedResponse } from "@/lib/db/queryCache";
import { getConversationState, setConversationState } from "@/lib/db/conversationState";
import { getRetrievedAnswer, saveRetrievedAnswer } from "@/lib/db/retrievedKnowledge";

// -------------------------
// Responses that must NEVER
// be saved to retrieved knowledge
// -------------------------

const NON_STORABLE_PREFIXES = [
  "hello",
  "hi there",
  "good to hear",
  "i am nira",
  "i was developed",
  "here is how to use",
  "got it",
  "video is now",
  "preference noted",
  "switch to",
];

function isStorableResponse(content: string): boolean {
  const lower = content.trim().toLowerCase();
  return !NON_STORABLE_PREFIXES.some((p) => lower.startsWith(p));
}

// -------------------------
// Solver guide detection
// -------------------------

function isSolverGuide(content: string): boolean {
  const GUIDE_SIGNALS = [
    "share the specific values",
    "share the complete question",
    "formula guide",
    "provide the second pressure",
    "need the specific values",
  ];
  const lower = content.toLowerCase();
  return GUIDE_SIGNALS.some((s) => lower.includes(s));
}

// -------------------------
// Incoming message shape
// -------------------------

interface IncomingMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// -------------------------
// Internal engine context
// -------------------------

interface EngineContext {
  userId: string | null;
  tier: UserTier;
}

const DEFAULT_CONTEXT: EngineContext = { userId: null, tier: "free" };

// -------------------------
// Extract latest user query
// -------------------------

function extractUserQuery(messages: IncomingMessage[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return "";
  return userMessages[userMessages.length - 1].content.trim();
}

// -------------------------
// Cross-mode resolution
// -------------------------

function resolveEffectiveMode(query: string, selectedMode: Mode): Mode {
  const n = query.trim().toLowerCase();
  const hasCareer = STRONG_CAREER_SIGNALS.some((s) => n.includes(s));
  const hasStudy = STRONG_STUDY_SIGNALS.some((s) => n.includes(s));
  if (selectedMode === "study" && hasCareer && !hasStudy) return "career";
  if (selectedMode === "career" && hasStudy && !hasCareer) return "study";
  return selectedMode;
}

// -------------------------
// Matching and scoring
// -------------------------

function kwMatch(query: string, keyword: string): boolean {
  const q = query.trim().toLowerCase();
  const kw = keyword.trim().toLowerCase();
  if (q === kw || q.includes(kw) || kw.includes(q)) return true;
  const words = q.split(/\s+/).filter((w) => w.length > 3);
  return words.length > 0 && words.some((w) => kw.includes(w));
}

function titleMatch(query: string, title: string | undefined): boolean {
  if (!title) return false;
  const q = query.trim().toLowerCase();
  const t = title.trim().toLowerCase();
  if (q === t || t.includes(q) || q.includes(t)) return true;
  const words = q.split(/\s+/).filter((w) => w.length > 3);
  return words.length > 0 && words.some((w) => t.includes(w));
}

function entryMatches(entry: KnowledgeEntry, query: string): boolean {
  if (titleMatch(query, entry.title)) return true;
  return entry.keywords.some((kw) => kwMatch(query, kw));
}

function scoreEntry(entry: KnowledgeEntry, query: string): number {
  const q = query.trim().toLowerCase();
  let score = 0;

  if (entry.title) {
    const t = entry.title.trim().toLowerCase();
    if (q === t) score += 60;
    else if (t.includes(q)) score += 45;
    else if (q.includes(t)) score += 40;
    else {
      const words = q.split(/\s+/).filter((w) => w.length > 3);
      score += words.filter((w) => t.includes(w)).length * 25;
    }
  }

  let hits = 0;
  for (const kw of entry.keywords) {
    const keyword = kw.trim().toLowerCase();
    if (q === keyword) { score += 30; hits++; }
    else if (q.includes(keyword) || keyword.includes(q)) { score += 20; hits++; }
    else {
      const words = q.split(/\s+/).filter((w) => w.length > 3);
      const matched = words.filter((w) => keyword.includes(w)).length;
      if (matched > 0) { score += matched * 8; hits++; }
    }
  }

  score += hits * 5;

  const KEY_TERMS = [
    "electrostatic", "coulomb", "charge", "capacitor",
    "thermodynamics", "entropy", "carnot", "heat engine",
    "derived quantities", "fundamental quantities",
    "photosynthesis", "osmosis", "diffusion",
    "titration", "moles", "concentration",
    "freelancing", "resume", "interview", "career", "skill",
  ];
  for (const term of KEY_TERMS) {
    if (q.includes(term)) {
      const inTitle = entry.title?.toLowerCase().includes(term);
      const inKW = entry.keywords.some((k) => k.toLowerCase().includes(term));
      if (inTitle || inKW) score += 30;
    }
  }

  const queryWords = q.split(/\s+/).filter((w) => w.length > 4);
  const entryText = [entry.title ?? "", ...entry.keywords].join(" ").toLowerCase();
  score -= queryWords.filter((w) => !entryText.includes(w)).length * 5;

  return Math.max(0, score);
}

function findStudyEntry(query: string, subject: SubjectDetectionResult | null): KnowledgeEntry | null {
  if (subject) {
    const entries = studyTextKnowledge[subject.subject] ?? [];
    const matches = entries.filter((e) => entryMatches(e, query));
    if (matches.length > 0) {
      const best = matches.reduce((a, b) => scoreEntry(a, query) >= scoreEntry(b, query) ? a : b);
      console.log(`[NIRA ENGINE] Text KB: ${subject.subject} (score ${scoreEntry(best, query)})`);
      return best;
    }
  }
  const allMatches = allStudyTextKnowledge.filter((e) => entryMatches(e, query));
  if (allMatches.length > 0) {
    const best = allMatches.reduce((a, b) => scoreEntry(a, query) >= scoreEntry(b, query) ? a : b);
    console.log(`[NIRA ENGINE] Text KB: broad (score ${scoreEntry(best, query)})`);
    return best;
  }
  return null;
}

// -------------------------
// Persist conversation state
// -------------------------

async function persistState(userId: string | null, responseContent: string, mode: Mode): Promise<void> {
  if (!userId) return;
  const lines = responseContent.split("\n");
  let nextStep: string | null = null;
  for (const line of lines) {
    if (line.toLowerCase().includes("next step:") || line.toLowerCase().includes("**next step:**")) {
      nextStep = line.replace(/\*\*next step:\*\*/i, "").replace(/next step:/i, "").replace(/\*\*/g, "").trim();
      break;
    }
  }
  await setConversationState(userId, { lastMode: mode, lastNextStep: nextStep });
}

// -------------------------
// External search + save helper
// Used in multiple places
// -------------------------

async function tryExternalAndSave(
  query: string,
  mode: Mode,
  subject: SubjectDetectionResult | null,
  ctx: EngineContext
): Promise<EngineResponse | null> {
  const external = await runExternalSearch(query, mode, ctx.tier);
  if (!external) return null;

  if (canUseSource(ctx.tier, "search") && external.sourceType === "serper") {
    await incrementUsage(ctx.userId, "paid_api");
  } else {
    await incrementUsage(ctx.userId, "free_source");
  }

  if (isStorableResponse(external.content)) {
    await saveRetrievedAnswer({
      query,
      mode,
      subject: subject?.subject ?? null,
      answer: external.content,
      sourceType: external.sourceType,
      sourceUrl: external.sourceUrl,
      confidenceScore: external.confidence,
    });
  }

  await setCachedResponse(query, mode, external.content, "search");

  return {
    content: external.content,
    source: "search",
    mode,
    cached: false,
  };
}

// -------------------------
// Ranked search
// BOTH modes now attempt external
// search before falling back
// -------------------------

async function runRankedSearch(
  query: string,
  mode: Mode,
  subject: SubjectDetectionResult | null,
  ctx: EngineContext
): Promise<EngineResponse> {

  const prefs = await getPreferences(ctx.userId);

  // --- Text KB ---
  const rawText = mode === "study"
    ? findStudyEntry(query, subject)
    : findCareerAnswer(query);

  const scoredText = rawText ? scoreTextResult(query, rawText, subject) : null;

  // --- Video KB (study only) ---
  const videoAllowed = mode === "study" && prefs.allowVideo && canUseSource(ctx.tier, "video_knowledge");
  const rawVideo = videoAllowed ? searchVideoKnowledge(query, subject?.subject) : null;
  if (!videoAllowed && mode === "study") console.log("[NIRA ENGINE] Video suppressed");

  const scoredVideo = rawVideo ? scoreVideoResult(query, rawVideo.result, rawVideo.score, subject) : null;

  console.log(
    `[NIRA ENGINE] Text: ${scoredText?.score ?? 0} (${scoredText?.strength ?? "weak"}) | ` +
    `Video: ${scoredVideo?.score ?? 0} (${scoredVideo?.strength ?? "weak"})`
  );

  if (rawText || rawVideo) await incrementUsage(ctx.userId, "free_source");

  const { decision, textResult, videoResult } = resolveDecision(scoredText, scoredVideo);
  console.log(`[NIRA ENGINE] Decision: ${decision}`);

  // --- Handle successful KB decisions ---
  if (decision === "text_only" && textResult) {
    const formatted = formatKnowledgeBaseResponse(textResult.entry, mode, query);
    const response: EngineResponse = { content: formatted.content, source: "knowledge_base", mode, cached: false };
    setMemoryCache(query, mode, response);
    await setCachedResponse(query, mode, formatted.content, "knowledge_base");
    return response;
  }

  if (decision === "video_only" && videoResult) {
    const response = formatVideoResponse(videoResult.result, query, mode);
    setMemoryCache(query, mode, response);
    await setCachedResponse(query, mode, response.content, "video_knowledge");
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
    setMemoryCache(query, mode, response);
    await setCachedResponse(query, mode, response.content, "combined");
    return response;
  }

  // --- Fallback chain (for BOTH modes) ---
  // 1. Check retrieved knowledge store
  const retrieved = await getRetrievedAnswer(query, mode);
  if (retrieved) {
    console.log(`[NIRA ENGINE] Retrieved KB hit (${retrieved.sourceType})`);
    return { content: retrieved.answer, source: "knowledge_base", mode, cached: false };
  }

  // 2. Try external search — applies to BOTH study and career
  console.log(`[NIRA ENGINE] No KB match — attempting external search (mode: ${mode})`);
  const externalResponse = await tryExternalAndSave(query, mode, subject, ctx);
  if (externalResponse) return externalResponse;

  // 3. Only now — fallback
  console.log("[NIRA ENGINE] All sources exhausted — returning fallback");
  return {
    ...buildFallbackResponse(mode, false),
    source: "fallback",
  };
}

// =========================================================
// MAIN ENGINE ENTRY POINT
// =========================================================

export async function runBasicEngine(
  messages: IncomingMessage[],
  mode: Mode,
  _ctx?: Partial<EngineContext>
): Promise<EngineResponse> {

  const ctx: EngineContext = {
    userId: _ctx?.userId ?? DEFAULT_CONTEXT.userId,
    tier: _ctx?.tier ?? DEFAULT_CONTEXT.tier,
  };

  const rawQuery = extractUserQuery(messages);
  if (!rawQuery) return { ...buildFallbackResponse(mode, false), source: "fallback" };

  await incrementUsage(ctx.userId, "message");

  // STEP 0: Continuation resolution
  let enrichedMessages = [...messages];
  if (ctx.userId) {
    const state = await getConversationState(ctx.userId);
    if (state.lastNextStep && messages.filter((m) => m.role === "assistant").length === 0) {
      enrichedMessages = [
        { role: "assistant", content: `**Next step:** ${state.lastNextStep}` },
        ...messages,
      ];
    }
  }

  const continuation = detectContinuation(rawQuery, enrichedMessages);
  const effectiveQuery = (continuation.isContinuation && continuation.effectiveQuery)
    ? continuation.effectiveQuery
    : rawQuery;

  if (continuation.isContinuation && continuation.effectiveQuery) {
    console.log(`[NIRA ENGINE] Continuation: "${rawQuery}" → "${effectiveQuery}"`);
  }

  // STEP 1: Question type detection
  const questionType = detectQuestionType(effectiveQuery);
  console.log(`[NIRA ENGINE] Type: ${questionType.type} (${questionType.confidence}%)`);

  // STEP 2: Immediate handlers
  if (questionType.type === "system") {
    const r = buildIntentResponse("system", mode, effectiveQuery);
    return r ?? { ...buildFallbackResponse(mode, false), source: "fallback" };
  }

  if (questionType.type === "preference") {
    return await buildPreferenceResponse(effectiveQuery, mode, ctx.userId);
  }

  if (questionType.type === "greeting") {
    return buildConversationalGreeting(mode);
  }

  // Calculation: solver → fallback chain
  if (questionType.type === "calculation") {
    console.log("[NIRA ENGINE] Calculation → solver");
    const solverResult = await runSolver(effectiveQuery, mode);

    if (!isSolverGuide(solverResult.content)) {
      await persistState(ctx.userId, solverResult.content, mode);
      await setCachedResponse(effectiveQuery, mode, solverResult.content, "knowledge_base");
      return solverResult;
    }

    console.log("[NIRA ENGINE] Solver guide — continuing fallback chain");

    const retrieved = await getRetrievedAnswer(effectiveQuery, mode);
    if (retrieved) {
      await persistState(ctx.userId, retrieved.answer, mode);
      return { content: retrieved.answer, source: "knowledge_base", mode, cached: false };
    }

    const externalResponse = await tryExternalAndSave(effectiveQuery, mode, null, ctx);
    if (externalResponse) {
      await persistState(ctx.userId, externalResponse.content, mode);
      return externalResponse;
    }

    await persistState(ctx.userId, solverResult.content, mode);
    return solverResult;
  }

  // STEP 3: Intent detection
  const intent = detectIntent(effectiveQuery);
  if (intent !== "unknown") {
    console.log(`[NIRA ENGINE] Intent: ${intent}`);
    const r = buildIntentResponse(intent, mode, effectiveQuery);
    if (r) return r;
  }

  // STEP 4: Cross-mode resolution
  const resolvedMode = resolveEffectiveMode(effectiveQuery, mode);

  // STEP 5: Subject detection
  const subject = resolvedMode === "study" ? detectSubject(effectiveQuery) : null;
  if (subject) console.log(`[NIRA ENGINE] Subject: ${subject.subject} (${subject.confidence}%)`);

  // STEP 6: Cache
  const dbCached = await getCachedResponse(effectiveQuery, resolvedMode);
  if (dbCached) {
    console.log("[NIRA ENGINE] Supabase cache hit");
    return { content: dbCached.response, source: dbCached.source, mode: resolvedMode, cached: true };
  }
  const memCached = getMemoryCache(effectiveQuery, resolvedMode);
  if (memCached) return memCached;

  // STEP 7: Ranked search → retrieved KB → external → fallback
  const result = await runRankedSearch(effectiveQuery, resolvedMode, subject, ctx);
  await persistState(ctx.userId, result.content, resolvedMode);
  return result;
}
