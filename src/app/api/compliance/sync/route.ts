import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Body = z.object({ ai_system_id: z.string().uuid() });

// Given an AI system, this:
//  1. Ensures it has a documentation project.
//  2. Ensures every EU AI Act requirement has a documentation section for it.
//  3. Scans all imported events for that system and links any whose
//     event_type matches a requirement's required_evidence_types as evidence
//     for that section (skipping links that already exist).
// It never writes drafted text — that's Phase 4's job. This only answers
// "what evidence exists, and for which requirements is there still none."
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  const { ai_system_id } = parsed.data;

  // RLS confirms org ownership implicitly: this select returns nothing if
  // the AI system isn't visible to the caller.
  const { data: aiSystem } = await supabase.from("ai_systems").select("id").eq("id", ai_system_id).single();
  if (!aiSystem) return NextResponse.json({ error: "AI system not found" }, { status: 404 });

  // 1. Ensure a documentation project exists.
  let { data: project } = await supabase
    .from("documentation_projects")
    .select("id")
    .eq("ai_system_id", ai_system_id)
    .maybeSingle();

  if (!project) {
    const { data: newProject, error: projectError } = await supabase
      .from("documentation_projects")
      .insert({ ai_system_id })
      .select("id")
      .single();
    if (projectError || !newProject) {
      return NextResponse.json({ error: projectError?.message ?? "Failed to create documentation project" }, { status: 400 });
    }
    project = newProject;
  }

  // 2. Ensure every requirement has a section.
  const { data: requirements } = await supabase
    .from("compliance_requirements")
    .select("id, section_key, required_evidence_types")
    .order("sort_order");

  const { data: existingSections } = await supabase
    .from("documentation_sections")
    .select("id, compliance_requirement_id")
    .eq("documentation_project_id", project.id);

  const sectionByRequirement = new Map((existingSections ?? []).map((s) => [s.compliance_requirement_id, s.id]));

  for (const req of requirements ?? []) {
    if (!sectionByRequirement.has(req.id)) {
      const { data: newSection } = await supabase
        .from("documentation_sections")
        .insert({ documentation_project_id: project.id, compliance_requirement_id: req.id })
        .select("id")
        .single();
      if (newSection) sectionByRequirement.set(req.id, newSection.id);
    }
  }

  // 3. Pull every event recorded for this AI system.
  const { data: imports } = await supabase.from("trace_imports").select("id").eq("ai_system_id", ai_system_id);
  const importIds = (imports ?? []).map((i) => i.id);

  let events: { id: string; event_type: string }[] = [];
  if (importIds.length > 0) {
    const { data: eventRows } = await supabase.from("events").select("id, event_type").in("trace_import_id", importIds);
    events = eventRows ?? [];
  }

  // 4. For each requirement, link matching events not already linked.
  let linksCreated = 0;
  for (const req of requirements ?? []) {
    const sectionId = sectionByRequirement.get(req.id);
    if (!sectionId) continue;

    const matchingEvents = events.filter((e) => (req.required_evidence_types ?? []).includes(e.event_type));
    if (matchingEvents.length === 0) continue;

    const { data: existingLinks } = await supabase
      .from("evidence_links")
      .select("event_id")
      .eq("documentation_section_id", sectionId);
    const alreadyLinked = new Set((existingLinks ?? []).map((l) => l.event_id));

    const newLinks = matchingEvents
      .filter((e) => !alreadyLinked.has(e.id))
      .map((e) => ({ documentation_section_id: sectionId, event_id: e.id }));

    if (newLinks.length > 0) {
      await supabase.from("evidence_links").insert(newLinks);
      linksCreated += newLinks.length;
    }
  }

  return NextResponse.json({ documentation_project_id: project.id, evidence_links_created: linksCreated });
}
