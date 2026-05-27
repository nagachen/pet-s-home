import { useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface AuthModalProps {
  key?: string;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, name: string) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    onLoginSuccess(email.trim(), name.trim() || '訪客會員');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/55" />
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 text-left shadow-2xl"
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant hover:bg-surface">
          <X className="h-4 w-4" />
        </button>
        <p className="text-xs font-bold text-primary">會員登入</p>
        <h2 className="mt-1 font-display text-2xl font-bold">先用示範帳號進入</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">目前是前端展示版，不會真的建立帳號。正式版本可接 Firebase 或 Supabase 登入。</p>

        <label className="mt-5 block text-sm font-bold">
          名稱
          <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" placeholder="例如：陳小姐" />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" placeholder="name@example.com" type="email" />
        </label>

        <button type="submit" className="mt-5 h-11 w-full rounded-md bg-primary text-sm font-bold text-white hover:bg-on-surface">
          進入會員區
        </button>
      </motion.form>
    </div>
  );
}
