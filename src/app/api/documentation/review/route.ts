import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Body = z.object({
  documentation_section_id: z.string().uuid(),
  action: z.enum(["approve", "reject", "edit", "manual_add"]),
  new_content: z.string().optional(),
  comment: z.string().optional(),
});

// Every human action on a section (approve, reject, edit, or manually adding
// content where AI had nothing) writes one row to section_reviews before
// touching the section itself, so there's always a record of who changed
// what and when — independent of whatever the section's current state is.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "invalid payload", details: parsed.error.flatten() }, { status: 400 });
  const { documentation_section_id, action, new_content, comment } = parsed.data;

  const { data: section, error: sectionError } = await supabase
    .from("documentation_sections")
    .select("id, content, content_source, status")
    .eq("id", documentation_section_id)
    .single();

  if (sectionError || !section) {
    return NextResponse.json({ error: "section not found" }, { status: 404 });
  }

  let update: Record<string, unknown> = {};
  let reviewNewContent = section.content;

  if (action === "approve") {
    update = { status: "approved" };
  } else if (action === "reject") {
    update = { status: "rejected" };
  } else if (action === "edit" || action === "manual_add") {
    if (!new_content) {
      return NextResponse.json({ error: "new_content is required for edit/manual_add" }, { status: 400 });
    }
    const wasAiGenerated = section.content_source === "ai_generated";
    update = {
      content: new_content,
      content_source: action === "manual_add" && !section.content ? "user_provided" : wasAiGenerated ? "mixed" : "user_provided",
      status: "needs_review",
      updated_at: new Date().toISOString(),
    };
    reviewNewContent = new_content;
  }

  const { error: updateError } = await supabase.from("documentation_sections").update(update).eq("id", documentation_section_id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  await supabase.from("section_reviews").insert({
    documentation_section_id,
    reviewer_id: user.id,
    action,
    previous_content: section.content,
    new_content: reviewNewContent,
    comment: comment ?? null,
  });

  return NextResponse.json({ status: update.status ?? section.status });
}
