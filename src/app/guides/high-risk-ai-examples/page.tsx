import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "High-Risk AI Systems Under Annex III: Classification Examples",
  description:
    "Worked examples of AI systems that do and don't fall into the EU AI Act's Annex III high-risk categories, to help you reason about your own system.",
  alternates: { canonical: "https://attestly.online/guides/high-risk-ai-examples" },
};

const EXAMPLES = [
  {
    domain: "Employment",
    likely: "An AI system that screens or ranks job applicants' CVs for a recruiter.",
    unlikely: "An AI system that only checks CVs for spelling errors before a human reviews them.",
  },
  {
    domain: "Credit and essential services",
    likely: "An AI system that determines an individual's creditworthiness for a loan decision.",
    unlikely: "An AI system that flags potentially fraudulent transactions for a human analyst to investigate.",
  },
  {
    domain: "Education",
    likely: "An AI system used to evaluate students in a way that affects their access to education.",
    unlikely: "An AI system that generates practice quiz questions from a textbook, with no bearing on grades.",
  },
  {
    domain: "Law enforcement / migration",
    likely: "An AI system used to assess the risk of an individual reoffending.",
    unlikely: "An AI system used for administrative case-routing with no assessment of individuals.",
  },
  {
    domain: "Critical infrastructure",
    likely: "An AI system acting as a safety component in the management of critical digital infrastructure.",
    unlikely: "An AI system generating internal engineering documentation with no operational control role.",
  },
];

export default function GuideHighRiskExamples() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>← Guides</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        These are simplified, illustrative examples, not legal advice or a legal classification of any specific
        system. Use the free risk checker below for a directional read on your own system.
      </div>

      <p className="section__eyebrow">Guide</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        High-risk AI systems under Annex III: classification examples
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Annex III lists the domains in which an AI system is presumptively high-risk: biometrics, critical
          infrastructure, education, employment, access to essential services, law enforcement, migration and
          border control, and administration of justice. But falling into one of these domains isn&apos;t
          automatic — the Act also allows a narrow-task carve-out under Article 6(3) for systems that only
          perform a limited procedural task, improve a completed human decision, detect patterns without
          replacing human judgment, or do preparatory work, without profiling individuals.
        </p>
        <p style={p}>
          Below are simplified, side-by-side examples in each domain — one that&apos;s likely high-risk, and one
          that likely qualifies for the narrow-task carve-out. Real classification depends on the specific
          system&apos;s design and role, not just its domain.
        </p>

        {EXAMPLES.map((ex) => (
          <div key={ex.domain} style={{ marginBottom: 24 }}>
            <h2 style={h2}>{ex.domain}</h2>
            <p style={{ ...p, marginBottom: 8 }}>
              <strong style={{ color: "var(--color-primary)" }}>Likely high-risk:</strong> {ex.likely}
            </p>
            <p style={p}>
              <strong style={{ color: "var(--color-ink-faint)" }}>Likely narrow-task / not high-risk:</strong> {ex.unlikely}
            </p>
          </div>
        ))}

        <p style={p}>
          If your system sits in one of these domains and doesn&apos;t clearly qualify for the narrow-task
          carve-out, it&apos;s worth treating it as high-risk for planning purposes and starting on Annex IV
          documentation — see our{" "}
          <Link href="/guides/eu-ai-act-annex-iv-explained" style={{ color: "var(--color-primary)" }}>
            Annex IV explainer
          </Link>{" "}
          for what that involves.
        </p>

        <div style={{ marginTop: 36, padding: 24, background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8 }}>
          <p style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>Get a directional read on your own system</p>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 14 }}>
            The free risk checker walks through Article 5 and Annex III in a few minutes — no signup required.
          </p>
          <Link href="/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none", display: "inline-flex" }}>
            Check now →
          </Link>
        </div>
      </div>
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 10 };
const p: React.CSSProperties = { marginBottom: 16 };
