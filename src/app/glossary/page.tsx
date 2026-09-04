import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY_TERMS } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "EU AI Act Glossary — Attestly",
  description: "Plain-language explanations of key EU AI Act terms: Annex IV, Annex III, conformity assessment, high-risk classification, and more.",
  alternates: { canonical: "https://attestly.online/glossary" },
};

export default function GlossaryIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "EU AI Act Glossary",
    url: "https://attestly.online/glossary",
    hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
      "@type": "DefinedTerm",
      name: t.title,
      description: t.metaDescription,
      url: `https://attestly.online/glossary/${t.slug}`,
    })),
  };

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>EU AI Act Glossary</h1>
      <p style={{ color: "var(--color-ink-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
        Plain-language explanations of the terms that come up most when figuring out what the EU AI Act requires.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {GLOSSARY_TERMS.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}`}
            style={{ padding: "16px 4px", borderBottom: "1px solid var(--color-line)", textDecoration: "none", color: "inherit" }}
          >
            <p style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 4 }}>{t.title}</p>
            <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)" }}>{t.metaDescription}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
