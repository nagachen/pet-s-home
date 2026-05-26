import { motion } from 'motion/react';
import { X, MapPin, Bone, ShieldCheck, Heart, Sparkles, HeartHandshake, Baby } from 'lucide-react';
import { Pet } from '../types';

interface PetDetailDrawerProps {
  key?: string;
  pet: Pet;
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onStartAdopt: () => void;
}

export function PetDetailDrawer({
  pet,
  isOpen,
  isFavorite,
  onClose,
  onToggleFavorite,
  onStartAdopt,
}: PetDetailDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Main Details Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative bg-white w-full max-w-[34rem] rounded-2xl overflow-hidden shadow-2xl bg-pattern border border-surface-container-high z-10 max-h-[90vh] flex flex-col sm:flex-row"
      >
        {/* Left/Top Part: Gorgeous Image */}
        <div className="relative w-full sm:w-[38%] h-48 sm:h-auto bg-surface-container overflow-hidden flex-shrink-0">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Heart button overlay */}
          <button
            onClick={() => onToggleFavorite(pet.id)}
            className="absolute top-3 left-3 z-20 w-8.5 h-8.5 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-md text-on-surface hover:text-red-500 transition-colors cursor-pointer active:scale-90"
          >
            <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-on-surface-variant'}`} />
          </button>

          {/* Species Badge */}
          <span className="absolute bottom-3 left-3 z-20 bg-primary/95 text-on-primary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            {pet.species === 'dog' ? '狗狗' : '貓咪'} 資訊
          </span>
        </div>

        {/* Right/Bottom Part: Details Content */}
        <div className="p-4 sm:p-5 w-full sm:w-[62%] flex flex-col justify-between overflow-y-auto max-h-[50vh] sm:max-h-[95vh]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8.5 h-8.5 bg-white/90 hover:bg-white border shadow-xs hover:shadow rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-4 text-left">
            <div>
              <div className="flex items-end justify-between gap-1.5">
                <h2 className="font-display text-2xl font-extrabold text-on-surface tracking-tight">
                  {pet.name}
                </h2>
                <span className="text-[10px] font-bold bg-primary-container text-on-primary-container px-2 py-1 rounded-lg shadow-xs mb-0.5">
                  {pet.age}
                </span>
              </div>
              <p className="font-body text-xs text-on-surface-variant font-semibold mt-0.5">
                {pet.breed}
              </p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface border border-surface-container-high rounded-xl p-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <Bone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-bold text-on-surface-variant">性別</span>
                  <span className="text-xs font-bold text-on-surface">{pet.gender === 'Male' ? '男生' : '女生'}</span>
                </div>
              </div>

              <div className="bg-surface border border-surface-container-high rounded-xl p-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-bold text-on-surface-variant">體型</span>
                  <span className="text-xs font-bold text-on-surface">{pet.size === 'Small' ? '小型' : pet.size === 'Medium' ? '中型' : '大型'}</span>
                </div>
              </div>

              <div className="bg-surface border border-surface-container-high rounded-xl p-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-bold text-on-surface-variant">健康</span>
                  <span className="text-xs font-bold text-on-surface">{pet.vaccinated ? '已打疫苗' : '基本檢查'}</span>
                </div>
              </div>

              <div className="bg-surface border border-surface-container-high rounded-xl p-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-bold text-on-surface-variant">縣市</span>
                  <span className="text-xs font-bold text-on-surface truncate max-w-[70px]">{pet.location}</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <h4 className="font-display font-bold text-on-surface text-[10px] uppercase tracking-wider">溫馨故事</h4>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {pet.description}
              </p>
            </div>

            {/* Traits chips */}
            <div className="space-y-1">
              <h4 className="font-display font-bold text-on-surface text-[10px] uppercase tracking-wider">個性特質</h4>
              <div className="flex flex-wrap gap-1">
                {pet.traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-surface-container-highest text-on-surface px-2.5 py-1 rounded-full flex items-center gap-0.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container">
            <button
              onClick={onStartAdopt}
              className="w-full h-11 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-body text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              立刻申請認養 {pet.name}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
