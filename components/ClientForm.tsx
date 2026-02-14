
import React, { useState, useEffect, useRef } from 'react';
import { Client, ClientStatus, Language } from '../types';
import { X, Save, DollarSign, Upload, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { translations } from '../translations';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  initialData?: Client | null;
  initialDate?: string | null;
  planTemplates?: string[];
  onUpdateTemplates?: (templates: string[]) => void;
  language: Language;
}

const ClientForm: React.FC<ClientFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  initialDate,
  planTemplates = ['Teste de 3 horas', 'Mensal', 'Trimestral', 'Semestral', 'Anual'],
  onUpdateTemplates,
  language
}) => {
  const t = translations[language].modals.client;
  const statusT = translations[language].clients.status;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    plan: '',
    price: 0,
    appImage: '',
    status: ClientStatus.Active,
    expirationDate: '',
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
          setFormData({
            ...initialData,
            expirationDate: initialData.expirationDate.split('T')[0]
          });
        } else {
          // Data padrão: hoje ou data selecionada no calendário
          const defaultDate = initialDate || new Date().toLocaleDateString('en-CA');
          setFormData({
            name: '',
            email: '',
            phone: '',
            plan: '',
            price: 35,
            appImage: '',
            status: ClientStatus.Active,
            expirationDate: defaultDate,
          });
        }
    }
  }, [initialData, isOpen, initialDate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, appImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, appImage: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTemplate = () => {
    if (formData.plan && !planTemplates.includes(formData.plan) && onUpdateTemplates) {
      onUpdateTemplates([...planTemplates, formData.plan]);
    }
  };

  const handleDeleteTemplate = (templateToDelete: string) => {
    if (onUpdateTemplates) {
      onUpdateTemplates(planTemplates.filter(t => t !== templateToDelete));
    }
  };

  const handleTemplateSelect = (template: string) => {
    const lowerName = template.toLowerCase();
    
    // Pegamos a data atual do formulário ou hoje
    const baseDateStr = formData.expirationDate || new Date().toLocaleDateString('en-CA');
    // Forçamos 12:00 para cálculos de soma de dias
    const baseDate = new Date(baseDateStr + 'T12:00:00');

    let daysToAdd = 0;
    if (lowerName.includes('mensal')) daysToAdd = 30;
    else if (lowerName.includes('trimestral')) daysToAdd = 90;
    else if (lowerName.includes('semestral')) daysToAdd = 180;
    else if (lowerName.includes('anual')) daysToAdd = 365;

    baseDate.setDate(baseDate.getDate() + daysToAdd);
    const newDateStr = baseDate.toLocaleDateString('en-CA');

    setFormData(prev => ({
      ...prev,
      plan: template,
      expirationDate: newDateStr,
      ...(lowerName.includes('teste') ? { price: 0, status: ClientStatus.Trial } : {})
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // CRITICAL: Adicionar T12:00:00 para que o ISO String represente o dia correto no split
    const safeDate = new Date(formData.expirationDate + 'T12:00:00');

    onSave({
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name,
      email: formData.email || '',
      phone: formData.phone,
      plan: formData.plan || 'Plano Personalizado',
      price: Number(formData.price) || 0,
      appImage: formData.appImage,
      status: formData.status as ClientStatus,
      expirationDate: safeDate.toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">
          {initialData ? t.editTitle : t.newTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group">
              {formData.appImage ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-lg">
                  <img src={formData.appImage} alt="App Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={removeImage}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-brand-500 hover:text-brand-500 transition-colors bg-slate-900/50"
                >
                  <ImageIcon size={24} className="mb-1" />
                  <span className="text-[10px] uppercase font-bold">{t.appPhoto}</span>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{t.tapToAdd}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.name}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">{t.whatsapp}</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-300 mb-1">{t.planName}</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.plan}
                  onChange={e => setFormData({...formData, plan: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none pr-8"
                  placeholder="Ex: Mensal Premium"
                />
                {formData.plan && !planTemplates.includes(formData.plan) && (
                   <button 
                    type="button"
                    onClick={handleAddTemplate}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-300 p-1"
                    title="Salvar como modelo"
                   >
                     <Plus size={16} />
                   </button>
                )}
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-1">{t.value}</label>
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                   <DollarSign size={16} />
                 </div>
                 <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="0,00"
                />
               </div>
            </div>
          </div>

          {planTemplates.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-slate-500 mb-2">{t.suggestions}</p>
              <div className="flex flex-wrap gap-2">
                {planTemplates.map((template) => (
                  <div key={template} className="group flex items-center bg-slate-700 hover:bg-slate-600 rounded-md overflow-hidden border border-slate-600 transition-colors">
                     <button
                        type="button"
                        onClick={() => handleTemplateSelect(template)}
                        className="px-3 py-1.5 text-xs text-slate-200 font-medium"
                      >
                        {template}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template); }}
                        className="pr-2 pl-1 py-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remover modelo"
                      >
                        <X size={12} />
                      </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">{t.status}</label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as ClientStatus})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value={ClientStatus.Active}>{statusT.active}</option>
                <option value={ClientStatus.Expired}>{statusT.expired}</option>
                <option value={ClientStatus.Trial}>{statusT.trial}</option>
              </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">{t.dueDate}</label>
                <input
                type="date"
                required
                value={formData.expirationDate}
                onChange={e => setFormData({...formData, expirationDate: e.target.value})}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
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

export default ClientForm;
