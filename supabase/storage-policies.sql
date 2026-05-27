insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pet-images',
  'pet-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read pet images" on storage.objects;
drop policy if exists "Admins can upload pet images" on storage.objects;
drop policy if exists "Admins can update pet images" on storage.objects;
drop policy if exists "Admins can delete pet images" on storage.objects;

create policy "Public can read pet images"
on storage.objects
for select
to public
using (bucket_id = 'pet-images');

create policy "Admins can upload pet images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'pet-images' and public.is_admin());

create policy "Admins can update pet images"
on storage.objects
for update
to authenticated
using (bucket_id = 'pet-images' and public.is_admin())
with check (bucket_id = 'pet-images' and public.is_admin());

create policy "Admins can delete pet images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'pet-images' and public.is_admin());
