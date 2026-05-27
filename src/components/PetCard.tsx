import { motion } from 'motion/react';
import { Heart, MapPin, ShieldCheck } from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  key?: string;
  pet: Pet;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (pet: Pet) => void;
}

const sizeLabel = {
  Small: '小型',
  Medium: '中型',
  Large: '大型',
};

export function PetCard({ pet, isFavorite, onToggleFavorite, onSelect }: PetCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="group bg-white border border-surface-container-high rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
    >
      <button
        type="button"
        onClick={() => onSelect(pet)}
        className="relative aspect-[4/3] w-full bg-surface-container overflow-hidden text-left cursor-pointer"
      >
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <span className="absolute left-3 top-3 rounded bg-white/95 px-2 py-1 text-[11px] font-bold text-on-surface shadow-sm">
          {pet.species === 'dog' ? '狗狗' : '貓咪'}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(pet.id);
          }}
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/95 text-on-surface-variant shadow-sm hover:text-red-500 flex items-center justify-center"
          aria-label={isFavorite ? '取消收藏' : '加入收藏'}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </button>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface leading-tight">{pet.name}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{pet.breed}</p>
            </div>
            <span className="shrink-0 rounded bg-surface-container px-2 py-1 text-xs font-bold text-on-surface-variant">
              {pet.age}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {pet.traits.slice(0, 3).map((trait) => (
            <span key={trait} className="rounded border border-surface-container-high px-2 py-1 text-[11px] text-on-surface-variant">
              {trait}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-2 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>{pet.location}</span>
            <span className="ml-auto">{sizeLabel[pet.size]}</span>
          </div>
          {pet.vaccinated && (
            <div className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>已完成基礎疫苗</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(pet)}
          className="mt-1 h-10 rounded-md bg-on-surface text-white text-sm font-bold hover:bg-primary transition-colors"
        >
          查看認養資訊
        </button>
      </div>
    </motion.article>
  );
}
