// src/lib/basic/continuationDetector.ts
// Detects short follow-up replies and extracts the complete
// next-step text from the previous assistant message.

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
];

// -------------------------
// Next-step line prefixes
// These mark lines that contain
// the next action or question NIRA
// suggested at the end of a reply
// -------------------------

const NEXT_STEP_PREFIXES = [
  "next step:",
  "next topic:",
  "next question:",
  "**next step:**",
  "**next topic:**",
  "**next question:**",
];

// -------------------------
// Continuation result shape
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
  const normalized = query
    .trim()
    .toLowerCase()
    .replace(/[!?.'"]/g, "")
    .trim();
  return CONTINUATION_TRIGGERS.includes(normalized);
}

// -------------------------
// Extract the FULL next-step text
// from the last assistant message.
//
// Key fix: returns the COMPLETE line
// after the next-step prefix — not just
// the first sentence. This ensures
// embedded calculation problems like:
// "A wave of frequency 250 Hz has a
//  wavelength of 1.4 m. Calculate
//  the wave speed."
// are extracted in full and routed
// to the solver correctly.
// -------------------------

function extractNextStepTopic(assistantContent: string): string | null {
  const lines = assistantContent.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    for (const prefix of NEXT_STEP_PREFIXES) {
      if (lower.startsWith(prefix)) {
        // Extract everything after the prefix — full text preserved
        const afterPrefix = trimmed
          .slice(prefix.length)
          .replace(/\*\*/g, "")
          .trim();

        // Only use if there is meaningful content
        if (afterPrefix.length > 8) {
          return afterPrefix;
        }
      }
    }
  }

  // Also check for multi-line next-step blocks
  // where the label and content span two lines
  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i].trim().toLowerCase().replace(/\*\*/g, "");

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
// Extract the main topic from
// the last assistant message.
// Used as fallback when no explicit
// next-step line is found.
// -------------------------

function extractLastTopic(assistantContent: string): string | null {
  const lines = assistantContent
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 15);

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Skip next-step lines (already handled above)
    if (NEXT_STEP_PREFIXES.some((p) => lower.startsWith(p))) continue;

    // Skip pure bullet/numbered items
    if (line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line)) {
      continue;
    }

    // Prefer bold headings
    if (line.startsWith("**") && line.endsWith("**")) {
      const cleaned = line.replace(/\*\*/g, "").trim();
      if (cleaned.length > 5) return cleaned;
    }

    // First real sentence
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
    console.log(
      `[NIRA CONTINUATION] Next-step extracted: "${nextStepTopic}"`
    );
    return {
      isContinuation: true,
      effectiveQuery: nextStepTopic,
      source: "next_step",
    };
  }

  // Priority 2: Extract main topic from last message
  const lastTopic = extractLastTopic(content);
  if (lastTopic) {
    console.log(
      `[NIRA CONTINUATION] Last topic extracted: "${lastTopic}"`
    );
    return {
      isContinuation: true,
      effectiveQuery: lastTopic,
      source: "last_topic",
    };
  }

  console.log("[NIRA CONTINUATION] No usable prior context found.");
  return { isContinuation: true, effectiveQuery: null, source: "none" };
}
