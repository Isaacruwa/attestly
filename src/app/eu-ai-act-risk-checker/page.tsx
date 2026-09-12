import type { Metadata } from "next";
import Link from "next/link";
import RiskChecker from "./RiskChecker";

const CLASSIFICATION_LABEL: Record<string, string> = {
  prohibited: "Prohibited",
  high: "High",
  limited: "Limited",
  minimal: "Minimal",
};

export function generateMetadata({ searchParams }: { searchParams: { result?: string } }): Metadata {
  const result = searchParams?.result;
  const label = result ? CLASSIFICATION_LABEL[result] : undefined;

  if (!label) {
    return {
      title: "EU AI Act Risk Checker — Free Tool | Attestly",
      description:
        "Answer a few questions about your AI system and get a directional EU AI Act risk classification (prohibited, high-risk, limited, or minimal) based on Article 5 and Annex III. Free, no signup required.",
      alternates: { canonical: "https://attestly.online/eu-ai-act-risk-checker" },
    };
  }

  const title = `My AI system is ${label}-risk under the EU AI Act`;
  const description =
    "Check your own AI system's directional EU AI Act risk classification — free, no signup required.";
  return {
    title,
    description,
    alternates: { canonical: "https://attestly.online/eu-ai-act-risk-checker" },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function RiskCheckerPage({ searchParams }: { searchParams: { result?: string } }) {
  const validResults = ["prohibited", "high", "limited", "minimal"];
  const initialResult = validResults.includes(searchParams?.result ?? "") ? (searchParams!.result as any) : null;

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

      <RiskChecker initialResult={initialResult} />

      <p style={{ fontSize: 12.5, color: "var(--color-ink-faint)", marginTop: 40 }}>
        Not legal advice. See our full{" "}
        <Link href="/terms" style={{ color: "var(--color-ink-muted)" }}>Terms</Link> for details. Want more
        background? See our{" "}
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>guides</Link>.
      </p>
    </main>
  );
}
