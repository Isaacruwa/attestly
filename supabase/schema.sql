-- Attestly: EU AI Act auto-compliance documentation engine
-- Phase 1 schema. Multi-tenant via organizations + Row Level Security.

create extension if not exists "uuid-ossp";

-- ============================================================
-- CORE TENANCY
-- ============================================================

create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

create table organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- ============================================================
-- AI SYSTEMS & AGENTS
-- ============================================================

create table ai_systems (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  risk_category text check (risk_category in ('unacceptable', 'high', 'limited', 'minimal', 'unclassified')) default 'unclassified',
  intended_purpose text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table agents (
  id uuid primary key default uuid_generate_v4(),
  ai_system_id uuid not null references ai_systems(id) on delete cascade,
  name text not null,
  model_info jsonb default '{}'::jsonb,       -- model name/version/provider
  deployment_info jsonb default '{}'::jsonb,  -- environment, region, version tag
  created_at timestamptz not null default now()
);

-- ============================================================
-- TRACE INGESTION
-- ============================================================

create table trace_imports (
  id uuid primary key default uuid_generate_v4(),
  ai_system_id uuid not null references ai_systems(id) on delete cascade,
  source text not null check (source in ('opentelemetry', 'langsmith', 'agentops', 'mcp_logs', 'api_history', 'manual_json')),
  status text not null default 'processing' check (status in ('processing', 'structured', 'failed')),
  raw_ref text,          -- storage path if raw file retained; nullable by design (see SECURITY note)
  event_count int default 0,
  imported_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default uuid_generate_v4(),
  trace_import_id uuid not null references trace_imports(id) on delete cascade,
  agent_id uuid references agents(id) on delete set null,
  event_type text not null check (event_type in (
    'agent_action', 'tool_call', 'api_call', 'model_call',
    'human_intervention', 'error', 'system_event'
  )),
  occurred_at timestamptz,
  summary text,               -- short structured description
  structured_data jsonb default '{}'::jsonb,  -- normalized fields
  raw_snippet jsonb,          -- minimal raw context, only if not sensitive
  created_at timestamptz not null default now()
);

create index idx_events_trace_import on events(trace_import_id);
create index idx_events_agent on events(agent_id);

-- ============================================================
-- COMPLIANCE FRAMEWORK
-- ============================================================

-- Static reference table: EU AI Act Annex IV requirement structure.
-- Seeded once, read by all orgs (no organization_id — it's shared reference data).
create table compliance_requirements (
  id uuid primary key default uuid_generate_v4(),
  framework text not null default 'eu_ai_act_annex_iv',
  section_key text not null unique,       -- e.g. 'annex_iv_1_general_description'
  title text not null,
  description text,
  required_evidence_types text[] default '{}',
  sort_order int not null default 0
);

create table documentation_projects (
  id uuid primary key default uuid_generate_v4(),
  ai_system_id uuid not null references ai_systems(id) on delete cascade,
  title text not null default 'EU AI Act Technical Documentation',
  status text not null default 'in_progress' check (status in ('in_progress', 'needs_review', 'approved', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table documentation_sections (
  id uuid primary key default uuid_generate_v4(),
  documentation_project_id uuid not null references documentation_projects(id) on delete cascade,
  compliance_requirement_id uuid not null references compliance_requirements(id),
  status text not null default 'missing_information' check (status in (
    'missing_information', 'draft_generated', 'needs_review', 'approved', 'rejected', 'updated'
  )),
  content text,                     -- current approved/draft text
  content_source text check (content_source in ('ai_generated', 'user_provided', 'mixed')),
  gap_notes text,                   -- why info is missing / what's needed
  last_generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (documentation_project_id, compliance_requirement_id)
);

-- Links raw events to the documentation section they support ("show your work")
create table evidence_links (
  id uuid primary key default uuid_generate_v4(),
  documentation_section_id uuid not null references documentation_sections(id) on delete cascade,
  event_id uuid references events(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- HUMAN REVIEW & AUDIT
-- ============================================================

create table section_reviews (
  id uuid primary key default uuid_generate_v4(),
  documentation_section_id uuid not null references documentation_sections(id) on delete cascade,
  reviewer_id uuid references auth.users(id),
  action text not null check (action in ('edit', 'approve', 'reject', 'regenerate', 'manual_add')),
  previous_content text,
  new_content text,
  comment text,
  created_at timestamptz not null default now()
);

create table organization_invites (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  invited_by uuid references auth.users(id),
  token uuid not null default uuid_generate_v4() unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  created_at timestamptz not null default now()
);

create table organization_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null unique references organizations(id) on delete cascade,
  plan text not null default 'none' check (plan in ('none', 'starter', 'professional', 'enterprise')),
  status text not null default 'inactive' check (status in ('inactive', 'active', 'past_due', 'canceled', 'paused')),
  paddle_customer_id text,
  paddle_subscription_id text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table audit_log (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table ai_systems enable row level security;
alter table agents enable row level security;
alter table trace_imports enable row level security;
alter table events enable row level security;
alter table documentation_projects enable row level security;
alter table documentation_sections enable row level security;
alter table evidence_links enable row level security;
alter table section_reviews enable row level security;
alter table audit_log enable row level security;
alter table organization_invites enable row level security;
alter table organization_subscriptions enable row level security;

-- Helper: is the current user a member of a given organization?
create or replace function is_org_member(org_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from organization_members
    where organization_id = org_id and user_id = auth.uid()
  );
$$;

create policy "members see their org" on organizations
  for select using (is_org_member(id));

create policy "authenticated users can create an organization" on organizations
  for insert with check (auth.uid() is not null);

create policy "members see membership rows" on organization_members
  for select using (is_org_member(organization_id));

create policy "users can add themselves as a member" on organization_members
  for insert with check (user_id = auth.uid());

create policy "members manage ai systems" on ai_systems
  for all using (is_org_member(organization_id)) with check (is_org_member(organization_id));

create policy "members see agents" on agents
  for all using (is_org_member((select organization_id from ai_systems where id = agents.ai_system_id)))
  with check (is_org_member((select organization_id from ai_systems where id = agents.ai_system_id)));

create policy "members see trace imports" on trace_imports
  for all using (is_org_member((select organization_id from ai_systems where id = trace_imports.ai_system_id)))
  with check (is_org_member((select organization_id from ai_systems where id = trace_imports.ai_system_id)));

create policy "members see events" on events
  for all using (is_org_member((
    select organization_id from ai_systems
    where id = (select ai_system_id from trace_imports where id = events.trace_import_id)
  )));

create policy "members see documentation projects" on documentation_projects
  for all using (is_org_member((select organization_id from ai_systems where id = documentation_projects.ai_system_id)))
  with check (is_org_member((select organization_id from ai_systems where id = documentation_projects.ai_system_id)));

create policy "members see documentation sections" on documentation_sections
  for all using (is_org_member((
    select organization_id from ai_systems
    where id = (select ai_system_id from documentation_projects where id = documentation_sections.documentation_project_id)
  )));

create policy "members see evidence links" on evidence_links
  for all using (is_org_member((
    select organization_id from ai_systems
    where id = (select ai_system_id from documentation_projects
      where id = (select documentation_project_id from documentation_sections where id = evidence_links.documentation_section_id))
  )));

create policy "members see reviews" on section_reviews
  for all using (is_org_member((
    select organization_id from ai_systems
    where id = (select ai_system_id from documentation_projects
      where id = (select documentation_project_id from documentation_sections where id = section_reviews.documentation_section_id))
  )));

create policy "members see audit log" on audit_log
  for select using (is_org_member(organization_id));

create policy "members manage invites for their org" on organization_invites
  for all using (is_org_member(organization_id)) with check (is_org_member(organization_id));

-- Read-only for members: subscription state is only ever written by the
-- Paddle webhook using the service-role key, which bypasses RLS entirely.
-- No client, however trusted, should be able to grant itself a paid plan.
create policy "members see their subscription" on organization_subscriptions
  for select using (is_org_member(organization_id));

-- Atomically validates an invite token against the calling user's own email
-- and adds them to that organization. security definer bypasses RLS inside
-- this function only — the same pattern as create_organization_for_current_user,
-- needed here because the invitee isn't a member of the org yet (so couldn't
-- otherwise see or act on the invite row that grants them membership).
create or replace function accept_organization_invite(p_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_role text;
  v_email text;
begin
  select email into v_email from auth.users where id = auth.uid();

  select organization_id, role into v_org_id, v_role
  from organization_invites
  where token = p_token
    and status = 'pending'
    and lower(email) = lower(v_email);

  if v_org_id is null then
    raise exception 'Invite not found, already used, or not addressed to this email';
  end if;

  insert into organization_members (organization_id, user_id, role)
  values (v_org_id, auth.uid(), v_role)
  on conflict (organization_id, user_id) do nothing;

  update organization_invites set status = 'accepted' where token = p_token;

  return v_org_id;
end;
$$;

grant execute on function accept_organization_invite(uuid) to authenticated;

-- compliance_requirements is shared reference data: readable by any authenticated user, no writes from clients.
alter table compliance_requirements enable row level security;
create policy "authenticated users can read requirements" on compliance_requirements
  for select using (auth.role() = 'authenticated');

-- Atomically creates an organization and adds the calling user as its owner.
-- Doing this as two separate insert-then-select calls from the app breaks
-- under RLS: right after creating the org, the caller isn't a member yet, so
-- the SELECT policy on organizations blocks reading the row back, and the
-- membership insert never happens. security definer bypasses RLS *inside*
-- this function only, and only for exactly this operation.
create or replace function create_organization_for_current_user(org_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into organizations (name) values (org_name) returning id into new_org_id;
  insert into organization_members (organization_id, user_id, role) values (new_org_id, auth.uid(), 'owner');
  return new_org_id;
end;
$$;

grant execute on function create_organization_for_current_user(text) to authenticated;
