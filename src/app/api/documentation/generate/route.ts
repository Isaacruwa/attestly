import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { getSubscription, limitsFor } from "@/lib/planLimits";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const Body = z.object({ documentation_section_id: z.string().uuid() });

// Given a documentation section, pulls the events already linked as evidence
// for it, asks Gemini to draft the section strictly from that evidence, and
// stores the result as a draft — never auto-approved. Human review is a
// separate, required step (see section_reviews table).
export async function POST(req: NextRequest) {
  try {
    return await handleGenerate(req);
  } catch (err: any) {
    // Last-resort safety net: whatever went wrong, the person should see a
    // real error message, never Next.js's generic HTML 500 page (which is
    // what an uncaught exception here used to produce).
    return NextResponse.json({ error: err?.message ?? "Unexpected server error" }, { status: 500 });
  }
}

async function handleGenerate(req: NextRequest) {
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
    .select("id, documentation_project_id, compliance_requirement_id, compliance_requirements(title, description)")
    .eq("id", documentation_section_id)
    .single();

  if (sectionError || !section) {
    return NextResponse.json({ error: "section not found" }, { status: 404 });
  }

  const { data: project, error: projectError } = await supabase
    .from("documentation_projects")
    .select("ai_system_id")
    .eq("id", (section as any).documentation_project_id)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "Couldn't find the documentation project for this section" }, { status: 404 });
  }

  const { data: aiSystem } = await supabase.from("ai_systems").select("organization_id").eq("id", project.ai_system_id).single();

  if (!aiSystem) return NextResponse.json({ error: "AI system not found" }, { status: 404 });

  const subscription = await getSubscription(supabase, aiSystem.organization_id);
  const { maxLifetimeGenerations } = limitsFor(subscription.plan, subscription.status);

  if (maxLifetimeGenerations !== null && subscription.lifetime_generations_used >= maxLifetimeGenerations) {
    return NextResponse.json(
      {
        error: `You've used all ${maxLifetimeGenerations} free documentation generations. Upgrade to keep generating.`,
        upgrade_url: "/pricing",
      },
      { status: 403 }
    );
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

  let rawDraft: string;
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      config: { systemInstruction },
      contents: `Requirement: ${requirement?.title}\n${requirement?.description}\n\nEvidence:\n${JSON.stringify(
        evidence,
        null,
        2
      )}`,
    });
    rawDraft = response.text ?? "";
  } catch (err: any) {
    const message = err?.message ?? "Unknown error calling Gemini";
    // A quota/rate-limit error from Google's API is the most likely cause
    // when generating several sections back-to-back on the free tier.
    const isRateLimit = /quota|rate.?limit|429/i.test(message);
    return NextResponse.json(
      {
        error: isRateLimit
          ? "Gemini's free-tier rate limit was hit — wait a minute and try generating this section again."
          : `Draft generation failed: ${message}`,
      },
      { status: 502 }
    );
  }

  // Defensive cleanup: even with an explicit instruction not to, models
  // occasionally slip into markdown. Strip every common case so approved
  // text never carries stray '#'/'**'/list syntax into the final document.
  const draft = rawDraft
    .replace(/^#{1,6}\s*/gm, "") // headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g, "$1") // italics (single asterisk, not part of **)
    .replace(/^>\s?/gm, "") // blockquotes
    .replace(/^[-*]\s+/gm, "") // bullet lists
    .replace(/^\d+\.\s+/gm, "") // numbered lists
    .replace(/^-{3,}$/gm, "") // horizontal rules
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // markdown links -> plain text
    .replace(/`([^`]*)`/g, "$1") // inline code
    .replace(/\n{3,}/g, "\n\n") // collapse leftover blank lines from stripped headers/rules
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

  await createServiceRoleClient()
    .from("organization_subscriptions")
    .update({ lifetime_generations_used: subscription.lifetime_generations_used + 1 })
    .eq("organization_id", aiSystem.organization_id);

  return NextResponse.json({ status: "needs_review", draft });
}
