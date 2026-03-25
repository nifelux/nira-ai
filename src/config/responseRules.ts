// src/config/responseRules.ts

import { Intent } from "@/lib/basic/intents";
import { EngineSource, Mode } from "@/types/chat";

// -------------------------
// Response priority order
// Defines the sequence the engine
// follows to resolve every request
// -------------------------

export const RESPONSE_PRIORITY_ORDER: EngineSource[] = [
  "knowledge_base", // intent responses use source: knowledge_base
  "cache",
  "knowledge_base",
  "video_knowledge",
  "search",
  "fallback",
];

export const RESPONSE_PRIORITY_LABELS: Record<EngineSource, string> = {
  knowledge_base: "Intent or Knowledge Base",
  cache: "Cached Response",
  video_knowledge: "Video Knowledge Base",
  combined: "Text and Video Combined",
  search: "Web Search Fallback",
  fallback: "Fallback Response",
};

// -------------------------
// Global behavior rules
// Applied to every response
// regardless of source or mode
// -------------------------

export const GLOBAL_BEHAVIOR_RULES = {
  // Maximum characters per response before truncation warning
  maxResponseLength: 4000,

  // Always end responses with a next step when possible
  alwaysIncludeNextStep: true,

  // Preferred response formats in order of priority
  preferredFormats: ["numbered_steps", "bullet_points", "short_sections", "prose"],

  // Minimum response length to be considered useful
  minUsefulResponseLength: 80,

  // Never expose internal source names to the user
  hideSourceFromUser: true,

  // Never expose technical error messages to free users
  hideTechnicalErrors: true,

  // Log all engine decisions to console for debugging
  enableEngineLogging: true,
} as const;

// -------------------------
// Tone rules
// Controls how NIRA AI communicates
// -------------------------

export const TONE_RULES = {
  // Core tone attributes
  attributes: [
    "supportive",
    "professional",
    "clear",
    "intelligent",
    "practical",
  ],

  // Language style
  style: {
    useFirstPerson: false,
    useSimpleLanguage: true,
    useActionVerbs: true,
    avoidFillerPhrases: true,
    avoidVagueMotivation: true,
    contractionStyle: "formal",
  },

  // Forbidden phrases — never use these
  forbiddenPhrases: [
    "great question",
    "certainly",
    "of course",
    "absolutely",
    "as an AI",
    "I am just an AI",
    "I cannot help with that",
    "I don't have feelings",
    "feel free to ask",
    "hope that helps",
    "let me know if you need anything else",
  ],
} as const;

// -------------------------
// Intent handling rules
// Controls how each intent is processed
// -------------------------

export const INTENT_RULES: Record<
  Intent,
  {
    shouldReturnDirectly: boolean;
    shouldCache: boolean;
    requiresMode: boolean;
    description: string;
  }
> = {
  greeting: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Return a short, warm identity greeting immediately",
  },
  who_are_you: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Return a structured overview of NIRA AI capabilities",
  },
  creator: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Return the creator attribution response immediately",
  },
  help: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Return a structured guide on how to use NIRA AI",
  },
  study_request: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Suggest the user switches to Study Mode",
  },
  career_request: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Suggest the user switches to Career Mode",
  },
  unknown: {
    shouldReturnDirectly: false,
    shouldCache: true,
    requiresMode: true,
    description: "Pass through to ranked engine search",
  },
};

// -------------------------
// Knowledge base rules
// -------------------------

export const KNOWLEDGE_BASE_RULES = {
  // Cache every KB hit to reduce future lookup time
  cacheOnHit: true,

  // KB responses never need an upgrade prompt
  appendUpgradePrompt: false,

  // Keyword match is case-insensitive and partial
  matchType: "partial_keyword" as const,

  // Separate KB per mode — never cross-contaminate
  modeIsolation: true,

  // Source label for internal logging
  sourceLabel: "knowledge_base" as EngineSource,
} as const;

// -------------------------
// Cache rules
// -------------------------

export const CACHE_RULES = {
  // Time-to-live in milliseconds
  ttlMs: 1000 * 60 * 60, // 1 hour

  // Maximum number of entries before pruning
  maxSize: 500,

  // Cache key format: "{mode}::{normalized_query}"
  keyFormat: "{mode}::{normalized_query}" as const,

  // Normalize keys: lowercase, trim, collapse whitespace
  normalizeKeys: true,

  // Cache search results to preserve quota
  cacheSearchResults: true,

  // Never cache fallback responses
  cacheFallbackResponses: false,

  // Never cache intent responses
  cacheIntentResponses: false,
} as const;

// -------------------------
// Search fallback rules
// -------------------------

export const SEARCH_RULES = {
  // Only trigger search when cache and KB miss
  triggerCondition: "cache_and_kb_miss" as const,

  // Maximum results to fetch per query
  maxResults: 3,

  // Always append upgrade prompt to search results
  appendUpgradePrompt: true,

  // Cache search results to reduce future API calls
  cacheResults: true,

  // Safe search setting
  safeSearch: true,

  // Query context appended per mode
  modeContext: {
    study: "education learning",
    career: "career professional",
  } as Record<Mode, string>,

  // Source label for internal logging
  sourceLabel: "search" as EngineSource,
} as const;

// -------------------------
// Fallback response rules
// -------------------------

export const FALLBACK_RULES = {
  // Rotate through multiple fallback responses
  rotateFallbacks: true,

  // Append upgrade prompt only when search was exhausted
  appendUpgradePromptOnSearchExhaustion: true,

  // Never append upgrade prompt on a clean fallback
  appendUpgradePromptOnCleanFallback: false,

  // Fallback responses must still be genuinely useful
  mustBeUseful: true,

  // Source label for internal logging
  sourceLabel: "fallback" as EngineSource,
} as const;

// -------------------------
// Upgrade prompt rules
// -------------------------

export const UPGRADE_PROMPT_RULES = {
  // Conditions that trigger the upgrade prompt
  triggerConditions: [
    "search_result_returned",
    "search_quota_exhausted",
  ] as const,

  // Conditions that never show the upgrade prompt
  neverShowOn: [
    "intent_response",
    "knowledge_base_hit",
    "video_knowledge_hit",
    "combined_hit",
    "cache_hit",
    "clean_fallback",
  ] as const,

  // Position of the upgrade prompt in the response
  position: "end_of_response" as const,

  // Separator before the upgrade prompt
  separator: "\n\n---\n",

  // Maximum times to show upgrade prompt per session
  maxPerSession: 5,
} as const;

// -------------------------
// Engine v2 scorer thresholds
// -------------------------

export const SCORER_RULES = {
  // Score thresholds for strength classification
  strongThreshold: 60,
  weakThreshold: 30,

  // Decision table summary
  decisions: {
    strongText_strongVideo: "combined",
    strongText_partialVideo: "text_only",
    strongText_weakVideo: "text_only",
    partialText_strongVideo: "video_only",
    partialText_partialVideo: "highest_score_wins",
    partialText_weakVideo: "text_only",
    weakText_strongVideo: "video_only",
    weakText_partialVideo: "video_only",
    weakText_weakVideo: "fallback",
  },
} as const;

// -------------------------
// Mode-specific response rules
// -------------------------

export const MODE_RULES: Record<
  Mode,
  {
    persona: string;
    responseStyle: string;
    alwaysEndWith: string;
    topicScope: string[];
  }
> = {
  study: {
    persona: "knowledgeable and patient tutor",
    responseStyle: "step-by-step explanations with examples and clear structure",
    alwaysEndWith: "a practical next step the student can take immediately",
    topicScope: [
      "academic subjects",
      "study techniques",
      "note taking",
      "exam preparation",
      "memory and focus",
      "reading comprehension",
      "essay writing",
      "study planning",
    ],
  },
  career: {
    persona: "practical and experienced career mentor",
    responseStyle: "actionable advice with concrete steps and real-world context",
    alwaysEndWith: "a specific next action the user can take within 24 hours",
    topicScope: [
      "career path discovery",
      "resume and cover letters",
      "interview preparation",
      "skill development",
      "learning roadmaps",
      "freelancing",
      "linkedin and personal brand",
      "salary negotiation",
      "portfolio building",
      "networking",
      "remote work",
    ],
  },
};

// -------------------------
// Response formatting rules
// -------------------------

export const FORMATTING_RULES = {
  // Use markdown-style formatting in responses
  useMarkdown: true,

  // Heading style: **Heading** on its own line
  headingStyle: "**bold**" as const,

  // List style
  numberedListsForSteps: true,
  bulletListsForOptions: true,

  // Maximum bullet points per section
  maxBulletsPerSection: 6,

  // Always use a blank line between sections
  spaceBetweenSections: true,

  // Next step format
  nextStepPrefix: "**Next step:**",

  // Source attribution — never shown to user
  showSourceToUser: false,
} as const;
