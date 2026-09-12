import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "EU AI Act Annex IV: Every Required Section Explained",
  description: "A section-by-section walkthrough of what EU AI Act Annex IV technical documentation actually requires for high-risk AI systems.",
  path: "/guides/eu-ai-act-annex-iv-explained",
});

export default function GuideAnnexIVExplained() {
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
        EU AI Act Annex IV: every required section explained
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Annex IV of the EU AI Act sets out what technical documentation a provider of a high-risk AI system has
          to produce before placing that system on the market, and keep current afterward. It&apos;s organized
          into distinct sections, each asking for a different kind of evidence. Here&apos;s what each one covers.
        </p>

        <h2 style={h2}>1. General description of the system</h2>
        <p style={p}>
          Its intended purpose, who develops and deploys it, its version, how it interacts with hardware or
          other software, and the forms in which it&apos;s placed on the market (software, embedded in a product,
          API, and so on).
        </p>

        <h2 style={h2}>2. Detailed description of the elements and development process</h2>
        <p style={p}>
          Design specifications, the system&apos;s architecture, the logic and algorithms used, key design choices
          and assumptions, and — for machine learning systems — details of the training methodology, data, and
          any human oversight built into training.
        </p>

        <h2 style={h2}>3. Monitoring, functioning, and control</h2>
        <p style={p}>
          Detailed information on the capabilities and limitations of the system, including expected accuracy
          against its intended purpose, foreseeable unintended outcomes, and the human-oversight measures in
          place — what a human can see, and what a human can do to intervene.
        </p>

        <h2 style={h2}>4. Performance metrics</h2>
        <p style={p}>
          The metrics used to measure accuracy, robustness, and cybersecurity, and the results of testing against
          those metrics, including testing on relevant subgroups where discriminatory impact is a concern.
        </p>

        <h2 style={h2}>5. Risk management</h2>
        <p style={p}>
          A description of the risk-management system required under Article 9: identified risks, the measures
          taken to mitigate them, and any residual risk that remains after mitigation.
        </p>

        <h2 style={h2}>6. Lifecycle changes</h2>
        <p style={p}>
          A description of relevant changes made to the system through its lifecycle — new versions, retraining,
          configuration changes — and why they were made.
        </p>

        <h2 style={h2}>7. Standards and conformity</h2>
        <p style={p}>
          The harmonized standards applied, or a description of the solutions adopted to meet the requirements
          where no standard was applied, plus a copy of the EU declaration of conformity where applicable.
        </p>

        <h2 style={h2}>Where the evidence for this actually lives</h2>
        <p style={p}>
          Sections 1 and 2 are largely design-time information — you likely already have it written down.
          Sections 3, 4, and 6 are different: they ask what the system actually does and how it behaves in
          production, which is operational evidence that lives in the system&apos;s runtime traces, not in its
          source code or design docs. That&apos;s the specific gap{" "}
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)" }}>
            Attestly is built to close
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
