import Link from "next/link";

// Contextual "keep reading" links. Each page shows five links, starting at a
// different point in the list, so every guide, glossary term and key page gets
// linked from several others (stronger crawl signal than a footer alone).
const ITEMS: { href: string; label: string }[] = [
  { href: "/guides/eu-ai-act-annex-iv-explained", label: "EU AI Act Annex IV: every required section explained" },
  { href: "/guides/annex-iv-template", label: "Annex IV technical documentation template" },
  { href: "/guides/eu-ai-act-article-12-logging", label: "Article 12 logging requirements for AI agents" },
  { href: "/guides/ai-act-article-72-monitoring", label: "Post-market monitoring under Article 72" },
  { href: "/guides/high-risk-ai-examples", label: "High-risk AI systems under Annex III: examples" },
  { href: "/glossary/annex-iv-technical-documentation", label: "Glossary: Annex IV technical documentation" },
  { href: "/glossary/high-risk-ai-system", label: "Glossary: high-risk AI system" },
  { href: "/glossary/conformity-assessment", label: "Glossary: conformity assessment" },
  { href: "/glossary/audit-evidence-package", label: "Glossary: audit evidence package" },
  { href: "/why-traces-over-scans", label: "Why traces beat scans for AI Act evidence" },
  { href: "/eu-ai-act-risk-checker", label: "Free EU AI Act risk checker" },
  { href: "/pricing", label: "Attestly pricing" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function RelatedLinks({ current }: { current: string }) {
  const pool = ITEMS.filter((i) => i.href !== current);
  const start = hash(current) % pool.length;
  const picks = Array.from({ length: 5 }, (_, k) => pool[(start + k) % pool.length]);
  return (
    <aside
      aria-label="Keep reading"
      style={{ maxWidth: 680, margin: "40px auto 0", padding: "0 24px 8px" }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-ink-muted)", margin: "0 0 12px" }}>
        Keep reading
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {picks.map((p) => (
          <li key={p.href}>
            <Link href={p.href} style={{ fontSize: 15, color: "var(--color-primary)", textDecoration: "none" }}>
              {p.label} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
