import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Post-Market Monitoring Under Article 72: What to Log",
  description:
    "What EU AI Act Article 72 requires providers to monitor after deployment, and what that means for the logs and traces you need to keep.",
  alternates: { canonical: "https://attestly.online/guides/ai-act-article-72-monitoring" },
};

export default function GuideArticle72() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>← Guides</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        This is general information, not legal advice. Verify current requirements with a qualified professional
        before making compliance decisions.
      </div>

      <p className="section__eyebrow">Guide</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        Post-market monitoring under Article 72: what to log
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Article 72 requires providers of high-risk AI systems to establish and document a post-market
          monitoring system, proportionate to the system&apos;s nature and risks. In plain terms: you have to
          keep watching a high-risk system after it ships, not just document it once before launch.
        </p>

        <h2 style={h2}>What the monitoring system has to cover</h2>
        <p style={p}>
          The monitoring system has to actively and systematically collect, document, and analyze relevant data
          on the system&apos;s performance throughout its lifetime, provided by deployers or gathered through
          other sources, that allows the provider to evaluate continuous compliance with the Act&apos;s
          requirements.
        </p>

        <h2 style={h2}>What that means in practice</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Performance drift.</strong> Is the system&apos;s accuracy or behavior changing over time
            relative to what was validated pre-deployment? This requires logging outcomes, not just inputs.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Errors and failure modes.</strong> What actually goes wrong in production — timeouts, invalid
            tool responses, unexpected model outputs — and how often.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Human-oversight activity.</strong> How often and in what circumstances a human intervenes,
            overrides, or approves the system&apos;s outputs. This is direct evidence for the Article 14 human
            oversight requirement as well.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Serious incidents.</strong> Article 73 separately requires reporting serious incidents to
            market surveillance authorities within set timeframes — you can&apos;t report what you haven&apos;t
            logged.
          </li>
          <li>
            <strong>Version and configuration changes.</strong> What changed, when, and why — needed both for
            Annex IV&apos;s change-log requirement and to correlate behavior shifts with deployments.
          </li>
        </ul>

        <h2 style={h2}>Where this data already exists</h2>
        <p style={p}>
          If your AI agent emits OpenTelemetry spans, LangSmith runs, AgentOps sessions, or MCP tool-call logs,
          most of the raw material for post-market monitoring is already being produced — it just isn&apos;t
          organized against the Act&apos;s specific requirements. The gap is usually structuring: turning a
          stream of trace events into a monitoring record that maps to Article 72&apos;s obligations and
          Annex IV&apos;s monitoring section.{" "}
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)" }}>
            That structuring problem is what Attestly automates
          </Link>
          .
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
