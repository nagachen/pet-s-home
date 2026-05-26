import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle, Heart, ShieldCheck } from 'lucide-react';
import { Pet } from '../types';

interface AdoptionModalProps {
  key?: string;
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (formData: any) => void;
}

export function AdoptionModal({ pet, isOpen, onClose, onSuccess }: AdoptionModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    housingType: 'Apartment',
    hasYard: 'No',
    priorExperience: 'No',
    otherAnimals: '',
    reason: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
        setError('請完整填寫所有聯絡資訊欄位。');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.reason.trim()) {
        setError('請大略分享您為什麼希望能認養這隻寵物。');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-surface-container-high z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-container flex items-center justify-between bg-surface bg-pattern/30">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary/80 bg-primary/10 px-3 py-1 rounded-full mb-1 inline-block">
              寵物認養計畫
            </span>
            <h2 className="font-display text-2xl font-bold text-on-surface">
              認養 {pet.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white shadow-sm hover:shadow-md border border-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-surface-container relative">
          <motion.div
            initial={{ width: '33.33%' }}
            animate={{ width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%' }}
            className="absolute left-0 top-0 bottom-0 bg-primary"
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Form Body content - Scrollable wrapper */}
        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-2.5 border border-red-150"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 items-center border border-primary/10">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-on-surface">關於您的聯絡資訊</h3>
                    <p className="font-body text-xs text-on-surface-variant">請填寫基本聯絡資訊，以便送養人員與您聯繫。</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">您的真實姓名 *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="林大同"
                      className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">行動電話 *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0912-345-678"
                        className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">電子信箱 *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourname@gmail.com"
                        className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 font-bold text-stone-700">居住通訊地址 *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="台北市中山區幸福路 77 號"
                      className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">居住房屋類型</label>
                      <select
                        name="housingType"
                        value={formData.housingType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                      >
                        <option value="Apartment">電梯大樓 / 公寓</option>
                        <option value="House">透天厝 / 別墅</option>
                        <option value="Studio">獨立套房</option>
                        <option value="Townhouse">聯排別墅</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">有可活動庭院/大陽台嗎？</label>
                      <select
                        name="hasYard"
                        value={formData.hasYard}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                      >
                        <option value="No">無庭院（一般安全窗台護網）</option>
                        <option value="Yes">有，獨立私人庭院/陽台</option>
                        <option value="Shared">有，社區共用中庭花園</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 items-center border border-primary/10">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-on-surface">契合度評估</h3>
                    <p className="font-body text-xs text-on-surface-variant">請分享您的飼養環境細節，以確保 {pet.name} 擁有優質健康的生活環境。</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">過去養過寵物嗎？</label>
                      <select
                        name="priorExperience"
                        value={formData.priorExperience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                      >
                        <option value="No">我是新手飼主 (第一次養伴侶動物)</option>
                        <option value="Yes - Dog">養過狗狗，熟悉狗狗照顧</option>
                        <option value="Yes - Cat">養過貓咪，熟悉貓咪照顧</option>
                        <option value="Yes - Other">養過兔子或其他小動物</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">目前家中有其他伴侶動物嗎？</label>
                      <input
                        type="text"
                        name="otherAnimals"
                        value={formData.otherAnimals}
                        onChange={handleInputChange}
                        placeholder="例如：目前沒有、一隻 3 歲公貓"
                        className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      您為什麼想認養 {pet.name} 呢？ *
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="請和我們分享您的出發點、平日陪伴規劃與如何照顧 Milo 等生活方式..."
                      className="w-full px-4 py-3 bg-surface/50 border border-surface-container-highest rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-5"
              >
                <div className="w-20 h-20 bg-primary/10 text-primary mx-auto rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10 fill-current" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-on-surface">即將完成認養申請！</h3>
                  <p className="font-body text-sm text-on-surface-variant max-w-sm mx-auto">
                    請再次確認您對 <strong>{pet.name}</strong> 的認養申請摘要，確認無誤後點擊送出。
                  </p>
                </div>

                <div className="bg-surface rounded-2xl p-4 text-left space-y-2 text-sm max-w-sm mx-auto border border-surface-container-highest">
                  <div className="flex justify-between border-b pb-1.5 border-dashed border-on-surface-variant/10">
                    <span className="text-on-surface-variant font-semibold">認養對象：</span>
                    <span className="font-bold text-primary">{pet.name} ({pet.breed})</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-dashed border-on-surface-variant/10">
                    <span className="text-on-surface-variant font-semibold">申請人姓名：</span>
                    <span className="font-bold text-on-surface">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-dashed border-on-surface-variant/10">
                    <span className="text-on-surface-variant font-semibold">聯絡信箱：</span>
                    <span className="font-semibold text-on-surface">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-semibold">居住類型 / 庭院：</span>
                    <span className="font-semibold text-on-surface">
                      {formData.housingType === 'Apartment' ? '電梯大樓/公寓' : formData.housingType === 'House' ? '透天厝/別墅' : formData.housingType === 'Studio' ? '獨立套房' : '聯排住宅'} 
                      ({formData.hasYard === 'Yes' ? '有私人庭院' : formData.hasYard === 'Shared' ? '有共用中庭' : '無獨立庭院'})
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-center text-xs text-on-surface-variant font-semibold bg-surface-container py-2.5 px-4 rounded-xl max-w-xs mx-auto">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>您的隱私資訊均受到高度加密及保護</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button Footer */}
        <div className="p-6 border-t border-surface-container bg-surface flex justify-between gap-3 flex-shrink-0">
          {step > 1 && (
            <button
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
              className="py-3.5 px-6 font-bold text-sm text-on-surface-variant hover:text-on-surface bg-transparent hover:bg-surface-container-highest rounded-xl transition-all cursor-pointer"
            >
              回上一步
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="ml-auto py-3.5 px-6 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary-container transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              繼續下一步
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto py-3.5 px-8 bg-primary text-on-primary font-extrabold text-sm rounded-xl hover:bg-primary-container transition-colors shadow-md cursor-pointer animate-pulse"
            >
              確認送出申請 🥰
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
