import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SITE_URL = "https://attestly.online";

export const metadata: Metadata = buildMetadata({
  title: "Attestly — Documentation technique pour le règlement sur l'IA, à partir des traces d'agents",
  description:
    "Attestly lit les traces que vos agents d'IA produisent déjà (OpenTelemetry, LangSmith, AgentOps) et rédige la documentation technique de l'annexe IV du règlement sur l'IA avec des liens vers les preuves — relue par un humain, prête pour l'audit.",
  path: "/fr",
  hreflang: { en: "/", fr: "/fr", de: "/de" },
});

const FAQS = [
  {
    q: "Attestly fournit-il un conseil juridique ou garantit-il la conformité ?",
    a: "Non. Attestly ne fournit pas de conseil juridique et ne garantit pas la conformité réglementaire. Chaque section générée est relue, modifiée et approuvée par un humain avant de compter comme définitive.",
  },
  {
    q: "Quelles sources de traces Attestly prend-il en charge ?",
    a: "Attestly ingère les traces OpenTelemetry, les runs LangSmith, les sessions AgentOps, et du JSON générique pré-normalisé.",
  },
  {
    q: "À qui s'adresse Attestly ?",
    a: "Aux startups d'IA qui déploient des agents chez des clients européens, aux équipes IA d'entreprise qui gèrent plusieurs systèmes, aux équipes conformité et risque, et aux cabinets de conseil en gouvernance de l'IA qui produisent de la documentation pour leurs clients.",
  },
  {
    q: "En quoi Attestly diffère-t-il d'une plateforme de gouvernance IA généraliste ?",
    a: "Les outils de gouvernance IA généralistes se concentrent sur la gestion des politiques, l'inventaire des systèmes et les tableaux de bord de surveillance. Attestly ingère spécifiquement les traces opérationnelles d'un agent et les transforme en documentation annexe IV rédigée, avec des liens de preuve vers les événements exacts qui justifient chaque section — un problème plus étroit et plus profond que ce que couvre un tableau de bord de gouvernance généraliste.",
  },
  {
    q: "Existe-t-il une offre gratuite ?",
    a: "Oui. L'offre gratuite comprend un système d'IA et dix générations de documentation à vie, suffisant pour rédiger entièrement la documentation annexe IV d'un système et voir le produit fonctionner avant de s'abonner.",
  },
  {
    q: "Comment Attestly sait-il quoi écrire dans chaque section de documentation ?",
    a: "Chaque exigence de l'annexe IV du règlement sur l'IA est associée aux événements de trace spécifiques (appels d'outils, appels de modèle, interventions humaines, erreurs, événements système) qui la concernent. La rédaction se fonde uniquement sur cette preuve liée — le système est conçu pour signaler explicitement les lacunes plutôt que d'inventer un texte plausible lorsque la preuve manque.",
  },
  {
    q: "Que deviennent mes données de trace ?",
    a: "Les données de trace sont stockées par organisation avec des contrôles d'accès à la base de données au niveau des lignes, de sorte qu'une organisation ne peut jamais voir les données d'une autre. Seuls les événements spécifiquement liés comme preuve pour une section de documentation sont envoyés au modèle d'IA utilisé pour rédiger cette section.",
  },
  {
    q: "Dans quel format la documentation exportée est-elle fournie ?",
    a: "Attestly exporte un document Word (.docx) contenant chaque exigence, son statut de relecture actuel, si elle est générée par IA ou modifiée par un humain, et une liste des événements de trace exacts utilisés comme preuve à l'appui.",
  },
  {
    q: "En quoi Attestly diffère-t-il d'attestly.dev ?",
    a: "attestly.dev effectue une analyse statique de votre code source pour produire une documentation SaaS générique de confidentialité/conformité. Attestly lit les traces d'exécution de vos agents d'IA (OpenTelemetry, LangSmith, AgentOps, journaux MCP) et rédige la documentation annexe IV du règlement sur l'IA avec des liens de preuve vers des événements de trace spécifiques. Une analyse de code peut vous dire qu'un SDK est importé ; elle ne peut pas vous dire ce que l'agent a réellement fait — quels appels d'outils il a effectués, quand un humain est intervenu, quelles erreurs se sont produites, ou comment le comportement a changé entre les déploiements. C'est un produit différent pour une exigence différente.",
  },
  {
    q: "Puis-je utiliser Attestly avec une plateforme GRC ?",
    a: "Oui. Une plateforme GRC suit quels systèmes d'IA existent, qui les possède, et leur statut de politique global. Attestly produit le brouillon de documentation annexe IV sous-jacent pour un système spécifique, fondé sur les preuves d'exécution réelles de ce système. La plupart des clients utilisent les deux : la GRC pour l'inventaire et la propriété, Attestly pour la documentation elle-même, fondée sur les preuves.",
  },
  {
    q: "Que se passe-t-il si mon framework d'agent n'est pas répertorié ?",
    a: "Attestly accepte du JSON générique pré-normalisé en plus d'OpenTelemetry, LangSmith, AgentOps et des journaux MCP, de sorte que tout framework capable d'exporter ses événements de trace en JSON peut être ingéré même sans prise en charge native.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Attestly",
      url: SITE_URL,
      description: "Automatisation de la documentation de conformité au règlement sur l'IA pour les agents d'IA autonomes.",
      logo: `${SITE_URL}/icon.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@attestly.online",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/fr#website`,
      url: `${SITE_URL}/fr`,
      name: "Attestly",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "fr",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Attestly",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Regulatory Compliance Software",
      operatingSystem: "Web",
      publisher: { "@id": `${SITE_URL}/#organization` },
      description:
        "Attestly transforme les traces opérationnelles des agents d'IA (OpenTelemetry, LangSmith, AgentOps, journaux MCP) en documentation technique du règlement sur l'IA, en registres de gestion des risques et en preuves prêtes pour l'audit, avec une relecture humaine obligatoire avant toute finalisation.",
      offers: [
        { "@type": "Offer", name: "Starter", price: "79", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
        { "@type": "Offer", name: "Professional", price: "349", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
        { "@type": "Offer", name: "Enterprise", price: "1499", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
      ],
      featureList: [
        "Outil gratuit de classification des risques du règlement sur l'IA",
        "Pages publiques Trust Center pour partager le statut de conformité",
        "Preuves et approbations vérifiées cryptographiquement, inviolables",
        "Dossiers de preuves formels prêts pour l'audit, pour auditeurs et régulateurs",
        "Génération de documentation technique annexe IV du règlement sur l'IA",
        "Résumés de gestion des risques",
        "Listes de contrôle d'évaluation de conformité",
        "Pistes de preuves prêtes pour l'audit",
        "Ingestion de traces OpenTelemetry, LangSmith et AgentOps",
        "Flux de relecture humaine intégré",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/fr#faq`,
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

const PIPELINE_STEPS = [
  {
    icon: "01",
    title: "Vos agents s'exécutent",
    desc: "OpenTelemetry, LangSmith, AgentOps, ou journaux MCP — tout ce que vous émettez déjà.",
  },
  {
    icon: "02",
    title: "Attestly les structure",
    desc: "Appels d'outils, appels de modèle, interventions humaines et erreurs, normalisés et associés à l'annexe IV.",
  },
  {
    icon: "03",
    title: "Une personne valide",
    desc: "Chaque section générée est relue, modifiée ou rejetée avant de compter comme définitive.",
  },
];

const DELIVERABLES = [
  {
    title: "Documentation technique annexe IV",
    desc: "Description générale, spécification de conception et mesures de surveillance — rédigées à partir de ce que votre système a réellement fait.",
  },
  {
    title: "Résumés de gestion des risques",
    desc: "Risques identifiés, mesures d'atténuation et risque résiduel, retracés jusqu'aux événements qui les ont révélés.",
  },
  {
    title: "Listes de contrôle d'évaluation de conformité",
    desc: "Une vue continue de ce qui est couvert, de ce qui manque, et de ce qui nécessite encore une décision humaine.",
  },
  {
    title: "Pistes de preuves prêtes pour l'audit",
    desc: "Chaque phrase générée renvoie à l'événement de trace spécifique qui l'a justifiée, et chaque approbation est hachée cryptographiquement — inviolable, pas seulement affirmée.",
  },
];

export default function LandingPageFR() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="site-nav">
        <Link href="/fr" className="site-nav__brand" style={{ textDecoration: "none" }}>
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </Link>

        <input type="checkbox" id="nav-toggle" className="site-nav__toggle-checkbox" />
        <label htmlFor="nav-toggle" className="site-nav__toggle-label" aria-label="Menu">☰</label>

        <div className="site-nav__links">
          <Link href="/glossary" className="site-nav__link">Glossaire</Link>
          <Link href="/guides" className="site-nav__link">Guides</Link>
          <Link href="/fr/eu-ai-act-risk-checker" className="site-nav__link">Vérificateur de risque</Link>
          <Link href="/pricing" className="site-nav__link">Tarifs</Link>
          <LanguageSwitcher current="fr" paths={{ en: "/", fr: "/fr", de: "/de" }} />
          <Link href="/login" className="site-nav__cta">Se connecter</Link>
        </div>
      </nav>

      <header className="hero">
        <p className="hero__eyebrow">Règlement sur l'IA · Documentation technique</p>
        <div className="hero__grid">
          <div>
            <h1>Arrêtez de reconstruire manuellement ce que votre système d'IA a fait.</h1>
            <p>
              Attestly lit les traces que vos agents produisent déjà et les transforme en documentation
              technique du règlement sur l'IA, en registres de gestion des risques et en preuves prêtes
              pour l'audit — en continu, et non lors d'une course trimestrielle.
            </p>
            <Link href="/login" className="btn-primary">Commencer →</Link>
          </div>

          <div className="pipeline">
            <p className="pipeline__label">Comment ça marche</p>
            {PIPELINE_STEPS.map((step) => (
              <div className="pipeline__step" key={step.icon}>
                <span className="pipeline__step-icon">{step.icon}</span>
                <div>
                  <p className="pipeline__step-title">{step.title}</p>
                  <p className="pipeline__step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="section">
        <p className="section__eyebrow">Ce qu'il génère</p>
        <h2>Quatre documents que les équipes conformité construisent actuellement à la main.</h2>
        <div className="deliverables-grid">
          {DELIVERABLES.map((d) => (
            <div className="deliverable" key={d.title}>
              <p className="deliverable__title">{d.title}</p>
              <p className="deliverable__desc">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">À qui ça s'adresse</p>
        <h2>Conçu pour les équipes qui déploient réellement des agents d'IA dans l'UE.</h2>
        <div className="deliverables-grid">
          <div className="deliverable">
            <p className="deliverable__title">Startups d'IA</p>
            <p className="deliverable__desc">
              Déployant un agent autonome vers des clients européens et ayant besoin de documentation annexe IV
              avant le lancement, sans embauche dédiée à la conformité.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">Équipes IA d'entreprise</p>
            <p className="deliverable__desc">
              Exploitant des agents internes ou destinés aux clients sur plusieurs systèmes qui ont tous besoin
              d'une documentation continue, et non ponctuelle, à mesure que le comportement change.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">Équipes conformité et risque</p>
            <p className="deliverable__desc">
              Reconstruisant actuellement à la main ce qu'un système d'IA a fait à partir de journaux et
              d'entretiens, et ayant besoin d'un point de départ structuré et lié aux preuves à la place.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">Cabinets de conseil en gouvernance de l'IA</p>
            <p className="deliverable__desc">
              Produisant de la documentation annexe IV pour plusieurs clients et ayant besoin d'un outil qui
              transforme les traces de chaque client en un premier brouillon, plutôt que de repartir d'un
              modèle vierge à chaque fois.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Contexte</p>
        <h2>Ce que requiert réellement la documentation technique annexe IV du règlement sur l'IA</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)" }}>
          <p style={{ marginBottom: 16 }}>
            Le règlement sur l'IA exige que les fournisseurs de systèmes d'IA à haut risque maintiennent une
            documentation technique au titre de l'annexe IV avant la mise sur le marché du système, et la
            tiennent à jour à mesure que le système évolue. L'annexe IV précise plusieurs éléments requis :
            une description générale du système et de sa finalité prévue, les détails de son processus de
            conception et de développement, des informations sur la manière dont il est surveillé et contrôlé
            une fois déployé, des indicateurs de performance et de validation, des mesures de gestion des
            risques, et un registre des changements significatifs apportés tout au long du cycle de vie du
            système.
          </p>
          <p>
            En pratique, la plupart des preuves sous-jacentes à ces sections existent déjà dans les traces
            opérationnelles propres du système — quels appels d'outils il a effectués, quand un humain est
            intervenu, quelles erreurs se sont produites, ce qui a changé entre les déploiements. Le rôle
            d'Attestly est de lire cette preuve directement à partir de vos traces et de l'associer à chaque
            exigence de l'annexe IV, plutôt que de faire reconstruire manuellement cela après coup à partir de
            journaux, de tickets et de mémoire.
          </p>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Pourquoi pas une plateforme GRC généraliste</p>
        <h2>Les outils de gouvernance IA généralistes s'arrêtent une étape avant cela.</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink-muted)" }}>
          <p style={{ marginBottom: 16 }}>
            Les plateformes de gouvernance IA généralistes sont construites autour de la gestion des politiques,
            des inventaires de systèmes et des tableaux de bord de surveillance — utiles pour suivre le fait
            qu'un système d'IA existe et a un propriétaire, mais elles n'ingèrent pas les traces d'exécution
            réelles d'un agent et ne les transforment pas en documentation annexe IV rédigée avec des liens de
            preuve vers des événements spécifiques. Cet écart — transformer le comportement réel de l'agent en
            documentation de conformité structurée et fondée sur des preuves — est le problème spécifique
            qu'Attestly est conçu pour résoudre, pas un tableau de bord de gouvernance plus large.
          </p>
          <p>
            Attestly ne remplace pas une relecture juridique, une plateforme GRC, ou un pare-feu IA. C'est
            l'outil qui transforme les données de trace opérationnelles en un brouillon de documentation qu'un
            professionnel de la conformité peut relire en quelques minutes plutôt que de le construire à partir
            de zéro.
          </p>
        </div>
      </section>


      <section className="section" id="why-traces-not-scans">
        <p className="section__eyebrow">Pourquoi les traces d'exécution, pas les analyses de code</p>
        <h2>Une analyse statique de votre dépôt ne peut pas voir ce que votre agent a réellement fait.</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)", marginBottom: 24 }}>
          <p>
            L'analyse du code source peut vous dire quels SDK et appels de modèle sont connectés. Elle ne peut
            pas vous dire ce qui s'est passé à l'exécution : quels outils un agent a réellement invoqués, quand
            un humain est intervenu pour outrepasser une décision, quels appels ont échoué, ou comment le
            comportement du système a changé d'un déploiement à l'autre. L'annexe IV demande spécifiquement
            cette preuve opérationnelle — et elle n'existe que dans les traces d'exécution, pas dans un dépôt.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}></th>
                <th style={{ padding: "10px 12px", color: "var(--color-primary)" }}>Attestly (traces d'exécution)</th>
                <th style={{ padding: "10px 12px", color: "var(--color-ink-faint)" }}>Outils d'analyse de code</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Voit le comportement réel de l'agent", true, false],
                ["Capture les interventions humaines", true, false],
                ["Lien de preuve par phrase générée", true, false],
                ["Fonctionne avec des agents que vous n'avez pas construits (MCP, outils tiers)", true, false],
                ["Se met à jour à mesure que le comportement change", true, false],
              ].map(([label, us, them]) => (
                <tr key={label as string} style={{ borderBottom: "1px solid var(--color-line)" }}>
                  <td style={{ padding: "10px 12px", color: "var(--color-ink)" }}>{label as string}</td>
                  <td style={{ padding: "10px 12px" }}>{us ? "✓" : "—"}</td>
                  <td style={{ padding: "10px 12px", color: "var(--color-ink-faint)" }}>{them ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 16 }}>
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)", fontSize: 14 }}>
            Lire l'analyse complète (en anglais) de pourquoi l'annexe IV a besoin de preuves d'exécution →
          </Link>
        </p>
      </section>

      <section className="section" id="supported-trace-sources">
        <p className="section__eyebrow">Sources de traces prises en charge</p>
        <h2>Ingérez ce que vos agents émettent déjà.</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {[
            { name: "OpenTelemetry", href: "#supported-trace-sources" },
            { name: "LangSmith", href: "#supported-trace-sources" },
            { name: "AgentOps", href: "#supported-trace-sources" },
            { name: "MCP", href: "#supported-trace-sources" },
            { name: "JSON pré-normalisé", href: "#supported-trace-sources" },
          ].map((s) => (
            <a
              key={s.name}
              href={s.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: 999,
                border: "1px solid var(--color-line)",
                fontSize: 13.5,
                fontFamily: "var(--font-mono)",
                color: "var(--color-ink)",
                textDecoration: "none",
                background: "var(--color-primary-tint)",
              }}
            >
              {s.name}
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="live-example">
        <p className="section__eyebrow">Exemple concret</p>
        <h2>D'un événement de trace à une phrase de l'annexe IV.</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink-muted)", marginBottom: 20, maxWidth: "68ch" }}>
          Une illustration simplifiée de la manière dont une poignée d'événements de trace normalisés se
          traduisent en une seule phrase de documentation rédigée — avec un lien vers l'événement exact qui l'a
          justifiée.
        </p>
        <pre
          className="mono"
          style={{
            background: "var(--color-ink)",
            color: "#e6f2ef",
            padding: 20,
            borderRadius: 8,
            fontSize: 12.5,
            lineHeight: 1.6,
            overflowX: "auto",
          }}
        >
{`[
  { "event": "tool_call", "tool": "refund_api", "id": "a91f02c1", "status": "success" },
  { "event": "human_intervention", "actor": "reviewer@acme.eu", "id": "a91f02c2", "action": "approved" },
  { "event": "error", "id": "a91f02c3", "message": "timeout on retry 2" },
  { "event": "deployment_change", "id": "a91f02c4", "from": "v1.4", "to": "v1.5" }
]`}
        </pre>
        <div style={{ marginTop: 16, padding: 18, border: "1px solid var(--color-line)", borderRadius: 8, background: "white" }}>
          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-ink-faint)", marginBottom: 8 }}>
            Section annexe IV rédigée — Mesures de surveillance
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--color-ink)" }}>
            « Le système a invoqué de manière autonome l'API de remboursement, qu'un relecteur humain a
            ensuite approuvée après un premier dépassement de délai ; le système a été mis à jour de la v1.4 à
            la v1.5 peu après. »{" "}
            <span
              className="mono"
              style={{ fontSize: 12, color: "var(--color-primary)", whiteSpace: "nowrap" }}
            >
              [preuve : trace #a91f02c1]
            </span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="trust-strip">
          Attestly ne fournit pas de conseil juridique et ne garantit pas la conformité réglementaire.
          Chaque section générée est clairement marquée comme générée par IA, fournie par l'utilisateur, ou
          manquante — et nécessite une relecture, une modification ou une approbation humaine avant l'export.
        </div>
      </section>

      <section className="section">
        <div style={{ background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8, padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="mono" style={{ fontSize: 12, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Outil gratuit</p>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Vous ne savez pas si votre système d'IA est à haut risque ?</p>
            <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)" }}>Répondez à quelques questions et obtenez une classification directionnelle du risque selon le règlement sur l'IA.</p>
          </div>
          <Link href="/fr/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none", whiteSpace: "nowrap" }}>Vérifier maintenant →</Link>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Questions fréquentes</p>
        <h2>Questions courantes</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: "65ch" }}>
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{faq.q}</p>
              <p style={{ fontSize: 14, color: "var(--color-ink-muted)", lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span className="site-nav__brand">
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </span>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/guides" className="site-footer__meta" style={{ textDecoration: "none" }}>Guides</Link>
          <Link href="/about" className="site-footer__meta" style={{ textDecoration: "none" }}>À propos</Link>
          <Link href="/changelog" className="site-footer__meta" style={{ textDecoration: "none" }}>Journal des modifications</Link>
          <Link href="/terms" className="site-footer__meta" style={{ textDecoration: "none" }}>Conditions</Link>
          <Link href="/privacy" className="site-footer__meta" style={{ textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/refund-policy" className="site-footer__meta" style={{ textDecoration: "none" }}>Remboursements</Link>
          <a href="mailto:support@attestly.online" className="site-footer__meta" style={{ textDecoration: "none" }}>support@attestly.online</a>
          <span className="site-footer__meta">Conçu pour les équipes qui déploient des agents d'IA autonomes dans l'UE</span>
        </div>
      </footer>
    </>
  );
}
