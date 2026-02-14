
import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPassword: string) => void;
  language: Language;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSave, language }) => {
  const t = translations[language].modals.password;
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError(t.errorLen);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.errorMatch);
      return;
    }

    // In a real app, we would validate currentPassword with backend here
    onSave(newPassword);
    onClose();
    // Reset fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-sm p-6 relative z-10 animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-brand-500/20 rounded-lg">
            <Lock className="text-brand-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">{t.title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.current}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.new}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.confirm}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
