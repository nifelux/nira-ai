// src/lib/basic/careerKnowledgeBase.ts

import { KnowledgeEntry } from "@/types/chat";

export const careerKnowledgeBase: KnowledgeEntry[] = [

  // -------------------------
  // Resume Writing
  // -------------------------

  {
    keywords: ["resume", "cv", "write a resume", "resume tips", "how to write a cv", "improve resume", "resume help"],
    mode: "career",
    answer: `A strong resume gets you to the interview. Here is how to build one that works.

**Core resume sections:**

**1. Header**
Full name, professional email, phone number, LinkedIn profile URL, and optionally a GitHub or portfolio link. No photos or personal details like age or marital status.

**2. Professional Summary (2 to 3 lines)**
A concise statement of who you are, your key skills, and the value you bring. Tailor this to each role you apply for.

**3. Work Experience**
List roles in reverse chronological order. For each role include:
- Job title, company name, location, and dates
- 3 to 5 bullet points describing impact, not just duties
- Use action verbs: built, led, increased, reduced, launched, managed
- Quantify results wherever possible: "Increased sales by 30%" beats "Responsible for sales"

**4. Skills**
List technical and relevant soft skills. Match keywords from the job description — many companies use ATS software that filters by keywords before a human reads your resume.

**5. Education**
Degree, institution, graduation year. Add relevant courses or projects if you are early in your career.

**Common resume mistakes:**
- Using one generic resume for every application
- Writing duties instead of achievements
- Including irrelevant experience that dilutes focus
- Spelling and grammar errors — proofread twice

**Format rules:**
- One page for under 5 years experience, two pages maximum for senior roles
- Use a clean single-column layout with consistent fonts
- Save and send as PDF unless instructed otherwise

**Next step:** Review your current resume and rewrite at least three bullet points to lead with action verbs and measurable results.`,
  },

  // -------------------------
  // Cover Letters
  // -------------------------

  {
    keywords: ["cover letter", "how to write a cover letter", "application letter", "cover letter tips", "covering letter"],
    mode: "career",
    answer: `A well-written cover letter explains what your resume cannot — your motivation, personality, and fit for the specific role.

**Cover letter structure:**

**Opening paragraph**
State the role you are applying for and where you found it. Open with a specific and genuine reason why this company or role interests you. Avoid generic openers like "I am writing to apply for..."

**Middle paragraph(s)**
Connect your most relevant experience directly to the job requirements. Pick two or three specific achievements that demonstrate you can do this job. Do not repeat your resume line by line — add context and story.

**Closing paragraph**
Express enthusiasm for the opportunity. State that you would welcome the chance to discuss further. Thank them for their time.

**Key cover letter rules:**
- One page maximum — hiring managers read quickly
- Address it to a specific person if you can find their name
- Customize every cover letter — generic letters get ignored
- Match the tone of the company: formal for corporate roles, more conversational for startups
- Proofread carefully — errors here are instant disqualifiers

**What to avoid:**
- Starting every sentence with "I"
- Restating your resume instead of adding new insight
- Overly long paragraphs and dense blocks of text
- Claiming you are passionate about something without evidence

**Next step:** Find a job you want to apply for and write the opening paragraph of your cover letter today.`,
  },

  // -------------------------
  // Interview Preparation
  // -------------------------

  {
    keywords: ["interview", "job interview", "interview tips", "how to prepare for interview", "interview preparation", "interview questions"],
    mode: "career",
    answer: `Interview performance is a skill you can build with deliberate preparation.

**Before the interview:**
- Research the company thoroughly: their product, mission, recent news, and competitors
- Re-read the job description and map your experience to every key requirement
- Prepare specific examples from your past experience using the STAR method
- Prepare 5 to 7 questions to ask the interviewer — it signals genuine interest

**The STAR method for behavioural questions:**
Use this structure to answer any "Tell me about a time when..." question:
- **Situation:** Set the context briefly
- **Task:** Describe your responsibility in that situation
- **Action:** Explain exactly what you did and why
- **Result:** Share the measurable outcome

**Common interview questions and how to approach them:**

*"Tell me about yourself"*
Give a 90-second professional summary: current role or background, key skills, and why you are interested in this opportunity. Practice this until it sounds natural.

*"What is your greatest weakness?"*
Choose a real weakness you have actively worked to improve. Show self-awareness and growth, not a disguised strength.

*"Why do you want this role?"*
Connect something specific about the role or company to your genuine goals. Vague answers like "great opportunity" fail here.

**During the interview:**
- Listen carefully before answering — do not rush
- Ask for clarification if a question is unclear
- Be specific and concise — avoid rambling
- Show enthusiasm without desperation

**After the interview:**
Send a brief thank-you email within 24 hours referencing something specific from the conversation.

**Next step:** Write out three STAR stories from your experience today and practice saying them out loud.`,
  },

  // -------------------------
  // Career Path Discovery
  // -------------------------

  {
    keywords: ["career path", "what career", "choose a career", "career options", "what job", "career advice", "career direction"],
    mode: "career",
    answer: `Choosing a career direction is one of the most important and most overthought decisions you will make. Here is a structured way to approach it.

**A practical framework for finding your career direction:**

**Step 1 — Audit your strengths**
List the things you do naturally well — skills that come easily to you that others often find difficult. These are your most durable career assets.

**Step 2 — Identify your interests**
What topics or problems could you engage with for hours without losing energy? Sustained interest in a field dramatically increases long-term performance.

**Step 3 — Research market demand**
A career needs to pay. Research which roles in your areas of strength and interest are in growing demand and offer sustainable income.

**Step 4 — Explore the intersection**
The strongest career paths sit at the intersection of what you are good at, what you enjoy, and what the market values.

**Step 5 — Test before committing**
Take a short online course, do a freelance project, or shadow someone in the field before making a full commitment. Real exposure beats research alone.

**High-demand career areas to explore:**
- Software development and engineering
- Data analysis and data science
- Digital marketing and content strategy
- UX and product design
- Cybersecurity
- Cloud computing and DevOps
- Business analysis and project management
- Healthcare and medical technology

**Next step:** Write down your top five natural strengths and three fields that genuinely interest you, then look for where they overlap.`,
  },

  // -------------------------
  // Skill Development
  // -------------------------

  {
    keywords: ["learn new skill", "skill development", "upskill", "how to learn a skill", "skills to learn", "improve skills"],
    mode: "career",
    answer: `Building marketable skills deliberately is one of the fastest ways to advance your career.

**A proven skill-building framework:**

**Step 1 — Choose the right skill**
Pick a skill that is: in demand in your target industry, buildable within 3 to 6 months of focused effort, and something you can demonstrate through a real project or portfolio.

**Step 2 — Find the right learning resource**
- Structured courses: Coursera, edX, Udemy, freeCodeCamp, Google Career Certificates
- Documentation and official guides for technical skills
- Books for deep domain knowledge
- YouTube for practical demonstrations

**Step 3 — Learn by building**
Passive learning through videos alone does not stick. Apply every concept you learn in a small project immediately. Building forces understanding.

**Step 4 — Build something you can show**
Every skill you develop should produce a visible output: a GitHub repo, a portfolio piece, a case study, a published article, or a completed certification.

**Step 5 — Get feedback early**
Share your work with communities in your field. Feedback from practitioners accelerates growth faster than solo practice.

**High-value skills in 2025:**
- Python and data analysis
- SQL and database querying
- JavaScript and web development
- AI prompt engineering and tool integration
- Digital marketing and SEO
- Product thinking and user research
- Cloud platforms (AWS, GCP, Azure)
- Video editing and content creation

**Next step:** Pick one skill from your target field and find a free beginner course or tutorial to start this week.`,
  },

  // -------------------------
  // Learning Roadmaps
  // -------------------------

  {
    keywords: ["learning roadmap", "roadmap", "how to learn programming", "how to learn coding", "where to start", "learning path"],
    mode: "career",
    answer: `A learning roadmap gives you a clear sequence so you always know what to learn next and why.

**How to build your own learning roadmap:**

**Step 1 — Define your destination**
Pick a specific role or skill outcome. "Become a frontend developer" is a useful destination. "Learn tech" is not.

**Step 2 — Research what that role requires**
Study 10 to 15 job descriptions for your target role. List the skills, tools, and experience that appear most frequently. These are your roadmap milestones.

**Step 3 — Sequence the learning logically**
Order topics from foundational to advanced. For most technical fields this means: core concepts → key tools → projects → specialization.

**Step 4 — Assign realistic timeframes**
Be honest about how many hours per week you can dedicate. A 6-month roadmap studying 1 hour per day looks very different from 4 hours per day.

**Step 5 — Build projects at every stage**
Every milestone on your roadmap should end with a small project that proves you have learned the skill, not just watched videos about it.

**Example roadmap — Junior Web Developer:**
- Month 1 to 2: HTML, CSS, basic JavaScript
- Month 3: JavaScript DOM, fetch, async programming
- Month 4: React fundamentals and component patterns
- Month 5: Git, GitHub, deployment basics (Vercel or Netlify)
- Month 6: Build and deploy two portfolio projects

**Resources for structured roadmaps:**
- roadmap.sh — visual career roadmaps for dozens of technical roles
- The Odin Project — full-stack web development roadmap (free)
- freeCodeCamp — structured certification paths

**Next step:** Go to roadmap.sh, find the roadmap for your target role, and identify the first three topics you need to learn.`,
  },

  // -------------------------
  // Freelancing
  // -------------------------

  {
    keywords: ["freelancing", "how to freelance", "start freelancing", "freelance tips", "get freelance clients", "freelance work"],
    mode: "career",
    answer: `Freelancing is a real and scalable career path when approached with the right strategy.

**How to start freelancing from scratch:**

**Step 1 — Choose a specific service**
The more specific your offer, the easier it is to market. "I build landing pages for e-commerce brands" works far better than "I do web development."

**Step 2 — Build a portfolio before you have clients**
Create two or three sample projects that demonstrate your skill for your target client type. These do not need to be paid work — they just need to show what you can do.

**Step 3 — Set your pricing**
Research what others with similar skills charge. Start slightly below market rate for your first two or three clients to build reviews and case studies, then raise your rates.

**Step 4 — Find your first clients**
- Your existing network: friends, family, former employers
- Freelance platforms: Upwork, Fiverr, Toptal (for experienced freelancers)
- Cold outreach: contact small businesses in your niche directly via email or LinkedIn
- Online communities: Reddit, Discord, and Facebook groups in your niche

**Step 5 — Deliver and collect proof**
Over-deliver on your first projects. Ask every satisfied client for a testimonial and a case study. These become your most powerful sales tools.

**Common freelancing mistakes:**
- Competing on price alone instead of demonstrating value
- Taking every client instead of targeting the right ones
- Not having a simple contract in place before starting work
- Underpricing and burning out trying to compensate with volume

**Next step:** Write a one-sentence description of the specific service you want to offer and the type of client you want to serve.`,
  },

  // -------------------------
  // LinkedIn & Personal Brand
  // -------------------------

  {
    keywords: ["linkedin", "linkedin profile", "personal brand", "online presence", "professional profile", "linkedin tips"],
    mode: "career",
    answer: `A strong LinkedIn profile works for you 24 hours a day, attracting opportunities you never applied for.

**Key sections to optimize:**

**Profile photo**
Use a clear, professional headshot with good lighting and a clean background. Profiles with photos get significantly more views than those without.

**Headline**
Do not just put your job title. Use the space to describe what you do and who you help. Example: "Frontend Developer | Building fast, accessible web apps for SaaS startups"

**About section**
Write in first person. Describe what you do, the problems you solve, your key skills, and what you are looking for. End with a clear call to action — invite people to connect or message you.

**Experience section**
Mirror your resume: action verbs, measurable results, and specific achievements rather than general duties.

**Skills and endorsements**
Add the 10 to 15 skills most relevant to your target role. Ask colleagues or classmates to endorse your top skills.

**Featured section**
Pin your best work here: a portfolio link, a published article, a project case study, or a certificate.

**Growing your presence:**
- Post once or twice per week about your work, learnings, or observations in your field
- Comment thoughtfully on posts from people in your industry
- Connect with people after events, interviews, or online interactions with a personal note

**Next step:** Update your LinkedIn headline today to reflect what you do and who you help, not just your job title.`,
  },

  // -------------------------
  // Salary & Negotiation
  // -------------------------

  {
    keywords: ["salary negotiation", "negotiate salary", "how to negotiate", "salary tips", "how much to ask", "compensation"],
    mode: "career",
    answer: `Salary negotiation is a normal and expected part of the hiring process. Most employers build room for negotiation into their initial offers.

**Before negotiating:**
- Research market rates for the role using Glassdoor, Levels.fyi, LinkedIn Salary, and Payscale
- Know your minimum acceptable number and your target number
- Understand the full compensation package: base salary, bonuses, equity, benefits, remote flexibility, and leave

**How to negotiate effectively:**

**1. Let them make the first offer**
Avoid giving a number first if possible. Once they give a number, you negotiate up from it rather than down from yours.

**2. Express enthusiasm, then counter**
Show you are genuinely interested in the role before negotiating. Negotiating is not a conflict — it is a professional conversation.

**3. Give a range, not a single number**
Anchor the bottom of your range slightly above your actual target. This gives them a win while you still land where you want.

**4. Justify with market data**
"Based on my research and experience level, I was expecting something in the range of X to Y" is more effective than just asking for more.

**5. Negotiate beyond salary**
If they cannot move on base salary, negotiate signing bonuses, extra leave, remote work, an earlier performance review, or professional development budget.

**What to say if you need time:**
"Thank you so much for the offer. I am very excited about this role. Could I have until [specific date] to review the full package?"

**Next step:** Research the market rate for your target role today so you have a data-backed number before your next negotiation.`,
  },

  // -------------------------
  // Portfolio Building
  // -------------------------

  {
    keywords: ["portfolio", "build a portfolio", "portfolio tips", "how to build portfolio", "project ideas", "portfolio projects"],
    mode: "career",
    answer: `A strong portfolio proves you can do the work before an employer takes the risk of hiring you.

**What makes a great portfolio:**

**1. Quality over quantity**
Three to five excellent, well-documented projects beat ten rushed or incomplete ones. Employers spend seconds scanning — make every project count.

**2. Show real problems solved**
Projects that solve a real or realistic problem are far more impressive than generic tutorials. Even personal projects become compelling when framed around a real use case.

**3. Document your process**
Include a README or case study for each project explaining: the problem, your approach, the tools you used, challenges you faced, and the outcome. This demonstrates thinking, not just output.

**4. Make it live and accessible**
Deploy everything. A link someone can click is worth ten times more than a screenshot. Use Vercel, Netlify, or GitHub Pages for free hosting.

**Portfolio project ideas by field:**

**Web development:**
- A personal budget tracker
- A job application tracker dashboard
- A weather app using a public API
- A full-stack blog or CMS

**Data analysis:**
- A dataset exploration and visualization project on a topic you find interesting
- A sales or business performance analysis using public data

**Design:**
- A mobile app redesign of a product you use daily
- A complete brand identity project for a fictional company

**Digital marketing:**
- A documented content strategy case study
- A Google Ads or Meta Ads simulation with performance analysis

**Next step:** Choose one project from the ideas above and start it this week — even 30 minutes of setup counts as starting.`,
  },

  // -------------------------
  // Networking
  // -------------------------

  {
    keywords: ["networking", "how to network", "professional network", "meet professionals", "build connections", "networking tips"],
    mode: "career",
    answer: `Networking is not about collecting contacts — it is about building genuine professional relationships over time.

**The right mindset for networking:**
Approach networking with the goal of giving value first, not extracting it. Ask how you can help, share useful resources, and be genuinely interested in people's work.

**Where to network effectively:**

**Online:**
- LinkedIn: connect after events, interviews, or online interactions with a personalized message
- Twitter/X: follow and engage with practitioners in your field
- Discord and Slack communities: niche communities for developers, designers, marketers, and more
- Reddit: participate in relevant subreddits where professionals discuss their work

**Offline:**
- Industry meetups and conferences (find them on Eventbrite or Meetup.com)
- Alumni networks from your school or university
- Local professional associations in your field

**How to reach out to someone you admire:**
Keep it short, specific, and low-pressure:
- Mention something specific you found valuable in their work
- Ask one clear and specific question
- Do not ask for a job in a first message
- Make it easy to say yes with a small ask

**How to maintain your network:**
- Share useful articles or opportunities with people in your network occasionally
- Congratulate people on milestones and new roles
- Check in with key contacts every few months — even a short message sustains the relationship

**Next step:** Identify three people in your target field and send each one a genuine connection request with a personalized note this week.`,
  },

  // -------------------------
  // Remote Work
  // -------------------------

  {
    keywords: ["remote work", "work from home", "remote job", "find remote work", "remote career", "online work"],
    mode: "career",
    answer: `Remote work is now a permanent feature of the job market. Here is how to find and succeed in remote roles.

**Finding remote jobs:**

**Dedicated remote job boards:**
- Remote OK (remoteok.com)
- We Work Remotely (weworkremotely.com)
- Remote.co
- FlexJobs (paid, but higher quality listings)
- Himalayas.app

**General job boards with remote filters:**
- LinkedIn — filter by "Remote" in location
- Indeed — search with "remote" in the location field
- AngelList / Wellfound — great for remote startup roles

**What remote employers look for:**
- Strong written communication skills — most remote coordination happens in writing
- Self-discipline and ability to manage your own time without supervision
- Comfort with asynchronous communication and tools like Slack, Notion, and Loom
- A reliable setup: stable internet, a quiet workspace, and suitable hardware

**Standing out as a remote candidate:**
- Mention remote-specific experience in your resume and cover letter
- Show evidence of self-directed projects or freelance work
- Highlight tools you know: Slack, Zoom, Notion, Asana, Jira, GitHub
- Demonstrate strong written communication in every touchpoint of the application

**Time zones:**
Be clear about your available hours and your overlap with the company's core hours. Most remote companies are flexible but need some daily overlap.

**Next step:** Visit remoteok.com or weworkremotely.com today and search for three roles that match your current skill set.`,
  },
];

// -------------------------
// Lookup function
// -------------------------

export function findCareerAnswer(query: string): KnowledgeEntry | null {
  const normalized = query.trim().toLowerCase();

  for (const entry of careerKnowledgeBase) {
    const matched = entry.keywords.some((keyword) =>
      normalized.includes(keyword.toLowerCase())
    );
    if (matched) return entry;
  }

  return null;
}
