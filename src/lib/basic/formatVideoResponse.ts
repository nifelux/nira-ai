// src/lib/basic/formatVideoResponse.ts

import { VideoSearchResult, EngineResponse, Mode } from "@/types/chat";
import { formatTimestamp } from "@/lib/basic/videoSearch";

// -------------------------
// Video response marker
// Used by ChatMessage.tsx to
// detect and render video blocks
// -------------------------

export const VIDEO_RESPONSE_MARKER = "%%NIRA_VIDEO%%";

// -------------------------
// Build a NIRA-style response
// from a matched video segment
//
// Structure:
// - Clear summary answer
// - Video title + timestamp range
// - Marker for UI to render embed
// - Fallback watch link
// -------------------------

export function formatVideoResponse(
  result: VideoSearchResult,
    query: string,
      mode: Mode
      ): EngineResponse {
        const startLabel = formatTimestamp(result.startSeconds);
          const endLabel = formatTimestamp(result.endSeconds);

            const opener =
                mode === "study"
                      ? `Here is a relevant explanation for your question about "${query}":`
                            : `Here is a relevant video segment that addresses your question:`;

                              const content = [
                                  opener,
                                      "",
                                          result.segmentText,
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

                                                                                                    return {
                                                                                                        content,
                                                                                                            source: "video_knowledge",
                                                                                                                mode,
                                                                                                                    cached: false,
                                                                                                                        videoResult: result,
                                                                                                                          };
                                                                                                                          }
