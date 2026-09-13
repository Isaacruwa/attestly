import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Attestly vs Openlayer — EU AI Act Documentation Compared",
  description: "How Attestly's focused Annex IV documentation for AI agents compares to Openlayer's broader AI evaluation and governance platform.",
  path: "/attestly-vs-openlayer",
});

export default function AttestlyVsOpenlayerPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        We aim to describe Openlayer accurately based on their public site as of September 2026. Pricing and
        features change — verify current details directly with Openlayer before deciding. This is not legal advice.
      </div>

      <p className="section__eyebrow">Comparison</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        Attestly vs Openlayer
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          These solve different-sized problems. Openlayer is a full AI evaluation, testing, and observability
          platform that also addresses EU AI Act compliance as one of its use cases. Attestly does one thing:
          Annex IV documentation for AI agents, generated from their runtime traces.
        </p>

        <p style={p}>
          <strong>Openlayer</strong> integrates into CI/CD pipelines to run evaluations on every model or prompt
          change, and offers observability, tracing, alerting, and a model-testing library across any ML or LLM
          system — not agents specifically. Its free Basic plan (20,000 inferences/month, one workspace) covers
          the core evaluation and observability tooling. Compliance reporting, custom regulatory mappings, and
          the deeper governance features sit in the Enterprise plan, which is custom-quoted and sales-led
          (&ldquo;Contact sales&rdquo;, no self-serve pricing published).
        </p>

        <p style={p}>
          <strong>Attestly</strong> doesn&apos;t do model evaluation, testing, or general observability — there's
          no dashboard for prompt performance or model drift. What it does is narrower: read agent runtime
          traces and draft the Annex IV documentation sections (monitoring, human oversight, change log) with
          evidence links back to specific events, available starting on the free tier.
        </p>

        <h2 style={h2}>Where each one fits better</h2>
        <p style={p}>
          If you need a single platform to evaluate and monitor AI/ML systems broadly — accuracy testing, drift
          detection, prompt evaluation — across an organization with the scale to justify an enterprise
          governance contract, Openlayer's platform covers far more ground than Attestly attempts to.
        </p>
        <p style={p}>
          If what you actually need is the Annex IV documentation itself, specifically for an AI agent, without
          adopting a full evaluation platform or a custom enterprise quote to get the compliance-relevant
          features — that's the narrower job Attestly is built for. See{" "}
          <Link href="/guides/eu-ai-act-annex-iv-explained" style={{ color: "var(--color-primary)" }}>
            what Annex IV actually requires
          </Link>{" "}
          if you're scoping which approach fits.
        </p>

        <div style={{ overflowX: "auto", marginTop: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}></th>
                <th style={{ padding: "10px 12px" }}>Attestly</th>
                <th style={{ padding: "10px 12px" }}>Openlayer</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Core product", "Annex IV documentation for agents", "AI evaluation, testing & observability"],
                ["Compliance reporting on free tier", "Yes", "No — Enterprise only"],
                ["Enterprise pricing", "Published ($1,499/mo top tier)", "Custom-quoted, sales call required"],
                ["Model/prompt evaluation tooling", "Not offered", "Yes"],
                ["Evidence source for Annex IV", "Agent runtime traces, cited per sentence", "CI/CD evaluation runs"],
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
