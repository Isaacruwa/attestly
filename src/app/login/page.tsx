"use client";

// Sign-in screen: card layout; the 6-digit code input intentionally has no placeholder.
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  border: "1px solid var(--color-line)",
  borderRadius: "var(--radius-sm)",
  marginBottom: 14,
  fontSize: 15,
  background: "white",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  background: "var(--color-primary)",
  color: "white",
  border: "none",
  borderRadius: "var(--radius-sm)",
  fontSize: 15,
  fontWeight: 600,
  boxShadow: "var(--shadow-sm)",
  transition: "background 0.15s ease, box-shadow 0.15s ease",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    setBusy(false);
    if (error) {
      setError(error.message);
    } else {
      setStep("code");
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });

    if (error || !data.user) {
      setError(error?.message ?? "That code didn't work — check it and try again.");
      setBusy(false);
      return;
    }

    // Post-login setup runs right here, client-side, since verifyOtp already
    // authenticated us — no server redirect step needed at all, which is
    // what sidesteps Supabase's redirect-URL allow-list entirely.
    if (next.startsWith("/invite/")) {
      const token = next.split("/invite/")[1];
      await supabase.rpc("accept_organization_invite", { p_token: token });
      router.push("/dashboard");
      return;
    }

    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", data.user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      const orgName = data.user.email ? `${data.user.email.split("@")[0]}'s organization` : "My organization";
      await supabase.rpc("create_organization_for_current_user", { org_name: orgName });
    }

    router.push(next);
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--color-paper-raised)",
          border: "1px solid var(--color-line)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          padding: "40px 32px",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Sign in</h1>

        {step === "email" ? (
          <>
            <p style={{ color: "var(--color-ink-muted)", marginBottom: 24, fontSize: 14.5 }}>
              We&apos;ll email you a 6-digit code. No password, no links to click.
            </p>
            <form onSubmit={sendCode}>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <button type="submit" disabled={busy} className="busy-row" style={{ ...buttonStyle, justifyContent: "center" }}>
                {busy && <span className="spinner" />}
                {busy ? "Sending…" : "Send code"}
              </button>
              {error && <p style={{ color: "var(--color-missing)", marginTop: 12, fontSize: 13.5 }}>{error}</p>}
            </form>
          </>
        ) : (
          <>
            <p style={{ color: "var(--color-ink-muted)", marginBottom: 24, fontSize: 14.5 }}>
              Enter the 6-digit code sent to <strong>{email}</strong>.
            </p>
            <form onSubmit={verifyCode}>
              <input
                type="text"
                autoFocus
                required
                inputMode="numeric"
                aria-label="6-digit verification code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                  setCode(pasted);
                }}
                maxLength={6}
                style={{ ...inputStyle, fontSize: 24, letterSpacing: "0.35em", textAlign: "center", fontFamily: "var(--font-mono)", paddingLeft: 8 }}
              />
              <button type="submit" disabled={busy} className="busy-row" style={{ ...buttonStyle, justifyContent: "center" }}>
                {busy && <span className="spinner" />}
                {busy ? "Verifying…" : "Verify and sign in"}
              </button>
              {error && <p style={{ color: "var(--color-missing)", marginTop: 12, fontSize: 13.5 }}>{error}</p>}
              <button
                type="button"
                onClick={() => setStep("email")}
                style={{ marginTop: 12, background: "none", border: "none", color: "var(--color-ink-muted)", fontSize: 13, textDecoration: "underline" }}
              >
                Use a different email
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
