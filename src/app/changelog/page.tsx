import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Changelog — Attestly",
  description: "What's new in Attestly: product updates, new trace-source support, and documentation improvements.",
  alternates: { canonical: "https://attestly.online/changelog" },
};

const ENTRIES = [
  {
    date: "September 2026",
    title: "Runtime-vs-code-scan comparison and guides hub",
    body:
      "Added a dedicated breakdown of why Annex IV documentation needs runtime trace evidence rather than a static code scan, plus a new guides section covering Annex IV requirements, Article 72 monitoring, and Annex III high-risk classification.",
  },
  {
    date: "August 2026",
    title: "Trust Center and cryptographic evidence hashing",
    body:
      "Shipped public Trust Center pages for sharing compliance status, and cryptographic hashing of approvals so evidence trails are tamper-evident rather than just asserted.",
  },
  {
    date: "August 2026",
    title: "Free EU AI Act risk checker",
    body:
      "Launched a free, no-signup risk classification tool based on Article 5 and Annex III, giving teams a directional read on their AI system's risk tier before they need full documentation.",
  },
];

export default function ChangelogPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <p className="section__eyebrow">Changelog</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>What&apos;s new</h1>
      <p style={{ color: "var(--color-ink-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
        A running record of product updates. For account-specific changes, see your dashboard.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {ENTRIES.map((e) => (
          <div key={e.title} style={{ borderBottom: "1px solid var(--color-line)", paddingBottom: 24 }}>
            <p className="mono" style={{ fontSize: 12, color: "var(--color-ink-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              {e.date}
            </p>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{e.title}</p>
            <p style={{ fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.6 }}>{e.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
