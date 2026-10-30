"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Shows the sitewide footer on public pages only. The homepage, /fr and /de
// already render their own footer (with SiteLinks inside it), and the app,
// login, invite and trust-center pages should stay clean.
const HIDE_EXACT = ["/", "/fr", "/de"];
const HIDE_PREFIX = ["/dashboard", "/login", "/invite", "/trust", "/api"];

export default function GlobalFooter({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  if (HIDE_EXACT.includes(path) || HIDE_PREFIX.some((p) => path === p || path.startsWith(p + "/"))) {
    return null;
  }
  return (
    <footer style={{ borderTop: "1px solid var(--color-line)", marginTop: 40, paddingBottom: 32 }}>
      {children}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "24px 24px 0",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 20px",
          fontSize: 13,
          color: "var(--color-ink-muted)",
        }}
      >
        <span>© Attestly</span>
        <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</Link>
        <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</Link>
        <Link href="/refund-policy" style={{ color: "inherit", textDecoration: "none" }}>Refunds</Link>
        <a href="mailto:support@attestly.online" style={{ color: "inherit", textDecoration: "none" }}>support@attestly.online</a>
      </div>
    </footer>
  );
}
