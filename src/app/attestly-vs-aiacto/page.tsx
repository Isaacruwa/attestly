import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Attestly vs AiActo — EU AI Act Documentation Compared",
  description: "How Attestly's trace-based Annex IV documentation compares to AiActo's guided-form approach for EU AI Act technical documentation.",
  path: "/attestly-vs-aiacto",
});

export default function AttestlyVsAiActoPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        We aim to describe AiActo accurately based on their public site as of September 2026. Pricing and
        features change — verify current details directly with AiActo before deciding. This is not legal advice.
      </div>

      <p className="section__eyebrow">Comparison</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        Attestly vs AiActo
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Both tools help produce EU AI Act Annex IV technical documentation. The difference is where the
          evidence in that documentation comes from.
        </p>

        <p style={p}>
          <strong>AiActo</strong> is a guided-forms compliance platform covering the AI Act broadly — not just
          Annex IV, but classification diagnostics, an AI Act glossary and obligations reference, and
          multi-client management for agencies handling several clients&apos; compliance. Its documentation
          generation works by walking you through each Annex IV section with an AI assistant that helps write
          the text based on what you type in — you supply the facts about your system, and it helps structure
          and phrase them. It&apos;s hosted in France with an EU-sovereignty angle, and works for any type of
          high-risk AI system, not just autonomous agents.
        </p>

        <p style={p}>
          <strong>Attestly</strong> is narrower by design: it only handles Annex IV documentation, and only for
          AI agents specifically. Instead of you typing in what your system does, Attestly reads your agent&apos;s
          actual runtime traces (OpenTelemetry, LangSmith, AgentOps, MCP logs) and drafts the monitoring,
          human-oversight, and change-log sections directly from that evidence — each generated sentence links
          back to the specific trace event that justifies it.
        </p>

        <h2 style={h2}>Where each one fits better</h2>
        <p style={p}>
          If you need one platform to handle AI Act compliance across many different kinds of AI systems —
          not just agents — or you&apos;re an agency managing this for multiple clients, AiActo&apos;s broader
          scope and multi-client tooling covers ground Attestly doesn&apos;t try to.
        </p>
        <p style={p}>
          If your system is specifically an AI agent that calls tools and makes autonomous decisions, and you
          want the monitoring and human-oversight sections of Annex IV backed by evidence from what the agent
          actually did — not a description you wrote yourself — that&apos;s the gap Attestly is built for. See{" "}
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)" }}>
            why that evidence source matters for Annex IV specifically
          </Link>.
        </p>

        <div style={{ overflowX: "auto", marginTop: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}></th>
                <th style={{ padding: "10px 12px" }}>Attestly</th>
                <th style={{ padding: "10px 12px" }}>AiActo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Scope", "Annex IV, for AI agents only", "Full AI Act, any AI system"],
                ["Evidence source", "Agent runtime traces", "User-entered, AI-assisted"],
                ["Evidence linked per sentence", "Yes", "Not specified publicly"],
                ["Multi-client / agency tooling", "Not offered", "Yes"],
                ["AI Act classification diagnostic", "Free risk checker", "Yes"],
              ].map(([label, us, them]) => (
                <tr key={label} style={{ borderBottom: "1px solid var(--color-line)" }}>
                  <td style={{ padding: "10px 12px" }}>{label}</td>
                  <td style={{ padding: "10px 12px", color: "var(--color-primary)" }}>{us}</td>
                  <td style={{ padding: "10px 12px", color: "var(--color-ink-muted)" }}>{them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 36, padding: 24, background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8 }}>
          <p style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>Not sure if your system needs this at all?</p>
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
