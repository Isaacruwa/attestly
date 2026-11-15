import crypto from "crypto";

// Key format: atly_live_<48 hex chars>. Only the sha256 hash is ever stored
// (see api_keys in schema.sql) — the plaintext is generated here, returned
// to the /api/api-keys/create caller once, and then discarded. There is no
// way to recover a lost key; the account owner has to revoke it and create
// a new one.
const KEY_PREFIX = "atly_live_";

export function generateApiKey(): { plaintext: string; hash: string; prefix: string } {
  const raw = crypto.randomBytes(24).toString("hex"); // 48 hex chars
  const plaintext = `${KEY_PREFIX}${raw}`;
  const hash = hashApiKey(plaintext);
  // Shown in the dashboard list so a user can tell keys apart without ever
  // seeing the full value again.
  const prefix = `${plaintext.slice(0, KEY_PREFIX.length + 8)}…`;
  return { plaintext, hash, prefix };
}

export function hashApiKey(plaintext: string): string {
  return crypto.createHash("sha256").update(plaintext).digest("hex");
}

export function looksLikeApiKey(value: string): boolean {
  return value.startsWith(KEY_PREFIX);
}
