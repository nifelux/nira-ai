// src/lib/basic/studyKnowledgeBase.ts

import { KnowledgeEntry } from "@/types/chat";

export const studyKnowledgeBase: KnowledgeEntry[] = [

  // -------------------------
  // Learning & Study Skills
  // -------------------------

  {
    keywords: ["how to study", "study tips", "study better", "study effectively", "improve studying"],
    mode: "study",
    answer: `Here are proven strategies to study more effectively:

**1. Use Active Recall**
Instead of re-reading notes, close them and try to recall the information from memory. This forces your brain to retrieve and strengthen knowledge.

**2. Apply Spaced Repetition**
Review material at increasing intervals — after 1 day, 3 days, 1 week, then 2 weeks. This fights the forgetting curve and builds long-term retention.

**3. Use the Pomodoro Technique**
Study in focused 25-minute blocks with 5-minute breaks. After 4 blocks, take a longer 20-minute break. This maintains concentration and prevents burnout.

**4. Eliminate Distractions**
Put your phone on silent and away from your desk. Use tools like Forest or website blockers during study sessions.

**5. Teach What You Learn**
Explain concepts out loud or in writing as if teaching someone else. This reveals gaps in your understanding quickly.

**Next step:** Pick one technique above and apply it to your very next study session.`,
  },

  {
    keywords: ["pomodoro", "pomodoro technique", "time blocking", "focus timer"],
    mode: "study",
    answer: `The Pomodoro Technique is a time management method designed to improve focus and reduce mental fatigue.

**How it works:**
1. Choose one task to focus on
2. Set a timer for 25 minutes — this is one Pomodoro
3. Work on the task with zero interruptions until the timer rings
4. Take a 5-minute break
5. After every 4 Pomodoros, take a longer break of 20 to 30 minutes

**Why it works:**
- Creates urgency that reduces procrastination
- Breaks large tasks into manageable chunks
- Makes progress measurable and visible
- Regular breaks prevent mental fatigue

**Tools you can use:**
- Pomofocus.io (free, browser-based)
- Forest app (mobile, gamified)
- Any basic phone timer works just as well

**Next step:** Set a 25-minute timer right now and work on one specific task without switching tabs.`,
  },

  {
    keywords: ["note taking", "how to take notes", "better notes", "note taking methods", "cornell notes"],
    mode: "study",
    answer: `Effective note-taking is one of the highest-leverage study skills you can build.

**Top note-taking methods:**

**1. Cornell Method**
Divide your page into three sections:
- Right column (70%): Main notes during the lecture
- Left column (30%): Keywords and questions after class
- Bottom section: A summary in your own words
This forces active processing after every session.

**2. Mind Mapping**
Start with the main topic in the center and branch out into subtopics. Great for visual learners and understanding how concepts connect.

**3. Outline Method**
Use headings and bullet points in a hierarchy. Best for structured subjects like history or law.

**4. The Feynman Method**
Write notes as if explaining to a beginner. Gaps in your explanation reveal exactly what you do not yet understand.

**Key principles for all methods:**
- Use your own words, not copied text
- Leave white space for additions later
- Review and refine notes within 24 hours

**Next step:** Choose one method and apply it to your next lecture or reading session.`,
  },

  {
    keywords: ["memory", "memorize", "memorization", "remember better", "how to remember"],
    mode: "study",
    answer: `Strong memorization comes from using the right techniques, not from reading more times.

**Most effective memorization techniques:**

**1. Spaced Repetition**
Review information at growing intervals. Use apps like Anki which automate the scheduling for you based on how well you recalled each item.

**2. Mnemonics**
Create memory shortcuts using acronyms, rhymes, or vivid mental images. For example, ROYGBIV for the colors of the rainbow.

**3. Chunking**
Group information into meaningful clusters. A phone number is easier to remember as 080-345-6789 than as 08034567890.

**4. The Memory Palace**
Mentally place information along a familiar route or location. Walk through it in your mind to recall the items in order.

**5. Active Recall**
Test yourself repeatedly instead of reviewing passively. Flashcards, practice questions, and self-quizzing are all forms of active recall.

**Next step:** Create 10 flashcards on a topic you are currently studying and test yourself tonight.`,
  },

  {
    keywords: ["concentration", "focus", "can't focus", "distracted", "stay focused", "attention"],
    mode: "study",
    answer: `Struggling to concentrate is extremely common. Here is how to fix it systematically.

**Root causes to address first:**
- Phone notifications pulling attention every few minutes
- Studying in a noisy or uncomfortable environment
- Trying to study when tired or hungry
- Tasks that feel too large and overwhelming

**Practical fixes:**

**1. Design your environment**
Study in the same dedicated space every time. Remove your phone from the room or use app blockers. Your brain will associate the space with focus over time.

**2. Start with the two-minute rule**
If you cannot focus, commit to just two minutes on the task. Starting is the hardest part. Momentum builds from there.

**3. Manage your energy, not just your time**
Study your hardest subjects when your energy is naturally highest — for most people this is in the morning.

**4. Use background sound strategically**
Low-fi music, brown noise, or white noise can mask distracting sounds without adding cognitive load.

**5. Single-task deliberately**
Close every tab and app unrelated to your current task. Multitasking reduces the quality of both tasks significantly.

**Next step:** Identify your single biggest distraction and remove it before your next study session.`,
  },

  // -------------------------
  // Exam Preparation
  // -------------------------

  {
    keywords: ["exam preparation", "how to prepare for exam", "exam tips", "study for exam", "test preparation"],
    mode: "study",
    answer: `A structured exam preparation plan makes the difference between cramming and truly performing well.

**4-week exam preparation framework:**

**Week 1 — Audit and plan**
- List all topics on the exam syllabus
- Identify which topics you understand well and which need work
- Gather past exam papers if available

**Week 2 — Content review**
- Work through weak topics systematically
- Create concise summary notes for each topic
- Do not highlight — summarize in your own words

**Week 3 — Active practice**
- Solve past exam questions under timed conditions
- Focus especially on question types you find difficult
- Review every wrong answer and understand why it was wrong

**Week 4 — Consolidation**
- Do full timed practice papers
- Review summary notes, not full material
- Rest well the final two nights before the exam

**On exam day:**
- Eat a real meal beforehand
- Read every question carefully before answering
- Attempt all questions — never leave blanks

**Next step:** Write out your full list of exam topics today and mark each one as strong, okay, or weak.`,
  },

  {
    keywords: ["procrastination", "procrastinating", "can't start", "keep delaying", "avoid studying"],
    mode: "study",
    answer: `Procrastination is almost always caused by emotional avoidance, not laziness. Here is how to deal with it directly.

**Why you procrastinate:**
- The task feels overwhelming or unclear
- Fear of failure or doing it wrong
- Low immediate reward compared to other activities
- Decision fatigue about where to even start

**Proven strategies to overcome it:**

**1. Shrink the task**
Do not write "study chemistry." Write "read pages 12 to 18 of chapter 3." A specific small task is much easier to start.

**2. Use implementation intentions**
Plan exactly when and where you will do the task. Research shows that "I will study at 4pm at my desk" works far better than "I will study later."

**3. Remove the escape route**
Put your phone in another room. Close social media. Make the distraction harder to reach than the work.

**4. Use a body double**
Study in a library, café, or with a friend nearby. The presence of others working creates accountability even without direct interaction.

**5. Reward completion, not effort**
Give yourself a specific reward only after completing the task, not during. This trains your brain to associate finishing with positive feeling.

**Next step:** Write down one specific study task with a start time and location for today.`,
  },

  // -------------------------
  // Mathematics
  // -------------------------

  {
    keywords: ["mathematics", "maths", "math tips", "how to get better at math", "improve math"],
    mode: "study",
    answer: `Mathematics is a skill built through consistent practice, not natural talent.

**Core principles for improving at maths:**

**1. Understand before memorizing**
Do not memorize formulas you do not understand. Know what each formula represents and when to apply it. Understanding makes formulas memorable on their own.

**2. Practice problems daily**
Even 15 to 20 minutes of daily problem-solving is more effective than 3 hours once a week. Consistency builds pattern recognition.

**3. Work through errors carefully**
When you get a problem wrong, do not just check the answer. Redo the problem from scratch and identify exactly which step broke down.

**4. Build from foundations**
If advanced topics are confusing, the issue is almost always a gap in a foundational concept. Identify and fix it before moving forward.

**5. Write out every step**
Do not skip steps in your working. Clear written steps help you spot errors and build disciplined problem-solving habits.

**Useful free resources:**
- Khan Academy — complete maths curriculum from basics to advanced
- Paul's Online Math Notes — excellent for calculus and algebra
- Wolfram Alpha — useful for checking your working step by step

**Next step:** Pick the maths topic causing you the most trouble and find 10 practice problems on it today.`,
  },

  // -------------------------
  // Science
  // -------------------------

  {
    keywords: ["science", "biology", "chemistry", "physics", "how to study science"],
    mode: "study",
    answer: `Science subjects combine conceptual understanding with practical application. Here is how to approach them effectively.

**Study strategies for science:**

**1. Master the concepts before the formulas**
Formulas without understanding are useless under exam pressure. Know what each variable represents and what the formula is actually describing.

**2. Use diagrams actively**
Draw and label diagrams from memory rather than just reading them. Biological processes, chemical reactions, and physics setups all become clearer through drawing.

**3. Connect topics to real-world examples**
Biology topics become more memorable when connected to real diseases, ecosystems, or body functions. Physics laws make more sense through real engineering examples.

**4. Practice calculation problems systematically**
For chemistry and physics, work through problem sets by topic. Identify your weak problem types and drill those specifically.

**5. Use past papers**
Science exam questions follow predictable patterns. Past papers are the most reliable guide to what will appear and how answers should be structured.

**Subject-specific tips:**
- Biology: Focus on understanding processes and cycles, not just memorizing terms
- Chemistry: Master balancing equations and understand the periodic table patterns
- Physics: Unit analysis and formula derivation are key exam skills

**Next step:** Identify which science topic has the most exam weight and schedule a dedicated session for it this week.`,
  },

  // -------------------------
  // Writing & Essays
  // -------------------------

  {
    keywords: ["essay writing", "how to write an essay", "essay structure", "academic writing", "writing tips"],
    mode: "study",
    answer: `A well-structured essay communicates your thinking clearly and earns better marks regardless of the subject.

**Core essay structure:**

**Introduction**
- Open with a hook or a clear statement of the topic
- Provide brief context if needed
- End with a clear thesis statement that states your argument or position

**Body paragraphs**
Use the PEEL structure for each paragraph:
- Point: State the paragraph's main idea
- Evidence: Support it with facts, quotes, or examples
- Explanation: Analyze how the evidence supports your point
- Link: Connect back to your thesis or lead into the next paragraph

**Conclusion**
- Restate your thesis in different words
- Summarize your key arguments briefly
- End with a broader insight or implication — do not introduce new evidence

**Common essay mistakes to avoid:**
- Starting sentences with "I think" in formal academic essays
- Using long quotes as a substitute for your own analysis
- Going off-topic in body paragraphs
- Weak conclusions that just repeat the introduction

**Next step:** Outline your next essay using the PEEL structure before writing a single full sentence.`,
  },

  // -------------------------
  // Study Planning
  // -------------------------

  {
    keywords: ["study plan", "study schedule", "how to plan studies", "study timetable", "organize study"],
    mode: "study",
    answer: `A realistic study plan turns overwhelming workloads into manageable daily actions.

**How to build an effective study plan:**

**Step 1 — List your subjects and deadlines**
Write out every subject, assignment, and exam with its due date or exam date. Seeing everything in one place removes the anxiety of the unknown.

**Step 2 — Estimate time per topic**
Be realistic. Estimate how many hours each topic needs based on its difficulty and your current level of understanding.

**Step 3 — Work backwards from deadlines**
Start from each deadline and assign study blocks working backwards to today. This ensures you never run out of time.

**Step 4 — Block your schedule**
Use a weekly calendar and assign specific subjects to specific time slots. Treat them like fixed appointments.

**Step 5 — Build in review time**
Reserve the final 20% of your available time before a deadline for review, practice papers, and consolidation. Do not fill every hour with new content.

**Step 6 — Review and adjust weekly**
At the end of each week, assess what was completed and adjust the following week accordingly. Rigid plans that do not adapt always fail.

**Tools:**
- Notion or Google Sheets for a weekly timetable
- Google Calendar for time blocking with reminders
- Todoist for daily task lists

**Next step:** Block out your study sessions for the next 7 days on a calendar right now.`,
  },

  // -------------------------
  // Reading & Comprehension
  // -------------------------

  {
    keywords: ["reading comprehension", "how to read faster", "understand what i read", "reading strategies", "textbook reading"],
    mode: "study",
    answer: `Reading a textbook and actually retaining it are two very different things. Here is how to bridge that gap.

**The SQ3R reading method:**

**S — Survey**
Before reading, skim the headings, subheadings, diagrams, and summary. Build a mental map of the chapter first.

**Q — Question**
Turn each heading into a question. For example, "The Water Cycle" becomes "How does the water cycle work?" This gives your reading a purpose.

**R — Read**
Read actively to answer your questions. Do not highlight everything — only mark what directly answers your questions.

**R — Recite**
After each section, close the book and summarize what you just read in your own words. This is the most important step.

**R — Review**
After finishing the chapter, go back and review your summaries and questions without looking at the text.

**Additional tips:**
- Read in focused blocks of 25 to 30 minutes with short breaks
- Avoid re-reading paragraphs passively — if you did not understand, slow down on the first read
- Annotate in the margins with your own short comments and questions

**Next step:** Apply the SQ3R method to the next chapter or article you need to read today.`,
  },
];

// -------------------------
// Lookup function
// -------------------------

export function findStudyAnswer(query: string): KnowledgeEntry | null {
  const normalized = query.trim().toLowerCase();

  for (const entry of studyKnowledgeBase) {
    const matched = entry.keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase())
    );
    if (matched) return entry;
  }

  return null;
}