import RelatedLinks from "@/components/RelatedLinks";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "How to Build a Compliance Trust Center for AI Systems",
  description:
    "What a compliance trust center is, what to publish on it, what to keep private, and how to set one up for an AI system under the EU AI Act.",
  path: "/guides/compliance-trust-center",
});

export default function GuideComplianceTrustCenter() {
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
        How to build a compliance trust center for an AI system
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          A compliance trust center is a public page that shows, in summary, where your compliance work stands.
          Customers, partners and auditors can check it without asking you for a full report every time. This
          guide covers what to put on one, what to leave off, and how to set one up when the thing you are
          documenting is an AI system. For the short definition, see the glossary entry on{" "}
          <Link href="/glossary/compliance-trust-center" style={{ color: "var(--color-primary)" }}>what a compliance trust center is</Link>.
        </p>

        <h2 style={h2}>Why a trust center helps</h2>
        <p style={p}>
          Enterprise buyers increasingly ask the same questions before they sign: is this system documented, who
          reviewed it, and when was that last updated. Answering by email, one buyer at a time, is slow. A
          trust center answers once, in public, and gives you a link to drop into sales material, security
          questionnaires and your own website. Established compliance platforms use the same pattern for SOC 2
          and similar frameworks.
        </p>

        <h2 style={h2}>What to publish</h2>
        <p style={p}>
          Publish aggregate status, not content. A useful AI trust center usually shows:
        </p>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Which systems are covered</strong>, by name and purpose, in one line each.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Documentation progress.</strong> How many required sections are drafted, reviewed and
            approved, for example against the nine areas of{" "}
            <Link href="/guides/eu-ai-act-annex-iv-explained" style={{ color: "var(--color-primary)" }}>Annex IV</Link>.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Risk classification.</strong> The tier you assessed the system as, with a note that it is
            your own assessment.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Last updated date.</strong> A page that never changes reads as abandoned.
          </li>
          <li>
            <strong>A contact route</strong> for reviewers who need the full documentation under an NDA.
          </li>
        </ul>

        <h2 style={h2}>What to keep off it</h2>
        <p style={p}>
          Anything that would hurt you if a competitor or the general public read it. That means the document
          text itself, raw evidence, trace data, prompts, customer details and security findings. The trust
          center is a signal that the work exists. The real documentation goes privately to the person who
          actually needs to review it, such as an auditor, a regulator or a customer&apos;s security team.
        </p>

        <h2 style={h2}>Do not overclaim</h2>
        <p style={p}>
          The fastest way to lose trust is a page that says more than your records support. Avoid words like
          &quot;compliant&quot; or &quot;certified&quot; unless a formal process has actually produced that result. Say
          what is true: documentation drafted, reviewed by a named person, approved on a date. Under the EU AI
          Act, high-risk systems have specific duties around technical documentation, logging and post-market
          monitoring, and a trust page should reflect where you actually are on those, not where you intend to
          be.
        </p>

        <h2 style={h2}>Keep it connected to the real records</h2>
        <p style={p}>
          A trust center that someone updates by hand drifts out of date. The better pattern is to generate the
          summary from the same records that hold your documentation, so the numbers on the page change when the
          underlying work changes. That is easiest when your evidence already comes from system activity. If
          your agent produces traces, they feed both the documentation and the status shown publicly, and{" "}
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)" }}>Why traces beat scans</Link> explains why that evidence is stronger than a one-off scan. Logging requirements are covered in{" "}
          <Link href="/guides/eu-ai-act-article-12-logging" style={{ color: "var(--color-primary)" }}>the Article 12 guide</Link>.
        </p>

        <h2 style={h2}>A simple setup checklist</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>List the AI systems you want covered and who owns each one.</li>
          <li style={{ marginBottom: 10 }}>Decide the few summary numbers you are happy to make public.</li>
          <li style={{ marginBottom: 10 }}>Name a reviewer for every section shown as approved.</li>
          <li style={{ marginBottom: 10 }}>Add a visible last-updated date and a contact route.</li>
          <li style={{ marginBottom: 10 }}>Link the page from your site footer, sales deck and security questionnaire answers.</li>
          <li>Review it on a schedule, and after any significant change to a system.</li>
        </ul>

        <p style={p}>
          Attestly can publish a public trust page of this kind for the systems you document, showing summary
          status only, with the underlying documents and evidence staying private. See the{" "}
          <Link href="/glossary/audit-evidence-package" style={{ color: "var(--color-primary)" }}>audit evidence package entry</Link> for what the private package contains.
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
      <RelatedLinks current="/guides/compliance-trust-center" />
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 28, marginBottom: 10 };
const p: React.CSSProperties = { marginBottom: 16 };
