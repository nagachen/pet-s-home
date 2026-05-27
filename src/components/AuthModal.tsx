import { useState } from 'react';
import type React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface AuthModalProps {
  key?: string;
  isOpen: boolean;
  isConfigured: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, name: string) => Promise<void>;
}

export function AuthModal({ isOpen, isConfigured, onClose, onSignIn, onSignUp }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (!isConfigured) {
      setErrorMessage('請先設定 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。');
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('請輸入 Email 與密碼。');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('請輸入姓名。');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signin') {
        await onSignIn(email.trim(), password);
      } else {
        await onSignUp(email.trim(), password, name.trim());
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '登入處理失敗，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignIn = mode === 'signin';

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

        <p className="text-xs font-bold text-primary">會員帳號</p>
        <h2 className="mt-1 font-display text-2xl font-bold">{isSignIn ? '登入 Pet’s Home' : '建立會員帳號'}</h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          使用 Supabase Auth 保留你的收藏、送養刊登與認養申請紀錄。
        </p>

        {!isConfigured && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-800">
            Supabase 尚未設定。請在環境變數加入 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 rounded-md bg-surface p-1 text-sm font-bold">
          <button type="button" onClick={() => setMode('signin')} className={`h-9 rounded-md ${isSignIn ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant'}`}>
            登入
          </button>
          <button type="button" onClick={() => setMode('signup')} className={`h-9 rounded-md ${!isSignIn ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant'}`}>
            註冊
          </button>
        </div>

        {!isSignIn && (
          <label className="mt-5 block text-sm font-bold">
            姓名
            <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" placeholder="你的名字" />
          </label>
        )}
        <label className={isSignIn ? 'mt-5 block text-sm font-bold' : 'mt-4 block text-sm font-bold'}>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" placeholder="name@example.com" type="email" autoComplete="email" />
        </label>
        <label className="mt-4 block text-sm font-bold">
          密碼
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-surface-container-high px-3 font-normal outline-none focus:border-primary" placeholder="至少 6 個字元" type="password" autoComplete={isSignIn ? 'current-password' : 'new-password'} />
        </label>

        {errorMessage && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="mt-5 h-11 w-full rounded-md bg-primary text-sm font-bold text-white hover:bg-on-surface disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? '處理中...' : isSignIn ? '登入' : '註冊'}
        </button>
      </motion.form>
    </div>
  );
}
