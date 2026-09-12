import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EU AI Act Guides — Attestly",
  description:
    "Practical guides on EU AI Act Annex IV documentation, Article 72 monitoring, and Annex III high-risk classification.",
  alternates: { canonical: "https://attestly.online/guides" },
};

const GUIDES = [
  {
    slug: "eu-ai-act-annex-iv-explained",
    title: "EU AI Act Annex IV: every required section explained",
    desc: "A section-by-section walkthrough of what Annex IV technical documentation actually requires.",
  },
  {
    slug: "annex-iv-template",
    title: "Annex IV technical documentation template (with examples)",
    desc: "A practical template for structuring Annex IV documentation, with example language for each section.",
  },
  {
    slug: "ai-act-article-72-monitoring",
    title: "Post-market monitoring under Article 72: what to log",
    desc: "What Article 72 requires providers to monitor after deployment, and what that means in practice.",
  },
  {
    slug: "high-risk-ai-examples",
    title: "High-risk AI systems under Annex III: classification examples",
    desc: "Worked examples of AI systems that do and don't fall into Annex III's high-risk categories.",
  },
];

export default function GuidesIndexPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <p className="section__eyebrow">Guides</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>EU AI Act guides</h1>
      <p style={{ color: "var(--color-ink-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
        Practical, plain-language guides to the parts of the EU AI Act that come up most when documenting an AI
        agent. Not legal advice — see our{" "}
        <Link href="/eu-ai-act-risk-checker" style={{ color: "var(--color-primary)" }}>free risk checker</Link>{" "}
        for a directional classification of your own system.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {GUIDES.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            style={{ padding: "16px 4px", borderBottom: "1px solid var(--color-line)", textDecoration: "none", color: "inherit" }}
          >
            <p style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 4 }}>{g.title}</p>
            <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)" }}>{g.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
