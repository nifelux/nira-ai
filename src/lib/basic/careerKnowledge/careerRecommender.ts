// src/lib/basic/careerKnowledge/careerRecommender.ts

import { careerProfiles, CareerProfile } from "./careerProfiles";

// -------------------------
// User situation input
// -------------------------

export interface UserSituation {
  interests: string[];
  hasLaptop: boolean;
  hasInternet: boolean;
  prefersRemote: boolean;
  isAbsoluteBeginner: boolean;
  budget: "zero" | "low" | "medium" | "high";
  incomeGoal: "any" | "medium" | "high" | "very_high";
  willingToStudyMonths: number;
  physicallyChallenged?: boolean;
}

// -------------------------
// Scored recommendation
// -------------------------

export interface CareerRecommendation {
  profile: CareerProfile;
  score: number;
  reasons: string[];
  warnings: string[];
}

// -------------------------
// Score a single career profile
// against the user's situation
// -------------------------

function scoreProfile(
  profile: CareerProfile,
  user: UserSituation
): CareerRecommendation {
  let score = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // --- Laptop requirement ---
  if (profile.requiresLaptop && !user.hasLaptop) {
    score -= 40;
    warnings.push("Requires a laptop or computer");
  } else if (!profile.requiresLaptop) {
    if (!user.hasLaptop) {
      score += 15;
      reasons.push("Does not require a laptop");
    }
  }

  // --- Internet requirement ---
  if (profile.requiresInternet && !user.hasInternet) {
    score -= 30;
    warnings.push("Requires reliable internet access");
  }

  // --- Remote preference ---
  if (user.prefersRemote && profile.remoteFriendly) {
    score += 20;
    reasons.push("Can be done fully remotely");
  }
  if (user.prefersRemote && !profile.remoteFriendly) {
    score -= 15;
    warnings.push("Requires physical presence");
  }

  // --- Beginner friendliness ---
  if (user.isAbsoluteBeginner) {
    if (profile.beginnerFriendly) {
      score += 25;
      reasons.push("Very beginner-friendly — you can start with no prior experience");
    }
    if (profile.entryDifficulty === "advanced") {
      score -= 20;
      warnings.push("Advanced entry level — requires significant learning first");
    }
  }

  // --- Budget vs startup cost ---
  const budgetMap = { zero: 0, low: 1, medium: 2, high: 3 };
  const costMap = { free: 0, low: 1, medium: 2, high: 3 };
  const userBudget = budgetMap[user.budget];
  const profileCost = costMap[profile.startupCost];

  if (profileCost <= userBudget) {
    score += 15;
    if (profileCost === 0) reasons.push("Free to start — no capital required");
  } else {
    score -= 20;
    warnings.push(`Requires ${profile.startupCost} startup investment`);
  }

  // --- Income goal ---
  const incomeMap = { any: 0, medium: 1, high: 2, very_high: 3 };
  const profileIncome = incomeMap[profile.incomePotential as keyof typeof incomeMap] ?? 0;
  const goalIncome = incomeMap[user.incomeGoal];

  if (profileIncome >= goalIncome) {
    score += 20;
    if (profile.incomePotential === "very_high") {
      reasons.push("Very high income potential");
    } else if (profile.incomePotential === "high") {
      reasons.push("High income potential");
    }
  } else {
    score -= 10;
    warnings.push(`Income potential (${profile.incomePotential}) may not meet your goal`);
  }

  // --- Africa demand ---
  if (profile.africaDemand === "very_high") {
    score += 20;
    reasons.push("Very high demand across Africa");
  } else if (profile.africaDemand === "high") {
    score += 12;
    reasons.push("High demand in Africa");
  } else if (profile.africaDemand === "growing") {
    score += 6;
    reasons.push("Growing demand in Africa");
  }

  // --- Time to first income vs willingness to study ---
  const timeToIncomeMap: Record<string, number> = {
    "1–2 weeks": 0.5,
    "1–4 weeks": 1,
    "2–6 weeks": 1.5,
    "1–3 months": 2,
    "2–4 months": 3,
    "3–6 months": 4,
    "4–8 months": 5,
    "4–9 months": 6,
    "6–12 months": 8,
    "6–18 months": 10,
    "8–15 months": 10,
    "8–18 months": 12,
    "12–24 months": 15,
    "3–5 years": 40,
    "4–6 years": 48,
    "4–7 years": 50,
    "5–6 years": 55,
  };

  const estimatedMonths = timeToIncomeMap[profile.timeToFirstIncome] ?? 12;
  if (estimatedMonths <= user.willingToStudyMonths) {
    score += 10;
    reasons.push(`Can earn income within your ${user.willingToStudyMonths}-month timeline`);
  } else {
    score -= Math.min(15, (estimatedMonths - user.willingToStudyMonths) * 2);
    warnings.push(`Takes longer than ${user.willingToStudyMonths} months to start earning`);
  }

  // --- Interest keyword matching ---
  const normalizedInterests = user.interests.map((i) => i.toLowerCase());
  const keywordMatches = profile.keywords.filter((kw) =>
    normalizedInterests.some(
      (interest) => kw.includes(interest) || interest.includes(kw)
    )
  ).length;

  score += keywordMatches * 15;
  if (keywordMatches > 0) {
    reasons.push(`Matches your interests: ${profile.keywords.slice(0, 2).join(", ")}`);
  }

  // --- Physical presence for physically challenged ---
  if (user.physicallyChallenged && profile.requiresPhysicalPresence) {
    score -= 25;
    warnings.push("Requires physical presence — may be challenging");
  }

  return { profile, score, reasons, warnings };
}

// -------------------------
// Main recommender function
// Scores all profiles and returns
// the top matches ranked by score
// -------------------------

export function recommendCareers(
  user: UserSituation,
  topN: number = 5
): CareerRecommendation[] {
  const scored = careerProfiles
    .map((profile) => scoreProfile(profile, user))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}

// -------------------------
// Format recommendations into
// a clean NIRA-style response string
// -------------------------

export function formatRecommendations(
  recommendations: CareerRecommendation[],
  user: UserSituation
): string {
  if (recommendations.length === 0) {
    return `Based on what you have shared, I was not able to find strong matches in my current database. Try broadening your interests or adjusting your requirements.

**Next step:** Tell me more about what kind of work excites you — hands-on, creative, digital, or business?`;
  }

  const lines: string[] = [
    "Based on your situation, here are the career paths that best match you:",
    "",
  ];

  recommendations.forEach((rec, i) => {
    lines.push(`**${i + 1}. ${rec.profile.title}**`);
    lines.push(`Category: ${rec.profile.category}`);
    lines.push(`Entry difficulty: ${rec.profile.entryDifficulty}`);
    lines.push(`Income potential: ${rec.profile.incomePotential}`);
    lines.push(`Time to first income: ${rec.profile.timeToFirstIncome}`);

    if (rec.reasons.length > 0) {
      lines.push(`Why it fits you: ${rec.reasons.slice(0, 2).join("; ")}`);
    }

    if (rec.warnings.length > 0) {
      lines.push(`Things to consider: ${rec.warnings[0]}`);
    }

    lines.push("");
  });

  lines.push(`**Next step:** Pick the career that excites you most from this list and ask me how to get started.`);

  return lines.join("\n");
}
