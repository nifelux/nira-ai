// src/lib/basic/intents.ts

// -------------------------
// Supported intent types
// -------------------------

export type Intent =
  | "greeting"
  | "who_are_you"
  | "creator"
  | "help"
  | "study_request"
  | "career_request"
  | "unknown";

// -------------------------
// Strict greeting phrases
// Only exact or near-exact greetings
// qualify — no broad includes() matching
// -------------------------

const STRICT_GREETING_PHRASES: string[] = [
  "hi",
  "hello",
  "hey",
  "hiya",
  "yo",
  "howdy",
  "greetings",
  "good morning",
  "good afternoon",
  "good evening",
  "good night",
  "morning",
  "afternoon",
  "evening",
];

// -------------------------
// Creator trigger phrases
// Checked before greeting so short
// messages like "creator" never
// fall into greeting or fallback
// -------------------------

const CREATOR_TRIGGERS: string[] = [
  "who made you",
  "who created you",
  "who built you",
  "who developed you",
  "who founded you",
  "who is your creator",
  "who is your developer",
  "who is your founder",
  "who owns you",
  "who is behind you",
  "who is behind nira",
  "who made nira",
  "who created nira",
  "who built nira",
  "who founded nira",
  "your creator",
  "your developer",
  "your founder",
  "your owner",
  "creator",
  "nifelux",
  "oluwanifemi",
  "abdullahi",
  "olude",
];

// -------------------------
// Who are you trigger phrases
// -------------------------

const WHO_ARE_YOU_TRIGGERS: string[] = [
  "who are you",
  "what are you",
  "what is nira",
  "what is nira ai",
  "tell me about yourself",
  "describe yourself",
  "introduce yourself",
  "what can you do",
  "what do you do",
  "are you an ai",
  "are you a bot",
  "are you human",
  "what kind of ai",
];

// -------------------------
// Help trigger phrases
// -------------------------

const HELP_TRIGGERS: string[] = [
  "help",
  "help me",
  "what can you help with",
  "how do you work",
  "how does this work",
  "how does nira work",
  "what are your features",
  "what topics",
  "what subjects",
  "what can i ask",
  "guide me",
  "show me what you can do",
  "getting started",
  "how to use",
  "how to use nira",
];

// -------------------------
// Study request trigger phrases
// -------------------------

const STUDY_REQUEST_TRIGGERS: string[] = [
  "study mode",
  "switch to study",
  "i want to study",
  "help me study",
  "i need to study",
  "study help",
  "learn a topic",
  "help me learn",
  "explain a topic",
  "i need study help",
  "academic help",
  "school help",
  "exam help",
  "i have an exam",
  "quiz me",
  "make me notes",
  "generate notes",
  "study plan",
];

// -------------------------
// Career request trigger phrases
// -------------------------

const CAREER_REQUEST_TRIGGERS: string[] = [
  "career mode",
  "switch to career",
  "i want career help",
  "help with my career",
  "career advice",
  "i need career help",
  "job help",
  "help me find a job",
  "resume help",
  "help with my resume",
  "interview help",
  "help with interview",
  "freelance help",
  "i want to freelance",
  "career guidance",
  "find a job",
  "get a job",
  "job search",
  "looking for work",
  "looking for a job",
  "need a job",
  "write my resume",
  "update my resume",
  "improve my resume",
  "cover letter",
  "job application",
  "apply for a job",
  "interview tips",
  "salary negotiation",
  "linkedin profile",
  "build my portfolio",
  "freelancing tips",
  "remote job",
  "work from home",
  "career change",
  "switch careers",
  "career path",
  "networking tips",
];

// -------------------------
// Strong career content signals
// Exported for cross-mode detection
// in the engine
// -------------------------

export const STRONG_CAREER_SIGNALS: string[] = [
  "resume",
  "cv",
  "cover letter",
  "interview",
  "job",
  "salary",
  "freelance",
  "freelancing",
  "linkedin",
  "portfolio",
  "career",
  "networking",
  "remote work",
  "work from home",
  "hiring",
  "recruiter",
  "job search",
  "job application",
  "employment",
];

// -------------------------
// Strong study content signals
// Exported for cross-mode detection
// in the engine
// -------------------------

export const STRONG_STUDY_SIGNALS: string[] = [
  "exam",
  "test",
  "quiz",
  "homework",
  "assignment",
  "lecture",
  "textbook",
  "revision",
  "study",
  "studying",
  "notes",
  "subject",
  "grade",
  "school",
  "university",
  "college",
  "academic",
  "essay",
  "thesis",
  "dissertation",
  "coursework",
];

// -------------------------
// Strict greeting matcher
// Only matches if the entire
// normalized query is a greeting phrase
// or starts with one followed by
// nothing meaningful
// -------------------------

function isStrictGreeting(normalized: string): boolean {
  // Exact match
  if (STRICT_GREETING_PHRASES.includes(normalized)) return true;

  // Starts with greeting phrase and nothing meaningful follows
  // "hi there" and "hello nira" are still greetings
  // "hey who made you" and "hello what is a resume" are not
  for (const phrase of STRICT_GREETING_PHRASES) {
    if (normalized.startsWith(phrase)) {
      const remainder = normalized.slice(phrase.length).trim();
      const allowedRemainders = ["there", "nira", ""];
      if (allowedRemainders.includes(remainder)) {
        return true;
      }
    }
  }

  return false;
}

// -------------------------
// Includes-based matcher
// Used for all intents except greeting
// -------------------------

function matchesTriggers(normalized: string, triggers: string[]): boolean {
  return triggers.some((trigger) => normalized.includes(trigger));
}

// -------------------------
// Intent detection
// Priority order:
// creator → who_are_you → help →
// study_request → career_request →
// greeting → unknown
//
// Creator is checked before greeting
// so "creator" and "who made you"
// never fall through to greeting
// -------------------------

export function detectIntent(query: string): Intent {
  const normalized = query.trim().toLowerCase().replace(/[^\w\s]/gi, "");

  // 1. Creator — always checked first
  if (matchesTriggers(normalized, CREATOR_TRIGGERS)) return "creator";

  // 2. Who are you
  if (matchesTriggers(normalized, WHO_ARE_YOU_TRIGGERS)) return "who_are_you";

  // 3. Help
  if (matchesTriggers(normalized, HELP_TRIGGERS)) return "help";

  // 4. Study request
  if (matchesTriggers(normalized, STUDY_REQUEST_TRIGGERS)) return "study_request";

  // 5. Career request
  if (matchesTriggers(normalized, CAREER_REQUEST_TRIGGERS)) return "career_request";

  // 6. Greeting — strict match only, checked after all named intents
  if (isStrictGreeting(normalized)) return "greeting";

  return "unknown";
}
