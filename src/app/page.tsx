import Link from "next/link";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Attestly",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Regulatory Compliance Software",
      operatingSystem: "Web",
      description:
        "Attestly turns AI agents' operational traces (OpenTelemetry, LangSmith, AgentOps, MCP logs) into EU AI Act technical documentation, risk-management records, and audit-ready evidence, with mandatory human review before anything is final.",
      offers: [
        { "@type": "Offer", name: "Starter", price: "79", priceCurrency: "USD" },
        { "@type": "Offer", name: "Professional", price: "349", priceCurrency: "USD" },
        { "@type": "Offer", name: "Enterprise", price: "1499", priceCurrency: "USD" },
      ],
      featureList: [
        "EU AI Act Annex IV technical documentation generation",
        "Risk-management summaries",
        "Conformity-assessment checklists",
        "Audit-ready evidence trails",
        "OpenTelemetry, LangSmith, and AgentOps trace ingestion",
        "Human-in-the-loop review workflow",
      ],
    },
    {
      "@type": "Organization",
      name: "Attestly",
      url: "https://attestly.online",
      description: "EU AI Act compliance documentation automation for autonomous AI agents.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does Attestly provide legal advice or guarantee compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Attestly does not provide legal advice and does not guarantee regulatory compliance. Every generated section is reviewed, edited, and approved by a human before it counts as final.",
          },
        },
        {
          "@type": "Question",
          name: "What trace sources does Attestly support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Attestly ingests OpenTelemetry traces, LangSmith runs, AgentOps sessions, and generic pre-normalized JSON.",
          },
        },
      ],
    },
  ],
};

const PIPELINE_STEPS = [
  {
    icon: "01",
    title: "Your agents run",
    desc: "OpenTelemetry, LangSmith, AgentOps, or MCP logs — whatever you already emit.",
  },
  {
    icon: "02",
    title: "Attestly structures it",
    desc: "Tool calls, model calls, human interventions, and errors, normalized and mapped to Annex IV.",
  },
  {
    icon: "03",
    title: "A person signs off",
    desc: "Every generated section is reviewed, edited, or rejected before it counts as final.",
  },
];

const DELIVERABLES = [
  {
    title: "Annex IV technical documentation",
    desc: "General description, design specification, and monitoring measures — drafted from what your system actually did.",
  },
  {
    title: "Risk-management summaries",
    desc: "Identified risks, mitigations, and residual risk, traced back to the events that surfaced them.",
  },
  {
    title: "Conformity-assessment checklists",
    desc: "A running view of what's covered, what's missing, and what still needs a human decision.",
  },
  {
    title: "Audit-ready evidence trails",
    desc: "Every generated sentence links to the specific trace event that justified it.",
  },
];

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="site-nav">
        <span className="site-nav__brand">
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </span>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/pricing" className="site-nav__link">Pricing</Link>
          <Link href="/login" className="site-nav__link">Sign in</Link>
        </div>
      </nav>

      <header className="hero">
        <p className="hero__eyebrow">EU AI Act · Technical Documentation</p>
        <div className="hero__grid">
          <div>
            <h1>Stop manually reconstructing what your AI system did.</h1>
            <p>
              Attestly reads the traces your agents already produce and turns them into EU AI Act
              technical documentation, risk-management records, and audit-ready evidence —
              continuously, not as a quarterly scramble.
            </p>
            <Link href="/login" className="btn-primary">Get started →</Link>
          </div>

          <div className="pipeline">
            <p className="pipeline__label">How it works</p>
            {PIPELINE_STEPS.map((step) => (
              <div className="pipeline__step" key={step.icon}>
                <span className="pipeline__step-icon">{step.icon}</span>
                <div>
                  <p className="pipeline__step-title">{step.title}</p>
                  <p className="pipeline__step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="section">
        <p className="section__eyebrow">What it generates</p>
        <h2>Four documents compliance teams currently build by hand.</h2>
        <div className="deliverables-grid">
          {DELIVERABLES.map((d) => (
            <div className="deliverable" key={d.title}>
              <p className="deliverable__title">{d.title}</p>
              <p className="deliverable__desc">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="trust-strip">
          Attestly does not provide legal advice and does not guarantee regulatory compliance.
          Every generated section is clearly marked as AI-generated, user-provided, or missing —
          and requires human review, edit, or approval before export.
        </div>
      </section>

      <footer className="site-footer">
        <span className="site-nav__brand">
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </span>
        <span className="site-footer__meta">Built for teams shipping autonomous AI agents into the EU</span>
      </footer>
    </>
  );
}
