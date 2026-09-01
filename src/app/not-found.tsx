import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found — Attestly",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
      <p className="mono" style={{ fontSize: 13, color: "var(--color-ink-faint)", marginBottom: 16 }}>404</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 16 }}>Page not found</h1>
      <p style={{ color: "var(--color-ink-muted)", marginBottom: 28 }}>
        That page doesn&apos;t exist, or it moved. Here are some places to go instead:
      </p>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "var(--color-primary)" }}>Home</Link>
        <Link href="/pricing" style={{ color: "var(--color-primary)" }}>Pricing</Link>
        <Link href="/dashboard" style={{ color: "var(--color-primary)" }}>Dashboard</Link>
      </div>
    </main>
  );
}
