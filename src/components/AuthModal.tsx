import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail } from 'lucide-react';

interface AuthModalProps {
  key?: string;
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string, name: string) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const finalName = name || email.split('@')[0];
      onLoginSuccess(email, finalName);
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Dialog container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl z-10 border border-surface-container-high p-6 text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-surface border rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6 space-y-1.5 pt-2">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-on-surface tracking-tight">
            {isRegistering ? '註冊會員帳號' : '歡迎回來'}
          </h2>
          <p className="font-body text-xs text-on-surface-variant">
            登入即可申請認養或刊登可愛的浪浪卡片
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">您的真實姓名/暱稱</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="林大同"
                required
                className="w-full px-4 py-2.5 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">電子信箱 (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              required
              className="w-full px-4 py-2.5 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">登入密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : isRegistering ? (
              '預約註冊並登入'
            ) : (
              '登入寵物之家'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-on-surface-variant pt-4 border-t border-surface-container flex items-center justify-between">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="hover:underline text-primary font-bold bg-transparent border-none cursor-pointer w-full text-center"
          >
            {isRegistering ? '已經有帳號了嗎？立即登入' : '還沒有帳號嗎？免費註冊'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
