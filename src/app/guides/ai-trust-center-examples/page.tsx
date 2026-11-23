import RelatedLinks from "@/components/RelatedLinks";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "AI Trust Center Examples: Sample Layout and Wording",
  description:
    "A practical sample layout for an AI trust center, with example wording for each section and the mistakes that make a page less credible.",
  path: "/guides/ai-trust-center-examples",
});

export default function GuideAiTrustCenterExamples() {
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
        AI trust center examples: sample layout and wording
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Most advice on trust centers stays abstract. This guide is the practical version: a sample layout, the
          wording that works for each section, and the mistakes that make a page less credible. It builds on{" "}
          <Link href="/guides/compliance-trust-center" style={{ color: "var(--color-primary)" }}>how to build a compliance trust center</Link>, so read that first if you are starting from zero.
        </p>

        <h2 style={h2}>A sample layout, top to bottom</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Header.</strong> Company name, the system or systems covered, and a last-updated date.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Status summary.</strong> Three or four numbers: sections documented, sections reviewed,
            sections approved, and the risk tier you assessed.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Scope.</strong> One line per system saying what it does and who uses it.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Practices.</strong> Short statements about how you handle logging, human oversight and
            change control.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Document requests.</strong> A contact route for reviewers who need the full package.
          </li>
          <li>
            <strong>Disclaimer.</strong> A plain line saying the page reports your own assessment.
          </li>
        </ul>

        <h2 style={h2}>Sample wording for each part</h2>
        <p style={p}>
          Keep sentences factual and dated. Examples of the tone to aim for:
        </p>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            &quot;Technical documentation for this system: 7 of 9 sections approved, 2 in review. Last updated 12
            November.&quot;
          </li>
          <li style={{ marginBottom: 10 }}>
            &quot;Risk tier: assessed internally as high-risk under Annex III. This is our own assessment, not a
            regulator&apos;s finding.&quot;
          </li>
          <li style={{ marginBottom: 10 }}>
            &quot;Every agent action is logged with a timestamp, and a named reviewer approves documentation before
            it is marked complete.&quot;
          </li>
          <li>
            &quot;Reviewers who need the full documentation can request it at the contact address below.&quot;
          </li>
        </ul>

        <h2 style={h2}>What credible pages have in common</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>Numbers that change over time, not a static badge.</li>
          <li style={{ marginBottom: 10 }}>Named owners or roles for approvals, not just &quot;our team&quot;.</li>
          <li style={{ marginBottom: 10 }}>A clear line between what is public and what is shared on request.</li>
          <li>Honest gaps. A page that says &quot;2 sections in review&quot; is more believable than one showing all green.</li>
        </ul>

        <h2 style={h2}>Mistakes to avoid</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>Claiming &quot;EU AI Act compliant&quot; with nothing behind it.</li>
          <li style={{ marginBottom: 10 }}>Publishing document text, prompts or trace samples.</li>
          <li style={{ marginBottom: 10 }}>Leaving the last-updated date months out of date.</li>
          <li>Using a logo wall or badges that imply certifications you do not hold.</li>
        </ul>

        <h2 style={h2}>Where the numbers come from</h2>
        <p style={p}>
          The status figures should come from your real documentation records. If your documentation is built
          from agent traces, the evidence behind each section is already there, as explained in{" "}
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)" }}>why traces beat scans</Link>. The sections themselves follow <Link href="/guides/eu-ai-act-annex-iv-explained" style={{ color: "var(--color-primary)" }}>Annex IV</Link>. If you are comparing this with a SOC 2 style page, see{" "}
          <Link href="/guides/soc-2-vs-eu-ai-act-trust-page" style={{ color: "var(--color-primary)" }}>SOC 2 trust page vs EU AI Act trust page</Link>.
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
      <RelatedLinks current="/guides/ai-trust-center-examples" />
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 28, marginBottom: 10 };
const p: React.CSSProperties = { marginBottom: 16 };
