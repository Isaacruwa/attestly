import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GLOSSARY_TERMS, getGlossaryTerm } from "@/lib/glossary";

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const term = getGlossaryTerm(params.slug);
  if (!term) return {};
  return {
    title: `${term.title} — Attestly`,
    description: term.metaDescription,
    alternates: { canonical: `https://attestly.online/glossary/${term.slug}` },
  };
}

export default function GlossaryTermPage({ params }: { params: { slug: string } }) {
  const term = getGlossaryTerm(params.slug);
  if (!term) notFound();

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/glossary" style={{ color: "var(--color-ink-muted)" }}>← Glossary</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.25 }}>{term.title}</h1>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--color-ink)", marginBottom: 28 }}>{term.intro}</p>

      {term.sections.map((s) => (
        <div key={s.heading} style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 8 }}>{s.heading}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink-muted)" }}>{s.body}</p>
        </div>
      ))}

      <div className="trust-strip" style={{ marginTop: 32, marginBottom: 32 }}>
        This is general educational information, not legal advice. Regulatory timelines and interpretations have
        changed multiple times in 2026 — verify current status before making compliance decisions.
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link href="/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none" }}>
          Check your system's risk tier →
        </Link>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", color: "var(--color-primary)" }}>
          See Attestly's pricing →
        </Link>
      </div>
    </main>
  );
}
