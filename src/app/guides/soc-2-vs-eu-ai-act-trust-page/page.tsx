import RelatedLinks from "@/components/RelatedLinks";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "SOC 2 Trust Page vs EU AI Act Trust Page: Key Differences",
  description:
    "How a SOC 2 trust page differs from an EU AI Act trust page, what each one proves, and how to run both without overclaiming.",
  path: "/guides/soc-2-vs-eu-ai-act-trust-page",
});

export default function GuideSoc2VsAiActTrustPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>← Guides</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        This is general information, not legal advice. Verify current requirements with a qualified professional
        before making compliance decisions.
      </div>

      <p className="section__eyebrow">Guide</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        SOC 2 trust page vs EU AI Act trust page: what is different
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Teams that already run a SOC 2 trust page often assume the same page can cover the EU AI Act. It
          cannot, because the two things measure different matters. This guide explains the difference and how
          to run both side by side. For the basics of the page itself, see <Link href="/guides/compliance-trust-center" style={{ color: "var(--color-primary)" }}>how to build a compliance trust center</Link>.
        </p>

        <h2 style={h2}>What a SOC 2 trust page shows</h2>
        <p style={p}>
          SOC 2 is an attestation. An independent auditor examines your controls against the AICPA Trust
          Services Criteria, which cover security and can also cover availability, processing integrity,
          confidentiality and privacy. The result is a report, and the trust page typically shows that you hold
          it, which areas it covers and whether controls are currently passing. It is about how you run your
          organization and infrastructure.
        </p>

        <h2 style={h2}>What an EU AI Act page is about</h2>
        <p style={p}>
          The EU AI Act is a regulation about specific AI systems. For high-risk systems it sets duties such as
          technical documentation (<Link href="/guides/eu-ai-act-annex-iv-explained" style={{ color: "var(--color-primary)" }}>Annex IV</Link>), record-keeping (<Link href="/guides/eu-ai-act-article-12-logging" style={{ color: "var(--color-primary)" }}>Article 12</Link>) and post-market monitoring (<Link href="/guides/ai-act-article-72-monitoring" style={{ color: "var(--color-primary)" }}>Article 72</Link>). A page on
          this topic reports progress against those duties for named systems. It is a statement about a system,
          not about your company as a whole.
        </p>

        <h2 style={h2}>The key differences</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Subject.</strong> SOC 2 describes your organization&apos;s controls. The AI Act describes
            individual AI systems.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Who confirms it.</strong> A SOC 2 report comes from an outside auditor. For many high-risk
            systems the AI Act conformity route is based on the provider&apos;s own internal control, so the
            claim often rests on your own documented assessment. Which route applies depends on the system, so
            check this with a professional.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>What changes it.</strong> A SOC 2 report covers a period. AI Act documentation should change
            whenever the system changes materially.
          </li>
          <li>
            <strong>Wording risk.</strong> &quot;SOC 2 compliant&quot; has an established meaning. &quot;AI Act
            compliant&quot; does not translate the same way, so describe documented progress instead.
          </li>
        </ul>

        <h2 style={h2}>Running both without confusion</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>Keep them in separate sections of the same trust page.</li>
          <li style={{ marginBottom: 10 }}>Label the SOC 2 part as an auditor-issued report and the AI part as your own assessment.</li>
          <li style={{ marginBottom: 10 }}>List AI systems by name, since the AI Act applies per system.</li>
          <li>Keep sensitive detail on both private and shared only on request.</li>
        </ul>

        <p style={p}>
          For a layout you can copy, see <Link href="/guides/ai-trust-center-examples" style={{ color: "var(--color-primary)" }}>AI trust center examples</Link>.
        </p>

        <div style={{ marginTop: 36, padding: 24, background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8 }}>
          <p style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>Not sure if your system is high-risk?</p>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 14 }}>
            Run the free EU AI Act risk checker. No signup required.
          </p>
          <Link href="/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none", display: "inline-flex" }}>
            Check now →
          </Link>
        </div>
      </div>
      <RelatedLinks current="/guides/soc-2-vs-eu-ai-act-trust-page" />
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 28, marginBottom: 10 };
const p: React.CSSProperties = { marginBottom: 16 };
