-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- It adds the "showcase" table (case studies, testimonials, gallery items) and a public storage bucket for pictures and videos.

create table if not exists public.showcase_items (
  id uuid primary key default gen_random_uuid(),
  lane text not null check (lane in ('operations','hospitality','events','writing')),
  kind text not null check (kind in ('case_study','testimonial','gallery')),
  title text,
  client text,
  summary text,
  metric text,
  metric_label text,
  quote text,
  author text,
  author_role text,
  media_url text,
  media_type text check (media_type in ('image','video','embed')),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.showcase_items enable row level security;

drop policy if exists "showcase public read" on public.showcase_items;
create policy "showcase public read" on public.showcase_items
  for select to anon, authenticated using (published = true);

-- Only a logged-in admin can add, change or remove items.
-- (Keep "Allow new users to sign up" switched OFF in Authentication settings, so only you can log in.)
drop policy if exists "showcase admin all" on public.showcase_items;
create policy "showcase admin all" on public.showcase_items
  for all to authenticated using (true) with check (true);

-- Storage bucket for uploaded pictures and videos (public to read, admin-only to write).
insert into storage.buckets (id, name, public) values ('showcase', 'showcase', true)
on conflict (id) do nothing;

drop policy if exists "showcase files public read" on storage.objects;
create policy "showcase files public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'showcase');

drop policy if exists "showcase files admin write" on storage.objects;
create policy "showcase files admin write" on storage.objects
  for all to authenticated using (bucket_id = 'showcase') with check (bucket_id = 'showcase');
