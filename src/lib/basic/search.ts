// src/lib/basic/search.ts

import { SearchResponse, SearchResult } from "@/types/chat";

// -------------------------
// Search config
// -------------------------

const SEARCH_API_URL = "https://api.search.brave.com/res/v1/web/search";
const SEARCH_API_KEY = process.env.BRAVE_SEARCH_API_KEY || "";
const MAX_RESULTS = 3;
const DAILY_QUOTA_LIMIT = 2000; // Brave free tier: 2000 queries/month

// -------------------------
// In-memory quota tracker
// Resets when the serverless instance restarts
// Phase 2: move this to Supabase for persistent tracking
// -------------------------

let quotaUsed = 0;
let quotaResetDate = getTodayString();

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function checkAndResetQuota(): void {
  const today = getTodayString();
  if (today !== quotaResetDate) {
    quotaUsed = 0;
    quotaResetDate = today;
  }
}

function isQuotaExhausted(): boolean {
  checkAndResetQuota();
  return quotaUsed >= DAILY_QUOTA_LIMIT;
}

function incrementQuota(): void {
  quotaUsed += 1;
}

export function getQuotaStats(): {
  used: number;
  limit: number;
  exhausted: boolean;
  resetDate: string;
} {
  checkAndResetQuota();
  return {
    used: quotaUsed,
    limit: DAILY_QUOTA_LIMIT,
    exhausted: isQuotaExhausted(),
    resetDate: quotaResetDate,
  };
}

// -------------------------
// Build a clean search query
// from user message + mode context
// -------------------------

function buildSearchQuery(query: string, mode: "study" | "career"): string {
  const context = mode === "study" ? "education learning" : "career professional";
  const cleaned = query.trim().replace(/[^\w\s]/gi, "").slice(0, 100);
  return `${cleaned} ${context}`;
}

// -------------------------
// Parse raw Brave API results
// into clean SearchResult array
// -------------------------

interface BraveWebResult {
  title?: string;
  description?: string;
  url?: string;
}

interface BraveApiResponse {
  web?: {
    results?: BraveWebResult[];
  };
}

function parseResults(raw: BraveApiResponse): SearchResult[] {
  const results = raw?.web?.results || [];

  return results
    .slice(0, MAX_RESULTS)
    .map((item: BraveWebResult) => ({
      title: item.title || "Untitled",
      snippet: item.description || "",
      url: item.url || "",
    }))
    .filter((item: SearchResult) => item.snippet.length > 0);
}

// -------------------------
// Format search results into
// a clean readable response string
// -------------------------

export function formatSearchResults(
  results: SearchResult[],
  query: string
): string {
  if (results.length === 0) return "";

  const lines: string[] = [
    `Here is what I found about "${query}":`,
    "",
  ];

  results.forEach((result, index) => {
    lines.push(`**${index + 1}. ${result.title}**`);
    lines.push(result.snippet);
    lines.push(`Source: ${result.url}`);
    lines.push("");
  });

  lines.push("**Next step:** Visit the sources above to explore this topic further.");

  return lines.join("\n");
}

// -------------------------
// Main search function
// -------------------------

export async function performSearch(
  query: string,
  mode: "study" | "career"
): Promise<SearchResponse> {
  // --- Check quota before making any API call ---
  if (isQuotaExhausted()) {
    return {
      success: false,
      results: [],
      exhausted: true,
    };
  }

  // --- Check API key is configured ---
  if (!SEARCH_API_KEY) {
    console.warn("[NIRA SEARCH] BRAVE_SEARCH_API_KEY is not set.");
    return {
      success: false,
      results: [],
      exhausted: false,
    };
  }

  try {
    const searchQuery = buildSearchQuery(query, mode);

    const url = new URL(SEARCH_API_URL);
    url.searchParams.set("q", searchQuery);
    url.searchParams.set("count", String(MAX_RESULTS));
    url.searchParams.set("safesearch", "strict");
    url.searchParams.set("text_decorations", "false");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": SEARCH_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(
        `[NIRA SEARCH] Brave API error: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        results: [],
        exhausted: false,
      };
    }

    const raw: BraveApiResponse = await response.json();
    const results = parseResults(raw);

    // --- Only increment quota on a successful call ---
    incrementQuota();

    return {
      success: true,
      results,
      exhausted: false,
    };
  } catch (error) {
    console.error("[NIRA SEARCH] Search request failed:", error);
    return {
      success: false,
      results: [],
      exhausted: false,
    };
  }
}
