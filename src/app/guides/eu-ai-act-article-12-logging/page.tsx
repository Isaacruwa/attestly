import type { Metadata } from "next";
import { buildMetadata } from "@/lib/pageMetadata";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "EU AI Act Article 12: Logging Requirements for AI Agents",
  description:
    "What Article 12 of the EU AI Act requires high-risk AI systems to log, how long logs must be kept, and how AI agent traces can meet the requirement.",
  path: "/guides/eu-ai-act-article-12-logging",
});

export default function GuideArticle12() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <p style={{ fontSize: 13, marginBottom: 24 }}>
        <Link href="/guides" style={{ color: "var(--color-ink-muted)" }}>← Guides</Link>
      </p>
      <div className="trust-strip" style={{ marginBottom: 28 }}>
        This is general information, not legal advice. Verify current requirements and application dates with a
        qualified professional before making compliance decisions.
      </div>

      <p className="section__eyebrow">Guide</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 20, lineHeight: 1.3 }}>
        EU AI Act Article 12: logging requirements for AI agents
      </h1>

      <div style={{ fontSize: 15.5, lineHeight: 1.75, color: "var(--color-ink)" }}>
        <p style={p}>
          Article 12 is the record-keeping rule of the EU AI Act. It says high-risk AI systems must technically
          allow for the automatic recording of events, in other words logs, over the lifetime of the system. For
          an AI agent that calls tools, models and APIs on its own, this is the article that decides whether you
          can later show what the agent actually did.
        </p>

        <h2 style={h2}>What the logs have to make possible</h2>
        <p style={p}>
          Article 12 does not list a fixed set of fields. Instead it sets purposes the logging must serve. The
          logs must be capable of supporting:
        </p>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Identifying risk situations.</strong> Spotting situations where the system may present a risk
            or where a substantial modification has occurred.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Post-market monitoring.</strong> Giving the provider the data needed for the monitoring
            system described in{" "}
            <Link href="/guides/ai-act-article-72-monitoring" style={{ color: "var(--color-primary)" }}>
              Article 72
            </Link>
            .
          </li>
          <li>
            <strong>Monitoring of operation.</strong> Letting deployers monitor how the system runs in
            practice, as required of them under Article 26.
          </li>
        </ul>

        <h2 style={h2}>Extra minimums for remote biometric identification</h2>
        <p style={p}>
          For the remote biometric identification systems listed in Annex III, Article 12 adds minimum logging
          content: the period of each use, the reference database the input was checked against, the input data
          that led to a match, and the identity of the people involved in verifying the results. Most AI agents
          are not in this category, but it shows the level of detail regulators have in mind.
        </p>

        <h2 style={h2}>How long logs must be kept</h2>
        <p style={p}>
          Retention sits in other articles. Providers must keep the logs their high-risk systems generate, to the
          extent those logs are under their control, and deployers must do the same for logs under their
          control. The baseline is at least six months, unless other EU or national law, data protection law in
          particular, requires something different. Check which period applies to your sector.
        </p>

        <h2 style={h2}>What this means for an AI agent</h2>
        <p style={p}>
          A chat transcript is not enough. To meet the purposes above, an agent&apos;s logs should capture, per
          event and with a timestamp:
        </p>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>
            <strong>Model calls.</strong> Which model and version ran, and what it was asked to do.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Tool and API calls.</strong> What the agent invoked, with what arguments, and what came
            back.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Errors and retries.</strong> Timeouts, failures and fallbacks, since these are the raw
            material for risk situations.
          </li>
          <li style={{ marginBottom: 10 }}>
            <strong>Human oversight.</strong> Every approval, override or escalation, with who did it and when.
          </li>
          <li>
            <strong>Configuration and version changes.</strong> Prompt, threshold and model changes, so a
            change in behavior can be tied to a change you made.
          </li>
        </ul>

        <h2 style={h2}>Common gaps</h2>
        <ul style={{ ...p, paddingLeft: 20 }}>
          <li style={{ marginBottom: 10 }}>Logging inputs and outputs but not the intermediate tool calls.</li>
          <li style={{ marginBottom: 10 }}>No record of which model or prompt version produced an output.</li>
          <li style={{ marginBottom: 10 }}>Logs that can be edited or deleted without a trace.</li>
          <li style={{ marginBottom: 10 }}>Personal data stored in logs with no retention or minimization plan.</li>
          <li>Human review happening in a separate tool, so it never reaches the log.</li>
        </ul>

        <h2 style={h2}>From logs to documentation</h2>
        <p style={p}>
          Logs are only useful if you can organize them against the Act. The same events that satisfy Article
          12 are the evidence behind several{" "}
          <Link href="/guides/eu-ai-act-annex-iv-explained" style={{ color: "var(--color-primary)" }}>
            Annex IV sections
          </Link>
          , such as monitoring, human oversight and change history. If your agent already emits
          OpenTelemetry, LangSmith, AgentOps or MCP traces, you have most of the raw data. Attestly maps those
          traces to the Annex IV sections for you, and a person reviews the result before you rely on it.{" "}
          <Link href="/why-traces-over-scans" style={{ color: "var(--color-primary)" }}>
            See why traces beat scans
          </Link>
          .
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
    </main>
  );
}

const h2: React.CSSProperties = { fontFamily: "var(--font-display)", fontSize: 19, marginTop: 28, marginBottom: 10 };
const p: React.CSSProperties = { marginBottom: 16 };
