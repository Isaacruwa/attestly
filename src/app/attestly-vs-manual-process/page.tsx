import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildMetadata({
  title: "Attestly vs Doing It Manually — EU AI Act Documentation Compared",
  description: "How Attestly's trace-based Annex IV documentation compares to writing it manually with a consultant, a lawyer, or a Word template.",
  path: "/attestly-vs-manual-process",
});

export default function AttestlyVsManualPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        Cost figures below are third-party estimates reported publicly as of 2026, not quotes from any
        specific firm — what you'd actually be quoted depends on your system and your consultant. This is
        not legal advice.
      </div>

      <p className="section__eyebrow">Comparison</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        Attestly vs doing it manually
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          For most teams, the real alternative to a tool like Attestly isn't another piece of software —
          it's a compliance consultant or lawyer, a Word template, and a round of interviews with your
          engineering team.
        </p>

        <p style={p}>
          <strong>The manual route</strong> usually looks like this: a consultant interviews your engineers
          about what the system does, drafts the nine Annex IV sections from what they're told, and you
          review it. Reported market figures put the Annex IV documentation line item alone at roughly
          €4,000–€18,000 per system, with some founders reporting being quoted €20,000–€80,000 for a fuller
          compliance engagement covering classification, documentation, and process. It's a one-time
          snapshot — if your system changes (new tools, new prompts, new guardrails), the document goes
          stale until someone pays for a revision.
        </p>

        <p style={p}>
          <strong>Attestly</strong> reads your agent's actual runtime traces and drafts the monitoring,
          human-oversight, and change-log sections directly from that evidence, with each sentence linked to
          the specific trace event behind it. Documentation updates by re-syncing from new traces, not by
          starting a new engagement. Pricing is published, with a free tier.
        </p>

        <h2 style={h2}>Where each one fits better</h2>
        <p style={p}>
          A consultant brings something Attestly deliberately doesn't try to replace: legal judgment calls —
          interpreting edge cases, advising on liability, signing off with professional accountability. If
          your system sits in genuinely ambiguous territory under the Act, that judgment is worth paying for.
        </p>
        <p style={p}>
          If the work is describing what your agent actually did — the part that's mostly mechanical, evidence-
          gathering work dressed up as a bespoke engagement — Attestly does that from your traces instead of
          from an interview transcript, and keeps it current as your agent changes. Many teams use both: Attestly
          for the evidence-backed sections, a consultant or in-house counsel for the judgment calls. Attestly's
          drafts are a starting point you review and approve, not a substitute for your own sign-off — same as
          you'd review a consultant's draft.
        </p>

        <div style={{ overflowX: "auto", marginTop: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}></th>
                <th style={{ padding: "10px 12px" }}>Attestly</th>
                <th style={{ padding: "10px 12px" }}>Manual / consultant</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Reported cost for Annex IV documentation", "From free, published tiers", "~€4,000–€18,000 per system (reported)"],
                ["Evidence basis", "Agent runtime traces", "Interviews, engineer-written descriptions"],
                ["Stays current as the system changes", "Yes — re-sync from new traces", "No — needs a new engagement"],
                ["Legal judgment calls", "Not offered", "Yes — a consultant's core value"],
                ["Typical turnaround", "Minutes, once traces are connected", "Typically weeks"],
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
