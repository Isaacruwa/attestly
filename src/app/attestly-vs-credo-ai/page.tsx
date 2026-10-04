import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Attestly vs Credo AI — EU AI Act Documentation Compared",
  description: "How Attestly's trace-based Annex IV documentation compares to Credo AI's enterprise AI governance platform for EU AI Act, NIST AI RMF, and ISO 42001.",
  path: "/attestly-vs-credo-ai",
});

export default function AttestlyVsCredoAiPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        We aim to describe Credo AI accurately based on their public site and third-party reviews as of
        October 2026. Credo AI doesn't publish pricing, so figures described as "enterprise" or "custom"
        reflect that, not a confirmed number. Verify current details directly with Credo AI before deciding.
        This is not legal advice.
      </div>

      <p className="section__eyebrow">Comparison</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        Attestly vs Credo AI
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Both show up when you search for EU AI Act compliance help — but they're built for different jobs
          and different buyers.
        </p>

        <p style={p}>
          <strong>Credo AI</strong> is an enterprise AI governance, risk, and compliance (GRC) platform. It
          covers the EU AI Act alongside NIST AI RMF and ISO 42001 through a policy engine, an AI-system
          registry, and a governance agent that pulls evidence from engineering systems via integrations
          (Jira, ServiceNow, MLflow) and a Python SDK. It's sold as enterprise SaaS with custom, quote-only
          pricing — also available through the AWS and Azure marketplaces — and is built for large
          organizations (insurance, financial services, government, healthcare) governing many AI systems
          across an org, not agents specifically.
        </p>

        <p style={p}>
          <strong>Attestly</strong> is narrower on purpose: only Annex IV documentation, only for AI agents.
          Instead of a registry you populate and a policy engine you configure, Attestly reads your agent's
          actual runtime traces (OpenTelemetry, LangSmith, AgentOps, MCP logs) and drafts the monitoring,
          human-oversight, and change-log sections directly from that evidence — each generated sentence
          links back to the specific trace event that justifies it. Pricing is published, with a free tier,
          rather than a sales conversation.
        </p>

        <h2 style={h2}>Where each one fits better</h2>
        <p style={p}>
          If the job is running EU AI Act, NIST AI RMF, and ISO 42001 as one governance program across many
          kinds of AI and ML systems org-wide — with a registry, a policy engine, and engineering-system
          integrations — Credo AI's scope covers ground Attestly isn't trying to cover.
        </p>
        <p style={p}>
          If your system is specifically an AI agent and you want the Annex IV monitoring and human-oversight
          sections backed by evidence of what the agent actually did — not a registry entry someone filled
          in — plus pricing you can see before you talk to anyone, that's the gap Attestly is built for. See{" "}
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)" }}>
            why trace-sourced evidence matters for Annex IV specifically
          </Link>.
        </p>

        <div style={{ overflowX: "auto", marginTop: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}></th>
                <th style={{ padding: "10px 12px" }}>Attestly</th>
                <th style={{ padding: "10px 12px" }}>Credo AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Scope", "Annex IV, for AI agents only", "Full GRC: EU AI Act, NIST AI RMF, ISO 42001, any AI/ML system"],
                ["Evidence source", "Agent runtime traces", "Engineering-system integrations + manual input"],
                ["Evidence linked per sentence", "Yes", "Not specified publicly"],
                ["Pricing", "Published, free tier available", "Custom enterprise contracts, not published"],
                ["Typical buyer", "Individual teams, small companies", "Large enterprises (insurance, finance, gov, healthcare)"],
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
