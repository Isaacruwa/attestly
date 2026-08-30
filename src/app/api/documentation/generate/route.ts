import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const Body = z.object({ documentation_section_id: z.string().uuid() });

// Given a documentation section, pulls the events already linked as evidence
// for it, asks Claude to draft the section strictly from that evidence, and
// stores the result as a draft — never auto-approved. Human review is a
// separate, required step (see section_reviews table).
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid payload" }, { status: 400 });

  const { documentation_section_id } = parsed.data;

  const { data: section, error: sectionError } = await supabase
    .from("documentation_sections")
    .select("id, compliance_requirement_id, compliance_requirements(title, description)")
    .eq("id", documentation_section_id)
    .single();

  if (sectionError || !section) {
    return NextResponse.json({ error: "section not found" }, { status: 404 });
  }

  const { data: evidence } = await supabase
    .from("evidence_links")
    .select("note, events(event_type, occurred_at, summary, structured_data)")
    .eq("documentation_section_id", documentation_section_id);

  if (!evidence || evidence.length === 0) {
    await supabase
      .from("documentation_sections")
      .update({ status: "missing_information", gap_notes: "No linked evidence events yet for this section." })
      .eq("id", documentation_section_id);
    return NextResponse.json({ status: "missing_information" });
  }

  const requirement: any = (section as any).compliance_requirements;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    system:
      "You draft one section of EU AI Act Annex IV technical documentation. " +
      "Use ONLY the evidence provided — never invent facts, dates, or metrics. " +
      "Where the evidence is insufficient to fully address the requirement, say so explicitly " +
      "under a 'Gaps' heading rather than filling in plausible-sounding text. " +
      "This draft is not legal advice and does not itself establish compliance.",
    messages: [
      {
        role: "user",
        content: `Requirement: ${requirement?.title}\n${requirement?.description}\n\nEvidence:\n${JSON.stringify(
          evidence,
          null,
          2
        )}`,
      },
    ],
  });

  const draft = message.content
    .filter((b) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n");

  await supabase
    .from("documentation_sections")
    .update({
      content: draft,
      content_source: "ai_generated",
      status: "needs_review",
      last_generated_at: new Date().toISOString(),
    })
    .eq("id", documentation_section_id);

  return NextResponse.json({ status: "needs_review", draft });
}
