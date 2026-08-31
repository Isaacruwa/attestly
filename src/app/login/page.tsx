"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();

    // The redirect URL Supabase validates against its allow-list is kept
    // bare (no query string) — a wildcard like https://domain.com/** can be
    // finicky about matching URLs that carry their own query params. Instead,
    // the intended post-login destination travels via a short-lived cookie
    // that the callback route reads directly.
    if (next !== "/dashboard") {
      document.cookie = `attestly_post_login_redirect=${encodeURIComponent(next)}; path=/; max-age=600; SameSite=Lax`;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <main style={{ maxWidth: 380, margin: "0 auto", padding: "96px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, marginBottom: 8 }}>Sign in</h1>
      <p style={{ color: "var(--color-ink-muted)", marginBottom: 24 }}>
        We&apos;ll email you a link. No password to manage.
      </p>

      {sent ? (
        <p>Check your inbox for a sign-in link.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid var(--color-line)",
              borderRadius: 4,
              marginBottom: 12,
              fontSize: 15,
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 15,
            }}
          >
            Send sign-in link
          </button>
          {error && <p style={{ color: "var(--color-missing)", marginTop: 12 }}>{error}</p>}
        </form>
      )}
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
