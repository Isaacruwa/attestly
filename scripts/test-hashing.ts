// Proves the tamper-evidence claim is real: same content -> same hash,
// different content -> different hash. Run with: npx tsx scripts/test-hashing.ts
import { hashEventContent, hashApprovedContent, hashEvidenceSet } from "../src/lib/hashing";

let allPass = true;
function check(label: string, condition: boolean) {
  console.log(`${condition ? "PASS" : "FAIL"} — ${label}`);
  if (!condition) allPass = false;
}

const event = { event_type: "tool_call", occurred_at: "2026-09-01T00:00:00Z", summary: "Looked up order", structured_data: { order_id: "ORD-1" } };
const hash1 = hashEventContent(event);
const hash2 = hashEventContent({ ...event });
const tamperedHash = hashEventContent({ ...event, structured_data: { order_id: "ORD-2" } });

check("Same event content produces the same hash", hash1 === hash2);
check("Changing event content changes the hash (tamper-evidence)", hash1 !== tamperedHash);
check("Hash is a real SHA-256 hex digest (64 chars)", /^[a-f0-9]{64}$/.test(hash1));

const contentHash1 = hashApprovedContent("Approved section text.");
const contentHash2 = hashApprovedContent("Approved section text.");
const tamperedContentHash = hashApprovedContent("Approved section text, but altered.");
check("Same approved content produces the same hash", contentHash1 === contentHash2);
check("Altering approved content after the fact changes the hash", contentHash1 !== tamperedContentHash);

const evidenceHashA = hashEvidenceSet(["hash1", "hash2", "hash3"]);
const evidenceHashB = hashEvidenceSet(["hash3", "hash1", "hash2"]); // different order, same set
const evidenceHashC = hashEvidenceSet(["hash1", "hash2"]); // missing one
check("Evidence hash is order-independent for the same set", evidenceHashA === evidenceHashB);
check("Evidence hash changes if evidence is added or removed", evidenceHashA !== evidenceHashC);

console.log(allPass ? "\nAll hashing tests PASS." : "\nSome hashing tests FAILED.");
process.exitCode = allPass ? 0 : 1;
