// src/config/responseRules.ts

import { Intent } from "@/lib/basic/intents";
import { EngineSource, Mode } from "@/types/chat";

// -------------------------
// Response priority order
// -------------------------

export const RESPONSE_PRIORITY_ORDER: EngineSource[] = [
  "knowledge_base",
  "cache",
  "knowledge_base",
  "video_knowledge",
  "combined",
  "search",
  "fallback",
];

// -------------------------
// Labels for ALL EngineSource values
// Must stay in sync with EngineSource
// type in src/types/chat.ts
// -------------------------

export const RESPONSE_PRIORITY_LABELS: Record<EngineSource, string> = {
  knowledge_base: "Knowledge Base",
  cache: "Cached Response",
  video_knowledge: "Video Knowledge",
  combined: "Combined Knowledge",
  wikibooks: "Wikibooks",
  openStax: "OpenStax",
  search: "External Source",
  fallback: "Fallback",
};

// -------------------------
// Global behavior rules
// -------------------------

export const GLOBAL_BEHAVIOR_RULES = {
  maxResponseLength: 4000,
  alwaysIncludeNextStep: true,
  preferredFormats: ["numbered_steps", "bullet_points", "short_sections", "prose"],
  minUsefulResponseLength: 80,
  hideSourceFromUser: true,
  hideTechnicalErrors: true,
  enableEngineLogging: true,
} as const;

// -------------------------
// Tone rules
// -------------------------

export const TONE_RULES = {
  attributes: [
    "supportive",
    "professional",
    "clear",
    "intelligent",
    "practical",
  ],
  style: {
    useFirstPerson: false,
    useSimpleLanguage: true,
    useActionVerbs: true,
    avoidFillerPhrases: true,
    avoidVagueMotivation: true,
    contractionStyle: "formal",
  },
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
    description: "Return NIRA identity response",
  },
  system: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Return system identity or capabilities response",
  },
  creator: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Return creator attribution response",
  },
  preference: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: true,
    description: "Update user preference and confirm",
  },
  help: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Return NIRA usage guide",
  },
  study_request: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Suggest switching to Study Mode",
  },
  career_request: {
    shouldReturnDirectly: true,
    shouldCache: false,
    requiresMode: false,
    description: "Suggest switching to Career Mode",
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
  cacheOnHit: true,
  appendUpgradePrompt: false,
  matchType: "partial_keyword" as const,
  modeIsolation: true,
  sourceLabel: "knowledge_base" as EngineSource,
} as const;

// -------------------------
// Cache rules
// -------------------------

export const CACHE_RULES = {
  ttlMs: 1000 * 60 * 60,
  maxSize: 500,
  keyFormat: "{mode}::{normalized_query}" as const,
  normalizeKeys: true,
  cacheSearchResults: true,
  cacheFallbackResponses: false,
  cacheIntentResponses: false,
} as const;

// -------------------------
// Search fallback rules
// -------------------------

export const SEARCH_RULES = {
  triggerCondition: "cache_and_kb_miss" as const,
  maxResults: 3,
  appendUpgradePrompt: true,
  cacheResults: true,
  safeSearch: true,
  modeContext: {
    study: "education academic",
    career: "career professional Africa",
  } as Record<Mode, string>,
  sourceLabel: "search" as EngineSource,
} as const;

// -------------------------
// Fallback response rules
// -------------------------

export const FALLBACK_RULES = {
  rotateFallbacks: true,
  appendUpgradePromptOnSearchExhaustion: true,
  appendUpgradePromptOnCleanFallback: false,
  mustBeUseful: true,
  sourceLabel: "fallback" as EngineSource,
} as const;

// -------------------------
// Upgrade prompt rules
// -------------------------

export const UPGRADE_PROMPT_RULES = {
  triggerConditions: [
    "search_result_returned",
    "search_quota_exhausted",
  ] as const,
  neverShowOn: [
    "intent_response",
    "knowledge_base_hit",
    "video_knowledge_hit",
    "combined_hit",
    "cache_hit",
    "clean_fallback",
  ] as const,
  position: "end_of_response" as const,
  separator: "\n\n---\n",
  maxPerSession: 5,
} as const;

// -------------------------
// Engine v2 scorer thresholds
// -------------------------

export const SCORER_RULES = {
  strongThreshold: 60,
  weakThreshold: 30,
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
  useMarkdown: true,
  headingStyle: "**bold**" as const,
  numberedListsForSteps: true,
  bulletListsForOptions: true,
  maxBulletsPerSection: 6,
  spaceBetweenSections: true,
  nextStepPrefix: "**Next step:**",
  showSourceToUser: false,
} as const;
