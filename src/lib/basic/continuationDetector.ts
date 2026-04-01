// src/lib/basic/continuationDetector.ts

// -------------------------
// Continuation trigger words
// Short follow-up commands that
// mean "continue from where you left off"
// -------------------------

const CONTINUATION_TRIGGERS: string[] = [
  "yes",
  "yeah",
  "yep",
  "yea",
  "ok",
  "okay",
  "sure",
  "continue",
  "next",
  "go on",
  "proceed",
  "go ahead",
  "more",
  "please continue",
  "please go on",
  "keep going",
  "carry on",
  "do it",
  "yes please",
  "please",
  "let's go",
  "lets go",
  "i want to know",
  "id like to know",
  "alright",
  "right",
  "got it",
  "understood",
];

// -------------------------
// Expansion trigger phrases
// These mean "expand the most
// recent topic in more detail"
// Treated as a separate type
// from generic continuation
// -------------------------

const EXPANSION_TRIGGERS: string[] = [
  "explain in more details",
  "explain in more detail",
  "explain more",
  "explain this more",
  "go deeper",
  "go deeper into this",
  "expand this",
  "expand on this",
  "tell me more about this",
  "more details",
  "more detail",
  "give me more details",
  "elaborate",
  "elaborate more",
  "elaborate on this",
  "expand this topic",
  "explain any specific part",
  "explain any specific part of this topic",
  "explain further",
  "further explanation",
  "go into more detail",
  "i want more detail",
  "break this down more",
  "break it down more",
  "can you expand",
  "can you explain more",
  "could you explain more",
  "what else",
  "tell me more",
  "deeper explanation",
  "more in depth",
  "in more depth",
  "go in depth",
];

// -------------------------
// Next-step line prefixes
// -------------------------

const NEXT_STEP_PREFIXES = [
  "**next step:**",
  "**next topic:**",
  "**next question:**",
  "next step:",
  "next topic:",
  "next question:",
];

// -------------------------
// Continuation result
// source distinguishes type:
// - "next_step": extracted from Next step line
// - "expansion": user wants more on the current topic
// - "last_topic": extracted from last reply body
// - "none": no usable context
// -------------------------

export interface ContinuationResult {
  isContinuation: boolean;
  isExpansion: boolean;
  effectiveQuery: string | null;
  source: "next_step" | "expansion" | "last_topic" | "none";
}

// -------------------------
// Check if a message is a
// continuation trigger
// -------------------------

function isContinuationTrigger(query: string): boolean {
  const normalized = query
    .trim()
    .toLowerCase()
    .replace(/[!?.'"]/g, "")
    .trim();
  return CONTINUATION_TRIGGERS.includes(normalized);
}

// -------------------------
// Check if a message is an
// expansion request
// -------------------------

function isExpansionRequest(query: string): boolean {
  const normalized = query.trim().toLowerCase();
  return EXPANSION_TRIGGERS.some((trigger) =>
    normalized.includes(trigger)
  );
}

// -------------------------
// Extract the FULL next-step text
// from the MOST RECENT assistant message
// -------------------------

function extractNextStepTopic(assistantContent: string): string | null {
  const lines = assistantContent.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    for (const prefix of NEXT_STEP_PREFIXES) {
      if (lower.startsWith(prefix)) {
        const afterPrefix = trimmed
          .slice(prefix.length)
          .replace(/\*\*/g, "")
          .trim();
        if (afterPrefix.length > 8) return afterPrefix;
      }
    }
  }

  // Two-line format
  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i]
      .trim()
      .toLowerCase()
      .replace(/\*\*/g, "")
      .trim();

    if (
      current === "next step:" ||
      current === "next topic:" ||
      current === "next question:"
    ) {
      const nextLine = lines[i + 1].trim().replace(/\*\*/g, "");
      if (nextLine.length > 8) return nextLine;
    }
  }

  return null;
}

// -------------------------
// Extract the main topic from
// the MOST RECENT assistant message.
// Used for expansion and fallback.
//
// Returns the first meaningful
// heading or sentence — never
// a next-step line.
// -------------------------

function extractMainTopic(assistantContent: string): string | null {
  const lines = assistantContent
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10);

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Skip next-step lines
    if (NEXT_STEP_PREFIXES.some((p) => lower.startsWith(p))) continue;

    // Skip bullets
    if (line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line)) {
      continue;
    }

    // Skip source attribution lines
    if (lower.startsWith("source:") || lower.startsWith("**source:**")) continue;

    // Prefer bold headings — they identify the topic
    if (line.startsWith("**") && line.endsWith("**") && line.length > 6) {
      const cleaned = line.replace(/\*\*/g, "").trim();
      if (cleaned.length > 5) return cleaned;
    }

    // First real sentence
    const cleaned = line.replace(/\*\*/g, "").trim();
    if (cleaned.length > 20) {
      const sentence = cleaned.split(/\.\s/)[0];
      return sentence.length > 10 ? sentence : null;
    }
  }

  return null;
}

// -------------------------
// Build expansion query
// For expansion requests, we prepend
// "Explain in more detail: <topic>"
// so the engine treats it as an
// explanation query on the exact topic
// -------------------------

function buildExpansionQuery(topic: string): string {
  return `Explain in more detail: ${topic}`;
}

// -------------------------
// Main continuation detector
//
// IMPORTANT RULES:
// 1. Always use ONLY the most recent
//    assistant message — never older turns
// 2. Expansion returns the most recent
//    topic wrapped in an explain query
// 3. Generic continuation returns the
//    next-step text if available,
//    otherwise the main topic
// 4. Never mix context from different turns
// -------------------------

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function detectContinuation(
  query: string,
  messages: ConversationMessage[]
): ContinuationResult {

  const isExpansion = isExpansionRequest(query);
  const isContinuation = isExpansion || isContinuationTrigger(query);

  if (!isContinuation) {
    return {
      isContinuation: false,
      isExpansion: false,
      effectiveQuery: null,
      source: "none",
    };
  }

  // Get ONLY the most recent assistant message
  // Filter from the end to ensure freshness
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  if (assistantMessages.length === 0) {
    return {
      isContinuation: true,
      isExpansion,
      effectiveQuery: null,
      source: "none",
    };
  }

  // CRITICAL: Use only the LAST assistant message
  // Never iterate backwards through multiple turns
  const lastAssistant = assistantMessages[assistantMessages.length - 1];
  const content = lastAssistant.content;

  // For expansion requests: extract main topic and build explain query
  if (isExpansion) {
    const mainTopic = extractMainTopic(content);
    if (mainTopic) {
      const expansionQuery = buildExpansionQuery(mainTopic);
      console.log(
        `[NIRA CONTINUATION] Expansion detected: "${query}" → "${expansionQuery}"`
      );
      return {
        isContinuation: true,
        isExpansion: true,
        effectiveQuery: expansionQuery,
        source: "expansion",
      };
    }

    // Fallback: try next-step line for expansion context
    const nextStep = extractNextStepTopic(content);
    if (nextStep) {
      return {
        isContinuation: true,
        isExpansion: true,
        effectiveQuery: buildExpansionQuery(nextStep),
        source: "expansion",
      };
    }

    return {
      isContinuation: true,
      isExpansion: true,
      effectiveQuery: null,
      source: "none",
    };
  }

  // For generic continuation: try next-step line first
  const nextStepTopic = extractNextStepTopic(content);
  if (nextStepTopic) {
    console.log(
      `[NIRA CONTINUATION] Next-step extracted: "${nextStepTopic}"`
    );
    return {
      isContinuation: true,
      isExpansion: false,
      effectiveQuery: nextStepTopic,
      source: "next_step",
    };
  }

  // Generic continuation fallback: use main topic from last reply
  const lastTopic = extractMainTopic(content);
  if (lastTopic) {
    console.log(
      `[NIRA CONTINUATION] Last topic extracted: "${lastTopic}"`
    );
    return {
      isContinuation: true,
      isExpansion: false,
      effectiveQuery: lastTopic,
      source: "last_topic",
    };
  }

  console.log("[NIRA CONTINUATION] No usable context in most recent message.");
  return {
    isContinuation: true,
    isExpansion: false,
    effectiveQuery: null,
    source: "none",
  };
}
