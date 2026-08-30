import Link from "next/link";

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
      <nav className="site-nav">
        <span className="site-nav__brand">
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </span>
        <Link href="/login" className="site-nav__link">Sign in</Link>
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
