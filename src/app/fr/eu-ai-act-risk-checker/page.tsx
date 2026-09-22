import type { Metadata } from "next";
import Link from "next/link";
import RiskChecker from "../../eu-ai-act-risk-checker/RiskChecker";
import { FR_STRINGS } from "../../eu-ai-act-risk-checker/strings.fr";
import { buildMetadata } from "@/lib/pageMetadata";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const CLASSIFICATION_TITLE: Record<string, string> = {
  prohibited: "Mon système d'IA relève d'une pratique interdite par le règlement sur l'IA",
  high: "Mon système d'IA est à haut risque selon le règlement sur l'IA",
  limited: "Mon système d'IA est à risque limité selon le règlement sur l'IA",
  minimal: "Mon système d'IA est à risque minimal selon le règlement sur l'IA",
};

const HREFLANG = { en: "/eu-ai-act-risk-checker", fr: "/fr/eu-ai-act-risk-checker", de: "/de/eu-ai-act-risk-checker" };

export function generateMetadata({ searchParams }: { searchParams: { result?: string } }): Metadata {
  const result = searchParams?.result;
  const title = result ? CLASSIFICATION_TITLE[result] : undefined;

  if (!title) {
    return buildMetadata({
      title: "Vérificateur de risque IA Act — Outil gratuit | Attestly",
      description:
        "Répondez à quelques questions sur votre système d'IA et obtenez une classification directionnelle du risque selon le règlement sur l'IA (interdit, à haut risque, à risque limité ou minimal), fondée sur l'article 5 et l'annexe III. Gratuit, sans inscription.",
      path: "/fr/eu-ai-act-risk-checker",
      hreflang: HREFLANG,
    });
  }

  return buildMetadata({
    title,
    description: "Vérifiez la classification directionnelle de risque de votre propre système d'IA selon le règlement sur l'IA — gratuit, sans inscription.",
    path: "/fr/eu-ai-act-risk-checker",
    hreflang: HREFLANG,
  });
}

export default function RiskCheckerPageFR({ searchParams }: { searchParams: { result?: string } }) {
  const validResults = ["prohibited", "high", "limited", "minimal"];
  const initialResult = validResults.includes(searchParams?.result ?? "") ? (searchParams!.result as any) : null;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      <nav className="site-nav" style={{ padding: 0, marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/fr" className="site-nav__brand" style={{ textDecoration: "none" }}>
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/pricing" className="site-nav__link">Pricing</Link>
          <LanguageSwitcher
            current="fr"
            paths={{ en: "/eu-ai-act-risk-checker", fr: "/fr/eu-ai-act-risk-checker", de: "/de/eu-ai-act-risk-checker" }}
          />
        </div>
      </nav>

      <p className="section__eyebrow">Outil gratuit</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>
        Vérificateur de risque — règlement sur l'IA
      </h1>
      <p style={{ color: "var(--color-ink-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 36, maxWidth: "60ch" }}>
        Répondez à quelques questions sur votre système d'IA pour obtenir une indication directionnelle sur son niveau
        de risque parmi les quatre catégories du règlement sur l'IA — interdit, à haut risque, à risque limité ou
        minimal. Fondé sur l'article 5 et l'annexe III. Sans inscription.
      </p>

      <RiskChecker initialResult={initialResult} strings={FR_STRINGS} />

      <p style={{ fontSize: 12.5, color: "var(--color-ink-faint)", marginTop: 40 }}>
        Ceci ne constitue pas un conseil juridique. Consultez nos{" "}
        <Link href="/terms" style={{ color: "var(--color-ink-muted)" }}>conditions générales</Link> pour plus de
        détails. Envie d'en savoir plus ?{" "}
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>Consultez nos guides</Link> (en anglais).
      </p>
    </main>
  );
}
