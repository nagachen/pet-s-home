-- Demo seed data for Pet's Home.
-- This creates demo auth users, profiles, pets, favorites, and adoption applications.
-- It is safe to re-run: fixed UUIDs and ON CONFLICT keep the data idempotent.
-- Demo passwords are all: Demo1234!

create extension if not exists pgcrypto;

with demo_users (id, email, name) as (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, 'demo01@petshome.test', '林小安'),
    ('22222222-2222-4222-8222-222222222222'::uuid, 'demo02@petshome.test', '陳怡君'),
    ('33333333-3333-4333-8333-333333333333'::uuid, 'demo03@petshome.test', '王柏翰'),
    ('44444444-4444-4444-8444-444444444444'::uuid, 'demo04@petshome.test', '李佳穎'),
    ('55555555-5555-4555-8555-555555555555'::uuid, 'demo05@petshome.test', '黃子豪'),
    ('66666666-6666-4666-8666-666666666666'::uuid, 'demo06@petshome.test', '張雅婷'),
    ('77777777-7777-4777-8777-777777777777'::uuid, 'demo07@petshome.test', '吳承恩'),
    ('88888888-8888-4888-8888-888888888888'::uuid, 'demo08@petshome.test', '周品妤'),
    ('99999999-9999-4999-8999-999999999999'::uuid, 'demo09@petshome.test', '鄭宇翔'),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'demo10@petshome.test', '蔡孟潔')
)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  is_sso_user
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  id,
  'authenticated',
  'authenticated',
  email,
  crypt('Demo1234!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('name', name),
  false,
  false
from demo_users
on conflict (id) do update
set
  email = excluded.email,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

with demo_users (id, email, name) as (
  values
    ('11111111-1111-4111-8111-111111111111'::uuid, 'demo01@petshome.test', '林小安'),
    ('22222222-2222-4222-8222-222222222222'::uuid, 'demo02@petshome.test', '陳怡君'),
    ('33333333-3333-4333-8333-333333333333'::uuid, 'demo03@petshome.test', '王柏翰'),
    ('44444444-4444-4444-8444-444444444444'::uuid, 'demo04@petshome.test', '李佳穎'),
    ('55555555-5555-4555-8555-555555555555'::uuid, 'demo05@petshome.test', '黃子豪'),
    ('66666666-6666-4666-8666-666666666666'::uuid, 'demo06@petshome.test', '張雅婷'),
    ('77777777-7777-4777-8777-777777777777'::uuid, 'demo07@petshome.test', '吳承恩'),
    ('88888888-8888-4888-8888-888888888888'::uuid, 'demo08@petshome.test', '周品妤'),
    ('99999999-9999-4999-8999-999999999999'::uuid, 'demo09@petshome.test', '鄭宇翔'),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, 'demo10@petshome.test', '蔡孟潔')
)
insert into profiles (id, email, name, role)
select id, email, name, 'user'
from demo_users
on conflict (id) do update
set
  email = excluded.email,
  name = excluded.name;

insert into pets (
  id,
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
  location,
  status
) values
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000001',
    'Momo',
    'dog',
    '米克斯',
    '2 歲',
    'Female',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80',
    '親人、愛散步，適合願意每天陪伴運動的家庭。',
    array['親人', '愛散步', '穩定'],
    true,
    'Medium',
    '台北',
    'available'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000002',
    'Latte',
    'cat',
    '虎斑貓',
    '1 歲',
    'Male',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    '慢熟但很親人，熟悉環境後會主動撒嬌。',
    array['慢熟', '撒嬌', '安靜'],
    true,
    'Small',
    '新北',
    'available'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000003',
    'Cookie',
    'dog',
    '柴犬',
    '3 歲',
    'Male',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80',
    '個性獨立，會基本指令，需要有經驗的照顧者。',
    array['獨立', '會坐下', '聰明'],
    true,
    'Medium',
    '桃園',
    'available'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000004',
    'Nana',
    'cat',
    '賓士貓',
    '8 個月',
    'Female',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1200&q=80',
    '活潑好奇，喜歡逗貓棒與窗邊觀察。',
    array['活潑', '好奇', '親貓'],
    false,
    'Small',
    '台中',
    'available'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000005',
    'Bento',
    'dog',
    '柯基',
    '4 歲',
    'Male',
    'https://images.unsplash.com/photo-1557973557-ddfa9ee8c11f?auto=format&fit=crop&w=1200&q=80',
    '短腿大笑容，食慾佳，需控制體重。',
    array['親人', '愛吃', '適合家庭'],
    true,
    'Small',
    '高雄',
    'pending'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000006',
    'Pudding',
    'cat',
    '橘貓',
    '5 歲',
    'Male',
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1200&q=80',
    '穩定親人，適合安靜家庭，喜歡被梳毛。',
    array['穩定', '親人', '愛梳毛'],
    true,
    'Medium',
    '台南',
    'available'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000007',
    'Oreo',
    'dog',
    '邊境牧羊犬',
    '1.5 歲',
    'Female',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80',
    '精力充沛，適合有訓練意願與運動習慣的家庭。',
    array['聰明', '活力高', '需訓練'],
    true,
    'Medium',
    '新竹',
    'available'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000008',
    'Mika',
    'cat',
    '三花貓',
    '2 歲',
    'Female',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    '個性溫柔，喜歡固定作息，適合單貓家庭。',
    array['溫柔', '固定作息', '單貓佳'],
    true,
    'Small',
    '台北',
    'hidden'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000009',
    'Sunny',
    'dog',
    '黃金獵犬',
    '6 歲',
    'Female',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80',
    '成熟穩定，對人友善，適合有大一點活動空間的家。',
    array['成熟', '友善', '溫和'],
    true,
    'Large',
    '宜蘭',
    'available'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000010',
    'Taro',
    'cat',
    '暹羅貓',
    '3 歲',
    'Male',
    'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=1200&q=80',
    '愛說話，喜歡陪伴，適合願意互動的照顧者。',
    array['愛說話', '黏人', '互動高'],
    true,
    'Small',
    '台中',
    'adopted'
  )
on conflict (id) do update
set
  name = excluded.name,
  species = excluded.species,
  breed = excluded.breed,
  age = excluded.age,
  gender = excluded.gender,
  image_url = excluded.image_url,
  description = excluded.description,
  traits = excluded.traits,
  vaccinated = excluded.vaccinated,
  size = excluded.size,
  location = excluded.location,
  status = excluded.status;

insert into favorites (user_id, pet_id)
values
  ('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000001'),
  ('11111111-1111-4111-8111-111111111111', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000002'),
  ('22222222-2222-4222-8222-222222222222', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000003'),
  ('33333333-3333-4333-8333-333333333333', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000004'),
  ('44444444-4444-4444-8444-444444444444', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000006'),
  ('55555555-5555-4555-8555-555555555555', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000007'),
  ('66666666-6666-4666-8666-666666666666', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000009'),
  ('77777777-7777-4777-8777-777777777777', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000001'),
  ('88888888-8888-4888-8888-888888888888', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000002'),
  ('99999999-9999-4999-8999-999999999999', 'bbbbbbbb-bbbb-4bbb-8bbb-000000000006')
on conflict (user_id, pet_id) do nothing;

insert into adoption_applications (
  id,
  user_id,
  pet_id,
  full_name,
  phone,
  email,
  address,
  housing_type,
  reason,
  status
) values
  (
    'cccccccc-cccc-4ccc-8ccc-000000000001',
    '11111111-1111-4111-8111-111111111111',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000001',
    '林小安',
    '0911000001',
    'demo01@petshome.test',
    '台北市大安區',
    '公寓',
    '家中作息穩定，希望陪伴一隻親人的狗狗。',
    'pending'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000002',
    '22222222-2222-4222-8222-222222222222',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000002',
    '陳怡君',
    '0911000002',
    'demo02@petshome.test',
    '新北市板橋區',
    '公寓',
    '有養貓經驗，想認養個性穩定的貓咪。',
    'interviewing'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000003',
    '33333333-3333-4333-8333-333333333333',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000003',
    '王柏翰',
    '0911000003',
    'demo03@petshome.test',
    '桃園市中壢區',
    '透天',
    '每天有固定散步時間，也願意持續訓練。',
    'approved'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000004',
    '44444444-4444-4444-8444-444444444444',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000004',
    '李佳穎',
    '0911000004',
    'demo04@petshome.test',
    '台中市西區',
    '公寓',
    '想找一隻年紀較小、能慢慢培養感情的貓咪。',
    'pending'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000005',
    '55555555-5555-4555-8555-555555555555',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000006',
    '黃子豪',
    '0911000005',
    'demo05@petshome.test',
    '台南市東區',
    '有庭院住宅',
    '家中長輩喜歡安靜的貓，希望找到成熟穩定的夥伴。',
    'completed'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000006',
    '66666666-6666-4666-8666-666666666666',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000007',
    '張雅婷',
    '0911000006',
    'demo06@petshome.test',
    '新竹市東區',
    '公寓',
    '有運動習慣，能提供高活動量狗狗需要的陪伴。',
    'interviewing'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000007',
    '77777777-7777-4777-8777-777777777777',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000009',
    '吳承恩',
    '0911000007',
    'demo07@petshome.test',
    '宜蘭縣羅東鎮',
    '透天',
    '家中空間足夠，希望認養溫和的大型犬。',
    'pending'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000008',
    '88888888-8888-4888-8888-888888888888',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000002',
    '周品妤',
    '0911000008',
    'demo08@petshome.test',
    '台北市信義區',
    '公寓',
    '目前在家工作，有時間陪伴慢熟貓咪適應。',
    'rejected'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000009',
    '99999999-9999-4999-8999-999999999999',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000001',
    '鄭宇翔',
    '0911000009',
    'demo09@petshome.test',
    '新北市新店區',
    '公寓',
    '家人都同意認養，並已準備好基本用品。',
    'approved'
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-000000000010',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-4bbb-8bbb-000000000006',
    '蔡孟潔',
    '0911000010',
    'demo10@petshome.test',
    '高雄市苓雅區',
    '其他',
    '想認養穩定親人的貓，家中已有獨立貓房。',
    'pending'
  )
on conflict (id) do update
set
  user_id = excluded.user_id,
  pet_id = excluded.pet_id,
  full_name = excluded.full_name,
  phone = excluded.phone,
  email = excluded.email,
  address = excluded.address,
  housing_type = excluded.housing_type,
  reason = excluded.reason,
  status = excluded.status;
