create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

alter table profiles enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on table profiles to authenticated;

drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Admins can read profiles" on profiles;

create policy "Users can insert own profile"
on profiles
for insert
to authenticated
with check (auth.uid() = id and role = 'user');

create policy "Admins can read profiles"
on profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage pets" on pets;

create policy "Admins can manage pets"
on pets
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant insert, update, delete on table pets to authenticated;

drop policy if exists "Admins can read all applications" on adoption_applications;
drop policy if exists "Admins can update applications" on adoption_applications;

create policy "Admins can read all applications"
on adoption_applications
for select
to authenticated
using (public.is_admin());

create policy "Admins can update applications"
on adoption_applications
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant update on table adoption_applications to authenticated;

-- Run this after replacing the email with your own login email.
-- insert into profiles (id, email, name, role)
-- select id, email, raw_user_meta_data->>'name', 'admin'
-- from auth.users
-- where email = 'your-email@example.com'
-- on conflict (id)
-- do update set role = 'admin';
