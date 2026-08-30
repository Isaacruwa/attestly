# Attestly — Phase 1 scaffold

Continuous EU AI Act evidence, generated from what your AI agents already do.

## What's here (Phase 1 + slices of 2–4, to prove the loop end-to-end)

- Next.js 14 (App Router) + TypeScript
- Supabase: auth, Postgres, Row Level Security, multi-tenant by `organizations`
- `supabase/schema.sql` — full Phase 1 data model (orgs, AI systems, agents,
  trace imports, events, compliance requirements, documentation projects/sections,
  evidence links, reviews, audit log) with RLS policies enforcing org isolation
- `supabase/seed.sql` — a first slice of the EU AI Act Annex IV requirement structure
- `/login` — magic-link auth
- `/dashboard` — lists AI systems with documentation status at a glance
- `POST /api/traces/ingest` — normalizes a generic JSON trace payload into the
  `events` table (source-specific parsers for OTel/LangSmith/AgentOps plug in
  here later, all resolving to the same normalized shape)
- `POST /api/documentation/generate` — pulls evidence linked to a documentation
  section and asks Claude to draft it **strictly from that evidence**, marking
  gaps explicitly rather than inventing content. Always lands in `needs_review`,
  never auto-approved.

## Setup

1. Create a Supabase project (free tier is enough for development).
2. Run `supabase/schema.sql` then `supabase/seed.sql` against it (SQL editor or CLI).
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL/keys and
   `ANTHROPIC_API_KEY`. The Anthropic key is only ever read server-side in
   route handlers — never bundled into client code.
4. `npm install`
5. `npm run dev`

## Phase 2 additions

- `src/lib/parsers/opentelemetry.ts` — converts a real OpenTelemetry JSON trace
  export into normalized events (agent action / tool call / API call / model
  call / human intervention / error / system event)
- `/dashboard/systems/[id]/traces` — upload a trace file from the browser,
  see import history and a live activity feed of recorded events
- Ingest route now accepts either pre-normalized `events` or a raw `payload`
  routed through the matching source's parser

## What's intentionally not built yet

- LangSmith / AgentOps / MCP-log parsers (only OpenTelemetry + generic JSON so far —
  same plug-in pattern, one file each)
- Section review UI (edit/approve/reject buttons — the `section_reviews` table
  and status transitions exist, the UI doesn't yet)
- Export (PDF/DOCX of approved documentation)
- Billing/usage limits
- Source-specific trace parsers (OTel span format, LangSmith run format, etc.)
  — only the generic JSON shape is wired up

## Why the schema looks the way it does

- `compliance_requirements` has no `organization_id` — it's shared reference
  data (the Annex IV structure is the same for everyone), while every other
  table is scoped to an org through a chain of foreign keys back to
  `ai_systems.organization_id`, enforced by the `is_org_member()` RLS policies.
- `evidence_links` exists so every generated sentence can be traced back to
  the specific event that justified it — this is the "show your work" seam
  that makes the documentation actually audit-ready rather than just
  AI-sounding prose.
- `documentation_sections.content_source` distinguishes AI-generated text from
  user-provided text at the field level, per the product's human-in-the-loop
  requirement.
