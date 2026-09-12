import Link from "next/link";

const SITE_URL = "https://attestly.online";

const FAQS = [
  {
    q: "Does Attestly provide legal advice or guarantee compliance?",
    a: "No. Attestly does not provide legal advice and does not guarantee regulatory compliance. Every generated section is reviewed, edited, and approved by a human before it counts as final.",
  },
  {
    q: "What trace sources does Attestly support?",
    a: "Attestly ingests OpenTelemetry traces, LangSmith runs, AgentOps sessions, and generic pre-normalized JSON.",
  },
  {
    q: "Who is Attestly for?",
    a: "AI startups shipping agents to EU customers, enterprise AI teams running multiple systems, compliance and risk teams, and AI governance consultancies producing documentation for clients.",
  },
  {
    q: "How is Attestly different from a generic AI governance platform?",
    a: "Broad AI-governance tools focus on policy management, system inventories, and monitoring dashboards. Attestly specifically ingests an agent's operational traces and turns them into drafted Annex IV documentation with evidence links back to the exact events that justify each section — a narrower, deeper problem than a general governance dashboard covers.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The free tier includes one AI system and ten lifetime documentation generations, enough to fully draft one system's Annex IV documentation and see the product work before subscribing.",
  },
  {
    q: "How does Attestly know what to write in each documentation section?",
    a: "Each EU AI Act Annex IV requirement is mapped against the specific trace events (tool calls, model calls, human interventions, errors, system events) relevant to it. Drafting is grounded only in that linked evidence — the system is instructed to flag gaps explicitly rather than invent plausible-sounding text where evidence is missing.",
  },
  {
    q: "What happens to my trace data?",
    a: "Trace data is stored per-organization with row-level database access controls, so one organization can never see another's data. Only the specific events linked as evidence for a documentation section are sent to the AI model used for drafting that section.",
  },
  {
    q: "What format is the exported documentation in?",
    a: "Attestly exports a Word (.docx) document containing every requirement, its current review status, whether it's AI-generated or human-edited, and a list of the exact trace events used as supporting evidence.",
  },
  {
    q: "How is Attestly different from attestly.dev?",
    a: "attestly.dev performs static analysis of your source code to produce generic SaaS privacy/compliance documentation. Attestly reads your AI agents' runtime traces (OpenTelemetry, LangSmith, AgentOps, MCP logs) and drafts EU AI Act Annex IV documentation with evidence links back to specific trace events. A code scan can tell you an SDK is imported; it can't tell you what the agent actually did — which tool calls it made, when a human intervened, what errors occurred, or how behavior changed between deployments. That's a different product for a different requirement.",
  },
  {
    q: "Can I use Attestly alongside a GRC platform?",
    a: "Yes. A GRC platform tracks which AI systems exist, who owns them, and their overall policy status. Attestly produces the underlying Annex IV documentation draft for a specific system, grounded in that system's actual runtime evidence. Most customers use both: GRC for inventory and ownership, Attestly for the evidence-backed documentation itself.",
  },
  {
    q: "What if my agent framework isn't listed?",
    a: "Attestly accepts generic pre-normalized JSON in addition to OpenTelemetry, LangSmith, AgentOps, and MCP logs, so any framework that can export its trace events as JSON can be ingested even without native support.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Attestly",
      url: SITE_URL,
      description: "EU AI Act compliance documentation automation for autonomous AI agents.",
      logo: `${SITE_URL}/icon.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@attestly.online",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Attestly",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Attestly",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Regulatory Compliance Software",
      operatingSystem: "Web",
      publisher: { "@id": `${SITE_URL}/#organization` },
      description:
        "Attestly turns AI agents' operational traces (OpenTelemetry, LangSmith, AgentOps, MCP logs) into EU AI Act technical documentation, risk-management records, and audit-ready evidence, with mandatory human review before anything is final.",
      offers: [
        { "@type": "Offer", name: "Starter", price: "79", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
        { "@type": "Offer", name: "Professional", price: "349", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
        { "@type": "Offer", name: "Enterprise", price: "1499", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
      ],
      featureList: [
        "Free EU AI Act risk classification tool",
        "Public Trust Center pages for sharing compliance status",
        "Cryptographically verified, tamper-evident evidence and approvals",
        "Formal audit-ready evidence packages for auditors and regulators",
        "EU AI Act Annex IV technical documentation generation",
        "Risk-management summaries",
        "Conformity-assessment checklists",
        "Audit-ready evidence trails",
        "OpenTelemetry, LangSmith, and AgentOps trace ingestion",
        "Human-in-the-loop review workflow",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
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
    desc: "Every generated sentence links to the specific trace event that justified it, and every approval is cryptographically hashed — tamper-evident, not just asserted.",
  },
];

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="site-nav">
        <Link href="/" className="site-nav__brand" style={{ textDecoration: "none" }}>
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </Link>

        <input type="checkbox" id="nav-toggle" className="site-nav__toggle-checkbox" />
        <label htmlFor="nav-toggle" className="site-nav__toggle-label" aria-label="Menu">☰</label>

        <div className="site-nav__links">
          <Link href="/glossary" className="site-nav__link">Glossary</Link>
          <Link href="/guides" className="site-nav__link">Guides</Link>
          <Link href="/eu-ai-act-risk-checker" className="site-nav__link">Risk Checker</Link>
          <Link href="/pricing" className="site-nav__link">Pricing</Link>
          <Link href="/login" className="site-nav__cta">Sign in</Link>
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
        <p className="section__eyebrow">Who it's for</p>
        <h2>Built for the teams actually shipping AI agents into the EU.</h2>
        <div className="deliverables-grid">
          <div className="deliverable">
            <p className="deliverable__title">AI startups</p>
            <p className="deliverable__desc">
              Deploying an autonomous agent to EU customers and need Annex IV documentation before launch, without
              a dedicated compliance hire.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">Enterprise AI teams</p>
            <p className="deliverable__desc">
              Running internal or customer-facing agents across multiple systems that all need ongoing, not
              one-time, documentation as behavior changes.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">Compliance and risk teams</p>
            <p className="deliverable__desc">
              Currently reconstructing what an AI system did by hand from logs and interviews, and need a
              structured, evidence-linked starting point instead.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">AI governance consultancies</p>
            <p className="deliverable__desc">
              Producing Annex IV documentation for multiple clients and need a tool that turns each client's
              traces into a first draft, rather than starting from a blank template every time.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Background</p>
        <h2>What EU AI Act Annex IV technical documentation actually requires</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)" }}>
          <p style={{ marginBottom: 16 }}>
            The EU AI Act requires providers of high-risk AI systems to maintain technical documentation under
            Annex IV before the system is placed on the market, and to keep it current as the system changes.
            Annex IV specifies several required elements: a general description of the system and its intended
            purpose, details of its design and development process, information on how it's monitored and
            controlled once deployed, performance and validation metrics, risk-management measures, and a record
            of significant changes made across the system's lifecycle.
          </p>
          <p>
            In practice, most of the underlying evidence for these sections already exists inside the system's own
            operational traces — which tool calls it made, when a human intervened, what errors occurred, what
            changed between deployments. Attestly's role is to read that evidence directly from your traces and
            map it against each Annex IV requirement, rather than have someone manually reconstruct it after the
            fact from logs, tickets, and memory.
          </p>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Why not a generic GRC platform</p>
        <h2>General AI-governance tools stop one step before this.</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink-muted)" }}>
          <p style={{ marginBottom: 16 }}>
            Broad AI-governance platforms are built around policy management, system inventories, and monitoring
            dashboards — useful for tracking that an AI system exists and has an owner, but they don't ingest an
            agent's actual execution traces and turn them into drafted Annex IV documentation with evidence links
            back to specific events. That gap — live agent behavior into structured, evidence-backed compliance
            documentation — is the specific problem Attestly is built to solve, not a broader governance dashboard.
          </p>
          <p>
            Attestly isn't a replacement for legal review, a GRC platform, or an AI firewall. It's the tool that
            turns operational trace data into a documentation draft a compliance professional can review in
            minutes instead of building from scratch.
          </p>
        </div>
      </section>


      <section className="section" id="why-traces-not-scans">
        <p className="section__eyebrow">Why runtime traces, not code scans</p>
        <h2>A static scan of your repository cannot see what your agent actually did.</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)", marginBottom: 24 }}>
          <p>
            Scanning source code can tell you which SDKs and model calls are wired up. It cannot tell you what
            happened at runtime: which tools an agent actually invoked, when a human stepped in to override a
            decision, which calls errored out, or how the system's behavior changed between one deployment and
            the next. Annex IV specifically asks for that operational evidence — and it only exists in execution
            traces, not in a repository.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}></th>
                <th style={{ padding: "10px 12px", color: "var(--color-primary)" }}>Attestly (runtime traces)</th>
                <th style={{ padding: "10px 12px", color: "var(--color-ink-faint)" }}>Code-scanning tools</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sees actual agent behavior", true, false],
                ["Captures human interventions", true, false],
                ["Evidence link per generated sentence", true, false],
                ["Works with agents you didn't build (MCP, third-party tools)", true, false],
                ["Updates as behavior changes", true, false],
              ].map(([label, us, them]) => (
                <tr key={label as string} style={{ borderBottom: "1px solid var(--color-line)" }}>
                  <td style={{ padding: "10px 12px", color: "var(--color-ink)" }}>{label as string}</td>
                  <td style={{ padding: "10px 12px" }}>{us ? "✓" : "—"}</td>
                  <td style={{ padding: "10px 12px", color: "var(--color-ink-faint)" }}>{them ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 16 }}>
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)", fontSize: 14 }}>
            Read the full breakdown of why Annex IV needs runtime evidence →
          </Link>
        </p>
      </section>

      <section className="section" id="supported-trace-sources">
        <p className="section__eyebrow">Supported trace sources</p>
        <h2>Ingest whatever your agents already emit.</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {[
            { name: "OpenTelemetry", href: "#supported-trace-sources" },
            { name: "LangSmith", href: "#supported-trace-sources" },
            { name: "AgentOps", href: "#supported-trace-sources" },
            { name: "MCP", href: "#supported-trace-sources" },
            { name: "Pre-normalized JSON", href: "#supported-trace-sources" },
          ].map((s) => (
            <a
              key={s.name}
              href={s.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid var(--color-line)",
                fontSize: 13.5,
                fontFamily: "var(--font-mono)",
                color: "var(--color-ink)",
                textDecoration: "none",
                background: "var(--color-primary-tint)",
              }}
            >
              {s.name}
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="live-example">
        <p className="section__eyebrow">Live example</p>
        <h2>From trace event to Annex IV sentence.</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink-muted)", marginBottom: 20, maxWidth: "68ch" }}>
          A simplified, illustrative walkthrough of how a handful of normalized trace events map to a single
          drafted documentation sentence — with a link back to the exact event that justified it.
        </p>
        <pre
          className="mono"
          style={{
            background: "var(--color-ink)",
            color: "#e6f2ef",
            padding: 20,
            borderRadius: 8,
            fontSize: 12.5,
            lineHeight: 1.6,
            overflowX: "auto",
          }}
        >
{`[
  { "event": "tool_call", "tool": "refund_api", "id": "a91f02c1", "status": "success" },
  { "event": "human_intervention", "actor": "reviewer@acme.eu", "id": "a91f02c2", "action": "approved" },
  { "event": "error", "id": "a91f02c3", "message": "timeout on retry 2" },
  { "event": "deployment_change", "id": "a91f02c4", "from": "v1.4", "to": "v1.5" }
]`}
        </pre>
        <div style={{ marginTop: 16, padding: 18, border: "1px solid var(--color-line)", borderRadius: 8, background: "white" }}>
          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-ink-faint)", marginBottom: 8 }}>
            Drafted Annex IV section — Monitoring measures
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--color-ink)" }}>
            &ldquo;The system autonomously invoked the refund API, which a human reviewer subsequently approved
            after an initial retry timeout; the system was updated from v1.4 to v1.5 shortly after.&rdquo;{" "}
            <span
              className="mono"
              style={{ fontSize: 12, color: "var(--color-primary)", whiteSpace: "nowrap" }}
            >
              [evidence: trace #a91f02c1]
            </span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="trust-strip">
          Attestly does not provide legal advice and does not guarantee regulatory compliance.
          Every generated section is clearly marked as AI-generated, user-provided, or missing —
          and requires human review, edit, or approval before export.
        </div>
      </section>

      <section className="section">
        <div style={{ background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8, padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="mono" style={{ fontSize: 12, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Free tool</p>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Not sure if your AI system is high-risk?</p>
            <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)" }}>Answer a few questions and get a directional EU AI Act risk classification.</p>
          </div>
          <Link href="/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none", whiteSpace: "nowrap" }}>Check now →</Link>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Frequently asked</p>
        <h2>Common questions</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: "65ch" }}>
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{faq.q}</p>
              <p style={{ fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span className="site-nav__brand">
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </span>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/guides" className="site-footer__meta" style={{ textDecoration: "none" }}>Guides</Link>
          <Link href="/about" className="site-footer__meta" style={{ textDecoration: "none" }}>About</Link>
          <Link href="/changelog" className="site-footer__meta" style={{ textDecoration: "none" }}>Changelog</Link>
          <Link href="/terms" className="site-footer__meta" style={{ textDecoration: "none" }}>Terms</Link>
          <Link href="/privacy" className="site-footer__meta" style={{ textDecoration: "none" }}>Privacy</Link>
          <Link href="/refund-policy" className="site-footer__meta" style={{ textDecoration: "none" }}>Refunds</Link>
          <a href="mailto:support@attestly.online" className="site-footer__meta" style={{ textDecoration: "none" }}>support@attestly.online</a>
          <span className="site-footer__meta">Built for teams shipping autonomous AI agents into the EU</span>
        </div>
      </footer>
    </>
  );
}
