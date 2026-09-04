export type GlossaryTerm = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
};

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "annex-iv-technical-documentation",
    title: "What is EU AI Act Annex IV technical documentation?",
    metaDescription:
      "A plain explanation of what Annex IV of the EU AI Act requires, who needs it, and what each required section covers.",
    intro:
      "Annex IV of the EU AI Act (Regulation (EU) 2024/1689) sets out the technical documentation a provider of a high-risk AI system must draw up and keep current before that system is placed on the EU market, and for as long as it remains in use.",
    sections: [
      {
        heading: "What it has to contain",
        body: "Annex IV requires several categories of information: a general description of the system and its intended purpose; details of the design and development process, including the system architecture and key design choices; information on how the system is monitored, functions, and is controlled once deployed; performance metrics and validation results; risk-management measures and their outcomes; and a log of significant changes made across the system's lifecycle.",
      },
      {
        heading: "Who needs it",
        body: "Providers of high-risk AI systems — those falling under Annex III's eight domains (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, and justice/democratic processes) or embedded as a safety component in an already-regulated product. Annex IV documentation is required regardless of which conformity assessment route applies (internal control or notified-body assessment) — it's the same underlying documentation either way.",
      },
      {
        heading: "Why it's usually built manually today",
        body: "Most of the underlying evidence for Annex IV already exists inside a system's own operational traces and logs — but assembling it into the structured format Annex IV requires is typically a manual, one-off project done ahead of an audit, rather than something that stays current as the system changes. That gap is what Attestly's trace-to-documentation pipeline is built to close.",
      },
    ],
  },
  {
    slug: "annex-iii-high-risk-domains",
    title: "What are the EU AI Act's Annex III high-risk domains?",
    metaDescription:
      "The eight domains that classify an AI system as high-risk under Annex III of the EU AI Act, explained plainly with examples.",
    intro:
      "Annex III of the EU AI Act lists eight domains in which an AI system is classified as high-risk, triggering obligations including Annex IV technical documentation, a conformity assessment, and ongoing monitoring.",
    sections: [
      {
        heading: "The eight domains",
        body: "1) Biometric identification or categorization of people. 2) Management or operation of critical infrastructure (energy, water, transport, digital infrastructure). 3) Education or vocational training — e.g. exam scoring, admissions decisions, monitoring students. 4) Employment, worker management, and access to self-employment — e.g. CV screening, promotion or termination decisions. 5) Access to essential private and public services — credit scoring, insurance pricing, benefits eligibility, emergency dispatch. 6) Law enforcement (outside the separately-prohibited real-time biometric identification use case). 7) Migration, asylum, and border control management. 8) Administration of justice and democratic processes.",
      },
      {
        heading: "The narrow-task exception",
        body: "Article 6(3) allows a system that falls within one of these domains to avoid high-risk classification if it only performs a narrow procedural task, improves the result of an already-completed human decision, detects patterns without replacing human judgment, or does preparatory work — without profiling individuals. This is a real exception worth checking carefully, not a loophole to assume applies by default.",
      },
      {
        heading: "Current compliance timeline",
        body: "Following the 2026 Digital Omnibus amendment (Regulation (EU) 2026/1744), the compliance deadline for Annex III high-risk obligations is now December 2, 2027 — pushed back from the original August 2026 date. Annex I (product-embedded) high-risk systems have until August 2, 2028.",
      },
    ],
  },
  {
    slug: "conformity-assessment",
    title: "What is an EU AI Act conformity assessment?",
    metaDescription:
      "How EU AI Act Article 43 conformity assessment works: the two routes (internal control vs. notified body), and which applies to your system.",
    intro:
      "A conformity assessment under Article 43 is the process a provider must complete before placing a high-risk AI system on the EU market — confirming it meets the Act's requirements before a declaration of conformity and CE marking are issued.",
    sections: [
      {
        heading: "Two routes",
        body: "For Annex III points 2 through 8 (critical infrastructure, education, employment, essential services, law enforcement, migration, and justice), providers follow internal control under Annex VI — a self-assessment, with no notified body involved. For Annex III point 1 (biometric systems), the route depends on whether harmonized standards or common specifications were fully applied: if so, the provider can still self-assess; if not, a third-party notified body assessment under Annex VII is required. Systems embedded as safety components in already-regulated products (Annex I — medical devices, machinery, toys, etc.) follow that product category's existing sectoral assessment procedure instead.",
      },
      {
        heading: "What either route needs",
        body: "Both routes require the same underlying Annex IV technical documentation as their evidence base — the assessment procedure differs, but the documentation it's built on doesn't. Building that documentation early, rather than scrambling right before an audit, is worth doing regardless of which route eventually applies.",
      },
    ],
  },
  {
    slug: "high-risk-ai-system",
    title: "What makes an AI system 'high-risk' under the EU AI Act?",
    metaDescription:
      "A clear explanation of what qualifies an AI system as high-risk under the EU AI Act, and what obligations follow from that classification.",
    intro:
      "Under the EU AI Act, a system is classified high-risk if it falls within one of Annex III's eight domains (and doesn't qualify for the Article 6(3) narrow-task exception), or if it's a safety component of a product already regulated under EU product safety legislation requiring third-party conformity assessment.",
    sections: [
      {
        heading: "What follows from high-risk classification",
        body: "A high-risk classification triggers several obligations: Annex IV technical documentation, a risk-management system maintained across the system's lifecycle, data governance requirements, human oversight measures, a conformity assessment (internal control or notified-body, depending on the category), registration in the EU database, and post-market monitoring.",
      },
      {
        heading: "Not the same as prohibited",
        body: "High-risk is a distinct, separate category from Article 5's prohibited practices. A prohibited practice has no compliance pathway — it must stop. A high-risk system is legal to operate, provided the obligations above are met.",
      },
    ],
  },
  {
    slug: "ai-agent-compliance-documentation",
    title: "What is AI agent compliance documentation?",
    metaDescription:
      "What it means to document an autonomous AI agent's compliance, and why agent-based systems raise documentation challenges static models don't.",
    intro:
      "AI agent compliance documentation refers to the technical documentation, risk-management records, and evidence trails required to demonstrate that an autonomous AI agent's behavior meets applicable regulatory requirements — under the EU AI Act, principally Annex IV.",
    sections: [
      {
        heading: "Why agents are harder to document than static models",
        body: "A static model produces the same type of output for a given input, which makes its behavior relatively easy to characterize once. An autonomous agent takes actions — calling tools, making decisions across multiple steps, sometimes escalating to a human — and its behavior can change as the agent, its tools, or its deployment evolve. Documentation that's accurate on day one can be stale within weeks.",
      },
      {
        heading: "Evidence-based documentation",
        body: "The most defensible approach ties each documentation claim back to a specific piece of evidence — a tool call, a model call, a human intervention, an error — rather than a general narrative description written from memory. This is the specific gap Attestly is built to close: reading an agent's own operational traces and mapping them directly against EU AI Act requirements, with every generated section linked back to the exact events that justify it.",
      },
    ],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}
