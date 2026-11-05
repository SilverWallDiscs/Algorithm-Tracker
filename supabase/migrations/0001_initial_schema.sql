-- Initial Algorithm Tracker schema. Apply after creating a Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_locale text not null default 'es' check (preferred_locale in ('es','en')),
  created_at timestamptz not null default now()
);

create table if not exists public.creator_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  categories text[] not null default '{}',
  platforms text[] not null default '{}',
  region_code text not null default 'CL',
  language_code text not null default 'es',
  weekly_publish_goal smallint check (weekly_publish_goal between 0 and 100)
);

create table if not exists public.trends (
  id uuid primary key default gen_random_uuid(),
  canonical_key text not null unique,
  name text not null,
  description text,
  category text not null,
  subcategory text,
  status text not null default 'Emerging' check (status in ('Emerging','Rising','Peak','Saturated','Declining')),
  detected_at timestamptz not null,
  last_seen_at timestamptz not null,
  source_quality text not null check (source_quality in ('real','estimated','demo'))
);

create table if not exists public.trend_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid not null references public.trends(id) on delete cascade,
  platform text not null check (platform in ('youtube','tiktok','x')),
  source text not null,
  metric_key text not null,
  metric_value double precision not null,
  normalized_value double precision check (normalized_value between 0 and 100),
  region_code text,
  language_code text,
  period_key text not null,
  sample_size integer,
  source_quality text not null check (source_quality in ('real','estimated','demo')),
  collected_at timestamptz not null
);
create index if not exists trend_metric_lookup_idx on public.trend_metric_snapshots(trend_id,platform,collected_at desc);

create table if not exists public.trend_scores (
  id uuid primary key default gen_random_uuid(),
  trend_id uuid not null references public.trends(id) on delete cascade,
  region_code text not null,
  language_code text not null,
  period_key text not null,
  trend_score smallint not null check (trend_score between 0 and 100),
  opportunity_score smallint not null check (opportunity_score between 0 and 100),
  saturation_score smallint not null check (saturation_score between 0 and 100),
  confidence text not null check (confidence in ('low','medium','high')),
  methodology_version text not null,
  calculated_at timestamptz not null default now(),
  unique(trend_id,region_code,language_code,period_key,methodology_version)
);

create table if not exists public.followed_channels (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('youtube','tiktok','x')),
  external_channel_id text not null,
  display_name text not null,
  profile_url text,
  enabled boolean not null default true,
  unique(user_id,platform,external_channel_id)
);

create table if not exists public.saved_trends (
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id uuid not null references public.trends(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,trend_id)
);

create table if not exists public.alert_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  rule_type text not null,
  filters jsonb not null default '{}',
  threshold numeric,
  enabled boolean not null default true,
  delivery_channels text[] not null default '{in_app}',
  created_at timestamptz not null default now()
);

create table if not exists public.saved_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id uuid references public.trends(id) on delete set null,
  title text not null,
  angle text,
  hook text,
  script text,
  platform text,
  status text not null default 'idea' check (status in ('idea','draft','in_production','published','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.video_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id uuid references public.trends(id) on delete set null,
  platform text not null check (platform in ('youtube','tiktok','x')),
  creator_baseline_views bigint,
  conservative_views bigint,
  central_views bigint,
  optimistic_views bigint,
  confidence text not null check (confidence in ('low','medium','high')),
  model_version text not null,
  assumptions jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.content_calendar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_id uuid references public.saved_ideas(id) on delete set null,
  title text not null,
  platform text,
  planned_at timestamptz,
  status text not null default 'pending' check (status in ('pending','in_production','published','completed')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.trends enable row level security;
alter table public.trend_metric_snapshots enable row level security;
alter table public.trend_scores enable row level security;
create policy "authenticated read trends" on public.trends for select to authenticated using (true);
create policy "authenticated read snapshots" on public.trend_metric_snapshots for select to authenticated using (true);
create policy "authenticated read scores" on public.trend_scores for select to authenticated using (true);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','creator_preferences','followed_channels','saved_trends','alert_rules','saved_ideas','video_predictions','content_calendar']
  LOOP EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t); END LOOP;
END $$;

create policy "profile owner" on public.profiles for all to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy "preferences owner" on public.creator_preferences for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "channels owner" on public.followed_channels for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "saved trends owner" on public.saved_trends for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "alerts owner" on public.alert_rules for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "ideas owner" on public.saved_ideas for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "predictions owner" on public.video_predictions for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "calendar owner" on public.content_calendar for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
