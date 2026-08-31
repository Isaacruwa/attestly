import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Document, Packer, Paragraph, HeadingLevel, TextRun, AlignmentType } from "docx";

// Word document generation needs Node's Buffer, not the Edge runtime.
export const runtime = "nodejs";

const STATUS_LABEL: Record<string, string> = {
  missing_information: "MISSING INFORMATION — no draft generated",
  needs_review: "NEEDS HUMAN REVIEW — AI-drafted, not yet approved",
  approved: "APPROVED",
  rejected: "REJECTED — do not rely on this section",
  updated: "UPDATED — re-review recommended",
};

const SOURCE_LABEL: Record<string, string> = {
  ai_generated: "Source: AI-generated from linked trace evidence",
  user_provided: "Source: Manually entered by a human reviewer",
  mixed: "Source: AI-generated, edited by a human reviewer",
};

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
        .select("id, status, content, content_source, gap_notes, compliance_requirements(title, description, section_key)")
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

  const children: Paragraph[] = [
    new Paragraph({
      text: "EU AI Act Technical Documentation",
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [new TextRun({ text: aiSystem.name, bold: true, size: 28 })],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Generated ${new Date().toLocaleString()}`, italics: true, size: 20 })],
      spacing: { after: 240 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text:
            "This document does not constitute legal advice and does not itself establish regulatory compliance. " +
            "Each section below is clearly labeled with its review status and the source of its content. Sections " +
            "marked as needing review, missing information, or rejected require attention before this document is " +
            "relied upon for any regulatory purpose.",
          italics: true,
          size: 18,
        }),
      ],
      spacing: { after: 360 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Risk category: ", bold: true }), new TextRun(aiSystem.risk_category ?? "unclassified")],
    }),
  ];

  if (aiSystem.intended_purpose) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Intended purpose: ", bold: true }), new TextRun(aiSystem.intended_purpose)],
        spacing: { after: 360 },
      })
    );
  }

  for (const s of sortedSections as any[]) {
    const req = s.compliance_requirements;
    children.push(
      new Paragraph({ text: req?.title ?? "Untitled requirement", heading: HeadingLevel.HEADING_1, spacing: { before: 360 } }),
      new Paragraph({
        children: [new TextRun({ text: STATUS_LABEL[s.status] ?? s.status, bold: true, size: 18 })],
        spacing: { after: 120 },
      })
    );

    if (s.content_source) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: SOURCE_LABEL[s.content_source] ?? s.content_source, italics: true, size: 16 })],
          spacing: { after: 120 },
        })
      );
    }

    children.push(
      new Paragraph({
        text: s.content || s.gap_notes || "No content has been generated or entered for this requirement yet.",
        spacing: { after: 240 },
      })
    );

    const evidence = evidenceBySection.get(s.id) ?? [];
    if (evidence.length > 0) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: "Supporting evidence:", bold: true, size: 16 })], spacing: { after: 60 } })
      );
      for (const line of evidence) {
        children.push(new Paragraph({ text: line, bullet: { level: 0 }, spacing: { after: 20 } }));
      }
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  const filename = `${aiSystem.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-eu-ai-act-documentation.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
