"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { createClient } from "@/lib/supabase/client";

type Tier = {
  name: string;
  price: string;
  priceId: string | undefined;
  tagline: string;
  features: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    price: "$79/mo",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER,
    tagline: "For a single AI system that needs documentation started.",
    features: ["1 AI system", "Trace ingestion from all supported sources", "AI-drafted documentation", "Export to Word"],
  },
  {
    name: "Professional",
    price: "$349/mo",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PROFESSIONAL,
    tagline: "For teams running several AI systems that need this continuously.",
    features: ["Up to 10 AI systems", "Unlimited documentation generations", "Team invites", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$1,499/mo",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE,
    tagline: "For organizations running many AI systems across teams.",
    features: ["Unlimited AI systems", "Unlimited documentation generations", "Team invites", "Priority support"],
  },
];

const FRAME_ID = "attestly-checkout-frame";

export default function PricingPage() {
  const supabase = createClient();
  const [paddle, setPaddle] = useState<Paddle>();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<Tier | null>(null);
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      setError("Checkout isn't configured yet (missing Paddle client token).");
      return;
    }
    initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "production" | "sandbox") ?? "production",
      token,
      checkout: {
        settings: {
          displayMode: "inline",
          frameTarget: FRAME_ID,
          frameInitialHeight: 450,
          frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
          theme: "light",
        },
      },
      eventCallback: (event) => {
        if (event.name === "checkout.loaded") {
          setCheckoutReady(true);
        }
        if (event.name === "checkout.completed") {
          setActiveTier(null);
          setActiveTransactionId(null);
          window.location.href = "/dashboard?subscribed=1";
        }
      },
    })
      .then(setPaddle)
      .catch((err) => setError(`Couldn't set up checkout: ${err?.message ?? "unknown error"}`));

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      setOrganizationId(membership?.organization_id ?? null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function subscribe(tier: Tier) {
    setError(null);
    if (!tier.priceId) {
      setError("This plan isn't fully configured yet.");
      return;
    }
    if (!organizationId) {
      window.location.href = `/login?next=${encodeURIComponent("/pricing")}`;
      return;
    }
    setCheckoutReady(false);

    try {
      const res = await fetch("/api/paddle/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: tier.priceId }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error ?? "Couldn't start checkout.");
        return;
      }
      setActiveTransactionId(result.transactionId);
      setActiveTier(tier);
    } catch (err: any) {
      setError(err.message ?? "Couldn't start checkout.");
    }
  }

  // Once the modal (and its target div) exists in the DOM, tell Paddle to
  // render the payment form inline inside it, rather than as its own popup.
  useEffect(() => {
    if (!activeTier || !activeTransactionId || !paddle || !frameRef.current) return;

    try {
      paddle.Checkout.open({ transactionId: activeTransactionId });
    } catch (err: any) {
      setError(`Checkout failed to open: ${err?.message ?? "unknown error"}`);
      setActiveTier(null);
      setActiveTransactionId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTier, activeTransactionId, paddle]);

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px" }}>
      <nav className="site-nav" style={{ padding: 0, marginBottom: 48 }}>
        <Link href="/" className="site-nav__brand" style={{ textDecoration: "none" }}>
          <span className="site-nav__mark" aria-hidden="true" />
          Attestly
        </Link>
        <Link href="/dashboard" className="site-nav__link">
          Dashboard
        </Link>
      </nav>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, marginBottom: 12 }}>Pricing</h1>
      <p style={{ color: "var(--color-ink-muted)", marginBottom: 40, maxWidth: 60 + "ch" }}>
        Pick a plan and start immediately — no sales call required. Cancel anytime.
      </p>

      {error && <p style={{ color: "var(--color-missing)", marginBottom: 24 }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }} className="pricing-grid">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            style={{
              border: tier.highlight ? "2px solid var(--color-primary)" : "1px solid var(--color-line)",
              borderRadius: 8,
              padding: 28,
              background: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p className="mono" style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-ink-faint)", marginBottom: 8 }}>
              {tier.name}
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, marginBottom: 8 }}>{tier.price}</p>
            <p style={{ fontSize: 13.5, color: "var(--color-ink-muted)", marginBottom: 20 }}>{tier.tagline}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1 }}>
              {tier.features.map((f) => (
                <li key={f} style={{ fontSize: 13.5, padding: "6px 0", borderTop: "1px solid var(--color-line)" }}>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => subscribe(tier)}
              className={tier.highlight ? "btn-primary" : undefined}
              style={
                tier.highlight
                  ? { border: "none", justifyContent: "center" }
                  : {
                      padding: "12px 20px",
                      border: "1px solid var(--color-primary)",
                      borderRadius: 4,
                      background: "white",
                      color: "var(--color-primary)",
                      fontWeight: 500,
                      fontSize: 15,
                    }
              }
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      <div
        onClick={() => { setActiveTier(null); setActiveTransactionId(null); }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(20, 24, 28, 0.55)",
          display: activeTier ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          zIndex: 50,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--color-paper)",
            borderRadius: 10,
            maxWidth: 480,
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(20, 24, 28, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 22px",
              borderBottom: "1px solid var(--color-line)",
            }}
          >
            <div>
              <p className="site-nav__brand" style={{ marginBottom: 2 }}>
                <span className="site-nav__mark" aria-hidden="true" />
                Attestly
              </p>
              <p style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
                {activeTier ? (
                  <>
                    Subscribing to <strong>{activeTier.name}</strong> — {activeTier.price}
                  </>
                ) : (
                  "\u00A0"
                )}
              </p>
            </div>
            <button
              onClick={() => { setActiveTier(null); setActiveTransactionId(null); }}
              aria-label="Close"
              style={{ border: "none", background: "none", fontSize: 22, color: "var(--color-ink-faint)", lineHeight: 1, cursor: "pointer" }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: 22 }}>
            {!checkoutReady && (
              <p className="busy-row" style={{ color: "var(--color-ink-muted)", fontSize: 14, padding: "40px 0", justifyContent: "center" }}>
                <span className="spinner spinner-dark" />
                <span className="loading-message">Loading secure checkout…</span>
              </p>
            )}
            <div id={FRAME_ID} ref={frameRef} />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .pricing-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
