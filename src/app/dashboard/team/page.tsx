"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function TeamPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [invites, setInvites] = useState<{ id: string; email: string; status: string; created_at: string }[]>([]);
  const [members, setMembers] = useState<{ id: string; role: string; user_id: string }[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);

    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .limit(1)
      .maybeSingle();

    if (!membership) return;

    const { data: memberRows } = await supabase
      .from("organization_members")
      .select("id, role, user_id")
      .eq("organization_id", membership.organization_id);
    setMembers(memberRows ?? []);

    const { data: inviteRows } = await supabase
      .from("organization_invites")
      .select("id, email, status, created_at")
      .eq("organization_id", membership.organization_id)
      .order("created_at", { ascending: false });
    setInvites(inviteRows ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage(result.error ?? "Failed to send invite");
      } else if (result.warning) {
        setMessage(`${result.warning} Link: ${result.invite_url}`);
      } else {
        setMessage(`Invite sent to ${email}.`);
      }
      setEmail("");
      await load();
    } catch (err: any) {
      setMessage(err.message ?? "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>Team</h1>
        <Link href="/dashboard" style={{ fontSize: 13, color: "var(--color-ink-muted)" }}>
          ← Dashboard
        </Link>
      </div>

      <form onSubmit={sendInvite} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="email"
          required
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--color-line)", borderRadius: 4, fontSize: 14 }}
        />
        <button type="submit" disabled={sending} className="btn-primary busy-row" style={{ border: "none", fontSize: 14, padding: "10px 18px" }}>
          {sending && <span className="spinner" />}
          {sending ? "Sending…" : "Invite"}
        </button>
      </form>
      {message && <p style={{ fontSize: 13, color: "var(--color-ink-muted)", marginBottom: 28, wordBreak: "break-all" }}>{message}</p>}

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Members ({members.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 32 }}>
        {members.map((m) => (
          <div key={m.id} style={{ fontSize: 14, padding: "8px 0", borderBottom: "1px solid var(--color-line)" }}>
            <span className="mono" style={{ color: "var(--color-ink-faint)", marginRight: 8 }}>{m.role}</span>
            {m.user_id === currentUserId ? "You" : m.user_id}
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Pending invites</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {invites.length === 0 && <p style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>No invites sent yet.</p>}
        {invites.map((inv) => (
          <div key={inv.id} className="ledger-row" data-status={inv.status === "accepted" ? "approved" : "updated"} style={{ padding: "8px 14px", background: "white", borderRadius: 4, fontSize: 13.5 }}>
            {inv.email} — <span className="mono">{inv.status}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
