import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";

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

export type ExportAiSystem = {
  name: string;
  risk_category: string | null;
  intended_purpose: string | null;
};

export type ExportSection = {
  id: string;
  status: string;
  content: string | null;
  content_source: string | null;
  gap_notes: string | null;
  content_hash: string | null;
  evidence_hash: string | null;
  approved_at: string | null;
  compliance_requirements: { title: string; description: string | null; section_key: string } | null;
};

export async function buildDocumentationDocx(
  aiSystem: ExportAiSystem,
  sortedSections: ExportSection[],
  evidenceBySection: Map<string, string[]>
): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({ text: "EU AI Act Technical Documentation", heading: HeadingLevel.TITLE }),
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

  for (const s of sortedSections) {
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

    if (s.status === "approved" && s.content_hash) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Cryptographic verification — approved ${s.approved_at ? new Date(s.approved_at).toLocaleString() : ""}. Content hash (SHA-256): ${s.content_hash}. Evidence hash (SHA-256): ${s.evidence_hash}. Recomputing SHA-256 of the exact approved text should reproduce the content hash; a mismatch indicates the text was altered after approval.`,
              italics: true,
              size: 14,
              color: "5B6470",
            }),
          ],
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

  const doc = new Document({ sections: [{ properties: {}, children }] });
  return Packer.toBuffer(doc);
}
