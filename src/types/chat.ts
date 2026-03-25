// src/types/chat.ts

// -------------------------
// Core chat types
// -------------------------

export type Mode = "study" | "career";

export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  mode: Mode;
  messages: Message[];
  createdAt: Date;
}

export interface ChatRequest {
  messages: Pick<Message, "role" | "content">[];
  mode: Mode;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

// -------------------------
// User tier
// -------------------------

export type UserTier = "free" | "premium";

// -------------------------
// Study subjects
// -------------------------

export type StudySubject =
  | "biology"
  | "biologyPractical"
  | "chemistry"
  | "chemistryPractical"
  | "physics"
  | "physicsPractical"
  | "agriculturalScience"
  | "mathematics"
  | "furtherMathematics"
  | "accounting"
  | "commerce"
  | "economics"
  | "english"
  | "literature"
  | "government"
  | "history"
  | "geography"
  | "civicEducation"
  | "crs"
  | "irs"
  | "computerScience"
  | "yoruba"
  | "igbo"
  | "hausa";

export interface SubjectDetectionResult {
  subject: StudySubject;
  confidence: number; // 0 to 100
}

// -------------------------
// Engine source types
// -------------------------

export type EngineSource =
  | "cache"
  | "knowledge_base"
  | "video_knowledge"
  | "combined"
  | "search"
  | "fallback";

// -------------------------
// Engine response
// -------------------------

export interface EngineResponse {
  content: string;
  source: EngineSource;
  mode: Mode;
  cached: boolean;
  upgradePrompt?: string;
  videoResult?: VideoSearchResult;
}

// -------------------------
// Knowledge base types
// -------------------------

export interface KnowledgeEntry {
  keywords: string[];
  mode: Mode;
  answer: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  exhausted: boolean;
}

// -------------------------
// Video knowledge types
// -------------------------

export interface VideoSegment {
  start: number;
  end: number;
  text: string;
  keywords: string[];
}

export interface VideoEntry {
  videoId: string;
  title: string;
  subject: StudySubject;
  description: string;
  segments: VideoSegment[];
}

export interface VideoSearchResult {
  videoId: string;
  title: string;
  subject: StudySubject;
  segmentText: string;
  startSeconds: number;
  endSeconds: number;
  embedUrl: string;
  watchUrl: string;
}

// -------------------------
// Engine v2 scoring types
// -------------------------

export type ScoreStrength = "strong" | "partial" | "weak";

export interface ScoredTextResult {
  entry: KnowledgeEntry;
  score: number;
  strength: ScoreStrength;
}

export interface ScoredVideoResult {
  result: VideoSearchResult;
  score: number;
  strength: ScoreStrength;
}

export interface CombinedEngineResult {
  textResult: ScoredTextResult | null;
  videoResult: ScoredVideoResult | null;
  decision:
    | "text_only"
    | "video_only"
    | "combined"
    | "fallback";
}
