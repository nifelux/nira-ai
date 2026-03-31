// src/lib/basic/careerKnowledge/careerQuestionFlow.ts

import { UserSituation } from "./careerRecommender";

// -------------------------
// Question types
// -------------------------

export type QuestionType = "single_choice" | "multi_choice" | "yes_no" | "number";

export interface FlowQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
}

export interface FlowAnswer {
  questionId: string;
  value: string | string[] | number | boolean;
}

// -------------------------
// Career recommendation question flow
// 8 questions to build a UserSituation
// -------------------------

export const careerQuestionFlow: FlowQuestion[] = [
  {
    id: "has_laptop",
    text: "Do you have a laptop or desktop computer you can use regularly?",
    type: "yes_no",
    options: ["Yes", "No"],
  },
  {
    id: "has_internet",
    text: "Do you have reliable internet access at home or nearby?",
    type: "yes_no",
    options: ["Yes", "No"],
  },
  {
    id: "prefers_remote",
    text: "Would you prefer to work from home or remotely?",
    type: "yes_no",
    options: ["Yes, I want to work remotely", "No, I am okay with physical work"],
  },
  {
    id: "is_beginner",
    text: "How would you describe your current experience level?",
    type: "single_choice",
    options: [
      "Complete beginner — no professional skills yet",
      "Some basic skills but not earning from them",
      "I have skills but want a new direction",
      "Experienced and looking to scale",
    ],
  },
  {
    id: "budget",
    text: "What is your current budget to invest in starting a career or business?",
    type: "single_choice",
    options: [
      "Zero — I need to start for free",
      "Small — I can invest up to ₦50,000",
      "Medium — I can invest ₦50,000–₦300,000",
      "Higher — I can invest more than ₦300,000",
    ],
  },
  {
    id: "income_goal",
    text: "What is your income goal once you are established?",
    type: "single_choice",
    options: [
      "Any income is fine — I just need to start",
      "Medium income — ₦100,000–₦300,000/month",
      "High income — ₦400,000–₦1,000,000/month",
      "Very high income — ₦1,000,000+/month or international rates",
    ],
  },
  {
    id: "study_months",
    text: "How many months are you willing to learn or train before you start earning?",
    type: "single_choice",
    options: [
      "I need to earn within 1 month",
      "I can learn for 1–3 months",
      "I can learn for 3–6 months",
      "I can learn for 6–12 months or more",
    ],
  },
  {
    id: "interests",
    text: "Which of these areas interest you? (Select all that apply)",
    type: "multi_choice",
    options: [
      "Technology and coding",
      "Design and creativity",
      "Writing and communication",
      "Teaching and education",
      "Business and sales",
      "Healthcare and helping people",
      "Agriculture and food",
      "Trades and technical work",
      "Finance and money",
      "Media and entertainment",
      "Law and governance",
      "Remote work and flexibility",
    ],
  },
];

// -------------------------
// Interest keyword mapping
// Converts interest selections to
// keywords for the recommender
// -------------------------

const INTEREST_KEYWORD_MAP: Record<string, string[]> = {
  "Technology and coding": ["coding", "programming", "software", "technology", "apps", "data"],
  "Design and creativity": ["design", "creative", "visual", "art", "animation", "ui"],
  "Writing and communication": ["writing", "copywriting", "content", "language", "documentation"],
  "Teaching and education": ["teaching", "education", "tutoring", "training", "learning"],
  "Business and sales": ["business", "sales", "ecommerce", "entrepreneur", "marketing", "freelancing"],
  "Healthcare and helping people": ["healthcare", "medical", "nursing", "pharmacy", "caring"],
  "Agriculture and food": ["farming", "agriculture", "food", "crops", "agribusiness"],
  "Trades and technical work": ["electrical", "plumbing", "mechanical", "solar", "trades"],
  "Finance and money": ["finance", "accounting", "investment", "money", "financial"],
  "Media and entertainment": ["media", "video", "podcast", "music", "content", "photography"],
  "Law and governance": ["law", "legal", "governance", "justice", "advocacy"],
  "Remote work and flexibility": ["remote", "freelancing", "online", "flexible", "location-independent"],
};

// -------------------------
// Convert raw answers into
// a UserSituation object
// -------------------------

export function processAnswers(answers: FlowAnswer[]): UserSituation {
  const get = (id: string) => answers.find((a) => a.questionId === id)?.value;

  const hasLaptop = get("has_laptop") === "Yes";
  const hasInternet = get("has_internet") === "Yes";
  const prefersRemote = get("prefers_remote") === "Yes, I want to work remotely";

  const beginnerAnswer = get("is_beginner") as string ?? "";
  const isAbsoluteBeginner = beginnerAnswer.includes("Complete beginner");

  const budgetAnswer = get("budget") as string ?? "";
  const budget: UserSituation["budget"] =
    budgetAnswer.includes("Zero") ? "zero"
      : budgetAnswer.includes("Small") ? "low"
      : budgetAnswer.includes("Medium") ? "medium"
      : "high";

  const incomeAnswer = get("income_goal") as string ?? "";
  const incomeGoal: UserSituation["incomeGoal"] =
    incomeAnswer.includes("Any income") ? "any"
      : incomeAnswer.includes("Medium") ? "medium"
      : incomeAnswer.includes("High income") ? "high"
      : "very_high";

  const monthsAnswer = get("study_months") as string ?? "";
  const willingToStudyMonths: number =
    monthsAnswer.includes("1 month") ? 1
      : monthsAnswer.includes("1–3") ? 3
      : monthsAnswer.includes("3–6") ? 6
      : 12;

  const interestSelections = (get("interests") as string[] ?? []);
  const interests: string[] = interestSelections.flatMap(
    (selection) => INTEREST_KEYWORD_MAP[selection] ?? []
  );

  return {
    hasLaptop,
    hasInternet,
    prefersRemote,
    isAbsoluteBeginner,
    budget,
    incomeGoal,
    willingToStudyMonths,
    interests,
  };
}

// -------------------------
// Get the intro message NIRA
// sends before starting the
// question flow
// -------------------------

export const CAREER_QUIZ_INTRO = `Let me ask you a few quick questions so I can recommend the best career path for your situation.

This takes about 2 minutes and the more honest you are, the better my recommendations will be.

**Next step:** Answer the first question below and I will guide you through the rest.`;

// -------------------------
// Get the question NIRA should
// ask at step N in the flow
// -------------------------

export function getQuestion(step: number): FlowQuestion | null {
  return careerQuestionFlow[step] ?? null;
}

export function getTotalSteps(): number {
  return careerQuestionFlow.length;
}
