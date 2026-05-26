import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { Pet } from '../types';

interface AddPetModalProps {
  key?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Omit<Pet, 'id'>) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', // pup
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80', // kitty
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80'  // dogs
];

export function AddPetModal({ isOpen, onClose, onAddPet }: AddPetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat',
    breed: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    size: 'Medium' as 'Small' | 'Medium' | 'Large',
    image: PRESET_IMAGES[0],
    description: '',
    traitsString: '親人友善, 聰明伶俐, 活潑好動',
    vaccinated: true,
    location: '台北市',
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.age || !formData.location) {
      alert('請填寫所有必填欄位。');
      return;
    }

    const traits = formData.traitsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddPet({
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: formData.age,
      gender: formData.gender,
      size: formData.size,
      image: formData.image,
      description: formData.description || `見見 ${formData.name}，一隻可愛的 ${formData.breed}，正在等待溫暖友善的家庭認養中。`,
      traits: traits.length > 0 ? traits : ['乖巧可愛', '親切黏人'],
      vaccinated: formData.vaccinated,
      location: formData.location,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-surface-container flex items-center justify-between bg-surface bg-pattern/30">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary/85 bg-primary/10 px-3 py-1 rounded-full mb-1 inline-block">
              送養登記表
            </span>
            <h2 className="font-display text-2xl font-bold text-on-surface">
              刊登送養寵物卡片
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white shadow-sm border border-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-4 text-left">
          {/* Preset Image Selector */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              選擇特寫照片
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData((prev) => ({ ...prev, image: img }))}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    formData.image === img ? 'border-primary ring-2 ring-primary/20 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preset pet image" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Custom image URL input */}
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="或者，您也可以貼上自訂的相片網址連結..."
              className="w-full px-3.5 py-2 text-xs bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                寵物名字 *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="例如：Mimi"
                className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                寵物種類 *
              </label>
              <select
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="dog">狗 / 幼犬 (Dog)</option>
                <option value="cat">貓 / 幼貓 (Cat)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                品種 *
              </label>
              <input
                type="text"
                name="breed"
                required
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="例如：米克斯、黃金獵犬"
                className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                年齡 *
              </label>
              <input
                type="text"
                name="age"
                required
                value={formData.age}
                onChange={handleInputChange}
                placeholder="例如：3 個月、2 歲"
                className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                性別
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Male">男生</option>
                <option value="Female">女生</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                體型
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Small">小型</option>
                <option value="Medium">中型</option>
                <option value="Large">大型</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                送養地點 *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                placeholder="例如：台北市、台中市"
                className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              個性特質標籤 (各標籤用逗號隔開)
            </label>
            <input
              type="text"
              name="traitsString"
              value={formData.traitsString}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              溫馨故事或背景簡介描述
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="請寫下任何您希望認養人知道的，關於這隻寵物特別好玩、感人、或是日常生活的習慣..."
              className="w-full px-4 py-2.5 text-sm bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="vaccinated"
              name="vaccinated"
              checked={formData.vaccinated}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded border-surface-container-highest text-primary focus:ring-primary focus:ring-opacity-20 cursor-pointer"
            />
            <label htmlFor="vaccinated" className="text-sm font-semibold text-on-surface cursor-pointer select-none">
              此寵物已施打必備基本預防疫苗，並完成基礎健康狀況檢查
            </label>
          </div>

          <div className="pt-4 border-t border-surface-container flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 font-bold text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-all cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> 刊登送養卡片
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
