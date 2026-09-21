"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Result, RiskCheckerStrings } from "./strings";
import { EN_STRINGS } from "./strings";

export default function RiskChecker({
  initialResult = null,
  strings = EN_STRINGS,
}: {
  initialResult?: Result;
  strings?: RiskCheckerStrings;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [prohibited, setProhibited] = useState<Set<string>>(new Set());
  const [safetyComponent, setSafetyComponent] = useState<boolean | null>(null);
  const [annexIII, setAnnexIII] = useState<Set<string>>(new Set());
  const [narrowTask, setNarrowTask] = useState<boolean | null>(null);
  const [limited, setLimited] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<Result>(initialResult);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    const url = new URL(window.location.href);
    if (result) {
      url.searchParams.set("result", result);
    } else {
      url.searchParams.delete("result");
    }
    router.replace(`${url.pathname}${url.search}`, { scroll: false });
  }, [result, router]);

  async function submitLead() {
    if (!leadEmail || !result) return;
    setLeadStatus("sending");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, classification: result, source: "risk_checker" }),
      });
      setLeadStatus(res.ok ? "sent" : "error");
    } catch {
      setLeadStatus("error");
    }
  }

  function copyShareLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    });
  }

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, item: string) {
    const next = new Set(set);
    next.has(item) ? next.delete(item) : next.add(item);
    setter(next);
  }

  function computeResult() {
    if (prohibited.size > 0) return setResult("prohibited");
    const hitsAnnexIII = safetyComponent === true || annexIII.size > 0;
    if (hitsAnnexIII && narrowTask !== true) return setResult("high");
    if (limited.size > 0) return setResult("limited");
    return setResult("minimal");
  }

  function reset() {
    setStep(1);
    setProhibited(new Set());
    setSafetyComponent(null);
    setAnnexIII(new Set());
    setNarrowTask(null);
    setLimited(new Set());
    setResult(null);
  }

  const checkboxRow = (item: string, set: Set<string>, setter: (s: Set<string>) => void) => (
    <label key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: "1px solid var(--color-line)", cursor: "pointer", fontSize: 14 }}>
      <input type="checkbox" checked={set.has(item)} onChange={() => toggle(set, setter, item)} style={{ marginTop: 3, flexShrink: 0 }} />
      <span>{item}</span>
    </label>
  );

  if (result) {
    const copy = strings.resultCopy[result];

    return (
      <div className="ledger-row" data-status={result === "high" ? "needs_review" : result === "prohibited" ? "missing_information" : result === "minimal" ? "approved" : "updated"} style={{ padding: 28, background: "white", borderRadius: 8 }}>
        <p className="mono" style={{ fontSize: 12, color: copy.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          {strings.resultLabel}
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>{copy.label}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--color-ink)", marginBottom: 24 }}>{copy.body}</p>

        <div className="trust-strip" style={{ marginBottom: 24 }}>
          {strings.trustStrip}
        </div>

        {(result === "high" || result === "limited") && (
          <Link href="/login?next=%2Fdashboard%2Fsystems%2Fnew" className="btn-primary" style={{ border: "none", display: "inline-flex" }}>
            {strings.startDocumenting}
          </Link>
        )}

        <div style={{ marginTop: 24, padding: 20, background: "var(--color-primary-tint)", borderRadius: 8 }}>
          <p style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>
            {strings.leadTitle}
          </p>
          <p style={{ fontSize: 13, color: "var(--color-ink-muted)", marginBottom: 12 }}>
            {strings.leadSubtitle}
          </p>
          {leadStatus === "sent" ? (
            <p style={{ fontSize: 13.5, color: "var(--color-approved)" }}>{strings.leadSent}</p>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                placeholder={strings.emailPlaceholder}
                style={{ flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 4, border: "1px solid var(--color-line)" }}
              />
              <button
                onClick={submitLead}
                disabled={leadStatus === "sending"}
                className="btn-primary"
                style={{ border: "none" }}
              >
                {leadStatus === "sending" ? strings.sendingButton : strings.sendButton}
              </button>
            </div>
          )}
          {leadStatus === "error" && (
            <p style={{ fontSize: 12.5, color: "var(--color-missing)", marginTop: 8 }}>
              {strings.leadError}
            </p>
          )}
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={copyShareLink} style={{ background: "none", border: "1px solid var(--color-line)", borderRadius: 4, padding: "6px 12px", fontSize: 12.5, color: "var(--color-ink-muted)", cursor: "pointer" }}>
            {copyStatus === "copied" ? strings.copyLinkCopied : strings.copyLinkDefault}
          </button>
          <Link href="/guides/high-risk-ai-examples" style={{ fontSize: 12.5, color: "var(--color-primary)" }}>
            {strings.highRiskExamplesLink}
          </Link>
          <Link href="/guides/eu-ai-act-annex-iv-explained" style={{ fontSize: 12.5, color: "var(--color-primary)" }}>
            {strings.annexIVLink}
          </Link>
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={reset} style={{ background: "none", border: "none", color: "var(--color-ink-muted)", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
            {strings.checkAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ height: 4, flex: 1, borderRadius: 2, background: s <= step ? "var(--color-primary)" : "var(--color-line)" }} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>{strings.step1Title}</h2>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 4 }}>{strings.step1Subtitle}</p>
          <div style={{ marginBottom: 20 }}>{strings.prohibitedItems.map((i) => checkboxRow(i, prohibited, setProhibited))}</div>
          <button onClick={() => setStep(2)} className="btn-primary" style={{ border: "none" }}>{strings.continueButton}</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>{strings.step2Title}</h2>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 12 }}>
            {strings.step2SafetyQuestion}
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setSafetyComponent(true)} style={{ padding: "8px 18px", borderRadius: 4, border: safetyComponent === true ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>{strings.yes}</button>
            <button onClick={() => setSafetyComponent(false)} style={{ padding: "8px 18px", borderRadius: 4, border: safetyComponent === false ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>{strings.no}</button>
          </div>

          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 4 }}>{strings.step2AnnexIIIPrompt}</p>
          <div style={{ marginBottom: 16 }}>{strings.annexIIIItems.map((i) => checkboxRow(i, annexIII, setAnnexIII))}</div>

          {(safetyComponent === true || annexIII.size > 0) && (
            <>
              <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 8, marginTop: 16 }}>
                {strings.step2NarrowTaskPrompt}
              </p>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button onClick={() => setNarrowTask(true)} style={{ padding: "8px 18px", borderRadius: 4, border: narrowTask === true ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>{strings.yesNarrowTaskOnly}</button>
                <button onClick={() => setNarrowTask(false)} style={{ padding: "8px 18px", borderRadius: 4, border: narrowTask === false ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>{strings.no}</button>
              </div>
            </>
          )}

          <button onClick={() => setStep(3)} className="btn-primary" style={{ border: "none" }}>{strings.continueButton}</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>{strings.step3Title}</h2>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 4 }}>{strings.step3Subtitle}</p>
          <div style={{ marginBottom: 20 }}>{strings.limitedItems.map((i) => checkboxRow(i, limited, setLimited))}</div>
          <button onClick={computeResult} className="btn-primary" style={{ border: "none" }}>{strings.seeResultButton}</button>
        </div>
      )}
    </div>
  );
}
