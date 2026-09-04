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
  section and asks Gemini to draft it **strictly from that evidence**, marking
  gaps explicitly rather than inventing content. Always lands in `needs_review`,
  never auto-approved.

## Setup

1. Create a Supabase project (free tier is enough for development).
2. Run `supabase/schema.sql` then `supabase/seed.sql` against it (SQL editor or CLI).
3. Copy `.env.example` to `.env.local` and fill in your Supabase URL/keys and
   `GEMINI_API_KEY`. The Gemini key is only ever read server-side in
   route handlers — never bundled into client code.
4. `npm install`
5. `npm run dev`

## Phase 2 additions

- `src/lib/parsers/opentelemetry.ts`, `langsmith.ts`, `agentops.ts` — each
  converts that source's native trace/export format into the same normalized
  event shape (agent action / tool call / API call / model call / human
  intervention / error / system event)
- `/dashboard/systems/[id]/traces` — upload a trace file from the browser,
  choose which source it's from, see import history and a live activity feed
- Ingest route routes a raw `payload` through the matching source's parser,
  or accepts pre-normalized `events` directly

## Phase 3 additions

- `POST /api/compliance/sync` — for a given AI system, ensures a documentation
  project + one section per EU AI Act requirement exist, then scans all
  imported events and links any matching `required_evidence_types` as
  evidence for that section (skips ones already linked)
- `/dashboard/systems/[id]/compliance` — coverage view: which requirements
  have supporting evidence, which don't, and a manual "re-sync" button
- Seed data's `required_evidence_types` now uses the exact same vocabulary as
  `events.event_type`, so matching is a direct comparison, not a translation
- Fixed a broken dashboard link (pointed at a page that didn't exist)

## Phase 6 (partial): loading UX, output polish, and billing

- Every button/screen that waits on a real backend call (creating a system,
  uploading traces, syncing compliance, generating a draft, approving/
  rejecting, sending an invite) now shows a spinner instead of leaving the
  page static. Draft generation specifically cycles through short status
  messages since that call has real, noticeable latency.
- Markdown cleanup on generated drafts is now much more thorough: headers,
  bold, italics, blockquotes, bullet/numbered lists, horizontal rules,
  markdown links, and inline code are all stripped, with excess blank lines
  collapsed. Already-generated old drafts don't get this retroactively —
  hit "Regenerate" on those to get clean text.
- `organization_subscriptions` table + `/api/webhooks/paddle` — tracks each
  org's plan/status from real Paddle subscription events (created, updated,
  canceled), with the webhook signature verified against the raw request
  body before anything is written. This table is select-only for members;
  only the webhook (service-role key) can write to it, so no client can
  grant itself a paid plan.
- `/pricing` — public, self-serve pricing page with direct Paddle Checkout
  buttons on all three tiers, including Enterprise. No "contact sales" gate
  anywhere.

### Setup needed for billing to go live

1. In your Paddle dashboard, create three **Prices** (one per tier, monthly
   recurring) and copy each Price ID.
2. In Vercel, add: `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` (Paddle → Developer
   Tools → Authentication), `NEXT_PUBLIC_PADDLE_PRICE_STARTER`,
   `NEXT_PUBLIC_PADDLE_PRICE_PROFESSIONAL`, `NEXT_PUBLIC_PADDLE_PRICE_ENTERPRISE`
   (the three Price IDs from step 1), `NEXT_PUBLIC_PADDLE_ENVIRONMENT`
   (`production` or `sandbox`), and `PADDLE_WEBHOOK_SECRET`.
3. In Paddle, add a webhook destination pointing at
   `https://<your-domain>/api/webhooks/paddle`, subscribed to
   `subscription.created`, `subscription.updated`, `subscription.activated`,
   and `subscription.canceled`. Paddle gives you the webhook's signing
   secret when you create it — that's `PADDLE_WEBHOOK_SECRET`.
4. Run the schema update for `organization_subscriptions` (see schema.sql).

### What's intentionally not built yet (billing)

- Usage-limit enforcement per plan (e.g. capping Starter at 1 AI system) —
  subscriptions are tracked, but nothing currently blocks a free account
  from using more than a paid plan would allow.
- A "billing" page inside the dashboard showing the org's current plan —
  right now that only lives in the database.

### Free-tier enforcement (built ahead of the domain)

- `organization_subscriptions.lifetime_generations_used` tracks total drafts
  generated per org, ever (not monthly).
- Free tier (no active paid subscription): **1 AI system, 10 lifetime
  documentation generations**. Enforced server-side in
  `/api/systems/create` and `/api/documentation/generate` — not just in the
  UI, so it can't be bypassed by calling the API directly.
- `src/lib/planLimits.ts` is the single source of truth for what each plan
  allows; change limits there, not in multiple places.
- AI system creation now goes through `/api/systems/create` instead of a
  direct client-side insert, specifically so the limit check happens
  server-side where it can't be skipped.
- Deliberately not closing the "sign up with a new email to reset the free
  tier" loophole (e.g. requiring a company email domain) — accepted as a
  normal cost of running a free tier rather than adding signup friction.

## Legal pages + expanded SEO/GEO/AI discoverability

- `/terms`, `/privacy`, `/refund-policy` — real legal pages, linked in the
  landing page footer. Paddle requires these to exist and be reachable for
  ongoing checkout approval. **Not lawyer-reviewed** — solid standard-practice
  drafts, worth an actual legal review before leaning on them heavily.
- Landing page now has a visible FAQ section whose text matches the
  `FAQPage` JSON-LD exactly (structured data must agree with visible content).
- JSON-LD rebuilt as a proper linked entity graph: `Organization`, `WebSite`,
  and `SoftwareApplication` now reference each other via stable `@id`s
  instead of being disconnected blobs.
- `manifest.ts`, `icon.svg`, `apple-icon.tsx` (generated via `next/og`, not a
  fabricated image asset) — standard PWA/favicon signals.
- `not-found.tsx` — real custom 404 page, explicitly `noindex`.
- `/dashboard/layout.tsx` — explicit `noindex` on the whole dashboard as a
  second layer of protection beyond the `robots.txt` disallow.
- `/pricing/layout.tsx` — gives the pricing page (a client component) its
  own title/description/canonical, since client components can't export
  metadata directly.
- `next.config.js` — baseline security headers (`X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS). Doesn't affect SEO ranking
  directly but is a standard technical-trust signal.
- Sitemap and robots.txt updated for the new pages; removed a stale
  `/auth` disallow entry left over from the deleted magic-link route.

### What's out of scope for now (and why)

- **RSS/Atom feed** — no blog or regularly-updated content exists yet to feed.
- **Breadcrumbs** — the site is flat (no nested content hierarchy) so there's
  nothing genuine to represent.
- **hreflang** — single-language site, no alternate-language pages exist.
- **sameAs social profiles** — none exist yet; add real ones here once they do,
  never fabricated ones.
- **Automated SEO validation script** — skipped per the explicit instruction
  not to build unnecessary tooling; the checks below were done manually
  against this build instead.

### Manual verification performed this round

- robots.txt: PASS (served via Next.js route, all major AI/search crawlers
  explicitly allowed, private routes disallowed)
- sitemap.xml: PASS (all public pages present, absolute HTTPS URLs)
- canonical URLs: PASS (every indexable page sets one, all pointing at
  `attestly.online`, no localhost/Vercel-subdomain leakage found in a full
  repo grep)
- JSON-LD: PASS (valid graph structure, `@id`s consistent, matches visible
  page content)
- Open Graph / Twitter cards: PASS (present in root metadata)
- llms.txt: PASS (already existed from a prior round, still accurate)
- 404 handling: PASS (returns real 404, noindex, useful links back in)

### What still needs manual action outside this repo

- Submit `attestly.online` to Google Search Console and Bing Webmaster
  Tools, and submit the sitemap URL there — this can't be done from code.
- If/when real social profiles exist, add them to the `Organization`
  JSON-LD's `sameAs` array.
- Have an actual lawyer review the Terms/Privacy/Refund pages before
  treating them as your real legal position.

## Trace ingestion bug fix: manual_json and LangSmith imports

**Root cause (one bug, two symptoms):** the upload page guessed how to route an
uploaded file based on its JSON *shape* — "bare array = already normalized,
object = raw payload for a parser." That guess was wrong in both directions:
- A real LangSmith export is commonly a **bare array of unparsed runs**, so it
  got misrouted as "already normalized," failed schema validation (run
  objects have `run_type`, not the expected `event_type`), and surfaced as
  "invalid payload."
- The spec's own pre-normalized format, `{ "events": [...] }`, is a
  **wrapped object**, so it got misrouted to the raw-payload path for a
  `manual_json` parser that didn't exist yet, surfacing as "No parser yet
  for source manual_json."

**Fix:** routing now depends only on the selected `source`, never on JSON
shape. Every source — including `manual_json` — always sends its raw upload
as `payload` and gets parsed by its own dedicated parser, which internally
handles both a bare array and a wrapped-object shape. A second, related bug
was caught while verifying the fix: the ingest route's Zod schema
(`payload: z.record(z.any())`) rejected bare arrays outright regardless of
routing — fixed to `z.union([z.record(z.any()), z.array(z.any())])`.

- `src/lib/parsers/manualJson.ts` — new parser for the `manual_json` source;
  infers a sensible `event_type` from context if one isn't provided, rather
  than rejecting the event outright.
- `src/lib/parsers/langsmith.ts` — now also flattens nested `child_runs`
  into individual events (preserving `parent_run_id` for the relationship),
  and preserves `trace_id`/`tags` from the source run.
- `src/app/api/traces/ingest/route.ts` — added the `manual_json` routing
  branch; fixed the `payload` schema to accept arrays.
- `src/app/dashboard/systems/[id]/traces/page.tsx` — removed the
  shape-guessing heuristic; always sends `payload`.
- OpenTelemetry and AgentOps parsers: **unmodified**, verified via regression
  test below.

### Verification (real code executed, not claimed)

`scripts/test-parsers.ts` and `scripts/test-ingest-e2e.ts`, run against
fixtures in `scripts/fixtures/` (including a bare-array LangSmith export with
nested `child_runs`, and the `{ events: [...] }` manual_json shape from the
spec):

```
PASS — OpenTelemetry (unmodified, regression check): 1 event(s) parsed
PASS — AgentOps (unmodified, regression check): 2 event(s) parsed
PASS — LangSmith (bare array + nested child_runs): 4 event(s) parsed
  → trace_id preserved: true | tags preserved: true
PASS — manual_json ({ events: [...] } wrapper): 5 event(s) parsed
  → extended fields preserved: true
PASS — manual_json (bare array, backward compatible): 1 event(s) parsed

End-to-end ingest simulation (real Zod schema + routing + parser, all four sources):
PASS — opentelemetry: 1 events imported
PASS — agentops: 2 events imported
PASS — langsmith: 4 events imported
PASS — manual_json: 5 events imported
```

Re-run anytime with `npx tsx scripts/test-parsers.ts` or
`npx tsx scripts/test-ingest-e2e.ts`. Imported events land in the same
`events` table and flow through the same compliance-mapping/documentation
pipeline regardless of source — nothing downstream needed to change, since
all four parsers converge on the same `NormalizedEvent` shape.

## Admin panel

- `/admin` — internal dashboard: total users, organizations, AI systems,
  active subscriptions, plan breakdown, a list of paying customers (org +
  owner email + plan + renewal date), and every user's email + signup date.
- Access is a simple email allowlist (`ADMIN_EMAILS` env var), checked
  server-side — not a database role, deliberately, since this page reads
  across every customer's organization via the service-role key. Fewer
  moving parts than a role table means fewer ways to accidentally grant
  someone access.
- `robots.txt` and page-level `noindex` both block this from ever being
  crawled or indexed.
- A link to it only appears in the dashboard nav for allowlisted emails —
  everyone else sees the normal dashboard with no trace of it.

### Setup

Add to Vercel: `ADMIN_EMAILS` — comma-separated list of email addresses
allowed to view `/admin` (e.g. `iamswishkenya@gmail.com,swishmilnet@gmail.com`).

- **Manually assign a plan** to any organization — for comps, goodwill after
  a bug, or testing — via `POST /api/admin/assign-plan`, independent of
  Paddle billing. Every use writes a row to `audit_log` (who did it, what
  changed, when) so it's never a silent, untraceable override.

## Free tool: EU AI Act Risk Checker (organic traffic play #1)

- `/eu-ai-act-risk-checker` — real interactive tool, no signup required.
  Walks through Article 5's prohibited practices, Annex III's 8 high-risk
  domains (with the Article 6(3) narrow-task carve-out), and Article 50's
  transparency triggers, then gives a directional classification.
- Linked from the homepage nav and a dedicated callout section, added to
  the sitemap at high priority, and referenced in `llms.txt`.
- Built using **current** regulatory status verified via live search, not
  training-data assumptions — important, since the EU passed a "Digital
  Omnibus" amendment (Regulation (EU) 2026/1744, in force since July 27,
  2026) that meaningfully changed the timeline:
  - High-risk Annex III obligations: deadline pushed from August 2, 2026 to
    **December 2, 2027**. Annex I (product-embedded) systems: **August 2, 2028**.
  - Two new prohibited practices added (AI nudification tools, AI-generated
    CSAM), applying from **December 2, 2026**.
  - Article 50(2) synthetic-content marking duty: grace period until
    December 2, 2026 for systems already on the market.
  - Prohibited practices from the original list and GPAI model rules remain
    in force and unchanged (since Feb 2025 and Aug 2025 respectively).
  The tool's result screen states these dates explicitly rather than a
  vague "coming soon," and links to Terms rather than presenting itself as
  legal advice.

### Still to do from the organic-traffic plan (in order)

2. Glossary/resource pages targeting specific search queries (What is
   Annex IV, what is a conformity assessment, etc.)
3. Submit to Google Search Console and Bing Webmaster Tools
4. A blog (needs ongoing content, not a one-time build)
5. Core Web Vitals check once real traffic exists

## Glossary (organic traffic play #2)

- `/glossary` (index) + `/glossary/[slug]` (5 terms, one dynamic route
  driven by `src/lib/glossary.ts` — add a new term by adding one array
  entry, not a new page file).
- Terms: Annex IV technical documentation, Annex III high-risk domains,
  conformity assessment, high-risk AI system, AI agent compliance
  documentation. Each targets a specific real search query the homepage
  alone can't rank for.
- Content verified via live search against current sources (same
  verification pass as the risk checker) — includes the correct
  internal-control-vs-notified-body split (Annex III points 2–8 always
  self-assess; point 1/biometrics needs a notified body only if harmonized
  standards weren't applied).
- `DefinedTermSet`/`DefinedTerm` JSON-LD on the index page — the actual
  correct Schema.org type for glossary content.
- Every term page ends with a CTA into the risk checker and pricing, so
  organic glossary traffic has somewhere to go besides the search result.
- All 6 pages (index + 5 terms) added to the sitemap and `llms.txt`.

## What's intentionally not built yet (other)

- MCP-log and API-history parsers (same plug-in pattern — one file each,
  following opentelemetry.ts/langsmith.ts/agentops.ts)
- Section review UI (edit/approve/reject buttons — the `section_reviews` table
  and status transitions exist, the UI doesn't yet) — this is where Phase 4's
  Gemini-drafted content will actually get reviewed
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
