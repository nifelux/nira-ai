// src/lib/basic/intents.ts

export type Intent =
  | "greeting"
  | "who_are_you"
  | "system"
  | "creator"
  | "preference"
  | "help"
  | "study_request"
  | "career_request"
  | "unknown";

// -------------------------
// Strict greeting phrases only
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
// Creator triggers
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
  "nifelux",
  "oluwanifemi",
  "abdullahi",
  "olude",
];

// -------------------------
// System triggers
// Only explicit NIRA identity
// and capability questions.
// Does NOT include general study
// questions like "explain energy"
// or "what is electrostatics".
// -------------------------

const SYSTEM_TRIGGERS: string[] = [
  "what is nira",
  "what is nira ai",
  "what are you",
  "who are you",
  "are you an ai",
  "are you a bot",
  "are you human",
  "tell me about yourself",
  "describe yourself",
  "introduce yourself",
  "what can you do",
  "what do you do",
  "your capabilities",
  "your features",
  "what topics can you cover",
  "what subjects do you know",
  "what can nira do",
];

// -------------------------
// Preference triggers
// -------------------------

const PREFERENCE_TRIGGERS: string[] = [
  "no video",
  "don't show video",
  "dont show video",
  "i don't want video",
  "i dont want video",
  "no videos please",
  "disable video",
  "turn off video",
  "hide video",
  "without video",
  "text only",
  "just text",
  "no embed",
  "no youtube",
  "remove video",
  "stop showing video",
  "show video",
  "i want video",
  "enable video",
  "turn on video",
  "include video",
  "with video",
  "allow video",
];

// -------------------------
// Help triggers
// Only explicit help requests
// about using NIRA — not general
// academic "help me study X"
// -------------------------

const HELP_TRIGGERS: string[] = [
  "how do you work",
  "how does this work",
  "how does nira work",
  "how to use nira",
  "getting started",
  "show me what you can do",
  "guide me through",
  "what can i ask you",
];

// -------------------------
// Study request triggers
// -------------------------

const STUDY_REQUEST_TRIGGERS: string[] = [
  "study mode",
  "switch to study",
  "i want to study",
  "help me study",
  "i need to study",
  "learn a topic",
  "i need study help",
  "exam help",
  "i have an exam",
  "quiz me",
  "make me notes",
  "generate notes",
];

// -------------------------
// Career request triggers
// -------------------------

const CAREER_REQUEST_TRIGGERS: string[] = [
  "career mode",
  "switch to career",
  "i want career help",
  "help with my career",
  "i need career help",
  "find a job",
  "get a job",
  "job search",
  "looking for work",
  "looking for a job",
  "need a job",
  "write my resume",
  "update my resume",
  "improve my resume",
  "interview tips",
  "salary negotiation",
  "freelancing tips",
  "remote job",
  "work from home",
  "career change",
  "switch careers",
];

// -------------------------
// Cross-mode signals
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
// Helpers
// -------------------------

function matchesTriggers(normalized: string, triggers: string[]): boolean {
  return triggers.some((trigger) => normalized.includes(trigger));
}

function isStrictGreeting(normalized: string): boolean {
  if (STRICT_GREETING_PHRASES.includes(normalized)) return true;
  for (const phrase of STRICT_GREETING_PHRASES) {
    if (normalized.startsWith(phrase)) {
      const remainder = normalized.slice(phrase.length).trim();
      if (["there", "nira", ""].includes(remainder)) return true;
    }
  }
  return false;
}

// -------------------------
// detectIntent
//
// IMPORTANT: This function is NOT
// responsible for detecting general
// study or knowledge questions.
// It only handles NIRA-specific
// meta-queries and routing commands.
//
// General questions like:
//   "explain electrostatics"
//   "what is energy"
//   "list derived quantities"
// must return "unknown" here and
// be handled by the KB/solver.
//
// Priority:
// 1. creator
// 2. system   (explicit NIRA identity only)
// 3. preference
// 4. help     (explicit NIRA usage only)
// 5. study_request
// 6. career_request
// 7. greeting (strict only)
// 8. unknown
// -------------------------

export function detectIntent(query: string): Intent {
  const normalized = query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/gi, "");

  // 1. Creator
  if (matchesTriggers(normalized, CREATOR_TRIGGERS)) return "creator";

  // 2. System — only for explicit NIRA identity questions
  if (matchesTriggers(normalized, SYSTEM_TRIGGERS)) return "system";

  // 3. Preference
  if (matchesTriggers(normalized, PREFERENCE_TRIGGERS)) return "preference";

  // 4. Help — only for explicit NIRA usage questions
  if (matchesTriggers(normalized, HELP_TRIGGERS)) return "help";

  // 5. Study request
  if (matchesTriggers(normalized, STUDY_REQUEST_TRIGGERS)) return "study_request";

  // 6. Career request
  if (matchesTriggers(normalized, CAREER_REQUEST_TRIGGERS)) return "career_request";

  // 7. Greeting — strict match only
  if (isStrictGreeting(normalized)) return "greeting";

  // 8. Unknown — all general study and knowledge questions
  return "unknown";
}
