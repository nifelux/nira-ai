// src/lib/basic/sourcePolicy.ts

import { UserTier, EngineSource } from "@/types/chat";

// -------------------------
// Allowed sources per tier
// -------------------------

const TIER_SOURCE_POLICY: Record<UserTier, EngineSource[]> = {
  free: [
    "cache",
    "knowledge_base",
    "video_knowledge",
    "combined",
    "wikibooks",
    "openStax",
    "fallback",
  ],
  pro: [
    "cache",
    "knowledge_base",
    "video_knowledge",
    "combined",
    "wikibooks",
    "openStax",
    "fallback",
  ],
  proPlus: [
    "cache",
    "knowledge_base",
    "video_knowledge",
    "combined",
    "wikibooks",
    "openStax",
    "search",
    "fallback",
  ],
  enterprise: [
    "cache",
    "knowledge_base",
    "video_knowledge",
    "combined",
    "wikibooks",
    "openStax",
    "search",
    "fallback",
  ],
};

export function getAllowedSources(tier: UserTier): EngineSource[] {
  return TIER_SOURCE_POLICY[tier] ?? TIER_SOURCE_POLICY.free;
}

export function canUseSource(tier: UserTier, source: EngineSource): boolean {
  return getAllowedSources(tier).includes(source);
}
