// Platform admin access is intentionally just an email allowlist, not a
// database role — this panel shows data across every customer's
// organization, so keeping the check dead simple (one env var, no table
// anyone could accidentally grant themselves a row in) is the safer choice.
export function isPlatformAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}
