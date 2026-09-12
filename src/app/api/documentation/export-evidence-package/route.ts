import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { buildDocumentationDocx } from "@/lib/buildDocumentationDocx";
import JSZip from "jszip";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const aiSystemId = req.nextUrl.searchParams.get("ai_system_id");
  if (!aiSystemId) return NextResponse.json({ error: "ai_system_id is required" }, { status: 400 });

  // RLS on ai_systems means this simply returns nothing if the caller
  // doesn't belong to the organization that owns it — no separate
  // authorization check needed beyond this select.
  const { data: aiSystem } = await supabase
    .from("ai_systems")
    .select("id, name, description, risk_category, intended_purpose, organization_id")
    .eq("id", aiSystemId)
    .single();
  if (!aiSystem) return NextResponse.json({ error: "AI system not found" }, { status: 404 });

  const { data: project } = await supabase
    .from("documentation_projects")
    .select("id")
    .eq("ai_system_id", aiSystemId)
    .maybeSingle();

  const { data: sections } = project
    ? await supabase
        .from("documentation_sections")
        .select(
          "id, status, content, content_source, gap_notes, content_hash, evidence_hash, approved_at, approved_by, compliance_requirements(title, description, section_key)"
        )
        .eq("documentation_project_id", project.id)
    : { data: [] as any[] };

  const sortedSections = [...(sections ?? [])].sort((a: any, b: any) =>
    (a.compliance_requirements?.section_key ?? "").localeCompare(b.compliance_requirements?.section_key ?? "")
  );

  // Full evidence detail per section (not just summary strings) — every
  // field, plus the per-event hash, so an auditor can independently verify
  // each piece of evidence rather than just reading a prose summary of it.
  const fullEvidenceBySection = new Map<string, any[]>();
  const summaryEvidenceBySection = new Map<string, string[]>();
  const reviewHistoryBySection = new Map<string, any[]>();
  const userIdsToResolve = new Set<string>();

  for (const s of sortedSections as any[]) {
    const { data: links } = await supabase
      .from("evidence_links")
      .select("events(id, event_type, occurred_at, summary, structured_data, content_hash)")
      .eq("documentation_section_id", s.id);

    const events = (links ?? []).map((l: any) => l.events).filter(Boolean);
    fullEvidenceBySection.set(s.id, events);
    summaryEvidenceBySection.set(
      s.id,
      events.map((ev: any) => {
        const when = ev.occurred_at ? new Date(ev.occurred_at).toLocaleString() : "unknown time";
        return `[${ev.event_type}] ${when} — ${ev.summary ?? "no summary"}`;
      })
    );

    const { data: reviews } = await supabase
      .from("section_reviews")
      .select("action, previous_content, new_content, comment, reviewer_id, created_at")
      .eq("documentation_section_id", s.id)
      .order("created_at", { ascending: true });
    reviewHistoryBySection.set(s.id, reviews ?? []);

    for (const r of reviews ?? []) if (r.reviewer_id) userIdsToResolve.add(r.reviewer_id);
    if (s.approved_by) userIdsToResolve.add(s.approved_by);
  }

  // Resolve reviewer/approver IDs to emails for the human-readable audit
  // trail. Safe to use the service-role client here specifically because
  // we're only naming people who already appear in this org's own review
  // history — not exposing any other organization's data.
  const emailById = new Map<string, string>();
  if (userIdsToResolve.size > 0) {
    const admin = createServiceRoleClient();
    const { data: usersData } = await admin.auth.admin.listUsers({ perPage: 1000 });
    for (const u of usersData?.users ?? []) {
      if (userIdsToResolve.has(u.id)) emailById.set(u.id, u.email ?? "(no email)");
    }
  }

  const docxBuffer = await buildDocumentationDocx(aiSystem as any, sortedSections as any, summaryEvidenceBySection);

  const generatedAt = new Date().toISOString();

  const evidencePackage = {
    package_format_version: "1.0",
    generated_at: generatedAt,
    disclaimer:
      "This package does not constitute legal advice and does not itself establish regulatory compliance. Content hashes allow independent verification that recorded evidence and approved text have not been altered since the recorded timestamp — they do not certify the underlying compliance claim.",
    ai_system: {
      name: aiSystem.name,
      description: aiSystem.description,
      risk_category: aiSystem.risk_category,
      intended_purpose: aiSystem.intended_purpose,
    },
    sections: (sortedSections as any[]).map((s) => ({
      requirement: s.compliance_requirements?.title,
      requirement_description: s.compliance_requirements?.description,
      status: s.status,
      content: s.content,
      content_source: s.content_source,
      gap_notes: s.gap_notes,
      approved_at: s.approved_at,
      approved_by_email: s.approved_by ? emailById.get(s.approved_by) ?? s.approved_by : null,
      content_hash_sha256: s.content_hash,
      evidence_hash_sha256: s.evidence_hash,
      evidence: (fullEvidenceBySection.get(s.id) ?? []).map((ev: any) => ({
        event_type: ev.event_type,
        occurred_at: ev.occurred_at,
        summary: ev.summary,
        structured_data: ev.structured_data,
        content_hash_sha256: ev.content_hash,
      })),
      review_history: (reviewHistoryBySection.get(s.id) ?? []).map((r: any) => ({
        action: r.action,
        by_email: r.reviewer_id ? emailById.get(r.reviewer_id) ?? r.reviewer_id : null,
        at: r.created_at,
        comment: r.comment,
      })),
    })),
  };

  const verifiedSections = (sortedSections as any[]).filter((s) => s.status === "approved" && s.content_hash);
  const verificationText = [
    "ATTESTLY EVIDENCE PACKAGE — VERIFICATION GUIDE",
    `Generated: ${generatedAt}`,
    `AI system: ${aiSystem.name}`,
    "",
    "HOW TO VERIFY",
    "Each approved section below has a SHA-256 hash computed from its exact approved text at the moment of",
    "approval, and a combined hash of the evidence it was approved against. To verify a section's content hasn't",
    "changed, compute SHA-256 of the exact 'content' field for that section in evidence-package.json and compare",
    "it to the content_hash_sha256 value below. A match confirms the text is unaltered since approval; a mismatch",
    "means it changed.",
    "",
    "This is tamper-evidence, not a blockchain or legal certification — it proves content integrity from a",
    "specific point in time, not that the underlying compliance claim is legally sufficient.",
    "",
    "VERIFIED SECTIONS",
    ...verifiedSections.flatMap((s) => [
      "",
      `Requirement: ${s.compliance_requirements?.title}`,
      `Approved: ${s.approved_at}`,
      `Content hash (SHA-256): ${s.content_hash}`,
      `Evidence hash (SHA-256): ${s.evidence_hash}`,
    ]),
    verifiedSections.length === 0 ? "\n(No sections approved yet.)" : "",
  ].join("\n");

  const zip = new JSZip();
  const baseName = aiSystem.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  zip.file(`${baseName}-documentation.docx`, docxBuffer);
  zip.file("evidence-package.json", JSON.stringify(evidencePackage, null, 2));
  zip.file("VERIFICATION.txt", verificationText);

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${baseName}-evidence-package.zip"`,
    },
  });
}
