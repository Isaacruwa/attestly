import crypto from "crypto";

// Deterministic SHA-256 hashing for tamper-evidence: given the same content,
// this always produces the same hash. If evidence or an approved section is
// ever altered after the fact, recomputing the hash won't match the stored
// one — that mismatch is the actual proof, not a claim.

export function hashEventContent(input: { event_type: string; occurred_at: string | null; summary: string | null; structured_data: unknown }): string {
  const canonical = JSON.stringify({
    event_type: input.event_type,
    occurred_at: input.occurred_at,
    summary: input.summary,
    structured_data: input.structured_data ?? {},
  });
  return crypto.createHash("sha256").update(canonical).digest("hex");
}

export function hashApprovedContent(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// Combines individual evidence hashes into one fingerprint representing the
// full evidence set a section was approved against — order-independent, so
// the same set of evidence always produces the same combined hash regardless
// of how it was fetched or displayed.
export function hashEvidenceSet(eventHashes: string[]): string {
  const sorted = [...eventHashes].filter(Boolean).sort();
  return crypto.createHash("sha256").update(sorted.join("|")).digest("hex");
}
