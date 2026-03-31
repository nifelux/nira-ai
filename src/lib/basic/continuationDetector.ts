// src/lib/basic/continuationDetector.ts
// Resolves short follow-up commands into the
// full active query from prior assistant context.

// -------------------------
// Continuation trigger words
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
  "id like to know",
  "alright",
  "right",
  "got it",
  "understood",
];

// -------------------------
// Next-step line prefixes
// Lines in the assistant reply
// that contain the next action
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
// -------------------------

export interface ContinuationResult {
  isContinuation: boolean;
  effectiveQuery: string | null;
  source: "next_step" | "last_topic" | "none";
}

// -------------------------
// Check if message is a
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
// Extract FULL next-step text
// from last assistant message.
//
// Returns everything after the
// next-step prefix on that line —
// preserving embedded calculations,
// topic names, and instructions
// in their entirety.
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

        if (afterPrefix.length > 8) {
          return afterPrefix;
        }
      }
    }
  }

  // Handle two-line format: label on one line, content on next
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
      if (nextLine.length > 8) {
        return nextLine;
      }
    }
  }

  return null;
}

// -------------------------
// Extract main topic from
// last assistant message.
// Used when no explicit next-step
// line is found.
// -------------------------

function extractLastTopic(assistantContent: string): string | null {
  const lines = assistantContent
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 15);

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Skip next-step lines already handled
    if (NEXT_STEP_PREFIXES.some((p) => lower.startsWith(p))) continue;

    // Skip bullets and numbered items
    if (
      line.startsWith("-") ||
      line.startsWith("•") ||
      /^\d+\./.test(line)
    ) continue;

    // Prefer bold headings
    if (line.startsWith("**") && line.endsWith("**")) {
      const cleaned = line.replace(/\*\*/g, "").trim();
      if (cleaned.length > 5) return cleaned;
    }

    // First real meaningful sentence
    const cleaned = line.replace(/\*\*/g, "").trim();
    if (cleaned.length > 15) {
      const sentence = cleaned.split(/\.\s/)[0];
      return sentence.length > 10 ? sentence : null;
    }
  }

  return null;
}

// -------------------------
// Main continuation detector
// -------------------------

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function detectContinuation(
  query: string,
  messages: ConversationMessage[]
): ContinuationResult {

  if (!isContinuationTrigger(query)) {
    return { isContinuation: false, effectiveQuery: null, source: "none" };
  }

  // Find the last assistant message
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  if (assistantMessages.length === 0) {
    return { isContinuation: true, effectiveQuery: null, source: "none" };
  }

  const lastAssistant = assistantMessages[assistantMessages.length - 1];
  const content = lastAssistant.content;

  // Priority 1: Extract full next-step line
  const nextStepTopic = extractNextStepTopic(content);
  if (nextStepTopic) {
    console.log(`[NIRA CONTINUATION] Next-step extracted: "${nextStepTopic}"`);
    return {
      isContinuation: true,
      effectiveQuery: nextStepTopic,
      source: "next_step",
    };
  }

  // Priority 2: Extract main topic from last reply
  const lastTopic = extractLastTopic(content);
  if (lastTopic) {
    console.log(`[NIRA CONTINUATION] Last topic extracted: "${lastTopic}"`);
    return {
      isContinuation: true,
      effectiveQuery: lastTopic,
      source: "last_topic",
    };
  }

  console.log("[NIRA CONTINUATION] No usable prior context found.");
  return { isContinuation: true, effectiveQuery: null, source: "none" };
}
