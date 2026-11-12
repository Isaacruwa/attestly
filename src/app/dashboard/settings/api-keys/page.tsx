"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type ApiKey = {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
};

export default function ApiKeysPage() {
  const supabase = createClient();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const { data } = await supabase
      .from("api_keys")
      .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
      .order("created_at", { ascending: false });
    setKeys(data ?? []);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setNewKey(null);

    try {
      const res = await fetch("/api/api-keys/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Failed to create API key.");
      } else {
        setNewKey(result.key);
        setName("");
        refresh();
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    await supabase.from("api_keys").update({ revoked_at: new Date().toISOString() }).eq("id", id);
    refresh();
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24 }}>API keys</h1>
        <Link href="/dashboard" style={{ fontSize: 14, color: "var(--color-ink-muted)" }}>
          ← Dashboard
        </Link>
      </div>

      <p style={{ fontSize: 14, color: "var(--color-ink-muted)", marginBottom: 24, lineHeight: 1.6 }}>
        API keys let a script or agent you run push trace data into Attestly on your organization&apos;s behalf,
        without a human logging in. Keep them secret — anyone with a key can import traces as your organization.
        See <code className="mono" style={{ fontSize: 13 }}>/auth.md</code> for how agents authenticate.
      </p>

      {newKey && (
        <div style={{ background: "var(--color-primary-tint)", border: "1px solid var(--color-line)", borderRadius: 6, padding: 20, marginBottom: 24 }}>
          <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Your new key — copy it now, it won&apos;t be shown again</p>
          <p className="mono" style={{ fontSize: 13, wordBreak: "break-all", background: "white", padding: "10px 12px", borderRadius: 4, border: "1px solid var(--color-line)" }}>
            {newKey}
          </p>
        </div>
      )}

      <form onSubmit={handleCreate} style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key name, e.g. 'nightly trace import'"
          style={{ flex: 1, minWidth: 220, padding: "10px 12px", border: "1px solid var(--color-line)", borderRadius: 4, fontFamily: "inherit", fontSize: 14 }}
        />
        <button type="submit" disabled={creating} className="btn-primary" style={{ border: "none" }}>
          {creating ? "Creating\u2026" : "Create key"}
        </button>
      </form>

      {error && <p style={{ color: "var(--color-missing)", fontSize: 14, marginBottom: 20 }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {keys.length === 0 && <p style={{ color: "var(--color-ink-muted)", fontSize: 14 }}>No API keys yet.</p>}
        {keys.map((k) => (
          <div key={k.id} className="ledger-row" data-status={k.revoked_at ? "missing_information" : "approved"} style={{ padding: "10px 14px", background: "white", borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, flexWrap: "wrap", gap: 8 }}>
              <div>
                <strong>{k.name}</strong>{" "}
                <span className="mono" style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>{k.key_prefix}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "var(--color-ink-muted)" }}>
                  {k.revoked_at ? "Revoked" : k.last_used_at ? `Last used ${new Date(k.last_used_at).toLocaleDateString()}` : "Never used"}
                </span>
                {!k.revoked_at && (
                  <button
                    onClick={() => handleRevoke(k.id)}
                    style={{ fontSize: 12, color: "var(--color-missing)", background: "none", border: "none", textDecoration: "underline" }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
