-- Run once in Supabase: SQL Editor -> New query -> paste -> Run. Safe to run again.

-- 1. Table that holds all editable text (settings, about, landing, sitecopy, lanes, videos ...)
create table if not exists public.content_blocks (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.content_blocks enable row level security;

drop policy if exists "content_blocks public read" on public.content_blocks;
create policy "content_blocks public read" on public.content_blocks for select using (true);

drop policy if exists "content_blocks admin write" on public.content_blocks;
create policy "content_blocks admin write" on public.content_blocks for all
  to authenticated using (true) with check (true);

-- 2. Storage bucket for your intro video and cover pictures (video up to 50 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 52428800,
  array['video/mp4','video/webm','video/quicktime','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 52428800,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site-media public read" on storage.objects;
create policy "site-media public read" on storage.objects for select using (bucket_id = 'site-media');

drop policy if exists "site-media admin insert" on storage.objects;
create policy "site-media admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'site-media');

drop policy if exists "site-media admin update" on storage.objects;
create policy "site-media admin update" on storage.objects for update to authenticated using (bucket_id = 'site-media');

drop policy if exists "site-media admin delete" on storage.objects;
create policy "site-media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'site-media');
