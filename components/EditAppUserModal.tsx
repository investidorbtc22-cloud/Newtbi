
import React, { useState, useEffect } from 'react';
import { AppUser, Language } from '../types';
import { X, Save, Calendar, User, Mail, Lock, Smartphone } from 'lucide-react';
import { translations } from '../translations';

interface EditAppUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: AppUser) => void;
  userToEdit: AppUser | null;
  language: Language;
}

const EditAppUserModal: React.FC<EditAppUserModalProps> = ({ isOpen, onClose, onSave, userToEdit, language }) => {
  const t = translations[language].modals.reseller;
  
  const [formData, setFormData] = useState<Partial<AppUser>>({});

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        ...userToEdit,
        subscriptionEnd: userToEdit.subscriptionEnd.split('T')[0] // Format for date input
      });
    }
  }, [userToEdit, isOpen]);

  if (!isOpen || !userToEdit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
        // Construct the full object
        const updated: AppUser = {
            id: formData.id,
            name: formData.name || '',
            email: formData.email || '',
            password: formData.password || '',
            phone: formData.phone || '',
            status: new Date(formData.subscriptionEnd!) > new Date() ? 'active' : 'expired',
            subscriptionEnd: new Date(formData.subscriptionEnd!).toISOString()
        };
        onSave(updated);
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md p-6 relative z-10 animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <User className="text-brand-400" />
          {t.title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.name}</label>
            <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.email}</label>
            <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.password}</label>
            <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                type="text"
                value={formData.password || ''}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.whatsapp}</label>
            <div className="relative">
                <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.subscriptionEnd}</label>
            <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                type="date"
                value={formData.subscriptionEnd || ''}
                onChange={(e) => setFormData({...formData, subscriptionEnd: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
            <p className="text-xs text-slate-500 mt-1">
                {t.note}
            </p>
          </div>

          <div className="pt-4 flex gap-3">
             <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 rounded-lg transition-all"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppUserModal;
