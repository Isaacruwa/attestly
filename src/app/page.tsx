import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{ maxWidth: 780, margin: "0 auto", padding: "96px 24px" }}>
      <p className="mono" style={{ color: "var(--color-ink-muted)", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Attestly
      </p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 1.15, marginTop: 12, marginBottom: 20 }}>
        Stop manually reconstructing what your AI system did.
      </h1>
      <p style={{ fontSize: 18, color: "var(--color-ink-muted)", lineHeight: 1.6, marginBottom: 32 }}>
        Attestly reads the traces your AI agents already produce — OpenTelemetry, LangSmith, AgentOps, MCP logs —
        and turns them into EU AI Act technical documentation, risk-management records, and audit-ready evidence.
        Reviewed by a human before anything counts as final.
      </p>
      <Link
        href="/login"
        style={{
          display: "inline-block",
          background: "var(--color-primary)",
          color: "white",
          padding: "12px 22px",
          borderRadius: 4,
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Get started
      </Link>

      <div style={{ marginTop: 72, borderTop: "1px solid var(--color-line)", paddingTop: 32 }}>
        <p className="mono" style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>
          Attestly does not provide legal advice and does not guarantee regulatory compliance.
          Every generated section is reviewed, edited, and approved by a person before export.
        </p>
      </div>
    </main>
  );
}
