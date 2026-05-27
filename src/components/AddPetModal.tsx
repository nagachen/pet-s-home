import { useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Pet } from '../types';

interface AddPetModalProps {
  key?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Omit<Pet, 'id'>) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
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
    traitsString: '親人, 需陪伴, 適合公寓',
    vaccinated: true,
    location: '台北市',
  });

  if (!isOpen) return null;

  const update = (name: string, value: string | boolean) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.breed || !formData.age || !formData.location) {
      alert('請先填寫名字、品種、年齡與所在地。');
      return;
    }
    const traits = formData.traitsString.split(',').map((trait) => trait.trim()).filter(Boolean);
    onAddPet({
      ...formData,
      traits: traits.length ? traits : ['待補充'],
      description: formData.description || `${formData.name} 正在尋找穩定的新家，建議先安排訪談了解照護需求。`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/55" />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 text-left shadow-2xl"
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant hover:bg-surface">
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs font-bold text-primary">新增送養資料</p>
        <h2 className="mt-1 font-display text-2xl font-bold">先建立一筆展示資料</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="名字" value={formData.name} onChange={(value) => update('name', value)} />
          <Field label="品種" value={formData.breed} onChange={(value) => update('breed', value)} />
          <Field label="年齡" value={formData.age} onChange={(value) => update('age', value)} placeholder="例如：2 歲" />
          <Field label="所在地" value={formData.location} onChange={(value) => update('location', value)} />
          <Select label="物種" value={formData.species} onChange={(value) => update('species', value)} options={[['dog', '狗狗'], ['cat', '貓咪']]} />
          <Select label="性別" value={formData.gender} onChange={(value) => update('gender', value)} options={[['Male', '男生'], ['Female', '女生']]} />
          <Select label="體型" value={formData.size} onChange={(value) => update('size', value)} options={[['Small', '小型'], ['Medium', '中型'], ['Large', '大型']]} />
          <Select label="照片" value={formData.image} onChange={(value) => update('image', value)} options={PRESET_IMAGES.map((image, index) => [image, `示範照片 ${index + 1}`])} />
        </div>

        <label className="mt-4 block text-sm font-bold">
          個性標籤
          <input value={formData.traitsString} onChange={(event) => update('traitsString', event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={formData.vaccinated} onChange={(event) => update('vaccinated', event.target.checked)} />
          已完成基礎疫苗
        </label>
        <label className="mt-4 block text-sm font-bold">
          照護筆記
          <textarea value={formData.description} onChange={(event) => update('description', event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-surface-container-high p-3 font-normal outline-none focus:border-primary" />
        </label>

        <button type="submit" className="mt-5 h-11 w-full rounded-md bg-primary text-sm font-bold text-white hover:bg-on-surface">
          新增到名單
        </button>
      </motion.form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: any) => void; options: string[][] }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary">
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}
