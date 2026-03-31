// src/lib/basic/intentResponses.ts

import { Intent } from "@/lib/basic/intents";
import { Mode, EngineResponse } from "@/types/chat";
import { setPreference } from "@/lib/db/preferences";

// -------------------------
// Creator response
// -------------------------

const CREATOR_RESPONSE =
  "I was developed by Oluwanifemi Olude Abdullahi, CEO of Nifelux.";

// -------------------------
// Identity response
// "what are you", "who are you"
// -------------------------

const IDENTITY_RESPONSE = `I am NIRA AI — an intelligent study and career assistant.

I help students understand academic topics, solve calculations, and prepare for exams. I also help professionals build skills, write resumes, and grow their careers.

I was built by Nifelux and designed specifically to support learners across Africa.

**Next step:** Select a mode above and ask your first question.`;

// -------------------------
// Capabilities response
// "what can you do"
// -------------------------

const CAPABILITIES_RESPONSE = `Here is what I can do:

**📚 Study Mode — Academic subjects I cover:**
Physics, Chemistry, Biology, Mathematics, Further Mathematics, Economics, Accounting, Commerce, English, Literature, Government, History, Geography, Civic Education, CRS, IRS, Computer Science, Agricultural Science, Yoruba, Igbo, Hausa.

For each subject I can:
- Explain topics clearly step by step
- Solve calculations with full working
- Generate lesson notes and summaries
- Prepare you for exams

**🚀 Career Mode — I can help with:**
- Career path discovery
- Resume and cover letter writing
- Interview preparation
- Skill development roadmaps
- Freelancing and portfolio advice
- LinkedIn profile optimization

**Next step:** Select a mode above and tell me what you want to learn or build.`;

// -------------------------
// Help response
// -------------------------

const HELP_RESPONSE = `Here is how to use NIRA AI:

**Step 1 — Choose your mode**
Use the toggle at the top:
- Study Mode — for academic topics and calculations
- Career Mode — for professional growth

**Step 2 — Ask a specific question**
- "Explain photosynthesis" works better than "explain biology"
- "How do I write a resume with no experience?" works better than "resume help"

**Step 3 — Follow the next steps**
Every answer ends with a suggested next step or question. Say "yes" or "continue" and I will carry on.

**Next step:** Select a mode and ask your first question.`;

// -------------------------
// Mode suggestion responses
// -------------------------

const MODE_SUGGESTION_RESPONSES: Record<
  "study_request" | "career_request",
  string
> = {
  study_request: `Switch to **Study Mode** using the toggle at the top, then ask your question.

I can help with explanations, calculations, notes, and exam prep across all major subjects.

**Next step:** Select Study Mode and tell me the topic you want to work on.`,

  career_request: `Switch to **Career Mode** using the toggle at the top, then ask your question.

I can help with resumes, interviews, skills, freelancing, and career planning.

**Next step:** Select Career Mode and tell me what you want to work on.`,
};

// -------------------------
// Preference responses
// -------------------------

const VIDEO_DISABLE_TRIGGERS = [
  "no video", "don't show video", "dont show video",
  "i don't want video", "i dont want video", "no videos please",
  "disable video", "turn off video", "hide video", "without video",
  "text only", "just text", "no embed", "no youtube",
  "remove video", "stop showing video",
];

const VIDEO_ENABLE_TRIGGERS = [
  "show video", "i want video", "enable video",
  "turn on video", "include video", "with video", "allow video",
];

export async function buildPreferenceResponse(
  query: string,
  mode: Mode,
  userId: string | null
): Promise<EngineResponse> {
  const normalized = query.trim().toLowerCase();

  const isDisabling = VIDEO_DISABLE_TRIGGERS.some((t) => normalized.includes(t));
  const isEnabling = VIDEO_ENABLE_TRIGGERS.some((t) => normalized.includes(t));

  if (isDisabling) {
    await setPreference(userId, { allowVideo: false });
    return {
      content: "Got it. Text-only answers from now on — no video embeds.\n\n**Next step:** Ask your next question.",
      source: "knowledge_base",
      mode,
      cached: false,
    };
  }

  if (isEnabling) {
    await setPreference(userId, { allowVideo: true });
    return {
      content: "Video is now enabled. I will include relevant video explanations when available.\n\n**Next step:** Ask your next question.",
      source: "knowledge_base",
      mode,
      cached: false,
    };
  }

  return {
    content: "Preference noted. Ask your next question and I will adjust accordingly.",
    source: "knowledge_base",
    mode,
    cached: false,
  };
}

// -------------------------
// Conversational greeting
// -------------------------

const CONVERSATIONAL_GREETINGS = [
  "Hello! I'm ready to help you today. What would you like to study or work on?",
  "Hi there! Ready to go. What topic can I help you with?",
  "Good to hear from you! What would you like to explore today?",
  "Hello! What can I help you learn or build today?",
];

let greetingIndex = 0;

export function buildConversationalGreeting(mode: Mode): EngineResponse {
  const content = CONVERSATIONAL_GREETINGS[greetingIndex % CONVERSATIONAL_GREETINGS.length];
  greetingIndex += 1;
  return { content, source: "knowledge_base", mode, cached: false };
}

// -------------------------
// Main intent response builder
// Routes creator / system / capabilities
// to separate targeted responses
// -------------------------

export function buildIntentResponse(
  intent: Intent,
  mode: Mode,
  query?: string
): EngineResponse | null {
  switch (intent) {

    case "creator":
      return {
        content: CREATOR_RESPONSE,
        source: "knowledge_base",
        mode,
        cached: false,
      };

    case "system":
    case "who_are_you": {
      const normalized = (query ?? "").toLowerCase();
      // Route to capabilities if the query is about what NIRA can do
      if (
        normalized.includes("what can you do") ||
        normalized.includes("what do you do") ||
        normalized.includes("your capabilities") ||
        normalized.includes("your features") ||
        normalized.includes("what topics") ||
        normalized.includes("what subjects")
      ) {
        return { content: CAPABILITIES_RESPONSE, source: "knowledge_base", mode, cached: false };
      }
      // Default system queries go to identity
      return { content: IDENTITY_RESPONSE, source: "knowledge_base", mode, cached: false };
    }

    case "help":
      return { content: HELP_RESPONSE, source: "knowledge_base", mode, cached: false };

    case "greeting":
      return {
        content: "Hello, I'm NIRA AI — developed to support your studies and career growth.",
        source: "knowledge_base",
        mode,
        cached: false,
      };

    case "study_request":
    case "career_request":
      return {
        content: MODE_SUGGESTION_RESPONSES[intent],
        source: "knowledge_base",
        mode,
        cached: false,
      };

    case "preference":
      // Preference is handled separately via buildPreferenceResponse (async)
      return null;

    case "unknown":
    default:
      return null;
  }
}
