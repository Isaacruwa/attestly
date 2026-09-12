import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Attestly — EU AI Act Agent Documentation",
  description:
    "Attestly is EU AI Act agent documentation: we turn AI-agent runtime traces into Annex IV technical documentation with evidence links. Contact support@attestly.online.",
  alternates: { canonical: "https://attestly.online/about" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Attestly",
  url: "https://attestly.online/about",
  mainEntity: { "@id": "https://attestly.online/#organization" },
};

export default function AboutPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <p className="section__eyebrow">About</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>
        Attestly — EU AI Act agent documentation
      </h1>

      <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)" }}>
        <p style={{ marginBottom: 16 }}>
          Attestly exists to close a specific, narrow gap: teams shipping autonomous AI agents into the EU need
          Annex IV technical documentation, and the evidence for that documentation already exists inside the
          traces their agents produce — OpenTelemetry, LangSmith, AgentOps, MCP logs. Nobody was turning that
          operational evidence into a structured, evidence-linked documentation draft. We built Attestly to do
          exactly that, and nothing more than that.
        </p>
        <p style={{ marginBottom: 16 }}>
          We are not a law firm, a GRC platform, or a general AI-governance suite. We don&apos;t provide legal
          advice and we don&apos;t guarantee regulatory outcomes — every section Attestly drafts is explicitly
          marked as AI-generated, user-provided, or missing, and requires human review, edit, or approval before
          it counts as final.
        </p>
        <p style={{ marginBottom: 16 }}>
          A note on naming: Attestly (this product, at attestly.online) is EU AI Act agent documentation. It is
          unrelated to attestly.dev (a source-code scanning tool for generic SaaS compliance docs), to any
          crypto-attestation project using a similar name, and to atestly.com (an attendance-tracking app). If
          you found us looking for one of those, this isn&apos;t it.
        </p>
        <p>
          Questions, feedback, or want to talk before signing up? Reach us at{" "}
          <a href="mailto:support@attestly.online" style={{ color: "var(--color-primary)" }}>
            support@attestly.online
          </a>.
        </p>
      </div>
    </main>
  );
}
