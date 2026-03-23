// src/lib/basic/fallback.ts

import { Mode, EngineResponse } from "@/types/chat";

// -------------------------
// Soft upgrade prompt
// Appended when search is exhausted
// or when the answer is limited
// -------------------------

const UPGRADE_PROMPT =
  "💡 Want deeper, personalised answers on any topic? Upgrade to NIRA Premium for unlimited AI-powered responses tailored to your exact goals.";

// -------------------------
// Generic fallback responses
// Used when cache, knowledge base,
// and search all return nothing
// -------------------------

const STUDY_FALLBACKS: string[] = [
  `I want to make sure I give you the most useful answer on this topic.

Here are some reliable approaches for almost any study challenge:

**1. Break it down**
Divide the topic into the smallest possible subtopics. Tackle one at a time rather than trying to understand everything at once.

**2. Use active recall**
Instead of re-reading, close your notes and write down everything you remember. Then check what you missed. Repeat until gaps disappear.

**3. Find a strong resource**
- Khan Academy covers most academic subjects from beginner to advanced level
- YouTube channels like CrashCourse offer clear visual explanations
- Google Scholar surfaces academic papers for deeper research

**4. Teach it back**
Explain the concept out loud as if teaching someone who knows nothing about it. Gaps in your explanation reveal exactly what you still need to learn.

**5. Ask a specific question**
The more specific your question, the better the answer you will receive — from any source, including me.

**Next step:** Rephrase your question with more detail and I will do my best to give you a more targeted answer.`,

  `That is a great topic to explore. Let me give you a reliable starting framework.

**When learning anything new, follow this sequence:**

1. Get a high-level overview first — understand what the topic is about before diving into detail
2. Identify the core concepts — every subject has 3 to 5 foundational ideas that everything else builds on
3. Find worked examples — seeing how concepts are applied is faster than reading theory alone
4. Practice with real problems — retrieve and apply what you have learned as soon as possible
5. Review your gaps — test yourself and focus extra time on whatever you got wrong

**Reliable free learning resources:**
- Khan Academy — structured lessons across all major subjects
- Coursera and edX — university-level courses, many free to audit
- YouTube — search your topic plus "explained" or "for beginners"
- Wikipedia — useful for overviews and linking to primary sources

**Next step:** Tell me more specifically what you are trying to learn and I will point you in the right direction.`,
];

const CAREER_FALLBACKS: string[] = [
  `Great question for your career journey. Here is a framework that applies to almost any career challenge.

**The four questions to guide any career decision:**

**1. Where am I now?**
Be honest about your current skills, experience level, and gaps. You cannot navigate without knowing your starting point.

**2. Where do I want to go?**
Define a specific target — a role, an income level, a skill, or a lifestyle. Vague goals produce vague results.

**3. What is the gap?**
List the specific skills, experience, connections, or credentials that stand between where you are and where you want to be.

**4. What is the next single action?**
Identify the one most important thing you can do in the next 24 hours to close that gap, even slightly.

**Reliable career resources:**
- LinkedIn — research roles, follow industry leaders, and build your professional presence
- roadmap.sh — visual learning roadmaps for technical careers
- Glassdoor — research salaries, company cultures, and interview experiences
- freeCodeCamp and Coursera — free and low-cost skill building

**Next step:** Answer the four questions above honestly and share where you are stuck — I will give you more specific guidance.`,

  `That is an important area to get right in your career. Here is practical advice that applies broadly.

**Principles that hold true across almost every career path:**

**Build skills before seeking opportunities**
Employers and clients hire demonstrated ability. The fastest way to open doors is to have something real to show — a project, a portfolio piece, a result.

**Consistency beats intensity**
One hour of focused skill-building every day for six months produces more results than occasional intensive sessions. Small daily actions compound significantly over time.

**Your network is a long-term asset**
The people you know — and who know your work — will open more opportunities than job boards alone. Invest in genuine professional relationships early.

**Specificity gets results**
The clearer you are about what you offer and who you serve, the easier it is for the right opportunities to find you. Generalists struggle to stand out. Specialists attract the right work.

**Document everything**
Keep a record of your projects, results, feedback, and growth. This becomes your portfolio, your interview stories, and your professional identity.

**Next step:** Share more detail about your specific situation and I will give you a more targeted answer.`,
];

// -------------------------
// Pick a fallback response
// Rotates through available options
// to avoid always returning the same text
// -------------------------

let studyFallbackIndex = 0;
let careerFallbackIndex = 0;

function getStudyFallback(): string {
  const response = STUDY_FALLBACKS[studyFallbackIndex % STUDY_FALLBACKS.length];
  studyFallbackIndex += 1;
  return response;
}

function getCareerFallback(): string {
  const response = CAREER_FALLBACKS[careerFallbackIndex % CAREER_FALLBACKS.length];
  careerFallbackIndex += 1;
  return response;
}

// -------------------------
// Main fallback function
// Called by engine when all
// other sources return nothing
// -------------------------

export function buildFallbackResponse(
  mode: Mode,
  searchExhausted: boolean
): EngineResponse {
  const content =
    mode === "study" ? getStudyFallback() : getCareerFallback();

  return {
    content,
    source: "fallback",
    mode,
    cached: false,
    upgradePrompt: searchExhausted ? UPGRADE_PROMPT : undefined,
  };
}

// -------------------------
// Inline upgrade prompt builder
// Used when a partial answer is returned
// but search or knowledge base was limited
// -------------------------

export function appendUpgradePrompt(content: string): string {
  return `${content}\n\n---\n${UPGRADE_PROMPT}`;
}
