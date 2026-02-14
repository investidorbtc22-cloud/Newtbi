
import React, { useState, useEffect, useRef } from 'react';
import { Client, Language } from '../types';
import { X, Copy, Send, FileText, Image, Video, Mic, Edit3, Save, Upload, Trash2, Plus, PlayCircle, Music } from 'lucide-react';
import { translations } from '../translations';

interface AiModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  language: Language;
}

type MediaType = 'text' | 'image' | 'video' | 'audio';

interface Template {
  id: string;
  name: string;
  content: string;
  type: MediaType;
  mediaUrl?: string; // Base64 string for the media file
}

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Cobrança Padrão',
    type: 'text',
    content: 'Olá *{nome}*! 😃\n\nPassando para lembrar que seu plano *{plano}* vence dia *{vencimento}*.\nValor: *{valor}*.\n\nPodemos renovar? Segue o PIX para garantir seu acesso! 👇'
  },
  {
    id: '2',
    name: 'Boas-vindas',
    type: 'text',
    content: 'Seja bem-vindo(a) *{nome}*! 🚀\n\nSeu plano *{plano}* já está ativo.\nQualquer dúvida sobre a instalação, estou à disposição!\n\nBom divertimento! 🍿'
  },
  {
    id: '3',
    name: 'Promoção Renovação',
    type: 'image',
    content: '🔥 *OFERTA ESPECIAL PARA VOCÊ, {nome}!* 🔥\n\nRenove seu plano *{plano}* hoy y gana días extras!\n\nNo pierda esa oportunidad. Responda "YO QUIERO"!'
  },
  {
    id: '4',
    name: 'Aviso de Corte',
    type: 'text',
    content: 'Olá *{nome}*.\n\nConsta em nosso sistema que seu plano *{plano}* venceu em *{vencimento}*.\n\nEvite o corte do sinal regularizando agora mesmo. ⚠️'
  }
];

const AiModal: React.FC<AiModalProps> = ({ isOpen, onClose, client, language }) => {
  const t = translations[language].modals.ai;

  // State for the list of templates
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);
  
  // State for Editing Mode
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State (Temporary data while editing)
  const [formData, setFormData] = useState<Template>(DEFAULT_TEMPLATES[0]);

  // Display State (Parsed message for sending)
  const [previewMessage, setPreviewMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when template selection changes
  useEffect(() => {
    const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
    setFormData(currentTemplate);
    setIsEditing(false); // Reset editing mode when switching templates
  }, [selectedTemplateId, templates]);

  // Update preview text when client or template changes
  useEffect(() => {
    if (client && formData) {
      let text = formData.content;
      
      // Formatting helpers (Locale aware)
      const locale = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';
      const firstName = client.name.split(' ')[0];
      const priceFormatted = client.price ? client.price.toLocaleString(locale, { style: 'currency', currency: 'BRL' }) : (language === 'en' ? 'R$ 0.00' : 'R$ 0,00');
      const dateFormatted = new Date(client.expirationDate).toLocaleDateString(locale);
      
      // Variable replacement
      text = text.replace(/{nome}/g, firstName);
      text = text.replace(/{plano}/g, client.plan);
      text = text.replace(/{valor}/g, priceFormatted);
      text = text.replace(/{vencimento}/g, dateFormatted);
      
      setPreviewMessage(text);
    }
  }, [formData, client, language]);

  if (!isOpen || !client) return null;

  // --- Handlers ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, mediaUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setFormData(prev => ({ ...prev, mediaUrl: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveTemplate = () => {
    setTemplates(prev => prev.map(t => t.id === formData.id ? formData : t));
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name: t.newTemplate,
      type: 'text',
      content: 'Olá {nome}...'
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newTemplate.id);
    setIsEditing(true); // Auto enter edit mode
  };

  const handleDeleteTemplate = (id: string) => {
    if (templates.length <= 1) return; // Prevent deleting last template
    const newList = templates.filter(t => t.id !== id);
    setTemplates(newList);
    setSelectedTemplateId(newList[0].id);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(previewMessage);
    alert('Mensagem copiada!');
  };

  const openWhatsApp = () => {
    const encodedText = encodeURIComponent(previewMessage);
    const cleanPhone = client.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-4xl flex flex-col md:flex-row relative z-10 animate-fade-in overflow-hidden max-h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-slate-400 hover:text-white transition-colors p-2 z-20"
        >
          <X size={24} />
        </button>

        {/* Sidebar: Templates List */}
        <div className="w-full md:w-1/3 bg-slate-900/50 border-r border-slate-700 p-4 flex flex-col h-[200px] md:h-auto overflow-hidden">
          <div className="flex justify-between items-center mb-4 px-1 shrink-0">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t.templates}</h3>
            <button 
              onClick={handleCreateNew}
              className="text-brand-400 hover:text-white p-1 transition-colors"
              title={t.newTemplate}
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
            {templates.map(template => (
              <div key={template.id} className="flex items-center gap-1 group">
                <button
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`flex-1 text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                    selectedTemplateId === template.id 
                      ? 'bg-brand-600/20 border-brand-500 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-full ${selectedTemplateId === template.id ? 'bg-brand-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                    {template.type === 'image' ? <Image size={14} /> : 
                     template.type === 'video' ? <Video size={14} /> :
                     template.type === 'audio' ? <Mic size={14} /> :
                     <FileText size={14} />}
                  </div>
                  <span className="text-sm font-medium truncate">{template.name}</span>
                </button>
                {/* Delete Button (Only visible on hover/active) */}
                {templates.length > 1 && (
                  <button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {/* Added h-full and overflow-hidden here to constrain the flex container to the modal height */}
        <div className="w-full md:w-2/3 p-6 flex flex-col bg-slate-800 h-full overflow-hidden">
          
          {/* Header Area */}
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div>
               {isEditing ? (
                 <input 
                   type="text" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-lg font-bold text-white focus:ring-2 focus:ring-brand-500 outline-none w-full"
                   placeholder={t.newTemplate}
                 />
               ) : (
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   {formData.name}
                   <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-brand-400 transition-colors">
                     <Edit3 size={16} />
                   </button>
                 </h2>
               )}
               <p className="text-slate-400 text-sm mt-1">{t.to} {client.name}</p>
            </div>
            
            {isEditing && (
              <button 
                onClick={handleSaveTemplate}
                className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-sm"
              >
                <Save size={16} /> {t.save}
              </button>
            )}
          </div>

          {/* Type Selector (Editing Mode) */}
          {isEditing && (
            <div className="flex gap-2 mb-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700 shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center mr-2">{t.type}</span>
              {(['text', 'image', 'video', 'audio'] as const).map((type) => (
                 <button
                  key={type}
                  onClick={() => setFormData({...formData, type})}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-2 border transition-colors ${
                    formData.type === type
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-transparent border-slate-700 text-slate-500 hover:bg-slate-800'
                  }`}
                 >
                   {type === 'text' && <FileText size={12} />}
                   {type === 'image' && <Image size={12} />}
                   {type === 'video' && <Video size={12} />}
                   {type === 'audio' && <Mic size={12} />}
                   {t.types[type]}
                 </button>
              ))}
            </div>
          )}

          {/* Content Editor / Preview */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar min-h-0">
            
            {/* Media Upload / Preview Area */}
            {formData.type !== 'text' && (
               <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex flex-col items-center justify-center min-h-[150px] relative group shrink-0">
                  
                  {formData.mediaUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                       {formData.type === 'image' && (
                         <img src={formData.mediaUrl} alt="Preview" className="max-h-[200px] rounded object-contain" />
                       )}
                       {formData.type === 'video' && (
                         <video src={formData.mediaUrl} controls className="max-h-[200px] rounded" />
                       )}
                       {formData.type === 'audio' && (
                         <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-full border border-slate-600">
                           <PlayCircle size={32} className="text-brand-400" />
                           <div className="flex-1 h-1 w-32 bg-slate-600 rounded"></div>
                           <audio src={formData.mediaUrl} controls className="hidden" /> {/* Hidden native control, visual placeholder */}
                           <span className="text-xs text-slate-400">{t.mediaAttached}</span>
                         </div>
                       )}

                       {/* Remove Media Button (Edit Mode) */}
                       {isEditing && (
                         <button 
                           onClick={removeMedia}
                           className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-500 transition-colors"
                           title="Remover"
                         >
                           <Trash2 size={16} />
                         </button>
                       )}
                    </div>
                  ) : (
                    // Empty State / Upload Prompt
                    <div 
                      onClick={() => isEditing && fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center text-slate-500 ${isEditing ? 'cursor-pointer hover:text-brand-400' : ''}`}
                    >
                       {isEditing ? (
                         <>
                           <Upload size={32} className="mb-2" />
                           <p className="text-sm font-medium">{t.clickToAdd} {t.types[formData.type]}</p>
                           <p className="text-xs opacity-70">{t.save}</p>
                         </>
                       ) : (
                         <>
                           <div className="p-3 bg-slate-800 rounded-full mb-2">
                              {formData.type === 'image' ? <Image size={24} /> : formData.type === 'video' ? <Video size={24} /> : <Music size={24} />}
                           </div>
                           <p className="text-sm">Nenhuma mídia anexada.</p>
                         </>
                       )}
                    </div>
                  )}

                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept={formData.type === 'image' ? 'image/*' : formData.type === 'video' ? 'video/*' : 'audio/*'}
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={!isEditing}
                  />
               </div>
            )}

            {/* Text Area */}
            <div className="flex-1 flex flex-col min-h-[150px]">
              <div className="flex justify-between items-center mb-1 px-1 shrink-0">
                 <label className="text-xs font-bold text-slate-400 uppercase">{t.types.text}</label>
                 {isEditing && <span className="text-[10px] text-brand-400 bg-brand-400/10 px-2 py-0.5 rounded">{t.variables}</span>}
              </div>
              
              <textarea 
                value={isEditing ? formData.content : previewMessage}
                onChange={(e) => isEditing && setFormData({...formData, content: e.target.value})}
                readOnly={!isEditing}
                className={`w-full flex-1 rounded-lg p-4 border resize-none font-sans text-sm leading-relaxed outline-none transition-colors ${
                  isEditing 
                    ? 'bg-slate-900 border-brand-500/50 text-white focus:ring-1 focus:ring-brand-500' 
                    : 'bg-slate-900/50 border-slate-700 text-slate-300'
                }`}
                placeholder={t.placeholder}
              />
              
              {isEditing && (
                 <p className="text-xs text-slate-500 mt-2 shrink-0">
                   {t.variables} <code className="text-brand-300">{'{nome}'}</code>, <code className="text-brand-300">{'{plano}'}</code>, <code className="text-brand-300">{'{valor}'}</code>, <code className="text-brand-300">{'{vencimento}'}</code>
                 </p>
              )}
            </div>

            {/* Warning for Media Send */}
            {!isEditing && formData.type !== 'text' && (
               <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3 shrink-0">
                 <div className="p-1 bg-yellow-500/20 rounded-full text-yellow-500 mt-0.5">
                   {formData.type === 'image' ? <Image size={14} /> : formData.type === 'video' ? <Video size={14} /> : <Mic size={14} />}
                 </div>
                 <p className="text-xs text-yellow-200/80">
                   <strong>{t.warning}</strong> {t.warningText}
                 </p>
               </div>
            )}

          </div>

          {/* Action Buttons (Send Mode) */}
          {!isEditing && (
            <div className="grid grid-cols-5 gap-3 pt-4 border-t border-slate-700 mt-4 shrink-0">
              <button
                onClick={copyToClipboard}
                className="col-span-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                title={t.copy}
              >
                <Copy size={20} />
              </button>
              <button
                onClick={openWhatsApp}
                className="col-span-4 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
              >
                <Send size={20} />
                {t.send}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AiModal;
