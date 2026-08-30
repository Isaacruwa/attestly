import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const Body = z.object({ documentation_section_id: z.string().uuid() });

// Given a documentation section, pulls the events already linked as evidence
// for it, asks Gemini to draft the section strictly from that evidence, and
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

  const systemInstruction =
    "You draft one section of EU AI Act Annex IV technical documentation. " +
    "Use ONLY the evidence provided — never invent facts, dates, or metrics. " +
    "Where the evidence is insufficient to fully address the requirement, say so explicitly " +
    "under a 'Gaps:' line at the end rather than filling in plausible-sounding text. " +
    "Write in plain prose paragraphs only — no markdown formatting of any kind: no '#' headers, " +
    "no '**bold**', no bullet lists, no numbered lists. This text goes directly into a formal " +
    "document, not a chat interface, so it must read as normal written paragraphs. " +
    "This draft is not legal advice and does not itself establish compliance.";

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    config: { systemInstruction },
    contents: `Requirement: ${requirement?.title}\n${requirement?.description}\n\nEvidence:\n${JSON.stringify(
      evidence,
      null,
      2
    )}`,
  });

  const rawDraft = response.text ?? "";

  // Defensive cleanup: even with an explicit instruction not to, models
  // occasionally slip into markdown. Strip the common cases so approved
  // text never ends up with stray '#'/'**' characters in the final document.
  const draft = rawDraft
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .trim();

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
