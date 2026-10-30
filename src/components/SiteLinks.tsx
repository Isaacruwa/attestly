import Link from "next/link";

// Sitewide internal-link block. It gives crawlers (and visitors) a direct path
// from the homepage and every public page to every guide, comparison and
// glossary page.
const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/eu-ai-act-risk-checker", label: "Free EU AI Act risk checker" },
      { href: "/why-traces-over-scans", label: "Why traces beat scans" },
      { href: "/about", label: "About Attestly" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { href: "/guides", label: "All guides" },
      { href: "/guides/eu-ai-act-annex-iv-explained", label: "Annex IV explained" },
      { href: "/guides/annex-iv-template", label: "Annex IV template" },
      { href: "/guides/eu-ai-act-article-12-logging", label: "Article 12 logging" },
      { href: "/guides/ai-act-article-72-monitoring", label: "Article 72 monitoring" },
      { href: "/guides/high-risk-ai-examples", label: "High-risk AI examples" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { href: "/attestly-vs-aiacto", label: "Attestly vs AiActo" },
      { href: "/attestly-vs-openlayer", label: "Attestly vs Openlayer" },
      { href: "/attestly-vs-credo-ai", label: "Attestly vs Credo AI" },
      { href: "/attestly-vs-holistic-ai", label: "Attestly vs Holistic AI" },
      { href: "/attestly-vs-manual-process", label: "Attestly vs manual process" },
    ],
  },
  {
    heading: "Glossary",
    links: [
      { href: "/glossary", label: "All terms" },
      { href: "/glossary/annex-iv-technical-documentation", label: "Annex IV documentation" },
      { href: "/glossary/annex-iii-high-risk-domains", label: "Annex III high-risk domains" },
      { href: "/glossary/high-risk-ai-system", label: "High-risk AI system" },
      { href: "/glossary/conformity-assessment", label: "Conformity assessment" },
      { href: "/glossary/ai-agent-compliance-documentation", label: "Agent compliance documentation" },
      { href: "/glossary/tamper-evident-compliance-evidence", label: "Tamper-evident evidence" },
      { href: "/glossary/compliance-trust-center", label: "Compliance trust center" },
      { href: "/glossary/audit-evidence-package", label: "Audit evidence package" },
    ],
  },
  {
    heading: "Languages",
    links: [
      { href: "/fr", label: "Français" },
      { href: "/fr/eu-ai-act-risk-checker", label: "Vérificateur de risque IA" },
      { href: "/de", label: "Deutsch" },
      { href: "/de/eu-ai-act-risk-checker", label: "KI-Risiko-Check" },
    ],
  },
];

export default function SiteLinks() {
  return (
    <nav aria-label="Site links" className="site-links">
      <style>{`
        .site-links { max-width: 1080px; margin: 0 auto; padding: 48px 24px 8px; }
        .site-links__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px 20px; }
        @media (min-width: 760px) { .site-links__grid { grid-template-columns: repeat(5, 1fr); } }
        .site-links__heading { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-ink-muted); margin: 0 0 12px; }
        .site-links__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
        .site-links__list a { font-size: 14px; line-height: 1.4; color: var(--color-ink); text-decoration: none; }
        .site-links__list a:hover { color: var(--color-primary); text-decoration: underline; }
      `}</style>
      <div className="site-links__grid">
        {COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="site-links__heading">{col.heading}</p>
            <ul className="site-links__list">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
