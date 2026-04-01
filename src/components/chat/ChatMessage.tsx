// src/components/chat/ChatMessage.tsx

"use client";

import { useState } from "react";
import { Message } from "@/types/chat";
import { VIDEO_RESPONSE_MARKER } from "@/lib/basic/formatVideoResponse";

interface ChatMessageProps {
  message: Message;
}

interface VideoBlockData {
  embedUrl: string;
  watchUrl: string;
  title: string;
  startLabel: string;
  endLabel: string;
}

// -------------------------
// YouTube embed with error handling
// If the embed fails (error 153,
// embedding disabled, or any player
// error) the iframe is hidden and
// a clean watch link is shown instead
// -------------------------

function VideoBlock({ data }: { data: VideoBlockData }) {
  const [embedFailed, setEmbedFailed] = useState(false);

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
      {!embedFailed ? (
        <>
          {/* Responsive 16:9 embed */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={data.embedUrl}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-t-xl"
              onError={() => setEmbedFailed(true)}
              // Detect player errors via postMessage
              ref={(iframe) => {
                if (!iframe) return;
                const handler = (e: MessageEvent) => {
                  try {
                    const data = typeof e.data === "string"
                      ? JSON.parse(e.data)
                      : e.data;
                    // YouTube sends error codes via postMessage
                    if (data?.event === "onError" || data?.info === 150 || data?.info === 153) {
                      setEmbedFailed(true);
                    }
                  } catch {
                    // ignore parse errors
                  }
                };
                window.addEventListener("message", handler);
                // Cleanup is handled by React's ref lifecycle
              }}
            />
          </div>

          <div className="px-3 py-2 flex items-center justify-between gap-2">
            <p className="text-xs text-gray-500 truncate">
              ⏱ {data.startLabel} – {data.endLabel}
            </p>
            <a
              href={data.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-violet-600 hover:text-violet-800 hover:underline whitespace-nowrap transition-colors"
            >
              Watch on YouTube ↗
            </a>
          </div>
        </>
      ) : (
        // Clean fallback when embed fails
        <div className="px-4 py-4 flex flex-col gap-2">
          <p className="text-sm text-gray-600">
            📹 <span className="font-medium">{data.title}</span>
          </p>
          <p className="text-xs text-gray-400">⏱ {data.startLabel} – {data.endLabel}</p>
          <a
            href={data.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-800 hover:underline transition-colors"
          >
            Watch on YouTube ↗
          </a>
          <p className="text-xs text-gray-400">
            (Embedded player unavailable for this video)
          </p>
        </div>
      )}
    </div>
  );
}

// -------------------------
// Parse assistant message content
// into text and video block parts
// -------------------------

interface ContentPart {
  type: "text" | "video";
  text?: string;
  videoData?: VideoBlockData;
}

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const segments = content.split(VIDEO_RESPONSE_MARKER);

  segments.forEach((segment, index) => {
    if (index === 0) {
      if (segment.trim()) {
        parts.push({ type: "text", text: segment });
      }
      return;
    }

    const newlineIndex = segment.indexOf("\n");
    const jsonStr = newlineIndex !== -1
      ? segment.slice(0, newlineIndex)
      : segment;
    const remainder = newlineIndex !== -1
      ? segment.slice(newlineIndex + 1)
      : "";

    try {
      const videoData: VideoBlockData = JSON.parse(jsonStr);
      parts.push({ type: "video", videoData });
    } catch {
      parts.push({ type: "text", text: jsonStr });
    }

    if (remainder.trim()) {
      parts.push({ type: "text", text: remainder });
    }
  });

  return parts;
}

// -------------------------
// Lightweight markdown formatter
// -------------------------

function formatContent(content: string): React.ReactNode {
  const lines = content.split("\n");

  return lines.map((line, index) => {
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      return (
        <p key={index} className="font-semibold text-gray-900 mt-3 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }

    if (/^\d+\.\s/.test(line)) {
      return (
        <p key={index} className="flex gap-2 my-1">
          <span className="font-semibold text-violet-600 shrink-0">
            {line.match(/^\d+\./)?.[0]}
          </span>
          <span>{line.replace(/^\d+\.\s/, "")}</span>
        </p>
      );
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      return (
        <p key={index} className="flex gap-2 my-1">
          <span className="text-violet-400 shrink-0 mt-0.5">•</span>
          <span>{line.replace(/^[-•]\s/, "")}</span>
        </p>
      );
    }

    if (line.includes("**")) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={index} className="my-1">
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} className="font-semibold text-gray-900">
                {part.replace(/\*\*/g, "")}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      );
    }

    if (line.trim() === "") return <div key={index} className="h-1" />;

    return (
      <p key={index} className="my-1 leading-relaxed">
        {line}
      </p>
    );
  });
}

// -------------------------
// Main ChatMessage component
// -------------------------

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold mr-3 mt-1">
          N
        </div>
      )}

      <div
        className={`
          max-w-[75%] px-4 py-3 rounded-2xl text-sm
          ${isUser
            ? "bg-violet-600 text-white rounded-tr-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
          }
        `}
      >
        {isUser ? (
          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="space-y-0.5">
            {parseContent(message.content).map((part, i) => {
              if (part.type === "video" && part.videoData) {
                return <VideoBlock key={i} data={part.videoData} />;
              }
              return (
                <div key={i}>{formatContent(part.text || "")}</div>
              );
            })}
          </div>
        )}

        <p className={`text-xs mt-2 ${isUser ? "text-violet-200 text-right" : "text-gray-400"}`}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold ml-3 mt-1">
          U
        </div>
      )}
    </div>
  );
}
