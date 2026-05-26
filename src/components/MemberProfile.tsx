import { motion } from 'motion/react';
import {
  User as UserIcon,
  Mail,
  Heart,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  Trash2,
  FileText,
  Clock,
  ExternalLink,
  Award,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Pet, User } from '../types';

interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petBreed: string;
  petImage: string;
  petLocation: string;
  status: 'pending' | 'interviewing' | 'approved' | 'completed';
  date: string;
  formData: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    housingType: string;
  };
}

interface MemberProfileProps {
  user: User;
  pets: Pet[];
  favorites: string[];
  applications: AdoptionApplication[];
  onToggleFavorite: (id: string) => void;
  onSelectPet: (pet: Pet) => void;
  onLogout: () => void;
  onBack: () => void;
}

export function MemberProfile({
  user,
  pets,
  favorites,
  applications,
  onToggleFavorite,
  onSelectPet,
  onLogout,
  onBack,
}: MemberProfileProps) {
  // Find favorite pets details
  const favoritePets = pets.filter((pet) => favorites.includes(pet.id));

  // Find pets published by the user (simulated as pets with id > '6' or can show custom labeled pets)
  const myListedPets = pets.filter((pet) => parseInt(pet.id, 10) > 6);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getStatusBadge = (status: AdoptionApplication['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full font-bold text-xs">
            <Clock className="w-3.5 h-3.5" />
            審核中 (環境評估)
          </span>
        );
      case 'interviewing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            志工約訪中
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full font-bold text-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            已核准 (準備接回)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-500/10 text-stone-600 rounded-full font-bold text-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            已完成
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 text-left"
    >
      {/* Back to Explorer Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="group px-4 py-2.5 bg-white hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-sm font-bold rounded-xl border border-surface-container-high shadow-xs cursor-pointer inline-flex items-center gap-2 transition-all"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          返回認養平台
        </button>
        <span className="text-xs font-semibold text-on-surface-variant/70 font-mono">
          會員專區 ‧ Member Dashboard
        </span>
      </div>

      {/* Profile Header Main Banner */}
      <div className="relative overflow-hidden bg-primary rounded-3xl p-8 text-on-primary bg-pattern-light shadow-[0_12px_24px_rgba(0,107,33,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-[-30%] right-[-5%] w-[30vw] h-[30vw] min-w-[200px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-5 z-10">
          <div className="w-18 h-18 bg-white text-primary text-3xl font-extrabold rounded-2xl flex items-center justify-center shadow-md uppercase">
            {user.name.slice(0, 2)}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/20 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-md">
                <Award className="w-3 h-3 text-amber-300" /> 黃金契合認養人
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-on-primary-container opacity-90">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> 註冊日期：2026/05/25
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-end">
          <button
            onClick={onLogout}
            className="px-5 py-3.5 bg-white/15 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/10 transition-colors cursor-pointer"
          >
            登出會員
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Membership Widgets & Info Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats Summary */}
          <div className="bg-white rounded-3xl p-6 border border-surface-container-high shadow-sm space-y-4">
            <h4 className="font-display font-bold text-on-surface text-base border-b pb-3 border-dashed border-on-surface-variant/10">
              數據足跡摘要
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => scrollToSection('favorites-section')}
                className="bg-slate-50 hover:bg-primary/5 hover:border-primary/20 border border-transparent rounded-2xl p-3 text-center cursor-pointer transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary/20"
                title="跳轉至 關注最愛 區塊"
              >
                <span className="block text-xl font-extrabold text-primary group-hover:scale-105 transition-transform duration-200">
                  {favoritePets.length}
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant/80 group-hover:text-primary transition-colors duration-200">
                  關注最愛
                </span>
              </button>
              <button
                onClick={() => scrollToSection('applications-section')}
                className="bg-slate-50 hover:bg-secondary/5 hover:border-secondary/20 border border-transparent rounded-2xl p-3 text-center cursor-pointer transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-secondary/20"
                title="跳轉至 認養申請 區塊"
              >
                <span className="block text-xl font-extrabold text-secondary group-hover:scale-105 transition-transform duration-200">
                  {applications.length}
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant/80 group-hover:text-secondary transition-colors duration-200">
                  認養申請
                </span>
              </button>
              <button
                onClick={() => scrollToSection('listed-section')}
                className="bg-slate-50 hover:bg-amber-500/5 hover:border-amber-500/20 border border-transparent rounded-2xl p-3 text-center cursor-pointer transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                title="跳轉至 我刊登的送養 區塊"
              >
                <span className="block text-xl font-extrabold text-amber-600 group-hover:scale-105 transition-transform duration-200">
                  {myListedPets.length}
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant/80 group-hover:text-amber-600 transition-colors duration-200">
                  刊登送養
                </span>
              </button>
            </div>
          </div>

          {/* Adopter Promise Accordion / Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-surface-container-high shadow-sm space-y-4">
            <h4 className="font-display font-bold text-on-surface text-base flex items-center gap-1.5 border-b pb-3 border-dashed border-on-surface-variant/10">
              <ShieldCheck className="w-5 h-5 text-primary" />
              守護毛孩 ‧ 五大承諾
            </h4>
            <ul className="space-y-3 text-xs text-on-surface-variant font-medium">
              <li className="flex gap-2 items-start">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">1</span>
                <span>終生呵護不離不棄，不隨意棄養或放生</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">2</span>
                <span>提供乾淨飲水、優質適量飲食與安全的居住防護與門窗防護網</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">3</span>
                <span>生病立即就醫，按時完成狂犬病與基本年度疫苗施打</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">4</span>
                <span>以正向、溫和且耐心的態度教育管理，絕不施加暴力</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">5</span>
                <span>積極配合認養中心後續關懷、回訪、不定期近況發送與照片分享</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Major Tab Content Panels (Applications, Favorites, Listed) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: 認養申請紀錄 */}
          <section id="applications-section" className="space-y-4 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-xl text-on-surface flex items-center gap-2">
                <FileText className="w-5.5 h-5.5 text-primary" />
                認養申請紀錄 ({applications.length})
              </h3>
              <span className="text-xs text-on-surface-variant/70 font-bold">送達即時審核</span>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-3xl p-5 border border-surface-container-high shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row gap-5"
                  >
                    {/* Pet thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-slate-100">
                      <img
                        src={app.petImage}
                        alt={app.petName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details and review timeline */}
                    <div className="flex-grow space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-dashed border-on-surface-variant/10 pb-2">
                        <div>
                          <h4 className="font-display font-extrabold text-base text-on-surface flex items-center gap-1.5">
                            {app.petName}
                            <span className="text-xs font-normal text-on-surface-variant block sm:inline">
                              ({app.petBreed})
                            </span>
                          </h4>
                          <span className="text-[10px] text-on-surface-variant/60 block mt-0.5 font-mono">
                            申請案編號：#PHA-{app.id} | 遞交時間：{app.date}
                          </span>
                        </div>
                        <div>{getStatusBadge(app.status)}</div>
                      </div>

                      {/* Application status details flow indicator */}
                      <div className="grid grid-cols-4 items-center gap-1.5 pt-1.5 max-w-md">
                        {/* Step 1 */}
                        <div className="space-y-1 text-center sm:text-left">
                          <div className="h-1.5 rounded-full bg-primary" />
                          <span className="block text-[9px] font-bold text-primary">1 遞交申請</span>
                        </div>
                        {/* Step 2 */}
                        <div className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              app.status !== 'pending' ? 'bg-primary' : 'bg-slate-200'
                            }`}
                          />
                          <span
                            className={`block text-[9px] font-bold ${
                              app.status !== 'pending' ? 'text-primary' : 'text-on-surface-variant/40'
                            }`}
                          >
                            2 家庭審查
                          </span>
                        </div>
                        {/* Step 3 */}
                        <div className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              ['approved', 'completed'].includes(app.status)
                                ? 'bg-primary'
                                : 'bg-slate-200'
                            }`}
                          />
                          <span
                            className={`block text-[9px] font-bold ${
                              ['approved', 'completed'].includes(app.status)
                                ? 'text-primary'
                                : 'text-on-surface-variant/40'
                            }`}
                          >
                            3 志工約談
                          </span>
                        </div>
                        {/* Step 4 */}
                        <div className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              app.status === 'completed' ? 'bg-primary' : 'bg-slate-200'
                            }`}
                          />
                          <span
                            className={`block text-[9px] font-bold ${
                              app.status === 'completed' ? 'text-primary' : 'text-on-surface-variant/40'
                            }`}
                          >
                            4 迎接伴侶
                          </span>
                        </div>
                      </div>

                      {/* Summary of form data info */}
                      <div className="text-[11px] text-on-surface-variant/80 bg-slate-50 rounded-xl p-3 flex flex-wrap gap-x-6 gap-y-1 border border-slate-100">
                        <span>
                          <strong>申請人：</strong>
                          {app.formData?.fullName}
                        </span>
                        <span>
                          <strong>主要電話：</strong>
                          {app.formData?.phone}
                        </span>
                        <span>
                          <strong>通訊地址：</strong>
                          {app.formData?.address}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-surface-container-high text-center">
                <FileText className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
                <p className="text-sm font-semibold text-on-surface-variant">目前尚未正式遞交任何認養契合度申請喔</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">選定您心儀的毛孩、填寫契合投遞書，第一時間與送養志工展開聯繫！</p>
              </div>
            )}
          </section>

          {/* Section 2: 最愛追蹤毛孩 */}
          <section id="favorites-section" className="space-y-4 scroll-mt-24">
            <h3 className="font-display font-extrabold text-xl text-on-surface flex items-center gap-2">
              <Heart className="w-5.5 h-5.5 text-pink-500 fill-current" />
              最愛關注毛孩 ({favoritePets.length})
            </h3>

            {favoritePets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoritePets.map((pet) => (
                  <div
                    key={pet.id}
                    className="group bg-white rounded-2xl border border-surface-container-high overflow-hidden shadow-xs hover:shadow-md transition-all flex h-28"
                  >
                    <div className="relative w-28 h-full bg-slate-100 flex-shrink-0">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded-lg shadow-sm text-[10px] font-bold">
                        {pet.gender === 'Male' ? '男生' : '女生'}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow text-left">
                      <div>
                        <h4 className="font-display font-bold text-sm text-on-surface flex items-center justify-between">
                          <span>{pet.name}</span>
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold">
                            {pet.breed}
                          </span>
                        </h4>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                          年齡：{pet.age} ‧ 地點：{pet.location}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => onSelectPet(pet)}
                          className="text-[11px] font-extrabold text-primary inline-flex items-center gap-0.5 cursor-pointer hover:underline"
                        >
                          見面與諮詢 <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onToggleFavorite(pet.id)}
                          className="w-7 h-7 hover:bg-red-50 text-on-surface-variant hover:text-red-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                          title="取消追蹤"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-surface-container-high text-center">
                <Heart className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
                <p className="text-sm font-semibold text-on-surface-variant">尚未把任何毛孩加入收藏最愛</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">
                  前往認養專區點選愛心圖示，可以將可愛的狗貓收藏在這裡，方便隨時進入查看或預約！
                </p>
              </div>
            )}
          </section>

          {/* Section 3: 我已刊登送養毛孩 */}
          <section id="listed-section" className="space-y-4 scroll-mt-24">
            <h3 className="font-display font-extrabold text-xl text-on-surface flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-amber-500" />
              我刊登的送養 ({myListedPets.length})
            </h3>

            {myListedPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myListedPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="group bg-white rounded-2xl border border-surface-container-high overflow-hidden shadow-xs hover:shadow-md transition-all flex h-28"
                  >
                    <div className="relative w-28 h-full bg-slate-100 flex-shrink-0">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-primary text-on-primary rounded-lg shadow-sm text-[10px] font-bold">
                        刊登中
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow text-left">
                      <div>
                        <h4 className="font-display font-bold text-sm text-on-surface flex items-center justify-between">
                          <span>{pet.name}</span>
                          <span className="text-[10px] bg-primary-container text-on-primary-container px-1.5 py-0.5 rounded-md font-bold">
                            {pet.breed}
                          </span>
                        </h4>
                        <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                          年齡：{pet.age} ‧ 地點：{pet.location}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => onSelectPet(pet)}
                          className="text-[11px] font-extrabold text-primary inline-flex items-center gap-0.5 cursor-pointer hover:underline"
                        >
                          查看預覽詳情 <ExternalLink className="w-3 h-3" />
                        </button>
                        <span className="text-[10px] text-on-surface-variant/50 font-mono">
                          ID: #{pet.id}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-dashed border-surface-container-high text-center">
                <Sparkles className="w-10 h-10 text-on-surface-variant/30 mx-auto mb-3" />
                <p className="text-sm font-semibold text-on-surface-variant font-body">目前沒有您登記的刊登送養</p>
                <p className="text-xs text-on-surface-variant/60 mt-1">
                  如果您家中有需要媒介、送養的伴侶動物，您可以點選正上方的「刊登送養毛孩」按鈕進行登記！
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
}
