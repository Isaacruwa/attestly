import type { Metadata } from "next";
import Link from "next/link";
import RiskChecker from "../../eu-ai-act-risk-checker/RiskChecker";
import { DE_STRINGS } from "../../eu-ai-act-risk-checker/strings.de";
import { buildMetadata } from "@/lib/pageMetadata";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const CLASSIFICATION_TITLE: Record<string, string> = {
  prohibited: "Mein KI-System fällt unter eine verbotene Praktik der KI-Verordnung",
  high: "Mein KI-System ist laut KI-Verordnung hochriskant",
  limited: "Mein KI-System hat laut KI-Verordnung ein begrenztes Risiko",
  minimal: "Mein KI-System hat laut KI-Verordnung ein minimales Risiko",
};

const HREFLANG = { en: "/eu-ai-act-risk-checker", fr: "/fr/eu-ai-act-risk-checker", de: "/de/eu-ai-act-risk-checker" };

export function generateMetadata({ searchParams }: { searchParams: { result?: string } }): Metadata {
  const result = searchParams?.result;
  const title = result ? CLASSIFICATION_TITLE[result] : undefined;

  if (!title) {
    return buildMetadata({
      title: "KI-Verordnung Risikoprüfung — Kostenloses Tool | Attestly",
      description:
        "Beantworten Sie ein paar Fragen zu Ihrem KI-System und erhalten Sie eine richtungsweisende Risikoeinstufung nach der KI-Verordnung (verboten, hochriskant, begrenztes Risiko oder minimales Risiko) basierend auf Artikel 5 und Anhang III. Kostenlos, keine Anmeldung erforderlich.",
      path: "/de/eu-ai-act-risk-checker",
      hreflang: HREFLANG,
    });
  }

  return buildMetadata({
    title,
    description: "Prüfen Sie die richtungsweisende Risikoeinstufung Ihres eigenen KI-Systems nach der KI-Verordnung — kostenlos, keine Anmeldung erforderlich.",
    path: "/de/eu-ai-act-risk-checker",
    hreflang: HREFLANG,
  });
}

export default function RiskCheckerPageDE({ searchParams }: { searchParams: { result?: string } }) {
  const validResults = ["prohibited", "high", "limited", "minimal"];
  const initialResult = validResults.includes(searchParams?.result ?? "") ? (searchParams!.result as any) : null;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <nav className="site-nav" style={{ padding: 0, marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/de" className="site-nav__brand" style={{ textDecoration: "none" }}>
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/pricing" className="site-nav__link">Pricing</Link>
          <LanguageSwitcher
            current="de"
            paths={{ en: "/eu-ai-act-risk-checker", fr: "/fr/eu-ai-act-risk-checker", de: "/de/eu-ai-act-risk-checker" }}
          />
        </div>
      </nav>

      <p className="section__eyebrow">Kostenloses Tool</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>
        Risikoprüfung — KI-Verordnung
      </h1>
      <p style={{ color: "var(--color-ink-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 36, maxWidth: "60ch" }}>
        Beantworten Sie ein paar Fragen zu Ihrem KI-System und erhalten Sie eine richtungsweisende Einschätzung, in
        welche der vier Risikostufen der KI-Verordnung es wahrscheinlich fällt — verboten, hochriskant, begrenztes
        Risiko oder minimales Risiko. Basierend auf Artikel 5 und Anhang III. Keine Anmeldung erforderlich.
      </p>

      <RiskChecker initialResult={initialResult} strings={DE_STRINGS} />

      <p style={{ fontSize: 12.5, color: "var(--color-ink-faint)", marginTop: 40 }}>
        Keine Rechtsberatung. Weitere Details finden Sie in unseren vollständigen{" "}
        <Link href="/terms" style={{ color: "var(--color-ink-muted)" }}>Nutzungsbedingungen</Link>. Mehr Hintergrund?{" "}
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>Siehe unsere Guides</Link> (auf Englisch).
      </p>
    </main>
  );
}
