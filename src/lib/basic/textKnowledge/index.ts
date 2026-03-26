// src/lib/basic/textKnowledge/index.ts

import { KnowledgeEntry, StudySubject } from "@/types/chat";

import { biologyEntries } from "./biology";
import { biologyPracticalEntries } from "./biologyPractical";
import { chemistryEntries } from "./chemistry";
import { chemistryPracticalEntries } from "./chemistryPractical";
import { physicsEntries } from "./physics";
import { physicsPracticalEntries } from "./physicsPractical";
import { agriculturalScienceEntries } from "./agriculturalScience";
import { mathematicsEntries } from "./mathematics";
import { furtherMathematicsEntries } from "./furtherMathematics";
import { accountingEntries } from "./accounting";
import { commerceEntries } from "./commerce";
import { economicsEntries } from "./economics";
import { englishEntries } from "./english";
import { literatureEntries } from "./literature";
import { governmentEntries } from "./government";
import { historyEntries } from "./history";
import { geographyEntries } from "./geography";
import { civicEducationEntries } from "./civicEducation";
import { crsEntries } from "./crs";
import { irsEntries } from "./irs";
import { computerScienceEntries } from "./computerScience";
import { yorubaEntries } from "./yoruba";
import { igboEntries } from "./igbo";
import { hausaEntries } from "./hausa";

// -------------------------
// Subject text knowledge map
// Keyed by StudySubject for
// direct O(1) subject lookup
//
// Engine usage:
// - subject detected  → studyTextKnowledge[subject]
// - no subject        → Object.values(studyTextKnowledge).flat()
//
// To add content: edit the subject file only.
// This file never needs to change.
// -------------------------

export const studyTextKnowledge: Record<StudySubject, KnowledgeEntry[]> = {
  biology:              biologyEntries,
  biologyPractical:     biologyPracticalEntries,
  chemistry:            chemistryEntries,
  chemistryPractical:   chemistryPracticalEntries,
  physics:              physicsEntries,
  physicsPractical:     physicsPracticalEntries,
  agriculturalScience:  agriculturalScienceEntries,
  mathematics:          mathematicsEntries,
  furtherMathematics:   furtherMathematicsEntries,
  accounting:           accountingEntries,
  commerce:             commerceEntries,
  economics:            economicsEntries,
  english:              englishEntries,
  literature:           literatureEntries,
  government:           governmentEntries,
  history:              historyEntries,
  geography:            geographyEntries,
  civicEducation:       civicEducationEntries,
  crs:                  crsEntries,
  irs:                  irsEntries,
  computerScience:      computerScienceEntries,
  yoruba:               yorubaEntries,
  igbo:                 igboEntries,
  hausa:                hausaEntries,
};

// -------------------------
// Flat array of all entries
// Used when no subject is detected
// -------------------------

export const allStudyTextKnowledge: KnowledgeEntry[] =
  Object.values(studyTextKnowledge).flat();
