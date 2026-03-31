// src/lib/basic/questionTypeDetector.ts

export type QuestionType =
  | "system"
  | "preference"
  | "greeting"
  | "calculation"
  | "continuation"
  | "definition"
  | "explanation"
  | "comparison"
  | "example"
  | "unknown";

export interface QuestionTypeResult {
  type: QuestionType;
  confidence: number;
}

// -------------------------
// System patterns
// Must be checked FIRST before
// greeting so "who created you"
// never falls into greeting
// -------------------------

const SYSTEM_PATTERNS: string[] = [
  "who created you",
  "who is your creator",
  "who made you",
  "who built you",
  "who developed you",
  "who founded you",
  "who owns you",
  "your creator",
  "your developer",
  "your founder",
  "what are you",
  "what is nira",
  "what is nira ai",
  "who are you",
  "what can you do",
  "what do you do",
  "are you an ai",
  "are you a bot",
  "are you human",
  "tell me about yourself",
  "describe yourself",
  "introduce yourself",
  "your capabilities",
  "your features",
  "what topics can you",
  "what subjects do you",
];

// -------------------------
// Preference patterns
// Must be checked SECOND before
// greeting so "no" type phrases
// never fall through to fallback
// -------------------------

const PREFERENCE_DISABLE_VIDEO: string[] = [
  "i don't want video",
  "i dont want video",
  "no video",
  "don't show video",
  "dont show video",
  "without video",
  "stop showing video",
  "no videos",
  "disable video",
  "turn off video",
  "hide video",
  "text only",
  "just text",
  "no embed",
  "no youtube",
  "remove video",
];

const PREFERENCE_ENABLE_VIDEO: string[] = [
  "show video",
  "i want video",
  "enable video",
  "turn on video",
  "include video",
  "with video",
  "allow video",
];

const ALL_PREFERENCE_PATTERNS = [
  ...PREFERENCE_DISABLE_VIDEO,
  ...PREFERENCE_ENABLE_VIDEO,
];

// -------------------------
// Greeting patterns
// Checked THIRD — after system
// and preference so "who created
// you" never hits here
// -------------------------

const GREETING_PATTERNS: string[] = [
  "how are you",
  "how are you doing",
  "how are you today",
  "how do you do",
  "how is it going",
  "hows it going",
  "how's everything",
  "are you okay",
  "are you fine",
  "how do you feel",
  "nice to meet you",
  "pleased to meet you",
  "hope you are well",
  "hope you're well",
  "good morning",
  "good afternoon",
  "good evening",
  "good night",
  "what's up",
  "whats up",
  "sup",
];

const STRICT_GREETING_WORDS: string[] = [
  "hi",
  "hello",
  "hey",
  "hiya",
  "yo",
  "howdy",
  "greetings",
  "morning",
  "afternoon",
  "evening",
];

// -------------------------
// Calculation trigger words
// -------------------------

const CALCULATION_TRIGGERS: string[] = [
  "calculate",
  "find the",
  "solve",
  "work out",
  "evaluate",
  "determine",
  "compute",
  "how much force",
  "how much energy",
  "how much pressure",
  "how much current",
  "how far",
  "how fast",
  "what is the speed",
  "what is the velocity",
  "what is the acceleration",
  "what is the force",
  "what is the pressure",
  "what is the density",
  "what is the mass",
  "what is the weight",
  "what is the volume",
  "what is the current",
  "what is the voltage",
  "what is the resistance",
  "what is the power",
  "what is the energy",
  "what is the frequency",
  "what is the wavelength",
  "what is the period",
  "what is the momentum",
  "what is the kinetic energy",
  "what is the potential energy",
  "if frequency is",
  "if wavelength is",
  "if mass is",
  "if volume is",
  "if force is",
  "if velocity is",
  "if speed is",
  "if current is",
  "if voltage is",
  "if resistance is",
  "if temperature is",
  "if pressure is",
  "if density is",
  "if charge is",
  "if time is",
  "if distance is",
  "given that",
  "given frequency",
  "given mass",
  "given velocity",
  "a body of mass",
  "a car of mass",
  "a stone of mass",
  "an object of mass",
  "a ball of mass",
  "a wire of length",
  "a spring of constant",
  "a wave of frequency",
  "a wave has frequency",
  "frequency of",
];

const CONTINUATION_WORDS: string[] = [
  "yes",
  "yeah",
  "yep",
  "ok",
  "okay",
  "sure",
  "continue",
  "next",
  "go on",
  "proceed",
  "go ahead",
  "more",
  "please continue",
  "keep going",
  "carry on",
];

const DEFINITION_TRIGGERS: string[] = [
  "what is",
  "what are",
  "define",
  "definition of",
  "meaning of",
  "what do you mean by",
  "what is meant by",
  "what does",
];

const EXPLANATION_TRIGGERS: string[] = [
  "explain",
  "how does",
  "how do",
  "why does",
  "why do",
  "how is",
  "describe",
  "tell me about",
  "talk about",
  "elaborate",
  "what happens when",
];

const COMPARISON_TRIGGERS: string[] = [
  "difference between",
  "compare",
  "versus",
  " vs ",
  "similarities between",
  "distinguish between",
  "contrast",
];

const EXAMPLE_TRIGGERS: string[] = [
  "give me an example",
  "give example",
  "examples of",
  "show me an example",
  "real life example",
  "practical example",
  "application of",
  "uses of",
  "list examples",
];

// -------------------------
// Helpers
// -------------------------

function matchesAny(normalized: string, patterns: string[]): boolean {
  return patterns.some((p) => normalized.includes(p.toLowerCase()));
}

function isStrictGreetingWord(normalized: string): boolean {
  const cleaned = normalized.replace(/[!?.'"]/g, "").trim();
  if (STRICT_GREETING_WORDS.includes(cleaned)) return true;
  for (const word of STRICT_GREETING_WORDS) {
    if (cleaned.startsWith(word)) {
      const remainder = cleaned.slice(word.length).trim();
      if (["there", "nira", ""].includes(remainder)) return true;
    }
  }
  return false;
}

function hasNumericalValues(normalized: string): boolean {
  const hasDigits = /\d/.test(normalized);
  const units = [
    "hz", "khz", "mhz", "m/s", "km/h", "kg", " n ", "kn",
    "joule", " j ", "kj", "watt", " w ", "kw", "pascal", " pa ",
    "metre", "meter", " m ", " s ", "ampere", " a ", "volt", " v ",
    "ohm", "celsius", "kelvin", "mol", "litre",
  ];
  const hasUnits = units.some((u) => normalized.includes(u));
  return hasDigits && hasUnits;
}

// -------------------------
// Main detector
//
// Priority order:
// 1. system
// 2. preference
// 3. greeting
// 4. calculation
// 5. continuation
// 6. comparison / example / definition / explanation
// 7. unknown
// -------------------------

export function detectQuestionType(query: string): QuestionTypeResult {
  const normalized = query.trim().toLowerCase();

  // 1. System — checked FIRST
  if (matchesAny(normalized, SYSTEM_PATTERNS)) {
    return { type: "system", confidence: 95 };
  }

  // 2. Preference — checked SECOND
  if (matchesAny(normalized, ALL_PREFERENCE_PATTERNS)) {
    return { type: "preference", confidence: 95 };
  }

  // 3. Greeting — checked THIRD, after system and preference
  if (matchesAny(normalized, GREETING_PATTERNS)) {
    return { type: "greeting", confidence: 90 };
  }
  if (isStrictGreetingWord(normalized)) {
    return { type: "greeting", confidence: 90 };
  }

  // 4. Calculation
  if (matchesAny(normalized, CALCULATION_TRIGGERS)) {
    return { type: "calculation", confidence: 90 };
  }
  if (hasNumericalValues(normalized)) {
    return { type: "calculation", confidence: 75 };
  }

  // 5. Continuation (short follow-ups)
  const isContinuation =
    normalized.length < 30 &&
    matchesAny(normalized, CONTINUATION_WORDS);
  if (isContinuation) {
    return { type: "continuation", confidence: 88 };
  }

  // 6. Knowledge subtypes
  if (matchesAny(normalized, COMPARISON_TRIGGERS)) {
    return { type: "comparison", confidence: 85 };
  }
  if (matchesAny(normalized, EXAMPLE_TRIGGERS)) {
    return { type: "example", confidence: 85 };
  }
  if (matchesAny(normalized, DEFINITION_TRIGGERS)) {
    return { type: "definition", confidence: 80 };
  }
  if (matchesAny(normalized, EXPLANATION_TRIGGERS)) {
    return { type: "explanation", confidence: 80 };
  }

  return { type: "unknown", confidence: 50 };
}
