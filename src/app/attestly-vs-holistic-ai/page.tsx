import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Attestly vs Holistic AI — EU AI Act Documentation Compared",
  description: "How Attestly's trace-based Annex IV documentation compares to Holistic AI's bias-auditing and AI governance platform.",
  path: "/attestly-vs-holistic-ai",
});

export default function AttestlyVsHolisticAiPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        We aim to describe Holistic AI accurately based on their public site and third-party reviews as of
        October 2026. Holistic AI doesn't publish pricing, and the "significant manual input" note below
        reflects independent reporting, not a claim Holistic AI makes about itself — verify current details
        directly with them before deciding. This is not legal advice.
      </div>

      <p className="section__eyebrow">Comparison</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        Attestly vs Holistic AI
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Both come up in EU AI Act tool searches, but they solve different problems — Holistic AI is built
          around assessing your AI, Attestly around documenting what a specific agent did.
        </p>

        <p style={p}>
          <strong>Holistic AI</strong> is an enterprise AI governance platform covering full lifecycle
          oversight: discovering AI systems across your org (including unsanctioned "shadow AI"), bias and
          algorithmic risk auditing, compliance monitoring, and policy enforcement, mapped to the EU AI Act,
          NIST RMF, and ISO 42001. Bias and fairness auditing is its strongest, most distinct capability.
          Pricing is enterprise custom, not published. Independent reviews from earlier in 2026 described its
          AI Act conformity-assessment workflows as still in beta and its Annex IV documentation as requiring
          significant manual input — worth confirming directly with Holistic AI, since that may have changed.
        </p>

        <p style={p}>
          <strong>Attestly</strong> doesn't do discovery or bias auditing at all. It only generates Annex IV
          documentation, only for AI agents, reading your agent's actual runtime traces (OpenTelemetry,
          LangSmith, AgentOps, MCP logs) and drafting the monitoring and human-oversight sections directly
          from that evidence — each sentence links back to the trace event behind it. Pricing is published,
          with a free tier.
        </p>

        <h2 style={h2}>Where each one fits better</h2>
        <p style={p}>
          If bias and fairness auditing across a broad AI estate — discovery, risk scoring, policy
          enforcement — is the priority, Holistic AI's depth there is something Attestly doesn't offer at
          all.
        </p>
        <p style={p}>
          If the job is specifically Annex IV documentation for an agent, backed by its real run history
          instead of manual write-up, with pricing you can see upfront, that's Attestly's lane. See{" "}
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
                <th style={{ padding: "10px 12px" }}>Holistic AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Scope", "Annex IV, for AI agents only", "Full lifecycle governance: discovery, bias auditing, EU AI Act/NIST/ISO 42001"],
                ["Bias / fairness auditing", "Not offered", "Yes — a core, distinct feature"],
                ["Evidence source", "Agent runtime traces", "Platform assessments + manual input (per independent reviews)"],
                ["Evidence linked per sentence", "Yes", "Not specified publicly"],
                ["Pricing", "Published, free tier available", "Enterprise custom, not published"],
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
