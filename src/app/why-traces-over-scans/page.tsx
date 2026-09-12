import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Why Annex IV Documentation Needs Runtime Evidence, Not Code Scans",
  description: "EU AI Act Annex IV evidence has to show what an AI agent actually did at runtime. Static source-code scans can't capture that. Here's what runtime traces provide that code can't.",
  path: "/why-traces-over-scans",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Why Annex IV documentation needs runtime evidence, not code scans",
  description:
    "EU AI Act Annex IV evidence has to show what an AI agent actually did at runtime. Static source-code scans can't capture that.",
  url: "https://attestly.online/why-traces-over-scans",
  author: { "@id": "https://attestly.online/#organization" },
  publisher: { "@id": "https://attestly.online/#organization" },
};

export default function WhyTracesPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--color-ink-muted)" }}>← Attestly</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        This is general information, not legal advice. Attestly does not guarantee regulatory compliance —
        every generated document requires human review before it counts as final.
      </div>

      <p className="section__eyebrow">Runtime evidence</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 20, lineHeight: 1.25 }}>
        Why Annex IV documentation needs runtime evidence, not code scans
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <h2 style={h2}>What Annex IV actually requires</h2>
        <p style={p}>
          Annex IV of the EU AI Act lists what technical documentation for a high-risk AI system has to contain:
          a general description of the system and its intended purpose, details of the design and development
          process, information about how the system is monitored and controlled once deployed, performance and
          validation metrics, risk-management measures, and a record of significant changes across the system&apos;s
          lifecycle. None of that is a description of what the code is capable of doing in theory. It&apos;s a
          description of what the system does, has done, and how it behaves in production.
        </p>

        <h2 style={h2}>What traces capture that code can&apos;t</h2>
        <p style={p}>
          A static scan of a repository can enumerate which SDKs are imported, which model endpoints are called,
          and roughly how the code is structured. That&apos;s useful for a different question — &ldquo;what could
          this system do?&rdquo; — but Annex IV, alongside Article 14 (human oversight) and Article 9 (risk
          management), is asking a different question: what did this system actually do, and how was it
          overseen?
        </p>
        <p style={p}>
          <strong>Human oversight (Article 14).</strong> Providers have to demonstrate that a human can and does
          intervene in the system&apos;s operation. A code scan can see that an &ldquo;approve&rdquo; endpoint
          exists. It can&apos;t see whether a human actually used it, how often, or under what circumstances —
          that only shows up as an event in a runtime trace.
        </p>
        <p style={p}>
          <strong>Post-market monitoring (Article 72).</strong> Providers must monitor a deployed system&apos;s
          performance and log significant incidents. Runtime traces are, by definition, the record of what
          happened after deployment: tool calls, errors, latency, and behavior. Source code, deployed once and
          then read statically, cannot describe events distributed over the weeks or months after that
          deployment.
        </p>
        <p style={p}>
          <strong>Risk management (Article 9).</strong> This requires identifying risks that materialize during
          actual use — not just risks that are theoretically possible given the code. An error trace, a rejected
          tool call, or a human override are all risk signals that live in execution data, not in a function
          signature.
        </p>
        <p style={p}>
          There&apos;s also a structural gap: many AI agents call tools and services the provider didn&apos;t
          build — third-party APIs, MCP servers, other teams&apos; internal tools. A code scan of your repository
          simply can&apos;t see behavior that happens outside your own source tree. A runtime trace captures it
          regardless of where the tool call was implemented, because it records what happened, not where the
          code that caused it lives.
        </p>

        <h2 style={h2}>How Attestly maps trace events to Annex IV sections</h2>
        <p style={p}>
          Attestly ingests normalized trace events — tool calls, model calls, human interventions, errors, and
          deployment/version changes — from OpenTelemetry, LangSmith, AgentOps, MCP logs, or generic
          pre-normalized JSON. Each Annex IV requirement is mapped against the specific events relevant to it: a
          monitoring-measures section is drafted from tool-call and error events; a human-oversight section is
          drafted from intervention events; a change-log section is drafted from deployment-version events. Every
          generated sentence carries a link back to the exact trace event that justified it, so a reviewer can
          verify the claim in seconds instead of re-deriving it from raw logs.
        </p>
        <p style={p}>
          This doesn&apos;t replace human judgment or legal review — every draft is explicitly marked
          AI-generated, user-provided, or missing, and has to be reviewed and approved by a person before export.
          What it replaces is manually reconstructing that evidence trail from scratch every time documentation
          needs updating.
        </p>

        <div style={{ marginTop: 36, padding: 24, background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 8 }}>
          <p style={{ fontWeight: 600, fontSize: 15.5, marginBottom: 6 }}>Not sure if your system is high-risk?</p>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 14 }}>
            Run the free EU AI Act risk checker — no signup required.
          </p>
          <Link href="/eu-ai-act-risk-checker" className="btn-primary" style={{ border: "none", display: "inline-flex" }}>
            Check now →
          </Link>
        </div>
      </div>
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 20, marginTop: 32, marginBottom: 10 };
const p: React.CSSProperties = { marginBottom: 16 };
