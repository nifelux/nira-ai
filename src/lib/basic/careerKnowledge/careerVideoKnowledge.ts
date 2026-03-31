// src/lib/basic/careerKnowledge/careerVideoKnowledge.ts

export interface CareerVideoSegment {
  start: number;        // seconds
  end: number;          // seconds
  text: string;
  keywords: string[];
}

export interface CareerVideoEntry {
  videoId: string;
  title: string;
  careerTitle: string;
  description: string;
  segments: CareerVideoSegment[];
}

// -------------------------
// Career video knowledge base
// Empty array — ready to fill
// with real video transcript segments
// following the same VideoEntry
// pattern used in study videoKnowledge
// -------------------------

export const careerVideoEntries: CareerVideoEntry[] = [];
