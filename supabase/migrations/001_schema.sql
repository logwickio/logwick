-- ============================================================
-- Logwick — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Organizations ──────────────────────────────────────────
create table if not exists organizations (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  plan         text not null default 'free',  -- free | pro | enterprise
  log_limit    integer not null default 5000,
  retention_days integer not null default 7,
  created_at   timestamptz not null default now()
);

-- ── User ↔ Org membership ──────────────────────────────────
create table if not exists org_members (
  id      uuid primary key default gen_random_uuid(),
  org_id  uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role    text not null default 'member',  -- owner | admin | member
  created_at timestamptz not null default now(),
  unique(org_id, user_id)
);

-- ── API Keys ───────────────────────────────────────────────
create table if not exists api_keys (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references organizations(id) on delete cascade,
  name         text not null,
  key_hash     text unique not null,   -- sha256 of the actual key
  key_prefix   text not null,          -- first 12 chars shown in UI
  last_used_at timestamptz,
  call_count   bigint not null default 0,
  created_by   uuid references auth.users(id),
  revoked      boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ── Audit Logs ─────────────────────────────────────────────
create table if not exists logs (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references organizations(id) on delete cascade,
  api_key_id   uuid references api_keys(id) on delete set null,
  agent        text not null,           -- e.g. "gpt-4o", "claude-3-5-sonnet"
  action       text not null,           -- e.g. "email_draft"
  status       text not null default 'success', -- success | error | pending
  input        text,
  output       text,
  user_ref     text,                    -- caller's user identifier
  tokens       integer,
  latency_ms   integer,
  cost_usd     numeric(10,6),
  tags         text[] default '{}',
  metadata     jsonb default '{}',      -- arbitrary extra fields
  created_at   timestamptz not null default now()
);

-- Index for fast queries
create index logs_org_created on logs(org_id, created_at desc);
create index logs_org_status   on logs(org_id, status);
create index logs_org_agent    on logs(org_id, agent);
create index logs_created_at   on logs(created_at desc);

-- ── Webhooks ───────────────────────────────────────────────
create table if not exists webhooks (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations(id) on delete cascade,
  label      text not null,
  url        text not null,
  events     text[] not null default '{error}',  -- error | success | pending | all
  active     boolean not null default true,
  secret     text,                -- optional signing secret
  created_at timestamptz not null default now()
);

-- ── Webhook Deliveries (for debugging) ────────────────────
create table if not exists webhook_deliveries (
  id          uuid primary key default gen_random_uuid(),
  webhook_id  uuid not null references webhooks(id) on delete cascade,
  log_id      uuid references logs(id) on delete set null,
  status_code integer,
  success     boolean,
  response    text,
  delivered_at timestamptz not null default now()
);

-- ── Settings ───────────────────────────────────────────────
create table if not exists org_settings (
  org_id              uuid primary key references organizations(id) on delete cascade,
  alert_threshold_pct integer not null default 10,
  slack_webhook_url   text,
  email_alerts        boolean not null default true,
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table organizations     enable row level security;
alter table org_members        enable row level security;
alter table api_keys           enable row level security;
alter table logs               enable row level security;
alter table webhooks           enable row level security;
alter table webhook_deliveries enable row level security;
alter table org_settings       enable row level security;

-- Helper: is the current user a member of this org?
create or replace function is_org_member(org uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1 from org_members
    where org_id = org and user_id = auth.uid()
  );
$$;

-- Org policies
create policy "members can read org" on organizations
  for select using (is_org_member(id));

create policy "members can read api keys" on api_keys
  for select using (is_org_member(org_id));

create policy "members can manage api keys" on api_keys
  for all using (is_org_member(org_id));

create policy "members can read logs" on logs
  for select using (is_org_member(org_id));

create policy "members can read webhooks" on webhooks
  for select using (is_org_member(org_id));

create policy "members can manage webhooks" on webhooks
  for all using (is_org_member(org_id));

create policy "members can read settings" on org_settings
  for select using (is_org_member(org_id));

create policy "members can update settings" on org_settings
  for all using (is_org_member(org_id));

-- Logs insert via API key (service role bypasses RLS)
-- API routes use service role key, so no RLS needed for ingestion

-- ============================================================
-- Helper function: get org stats
-- ============================================================
create or replace function get_org_stats(p_org_id uuid, p_days integer default 30)
returns json language plpgsql security definer as $$
declare
  result json;
begin
  select json_build_object(
    'total',         count(*),
    'success',       count(*) filter (where status = 'success'),
    'error',         count(*) filter (where status = 'error'),
    'pending',       count(*) filter (where status = 'pending'),
    'total_tokens',  coalesce(sum(tokens), 0),
    'total_cost',    coalesce(sum(cost_usd), 0),
    'avg_latency',   coalesce(avg(latency_ms)::integer, 0),
    'success_rate',  case when count(*) > 0
                       then round((count(*) filter (where status='success'))::numeric / count(*) * 100, 1)
                       else 0 end,
    'error_rate',    case when count(*) > 0
                       then round((count(*) filter (where status='error'))::numeric / count(*) * 100, 1)
                       else 0 end
  ) into result
  from logs
  where org_id = p_org_id
    and created_at >= now() - (p_days || ' days')::interval;

  return result;
end;
$$;
