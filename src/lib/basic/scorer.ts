// src/lib/basic/scorer.ts

import {
  KnowledgeEntry,
  VideoSearchResult,
  ScoredTextResult,
  ScoredVideoResult,
  CombinedEngineResult,
  ScoreStrength,
  SubjectDetectionResult,
} from "@/types/chat";

// -------------------------
// Score thresholds
// -------------------------

const STRONG_THRESHOLD = 60;
const WEAK_THRESHOLD = 30;

// -------------------------
// Classify score into strength
// -------------------------

function classifyStrength(score: number): ScoreStrength {
  if (score >= STRONG_THRESHOLD) return "strong";
  if (score >= WEAK_THRESHOLD) return "partial";
  return "weak";
}

// -------------------------
// Bidirectional keyword scorer
//
// Returns a score for how well
// the query matches a single keyword.
// Handles both directions:
// - query contains keyword
// - keyword contains query (short query, long keyword)
// - word-level overlap
// -------------------------

function scoreKeywordMatch(query: string, keyword: string): number {
  const q = query.trim().toLowerCase();
  const kw = keyword.trim().toLowerCase();

  if (q === kw) return 30; // exact match

  if (q.includes(kw)) return 20; // query contains keyword

  if (kw.includes(q)) return 20; // keyword contains query
  // (e.g. "thermodynamics" matched by "first law of thermodynamics")

  // Word-level matching
  const queryWords = q.split(/\s+/).filter((w) => w.length > 3);
  if (queryWords.length === 0) return 0;

  const matchedWords = queryWords.filter((w) => kw.includes(w)).length;

  if (matchedWords === queryWords.length) return 15; // all query words found in keyword
  if (matchedWords > 0) return matchedWords * 5;    // partial word overlap

  return 0;
}

// -------------------------
// Score a text KB entry
// against the user query
//
// Scoring:
// - Best keyword match       up to +30
// - Additional keyword hits  up to +20
// - Query words in answer    up to +15 bonus
// - Subject confidence       up to +10 bonus
// Cap: 100
// -------------------------

export function scoreTextResult(
  query: string,
  entry: KnowledgeEntry,
  subject: SubjectDetectionResult | null
): ScoredTextResult {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedAnswer = entry.answer.toLowerCase();
  const queryWords = normalizedQuery
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);

  let score = 0;

  // Score all keywords and sum contributions
  for (const keyword of entry.keywords) {
    const keywordScore = scoreKeywordMatch(normalizedQuery, keyword);
    score += keywordScore;
  }

  // Bonus: significant query words found in the answer body
  let bodyBonus = 0;
  for (const word of queryWords) {
    if (normalizedAnswer.includes(word)) {
      bodyBonus += 5;
    }
  }
  score += Math.min(bodyBonus, 15);

  // Bonus: subject confidence alignment
  if (subject) {
    const subjectBonus = Math.floor(subject.confidence / 10);
    score += Math.min(subjectBonus, 10);
  }

  const capped = Math.min(score, 100);

  return {
    entry,
    score: capped,
    strength: classifyStrength(capped),
  };
}

// -------------------------
// Score a video search result
// against the user query
//
// Scoring:
// - Raw video search score   normalized to 0–60
// - Subject match bonus      +20
// - Query words in text      up to +20
// Cap: 100
// -------------------------

export function scoreVideoResult(
  query: string,
  result: VideoSearchResult,
  rawScore: number,
  subject: SubjectDetectionResult | null
): ScoredVideoResult {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedText = result.segmentText.toLowerCase();
  const queryWords = normalizedQuery
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5);

  // Normalize raw video score into 0–60 range
  let score = Math.min(rawScore * 10, 60);

  // Subject match bonus
  if (subject && result.subject === subject.subject) {
    score += 20;
  }

  // Query words found in segment text
  let textBonus = 0;
  for (const word of queryWords) {
    if (normalizedText.includes(word)) {
      textBonus += 5;
    }
  }
  score += Math.min(textBonus, 20);

  const capped = Math.min(score, 100);

  return {
    result,
    score: capped,
    strength: classifyStrength(capped),
  };
}

// -------------------------
// Decision engine
//
// Decision table:
// text STRONG  + video STRONG  → combined
// text STRONG  + video PARTIAL → text_only
// text STRONG  + video WEAK    → text_only
// text PARTIAL + video STRONG  → video_only
// text PARTIAL + video PARTIAL → higher score wins
// text PARTIAL + video WEAK    → text_only
// text WEAK    + video STRONG  → video_only
// text WEAK    + video PARTIAL → video_only
// text WEAK    + video WEAK    → fallback
// -------------------------

export function resolveDecision(
  textResult: ScoredTextResult | null,
  videoResult: ScoredVideoResult | null
): CombinedEngineResult {
  const textStrength = textResult?.strength ?? "weak";
  const videoStrength = videoResult?.strength ?? "weak";

  let decision: CombinedEngineResult["decision"];

  if (textStrength === "strong" && videoStrength === "strong") {
    decision = "combined";
  } else if (textStrength === "strong") {
    decision = "text_only";
  } else if (videoStrength === "strong") {
    decision = "video_only";
  } else if (textStrength === "partial" && videoStrength === "partial") {
    const textScore = textResult?.score ?? 0;
    const videoScore = videoResult?.score ?? 0;
    decision = textScore >= videoScore ? "text_only" : "video_only";
  } else if (textStrength === "partial") {
    decision = "text_only";
  } else if (videoStrength === "partial") {
    decision = "video_only";
  } else {
    decision = "fallback";
  }

  return {
    textResult,
    videoResult,
    decision,
  };
}
