
import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  title?: string;
  language: Language;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, clientName, title, language }) => {
  const t = translations[language].modals.delete;

  if (!isOpen) return null;

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

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
            <AlertTriangle size={24} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title || t.title}</h3>
          <p className="text-slate-400 text-sm mb-6">
            {t.msg} <strong className="text-white">{clientName}</strong>{t.msg2}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              {t.confirm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
