// src/lib/basic/formatVideoResponse.ts

import { VideoSearchResult, EngineResponse, Mode } from "@/types/chat";
import { formatTimestamp } from "@/lib/basic/videoSearch";

// -------------------------
// Video response marker
// Parsed by ChatMessage.tsx
// to render the embed block
// -------------------------

export const VIDEO_RESPONSE_MARKER = "%%NIRA_VIDEO%%";

// -------------------------
// Build a natural summary
// from the matched segment text
// No robotic prefixes
// -------------------------

function buildSegmentSummary(segmentText: string, query: string): string {
  const normalized = query.trim().toLowerCase();

  // Trim the segment to the first two meaningful sentences
  const sentences = segmentText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 2);

  if (sentences.length === 0) return segmentText.slice(0, 300);

  const summary = sentences.join(" ");

  // Add a light contextual intro based on query type
  if (
    normalized.startsWith("what is") ||
    normalized.startsWith("define") ||
    normalized.startsWith("meaning of")
  ) {
    return summary;
  }

  if (normalized.startsWith("how")) {
    return summary;
  }

  return summary;
}

// -------------------------
// Build the video embed block
// with smooth transition copy
// -------------------------

function buildVideoBlock(
  result: VideoSearchResult,
  startLabel: string,
  endLabel: string
): string {
  return [
    "🎥 You can also watch this explanation below:",
    "",
    `📹 **${result.title}**`,
    `⏱ Timestamp: ${startLabel} – ${endLabel}`,
    "",
    `${VIDEO_RESPONSE_MARKER}${JSON.stringify({
      embedUrl: result.embedUrl,
      watchUrl: result.watchUrl,
      title: result.title,
      startLabel,
      endLabel,
    })}`,
  ].join("\n");
}

// -------------------------
// Main video response formatter
// Returns a complete EngineResponse
// with natural summary + embed block
// -------------------------

export function formatVideoResponse(
  result: VideoSearchResult,
  query: string,
  mode: Mode
): EngineResponse {
  const startLabel = formatTimestamp(result.startSeconds);
  const endLabel = formatTimestamp(result.endSeconds);

  const summary = buildSegmentSummary(result.segmentText, query);
  const videoBlock = buildVideoBlock(result, startLabel, endLabel);

  const content = [summary, "", videoBlock].join("\n");

  return {
    content,
    source: "video_knowledge",
    mode,
    cached: false,
    videoResult: result,
  };
}

// -------------------------
// Build a video attachment block
// Used by engine.ts when appending
// a video to a text KB response
// (combined decision)
// -------------------------

export function buildVideoAttachment(
  result: VideoSearchResult
): string {
  const startLabel = formatTimestamp(result.startSeconds);
  const endLabel = formatTimestamp(result.endSeconds);

  return [
    "",
    "---",
    "🎥 You can also watch this explanation below:",
    "",
    `📹 **${result.title}**`,
    `⏱ Timestamp: ${startLabel} – ${endLabel}`,
    "",
    `${VIDEO_RESPONSE_MARKER}${JSON.stringify({
      embedUrl: result.embedUrl,
      watchUrl: result.watchUrl,
      title: result.title,
      startLabel,
      endLabel,
    })}`,
  ].join("\n");
}
