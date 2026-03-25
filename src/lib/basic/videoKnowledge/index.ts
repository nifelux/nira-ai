// src/lib/basic/videoKnowledge/index.ts

import { VideoEntry } from "@/types/chat";

import { biologyVideos } from "./biology";
import { biologyPracticalVideos } from "./biologyPractical";
import { chemistryVideos } from "./chemistry";
import { chemistryPracticalVideos } from "./chemistryPractical";
import { physicsVideos } from "./physics";
import { physicsPracticalVideos } from "./physicsPractical";
import { agriculturalScienceVideos } from "./agriculturalScience";
import { mathematicsVideos } from "./mathematics";
import { furtherMathematicsVideos } from "./furtherMathematics";
import { accountingVideos } from "./accounting";
import { commerceVideos } from "./commerce";
import { economicsVideos } from "./economics";
import { englishVideos } from "./english";
import { literatureVideos } from "./literature";
import { governmentVideos } from "./government";
import { historyVideos } from "./history";
import { geographyVideos } from "./geography";
import { civicEducationVideos } from "./civicEducation";
import { crsVideos } from "./crs";
import { irsVideos } from "./irs";
import { computerScienceVideos } from "./computerScience";
import { yorubaVideos } from "./yoruba";
import { igboVideos } from "./igbo";
import { hausaVideos } from "./hausa";

// -------------------------
// Combined study video knowledge
// All 24 topic arrays merged into one
// Engine imports only from here
// -------------------------

export const allStudyVideoKnowledge: VideoEntry[] = [
  ...biologyVideos,
  ...biologyPracticalVideos,
  ...chemistryVideos,
  ...chemistryPracticalVideos,
  ...physicsVideos,
  ...physicsPracticalVideos,
  ...agriculturalScienceVideos,
  ...mathematicsVideos,
  ...furtherMathematicsVideos,
  ...accountingVideos,
  ...commerceVideos,
  ...economicsVideos,
  ...englishVideos,
  ...literatureVideos,
  ...governmentVideos,
  ...historyVideos,
  ...geographyVideos,
  ...civicEducationVideos,
  ...crsVideos,
  ...irsVideos,
  ...computerScienceVideos,
  ...yorubaVideos,
  ...igboVideos,
  ...hausaVideos,
];
