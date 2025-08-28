create extension if not exists pgcrypto;

create table if not exists documents(
  id uuid primary key default gen_random_uuid(),
  source_url text,
  title text,
  type text,
  created_at timestamptz default now(),
  sha256 char(64) not null unique
);

create table if not exists spans(
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  span_index int,
  text text,
  lang_guess text,
  tokens jsonb,
  unique(document_id, span_index)
);

create table if not exists lexicon(
  id uuid primary key default gen_random_uuid(),
  surface_form text not null,
  normalized text,
  pos text,
  gloss text,
  domain text,
  confidence real check (confidence between 0 and 1),
  source_ref text,
  notes text
);

create table if not exists morph_rules(
  id uuid primary key default gen_random_uuid(),
  pattern text,
  rule_type text,
  evidence jsonb,
  status text default 'candidate'
);

create table if not exists alignments(
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  span_id uuid references spans(id) on delete cascade,
  token_map jsonb,
  method text,
  score real
);

create table if not exists hypotheses(
  id uuid primary key default gen_random_uuid(),
  claim text,
  evidence_refs jsonb,
  status text default 'open',
  created_by text,
  created_at timestamptz default now()
);

create table if not exists eval_sets(
  id uuid primary key default gen_random_uuid(),
  name text,
  description text
);

create table if not exists eval_items(
  id uuid primary key default gen_random_uuid(),
  eval_set_id uuid references eval_sets(id) on delete cascade,
  ay_text text,
  human_gloss text,
  notes text
);

create table if not exists external_logs(
  id uuid primary key default gen_random_uuid(),
  base_url text,
  query text,
  ts timestamptz,
  created_at timestamptz default now()
);
