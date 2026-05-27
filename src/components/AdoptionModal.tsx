import { useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Pet } from '../types';

interface AdoptionModalProps {
  key?: string;
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (formData: any) => void;
}

export function AdoptionModal({ pet, isOpen, onClose, onSuccess }: AdoptionModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    housingType: '公寓',
    reason: '',
  });

  if (!isOpen) return null;

  const update = (name: string, value: string) => setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
      alert('請先填寫姓名、電話、Email 與居住地區。');
      return;
    }
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/55" />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 text-left shadow-2xl"
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant hover:bg-surface">
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs font-bold text-primary">認養諮詢</p>
        <h2 className="mt-1 font-display text-2xl font-bold">想進一步認識 {pet.name}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          這份表單目前只在前端示範。正式上線後會送到後台，讓管理者追蹤審核狀態。
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="姓名" value={formData.fullName} onChange={(value) => update('fullName', value)} />
          <Field label="電話" value={formData.phone} onChange={(value) => update('phone', value)} />
          <Field label="Email" value={formData.email} onChange={(value) => update('email', value)} type="email" />
          <Field label="居住地區" value={formData.address} onChange={(value) => update('address', value)} placeholder="例如：台北市大安區" />
        </div>

        <label className="mt-4 block text-sm font-bold">
          居住型態
          <select value={formData.housingType} onChange={(event) => update('housingType', event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary">
            <option>公寓</option>
            <option>透天</option>
            <option>有庭院住宅</option>
            <option>其他</option>
          </select>
        </label>

        <label className="mt-4 block text-sm font-bold">
          為什麼想認養 {pet.name}？
          <textarea value={formData.reason} onChange={(event) => update('reason', event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-surface-container-high p-3 font-normal outline-none focus:border-primary" />
        </label>

        <button type="submit" className="mt-5 h-11 w-full rounded-md bg-primary text-sm font-bold text-white hover:bg-on-surface">
          送出諮詢
        </button>
      </motion.form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary"
      />
    </label>
  );
}
