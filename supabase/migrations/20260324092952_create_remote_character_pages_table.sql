create table if not exists remote_pages (
  id uuid primary key default gen_random_uuid(),         
  page integer not null unique,
  data jsonb not null,                                   
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create unique index if not exists idx_remote_pages_page on remote_pages(page);