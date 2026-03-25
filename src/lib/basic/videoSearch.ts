// src/lib/basic/videoSearch.ts

import { VideoEntry, VideoSearchResult, StudySubject } from "@/types/chat";
import { allStudyVideoKnowledge } from "@/lib/basic/videoKnowledge/index";

// -------------------------
// Scored video result
// Returns both the match and
// its raw score for the engine
// to compare against text score
// -------------------------

export interface ScoredVideoSearchResult {
  result: VideoSearchResult;
  score: number;
}

// -------------------------
// Format seconds into MM:SS
// -------------------------

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// -------------------------
// Build YouTube URLs
// -------------------------

function buildEmbedUrl(videoId: string, startSeconds: number): string {
  return `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=0&rel=0`;
}

function buildWatchUrl(videoId: string, startSeconds: number): string {
  return `https://youtu.be/${videoId}?t=${startSeconds}`;
}

// -------------------------
// Score a single segment
// against the user query.
//
// Scoring weights:
// - exact keyword match    +3
// - partial keyword match  +1
// - query word in text     +1 per word
// -------------------------

function scoreSegment(query: string, keywords: string[], text: string): number {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedText = text.toLowerCase();
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 3);

  let score = 0;

  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase();

    if (normalizedQuery === normalizedKeyword) {
      // Exact full match
      score += 3;
    } else if (normalizedQuery.includes(normalizedKeyword)) {
      // Query contains keyword
      score += 2;
    } else if (normalizedKeyword.includes(normalizedQuery)) {
      // Keyword contains query
      score += 1;
    }
  }

  // Bonus for query words found in the segment text
  for (const word of queryWords) {
    if (normalizedText.includes(word)) {
      score += 1;
    }
  }

  return score;
}

// -------------------------
// Main video search function
// Returns the best scored result
// or null if no match found
// -------------------------

export function searchVideoKnowledge(
  query: string,
  subject?: StudySubject
): ScoredVideoSearchResult | null {
  let bestScore = 0;
  let bestResult: VideoSearchResult | null = null;

  // Filter by subject if detected
  const pool: VideoEntry[] = subject
    ? allStudyVideoKnowledge.filter((v) => v.subject === subject)
    : allStudyVideoKnowledge;

  for (const video of pool) {
    for (const segment of video.segments) {
      const score = scoreSegment(query, segment.keywords, segment.text);

      if (score > bestScore) {
        bestScore = score;
        bestResult = {
          videoId: video.videoId,
          title: video.title,
          subject: video.subject,
          segmentText: segment.text,
          startSeconds: segment.start,
          endSeconds: segment.end,
          embedUrl: buildEmbedUrl(video.videoId, segment.start),
          watchUrl: buildWatchUrl(video.videoId, segment.start),
        };
      }
    }
  }

  if (!bestResult || bestScore < 1) {
    return null;
  }

  return {
    result: bestResult,
    score: bestScore,
  };
}
