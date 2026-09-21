export type Result = "prohibited" | "high" | "limited" | "minimal" | null;

export type ResultCopy = { label: string; color: string; body: string };

export type RiskCheckerStrings = {
  prohibitedItems: string[];
  annexIIIItems: string[];
  limitedItems: string[];
  resultCopy: Record<Exclude<Result, null>, ResultCopy>;
  resultLabel: string;
  trustStrip: string;
  startDocumenting: string;
  leadTitle: string;
  leadSubtitle: string;
  leadSent: string;
  emailPlaceholder: string;
  sendButton: string;
  sendingButton: string;
  leadError: string;
  copyLinkDefault: string;
  copyLinkCopied: string;
  highRiskExamplesLink: string;
  annexIVLink: string;
  checkAnother: string;
  step1Title: string;
  step1Subtitle: string;
  continueButton: string;
  step2Title: string;
  step2SafetyQuestion: string;
  yes: string;
  no: string;
  step2AnnexIIIPrompt: string;
  step2NarrowTaskPrompt: string;
  yesNarrowTaskOnly: string;
  step3Title: string;
  step3Subtitle: string;
  seeResultButton: string;
};

export const EN_STRINGS: RiskCheckerStrings = {
  prohibitedItems: [
    "Uses subliminal, manipulative, or deceptive techniques likely to cause someone physical or psychological harm",
    "Exploits the vulnerabilities of a specific group (age, disability, or socio-economic situation) to distort behavior in a harmful way",
    "Scores or classifies people by trustworthiness or social behavior on behalf of a public authority (social scoring)",
    "Predicts an individual's likelihood of committing a crime based solely on profiling or personality traits",
    "Builds or expands a facial recognition database by untargeted scraping of images from the internet or CCTV",
    "Infers emotions in a workplace or educational setting (outside narrow medical/safety exceptions)",
    "Biometrically categorizes people to infer race, political opinions, religion, sexual orientation, or similar sensitive traits",
    "Performs real-time remote biometric identification in publicly accessible spaces for law enforcement purposes",
    "Generates or manipulates non-consensual intimate imagery, or generates/manipulates child sexual abuse material",
  ],
  annexIIIItems: [
    "Biometric identification or categorization of people",
    "Management or operation of critical infrastructure (energy, water, transport, digital infrastructure)",
    "Education or vocational training (e.g. exam scoring, admissions, monitoring students)",
    "Employment, worker management, or access to self-employment (e.g. hiring, promotion, termination decisions)",
    "Access to essential services (credit scoring, insurance pricing, benefits eligibility, emergency dispatch)",
    "Law enforcement (outside the prohibited real-time biometric case above)",
    "Migration, asylum, or border control management",
    "Administration of justice or democratic processes",
  ],
  limitedItems: [
    "Interacts directly with people in a way they might mistake for a human (e.g. a chatbot)",
    "Generates or manipulates image, audio, or video content that could be mistaken for authentic",
    "Recognizes emotions or biometrically categorizes people (outside the prohibited/high-risk cases above)",
  ],
  resultCopy: {
    prohibited: {
      label: "Likely a prohibited practice",
      color: "var(--color-missing)",
      body: "Based on what you selected, this system may fall under Article 5's prohibited practices — these have applied since February 2025 (with two additions — AI nudification tools and AI-generated CSAM — applying from December 2, 2026). There is no compliance pathway for a prohibited practice; it needs to stop or be redesigned to fall outside these criteria.",
    },
    high: {
      label: "Likely high-risk",
      color: "var(--color-review)",
      body: "Based on what you selected, this system likely falls under Annex III (or is a safety component of an already-regulated product) and would be classified high-risk. Following the 2026 Digital Omnibus amendment, the compliance deadline for Annex III systems is now December 2, 2027 (August 2, 2028 for Annex I product-embedded systems) — later than the original August 2026 date, but this is exactly the category Attestly's Annex IV documentation is built for.",
    },
    limited: {
      label: "Likely limited risk",
      color: "var(--color-updated)",
      body: "Based on what you selected, this system likely falls under the transparency obligations in Article 50 — disclosing that people are interacting with AI, and labeling synthetic content. Note the provider-side synthetic-content marking duty (Article 50(2)) has a compliance grace period until December 2, 2026 for systems already on the market.",
    },
    minimal: {
      label: "Likely minimal risk",
      color: "var(--color-approved)",
      body: "Based on what you selected, this system doesn't appear to trigger the EU AI Act's specific obligations. Voluntary codes of conduct are still encouraged, and it's worth re-checking if the system's purpose or capabilities change.",
    },
  },
  resultLabel: "Result",
  trustStrip:
    "This is an educational directional indicator based on the Act's published categories, not a legal classification or legal advice. The EU AI Act's implementing timeline has changed multiple times in 2026 — verify current status and get a qualified legal opinion before making compliance decisions.",
  startDocumenting: "Start documenting this system with Attestly →",
  leadTitle: "Get this classification as a documented Annex IV starting point",
  leadSubtitle: "We'll email you a free-tier link to start building the documentation for this system.",
  leadSent: "Sent — check your inbox.",
  emailPlaceholder: "you@company.com",
  sendButton: "Send me this",
  sendingButton: "Sending…",
  leadError: "Something went wrong — please try again.",
  copyLinkDefault: "Copy shareable result link",
  copyLinkCopied: "Link copied ✓",
  highRiskExamplesLink: "High-risk classification examples →",
  annexIVLink: "What Annex IV requires →",
  checkAnother: "Check another system",
  step1Title: "Step 1 — Does your system do any of the following?",
  step1Subtitle: "Check any that apply. These are Article 5's prohibited practices.",
  continueButton: "Continue →",
  step2Title: "Step 2 — Is it used in a sensitive domain?",
  step2SafetyQuestion:
    "Is your system a safety component of a product already regulated under EU product safety law (medical devices, machinery, toys, vehicles, lifts) and subject to third-party conformity assessment?",
  yes: "Yes",
  no: "No",
  step2AnnexIIIPrompt: "Does it fall into any of Annex III's domains? Check any that apply.",
  step2NarrowTaskPrompt:
    "One more check — under Article 6(3), a narrow-task system can avoid high-risk classification. Does your system only perform a narrow procedural task, improve the result of an already-completed human decision, detect patterns without replacing human judgment, or do prep work — without profiling individuals?",
  yesNarrowTaskOnly: "Yes, narrow task only",
  step3Title: "Step 3 — Transparency triggers",
  step3Subtitle: "Check any that apply.",
  seeResultButton: "See my result →",
};
