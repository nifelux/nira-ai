// src/lib/basic/intentResponses.ts

import { Intent } from "@/lib/basic/intents";
import { Mode, EngineResponse } from "@/types/chat";

// -------------------------
// Direct intent responses
// Returned immediately without
// touching cache, KB, or search
// -------------------------

const INTENT_RESPONSES: Partial<Record<Intent, string>> = {
  greeting:
    "Hello, I'm NIRA AI — developed to support your studies and career growth.",

  who_are_you: `I am NIRA AI, an intelligent assistant built to help you learn and grow professionally.

**Here is what I can do:**

**📚 Study Mode**
- Explain academic topics clearly and step by step
- Generate lesson notes and summaries
- Create quizzes and study plans
- Help you prepare for exams

**🚀 Career Mode**
- Suggest career paths based on your strengths
- Build skill and learning roadmaps
- Help write and improve your resume
- Prepare you for job interviews
- Give practical freelancing advice

Select a mode at the top of the chat and ask me anything. I am here to help you move from learning to earning.`,

  creator:
    "I was developed by Oluwanifemi Olude Abdullahi, CEO of Nifelux.",

  help: `Here is how to get the best out of NIRA AI.

**Step 1 — Choose your mode**
Use the toggle at the top of the chat to select the mode that matches your goal:
- **Study Mode** — for learning, notes, quizzes, and exam preparation
- **Career Mode** — for career advice, resumes, interviews, and skill building

**Step 2 — Ask a specific question**
The more specific your question, the better my answer. For example:
- "Explain photosynthesis simply" works better than "explain biology"
- "How do I write a resume with no experience?" works better than "resume help"

**Step 3 — Follow the next steps**
Every answer I give ends with a practical next step. Use it — small consistent actions build real results.

**Topics I can help with:**

Study Mode:
- Any academic subject or topic
- Note generation, summaries, and quizzes
- Study planning and exam preparation
- Memory techniques and focus strategies

Career Mode:
- Career path discovery and planning
- Resume and cover letter writing
- Interview preparation and STAR method
- Freelancing, LinkedIn, and portfolio building
- Salary negotiation and networking

**Next step:** Select a mode above and ask your first question.`,
};

// -------------------------
// Mode suggestion responses
// Used for study_request and career_request
// Guides the user to switch mode
// rather than answering directly
// -------------------------

const MODE_SUGGESTION_RESPONSES: Record<"study_request" | "career_request", string> = {
  study_request: `It looks like you need help with studying. Here is what to do:

**Switch to Study Mode** using the toggle at the top of the chat, then ask your question.

In Study Mode I can help you with:
- Explaining any academic topic clearly
- Generating lesson notes and summaries
- Creating quizzes and study plans
- Preparing for exams

**Next step:** Select Study Mode above and tell me what topic you want to work on.`,

  career_request: `It looks like you need career guidance. Here is what to do:

**Switch to Career Mode** using the toggle at the top of the chat, then ask your question.

In Career Mode I can help you with:
- Discovering the right career path for you
- Writing and improving your resume
- Preparing for job interviews
- Building skills and learning roadmaps
- Freelancing and portfolio advice

**Next step:** Select Career Mode above and tell me what you want to work on.`,
};

// -------------------------
// Build a direct intent response
// Returns an EngineResponse for
// intents that have a fixed answer
// Returns null for intents that
// should fall through to the engine
// -------------------------

export function buildIntentResponse(
  intent: Intent,
  mode: Mode
): EngineResponse | null {
  // --- Direct response intents ---
  const directContent = INTENT_RESPONSES[intent];
  if (directContent) {
    return {
      content: directContent,
      source: "knowledge_base",
      mode,
      cached: false,
    };
  }

  // --- Mode suggestion intents ---
  if (intent === "study_request" || intent === "career_request") {
    return {
      content: MODE_SUGGESTION_RESPONSES[intent],
      source: "knowledge_base",
      mode,
      cached: false,
    };
  }

  // --- Unknown: fall through to engine ---
  return null;
}
