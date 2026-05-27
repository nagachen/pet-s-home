import { motion } from 'motion/react';
import type React from 'react';
import { X, MapPin, ShieldCheck, Heart, Ruler, UserRound, HeartHandshake } from 'lucide-react';
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

const sizeLabel = {
  Small: '小型',
  Medium: '中型',
  Large: '大型',
};

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 grid w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative min-h-72 bg-surface-container">
          <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          <button
            type="button"
            onClick={() => onToggleFavorite(pet.id)}
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-on-surface-variant shadow hover:text-red-500"
            aria-label={isFavorite ? '取消收藏' : '加入收藏'}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        <div className="relative max-h-[82vh] overflow-y-auto p-6 text-left">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-surface-container-high bg-white text-on-surface-variant hover:text-on-surface"
            aria-label="關閉"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-10">
            <p className="text-xs font-bold text-primary">{pet.location} 待認養</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-on-surface">{pet.name}</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{pet.breed}</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Info icon={<UserRound className="h-4 w-4" />} label="性別" value={pet.gender === 'Male' ? '男生' : '女生'} />
            <Info icon={<Ruler className="h-4 w-4" />} label="體型" value={sizeLabel[pet.size]} />
            <Info icon={<MapPin className="h-4 w-4" />} label="所在地" value={pet.location} />
            <Info icon={<ShieldCheck className="h-4 w-4" />} label="疫苗" value={pet.vaccinated ? '已完成基礎疫苗' : '安排補打中'} />
          </div>

          <div className="mt-6">
            <h3 className="font-bold text-on-surface">照護筆記</h3>
            <p className="mt-2 text-sm leading-7 text-on-surface-variant">{pet.description}</p>
          </div>

          <div className="mt-5">
            <h3 className="font-bold text-on-surface">個性與需求</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {pet.traits.map((trait) => (
                <span key={trait} className="rounded border border-surface-container-high px-2.5 py-1 text-xs text-on-surface-variant">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-surface-container-high bg-surface p-4 text-sm text-on-surface-variant">
            認養前會先進行基本訪談，確認居住環境、照護時間與家人共識。這裡先做展示流程，正式上線後可接後台審核。
          </div>

          <button
            type="button"
            onClick={onStartAdopt}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-white hover:bg-on-surface transition-colors"
          >
            <HeartHandshake className="h-5 w-5" />
            送出認養諮詢
          </button>
        </div>
      </motion.section>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-surface-container-high bg-white p-3">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[11px] font-bold">{label}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-on-surface">{value}</p>
    </div>
  );
}
