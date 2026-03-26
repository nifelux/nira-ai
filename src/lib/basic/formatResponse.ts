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
// -------------------------

function extractCoreSummary(raw: string): string {
  const lines = raw.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (
      line.length > 30 &&
      !line.startsWith("**") &&
      !line.startsWith("-") &&
      !line.startsWith("#") &&
      !line.startsWith("Next step")
    ) {
      const sentence = line.split(/\.\s/)[0];
      return sentence.replace(/\*\*/g, "").trim();
    }
  }
  return "";
}

// -------------------------
// Extract bullet / numbered
// list lines from raw content
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
// -------------------------

function extractNextStep(raw: string): string | null {
  const lines = raw.split("\n");
  for (const line of lines) {
    if (line.toLowerCase().includes("next step")) {
      return line
        .replace(/\*\*next step:\*\*/i, "")
        .replace(/next step:/i, "")
        .trim();
    }
  }
  return null;
}

// -------------------------
// Build a natural opener
// based on user message and mode
// No robotic prefixes
// -------------------------

function buildNaturalOpener(userMessage: string, mode: Mode): string {
  const normalized = userMessage.trim().toLowerCase();

  if (mode === "study") {
    if (
      normalized.startsWith("what is") ||
      normalized.startsWith("what are") ||
      normalized.startsWith("define") ||
      normalized.startsWith("meaning of")
    ) {
      return null as unknown as string; // Let the summary lead — no opener needed
    }
    if (normalized.startsWith("how")) {
      return "Let's break this down step by step.";
    }
    if (normalized.includes("explain")) {
      return "Here is a clear explanation:";
    }
    if (normalized.includes("tips") || normalized.includes("advice")) {
      return "These are the strategies that actually work:";
    }
    if (normalized.includes("difference")) {
      return "Here is how to tell them apart:";
    }
    return null as unknown as string;
  }

  if (mode === "career") {
    if (normalized.startsWith("how")) {
      return "Here is a step-by-step approach:";
    }
    if (
      normalized.includes("write") ||
      normalized.includes("create") ||
      normalized.includes("build")
    ) {
      return "Here is how to do this properly:";
    }
    if (normalized.includes("tips") || normalized.includes("advice")) {
      return "These are the strategies that produce real results:";
    }
    if (normalized.includes("difference")) {
      return "Here is how to tell them apart:";
    }
    return null as unknown as string;
  }

  return null as unknown as string;
}

// -------------------------
// Study Mode formatter
// Natural tutor-like explanation
// Summary leads, then structure
// -------------------------

function formatForStudyMode(
  entry: KnowledgeEntry,
  userMessage: string
): string {
  const raw = entry.answer;
  const opener = buildNaturalOpener(userMessage, "study");
  const listItems = extractListItems(raw);
  const headings = extractHeadings(raw);
  const nextStep = extractNextStep(raw);
  const summary = extractCoreSummary(raw);

  const lines: string[] = [];

  // Lead with summary — no robotic prefix
  if (summary) {
    lines.push(summary + ".");
    lines.push("");
  }

  // Opener only if we have one and a summary already anchors the response
  if (opener && summary) {
    lines.push(opener);
    lines.push("");
  }

  // Rebuild sections from headings + items
  if (headings.length > 0 && listItems.length > 0) {
    const itemsPerSection = Math.ceil(listItems.length / headings.length);

    headings.slice(0, 4).forEach((heading, i) => {
      const sectionItems = listItems.slice(
        i * itemsPerSection,
        (i + 1) * itemsPerSection
      );
      if (sectionItems.length > 0) {
        lines.push(`**${heading}**`);
        sectionItems.forEach((item) => lines.push(`- ${item}`));
        lines.push("");
      }
    });
  } else if (listItems.length > 0) {
    listItems.slice(0, 6).forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
    lines.push("");
  }

  // Next step
  if (nextStep) {
    lines.push(`**Next step:** ${nextStep}`);
  } else {
    lines.push(
      "**Next step:** Apply one of the points above in your next study session."
    );
  }

  return lines.join("\n");
}

// -------------------------
// Career Mode formatter
// Natural mentor-like advice
// Actionable and direct
// -------------------------

function formatForCareerMode(
  entry: KnowledgeEntry,
  userMessage: string
): string {
  const raw = entry.answer;
  const opener = buildNaturalOpener(userMessage, "career");
  const listItems = extractListItems(raw);
  const headings = extractHeadings(raw);
  const nextStep = extractNextStep(raw);
  const summary = extractCoreSummary(raw);

  const lines: string[] = [];

  // Lead with summary
  if (summary) {
    lines.push(summary + ".");
    lines.push("");
  }

  // Opener only when it adds direction
  if (opener && summary) {
    lines.push(opener);
    lines.push("");
  }

  // Rebuild sections
  if (headings.length > 0 && listItems.length > 0) {
    const itemsPerSection = Math.ceil(listItems.length / headings.length);

    headings.slice(0, 4).forEach((heading, i) => {
      const sectionItems = listItems.slice(
        i * itemsPerSection,
        (i + 1) * itemsPerSection
      );
      if (sectionItems.length > 0) {
        lines.push(`**${heading}**`);
        sectionItems.forEach((item) => lines.push(`- ${item}`));
        lines.push("");
      }
    });
  } else if (listItems.length > 0) {
    listItems.slice(0, 6).forEach((item, i) => {
      lines.push(`${i + 1}. ${item}`);
    });
    lines.push("");
  }

  // Next step
  if (nextStep) {
    lines.push(`**Next step:** ${nextStep}`);
  } else {
    lines.push(
      "**Next step:** Pick the most relevant action above and complete it within 24 hours."
    );
  }

  return lines.join("\n");
}

// -------------------------
// Main formatter entry point
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

  return { content, mode };
}
