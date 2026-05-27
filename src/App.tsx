/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
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
import welcomeImage from './assets/images/welcome_cuddle_centered_1779741991892.png';

const ITEMS_PER_PAGE = 10;

export default function App() {
  const [view, setView] = useState<'landing' | 'explore' | 'member'>('landing');
  const [pets, setPets] = useState<Pet[]>(PETS_DATA);
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);
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

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    setPets((prev) => [{ ...newPetData, id: String(prev.length + 1) }, ...prev]);
    setIsAddPetOpen(false);
    setView('explore');
  };

  const handleLoginSuccess = (email: string, name: string) => {
    setUser({ email, name, isLoggedIn: true });
    setIsAuthOpen(false);
    setView('explore');
  };

  const handleLogout = () => {
    setUser({ email: '', name: '', isLoggedIn: false });
    setView('landing');
  };

  const goExplore = () => {
    setView('explore');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col selection:bg-primary/20">
      <SiteHeader
        view={view}
        user={user}
        favoritesCount={favorites.length}
        onHome={() => setView('landing')}
        onExplore={goExplore}
        onMember={() => setView('member')}
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
  onMember,
  onLogin,
  onLogout,
}: {
  view: string;
  user: UserType;
  favoritesCount: number;
  onHome: () => void;
  onExplore: () => void;
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
  onSelectPet,
  onToggleFavorite,
}: {
  pets: Pet[];
  dogCount: number;
  catCount: number;
  previewPets: Pet[];
  favorites: string[];
  onExplore: () => void;
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
          <div className="inline-flex items-center gap-2 rounded-md border border-surface-container-high bg-white px-3 py-2 text-xs font-bold text-on-surface-variant">
            <MapPin className="h-4 w-4 text-primary" />
            北中南合作中途與送養資訊整理
          </div>
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-normal text-on-surface sm:text-5xl">
              給正在等家的毛孩，一個被看見的機會。
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-on-surface-variant">
              這裡先整理待認養資料、照護筆記與基本條件。你可以先看個性、所在地和照護需求，再決定是否進一步諮詢。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg">
            <Stat value={pets.length} label="待認養" />
            <Stat value={dogCount} label="狗狗" />
            <Stat value={catCount} label="貓咪" />
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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-surface-container-high bg-white p-4">
      <div className="font-display text-2xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs font-bold text-on-surface-variant">{label}</div>
    </div>
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
