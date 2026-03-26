// src/lib/basic/continuationDetector.ts
// Detects short follow-up replies and extracts the next topic
// from the previous assistant message context.

// -------------------------
// Continuation trigger words
// Short replies that signal the user
// wants NIRA to continue from context
// -------------------------

const CONTINUATION_TRIGGERS: string[] = [
  "yes",
  "yeah",
  "yep",
  "yea",
  "ok",
  "okay",
  "ok.",
  "okay.",
  "yes.",
  "sure",
  "continue",
  "next",
  "go on",
  "proceed",
  "go ahead",
  "explain more",
  "tell me more",
  "more",
  "show me",
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
  "i'd like to know",
];

// -------------------------
// Continuation detection result
// -------------------------

export interface ContinuationResult {
  isContinuation: boolean;
  effectiveQuery: string | null;
  source: "next_step" | "last_topic" | "none";
}

// -------------------------
// Check if a message is a
// continuation trigger
// -------------------------

function isContinuationTrigger(query: string): boolean {
  const normalized = query.trim().toLowerCase().replace(/[!?.]/g, "");
  return CONTINUATION_TRIGGERS.includes(normalized);
}

// -------------------------
// Extract the suggested next topic
// from a "Next step:" line in the
// last assistant message.
//
// Examples it extracts from:
// "**Next step:** Explain the first law of thermodynamics."
// "**Next step:** Try calculating magnetic force using F = BIL."
// "**Next step:** Learn about refraction of light."
// -------------------------

function extractNextStepTopic(assistantContent: string): string | null {
  const lines = assistantContent.split("\n");

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (lower.includes("next step")) {
      // Remove the "Next step:" prefix and markdown bold markers
      const cleaned = line
        .replace(/\*\*next step:\*\*/gi, "")
        .replace(/next step:/gi, "")
        .replace(/\*\*/g, "")
        .trim();

      // Only use if the extracted text is meaningful (more than a generic instruction)
      if (cleaned.length > 10) {
        return cleaned;
      }
    }
  }

  return null;
}

// -------------------------
// Extract the main topic from the
// last assistant message heading or
// first meaningful line.
// Used as fallback if no Next step
// line is found.
// -------------------------

function extractLastTopic(assistantContent: string): string | null {
  const lines = assistantContent
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 15);

  for (const line of lines) {
    // Skip lines that are just formatting
    if (line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line)) {
      continue;
    }

    // Prefer bold headings (likely the main topic)
    if (line.startsWith("**") && line.endsWith("**")) {
      const cleaned = line.replace(/\*\*/g, "").trim();
      if (cleaned.length > 5) return cleaned;
    }

    // Use the first real sentence as the topic
    const cleaned = line.replace(/\*\*/g, "").trim();
    if (cleaned.length > 15 && !cleaned.toLowerCase().startsWith("next step")) {
      // Truncate to first sentence
      const sentence = cleaned.split(/\.\s/)[0];
      return sentence.length > 10 ? sentence : null;
    }
  }

  return null;
}

// -------------------------
// Main continuation detector
//
// Takes the current user query and
// the full conversation messages array.
// Returns the effective query to use.
//
// If the user reply is a continuation
// trigger, we look at the last assistant
// message for what to continue with.
// -------------------------

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function detectContinuation(
  query: string,
  messages: ConversationMessage[]
): ContinuationResult {
  // Not a continuation trigger — treat as a fresh query
  if (!isContinuationTrigger(query)) {
    return {
      isContinuation: false,
      effectiveQuery: null,
      source: "none",
    };
  }

  // Find the last assistant message
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  if (assistantMessages.length === 0) {
    return {
      isContinuation: true,
      effectiveQuery: null,
      source: "none",
    };
  }

  const lastAssistant = assistantMessages[assistantMessages.length - 1];
  const content = lastAssistant.content;

  // Priority 1: Extract from "Next step:" line
  const nextStepTopic = extractNextStepTopic(content);
  if (nextStepTopic) {
    console.log(
      `[NIRA CONTINUATION] Detected follow-up. Using next step topic: "${nextStepTopic}"`
    );
    return {
      isContinuation: true,
      effectiveQuery: nextStepTopic,
      source: "next_step",
    };
  }

  // Priority 2: Extract main topic from last assistant message
  const lastTopic = extractLastTopic(content);
  if (lastTopic) {
    console.log(
      `[NIRA CONTINUATION] Detected follow-up. Using last topic: "${lastTopic}"`
    );
    return {
      isContinuation: true,
      effectiveQuery: lastTopic,
      source: "last_topic",
    };
  }

  // Continuation detected but no usable context found
  console.log(
    "[NIRA CONTINUATION] Continuation trigger detected but no usable prior context."
  );
  return {
    isContinuation: true,
    effectiveQuery: null,
    source: "none",
  };
}
