import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Annex IV Technical Documentation Template (With Examples)",
  description: "A practical, section-by-section Annex IV documentation template with example language, for teams drafting their first EU AI Act technical file.",
  path: "/guides/annex-iv-template",
});

export default function GuideAnnexIVTemplate() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>← Guides</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        This is a starting-point template, not legal advice or a guarantee of compliance. Have qualified counsel
        review your final documentation.
      </div>

      <p className="section__eyebrow">Guide</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        Annex IV technical documentation template (with examples)
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          This is a practical starting structure for an Annex IV technical file, with example language for each
          section. Treat it as a skeleton to fill in with your system&apos;s actual facts — not boilerplate to
          submit as-is.
        </p>

        <h2 style={h2}>1. System overview</h2>
        <pre style={pre}>{`Name: [system name]
Version: [version]
Intended purpose: [one paragraph — what the system does and who it's for]
Provider: [legal entity]
Deployment form: [SaaS / API / embedded / on-prem]`}</pre>

        <h2 style={h2}>2. Design and development</h2>
        <pre style={pre}>{`Architecture summary: [one paragraph, plus a diagram if available]
Key algorithms/models used: [list, with versions]
Design assumptions: [what the system assumes about its inputs/environment]
Training data (if applicable): [source, scope, known limitations]`}</pre>

        <h2 style={h2}>3. Monitoring and human oversight</h2>
        <pre style={pre}>{`Human oversight mechanism: [what a human can see and do]
Example: "A compliance reviewer approves or rejects each refund
recommendation above $500 before it is executed. In the 90 days
to [date], N recommendations were reviewed, of which N were
overridden."
Known limitations: [foreseeable misuse or failure modes]`}</pre>

        <h2 style={h2}>4. Performance and validation</h2>
        <pre style={pre}>{`Accuracy metric(s): [metric, value, test set/period]
Robustness testing: [what was tested, results]
Example: "Tool-call success rate was 98.4% over the last 30 days,
measured from N execution traces; the 1.6% failure rate consisted
of N timeout errors, each of which triggered a human fallback."`}</pre>

        <h2 style={h2}>5. Risk management</h2>
        <pre style={pre}>{`Identified risk: [description]
Mitigation: [what was done]
Residual risk: [what remains, and why it's judged acceptable]
Example: "Risk: agent could recommend refunds outside policy.
Mitigation: mandatory human approval above $500 (see Section 3).
Residual risk: recommendations under $500 execute automatically;
monitored via monthly sampling."`}</pre>

        <h2 style={h2}>6. Change log</h2>
        <pre style={pre}>{`Date | Version | Change | Reason
[date] | v1.4 → v1.5 | [what changed] | [why]`}</pre>

        <h2 style={h2}>Filling this in without starting from scratch</h2>
        <p style={p}>
          The hardest sections to fill in honestly are usually 3, 4, and 6 — they require evidence of what the
          system actually did, which most teams don&apos;t have assembled anywhere. That evidence exists in your
          agent&apos;s runtime traces.{" "}
          <Link href="/" style={{ color: "var(--color-primary)" }}>Attestly</Link> reads those traces directly
          and drafts this evidence-linked language for you, for human review rather than manual reconstruction.
        </p>

        <div style={{ marginTop: 36, padding: 24, background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8 }}>
          <p style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>Not sure if your system is high-risk?</p>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 14 }}>
            Run the free EU AI Act risk checker — no signup required.
          </p>
          <Link href="/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none", display: "inline-flex" }}>
            Check now →
          </Link>
        </div>
      </div>
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 28, marginBottom: 10 };
const p: React.CSSProperties = { marginBottom: 16 };
const pre: React.CSSProperties = {
  background: "var(--color-ink)",
  color: "#e6f2ef",
  padding: 16,
  borderRadius: 8,
  fontSize: 12.5,
  lineHeight: 1.6,
  overflowX: "auto",
  marginBottom: 8,
  whiteSpace: "pre-wrap",
};
