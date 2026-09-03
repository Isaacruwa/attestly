"use client";

import { useState } from "react";
import Link from "next/link";

type Result = "prohibited" | "high" | "limited" | "minimal" | null;

const PROHIBITED_ITEMS = [
  "Uses subliminal, manipulative, or deceptive techniques likely to cause someone physical or psychological harm",
  "Exploits the vulnerabilities of a specific group (age, disability, or socio-economic situation) to distort behavior in a harmful way",
  "Scores or classifies people by trustworthiness or social behavior on behalf of a public authority (social scoring)",
  "Predicts an individual's likelihood of committing a crime based solely on profiling or personality traits",
  "Builds or expands a facial recognition database by untargeted scraping of images from the internet or CCTV",
  "Infers emotions in a workplace or educational setting (outside narrow medical/safety exceptions)",
  "Biometrically categorizes people to infer race, political opinions, religion, sexual orientation, or similar sensitive traits",
  "Performs real-time remote biometric identification in publicly accessible spaces for law enforcement purposes",
  "Generates or manipulates non-consensual intimate imagery, or generates/manipulates child sexual abuse material",
];

const ANNEX_III_ITEMS = [
  "Biometric identification or categorization of people",
  "Management or operation of critical infrastructure (energy, water, transport, digital infrastructure)",
  "Education or vocational training (e.g. exam scoring, admissions, monitoring students)",
  "Employment, worker management, or access to self-employment (e.g. hiring, promotion, termination decisions)",
  "Access to essential services (credit scoring, insurance pricing, benefits eligibility, emergency dispatch)",
  "Law enforcement (outside the prohibited real-time biometric case above)",
  "Migration, asylum, or border control management",
  "Administration of justice or democratic processes",
];

const LIMITED_ITEMS = [
  "Interacts directly with people in a way they might mistake for a human (e.g. a chatbot)",
  "Generates or manipulates image, audio, or video content that could be mistaken for authentic",
  "Recognizes emotions or biometrically categorizes people (outside the prohibited/high-risk cases above)",
];

export default function RiskChecker() {
  const [step, setStep] = useState(1);
  const [prohibited, setProhibited] = useState<Set<string>>(new Set());
  const [safetyComponent, setSafetyComponent] = useState<boolean | null>(null);
  const [annexIII, setAnnexIII] = useState<Set<string>>(new Set());
  const [narrowTask, setNarrowTask] = useState<boolean | null>(null);
  const [limited, setLimited] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<Result>(null);

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
    const RESULT_COPY: Record<Exclude<Result, null>, { label: string; color: string; body: string }> = {
      prohibited: {
        label: "Likely a prohibited practice",
        color: "var(--color-missing)",
        body: "Based on what you selected, this system may fall under Article 5's prohibited practices — these have applied since February 2025 (with two additions — AI nudification tools and AI-generated CSAM — applying from December 2, 2026). There is no compliance pathway for a prohibited practice; it needs to stop or be redesigned to fall outside these criteria.",
      },
      high: {
        label: "Likely high-risk",
        color: "var(--color-review)",
        body: "Based on what you selected, this system likely falls under Annex III (or is a safety component of an already-regulated product) and would be classified high-risk. Following the 2026 Digital Omnibus amendment, the compliance deadline for Annex III systems is now December 2, 2027 (August 2, 2028 for Annex I product-embedded systems) — later than the original August 2026 date, but this is exactly the category Attestly's Annex IV documentation is built for.",
      },
      limited: {
        label: "Likely limited risk",
        color: "var(--color-updated)",
        body: "Based on what you selected, this system likely falls under the transparency obligations in Article 50 — disclosing that people are interacting with AI, and labeling synthetic content. Note the provider-side synthetic-content marking duty (Article 50(2)) has a compliance grace period until December 2, 2026 for systems already on the market.",
      },
      minimal: {
        label: "Likely minimal risk",
        color: "var(--color-approved)",
        body: "Based on what you selected, this system doesn't appear to trigger the EU AI Act's specific obligations. Voluntary codes of conduct are still encouraged, and it's worth re-checking if the system's purpose or capabilities change.",
      },
    };
    const copy = RESULT_COPY[result];

    return (
      <div className="ledger-row" data-status={result === "high" ? "needs_review" : result === "prohibited" ? "missing_information" : result === "minimal" ? "approved" : "updated"} style={{ padding: 28, background: "white", borderRadius: 8 }}>
        <p className="mono" style={{ fontSize: 12, color: copy.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
          Result
        </p>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, marginBottom: 16 }}>{copy.label}</h2>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--color-ink)", marginBottom: 24 }}>{copy.body}</p>

        <div className="trust-strip" style={{ marginBottom: 24 }}>
          This is an educational directional indicator based on the Act's published categories, not a legal
          classification or legal advice. The EU AI Act's implementing timeline has changed multiple times in 2026 —
          verify current status and get a qualified legal opinion before making compliance decisions.
        </div>

        {(result === "high" || result === "limited") && (
          <Link href="/login?next=%2Fdashboard%2Fsystems%2Fnew" className="btn-primary" style={{ border: "none", display: "inline-flex" }}>
            Start documenting this system with Attestly →
          </Link>
        )}

        <div style={{ marginTop: 16 }}>
          <button onClick={reset} style={{ background: "none", border: "none", color: "var(--color-ink-muted)", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>
            Check another system
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
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Step 1 — Does your system do any of the following?</h2>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 4 }}>Check any that apply. These are Article 5's prohibited practices.</p>
          <div style={{ marginBottom: 20 }}>{PROHIBITED_ITEMS.map((i) => checkboxRow(i, prohibited, setProhibited))}</div>
          <button onClick={() => setStep(2)} className="btn-primary" style={{ border: "none" }}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Step 2 — Is it used in a sensitive domain?</h2>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 12 }}>
            Is your system a safety component of a product already regulated under EU product safety law (medical
            devices, machinery, toys, vehicles, lifts) and subject to third-party conformity assessment?
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setSafetyComponent(true)} style={{ padding: "8px 18px", borderRadius: 4, border: safetyComponent === true ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>Yes</button>
            <button onClick={() => setSafetyComponent(false)} style={{ padding: "8px 18px", borderRadius: 4, border: safetyComponent === false ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>No</button>
          </div>

          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 4 }}>Does it fall into any of Annex III's domains? Check any that apply.</p>
          <div style={{ marginBottom: 16 }}>{ANNEX_III_ITEMS.map((i) => checkboxRow(i, annexIII, setAnnexIII))}</div>

          {(safetyComponent === true || annexIII.size > 0) && (
            <>
              <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 8, marginTop: 16 }}>
                One more check — under Article 6(3), a narrow-task system can avoid high-risk classification. Does
                your system <em>only</em> perform a narrow procedural task, improve the result of an already-completed
                human decision, detect patterns without replacing human judgment, or do prep work — without profiling
                individuals?
              </p>
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <button onClick={() => setNarrowTask(true)} style={{ padding: "8px 18px", borderRadius: 4, border: narrowTask === true ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>Yes, narrow task only</button>
                <button onClick={() => setNarrowTask(false)} style={{ padding: "8px 18px", borderRadius: 4, border: narrowTask === false ? "2px solid var(--color-primary)" : "1px solid var(--color-line)", background: "white" }}>No</button>
              </div>
            </>
          )}

          <button onClick={() => setStep(3)} className="btn-primary" style={{ border: "none" }}>Continue →</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 6 }}>Step 3 — Transparency triggers</h2>
          <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 4 }}>Check any that apply.</p>
          <div style={{ marginBottom: 20 }}>{LIMITED_ITEMS.map((i) => checkboxRow(i, limited, setLimited))}</div>
          <button onClick={computeResult} className="btn-primary" style={{ border: "none" }}>See my result →</button>
        </div>
      )}
    </div>
  );
}
