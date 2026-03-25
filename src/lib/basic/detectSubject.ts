// src/lib/basic/detectSubject.ts

import { StudySubject, SubjectDetectionResult } from "@/types/chat";

// -------------------------
// Minimum confidence score
// required to return a subject.
// Scores are out of 100.
// -------------------------

const MIN_CONFIDENCE_THRESHOLD = 30;

// -------------------------
// Subject keyword map
// Each subject has a weighted
// keyword list:
// - primary keywords score 20
// - secondary keywords score 10
// - weak keywords score 5
// -------------------------

interface SubjectKeywords {
  primary: string[];
  secondary: string[];
  weak: string[];
}

const SUBJECT_KEYWORDS: Record<StudySubject, SubjectKeywords> = {

  biology: {
    primary: [
      "biology", "cell", "organism", "photosynthesis", "respiration",
      "genetics", "dna", "rna", "evolution", "ecosystem", "osmosis",
      "diffusion", "mitosis", "meiosis", "enzyme", "chromosome",
      "protein", "nucleus", "membrane", "chlorophyll",
    ],
    secondary: [
      "plant", "animal", "bacteria", "virus", "fungi", "living",
      "tissue", "organ", "blood", "heart", "lung", "liver", "kidney",
      "reproduction", "seed", "leaf", "root", "stem", "hormone",
    ],
    weak: [
      "body", "growth", "health", "species", "habitat", "food chain",
      "nutrition", "breath", "oxygen", "carbon dioxide",
    ],
  },

  biologyPractical: {
    primary: [
      "biology practical", "biology experiment", "biology lab",
      "microscope", "slide preparation", "staining", "dissection",
      "biology specimen", "benedict test", "iodine test",
      "biuret test", "fehling solution",
    ],
    secondary: [
      "practical biology", "biology observation", "biology apparatus",
      "coverslip", "testube biology", "beaker biology",
    ],
    weak: [
      "biology result", "biology procedure", "biology method",
    ],
  },

  chemistry: {
    primary: [
      "chemistry", "atom", "molecule", "element", "compound",
      "reaction", "acid", "base", "alkali", "ph", "oxidation",
      "reduction", "electron", "proton", "neutron", "periodic table",
      "covalent bond", "ionic bond", "electrolysis", "titration",
      "mole", "valency", "isomer", "polymer",
    ],
    secondary: [
      "chemical", "formula", "equation", "solution", "solute",
      "solvent", "precipitate", "catalyst", "gas", "liquid",
      "solid", "mixture", "separation", "distillation", "filtration",
      "evaporation", "crystallization", "alloy", "metal", "non-metal",
    ],
    weak: [
      "react", "substance", "matter", "salt", "water", "heat",
      "temperature", "burn", "dissolve", "mineral",
    ],
  },

  chemistryPractical: {
    primary: [
      "chemistry practical", "chemistry experiment", "chemistry lab",
      "titration practical", "qualitative analysis", "quantitative analysis",
      "salt analysis", "chemistry apparatus", "burette", "pipette",
      "conical flask", "indicator", "end point",
    ],
    secondary: [
      "practical chemistry", "chemistry observation", "chemistry procedure",
      "litmus paper", "universal indicator", "flame test",
    ],
    weak: [
      "chemistry result", "chemistry method", "chemistry setup",
    ],
  },

  physics: {
    primary: [
      "physics", "force", "motion", "velocity", "acceleration",
      "gravity", "energy", "work", "power", "wave", "light",
      "sound", "electricity", "magnetism", "newton", "momentum",
      "pressure", "density", "refraction", "reflection",
      "electromagnetic", "nuclear", "quantum",
    ],
    secondary: [
      "mass", "weight", "speed", "distance", "displacement",
      "current", "voltage", "resistance", "circuit", "frequency",
      "amplitude", "wavelength", "lens", "mirror", "heat",
      "temperature", "thermometer", "pendulum",
    ],
    weak: [
      "machine", "pulley", "lever", "incline", "friction",
      "charge", "field", "potential", "capacitor",
    ],
  },

  physicsPractical: {
    primary: [
      "physics practical", "physics experiment", "physics lab",
      "physics apparatus", "vernier caliper", "micrometer screw",
      "physics measurement", "ohm law experiment",
      "physics observation", "ticker tape",
    ],
    secondary: [
      "practical physics", "physics setup", "physics result",
      "ammeter", "voltmeter", "galvanometer",
    ],
    weak: [
      "physics method", "physics procedure", "physics reading",
    ],
  },

  agriculturalScience: {
    primary: [
      "agriculture", "farming", "crop", "soil", "fertilizer",
      "irrigation", "pest", "livestock", "poultry", "planting",
      "harvest", "weed", "manure", "tillage", "agronomy",
      "horticulture", "animal husbandry", "farm",
    ],
    secondary: [
      "seed", "germination", "plantation", "cocoa", "maize",
      "cassava", "yam", "rice", "cattle", "goat", "pig",
      "poultry", "fish farming", "aquaculture", "erosion",
      "compost", "mulching", "rotation",
    ],
    weak: [
      "rural", "land", "plant", "food", "village", "season",
      "rain", "drought", "storage",
    ],
  },

  mathematics: {
    primary: [
      "mathematics", "maths", "algebra", "geometry", "calculus",
      "trigonometry", "quadratic", "equation", "fraction",
      "integer", "matrix", "vector", "probability", "statistics",
      "logarithm", "indices", "sequence", "series", "differentiation",
      "integration", "set theory", "modulo",
    ],
    secondary: [
      "number", "addition", "subtraction", "multiplication",
      "division", "angle", "triangle", "circle", "square",
      "rectangle", "polygon", "gradient", "graph", "coordinate",
      "function", "factor", "prime", "ratio", "percentage",
    ],
    weak: [
      "calculate", "solve", "find", "evaluate", "simplify",
      "compute", "sum", "total", "average", "mean",
    ],
  },

  furtherMathematics: {
    primary: [
      "further mathematics", "further maths", "further math",
      "complex number", "binomial theorem", "differential equation",
      "linear transformation", "eigenvalue", "eigenvector",
      "fourier", "laplace", "z-transform", "numerical method",
    ],
    secondary: [
      "hyperbolic", "parametric", "polar coordinate",
      "curve sketching", "conics", "determinant", "rank",
      "permutation group", "abstract algebra",
    ],
    weak: [
      "advanced maths", "pure mathematics", "applied mathematics",
    ],
  },

  accounting: {
    primary: [
      "accounting", "debit", "credit", "ledger", "journal",
      "trial balance", "balance sheet", "profit and loss",
      "cash flow", "depreciation", "assets", "liabilities",
      "equity", "bookkeeping", "double entry", "financial statement",
      "income statement", "accounts receivable", "accounts payable",
    ],
    secondary: [
      "revenue", "expense", "cost", "invoice", "receipt",
      "bank reconciliation", "stock", "inventory", "payroll",
      "audit", "taxation", "vat", "budget", "forecast",
    ],
    weak: [
      "money", "finance", "business", "transaction", "payment",
      "record", "statement", "report",
    ],
  },

  commerce: {
    primary: [
      "commerce", "trade", "market", "wholesale", "retail",
      "import", "export", "consumer", "producer", "middleman",
      "distribution", "warehouse", "insurance", "banking",
      "commerce definition",
    ],
    secondary: [
      "goods", "services", "supply", "demand", "price",
      "competition", "monopoly", "oligopoly", "transport",
      "communication", "advertising", "brand",
    ],
    weak: [
      "buy", "sell", "shop", "business", "customer", "profit",
    ],
  },

  economics: {
    primary: [
      "economics", "macroeconomics", "microeconomics",
      "gdp", "inflation", "deflation", "monetary policy",
      "fiscal policy", "aggregate demand", "aggregate supply",
      "scarcity", "opportunity cost", "elasticity", "utility",
      "marginal", "equilibrium", "recession", "unemployment",
    ],
    secondary: [
      "market", "price", "wage", "income", "tax", "subsidy",
      "interest rate", "exchange rate", "trade", "production",
      "consumption", "investment", "government spending",
    ],
    weak: [
      "money", "economy", "growth", "develop", "poor", "rich",
      "labour", "capital", "land",
    ],
  },

  english: {
    primary: [
      "english", "grammar", "comprehension", "essay",
      "vocabulary", "noun", "verb", "adjective", "adverb",
      "tense", "clause", "phrase", "sentence structure",
      "punctuation", "spelling", "synonym", "antonym",
      "figure of speech", "idiom", "proverb",
    ],
    secondary: [
      "reading", "writing", "listening", "speaking",
      "paragraph", "topic sentence", "conclusion", "introduction",
      "letter writing", "formal letter", "informal letter",
      "report writing", "summary", "precis",
    ],
    weak: [
      "word", "language", "text", "passage", "story",
      "book", "read", "write",
    ],
  },

  literature: {
    primary: [
      "literature", "poem", "poetry", "prose", "drama",
      "novel", "play", "character", "plot", "theme",
      "setting", "conflict", "protagonist", "antagonist",
      "figurative language", "metaphor", "simile", "symbolism",
      "irony", "satire", "soliloquy", "tragedy", "comedy",
    ],
    secondary: [
      "author", "writer", "stanza", "rhyme", "verse",
      "act", "scene", "dialogue", "monologue",
      "narrative", "literary device", "alliteration",
      "personification", "oxymoron",
    ],
    weak: [
      "book", "story", "read", "text", "passage", "character",
    ],
  },

  government: {
    primary: [
      "government", "constitution", "legislature", "executive",
      "judiciary", "democracy", "monarchy", "federalism",
      "separation of powers", "fundamental rights", "bill of rights",
      "political party", "election", "parliament", "senate",
      "cabinet", "president", "prime minister", "sovereignty",
    ],
    secondary: [
      "citizen", "state", "nation", "law", "policy",
      "voting", "republic", "coup", "revolution", "colonial",
      "independence", "arms of government", "local government",
    ],
    weak: [
      "leader", "power", "rule", "country", "politics",
    ],
  },

  history: {
    primary: [
      "history", "ancient", "medieval", "colonial", "pre-colonial",
      "slave trade", "scramble for africa", "world war",
      "independence movement", "nationalism", "civilization",
      "empire", "dynasty", "revolution", "treaty",
    ],
    secondary: [
      "historical", "century", "era", "period", "event",
      "cause", "effect", "timeline", "artifact", "heritage",
      "migration", "conquest", "war", "peace",
    ],
    weak: [
      "old", "past", "tradition", "culture", "origin",
    ],
  },

  geography: {
    primary: [
      "geography", "map", "latitude", "longitude", "climate",
      "weather", "vegetation", "relief", "erosion", "river",
      "mountain", "plateau", "ocean", "continent", "population",
      "migration", "urbanization", "rock", "mineral",
      "atmosphere", "ecosystem",
    ],
    secondary: [
      "region", "country", "zone", "rainfall", "temperature",
      "wind", "soil", "desert", "forest", "savanna",
      "grassland", "lake", "valley", "delta", "flood plain",
    ],
    weak: [
      "land", "water", "environment", "place", "location",
    ],
  },

  civicEducation: {
    primary: [
      "civic", "civic education", "citizenship", "rights",
      "responsibilities", "national values", "democracy",
      "rule of law", "human rights", "civil society",
      "constitution", "patriotism", "voter education",
    ],
    secondary: [
      "civic duty", "community", "society", "justice",
      "equality", "freedom", "participation", "obligation",
    ],
    weak: [
      "citizen", "nation", "people", "law", "country",
    ],
  },

  crs: {
    primary: [
      "crs", "christian religious studies", "christian religious knowledge",
      "crk", "bible", "jesus", "christ", "god", "holy spirit",
      "gospel", "old testament", "new testament", "parable",
      "epistle", "apostle", "prophet", "covenant", "salvation",
      "baptism", "church",
    ],
    secondary: [
      "prayer", "worship", "faith", "christian", "sermon",
      "disciple", "miracle", "sin", "forgiveness", "heaven",
    ],
    weak: [
      "religion", "spiritual", "moral", "righteous", "holy",
    ],
  },

  irs: {
    primary: [
      "irs", "islamic religious studies", "islamic religious knowledge",
      "irk", "quran", "hadith", "prophet", "muhammad", "allah",
      "islam", "muslim", "salah", "prayer", "fasting", "ramadan",
      "zakah", "hajj", "sunnah", "ummah", "tawhid",
    ],
    secondary: [
      "mosque", "imam", "surah", "verse", "pillar of islam",
      "iman", "taqwa", "hijab", "halal", "haram",
    ],
    weak: [
      "religion", "faith", "worship", "spiritual", "belief",
    ],
  },

  computerScience: {
    primary: [
      "computer", "programming", "software", "hardware",
      "algorithm", "data structure", "binary", "database",
      "network", "internet", "operating system", "compiler",
      "code", "function", "variable", "loop", "array",
      "class", "object", "cpu", "ram", "storage",
    ],
    secondary: [
      "javascript", "python", "java", "html", "css",
      "sql", "linux", "windows", "ip address", "protocol",
      "encryption", "cybersecurity", "artificial intelligence",
      "machine learning", "web development",
    ],
    weak: [
      "tech", "digital", "electronic", "device", "screen",
      "keyboard", "mouse", "printer",
    ],
  },

  yoruba: {
    primary: [
      "yoruba", "ede yoruba", "isoro yoruba", "literature yoruba",
      "oríkì", "àlọ", "ìtàn", "ewì", "àpèjùwe",
      "gírámà yoruba", "ìsọ̀rọ̀ yoruba",
    ],
    secondary: [
      "ìwé yoruba", "ẹ̀kọ́ yoruba", "ede", "ìtumọ̀",
      "àṣà yoruba", "ìbílẹ̀",
    ],
    weak: [
      "naijeria", "tribe", "tongue",
    ],
  },

  igbo: {
    primary: [
      "igbo", "asụsụ igbo", "igbo language", "igbo grammar",
      "igbo literature", "ilu igbo", "akwụkwọ igbo",
      "igbo proverb", "igbo culture",
    ],
    secondary: [
      "igbo writing", "igbo vowel", "igbo tone",
      "igbo dialect", "igbo tradition",
    ],
    weak: [
      "eastern nigeria", "tribe", "dialect",
    ],
  },

  hausa: {
    primary: [
      "hausa", "harshen hausa", "hausa language", "hausa grammar",
      "hausa literature", "kirari", "hausa culture",
      "hausa proverb", "hausa poetry",
    ],
    secondary: [
      "hausa writing", "hausa dialect", "hausa tradition",
      "northern nigeria language",
    ],
    weak: [
      "northern nigeria", "tribe", "dialect",
    ],
  },
};

// -------------------------
// Score a query against a
// single subject's keyword map
// -------------------------

function scoreSubject(
  normalized: string,
  keywords: SubjectKeywords
): number {
  let score = 0;

  for (const keyword of keywords.primary) {
    if (normalized.includes(keyword)) score += 20;
  }
  for (const keyword of keywords.secondary) {
    if (normalized.includes(keyword)) score += 10;
  }
  for (const keyword of keywords.weak) {
    if (normalized.includes(keyword)) score += 5;
  }

  // Cap at 100
  return Math.min(score, 100);
}

// -------------------------
// Main subject detection function
// Returns best subject + confidence
// or null if confidence is too low
// -------------------------

export function detectSubject(query: string): SubjectDetectionResult | null {
  const normalized = query.trim().toLowerCase();

  let bestSubject: StudySubject | null = null;
  let bestScore = 0;

  const subjects = Object.keys(SUBJECT_KEYWORDS) as StudySubject[];

  for (const subject of subjects) {
    const score = scoreSubject(normalized, SUBJECT_KEYWORDS[subject]);
    if (score > bestScore) {
      bestScore = score;
      bestSubject = subject;
    }
  }

  if (!bestSubject || bestScore < MIN_CONFIDENCE_THRESHOLD) {
    return null;
  }

  return {
    subject: bestSubject,
    confidence: bestScore,
  };
}
