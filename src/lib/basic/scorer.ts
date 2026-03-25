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
// Classify a raw score into
// a strength category
// -------------------------

function classifyStrength(score: number): ScoreStrength {
  if (score >= STRONG_THRESHOLD) return "strong";
  if (score >= WEAK_THRESHOLD) return "partial";
  return "weak";
}

// -------------------------
// Score a text KB entry
// against the user query
//
// Scoring weights:
// - exact keyword match    +30
// - partial keyword match  +15
// - query word in answer   +5 per word (max 3 words)
// - subject confidence     up to +10 bonus
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

  // Keyword matching
  for (const keyword of entry.keywords) {
    const normalizedKeyword = keyword.toLowerCase();

    if (normalizedQuery === normalizedKeyword) {
      score += 30;
    } else if (normalizedQuery.includes(normalizedKeyword)) {
      score += 20;
    } else if (normalizedKeyword.includes(normalizedQuery)) {
      score += 15;
    } else {
      // Partial word overlap
      const keywordWords = normalizedKeyword.split(/\s+/);
      const overlap = keywordWords.filter((w) =>
        normalizedQuery.includes(w)
      ).length;
      if (overlap > 0) {
        score += overlap * 5;
      }
    }
  }

  // Bonus: query words found in the answer body
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
// Scoring weights:
// - raw video search score  ×10 (normalized)
// - subject match bonus     +20
// - query words in text     +5 per word (max 3)
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

  // Normalize raw score from videoSearch into 0–60 range
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
// Compares text and video scores
// and returns the final decision
//
// Decision table:
//
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
    // Both partial — pick the higher score
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
