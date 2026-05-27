create table if not exists pets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null check (species in ('dog', 'cat')),
  breed text not null,
  age text not null,
  gender text not null check (gender in ('Male', 'Female')),
  image_url text not null,
  description text not null,
  traits text[] not null default '{}',
  vaccinated boolean not null default false,
  size text not null check (size in ('Small', 'Medium', 'Large')),
  location text not null,
  status text not null default 'available' check (status in ('available', 'pending', 'adopted', 'hidden')),
  created_at timestamptz not null default now()
);

alter table pets enable row level security;

drop policy if exists "Public can read available pets" on pets;

create policy "Public can read available pets"
on pets
for select
using (status = 'available');

insert into pets (
  name,
  species,
  breed,
  age,
  gender,
  image_url,
  description,
  traits,
  vaccinated,
  size,
  location
) values (
  'Bella',
  'dog',
  'Corgi',
  '1 year',
  'Female',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  '親人、活潑，適合有耐心的家庭。',
  array['親人', '活潑', '適合家庭'],
  true,
  'Small',
  '台北'
);
