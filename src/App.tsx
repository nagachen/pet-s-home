/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  PawPrint,
  PlusCircle,
  Search,
} from 'lucide-react';

import { Pet, User as UserType } from './types';
import { PETS_DATA } from './petsData';
import { PetCard } from './components/PetCard';
import { PetDetailDrawer } from './components/PetDetailDrawer';
import { AdoptionModal } from './components/AdoptionModal';
import { AddPetModal } from './components/AddPetModal';
import { AuthModal } from './components/AuthModal';
import { MemberProfile } from './components/MemberProfile';
import welcomeImage from './assets/images/welcome_cuddle_centered_natural.png';

const ITEMS_PER_PAGE = 10;
const FAVORITES_STORAGE_PREFIX = 'pet-home:favorites:';
const GUEST_FAVORITES_KEY = `${FAVORITES_STORAGE_PREFIX}guest`;

type AppView = 'landing' | 'explore' | 'locations' | 'member';

const SERVICE_LOCATIONS = [
  {
    area: '北部',
    name: '台北認養諮詢站',
    address: '台北市大安區和平東路二段 118 號',
    hours: '週二至週日 11:00-19:00',
    note: '提供初步諮詢、認養條件確認與北部合作中途媒合。',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%AE%89%E5%8D%80%E5%92%8C%E5%B9%B3%E6%9D%B1%E8%B7%AF%E4%BA%8C%E6%AE%B5118%E8%99%9F',
  },
  {
    area: '中部',
    name: '台中合作中途據點',
    address: '台中市西區公益路 155 巷 8 號',
    hours: '週三至週日 12:00-18:00',
    note: '安排中途探訪、照護筆記說明與送養前互動觀察。',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E4%B8%AD%E5%B8%82%E8%A5%BF%E5%8D%80%E5%85%AC%E7%9B%8A%E8%B7%AF155%E5%B7%B78%E8%99%9F',
  },
  {
    area: '南部',
    name: '高雄送養服務站',
    address: '高雄市苓雅區青年一路 24 號',
    hours: '週五至週日 13:00-19:00',
    note: '協助南部送養諮詢、家訪安排與後續追蹤聯繫。',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=%E9%AB%98%E9%9B%84%E5%B8%82%E8%8B%93%E9%9B%85%E5%8D%80%E9%9D%92%E5%B9%B4%E4%B8%80%E8%B7%AF24%E8%99%9F',
  },
];

function getFavoritesKey(email?: string) {
  const normalizedEmail = email?.trim().toLowerCase();
  return normalizedEmail ? `${FAVORITES_STORAGE_PREFIX}${normalizedEmail}` : GUEST_FAVORITES_KEY;
}

function loadStoredFavorites(key: string) {
  if (typeof window === 'undefined') return [];

  try {
    const rawValue = window.localStorage.getItem(key);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function saveStoredFavorites(key: string, favorites: string[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(favorites));
}

export default function App() {
  const getViewFromHash = (): AppView => {
    if (typeof window === 'undefined') return 'landing';
    if (window.location.hash === '#locations') return 'locations';
    if (window.location.hash === '#explore') return 'explore';
    if (window.location.hash === '#member') return 'member';
    return 'landing';
  };

  const [view, setView] = useState<AppView>(getViewFromHash);
  const [pets, setPets] = useState<Pet[]>(PETS_DATA);
  const [favorites, setFavorites] = useState<string[]>(() => loadStoredFavorites(GUEST_FAVORITES_KEY));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecies, setActiveSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [adoptingPet, setAdoptingPet] = useState<Pet | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [submittedAdoption, setSubmittedAdoption] = useState<{ petName: string; location: string } | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [user, setUser] = useState<UserType>({ email: '', name: '', isLoggedIn: false });

  const filteredPets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return pets.filter((pet) => {
      const matchesSpecies = activeSpecies === 'all' || pet.species === activeSpecies;
      const matchesSearch =
        query.length === 0 ||
        [pet.name, pet.breed, pet.location, ...pet.traits].some((value) => value.toLowerCase().includes(query));
      return matchesSpecies && matchesSearch;
    });
  }, [pets, searchQuery, activeSpecies]);

  const totalPages = Math.max(1, Math.ceil(filteredPets.length / ITEMS_PER_PAGE));
  const visiblePets = filteredPets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const dogCount = pets.filter((pet) => pet.species === 'dog').length;
  const catCount = pets.filter((pet) => pet.species === 'cat').length;

  const navigate = (nextView: AppView) => {
    setView(nextView);
    if (typeof window === 'undefined') return;
    const hash = nextView === 'landing' ? window.location.pathname : `#${nextView}`;
    window.history.pushState(null, '', hash);
  };

  useEffect(() => {
    const handleHashChange = () => setView(getViewFromHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleFavorite = (id: string) => {
    const favoritesKey = getFavoritesKey(user.isLoggedIn ? user.email : undefined);
    setFavorites((prev) => {
      const nextFavorites = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      saveStoredFavorites(favoritesKey, nextFavorites);
      return nextFavorites;
    });
  };

  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    setPets((prev) => [{ ...newPetData, id: String(prev.length + 1) }, ...prev]);
    setIsAddPetOpen(false);
    navigate('explore');
  };

  const handleLoginSuccess = (email: string, name: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    setUser({ email: normalizedEmail, name, isLoggedIn: true });
    setFavorites(loadStoredFavorites(getFavoritesKey(normalizedEmail)));
    setIsAuthOpen(false);
    navigate('explore');
  };

  const handleLogout = () => {
    setUser({ email: '', name: '', isLoggedIn: false });
    setFavorites(loadStoredFavorites(GUEST_FAVORITES_KEY));
    navigate('landing');
  };

  const goExplore = () => {
    navigate('explore');
    setCurrentPage(1);
  };

  const goExploreBySpecies = (species: 'all' | 'dog' | 'cat') => {
    setActiveSpecies(species);
    setSearchQuery('');
    navigate('explore');
    setCurrentPage(1);
  };

  const goLocations = () => {
    navigate('locations');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col selection:bg-primary/20">
      <SiteHeader
        view={view}
        user={user}
        favoritesCount={favorites.length}
        onHome={() => navigate('landing')}
        onExplore={goExplore}
        onLocations={goLocations}
        onMember={() => navigate('member')}
        onLogin={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <Landing
            pets={pets}
            dogCount={dogCount}
            catCount={catCount}
            previewPets={pets.slice(0, 3)}
            favorites={favorites}
            onExplore={goExplore}
            onLocations={goLocations}
            onExploreBySpecies={goExploreBySpecies}
            onSelectPet={setSelectedPet}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {view === 'explore' && (
          <Explore
            petsCount={pets.length}
            filteredPets={filteredPets}
            visiblePets={visiblePets}
            favorites={favorites}
            searchQuery={searchQuery}
            activeSpecies={activeSpecies}
            currentPage={currentPage}
            totalPages={totalPages}
            onSearch={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            onSpecies={(value) => {
              setActiveSpecies(value);
              setCurrentPage(1);
            }}
            onAddPet={() => setIsAddPetOpen(true)}
            onSelectPet={setSelectedPet}
            onToggleFavorite={handleToggleFavorite}
            onPage={setCurrentPage}
          />
        )}

        {view === 'locations' && <Locations onExplore={goExplore} />}

        {view === 'member' && (
          <MemberProfile
            user={user}
            pets={pets}
            favorites={favorites}
            applications={applications}
            onToggleFavorite={handleToggleFavorite}
            onSelectPet={setSelectedPet}
            onLogout={handleLogout}
            onBack={goExplore}
          />
        )}
      </AnimatePresence>

      <footer className="mt-auto border-t border-surface-container-high bg-white py-6 text-xs text-on-surface-variant">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-bold text-on-surface">
            <PawPrint className="h-4 w-4 text-primary" />
            <span>Pet's Home 2026</span>
          </div>
          <p>展示用認養平台。正式上線前需接入後台、資料庫與審核流程。</p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedPet && (
          <PetDetailDrawer
            key="details"
            pet={selectedPet}
            isOpen={!!selectedPet}
            isFavorite={favorites.includes(selectedPet.id)}
            onClose={() => setSelectedPet(null)}
            onToggleFavorite={handleToggleFavorite}
            onStartAdopt={() => {
              setAdoptingPet(selectedPet);
              setSelectedPet(null);
            }}
          />
        )}

        {adoptingPet && (
          <AdoptionModal
            key="adoption"
            pet={adoptingPet}
            isOpen={!!adoptingPet}
            onClose={() => setAdoptingPet(null)}
            onSuccess={(formData) => {
              setApplications((prev) => [
                {
                  id: String(prev.length + 1),
                  petId: adoptingPet.id,
                  petName: adoptingPet.name,
                  petBreed: adoptingPet.breed,
                  petImage: adoptingPet.image,
                  petLocation: adoptingPet.location,
                  status: 'pending',
                  date: new Date().toLocaleDateString('zh-TW'),
                  formData,
                },
                ...prev,
              ]);
              setSubmittedAdoption({ petName: adoptingPet.name, location: adoptingPet.location });
              setAdoptingPet(null);
            }}
          />
        )}

        {isAddPetOpen && (
          <AddPetModal key="add-pet" isOpen={isAddPetOpen} onClose={() => setIsAddPetOpen(false)} onAddPet={handleAddPet} />
        )}

        {isAuthOpen && (
          <AuthModal key="auth" isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
        )}

        {submittedAdoption && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setSubmittedAdoption(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">已送出認養諮詢</h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                我們已收到你對 {submittedAdoption.petName} 的諮詢。示範版目前不會真的寄出通知，正式版可接後台審核。
              </p>
              <button
                type="button"
                onClick={() => setSubmittedAdoption(null)}
                className="mt-5 h-10 w-full rounded-md bg-on-surface text-sm font-bold text-white"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SiteHeader({
  view,
  user,
  favoritesCount,
  onHome,
  onExplore,
  onLocations,
  onMember,
  onLogin,
  onLogout,
}: {
  view: string;
  user: UserType;
  favoritesCount: number;
  onHome: () => void;
  onExplore: () => void;
  onLocations: () => void;
  onMember: () => void;
  onLogin: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-surface-container-high bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button type="button" onClick={onHome} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold">Pet's Home</span>
        </button>

        <nav className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={onExplore}
            className={`hidden rounded-md px-3 py-2 font-bold sm:block ${view === 'explore' ? 'bg-surface-container text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            待認養名單
          </button>
          <button
            type="button"
            onClick={onLocations}
            className={`hidden rounded-md px-3 py-2 font-bold sm:block ${view === 'locations' ? 'bg-surface-container text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            服務據點
          </button>
          <span className="hidden items-center gap-1 rounded-md bg-surface px-3 py-2 text-xs font-bold text-on-surface-variant sm:flex">
            <Heart className="h-3.5 w-3.5 text-red-500" />
            {favoritesCount}
          </span>
          {user.isLoggedIn ? (
            <>
              <button type="button" onClick={onMember} className="rounded-md px-3 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface">
                會員
              </button>
              <button type="button" onClick={onLogout} className="rounded-md border border-surface-container-high p-2 text-on-surface-variant">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button type="button" onClick={onLogin} className="rounded-md bg-on-surface px-4 py-2 text-sm font-bold text-white">
              登入
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function Landing({
  pets,
  dogCount,
  catCount,
  previewPets,
  favorites,
  onExplore,
  onLocations,
  onExploreBySpecies,
  onSelectPet,
  onToggleFavorite,
}: {
  pets: Pet[];
  dogCount: number;
  catCount: number;
  previewPets: Pet[];
  favorites: string[];
  onExplore: () => void;
  onLocations: () => void;
  onExploreBySpecies: (species: 'all' | 'dog' | 'cat') => void;
  onSelectPet: (pet: Pet) => void;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <motion.main
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto w-full max-w-7xl px-6 py-8"
    >
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6 text-left">
          <button
            type="button"
            onClick={onLocations}
            className="inline-flex items-center gap-2 rounded-md border border-surface-container-high bg-white px-3 py-2 text-xs font-bold text-on-surface-variant transition hover:border-primary hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MapPin className="h-4 w-4 text-primary" />
            服務據點｜北中南合作據點
          </button>
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-normal text-on-surface sm:text-5xl">
              給正在等家的毛孩，一個被看見的機會。
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-on-surface-variant">
              這裡先整理待認養資料、照護筆記與基本條件。你可以先看個性、所在地和照護需求，再決定是否進一步諮詢。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg">
            <Stat value={pets.length} label="待認養" onClick={() => onExploreBySpecies('all')} />
            <Stat value={dogCount} label="狗狗" onClick={() => onExploreBySpecies('dog')} />
            <Stat value={catCount} label="貓咪" onClick={() => onExploreBySpecies('cat')} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onExplore}
              className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-white hover:bg-on-surface"
            >
              查看待認養名單
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#adoption-note"
              className="flex h-12 items-center justify-center rounded-md border border-surface-container-high bg-white px-5 text-sm font-bold text-on-surface"
            >
              認養前先看注意事項
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-surface-container-high bg-white shadow-sm">
          <img src={welcomeImage} alt="待認養犬貓合照" className="h-[360px] w-full object-cover" />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="text-left">
            <h2 className="font-display text-2xl font-bold">最近更新</h2>
            <p className="mt-1 text-sm text-on-surface-variant">先從幾位資料較完整的毛孩開始看。</p>
          </div>
          <button type="button" onClick={onExplore} className="hidden text-sm font-bold text-primary sm:block">
            看全部
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {previewPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              isFavorite={favorites.includes(pet.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectPet}
            />
          ))}
        </div>
      </section>

      <section id="adoption-note" className="mt-10 grid gap-4 rounded-lg border border-surface-container-high bg-white p-5 text-left md:grid-cols-3">
        <Note title="先確認生活條件" text="同住家人、租屋規定、工作時間與醫療預算，都會影響毛孩是否能穩定留下。" />
        <Note title="不急著當天帶回家" text="建議先訪談、看互動，再安排試養或後續追蹤，減少二次退養。" />
        <Note title="資料需要後台接管" text="目前是展示資料。正式使用時，寵物資料、申請表與審核狀態會放進資料庫。" />
      </section>
    </motion.main>
  );
}

function Locations({ onExplore }: { onExplore: () => void }) {
  return (
    <motion.main
      key="locations"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto w-full max-w-7xl px-6 py-8 text-left"
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-surface-container-high bg-white px-3 py-2 text-xs font-bold text-on-surface-variant">
            <MapPin className="h-4 w-4 text-primary" />
            Pet's Home 服務據點
          </div>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-on-surface sm:text-5xl">
            北中南合作據點，讓諮詢和探訪更安心。
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-on-surface-variant">
            每個據點都會先協助確認認養條件、照護需求與適合的探訪方式。正式前往前，建議先預約，避免毛孩正在休息、就醫或安排其他互動。
          </p>
        </div>
        <div className="rounded-lg border border-surface-container-high bg-white p-5">
          <h2 className="font-display text-xl font-bold">預約前可以先準備</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Note title="居住條件" text="是否可養寵、家人是否同意、活動空間與安全防護。" />
            <Note title="照護時間" text="平日陪伴、散步或清潔頻率，以及外出時的安排。" />
            <Note title="醫療預算" text="疫苗、結紮、定期健檢與突發醫療的基本準備。" />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold text-primary">據點列表</p>
            <h2 className="font-display text-2xl font-bold">選擇離你最近的服務位置</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-on-surface-variant">
              地址為示範資料，可依實際合作中途或送養店家更新。每個據點都可以連到地圖查看路線。
            </p>
          </div>
          <button type="button" onClick={onExplore} className="text-left text-sm font-bold text-primary sm:text-right">
            先看待認養毛孩
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SERVICE_LOCATIONS.map((location) => (
            <div key={location.name}>
              <LocationCard location={location} />
            </div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

function Explore({
  petsCount,
  filteredPets,
  visiblePets,
  favorites,
  searchQuery,
  activeSpecies,
  currentPage,
  totalPages,
  onSearch,
  onSpecies,
  onAddPet,
  onSelectPet,
  onToggleFavorite,
  onPage,
}: {
  petsCount: number;
  filteredPets: Pet[];
  visiblePets: Pet[];
  favorites: string[];
  searchQuery: string;
  activeSpecies: 'all' | 'dog' | 'cat';
  currentPage: number;
  totalPages: number;
  onSearch: (value: string) => void;
  onSpecies: (value: 'all' | 'dog' | 'cat') => void;
  onAddPet: () => void;
  onSelectPet: (pet: Pet) => void;
  onToggleFavorite: (id: string) => void;
  onPage: (page: number) => void;
}) {
  return (
    <motion.main
      key="explore"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto w-full max-w-7xl px-6 py-8"
    >
      <section className="mb-6 rounded-lg border border-surface-container-high bg-white p-5 text-left">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold text-primary">待認養名單</p>
            <h1 className="mt-1 font-display text-3xl font-extrabold">目前有 {petsCount} 位毛孩正在等家</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
              可依物種、地區、品種或個性搜尋。正式版本會加入後台審核與資料更新紀錄。
            </p>
          </div>
          <button
            type="button"
            onClick={onAddPet}
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-surface-container-high bg-surface px-4 text-sm font-bold text-on-surface hover:border-primary"
          >
            <PlusCircle className="h-4 w-4" />
            新增送養資料
          </button>
        </div>
      </section>

      <section className="mb-6 flex flex-col gap-3 rounded-lg border border-surface-container-high bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterButton active={activeSpecies === 'all'} onClick={() => onSpecies('all')} label="全部" />
          <FilterButton active={activeSpecies === 'dog'} onClick={() => onSpecies('dog')} label="狗狗" />
          <FilterButton active={activeSpecies === 'cat'} onClick={() => onSpecies('cat')} label="貓咪" />
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={searchQuery}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="搜尋名字、品種、地區或個性"
            className="h-11 w-full rounded-md border border-surface-container-high bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </section>

      <div className="mb-4 text-left text-sm text-on-surface-variant">
        找到 <strong className="text-on-surface">{filteredPets.length}</strong> 筆資料
      </div>

      {visiblePets.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visiblePets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isFavorite={favorites.includes(pet.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectPet}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPage(currentPage - 1)}
                className="rounded-md border border-surface-container-high bg-white p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPage(currentPage + 1)}
                className="rounded-md border border-surface-container-high bg-white p-2 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-surface-container-high bg-white p-10 text-center">
          <PawPrint className="mx-auto h-10 w-10 text-on-surface-variant/40" />
          <h2 className="mt-3 font-display text-xl font-bold">沒有符合條件的資料</h2>
          <p className="mt-2 text-sm text-on-surface-variant">可以換個關鍵字，或先看全部待認養名單。</p>
          <button type="button" onClick={() => onSpecies('all')} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white">
            回到全部
          </button>
        </div>
      )}
    </motion.main>
  );
}

function Stat({ value, label, onClick }: { value: number; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-surface-container-high bg-white p-4 text-left transition hover:border-primary hover:bg-primary-container/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="font-display text-2xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs font-bold text-on-surface-variant">{label}</div>
    </button>
  );
}

function LocationCard({ location }: { location: (typeof SERVICE_LOCATIONS)[number] }) {
  return (
    <article className="rounded-lg border border-surface-container-high bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-md bg-primary-container px-2.5 py-1 text-xs font-bold text-primary">{location.area}</span>
        <MapPin className="h-4 w-4 text-primary" />
      </div>
      <h3 className="mt-4 font-display text-xl font-bold">{location.name}</h3>
      <p className="mt-2 text-sm font-bold text-on-surface">{location.address}</p>
      <p className="mt-2 text-sm text-on-surface-variant">{location.hours}</p>
      <p className="mt-3 text-sm leading-6 text-on-surface-variant">{location.note}</p>
      <a
        href={location.mapUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-10 items-center justify-center rounded-md border border-surface-container-high px-4 text-sm font-bold text-on-surface transition hover:border-primary hover:text-primary"
      >
        查看路線
      </a>
    </article>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="font-bold text-on-surface">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{text}</p>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-md px-4 text-sm font-bold ${
        active ? 'bg-on-surface text-white' : 'bg-surface text-on-surface-variant hover:text-on-surface'
      }`}
    >
      {label}
    </button>
  );
}
