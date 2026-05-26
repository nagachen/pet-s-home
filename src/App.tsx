/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PawPrint,
  ArrowRight,
  Heart,
  Search,
  PlusCircle,
  LogOut,
  Sparkles,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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

export default function App() {
  // Navigation View
  const [view, setView] = useState<'landing' | 'explore' | 'member'>('landing');

  // Reset scroll to top on every view transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  // Pet state
  const [pets, setPets] = useState<Pet[]>(PETS_DATA);
  const [favorites, setFavorites] = useState<string[]>(['1', '3']); // Prefilled Milo & Luna
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecies, setActiveSpecies] = useState<'all' | 'dog' | 'cat'>('all');

  // Adoption applications state (real-time feedback under Member Profile)
  const [applications, setApplications] = useState<any[]>([
    {
      id: '1',
      petId: '1',
      petName: 'Milo',
      petBreed: '黃金獵犬',
      petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      petLocation: '台北市',
      status: 'pending',
      date: '2026/05/25',
      formData: {
        fullName: '愛寵人士',
        phone: '0912-345-678',
        email: 'birdann99@gmail.com',
        address: '台北市信義區忠孝東路五段 1 號',
        housingType: 'Apartment',
      },
    },
  ]);

  // Modal active states
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [adoptingPet, setAdoptingPet] = useState<Pet | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  // Adoption application Success Overlay
  const [submittedAdoption, setSubmittedAdoption] = useState<{ petName: string; location: string } | null>(null);

  // Authenticated user state
  const [user, setUser] = useState<UserType>({
    email: '',
    name: '',
    isLoggedIn: false,
  });

  // Toggling favorites
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add new custom pet handler
  const handleAddPet = (newPetData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...newPetData,
      id: String(pets.length + 1),
    };
    setPets((prev) => [newPet, ...prev]);
    setIsAddPetOpen(false);
  };

  // Login profile helper
  const handleLoginSuccess = (email: string, name: string) => {
    setUser({
      email,
      name,
      isLoggedIn: true,
    });
    setIsAuthOpen(false);
    setView('explore');
  };

  const handleLogout = () => {
    setUser({ email: '', name: '', isLoggedIn: false });
    setView('landing');
  };

  // Search and species filters memoization
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecies = activeSpecies === 'all' ? true : pet.species === activeSpecies;

      return matchesSearch && matchesSpecies;
    });
  }, [pets, searchQuery, activeSpecies]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset to first page when filtering or adding/removing pets
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeSpecies, pets]);

  // Paginated calculations
  const totalPages = Math.ceil(filteredPets.length / ITEMS_PER_PAGE);
  const paginatedPets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPets, currentPage]);

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col relative overflow-x-hidden bg-pattern selection:bg-primary/20 selection:text-primary">
      {/* SVG Clip Path Definitions */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5, 0.9 C 0.1, 0.6, 0, 0.4, 0, 0.27 C 0, 0.1, 0.12, 0, 0.28, 0 C 0.39, 0, 0.46, 0.08, 0.5, 0.16 C 0.54, 0.08, 0.61, 0, 0.72, 0 C 0.88, 0, 1, 0.1, 1, 0.27 C 1, 0.4, 0.9, 0.6, 0.5, 0.9" />
          </clipPath>
        </defs>
      </svg>

      {/* Decorative Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] bg-surface-container-highest opacity-70 blur-3xl organic-shape-1 pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] bg-surface-container-highest opacity-70 blur-3xl organic-shape-2 pointer-events-none"></div>

      {/* FIXED NAV BAR WHEN IN DATA BOARD / MEMBER view */}
      {view !== 'landing' && (
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-surface-container-high py-4 px-6 sm:px-12 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <PawPrint className="w-5 h-5 fill-current" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-primary">
              Pet's Home
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Saved pets counter */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold bg-pink-500/10 text-pink-600 px-3 py-1.5 rounded-full">
              <Heart className="w-4 h-4 fill-current" />
              <span>{favorites.length} 個最愛毛孩</span>
            </div>

            {user.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div
                  onClick={() => setView('member')}
                  className={`flex items-center gap-2.5 cursor-pointer py-1 px-2.5 rounded-xl border transition-all ${
                    view === 'member'
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-transparent hover:border-surface-container-high hover:bg-surface-container/40'
                  }`}
                  title="進入會員中心"
                >
                  <div className="flex flex-col items-end hidden md:block">
                    <span className="text-xs font-bold font-display flex items-center gap-1 select-none">
                      {user.name}
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </span>
                    <span className="text-[10px] opacity-80 font-medium truncate max-w-[120px] select-none">
                      {user.email}
                    </span>
                  </div>
                  {/* Visual Avatar */}
                  <div className="w-9 h-9 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center shadow-inner uppercase text-sm">
                    {user.name.slice(0, 2)}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-9 h-9 bg-surface hover:bg-surface-container border border-surface-container-high rounded-lg flex items-center justify-center text-on-surface-variant hover:text-red-500 transition-colors cursor-pointer"
                  title="登出"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                登入會員
              </button>
            )}
          </div>
        </motion.nav>
      )}

      {/* CORE CANVAS WORKSPACE */}
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          /* ================= LANDING SCREEN ================= */
          <motion.div
            key="landing"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative"
          >
            {/* Background Vectors */}
            <div className="absolute top-[18%] right-[10%] opacity-20 transform rotate-12 pointer-events-none">
              <PawPrint className="w-20 h-20 text-primary fill-current" />
            </div>
            <div className="absolute bottom-[18%] left-[10%] opacity-20 transform -rotate-12 pointer-events-none">
              <PawPrint className="w-16 h-16 text-primary" strokeWidth={1} />
            </div>

            <motion.main
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-8"
            >
              {/* Header */}
              <header className="space-y-4">
                <h1 className="font-display text-[2.75rem] sm:text-5xl font-extrabold text-primary leading-tight tracking-tight">
                  Pet's Home
                </h1>
                <p className="font-body text-base text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  尋找你最要好的好朋友，給予牠們一個溫暖且永久的家。
                </p>
              </header>

              {/* Heart-framed Welcome Cuddles Illustration */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
                {/* Glowing warm fluid background */}
                <div className="absolute inset-0 bg-primary-container/60 rounded-full opacity-50 blur-3xl animate-pulse"></div>
                
                {/* Heart Container with initial spring load animation */}
                <motion.div
                  initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 90,
                    damping: 14,
                    duration: 1.0,
                    delay: 0.15
                  }}
                  className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-[0_16px_32px_rgba(217,106,59,0.18)]"
                >
                  {/* Floating decorative elements around the heart */}
                  <motion.div 
                    animate={{ y: [-4, 4, -4], rotate: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-2 -right-1 text-rose-400 bg-white p-1 rounded-full shadow-md z-20 border border-rose-100"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [4, -4, 4], rotate: [8, -8, 8] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    className="absolute bottom-6 -left-2 text-primary bg-white p-1 rounded-full shadow-md z-20 border border-amber-100"
                  >
                    <PawPrint className="w-5 h-5 fill-current" />
                  </motion.div>

                  {/* Main clip-path heart framed container */}
                  <div 
                    className="w-[94%] h-[94%] overflow-hidden bg-white/40 flex items-center justify-center relative rounded-3xl"
                    style={{ clipPath: 'url(#heart-clip)' }}
                  >
                    <img
                      alt="狗狗和貓咪窩在一起的幸福畫面"
                      className="w-full h-full object-cover select-none scale-[1.05] object-center transition-all duration-300"
                      src={welcomeImage}
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* A soft warm color-blend layer inside the heart frame to align with our heartwarming color theme */}
                    <div className="absolute inset-0 bg-amber-500/5 mix-blend-color pointer-events-none"></div>
                  </div>

                  {/* Transparent overlay SVG of the matching heart frame border */}
                  <div className="absolute inset-0 pointer-events-none scale-[0.945] flex items-center justify-center">
                    <svg className="w-full h-full text-primary" viewBox="0 0 1 1" preserveAspectRatio="none">
                      <path 
                        d="M 0.5, 0.9 C 0.1, 0.6, 0, 0.4, 0, 0.27 C 0, 0.1, 0.12, 0, 0.28, 0 C 0.39, 0, 0.46, 0.08, 0.5, 0.16 C 0.54, 0.08, 0.61, 0, 0.72, 0 C 0.88, 0, 1, 0.1, 1, 0.27 C 1, 0.4, 0.9, 0.6, 0.5, 0.9" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="0.018"
                        className="opacity-45"
                      />
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Functional CTA Area */}
              <div className="w-full mt-6 space-y-3 pt-6 max-w-sm">
                <button
                  onClick={() => setView('explore')}
                  className="w-full h-14 bg-primary text-on-primary font-body text-base font-bold rounded-2xl shadow-[0_8px_16px_rgba(217,106,59,0.25)] hover:bg-primary-container hover:text-on-primary-container hover:shadow-[0_12px_24px_rgba(217,106,59,0.35)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  尋找毛孩夥伴
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </button>

                {user.isLoggedIn ? (
                  <button
                    onClick={() => setView('member')}
                    className="w-full h-14 bg-transparent text-primary hover:bg-surface-container-highest/60 font-body text-base font-bold rounded-2xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    已登入為 <strong className="underline">{user.name}</strong> ‧ 進入會員專區
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="w-full h-14 bg-transparent text-primary hover:bg-surface-container-highest hover:bg-opacity-50 font-body text-base font-bold rounded-2xl transition-colors duration-200 cursor-pointer text-center"
                  >
                    登入會員
                  </button>
                )}
              </div>
            </motion.main>
          </motion.div>
        ) : view === 'explore' ? (
          /* ================= EXPLORE / SHELTER MARKETPLACEVIEW ================= */
          <motion.div
            key="explore"
            id="explore-anchor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 scroll-mt-24"
          >
            {/* Top Showcase banner card with statistics */}
            <div className="relative overflow-hidden bg-primary rounded-3xl py-10 px-8 sm:px-12 text-on-primary text-left bg-pattern-light shadow-[0_12px_24px_rgba(217,106,59,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-current" /> 溫馨寵物之家送養所
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                  有 {pets.length} 隻毛孩正在尋找溫馨家庭！
                </h2>
                <p className="font-body text-sm text-on-primary-container opacity-90 max-w-md">
                  瀏覽各個待認養的可愛伴侶動物。每一隻毛孩皆通過基本健康檢查與疫苗施打，準備妥當，希望能給與牠們一個溫暖且永久的歸宿。
                </p>
              </div>

              {/* Action and stats counter */}
              <div className="flex flex-wrap items-center gap-3 z-10">
                <button
                  onClick={() => setIsAddPetOpen(true)}
                  className="px-5 py-3.5 bg-white text-primary hover:bg-surface-container-low font-extrabold text-sm rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-5 h-5 text-primary" /> 刊登送養毛孩
                </button>
              </div>
            </div>

            {/* Filter and interactive search bar row */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              {/* Category selector capsules */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveSpecies('all')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSpecies === 'all'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" /> 全部毛孩
                </button>
                <button
                  onClick={() => setActiveSpecies('dog')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSpecies === 'dog'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  🐶 狗狗
                </button>
                <button
                  onClick={() => setActiveSpecies('cat')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSpecies === 'cat'
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  🐱 貓咪
                </button>
              </div>

              {/* Custom Search bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                <input
                  type="text"
                  placeholder="搜尋名字、品種、或是送養縣市地點..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface/80 border border-surface-container-highest rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-colors focus:bg-white"
                />
              </div>
            </div>

            {/* List count display */}
            <div className="text-left font-display font-bold text-lg text-on-surface flex items-center gap-2 mb-2">
              <span>提供 {filteredPets.length} 隻待認養的好夥伴</span>
              {searchQuery && (
                <span className="text-xs font-normal text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-sm">
                  篩選關鍵字："{searchQuery}"
                </span>
              )}
            </div>

            {/* Core Pets Grid list */}
            {filteredPets.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <AnimatePresence mode="popLayout">
                    {paginatedPets.map((pet) => (
                      <PetCard
                        key={pet.id}
                        pet={pet}
                        isFavorite={favorites.includes(pet.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onSelect={(p) => setSelectedPet(p)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Elegant Pagination Control */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-surface-container-high/60">
                    <p className="text-xs text-on-surface-variant font-medium">
                      顯示第 <span className="font-bold text-on-surface">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> 至{" "}
                      <span className="font-bold text-on-surface">
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredPets.length)}
                      </span>{" "}
                      隻毛孩，共 <span className="font-bold text-on-surface">{filteredPets.length}</span> 隻
                    </p>

                    <div className="flex items-center gap-1.5 bg-white border border-surface-container-high px-2 py-1.5 rounded-2xl shadow-sm">
                      <button
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage((prev) => prev - 1);
                            document.getElementById('explore-anchor')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant transition-all cursor-pointer disabled:cursor-not-allowed"
                        title="上一頁"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              document.getElementById('explore-anchor')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`w-9 h-9 rounded-xl font-body font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                              isCurrent
                                ? "bg-primary text-on-primary shadow-sm scale-105"
                                : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => {
                          if (currentPage < totalPages) {
                            setCurrentPage((prev) => prev + 1);
                            document.getElementById('explore-anchor')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant transition-all cursor-pointer disabled:cursor-not-allowed"
                        title="下一頁"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* EMPTY FILTER state */
              <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-8 border border-surface-container border-dashed">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-on-surface-variant/40 mb-4">
                  <PawPrint className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-xl text-on-surface">找不到符合條件的可愛毛孩喔</h3>
                <p className="font-body text-sm text-on-surface-variant mt-2">
                  請嘗試換個字詞、簡化搜尋字詞，或點選其他物種分類標籤以尋找更多毛孩！
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSpecies('all');
                  }}
                  className="mt-5 px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary-container transition-colors cursor-pointer"
                >
                  重設所有篩選條件
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* ================= MEMBER DASHBOARD ================= */
          <MemberProfile
            user={user}
            pets={pets}
            favorites={favorites}
            applications={applications}
            onToggleFavorite={handleToggleFavorite}
            onSelectPet={(p) => setSelectedPet(p)}
            onLogout={handleLogout}
            onBack={() => setView('explore')}
          />
        )}
      </AnimatePresence>

      {/* FIXED FOOTER WITH WARM CREDIT */}
      <footer className="w-full py-8 text-center text-xs text-on-surface-variant/70 border-t border-surface-container-high/40 mt-auto bg-surface bg-pattern/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 font-display font-bold text-primary">
            <PawPrint className="w-4 h-4 text-primary fill-current" />
            <span>寵物之家 Pet's Home &copy; 2026 ‧ 用溫暖擁抱每一個生命</span>
          </div>
          <p className="text-[10px] text-on-surface-variant/50">
            本網站僅供模擬展示與認養登記諮詢，非實際營運事業。相關圖片原版權屬原作者所有。
          </p>
        </div>
      </footer>

      {/* ================= MODALS WORKFLOWS RENDER PORTAL ================= */}
      <AnimatePresence>
        {/* Detail drawer popup */}
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

        {/* Adoption Request Multi-step Form modal */}
        {adoptingPet && (
          <AdoptionModal
            key="adoption"
            pet={adoptingPet}
            isOpen={!!adoptingPet}
            onClose={() => setAdoptingPet(null)}
            onSuccess={(formData) => {
              const newApp = {
                id: String(applications.length + 1),
                petId: adoptingPet.id,
                petName: adoptingPet.name,
                petBreed: adoptingPet.breed,
                petImage: adoptingPet.image,
                petLocation: adoptingPet.location,
                status: 'pending' as const,
                date: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                formData: {
                  fullName: formData.fullName || user.name || '本尊',
                  phone: formData.phone || '未填寫',
                  email: formData.email || user.email || '未填寫',
                  address: formData.address || '未填寫',
                  housingType: formData.housingType || 'Apartment',
                }
              };
              setApplications((prev) => [newApp, ...prev]);

              setSubmittedAdoption({
                petName: adoptingPet.name,
                location: adoptingPet.location,
              });
              setAdoptingPet(null);
            }}
          />
        )}

        {/* List a Pet Modal Form */}
        {isAddPetOpen && (
          <AddPetModal
            key="add-pet"
            isOpen={isAddPetOpen}
            onClose={() => setIsAddPetOpen(false)}
            onAddPet={handleAddPet}
          />
        )}

        {/* Authentication flow login/signup */}
        {isAuthOpen && (
          <AuthModal
            key="auth"
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* Celebratory adoption request success feedback overlay */}
        {submittedAdoption && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSubmittedAdoption(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl z-10 space-y-5"
            >
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-on-surface">認養登記成功！</h3>
                <p className="font-body text-sm text-on-surface-variant">
                  我們已經成功將您對 <strong>{submittedAdoption.petName}</strong> 的認養申請與契合投遞書，寄給位於 <strong>{submittedAdoption.location}</strong> 的志工和送養負責中心。
                </p>
              </div>
              <div className="bg-surface/50 p-4 rounded-xl text-xs text-on-surface-variant/80 italic">
                「認養評估小組將於 2 到 4 個工作天內進行意向書與家庭契合度評估人工聯絡，請密切留意您的 Email 信箱或來電喔！」
              </div>
              <button
                onClick={() => setSubmittedAdoption(null)}
                className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
              >
                太棒了，了解！🥰
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
