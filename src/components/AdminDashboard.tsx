import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  EyeOff,
  FileText,
  ImageUp,
  PlusCircle,
  RefreshCw,
  Save,
  ShieldAlert,
  UserCog,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Pet, User } from '../types';

type PetStatus = 'available' | 'pending' | 'adopted' | 'hidden';
type ApplicationStatus = 'pending' | 'interviewing' | 'approved' | 'completed' | 'rejected';
type AdminTab = 'pets' | 'applications' | 'members';
type ProfileRole = 'user' | 'admin';

interface AdminPetRow {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  image_url: string;
  description: string;
  traits: string[];
  vaccinated: boolean;
  size: 'Small' | 'Medium' | 'Large';
  location: string;
  status: PetStatus;
  created_at: string;
}

interface AdminApplicationRow {
  id: string;
  user_id: string;
  pet_id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  housing_type: string;
  reason: string | null;
  status: ApplicationStatus;
  created_at: string;
}

interface AdminProfileRow {
  id: string;
  email: string;
  name: string | null;
  role: ProfileRole;
  created_at: string | null;
  favoritesCount: number;
  applicationsCount: number;
}

interface PetFormState {
  id?: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  image: string;
  description: string;
  traitsString: string;
  vaccinated: boolean;
  size: 'Small' | 'Medium' | 'Large';
  location: string;
  status: PetStatus;
}

interface AdminDashboardProps {
  user: User;
  isAdmin: boolean;
  pets: Pet[];
  onLogin: () => void;
  onBack: () => void;
  onPetsChanged: () => void;
}

const emptyPetForm: PetFormState = {
  name: '',
  species: 'dog',
  breed: '',
  age: '',
  gender: 'Female',
  image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  description: '',
  traitsString: '親人, 活潑',
  vaccinated: true,
  size: 'Small',
  location: '台北',
  status: 'available',
};

const statusLabel: Record<ApplicationStatus, string> = {
  pending: '待審核',
  interviewing: '訪談中',
  approved: '已核准',
  completed: '已完成',
  rejected: '已婉拒',
};

const petStatusLabel: Record<PetStatus, string> = {
  available: '公開',
  pending: '洽談中',
  adopted: '已送養',
  hidden: '下架',
};

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

function formFromPet(pet: AdminPetRow): PetFormState {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: pet.age,
    gender: pet.gender,
    image: pet.image_url,
    description: pet.description,
    traitsString: pet.traits.join(', '),
    vaccinated: pet.vaccinated,
    size: pet.size,
    location: pet.location,
    status: pet.status,
  };
}

export function AdminDashboard({ user, isAdmin, pets, onLogin, onBack, onPetsChanged }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('pets');
  const [adminPets, setAdminPets] = useState<AdminPetRow[]>([]);
  const [applications, setApplications] = useState<AdminApplicationRow[]>([]);
  const [profiles, setProfiles] = useState<AdminProfileRow[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [form, setForm] = useState<PetFormState>(emptyPetForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const petById = useMemo(() => new Map(pets.map((pet) => [pet.id, pet])), [pets]);
  const visibleCount = adminPets.filter((pet) => pet.status === 'available').length;
  const pendingApplications = applications.filter((application) => application.status === 'pending').length;
  const adminCount = profiles.filter((profile) => profile.role === 'admin').length;
  const filteredProfiles = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();
    if (!query) return profiles;

    return profiles.filter((profile) =>
      [profile.email, profile.name ?? '', profile.role].some((value) => value.toLowerCase().includes(query)),
    );
  }, [memberSearch, profiles]);

  const loadAdminData = async () => {
    if (!supabase || !isAdmin) return;

    setIsLoading(true);
    setMessage('');

    const [
      { data: petRows, error: petsError },
      { data: appRows, error: appsError },
      { data: profileRows, error: profilesError },
      { data: favoriteRows, error: favoritesError },
    ] = await Promise.all([
      supabase
        .from('pets')
        .select('id, name, species, breed, age, gender, image_url, description, traits, vaccinated, size, location, status, created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('adoption_applications')
        .select('id, user_id, pet_id, full_name, phone, email, address, housing_type, reason, status, created_at')
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id, email, name, role, created_at')
        .order('created_at', { ascending: false }),
      supabase.from('favorites').select('user_id'),
    ]);

    if (petsError || appsError || profilesError || favoritesError) {
      console.error('Failed to load admin data:', petsError ?? appsError ?? profilesError ?? favoritesError);
      setMessage('後台資料讀取失敗，請確認 admin policy 已執行。');
    } else {
      const nextApplications = (appRows ?? []) as AdminApplicationRow[];
      const favoriteCounts = new Map<string, number>();
      const applicationCounts = new Map<string, number>();

      for (const favorite of (favoriteRows ?? []) as { user_id: string }[]) {
        favoriteCounts.set(favorite.user_id, (favoriteCounts.get(favorite.user_id) ?? 0) + 1);
      }

      for (const application of nextApplications) {
        applicationCounts.set(application.user_id, (applicationCounts.get(application.user_id) ?? 0) + 1);
      }

      setAdminPets((petRows ?? []) as AdminPetRow[]);
      setApplications(nextApplications);
      setProfiles(
        ((profileRows ?? []) as Omit<AdminProfileRow, 'favoritesCount' | 'applicationsCount'>[]).map((profile) => ({
          ...profile,
          role: profile.role === 'admin' ? 'admin' : 'user',
          favoritesCount: favoriteCounts.get(profile.id) ?? 0,
          applicationsCount: applicationCounts.get(profile.id) ?? 0,
        })),
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadAdminData();
  }, [isAdmin]);

  const updateForm = (name: keyof PetFormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyPetForm);
    setMessage('');
  };

  const uploadPetImage = async (file: File) => {
    if (!supabase) return;

    if (!file.type.startsWith('image/')) {
      setMessage('請選擇圖片檔。');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setMessage('圖片太大，請壓縮到 2 MB 以內再上傳。');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('pet-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Failed to upload pet image:', error);
      setMessage('圖片上傳失敗，請確認 pet-images bucket 和 Storage policy 已建立。');
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from('pet-images').getPublicUrl(path);
    updateForm('image', data.publicUrl);
    setMessage('圖片已上傳並套用到表單。');
    setIsUploading(false);
  };

  const savePet = async () => {
    if (!supabase) return;
    if (!form.name || !form.breed || !form.age || !form.location || !form.description) {
      setMessage('請先填完整名稱、品種、年齡、地點與描述。');
      return;
    }

    const payload = {
      name: form.name,
      species: form.species,
      breed: form.breed,
      age: form.age,
      gender: form.gender,
      image_url: form.image,
      description: form.description,
      traits: form.traitsString.split(',').map((trait) => trait.trim()).filter(Boolean),
      vaccinated: form.vaccinated,
      size: form.size,
      location: form.location,
      status: form.status,
    };

    const { error } = form.id
      ? await supabase.from('pets').update(payload).eq('id', form.id)
      : await supabase.from('pets').insert(payload);

    if (error) {
      console.error('Failed to save pet:', error);
      setMessage('儲存寵物資料失敗，請確認你是 admin 並已執行 admin policy。');
      return;
    }

    setMessage(form.id ? '寵物資料已更新。' : '寵物資料已新增。');
    resetForm();
    await loadAdminData();
    onPetsChanged();
  };

  const setPetStatus = async (pet: AdminPetRow, status: PetStatus) => {
    if (!supabase) return;

    const { error } = await supabase.from('pets').update({ status }).eq('id', pet.id);
    if (error) {
      console.error('Failed to update pet status:', error);
      setMessage('更新寵物狀態失敗。');
      return;
    }

    await loadAdminData();
    onPetsChanged();
  };

  const setApplicationStatus = async (id: string, status: ApplicationStatus) => {
    if (!supabase) return;

    const { error } = await supabase.from('adoption_applications').update({ status }).eq('id', id);
    if (error) {
      console.error('Failed to update application status:', error);
      setMessage('更新申請狀態失敗。');
      return;
    }

    setApplications((prev) => prev.map((application) => (application.id === id ? { ...application, status } : application)));
    setMessage('申請狀態已更新。');
  };

  const setProfileRole = async (id: string, role: ProfileRole) => {
    if (!supabase) return;

    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) {
      console.error('Failed to update profile role:', error);
      setMessage('會員角色更新失敗，請確認 Supabase 已執行最新的 admin policy。');
      return;
    }

    setProfiles((prev) => prev.map((profile) => (profile.id === id ? { ...profile, role } : profile)));
    setMessage(role === 'admin' ? '已將會員設為 admin。' : '已將會員改為一般會員。');
  };

  if (!user.isLoggedIn) {
    return (
      <AdminGate
        title="請先登入"
        text="後台需要會員登入後才能確認管理員權限。"
        actionLabel="登入"
        onAction={onLogin}
        onBack={onBack}
      />
    );
  }

  if (!isAdmin) {
    return (
      <AdminGate
        title="沒有後台權限"
        text="目前登入帳號不是 admin。請先在 Supabase profiles 表把這個帳號設成 admin。"
        actionLabel="回前台"
        onAction={onBack}
        onBack={onBack}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 text-left">
      <section className="mb-6 flex flex-col gap-4 border-b border-surface-container-high pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold">Pet's Home 後台</h1>
          <p className="mt-2 text-sm text-on-surface-variant">管理寵物刊登、上下架、圖片與認養申請狀態。</p>
        </div>
        <button type="button" onClick={loadAdminData} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-surface-container-high bg-white px-4 text-sm font-bold">
          <RefreshCw className="h-4 w-4" />
          重新整理
        </button>
      </section>

      <section className="mb-5 grid gap-3 sm:grid-cols-4">
        <StatCard label="全部寵物" value={adminPets.length} />
        <StatCard label="公開中" value={visibleCount} />
        <StatCard label="待審申請" value={pendingApplications} />
        <StatCard label="會員數" value={profiles.length} />
      </section>

      <div className="mb-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => setActiveTab('pets')} className={`rounded-md px-4 py-2 text-sm font-bold ${activeTab === 'pets' ? 'bg-on-surface text-white' : 'bg-white text-on-surface-variant'}`}>
          寵物管理
        </button>
        <button type="button" onClick={() => setActiveTab('applications')} className={`rounded-md px-4 py-2 text-sm font-bold ${activeTab === 'applications' ? 'bg-on-surface text-white' : 'bg-white text-on-surface-variant'}`}>
          認養申請
        </button>
        <button type="button" onClick={() => setActiveTab('members')} className={`rounded-md px-4 py-2 text-sm font-bold ${activeTab === 'members' ? 'bg-on-surface text-white' : 'bg-white text-on-surface-variant'}`}>
          會員管理
        </button>
      </div>

      {message && <p className="mb-4 rounded-md bg-primary-container p-3 text-sm font-bold text-on-primary-container">{message}</p>}
      {isLoading && <p className="mb-4 text-sm font-bold text-on-surface-variant">讀取中...</p>}

      {activeTab === 'pets' ? (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-surface-container-high bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{form.id ? '編輯寵物' : '新增寵物'}</h2>
              <button type="button" onClick={resetForm} className="text-sm font-bold text-primary">
                清空
              </button>
            </div>
            <PetForm
              form={form}
              isUploading={isUploading}
              onChange={updateForm}
              onUploadImage={uploadPetImage}
              onSave={savePet}
            />
          </div>

          <div className="space-y-3">
            {adminPets.map((pet) => (
              <article key={pet.id} className="rounded-lg border border-surface-container-high bg-white p-4">
                <div className="flex gap-4">
                  <img src={pet.image_url} alt={pet.name} className="h-24 w-28 rounded-md object-cover" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold">{pet.name}</h3>
                      <span className="rounded bg-surface px-2 py-1 text-xs font-bold text-on-surface-variant">{petStatusLabel[pet.status]}</span>
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">{pet.breed} · {pet.location} · {pet.age}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setForm(formFromPet(pet))} className="rounded-md border border-surface-container-high px-3 py-2 text-xs font-bold">
                        編輯
                      </button>
                      <button type="button" onClick={() => setPetStatus(pet, pet.status === 'hidden' ? 'available' : 'hidden')} className="inline-flex items-center gap-1 rounded-md border border-surface-container-high px-3 py-2 text-xs font-bold">
                        <EyeOff className="h-3.5 w-3.5" />
                        {pet.status === 'hidden' ? '重新公開' : '下架'}
                      </button>
                      <button type="button" onClick={() => setPetStatus(pet, 'adopted')} className="inline-flex items-center gap-1 rounded-md border border-surface-container-high px-3 py-2 text-xs font-bold">
                        <CheckCircle className="h-3.5 w-3.5" />
                        標記已送養
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : activeTab === 'applications' ? (
        <section className="space-y-3">
          {applications.map((application) => {
            const pet = petById.get(application.pet_id);
            return (
              <article key={application.id} className="rounded-lg border border-surface-container-high bg-white p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h3 className="font-display text-lg font-bold">{application.full_name}</h3>
                      <span className="rounded bg-surface px-2 py-1 text-xs font-bold text-on-surface-variant">{statusLabel[application.status]}</span>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      {pet?.name ?? '未知寵物'} · {application.phone} · {application.email}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">{application.address} · {application.housing_type}</p>
                    {application.reason && <p className="mt-3 text-sm leading-6 text-on-surface">{application.reason}</p>}
                  </div>
                  <label className="block text-sm font-bold">
                    狀態
                    <select value={application.status} onChange={(event) => setApplicationStatus(application.id, event.target.value as ApplicationStatus)} className="mt-2 h-10 rounded-md border border-surface-container-high bg-white px-3 font-normal">
                      {Object.entries(statusLabel).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="rounded-lg border border-surface-container-high bg-white p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">會員管理</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  目前共有 {profiles.length} 位會員，其中 {adminCount} 位是 admin。
                </p>
              </div>
              <input
                value={memberSearch}
                onChange={(event) => setMemberSearch(event.target.value)}
                placeholder="搜尋姓名、Email 或角色"
                className="h-10 w-full rounded-md border border-surface-container-high bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-white lg:w-80"
              />
            </div>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="grid gap-3">
              {filteredProfiles.map((profile) => (
                <article key={profile.id} className="rounded-lg border border-surface-container-high bg-white p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <h3 className="font-display text-lg font-bold">{profile.name || '未填姓名'}</h3>
                        <span className="rounded bg-surface px-2 py-1 text-xs font-bold text-on-surface-variant">
                          {profile.role === 'admin' ? 'Admin' : '一般會員'}
                        </span>
                      </div>
                      <p className="mt-2 break-all text-sm text-on-surface-variant">{profile.email}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-on-surface-variant">
                        <span className="rounded-md bg-surface px-2 py-1">收藏 {profile.favoritesCount}</span>
                        <span className="rounded-md bg-surface px-2 py-1">認養申請 {profile.applicationsCount}</span>
                        <span className="rounded-md bg-surface px-2 py-1">
                          加入：{profile.created_at ? new Date(profile.created_at).toLocaleDateString('zh-TW') : '未記錄'}
                        </span>
                      </div>
                    </div>

                    <label className="block text-sm font-bold">
                      角色
                      <select
                        value={profile.role}
                        onChange={(event) => setProfileRole(profile.id, event.target.value as ProfileRole)}
                        className="mt-2 h-10 rounded-md border border-surface-container-high bg-white px-3 font-normal"
                      >
                        <option value="user">一般會員</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-surface-container-high bg-white p-10 text-center">
              <UserCog className="mx-auto h-10 w-10 text-on-surface-variant/50" />
              <h2 className="mt-3 font-display text-xl font-bold">找不到會員</h2>
              <p className="mt-2 text-sm text-on-surface-variant">請換個關鍵字，或先確認 profiles 表已有會員資料。</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-surface-container-high bg-white p-4">
      <p className="text-xs font-bold text-on-surface-variant">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function AdminGate({
  title,
  text,
  actionLabel,
  onAction,
  onBack,
}: {
  title: string;
  text: string;
  actionLabel: string;
  onAction: () => void;
  onBack: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-container text-primary">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-extrabold">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onAction} className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white">
          {actionLabel}
        </button>
        <button type="button" onClick={onBack} className="rounded-md border border-surface-container-high bg-white px-4 py-2 text-sm font-bold">
          回待認養名單
        </button>
      </div>
    </main>
  );
}

function PetForm({
  form,
  isUploading,
  onChange,
  onUploadImage,
  onSave,
}: {
  form: PetFormState;
  isUploading: boolean;
  onChange: (name: keyof PetFormState, value: string | boolean) => void;
  onUploadImage: (file: File) => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="名稱" value={form.name} onChange={(value) => onChange('name', value)} />
        <Field label="品種" value={form.breed} onChange={(value) => onChange('breed', value)} />
        <Field label="年齡" value={form.age} onChange={(value) => onChange('age', value)} />
        <Field label="地點" value={form.location} onChange={(value) => onChange('location', value)} />
        <Select label="物種" value={form.species} onChange={(value) => onChange('species', value)} options={[['dog', '狗狗'], ['cat', '貓咪']]} />
        <Select label="性別" value={form.gender} onChange={(value) => onChange('gender', value)} options={[['Male', '男生'], ['Female', '女生']]} />
        <Select label="體型" value={form.size} onChange={(value) => onChange('size', value)} options={[['Small', '小型'], ['Medium', '中型'], ['Large', '大型']]} />
        <Select label="狀態" value={form.status} onChange={(value) => onChange('status', value)} options={Object.entries(petStatusLabel)} />
      </div>

      <div className="rounded-md border border-surface-container-high bg-surface p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <img src={form.image} alt="寵物圖片預覽" className="h-24 w-28 rounded-md bg-white object-cover" referrerPolicy="no-referrer" />
          <div className="flex-1">
            <Field label="圖片網址" value={form.image} onChange={(value) => onChange('image', value)} />
            <label className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-surface-container-high bg-white px-3 text-sm font-bold">
              <ImageUp className="h-4 w-4" />
              {isUploading ? '上傳中...' : '上傳圖片'}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                disabled={isUploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onUploadImage(file);
                  event.target.value = '';
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <Field label="個性標籤，用逗號分隔" value={form.traitsString} onChange={(value) => onChange('traitsString', value)} />
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={form.vaccinated} onChange={(event) => onChange('vaccinated', event.target.checked)} />
        已完成基礎疫苗
      </label>
      <label className="block text-sm font-bold">
        描述
        <textarea value={form.description} onChange={(event) => onChange('description', event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-surface-container-high p-3 font-normal outline-none focus:border-primary" />
      </label>
      <button type="button" onClick={onSave} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-white">
        {form.id ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
        {form.id ? '儲存修改' : '新增寵物'}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-surface-container-high bg-white px-3 font-normal outline-none focus:border-primary">
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}
