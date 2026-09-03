import Link from "next/link";
import RiskChecker from "./RiskChecker";

export default function RiskCheckerPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <nav className="site-nav" style={{ padding: 0, marginBottom: 40 }}>
        <Link href="/" className="site-nav__brand" style={{ textDecoration: "none" }}>
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </Link>
        <Link href="/pricing" className="site-nav__link">Pricing</Link>
      </nav>

      <p className="section__eyebrow">Free tool</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>
        EU AI Act Risk Checker
      </h1>
      <p style={{ color: "var(--color-ink-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 36, maxWidth: "60ch" }}>
        Answer a few questions about your AI system and get a directional read on which of the EU AI Act's four
        risk tiers it likely falls into — prohibited, high-risk, limited, or minimal. Based on Article 5 and
        Annex III. No signup required.
      </p>

      <RiskChecker />

      <p style={{ fontSize: 12.5, color: "var(--color-ink-faint)", marginTop: 40 }}>
        Not legal advice. See our full{" "}
        <Link href="/terms" style={{ color: "var(--color-ink-muted)" }}>Terms</Link> for details.
      </p>
    </main>
  );
}
