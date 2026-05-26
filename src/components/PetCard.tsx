import { motion } from 'motion/react';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { Pet } from '../types';

interface PetCardProps {
  key?: string;
  pet: Pet;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (pet: Pet) => void;
}

export function PetCard({ pet, isFavorite, onToggleFavorite, onSelect }: PetCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(62,74,60,0.04)] hover:shadow-[0_12px_24px_rgba(0,107,33,0.08)] border border-surface-container-high transition-all duration-300 flex flex-col h-full"
    >
      {/* Pet Image Container */}
      <div className="relative aspect-[16/10] w-full bg-surface-container overflow-hidden group">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Gender Badge */}
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xs text-[9px] font-bold tracking-wide text-on-surface-variant flex items-center gap-1">
          <span className={`w-1 h-1 rounded-full ${pet.gender === 'Male' ? 'bg-secondary' : 'bg-tertiary'}`}></span>
          {pet.gender === 'Male' ? '男生' : '女生'}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pet.id);
          }}
          className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-xs text-on-surface-variant hover:text-red-500 transition-all duration-200 cursor-pointer active:scale-95"
          aria-label={isFavorite ? '從最愛中移除' : '加入我的最愛'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-on-surface-variant hover:scale-105'
            }`}
          />
        </button>

        {/* Size tag */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary-container/95 text-on-primary-container text-[9px] font-bold rounded-md shadow-xs">
          {pet.size === 'Small' ? '小型' : pet.size === 'Medium' ? '中型' : '大型'}
        </div>
      </div>

      {/* Pet Info Content */}
      <div className="p-3 flex flex-col flex-grow justify-between text-left">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-base font-bold text-on-surface hover:text-primary transition-colors cursor-pointer truncate max-w-[110px]" onClick={() => onSelect(pet)}>
              {pet.name}
            </h3>
            <span className="text-[9px] font-bold bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded">
              {pet.age}
            </span>
          </div>
          <p className="font-body text-[11px] text-on-surface-variant mb-1.5 truncate">{pet.breed}</p>
        </div>

        <div>
          {/* Location / Vaccinated and traits */}
          <div className="flex items-center gap-1 text-[11px] text-on-surface-variant mb-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px]">{pet.location}</span>
            {pet.vaccinated && (
              <span className="ml-auto flex items-center gap-0.5 text-[8px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-1 py-0.5 rounded-full">
                <Sparkles className="w-2 h-2" />
                已打疫苗
              </span>
            )}
          </div>

          <button
            onClick={() => onSelect(pet)}
            className="w-full py-2 bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-bold text-[11px] rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
          >
            見見 {pet.name}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
