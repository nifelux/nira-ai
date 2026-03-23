// src/lib/basic/formatResponse.ts

import { KnowledgeEntry, Mode } from "@/types/chat";

// -------------------------
// Formatted response shape
// -------------------------

export interface FormattedResponse {
  content: string;
  mode: Mode;
}

// -------------------------
// Extract the first meaningful
// sentence from raw KB content
// Used to build a dynamic opener
// -------------------------

function extractCoreSummary(raw: string): string {
  // Pull the first non-empty, non-heading line as a summary seed
  const lines = raw.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (
      line.length > 30 &&
      !line.startsWith("**") &&
      !line.startsWith("-") &&
      !line.startsWith("#")
    ) {
      // Truncate to first sentence if long
      const sentence = line.split(/\.\s/)[0];
      return sentence.replace(/\*\*/g, "").trim();
    }
  }
  return "";
}

// -------------------------
// Extract all bullet / numbered
// list lines from raw KB content
// -------------------------

function extractListItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l.startsWith("- ") ||
        l.startsWith("• ") ||
        /^\d+\.\s/.test(l)
    )
    .map((l) => l.replace(/^[-•]\s/, "").replace(/^\d+\.\s/, "").trim())
    .filter((l) => l.length > 0);
}

// -------------------------
// Extract section headings
// from raw KB content
// -------------------------

function extractHeadings(raw: string): string[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("**") && l.endsWith("**") && l.length > 4)
    .map((l) => l.replace(/\*\*/g, "").trim());
}

// -------------------------
// Extract the "Next step" line
// from raw KB content if present
// -------------------------

function extractNextStep(raw: string): string | null {
  const lines = raw.split("\n");
  for (const line of lines) {
    if (line.toLowerCase().includes("next step")) {
      return line.replace(/\*\*next step:\*\*/i, "").trim();
    }
  }
  return null;
}

// -------------------------
// Build a dynamic contextual opener
// based on user message and mode
// Makes the response feel addressed
// to the specific question asked
// -------------------------

function buildOpener(userMessage: string, mode: Mode): string {
  const normalized = userMessage.trim().toLowerCase();

  if (mode === "study") {
    if (normalized.includes("how")) {
      return "Here is a clear breakdown to help you with this:";
    }
    if (normalized.includes("what")) {
      return "Here is what you need to know about this topic:";
    }
    if (normalized.includes("explain") || normalized.includes("tell me")) {
      return "Let me break this down step by step:";
    }
    if (normalized.includes("tips") || normalized.includes("advice")) {
      return "Here are the most effective strategies for this:";
    }
    if (normalized.includes("help")) {
      return "Here is a structured approach to help you with this:";
    }
    return "Here is a clear and practical breakdown:";
  }

  if (mode === "career") {
    if (normalized.includes("how")) {
      return "Here is a practical step-by-step approach:";
    }
    if (normalized.includes("what")) {
      return "Here is what you need to know to move forward:";
    }
    if (normalized.includes("tips") || normalized.includes("advice")) {
      return "Here are the strategies that produce real results:";
    }
    if (normalized.includes("help")) {
      return "Here is a focused action plan for your situation:";
    }
    if (normalized.includes("write") || normalized.includes("create") || normalized.includes("build")) {
      return "Here is how to approach this the right way:";
    }
    return "Here is the practical guidance you need:";
  }

  return "Here is what will help you most:";
}

// -------------------------
// Study Mode formatter
// Tutor-like: clear structure,
// simplified language, step-by-step
// -------------------------

function formatForStudyMode(
  entry: KnowledgeEntry,
  userMessage: string
): string {
  const raw = entry.answer;
  const opener = buildOpener(userMessage, "study");
  const listItems = extractListItems(raw);
  const headings = extractHeadings(raw);
  const nextStep = extractNextStep(raw);
  const summary = extractCoreSummary(raw);

  const lines: string[] = [];

  // Opener
  lines.push(opener);
  lines.push("");

  // Summary sentence if available
  if (summary) {
    lines.push(summary + ".");
    lines.push("");
  }

  // Rebuild sections from headings + list items
  if (headings.length > 0 && listItems.length > 0) {
    // Distribute list items under headings proportionally
    const itemsPerSection = Math.ceil(listItems.length / headings.length);

    headings.slice(0, 4).forEach((heading, i) => {
      const sectionItems = listItems.slice(
        i * itemsPerSection,
        (i + 1) * itemsPerSection
      );

      if (sectionItems.length > 0) {
        lines.push(`**${heading}**`);
        sectionItems.forEach((item) => {
          lines.push(`- ${item}`);
        });
        lines.push("");
      }
    });
  } else if (listItems.length > 0) {
    // No headings — just output structured bullets
    lines.push("**Key points to understand:**");
    listItems.slice(0, 6).forEach((item) => {
      lines.push(`- ${item}`);
    });
    lines.push("");
  }

  // Next step
  if (nextStep) {
    lines.push(`**Next step:** ${nextStep}`);
  } else {
    lines.push("**Next step:** Apply one of the points above in your very next study session and observe the difference.");
  }

  return lines.join("\n");
}

// -------------------------
// Career Mode formatter
// Mentor-like: practical, direct,
// action-oriented with concrete steps
// -------------------------

function formatForCareerMode(
  entry: KnowledgeEntry,
  userMessage: string
): string {
  const raw = entry.answer;
  const opener = buildOpener(userMessage, "career");
  const listItems = extractListItems(raw);
  const headings = extractHeadings(raw);
  const nextStep = extractNextStep(raw);
  const summary = extractCoreSummary(raw);

  const lines: string[] = [];

  // Opener
  lines.push(opener);
  lines.push("");

  // Summary sentence if available
  if (summary) {
    lines.push(summary + ".");
    lines.push("");
  }

  // Rebuild sections from headings + list items
  if (headings.length > 0 && listItems.length > 0) {
    const itemsPerSection = Math.ceil(listItems.length / headings.length);

    headings.slice(0, 4).forEach((heading, i) => {
      const sectionItems = listItems.slice(
        i * itemsPerSection,
        (i + 1) * itemsPerSection
      );

      if (sectionItems.length > 0) {
        lines.push(`**${heading}**`);
        sectionItems.forEach((item) => {
          lines.push(`- ${item}`);
        });
        lines.push("");
      }
    });
  } else if (listItems.length > 0) {
    // No headings — output as numbered action steps
    lines.push("**Action steps:**");
    listItems.slice(0, 6).forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
    lines.push("");
  }

  // Next step
  if (nextStep) {
    lines.push(`**Next step:** ${nextStep}`);
  } else {
    lines.push("**Next step:** Pick the most relevant action above and complete it within the next 24 hours.");
  }

  return lines.join("\n");
}

// -------------------------
// Main formatter entry point
// Routes to the correct formatter
// based on mode
// -------------------------

export function formatKnowledgeBaseResponse(
  entry: KnowledgeEntry,
  mode: Mode,
  userMessage: string
): FormattedResponse {
  const content =
    mode === "study"
      ? formatForStudyMode(entry, userMessage)
      : formatForCareerMode(entry, userMessage);

  return {
    content,
    mode,
  };
}
