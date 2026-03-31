// src/lib/basic/externalSearch.ts
// Solver fallback chain.
// Tries Wikipedia summary first (free),
// then Serper if tier allows.
// Returns a NIRA-formatted answer or null.

import { Mode, UserTier } from "@/types/chat";
import { canUseSource } from "@/lib/basic/sourcePolicy";

// -------------------------
// External search result
// -------------------------

export interface ExternalSearchResult {
  content: string;
  sourceUrl: string;
  sourceType: "wikipedia" | "serper";
  confidence: number;
}

// -------------------------
// Wikipedia summary fetch
// Uses the free Wikipedia REST API
// No key required
// -------------------------

async function fetchWikipediaSummary(
  query: string
): Promise<ExternalSearchResult | null> {
  try {
    const searchTerm = encodeURIComponent(
      query.trim().replace(/[^\w\s]/g, "").slice(0, 100)
    );

    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`;
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "NIRA-AI/1.0" },
    });

    if (!res.ok) {
      // Try search endpoint as fallback
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=1&format=json`,
        { headers: { "User-Agent": "NIRA-AI/1.0" } }
      );
      if (!searchRes.ok) return null;

      const searchData = await searchRes.json();
      const firstTitle = searchData[1]?.[0];
      if (!firstTitle) return null;

      const pageRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}`,
        { headers: { "User-Agent": "NIRA-AI/1.0" } }
      );
      if (!pageRes.ok) return null;

      const pageData = await pageRes.json();
      if (!pageData.extract || pageData.extract.length < 50) return null;

      return formatWikipediaResult(pageData, query);
    }

    const data = await res.json();
    if (!data.extract || data.extract.length < 50) return null;

    return formatWikipediaResult(data, query);
  } catch (err) {
    console.error("[NIRA EXTERNAL] Wikipedia fetch failed:", err);
    return null;
  }
}

function formatWikipediaResult(
  data: { title: string; extract: string; content_urls?: { desktop?: { page?: string } } },
  query: string
): ExternalSearchResult {
  // Take first 3 sentences for a concise summary
  const sentences = data.extract
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 20)
    .slice(0, 3)
    .join(" ");

  const content = `${sentences}

**Source:** Wikipedia — ${data.title}
**Next step:** Ask me to explain any specific part of this topic in more detail.`;

  return {
    content,
    sourceUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
    sourceType: "wikipedia",
    confidence: 60,
  };
}

// -------------------------
// Serper API search
// Only called for proPlus+
// -------------------------

async function fetchSerperResult(
  query: string,
  mode: Mode
): Promise<ExternalSearchResult | null> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.warn("[NIRA EXTERNAL] SERPER_API_KEY not set.");
    return null;
  }

  try {
    const context = mode === "study" ? "education academic" : "career professional";
    const searchQuery = `${query.trim()} ${context}`;

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        q: searchQuery,
        num: 3,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const results = data.organic ?? [];

    if (results.length === 0) return null;

    // Build a clean NIRA-style answer from top results
    const lines: string[] = [];

    if (data.answerBox?.answer) {
      lines.push(data.answerBox.answer);
      lines.push("");
    } else if (data.answerBox?.snippet) {
      lines.push(data.answerBox.snippet);
      lines.push("");
    }

    results.slice(0, 2).forEach((r: { title: string; snippet: string; link: string }, i: number) => {
      lines.push(`**${i + 1}. ${r.title}**`);
      lines.push(r.snippet ?? "");
      lines.push(`Source: ${r.link}`);
      lines.push("");
    });

    lines.push("**Next step:** Ask me to explain any part of this in more detail.");

    return {
      content: lines.join("\n"),
      sourceUrl: results[0]?.link ?? "https://google.com",
      sourceType: "serper",
      confidence: 70,
    };
  } catch (err) {
    console.error("[NIRA EXTERNAL] Serper fetch failed:", err);
    return null;
  }
}

// -------------------------
// Main external search entry
// Runs the fallback chain:
// 1. Wikipedia (free, always)
// 2. Serper (proPlus+ only)
// Returns null if nothing found
// -------------------------

export async function runExternalSearch(
  query: string,
  mode: Mode,
  tier: UserTier
): Promise<ExternalSearchResult | null> {
  // Step 1: Wikipedia — free for all tiers
  console.log("[NIRA EXTERNAL] Trying Wikipedia...");
  const wikiResult = await fetchWikipediaSummary(query);
  if (wikiResult) {
    console.log("[NIRA EXTERNAL] Wikipedia hit");
    return wikiResult;
  }

  // Step 2: Serper — proPlus and enterprise only
  if (canUseSource(tier, "search")) {
    console.log("[NIRA EXTERNAL] Trying Serper...");
    const serperResult = await fetchSerperResult(query, mode);
    if (serperResult) {
      console.log("[NIRA EXTERNAL] Serper hit");
      return serperResult;
    }
  }

  console.log("[NIRA EXTERNAL] No external result found");
  return null;
}
