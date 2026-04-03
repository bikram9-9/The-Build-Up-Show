-- The Build Up — Outreach Dashboard Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Leads table
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  business text not null,
  category text not null,
  what_they_do text default '',
  revenue text default '',
  twitter text default '',
  linkedin text default '',
  email text default '',
  website text default '',
  location text default '',
  interview_angle text default '',
  status text not null default 'not_contacted',
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sequences table
create table if not exists sequences (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  channel text not null default 'email',
  step_number int not null default 0,
  subject text default '',
  message_body text default '',
  scheduled_for timestamptz,
  sent_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Activity log table
create table if not exists activity_log (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  type text not null,
  details jsonb default '{}',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_sequences_lead_id on sequences(lead_id);
create index if not exists idx_sequences_status_scheduled on sequences(status, scheduled_for);
create index if not exists idx_activity_log_lead_id on activity_log(lead_id);
create index if not exists idx_activity_log_created on activity_log(created_at desc);

-- RLS Policies (permissive for solo user — using anon key)
alter table leads enable row level security;
alter table sequences enable row level security;
alter table activity_log enable row level security;

create policy "Allow all on leads" on leads for all using (true) with check (true);
create policy "Allow all on sequences" on sequences for all using (true) with check (true);
create policy "Allow all on activity_log" on activity_log for all using (true) with check (true);
