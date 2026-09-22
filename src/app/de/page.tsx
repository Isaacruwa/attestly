import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const SITE_URL = "https://attestly.online";

export const metadata: Metadata = buildMetadata({
  title: "Attestly — Technische Dokumentation zur KI-Verordnung aus Agenten-Traces",
  description:
    "Attestly liest die Traces, die Ihre KI-Agenten bereits erzeugen (OpenTelemetry, LangSmith, AgentOps), und erstellt die technische Dokumentation nach Anhang IV der KI-Verordnung mit Nachweisverknüpfungen — von Menschen geprüft, auditbereit.",
  path: "/de",
  hreflang: { en: "/", fr: "/fr", de: "/de" },
});

const FAQS = [
  {
    q: "Bietet Attestly Rechtsberatung oder garantiert Konformität?",
    a: "Nein. Attestly bietet keine Rechtsberatung und garantiert keine regulatorische Konformität. Jeder generierte Abschnitt wird von einem Menschen geprüft, bearbeitet und freigegeben, bevor er als endgültig gilt.",
  },
  {
    q: "Welche Trace-Quellen unterstützt Attestly?",
    a: "Attestly nimmt OpenTelemetry-Traces, LangSmith-Runs, AgentOps-Sessions und generisches vornormalisiertes JSON auf.",
  },
  {
    q: "Für wen ist Attestly gedacht?",
    a: "Für KI-Startups, die Agenten an EU-Kunden ausliefern, Enterprise-KI-Teams mit mehreren Systemen, Compliance- und Risikoteams sowie KI-Governance-Beratungen, die Dokumentation für Kunden erstellen.",
  },
  {
    q: "Wie unterscheidet sich Attestly von einer generischen KI-Governance-Plattform?",
    a: "Breite KI-Governance-Tools konzentrieren sich auf Richtlinienverwaltung, Systeminventare und Überwachungs-Dashboards. Attestly nimmt speziell die operativen Traces eines Agenten auf und wandelt sie in entworfene Anhang-IV-Dokumentation mit Nachweisverknüpfungen zu den genauen Ereignissen um, die jeden Abschnitt begründen — ein engeres, tieferes Problem als ein allgemeines Governance-Dashboard abdeckt.",
  },
  {
    q: "Gibt es einen kostenlosen Plan?",
    a: "Ja. Die kostenlose Stufe umfasst ein KI-System und zehn Dokumentationserstellungen auf Lebenszeit — genug, um die Anhang-IV-Dokumentation eines Systems vollständig zu entwerfen und das Produkt vor dem Abonnement zu testen.",
  },
  {
    q: "Woher weiß Attestly, was in jedem Dokumentationsabschnitt zu schreiben ist?",
    a: "Jede Anforderung nach Anhang IV der KI-Verordnung wird den dafür relevanten Trace-Ereignissen zugeordnet (Tool-Aufrufe, Modellaufrufe, menschliche Eingriffe, Fehler, Systemereignisse). Die Entwurfserstellung stützt sich ausschließlich auf diesen verknüpften Nachweis — das System ist angewiesen, Lücken ausdrücklich zu kennzeichnen, statt plausibel klingenden Text zu erfinden, wenn Nachweise fehlen.",
  },
  {
    q: "Was passiert mit meinen Trace-Daten?",
    a: "Trace-Daten werden pro Organisation mit Datenbankzugriffskontrollen auf Zeilenebene gespeichert, sodass eine Organisation niemals die Daten einer anderen sehen kann. Nur die spezifischen, als Nachweis für einen Dokumentationsabschnitt verknüpften Ereignisse werden an das für diesen Abschnitt verwendete KI-Modell gesendet.",
  },
  {
    q: "In welchem Format wird die exportierte Dokumentation bereitgestellt?",
    a: "Attestly exportiert ein Word-Dokument (.docx) mit jeder Anforderung, ihrem aktuellen Prüfstatus, ob sie KI-generiert oder von Menschen bearbeitet ist, und einer Liste der genauen Trace-Ereignisse, die als unterstützender Nachweis dienen.",
  },
  {
    q: "Wie unterscheidet sich Attestly von attestly.dev?",
    a: "attestly.dev führt eine statische Analyse Ihres Quellcodes durch, um generische SaaS-Datenschutz-/Compliance-Dokumentation zu erstellen. Attestly liest die Laufzeit-Traces Ihrer KI-Agenten (OpenTelemetry, LangSmith, AgentOps, MCP-Logs) und erstellt die Anhang-IV-Dokumentation der KI-Verordnung mit Nachweisverknüpfungen zu spezifischen Trace-Ereignissen. Ein Code-Scan kann Ihnen sagen, dass ein SDK importiert ist; er kann Ihnen nicht sagen, was der Agent tatsächlich getan hat — welche Tool-Aufrufe er gemacht hat, wann ein Mensch eingegriffen hat, welche Fehler aufgetreten sind oder wie sich das Verhalten zwischen Bereitstellungen geändert hat. Das ist ein anderes Produkt für eine andere Anforderung.",
  },
  {
    q: "Kann ich Attestly zusammen mit einer GRC-Plattform nutzen?",
    a: "Ja. Eine GRC-Plattform verfolgt, welche KI-Systeme existieren, wem sie gehören und ihren allgemeinen Richtlinienstatus. Attestly erstellt den zugrunde liegenden Anhang-IV-Dokumentationsentwurf für ein bestimmtes System, gestützt auf die tatsächlichen Laufzeitnachweise dieses Systems. Die meisten Kunden nutzen beides: GRC für Inventar und Zuständigkeit, Attestly für die nachweisgestützte Dokumentation selbst.",
  },
  {
    q: "Was, wenn mein Agenten-Framework nicht aufgeführt ist?",
    a: "Attestly akzeptiert zusätzlich zu OpenTelemetry, LangSmith, AgentOps und MCP-Logs generisches vornormalisiertes JSON, sodass jedes Framework, das seine Trace-Ereignisse als JSON exportieren kann, auch ohne native Unterstützung aufgenommen werden kann.",
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
      description: "Automatisierte Dokumentation zur Konformität mit der KI-Verordnung für autonome KI-Agenten.",
      logo: `${SITE_URL}/icon.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@attestly.online",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/de#website`,
      url: `${SITE_URL}/de`,
      name: "Attestly",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "de",
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
        "Attestly wandelt die operativen Traces von KI-Agenten (OpenTelemetry, LangSmith, AgentOps, MCP-Logs) in technische Dokumentation zur KI-Verordnung, Risikomanagement-Aufzeichnungen und auditbereite Nachweise um, mit verpflichtender menschlicher Prüfung, bevor etwas endgültig ist.",
      offers: [
        { "@type": "Offer", name: "Starter", price: "79", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
        { "@type": "Offer", name: "Professional", price: "349", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
        { "@type": "Offer", name: "Enterprise", price: "1499", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
      ],
      featureList: [
        "Kostenloses Tool zur Risikoeinstufung nach der KI-Verordnung",
        "Öffentliche Trust-Center-Seiten zur Weitergabe des Compliance-Status",
        "Kryptografisch verifizierte, manipulationssichere Nachweise und Freigaben",
        "Formale, auditbereite Nachweispakete für Prüfer und Behörden",
        "Erstellung technischer Anhang-IV-Dokumentation nach der KI-Verordnung",
        "Risikomanagement-Zusammenfassungen",
        "Checklisten zur Konformitätsbewertung",
        "Auditbereite Nachweisketten",
        "Aufnahme von OpenTelemetry-, LangSmith- und AgentOps-Traces",
        "Human-in-the-Loop-Prüfworkflow",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/de#faq`,
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
    title: "Ihre Agenten laufen",
    desc: "OpenTelemetry, LangSmith, AgentOps oder MCP-Logs — was auch immer Sie bereits ausgeben.",
  },
  {
    icon: "02",
    title: "Attestly strukturiert es",
    desc: "Tool-Aufrufe, Modellaufrufe, menschliche Eingriffe und Fehler, normalisiert und Anhang IV zugeordnet.",
  },
  {
    icon: "03",
    title: "Ein Mensch gibt frei",
    desc: "Jeder generierte Abschnitt wird geprüft, bearbeitet oder abgelehnt, bevor er als endgültig gilt.",
  },
];

const DELIVERABLES = [
  {
    title: "Technische Anhang-IV-Dokumentation",
    desc: "Allgemeine Beschreibung, Konstruktionsspezifikation und Überwachungsmaßnahmen — erstellt aus dem, was Ihr System tatsächlich getan hat.",
  },
  {
    title: "Risikomanagement-Zusammenfassungen",
    desc: "Identifizierte Risiken, Minderungsmaßnahmen und Restrisiko, zurückverfolgt zu den Ereignissen, die sie aufgedeckt haben.",
  },
  {
    title: "Checklisten zur Konformitätsbewertung",
    desc: "Eine laufende Übersicht darüber, was abgedeckt ist, was fehlt und was noch eine menschliche Entscheidung braucht.",
  },
  {
    title: "Auditbereite Nachweisketten",
    desc: "Jeder generierte Satz verlinkt auf das spezifische Trace-Ereignis, das ihn begründet hat, und jede Freigabe ist kryptografisch gehasht — manipulationssicher, nicht nur behauptet.",
  },
];

export default function LandingPageDE() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="site-nav">
        <Link href="/de" className="site-nav__brand" style={{ textDecoration: "none" }}>
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </Link>

        <input type="checkbox" id="nav-toggle" className="site-nav__toggle-checkbox" />
        <label htmlFor="nav-toggle" className="site-nav__toggle-label" aria-label="Menü">☰</label>

        <div className="site-nav__links">
          <Link href="/glossary" className="site-nav__link">Glossar</Link>
          <Link href="/guides" className="site-nav__link">Guides</Link>
          <Link href="/de/eu-ai-act-risk-checker" className="site-nav__link">Risikoprüfung</Link>
          <Link href="/pricing" className="site-nav__link">Preise</Link>
          <LanguageSwitcher current="de" paths={{ en: "/", fr: "/fr", de: "/de" }} />
          <Link href="/login" className="site-nav__cta">Anmelden</Link>
        </div>
      </nav>

      <header className="hero">
        <p className="hero__eyebrow">KI-Verordnung · Technische Dokumentation</p>
        <div className="hero__grid">
          <div>
            <h1>Hören Sie auf, manuell zu rekonstruieren, was Ihr KI-System getan hat.</h1>
            <p>
              Attestly liest die Traces, die Ihre Agenten bereits erzeugen, und verwandelt sie in technische
              Dokumentation zur KI-Verordnung, Risikomanagement-Aufzeichnungen und auditbereite Nachweise —
              fortlaufend, nicht als vierteljährliche Hetze.
            </p>
            <Link href="/login" className="btn-primary">Loslegen →</Link>
          </div>

          <div className="pipeline">
            <p className="pipeline__label">So funktioniert's</p>
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
        <p className="section__eyebrow">Was es erzeugt</p>
        <h2>Vier Dokumente, die Compliance-Teams derzeit von Hand erstellen.</h2>
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
        <p className="section__eyebrow">Für wen es gedacht ist</p>
        <h2>Gebaut für Teams, die tatsächlich KI-Agenten in die EU ausliefern.</h2>
        <div className="deliverables-grid">
          <div className="deliverable">
            <p className="deliverable__title">KI-Startups</p>
            <p className="deliverable__desc">
              Die einen autonomen Agenten an EU-Kunden ausliefern und vor dem Launch Anhang-IV-Dokumentation
              benötigen, ohne eine eigene Compliance-Stelle einzurichten.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">Enterprise-KI-Teams</p>
            <p className="deliverable__desc">
              Die interne oder kundenseitige Agenten über mehrere Systeme hinweg betreiben, die alle laufende
              statt einmalige Dokumentation benötigen, während sich das Verhalten ändert.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">Compliance- und Risikoteams</p>
            <p className="deliverable__desc">
              Die derzeit von Hand aus Logs und Interviews rekonstruieren, was ein KI-System getan hat, und
              stattdessen einen strukturierten, nachweisverknüpften Ausgangspunkt benötigen.
            </p>
          </div>
          <div className="deliverable">
            <p className="deliverable__title">KI-Governance-Beratungen</p>
            <p className="deliverable__desc">
              Die Anhang-IV-Dokumentation für mehrere Kunden erstellen und ein Tool benötigen, das die Traces
              jedes Kunden in einen ersten Entwurf verwandelt, statt jedes Mal bei einer leeren Vorlage
              anzufangen.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Hintergrund</p>
        <h2>Was die technische Anhang-IV-Dokumentation der KI-Verordnung tatsächlich verlangt</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)" }}>
          <p style={{ marginBottom: 16 }}>
            Die KI-Verordnung verlangt von Anbietern von Hochrisiko-KI-Systemen, technische Dokumentation nach
            Anhang IV zu führen, bevor das System auf den Markt gebracht wird, und sie aktuell zu halten,
            während sich das System ändert. Anhang IV legt mehrere erforderliche Elemente fest: eine
            allgemeine Beschreibung des Systems und seines beabsichtigten Zwecks, Details zu seinem
            Konstruktions- und Entwicklungsprozess, Informationen darüber, wie es nach der Bereitstellung
            überwacht und kontrolliert wird, Leistungs- und Validierungsmetriken, Risikomanagementmaßnahmen
            und eine Aufzeichnung wesentlicher Änderungen über den gesamten Lebenszyklus des Systems.
          </p>
          <p>
            In der Praxis existiert der Großteil der zugrunde liegenden Nachweise für diese Abschnitte bereits
            in den eigenen operativen Traces des Systems — welche Tool-Aufrufe es gemacht hat, wann ein Mensch
            eingegriffen hat, welche Fehler aufgetreten sind, was sich zwischen Bereitstellungen geändert hat.
            Attestlys Aufgabe ist es, diesen Nachweis direkt aus Ihren Traces zu lesen und jeder
            Anhang-IV-Anforderung zuzuordnen, statt jemanden dies nachträglich manuell aus Logs, Tickets und
            Erinnerung rekonstruieren zu lassen.
          </p>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Warum keine generische GRC-Plattform</p>
        <h2>Allgemeine KI-Governance-Tools hören einen Schritt vor diesem Punkt auf.</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink-muted)" }}>
          <p style={{ marginBottom: 16 }}>
            Breite KI-Governance-Plattformen sind um Richtlinienverwaltung, Systeminventare und
            Überwachungs-Dashboards herum aufgebaut — nützlich, um zu verfolgen, dass ein KI-System existiert
            und einen Eigentümer hat, aber sie nehmen nicht die tatsächlichen Ausführungs-Traces eines Agenten
            auf und wandeln sie nicht in entworfene Anhang-IV-Dokumentation mit Nachweisverknüpfungen zu
            spezifischen Ereignissen um. Diese Lücke — reales Agentenverhalten in strukturierte,
            nachweisgestützte Compliance-Dokumentation zu verwandeln — ist das spezifische Problem, für das
            Attestly gebaut wurde, kein breiteres Governance-Dashboard.
          </p>
          <p>
            Attestly ist kein Ersatz für eine rechtliche Prüfung, eine GRC-Plattform oder eine KI-Firewall. Es
            ist das Tool, das operative Trace-Daten in einen Dokumentationsentwurf verwandelt, den eine
            Compliance-Fachkraft in Minuten statt von Grund auf neu prüfen kann.
          </p>
        </div>
      </section>


      <section className="section" id="why-traces-not-scans">
        <p className="section__eyebrow">Warum Laufzeit-Traces statt Code-Scans</p>
        <h2>Ein statischer Scan Ihres Repositorys kann nicht sehen, was Ihr Agent tatsächlich getan hat.</h2>
        <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: 1.7, color: "var(--color-ink)", marginBottom: 24 }}>
          <p>
            Das Scannen von Quellcode kann Ihnen sagen, welche SDKs und Modellaufrufe verdrahtet sind. Es kann
            Ihnen nicht sagen, was zur Laufzeit passiert ist: welche Tools ein Agent tatsächlich aufgerufen
            hat, wann ein Mensch eingegriffen hat, um eine Entscheidung zu überstimmen, welche Aufrufe
            fehlgeschlagen sind oder wie sich das Verhalten des Systems von einer Bereitstellung zur nächsten
            geändert hat. Anhang IV verlangt genau diesen operativen Nachweis — und er existiert nur in
            Ausführungs-Traces, nicht in einem Repository.
          </p>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-line)", textAlign: "left" }}>
                <th style={{ padding: "10px 12px" }}></th>
                <th style={{ padding: "10px 12px", color: "var(--color-primary)" }}>Attestly (Laufzeit-Traces)</th>
                <th style={{ padding: "10px 12px", color: "var(--color-ink-faint)" }}>Code-Scan-Tools</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sieht tatsächliches Agentenverhalten", true, false],
                ["Erfasst menschliche Eingriffe", true, false],
                ["Nachweisverknüpfung pro generiertem Satz", true, false],
                ["Funktioniert mit Agenten, die Sie nicht selbst gebaut haben (MCP, Tools Dritter)", true, false],
                ["Aktualisiert sich mit dem Verhalten", true, false],
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
            Die vollständige Analyse lesen (auf Englisch), warum Anhang IV Laufzeitnachweise braucht →
          </Link>
        </p>
      </section>

      <section className="section" id="supported-trace-sources">
        <p className="section__eyebrow">Unterstützte Trace-Quellen</p>
        <h2>Nehmen Sie auf, was Ihre Agenten bereits ausgeben.</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {[
            { name: "OpenTelemetry", href: "#supported-trace-sources" },
            { name: "LangSmith", href: "#supported-trace-sources" },
            { name: "AgentOps", href: "#supported-trace-sources" },
            { name: "MCP", href: "#supported-trace-sources" },
            { name: "Vornormalisiertes JSON", href: "#supported-trace-sources" },
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
        <p className="section__eyebrow">Praxisbeispiel</p>
        <h2>Von einem Trace-Ereignis zu einem Anhang-IV-Satz.</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-ink-muted)", marginBottom: 20, maxWidth: "68ch" }}>
          Eine vereinfachte, illustrative Darstellung, wie sich eine Handvoll normalisierter Trace-Ereignisse
          in einen einzelnen entworfenen Dokumentationssatz übersetzen — mit einem Link zurück zu dem genauen
          Ereignis, das ihn begründet hat.
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
            Entworfener Anhang-IV-Abschnitt — Überwachungsmaßnahmen
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--color-ink)" }}>
            „Das System rief eigenständig die Rückerstattungs-API auf, die ein menschlicher Prüfer anschließend
            nach einem anfänglichen Timeout bei einem erneuten Versuch genehmigte; das System wurde kurz
            danach von v1.4 auf v1.5 aktualisiert."{" "}
            <span
              className="mono"
              style={{ fontSize: 12, color: "var(--color-primary)", whiteSpace: "nowrap" }}
            >
              [Nachweis: Trace #a91f02c1]
            </span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="trust-strip">
          Attestly bietet keine Rechtsberatung und garantiert keine regulatorische Konformität. Jeder
          generierte Abschnitt ist eindeutig als KI-generiert, vom Nutzer bereitgestellt oder fehlend
          gekennzeichnet — und erfordert eine menschliche Prüfung, Bearbeitung oder Freigabe vor dem Export.
        </div>
      </section>

      <section className="section">
        <div style={{ background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8, padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="mono" style={{ fontSize: 12, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Kostenloses Tool</p>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Nicht sicher, ob Ihr KI-System hochriskant ist?</p>
            <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)" }}>Beantworten Sie ein paar Fragen und erhalten Sie eine richtungsweisende Risikoeinstufung nach der KI-Verordnung.</p>
          </div>
          <Link href="/de/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none", whiteSpace: "nowrap" }}>Jetzt prüfen →</Link>
        </div>
      </section>

      <section className="section">
        <p className="section__eyebrow">Häufig gestellte Fragen</p>
        <h2>Häufige Fragen</h2>
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
          <Link href="/about" className="site-footer__meta" style={{ textDecoration: "none" }}>Über uns</Link>
          <Link href="/changelog" className="site-footer__meta" style={{ textDecoration: "none" }}>Änderungsprotokoll</Link>
          <Link href="/terms" className="site-footer__meta" style={{ textDecoration: "none" }}>Nutzungsbedingungen</Link>
          <Link href="/privacy" className="site-footer__meta" style={{ textDecoration: "none" }}>Datenschutz</Link>
          <Link href="/refund-policy" className="site-footer__meta" style={{ textDecoration: "none" }}>Rückerstattungen</Link>
          <a href="mailto:support@attestly.online" className="site-footer__meta" style={{ textDecoration: "none" }}>support@attestly.online</a>
          <span className="site-footer__meta">Gebaut für Teams, die autonome KI-Agenten in die EU ausliefern</span>
        </div>
      </footer>
    </>
  );
}
