import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildDocumentationDocx } from "@/lib/buildDocumentationDocx";

// Word document generation needs Node's Buffer, not the Edge runtime.
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const aiSystemId = req.nextUrl.searchParams.get("ai_system_id");
  if (!aiSystemId) return NextResponse.json({ error: "ai_system_id is required" }, { status: 400 });

  const { data: aiSystem } = await supabase
    .from("ai_systems")
    .select("id, name, description, risk_category, intended_purpose")
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
        .select("id, status, content, content_source, gap_notes, content_hash, evidence_hash, approved_at, compliance_requirements(title, description, section_key)")
        .eq("documentation_project_id", project.id)
    : { data: [] as any[] };

  const sortedSections = [...(sections ?? [])].sort((a: any, b: any) =>
    (a.compliance_requirements?.section_key ?? "").localeCompare(b.compliance_requirements?.section_key ?? "")
  );

  // Evidence appendix: pull linked event summaries per section for a full audit trail.
  const evidenceBySection = new Map<string, string[]>();
  for (const s of sortedSections as any[]) {
    const { data: links } = await supabase
      .from("evidence_links")
      .select("events(event_type, occurred_at, summary)")
      .eq("documentation_section_id", s.id);
    evidenceBySection.set(
      s.id,
      (links ?? []).map((l: any) => {
        const ev = l.events;
        const when = ev?.occurred_at ? new Date(ev.occurred_at).toLocaleString() : "unknown time";
        return `[${ev?.event_type ?? "event"}] ${when} — ${ev?.summary ?? "no summary"}`;
      })
    );
  }

  const buffer = await buildDocumentationDocx(aiSystem, sortedSections as any, evidenceBySection);
  const filename = `${aiSystem.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-eu-ai-act-documentation.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
