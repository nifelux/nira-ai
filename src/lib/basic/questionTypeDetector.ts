// src/lib/basic/questionTypeDetector.ts
// Detects the type of question the user is asking
// so the engine can route it to the correct handler.

// -------------------------
// Supported question types
// -------------------------

export type QuestionType =
  | "greeting"
  | "definition"
  | "explanation"
  | "comparison"
  | "example"
  | "calculation"
  | "continuation"
  | "unknown";

// -------------------------
// Detection result
// -------------------------

export interface QuestionTypeResult {
  type: QuestionType;
  confidence: number; // 0 to 100
}

// -------------------------
// Greeting patterns
// Covers conversational openers
// that should return a greeting
// response, not study content
// -------------------------

const GREETING_PATTERNS: string[] = [
  "hi",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
  "good night",
  "how are you",
  "how are you doing",
  "how are you today",
  "how do you do",
  "what's up",
  "whats up",
  "sup",
  "howdy",
  "greetings",
  "hiya",
  "yo",
  "morning",
  "afternoon",
  "evening",
  "hope you are well",
  "hope you're well",
  "how is it going",
  "hows it going",
  "how's everything",
  "are you okay",
  "are you fine",
  "how do you feel",
  "nice to meet you",
  "pleased to meet you",
];

// -------------------------
// Calculation trigger words
// These indicate the user wants
// a numerical answer solved
// step by step
// -------------------------

const CALCULATION_TRIGGERS: string[] = [
  "calculate",
  "find",
  "solve",
  "work out",
  "evaluate",
  "determine",
  "compute",
  "what is the value",
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
  "what is the distance",
  "what is the time",
  "what is the temperature",
  "what is the charge",
  "what is the momentum",
  "what is the kinetic energy",
  "what is the potential energy",
  "how much force",
  "how much energy",
  "how much pressure",
  "how much current",
  "how far",
  "how fast",
  "how long",
  "how much",
  "how many",
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
  "wavelength of",
];

// -------------------------
// Definition trigger words
// -------------------------

const DEFINITION_TRIGGERS: string[] = [
  "what is",
  "what are",
  "define",
  "definition of",
  "meaning of",
  "what do you mean",
  "what does",
  "what is meant by",
];

// -------------------------
// Explanation trigger words
// -------------------------

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
  "how it works",
  "how does it work",
];

// -------------------------
// Comparison trigger words
// -------------------------

const COMPARISON_TRIGGERS: string[] = [
  "difference between",
  "compare",
  "comparison",
  "versus",
  "vs",
  "similarities between",
  "how does ... differ",
  "what is the difference",
  "distinguish between",
  "contrast",
];

// -------------------------
// Example trigger words
// -------------------------

const EXAMPLE_TRIGGERS: string[] = [
  "give me an example",
  "give example",
  "examples of",
  "show me an example",
  "real life example",
  "real world example",
  "practical example",
  "application of",
  "uses of",
  "where is it used",
  "list examples",
];

// -------------------------
// Continuation trigger words
// (short follow-ups)
// -------------------------

const CONTINUATION_TRIGGER_WORDS: string[] = [
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

// -------------------------
// Check if a query contains
// any pattern from a list
// -------------------------

function matchesAny(normalized: string, patterns: string[]): boolean {
  return patterns.some((p) => normalized.includes(p.toLowerCase()));
}

// -------------------------
// Check for calculation pattern:
// numbers + units in the query
// indicates a numerical problem
// -------------------------

function hasNumericalValues(normalized: string): boolean {
  // Contains digits
  const hasDigits = /\d/.test(normalized);

  // Contains common physics units
  const units = [
    "hz", "khz", "mhz",
    "m/s", "km/h", "km/s",
    "kg", "gram", "g ",
    "newton", " n ", "kn",
    "joule", " j ", "kj",
    "watt", " w ", "kw",
    "pascal", " pa ", "kpa",
    "metre", "meter", " m ",
    "second", " s ", "ms",
    "ampere", " a ", "ma",
    "volt", " v ", "kv",
    "ohm", " Ω",
    "celsius", "kelvin", "°c", "°k",
    "mol", "mole",
    "litre", "liter", " l ",
    "density", "kg/m",
  ];

  const hasUnits = units.some((u) => normalized.includes(u));

  return hasDigits && hasUnits;
}

// -------------------------
// Main question type detector
// -------------------------

export function detectQuestionType(query: string): QuestionTypeResult {
  const normalized = query.trim().toLowerCase();

  // --- Greeting: check first so "how are you" doesn't
  // match explanation triggers like "how does" ---
  if (matchesAny(normalized, GREETING_PATTERNS)) {
    return { type: "greeting", confidence: 95 };
  }

  // --- Continuation: short reply ---
  const isContinuation =
    normalized.length < 30 &&
    matchesAny(normalized, CONTINUATION_TRIGGER_WORDS);
  if (isContinuation) {
    return { type: "continuation", confidence: 90 };
  }

  // --- Calculation: explicit trigger words OR numerical values + units ---
  if (matchesAny(normalized, CALCULATION_TRIGGERS)) {
    return { type: "calculation", confidence: 90 };
  }

  if (hasNumericalValues(normalized)) {
    return { type: "calculation", confidence: 75 };
  }

  // --- Comparison ---
  if (matchesAny(normalized, COMPARISON_TRIGGERS)) {
    return { type: "comparison", confidence: 85 };
  }

  // --- Example ---
  if (matchesAny(normalized, EXAMPLE_TRIGGERS)) {
    return { type: "example", confidence: 85 };
  }

  // --- Definition ---
  if (matchesAny(normalized, DEFINITION_TRIGGERS)) {
    return { type: "definition", confidence: 80 };
  }

  // --- Explanation ---
  if (matchesAny(normalized, EXPLANATION_TRIGGERS)) {
    return { type: "explanation", confidence: 80 };
  }

  return { type: "unknown", confidence: 50 };
}
