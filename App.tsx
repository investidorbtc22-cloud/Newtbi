
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Search, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  MessageCircle,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Menu,
  X,
  Settings,
  ChevronRight,
  UserCircle,
  BarChart3,
  ChevronLeft,
  Smartphone,
  CalendarDays,
  CreditCard,
  DollarSign,
  Timer,
  Camera,
  Lock,
  Check,
  Mail,
  Briefcase,
  Globe,
  Loader2,
  RefreshCw,
  Video,
  Music,
  Image as ImageIcon
} from 'lucide-react';
import { Client, ClientStatus, User, AppUser, Language } from './types';
import ClientForm from './components/ClientForm';
import AiModal from './components/AiModal';
import DeleteModal from './components/DeleteModal';
import PasswordModal from './components/PasswordModal';
import EditAppUserModal from './components/EditAppUserModal';
import { verifyPaymentAndRenew } from './services/paymentService';
import { translations } from './translations';

// --- COMPONENTE DE LOGO VETORIAL ---
const AppLogo = ({ className = "w-24 h-24", showText = true, vertical = false }: { className?: string, showText?: boolean, vertical?: boolean }) => (
  <div className={`flex items-center justify-center ${vertical ? 'flex-col gap-3' : 'gap-3'} select-none`}>
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r="90" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" className="opacity-80" />
        <path d="M170 100 A 70 70 0 0 1 30 100" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" className="opacity-40" />
        <path d="M30 100 A 70 70 0 0 1 170 100" stroke="url(#logoGradient)" strokeWidth="1" strokeLinecap="round" strokeDasharray="5,5" className="opacity-20" />
        <g transform="translate(-10, 0)">
          <path d="M60 60 L100 100 L60 140" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#glow)" />
          <path d="M100 60 L140 100 L100 140" stroke="white" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#glow)" />
        </g>
        <g transform="translate(135, 55) scale(0.6)">
             <path d="M5 25 A 25 25 0 0 1 45 25" stroke="white" strokeWidth="6" strokeLinecap="round" />
             <path d="M12 32 A 15 15 0 0 1 38 32" stroke="white" strokeWidth="6" strokeLinecap="round" />
             <circle cx="25" cy="45" r="6" fill="white" />
        </g>
      </svg>
    </div>
    {showText && (
      <div className={`flex flex-col ${vertical ? 'items-center' : 'items-start'}`}>
        <span className={`font-bold tracking-tight bg-gradient-to-r from-brand-400 to-indigo-500 bg-clip-text text-transparent ${vertical ? 'text-3xl' : 'text-xl'}`}>
          Tbi Clientes
        </span>
        {!vertical && <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">CRM System</span>}
      </div>
    )}
  </div>
);

// Helper para criar data segura (Meio dia para evitar erros de fuso horário no split)
const getSafeIso = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(12, 0, 0, 0);
    return d.toISOString();
};

// Mock Clients Data com datas seguras
const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Roberto Almeida', email: 'roberto@email.com', phone: '11987654321', plan: 'Premium - 1 Mês', price: 35.00, status: 'active', expirationDate: getSafeIso(5) },
  { id: '2', name: 'Carla Souza', email: 'carla@email.com', phone: '21999887766', plan: 'Básico - 3 Meses', price: 80.00, status: 'expired', expirationDate: getSafeIso(-2) },
  { id: '3', name: 'Marcos Vinicius', email: 'marcos@email.com', phone: '31988776655', plan: 'Teste Grátis', price: 0, status: 'trial', expirationDate: getSafeIso(1) },
  { id: '4', name: 'Ana Beatriz', email: 'ana@email.com', phone: '41977665544', plan: 'Anual', price: 350.00, status: 'active', expirationDate: getSafeIso(200) },
  { id: '5', name: 'João Pedro', email: 'jp@email.com', phone: '51966554433', plan: 'Básico - 1 Mês', price: 30.00, status: 'active', expirationDate: getSafeIso(15) },
  { id: '6', name: 'Lucas Silva', email: 'lucas@email.com', phone: '61955443322', plan: 'Premium - 1 Mês', price: 35.00, status: 'active', expirationDate: getSafeIso(0) }, 
];

const INITIAL_APP_USERS: AppUser[] = [
  { id: '101', name: 'Revenda Top', email: 'revenda@gmail.com', password: '123', phone: '11999998888', status: 'active', subscriptionEnd: getSafeIso(15) },
  { id: '102', name: 'IPTV Master', email: 'master@hotmail.com', password: 'abc', phone: '21988887777', status: 'trial', subscriptionEnd: getSafeIso(1) },
  { id: '103', name: 'Carlos Vendas', email: 'carlos@yahoo.com', password: 'xyz', phone: '31977776666', status: 'expired', subscriptionEnd: getSafeIso(-5) },
];

const DEFAULT_TEMPLATES = ['Teste de 3 horas', 'Mensal', 'Trimestral', 'Semestral', 'Anual'];
const ADMIN_EMAIL = 'thebestiptv10@gmail.com';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [clients, setClients] = useState<Client[]>([]); 
  const [appUsers, setAppUsers] = useState<AppUser[]>(INITIAL_APP_USERS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const [currentView, setCurrentView] = useState<'dashboard' | 'clients' | 'settings' | 'renewal' | 'support' | 'users'>('dashboard');
  const [dashboardTab, setDashboardTab] = useState<'home' | 'calendar' | 'summary'>('home');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  
  const [aiClient, setAiClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  const [appUserToDelete, setAppUserToDelete] = useState<AppUser | null>(null); 
  const [appUserToEdit, setAppUserToEdit] = useState<AppUser | null>(null);
  const [isEditAppUserModalOpen, setIsEditAppUserModalOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUserName, setTempUserName] = useState('');
  const [language, setLanguage] = useState<Language>('pt');
  
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [calendarDate, setCalendarDate] = useState(new Date());

  const t = translations[language];
  const dateLocale = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';

  const paymentHistory = useMemo(() => {
    const history = [];
    const today = new Date();
    for (let i = 1; i <= 2; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 15);
        const monthName = d.toLocaleDateString(dateLocale, { month: 'long' });
        const monthLabel = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        const hasSale = i === 1;

        history.push({
            label: `${t.renewal.subscriptionLabel} - ${monthLabel}`,
            date: d.toLocaleDateString(dateLocale),
            hasSale: hasSale,
            statusText: t.renewal.paid
        });
    }
    return history;
  }, [dateLocale, t.renewal.subscriptionLabel, t.renewal.paid]);

  useEffect(() => {
    if (user) {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentId = queryParams.get('payment_id');
        const status = queryParams.get('status');

        if (paymentId && status && !isProcessingPayment) {
            handlePaymentReturn(paymentId, status);
        }
    }
  }, [user]);

  const handlePaymentReturn = async (paymentId: string, status: string) => {
      setIsProcessingPayment(true);
      window.history.replaceState({}, document.title, window.location.pathname);

      if (!user) return;

      const result = await verifyPaymentAndRenew(paymentId, status, user);

      if (result.success && result.newDate) {
          const updatedUser: User = {
            ...user,
            subscription: 'pro',
            maxClients: Infinity,
            trialEndsAt: result.newDate.toISOString()
          };
          setUser(updatedUser);
          setPaymentMessage({ type: 'success', text: result.message });
          setCurrentView('renewal');
      } else {
          setPaymentMessage({ type: 'error', text: result.message });
          setCurrentView('renewal');
      }

      setIsProcessingPayment(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (loginEmail === ADMIN_EMAIL && loginPassword === '#Senhasecreta2e') {
      setUser({ 
        name: 'Administrador', 
        email: loginEmail,
        subscription: 'pro',
        maxClients: Infinity,
        planTemplates: DEFAULT_TEMPLATES
      });
      setClients(MOCK_CLIENTS); 
    } else if (isRegistering) {
        if(loginEmail && loginPassword) {
            const trialEnd = new Date();
            trialEnd.setDate(trialEnd.getDate() + 3);
            const newUserName = loginEmail.split('@')[0];

            setUser({ 
              name: newUserName,
              email: loginEmail,
              subscription: 'trial',
              maxClients: 20,
              trialEndsAt: trialEnd.toISOString(),
              planTemplates: DEFAULT_TEMPLATES
            });
            setClients([]);

            const newAppUser: AppUser = {
                id: crypto.randomUUID(),
                name: newUserName,
                email: loginEmail,
                password: loginPassword,
                phone: '',
                status: 'trial',
                subscriptionEnd: trialEnd.toISOString()
            };
            setAppUsers(prev => [newAppUser, ...prev]);
        } else {
            setLoginError(t.login.errorFill);
        }
    } else {
      setLoginError(t.login.errorInvalid);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setClients([]);
    setIsMobileMenuOpen(false);
    setIsEditingProfile(false);
    setCurrentView('dashboard');
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditingProfile = () => {
    if (user) {
        setTempUserName(user.name);
        setIsEditingProfile(true);
    }
  };

  const saveProfile = () => {
    if (user && tempUserName.trim()) {
        setUser({ ...user, name: tempUserName });
        setIsEditingProfile(false);
    }
  };

  const handleChangePassword = (newPassword: string) => {
      alert('Senha alterada com sucesso!');
  };

  const handleUpdatePlanTemplates = (newTemplates: string[]) => {
      if (user) {
          setUser({ ...user, planTemplates: newTemplates });
      }
  };

  const handleStatClick = (status: string) => {
      setFilterStatus(status);
      setCurrentView('clients');
  };

  const handleSimulateRenewalPayment = () => {
      if (!user) return;
      const now = new Date();
      let currentExpiration = user.trialEndsAt ? new Date(user.trialEndsAt) : new Date();
      if (isNaN(currentExpiration.getTime())) currentExpiration = new Date();

      let newExpirationDate: Date;
      if (currentExpiration < now) {
          newExpirationDate = new Date();
          newExpirationDate.setDate(newExpirationDate.getDate() + 30);
      } else {
          newExpirationDate = new Date(currentExpiration);
          newExpirationDate.setDate(newExpirationDate.getDate() + 30);
      }
      
      newExpirationDate.setHours(12, 0, 0, 0);

      const updatedUser: User = {
          ...user,
          subscription: 'pro',
          maxClients: Infinity, 
          trialEndsAt: newExpirationDate.toISOString() 
      };

      setUser(updatedUser);
      alert(`Pagamento Simulado Aprovado!\nNova Data de Vencimento: ${newExpirationDate.toLocaleDateString(dateLocale)}`);
  };

  const handleDeleteAppUserClick = (appUser: AppUser) => setAppUserToDelete(appUser);
  const handleEditAppUserClick = (appUser: AppUser) => {
      setAppUserToEdit(appUser);
      setIsEditAppUserModalOpen(true);
  };
  const handleSaveAppUser = (updatedUser: AppUser) => {
      setAppUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setIsEditAppUserModalOpen(false);
      setAppUserToEdit(null);
  };
  const confirmDeleteAppUser = () => {
      if (appUserToDelete) {
          setAppUsers(prev => prev.filter(u => u.id !== appUserToDelete.id));
          setAppUserToDelete(null);
      }
  };
  const handleMessageAppUser = (appUser: AppUser) => {
      const text = `Olá ${appUser.name}, sou o administrador do Tbi Clientes. Gostaria de falar sobre sua assinatura.`;
      const encodedText = encodeURIComponent(text);
      if (!appUser.phone) {
          window.location.href = `mailto:${appUser.email}?subject=Contato Tbi Clientes&body=${encodedText}`;
      } else {
          const cleanPhone = appUser.phone.replace(/\D/g, '');
          window.open(`https://wa.me/55${cleanPhone}?text=${encodedText}`, '_blank');
      }
  };

  const handleSaveClient = (client: Client) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === client.id ? client : c));
    } else {
      if (user?.subscription === 'trial' && clients.length >= user.maxClients) {
        setShowLimitAlert(true);
        setIsFormOpen(false);
        return;
      }
      setClients([client, ...clients]);
    }
    setEditingClient(null);
  };

  const handleDeleteClick = (client: Client) => setClientToDelete(client);
  const confirmDelete = () => {
    if (clientToDelete) {
      setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
      setClientToDelete(null);
    }
  };
  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleQuickRenew = (client: Client) => {
      const confirmMsg = t.dashboard.renewConfirm.replace('{name}', client.name);

      if (window.confirm(confirmMsg)) {
          const planLower = client.plan.toLowerCase();
          
          let monthsToAdd = 1;
          if (planLower.includes('anual') || planLower.includes('12')) monthsToAdd = 12;
          else if (planLower.includes('semestral') || planLower.includes('6')) monthsToAdd = 6;
          else if (planLower.includes('trimestral') || planLower.includes('3')) monthsToAdd = 3;

          const [y, m, d] = client.expirationDate.split('T')[0].split('-').map(Number);
          const currentExp = new Date(y, m - 1, d, 12, 0, 0); 

          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);

          let baseDate = currentExp < today ? today : currentExp;
          
          const newDate = new Date(baseDate);
          newDate.setMonth(newDate.getMonth() + monthsToAdd);
          newDate.setHours(12, 0, 0, 0); // Forçar 12:00 para manter o dia no split

          const isTest = planLower.includes('teste');

          setClients(prev => prev.map(c => c.id === client.id ? {
              ...c,
              status: 'active' as ClientStatus,
              plan: isTest ? 'Mensal' : c.plan,
              price: isTest ? 35 : c.price,
              expirationDate: newDate.toISOString()
          } : c));
      }
  };

  const handleNewClick = () => {
    if (user?.subscription === 'trial' && clients.length >= user.maxClients) {
      setShowLimitAlert(true);
      return;
    }
    setEditingClient(null);
    if (dashboardTab !== 'calendar') {
        setSelectedCalendarDate(null);
    }
    setIsFormOpen(true);
  };

  const handleCalendarDayClick = (year: number, month: number, day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedCalendarDate(dateStr);
  };

  const getTrialDaysLeft = () => {
    if (!user || user.subscription !== 'trial' || !user.trialEndsAt) return null;
    const end = new Date(user.trialEndsAt).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((end - now) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 0;
  };
  const trialDaysLeft = getTrialDaysLeft();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    setSelectedCalendarDate(null);
  };
  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    setSelectedCalendarDate(null);
  };
  const isCurrentMonth = useMemo(() => {
      const now = new Date();
      return calendarDate.getMonth() === now.getMonth() && 
             calendarDate.getFullYear() === now.getFullYear();
  }, [calendarDate]);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.phone.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const expired = clients.filter(c => c.status === 'expired').length;
    const trial = clients.filter(c => c.status === 'trial').length;
    
    // Revenue: Sum of Active clients
    const revenue = clients.filter(c => c.status === 'active').reduce((sum, client) => sum + (client.price || 0), 0);
    
    // Potential Revenue: Sum of Active + Expired clients
    const potentialRevenue = clients.filter(c => c.status === 'active' || c.status === 'expired').reduce((sum, client) => sum + (client.price || 0), 0);
    
    const percentage = potentialRevenue > 0 ? (revenue / potentialRevenue) * 100 : 0;

    return { total, active, expired, trial, revenue, percentage };
  }, [clients]);

  const dashboardStats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

    let overdue = 0;
    let dueToday = 0;
    let dueTomorrow = 0;

    clients.forEach(c => {
        const dStr = c.expirationDate.split('T')[0];
        const d = new Date(c.expirationDate);
        if (c.status === 'expired' || (d < now && dStr !== todayStr)) {
            overdue++;
        } else if (dStr === todayStr) {
            dueToday++;
        } else if (dStr === tomorrowStr) {
            dueTomorrow++;
        }
    });
    return { overdue, dueToday, dueTomorrow };
  }, [clients]);

  const clientsByDate = useMemo(() => {
      const map: Record<string, number> = {};
      clients.forEach(c => {
          const date = c.expirationDate.split('T')[0];
          map[date] = (map[date] || 0) + 1;
      });
      return map;
  }, [clients]);

  const selectedDateClientsList = useMemo(() => {
      if (!selectedCalendarDate) return [];
      return clients.filter(c => c.expirationDate.split('T')[0] === selectedCalendarDate);
  }, [clients, selectedCalendarDate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
          <div className="text-center mb-8">
            <div className="mt-4 mb-4 flex justify-center">
              <AppLogo vertical className="w-36 h-36 animate-pulse" />
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t.login.email}</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t.login.password}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {loginError && <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded">{loginError}</div>}
            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-500/20 transition-all transform hover:scale-[1.02]">{isRegistering ? t.login.registerBtn : t.login.loginBtn}</button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegistering(!isRegistering); setLoginError(''); setLoginEmail(''); setLoginPassword(''); }} className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
              {isRegistering ? t.login.toggleLogin : t.login.toggleRegister}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 flex flex-col items-center text-center">
        <div className="mb-4">
           <AppLogo vertical className="w-20 h-20" />
        </div>
        <p className="text-xs text-slate-500 mt-1">{t.sidebar.version} {user.subscription === 'trial' && t.sidebar.trialVersion}</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <button onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <LayoutDashboard size={20} />{t.sidebar.dashboard}
        </button>
        {user.email !== ADMIN_EMAIL && (
            <button onClick={() => { setCurrentView('clients'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'clients' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Users size={20} />{t.sidebar.clients}
            </button>
        )}
        <button onClick={() => { setCurrentView('renewal'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'renewal' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <CreditCard size={20} />{t.sidebar.renewal}
        </button>
        <button onClick={() => { setCurrentView('support'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'support' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <HelpCircle size={20} />{t.sidebar.support}
        </button>
        {user.email === ADMIN_EMAIL && (
            <button onClick={() => { setCurrentView('users'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'users' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <Briefcase size={20} />{t.sidebar.resellers}
            </button>
        )}
        <button onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'settings' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <Settings size={20} />{t.sidebar.settings}
        </button>
      </nav>
      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          {user.photo ? <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" /> : <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold">{user.name.charAt(0)}</div>}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
          <LogOut size={20} /><span>{t.sidebar.logout}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 border-r border-slate-800 h-full relative z-20">
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-72 bg-slate-900 h-full shadow-2xl flex flex-col border-r border-slate-800">
             <div className="absolute top-4 right-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
             </div>
             <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-full w-full relative overflow-hidden">
        {user.subscription === 'trial' && trialDaysLeft !== null && (
            <div className={`${trialDaysLeft <= 1 ? 'bg-red-600' : trialDaysLeft === 2 ? 'bg-orange-600' : 'bg-indigo-600'} text-white px-4 py-2 text-sm font-bold text-center shadow-lg relative z-20 flex justify-between items-center`}>
                <span className="flex-1">
                    {trialDaysLeft > 2 && t.trialBanner.daysLeft.replace('{days}', trialDaysLeft.toString())}
                    {trialDaysLeft === 2 && t.trialBanner.tomorrow}
                    {trialDaysLeft <= 1 && t.trialBanner.today}
                </span>
                <button onClick={() => setCurrentView('renewal')} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs ml-2 transition-colors">{t.trialBanner.renew}</button>
            </div>
        )}
        {currentView !== 'dashboard' && (
            <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30 flex-shrink-0">
            <div className="flex items-center gap-2">
                 <AppLogo className="w-8 h-8" showText={false} />
                 <span className="font-bold text-xl bg-gradient-to-r from-brand-400 to-indigo-500 bg-clip-text text-transparent">{t.appTitle}</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-300 hover:text-white p-2"><Menu size={24} /></button>
            </header>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-700">
          {currentView === 'dashboard' && (
            <div className="h-full flex flex-col relative max-w-2xl mx-auto">
                <div className="flex items-center justify-between pb-2 md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-300 hover:text-white"><Menu size={24} /></button>
                    <h2 className="text-xl font-bold text-white">{t.dashboard.title}</h2>
                    <div className="text-slate-400">
                         {user?.photo ? <img src={user.photo} alt="Profile" className="w-7 h-7 rounded-full object-cover" /> : <UserCircle size={28} />}
                    </div>
                </div>
                <div className="hidden md:flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white">{t.dashboard.title}</h2>
                    <div className="text-slate-400">
                        {user?.photo ? <img src={user.photo} alt="Profile" className="w-8 h-8 rounded-full object-cover" /> : <UserCircle size={28} />}
                    </div>
                </div>

                <div className="flex border-b border-slate-800 mb-6 sticky top-0 bg-slate-950 z-10 pt-2">
                    <button onClick={() => setDashboardTab('home')} className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${dashboardTab === 'home' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>{t.dashboard.tabs.home}</button>
                    <button onClick={() => setDashboardTab('calendar')} className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${dashboardTab === 'calendar' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>{t.dashboard.tabs.calendar}</button>
                    <button onClick={() => setDashboardTab('summary')} className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${dashboardTab === 'summary' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>{t.dashboard.tabs.summary}</button>
                </div>

                {dashboardTab === 'home' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 transition-colors" onClick={() => handleStatClick(ClientStatus.Expired)}>
                                <span className="text-2xl font-bold text-red-500">{dashboardStats.overdue}</span>
                                <span className="text-xs text-slate-400 text-center">{t.dashboard.overdue}</span>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-brand-400">{dashboardStats.dueToday}</span>
                                <span className="text-xs text-slate-400 text-center">{t.dashboard.today}</span>
                            </div>
                             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-yellow-500">{dashboardStats.dueTomorrow}</span>
                                <span className="text-xs text-slate-400 text-center">{t.dashboard.tomorrow}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-6">
                             <button onClick={() => { setCurrentView('clients'); setFilterStatus('all'); }} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all">
                                <Users size={20} />
                                {t.dashboard.clientsBtn}
                             </button>
                              {user.email === ADMIN_EMAIL && (
                                <button onClick={() => setCurrentView('users')} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
                                    <Briefcase size={20} />
                                    {t.dashboard.resellersBtn}
                                </button>
                             )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <AlertCircle size={18} className="text-brand-400" />
                                    {t.dashboard.tomorrow}
                                </h3>
                                <button onClick={handleNewClick} className="text-brand-400 text-sm font-semibold hover:underline flex items-center gap-1">
                                    <Plus size={16} /> {t.dashboard.newCharge}
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {clients.filter(c => {
                                    const dStr = c.expirationDate.split('T')[0];
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
                                    return dStr === tomorrowStr;
                                }).length === 0 ? (
                                    <div className="bg-slate-800/50 rounded-lg p-6 text-center border border-slate-700 border-dashed">
                                        <CheckCircle className="mx-auto text-slate-600 mb-2" size={32} />
                                        <p className="text-slate-500">{t.clients.empty}</p>
                                    </div>
                                ) : (
                                    clients.filter(c => {
                                        const dStr = c.expirationDate.split('T')[0];
                                        const tomorrow = new Date();
                                        tomorrow.setDate(tomorrow.getDate() + 1);
                                        const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
                                        return dStr === tomorrowStr;
                                    }).map(client => (
                                        <div key={client.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                 {client.appImage ? (
                                                    <img src={client.appImage} alt={client.name} className="w-10 h-10 rounded-lg object-cover bg-slate-700" />
                                                 ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-brand-900/50 text-brand-400 flex items-center justify-center font-bold">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                 )}
                                                <div>
                                                    <h4 className="font-bold text-white">{client.name}</h4>
                                                    <p className="text-xs text-slate-400">{client.plan}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                 <button onClick={() => setAiClient(client)} className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors">
                                                    <MessageCircle size={18} />
                                                </button>
                                                <button onClick={() => handleQuickRenew(client)} className="p-2 bg-brand-600/20 text-brand-400 rounded-lg hover:bg-brand-600/30 transition-colors" title={t.dashboard.renewBtn}>
                                                    <RefreshCw size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {dashboardTab === 'calendar' && (
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4 bg-slate-800 p-3 rounded-xl border border-slate-700">
                             <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
                             <h3 className="font-bold text-lg capitalize">{calendarDate.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' })}</h3>
                             <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><ChevronRight size={20} /></button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                <div key={i} className="text-center text-xs font-bold text-slate-500 py-1">{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr">
                            {Array.from({ length: getFirstDayOfMonth(calendarDate) }).map((_, i) => (
                                <div key={`empty-${i}`} className="p-1"></div>
                            ))}
                            {Array.from({ length: getDaysInMonth(calendarDate) }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const count = clientsByDate[dateStr] || 0;
                                const isSelected = selectedCalendarDate === dateStr;
                                const now = new Date();
                                const isToday = calendarDate.getMonth() === now.getMonth() && calendarDate.getFullYear() === now.getFullYear() && day === now.getDate();

                                return (
                                    <div 
                                        key={day} 
                                        onClick={() => handleCalendarDayClick(calendarDate.getFullYear(), calendarDate.getMonth(), day)}
                                        className={`
                                            relative p-2 rounded-lg border flex flex-col items-center justify-start min-h-[60px] cursor-pointer transition-all
                                            ${isSelected ? 'bg-brand-600 border-brand-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}
                                            ${isToday && !isSelected ? 'ring-1 ring-brand-400' : ''}
                                        `}
                                    >
                                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{day}</span>
                                        {count > 0 && (
                                            <div className={`mt-1 text-xs font-bold px-1.5 rounded-full ${isSelected ? 'bg-white text-brand-600' : 'bg-brand-900 text-brand-400'}`}>
                                                {count}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                             <h4 className="text-sm font-bold text-slate-300 mb-3 flex justify-between items-center">
                                 <span>{selectedCalendarDate ? `${t.dashboard.calendarHeader} ${new Date(selectedCalendarDate + 'T12:00:00').toLocaleDateString(dateLocale)}` : t.dashboard.selectDay}</span>
                                 {selectedCalendarDate && (
                                     <button onClick={handleNewClick} className="text-xs bg-brand-600 px-2 py-1 rounded text-white flex items-center gap-1 hover:bg-brand-500">
                                         <Plus size={12} /> {t.dashboard.scheduleClient}
                                     </button>
                                 )}
                             </h4>
                             {selectedDateClientsList.length > 0 ? (
                                 <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                                     {selectedDateClientsList.map(c => (
                                         <div key={c.id} className="flex items-center justify-between p-2 bg-slate-800 rounded border border-slate-700">
                                             <div className="flex items-center gap-2">
                                                 <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                 <span className="text-sm font-medium text-white truncate max-w-[120px]">{c.name}</span>
                                             </div>
                                             <div className="flex gap-2">
                                                <button onClick={() => setAiClient(c)} className="text-slate-400 hover:text-green-400"><MessageCircle size={16} /></button>
                                                <button onClick={() => handleEditClick(c)} className="text-slate-400 hover:text-brand-400"><Edit2 size={16} /></button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             ) : (
                                 <p className="text-xs text-slate-500 text-center py-4">{selectedCalendarDate ? t.dashboard.noClientsDay : t.dashboard.touchDetails}</p>
                             )}
                        </div>
                    </div>
                )}

                {dashboardTab === 'summary' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                onClick={() => { setCurrentView('clients'); setFilterStatus('all'); }}
                                className="bg-slate-800 p-5 rounded-xl border border-slate-700 cursor-pointer hover:border-brand-500 transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover:text-white transition-colors">
                                    <Users size={18} />
                                    <span className="text-xs font-bold uppercase">{t.dashboard.summaryTitle.total}</span>
                                </div>
                                <span className="text-3xl font-bold text-white">{stats.total}</span>
                            </div>
                             <div 
                                onClick={() => { setCurrentView('clients'); setFilterStatus(ClientStatus.Active); }}
                                className="bg-slate-800 p-5 rounded-xl border border-slate-700 cursor-pointer hover:border-green-500 transition-all group"
                             >
                                <div className="flex items-center gap-2 mb-2 text-green-400 group-hover:text-green-300 transition-colors">
                                    <CheckCircle size={18} />
                                    <span className="text-xs font-bold uppercase">{t.dashboard.summaryTitle.active}</span>
                                </div>
                                <span className="text-3xl font-bold text-white">{stats.active}</span>
                            </div>
                             <div 
                                onClick={() => { setCurrentView('clients'); setFilterStatus(ClientStatus.Trial); }}
                                className="bg-slate-800 p-5 rounded-xl border border-slate-700 cursor-pointer hover:border-indigo-500 transition-all group"
                             >
                                <div className="flex items-center gap-2 mb-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                    <Timer size={18} />
                                    <span className="text-xs font-bold uppercase">{t.dashboard.summaryTitle.trial}</span>
                                </div>
                                <span className="text-3xl font-bold text-white">{stats.trial}</span>
                            </div>
                             <div 
                                onClick={() => { setCurrentView('clients'); setFilterStatus(ClientStatus.Expired); }}
                                className="bg-slate-800 p-5 rounded-xl border border-slate-700 cursor-pointer hover:border-red-500 transition-all group"
                             >
                                <div className="flex items-center gap-2 mb-2 text-red-400 group-hover:text-red-300 transition-colors">
                                    <AlertCircle size={18} />
                                    <span className="text-xs font-bold uppercase">{t.dashboard.summaryTitle.expired}</span>
                                </div>
                                <span className="text-3xl font-bold text-white">{stats.expired}</span>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-sm text-slate-400">{t.dashboard.summaryTitle.revenue}</p>
                                    <h3 className="text-2xl font-bold text-white">
                                        {stats.revenue.toLocaleString(dateLocale, { style: 'currency', currency: 'BRL' })}
                                    </h3>
                                </div>
                                <div className="text-right">
                                     <span className={`text-sm font-bold ${stats.percentage === 100 ? 'text-green-400' : 'text-slate-400'}`}>
                                        {Math.round(stats.percentage)}%
                                     </span>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out" 
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          )}

          {currentView === 'clients' && (
            <div className="max-w-4xl mx-auto h-full flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">{t.clients.title}</h2>
                 <button onClick={handleNewClick} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all">
                   <Plus size={20} /> <span className="hidden sm:inline">{t.clients.newClient}</span>
                 </button>
               </div>

               <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 sticky top-0 z-10 shadow-lg">
                 <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                   {[
                      { id: 'all', label: t.clients.filters.all },
                      { id: ClientStatus.Active, label: t.clients.filters.active },
                      { id: ClientStatus.Expired, label: t.clients.filters.expired },
                      { id: ClientStatus.Trial, label: t.clients.filters.trial }
                   ].map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setFilterStatus(filter.id)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filterStatus === filter.id ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}`}
                      >
                        {filter.label}
                      </button>
                   ))}
                 </div>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder={t.clients.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                 </div>
               </div>

               {filteredClients.length === 0 ? (
                 <div className="text-center py-12 text-slate-500">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>{t.clients.empty}</p>
                 </div>
               ) : (
                 <div className="grid gap-4 pb-20">
                    {filteredClients.map(client => (
                      <div key={client.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-brand-500/50 transition-all group">
                         <div className="flex items-center gap-4 flex-1">
                             {client.appImage ? (
                               <img src={client.appImage} alt="App" className="w-12 h-12 rounded-xl object-cover bg-slate-900" />
                             ) : (
                               <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xl">
                                 {client.name.charAt(0)}
                               </div>
                             )}
                             <div>
                               <h3 className="font-bold text-white text-lg">{client.name}</h3>
                               <p className="text-sm text-slate-400">
                                   {client.plan} • {client.price.toLocaleString(dateLocale, { style: 'currency', currency: 'BRL' })}
                               </p>
                             </div>
                         </div>
                         
                         <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                ${client.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                                  client.status === 'expired' ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'}`
                            }>
                                {client.status === 'active' ? t.clients.status.active : 
                                 client.status === 'expired' ? t.clients.status.expired : t.clients.status.trial}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-bold">{t.clients.card.expiration}</p>
                                <p className="text-sm font-medium text-slate-300">{new Date(client.expirationDate).toLocaleDateString(dateLocale)}</p>
                            </div>
                         </div>

                         <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-700">
                             <button 
                               onClick={() => setAiClient(client)}
                               className="flex-1 sm:flex-none p-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-500/20"
                               title={t.clients.card.msgBtn}
                             >
                                <MessageCircle size={20} />
                             </button>
                             <button 
                               onClick={() => handleEditClick(client)}
                               className="flex-1 sm:flex-none p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
                               title={t.clients.card.editBtn}
                             >
                                <Edit2 size={20} />
                             </button>
                             <button 
                               onClick={() => handleDeleteClick(client)}
                               className="flex-1 sm:flex-none p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors group-hover:bg-slate-700"
                               title={t.clients.card.delBtn}
                             >
                                <Trash2 size={20} />
                             </button>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {currentView === 'renewal' && (
              <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-gradient-to-br from-brand-900 to-indigo-900 rounded-2xl p-6 border border-brand-500/30 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                          <CreditCard size={120} />
                      </div>
                      <div className="relative z-10">
                          <h2 className="text-2xl font-bold text-white mb-2">{t.renewal.title}</h2>
                          <p className="text-brand-200 mb-6">{t.renewal.planDesc}</p>
                          
                          <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm mb-6">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-slate-300">{t.renewal.planName}</span>
                                  <span className="text-2xl font-bold text-white">R$ 26,90<span className="text-sm text-slate-400 font-normal">{t.renewal.month}</span></span>
                              </div>
                              <ul className="space-y-2 text-sm text-slate-300">
                                  <li className="flex items-center gap-2"><Check size={16} className="text-brand-400" /> {t.renewal.features.unlimited}</li>
                                  <li className="flex items-center gap-2"><Check size={16} className="text-brand-400" /> {t.renewal.features.ai}</li>
                                  <li className="flex items-center gap-2"><Check size={16} className="text-brand-400" /> {t.renewal.features.backup}</li>
                              </ul>
                          </div>

                          {user.subscription === 'trial' ? (
                                <button 
                                    onClick={handleSimulateRenewalPayment}
                                    disabled={isProcessingPayment}
                                    className="w-full bg-white text-brand-600 font-bold py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    {isProcessingPayment ? <Loader2 className="animate-spin" /> : t.renewal.btn}
                                </button>
                          ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="bg-green-500/20 text-green-300 p-3 rounded-lg border border-green-500/30 text-center font-bold">
                                        {t.renewal.nextDue} {new Date(user.trialEndsAt || '').toLocaleDateString(dateLocale)}
                                    </div>
                                    <button 
                                        onClick={handleSimulateRenewalPayment}
                                        disabled={isProcessingPayment}
                                        className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isProcessingPayment ? <Loader2 className="animate-spin" /> : t.renewal.btn}
                                    </button>
                                </div>
                          )}
                           
                           <button onClick={handleSimulateRenewalPayment} className="mt-4 text-xs text-brand-300/50 hover:text-brand-300 underline block mx-auto">
                               {t.renewal.demoBtn}
                           </button>

                           {paymentMessage && (
                                <div className={`mt-4 p-3 rounded-lg text-sm text-center font-bold ${paymentMessage.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {paymentMessage.text}
                                </div>
                           )}
                      </div>
                  </div>

                  <div>
                      <h3 className="text-lg font-bold text-white mb-4">{t.renewal.history}</h3>
                      <div className="space-y-3">
                          {paymentHistory.map((payment, idx) => (
                             <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                     <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                         <CheckCircle size={20} />
                                     </div>
                                     <div>
                                         <p className="font-bold text-white">{payment.label}</p>
                                         <p className="text-xs text-slate-400">{payment.date}</p>
                                     </div>
                                 </div>
                                 <span className="text-sm font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                                     {payment.statusText}
                                 </span>
                             </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {currentView === 'support' && (
              <div className="max-w-md mx-auto text-center pt-8">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-400 shadow-xl border border-slate-700">
                      <HelpCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{t.support.title}</h2>
                  <p className="text-slate-400 mb-8">{t.support.desc}</p>
                  
                  <div className="space-y-4">
                      <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" className="block bg-green-600 hover:bg-green-500 text-white p-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3">
                          <Smartphone size={24} />
                          <div className="text-left">
                              <div className="text-xs font-normal opacity-80">{t.support.whatsappDesc}</div>
                              <div>{t.support.whatsapp}</div>
                          </div>
                      </a>
                      <a href="mailto:suporte@tbiclientes.com" className="block bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl font-bold transition-all border border-slate-700 flex items-center justify-center gap-3">
                          <Mail size={24} />
                          <span>{t.support.email}</span>
                      </a>
                  </div>
              </div>
          )}

          {currentView === 'users' && user.email === ADMIN_EMAIL && (
              <div className="max-w-5xl mx-auto">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="text-brand-400" />
                        {t.resellers.title}
                    </h2>
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm border border-slate-700">
                        {t.resellers.total} <strong>{appUsers.length}</strong>
                    </span>
                 </div>
                 
                 {appUsers.length === 0 ? (
                     <div className="text-center py-12 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>{t.resellers.empty}</p>
                     </div>
                 ) : (
                     <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                         <div className="overflow-x-auto">
                             <table className="w-full text-left border-collapse">
                                 <thead>
                                     <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase border-b border-slate-700">
                                         <th className="p-4 font-bold">{t.resellers.table.reseller}</th>
                                         <th className="p-4 font-bold hidden md:table-cell">{t.resellers.table.password}</th>
                                         <th className="p-4 font-bold">{t.resellers.table.status}</th>
                                         <th className="p-4 font-bold hidden sm:table-cell">{t.resellers.table.due}</th>
                                         <th className="p-4 font-bold text-right">{t.resellers.table.actions}</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-700">
                                     {appUsers.map(appUser => (
                                         <tr key={appUser.id} className="hover:bg-slate-700/50 transition-colors">
                                             <td className="p-4">
                                                 <div className="font-bold text-white">{appUser.name}</div>
                                                 <div className="text-xs text-slate-400">{appUser.email}</div>
                                                 {appUser.phone && <div className="text-xs text-brand-400 flex items-center gap-1 mt-1"><Smartphone size={10}/> {appUser.phone}</div>}
                                             </td>
                                             <td className="p-4 hidden md:table-cell font-mono text-sm text-slate-300">
                                                 {appUser.password}
                                             </td>
                                             <td className="p-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${
                                                    appUser.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                                    appUser.status === 'trial' ? 'bg-indigo-500/20 text-indigo-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {appUser.status}
                                                </span>
                                             </td>
                                             <td className="p-4 hidden sm:table-cell text-sm text-slate-300">
                                                 {new Date(appUser.subscriptionEnd).toLocaleDateString(dateLocale)}
                                             </td>
                                             <td className="p-4">
                                                 <div className="flex items-center justify-end gap-2">
                                                     <button onClick={() => handleMessageAppUser(appUser)} className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="WhatsApp">
                                                         <MessageCircle size={18} />
                                                     </button>
                                                     <button onClick={() => handleEditAppUserClick(appUser)} className="p-2 text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors" title="Editar">
                                                         <Edit2 size={18} />
                                                     </button>
                                                     <button onClick={() => handleDeleteAppUserClick(appUser)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Excluir">
                                                         <Trash2 size={18} />
                                                     </button>
                                                 </div>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                     </div>
                 )}
              </div>
          )}

          {currentView === 'settings' && (
              <div className="max-w-2xl mx-auto space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">{t.settings.title}</h2>
                  
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <UserCircle className="text-brand-400" />
                          {t.settings.profile}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="relative group">
                              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-700 bg-slate-900">
                                  {user.photo ? (
                                      <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">
                                          {user.name.charAt(0)}
                                      </div>
                                  )}
                              </div>
                              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                  <Camera className="text-white" />
                                  <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoUpload} />
                              </label>
                          </div>
                          
                          <div className="flex-1 w-full space-y-4">
                              <div>
                                  <label className="block text-sm font-medium text-slate-400 mb-1">{t.settings.displayName}</label>
                                  {isEditingProfile ? (
                                      <div className="flex gap-2">
                                          <input 
                                              ref={profileInputRef}
                                              type="text" 
                                              value={tempUserName} 
                                              onChange={(e) => setTempUserName(e.target.value)}
                                              className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white outline-none focus:border-brand-500"
                                          />
                                          <button onClick={saveProfile} className="bg-brand-600 text-white px-3 rounded hover:bg-brand-500"><Check size={18} /></button>
                                      </div>
                                  ) : (
                                      <div className="flex justify-between items-center bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-800">
                                          <span className="text-white font-medium">{user.name}</span>
                                          <button onClick={startEditingProfile} className="text-slate-500 hover:text-brand-400"><Edit2 size={16} /></button>
                                      </div>
                                  )}
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-slate-400 mb-1">{t.settings.email}</label>
                                   <div className="bg-slate-900/50 px-4 py-3 rounded-lg border border-slate-800 text-slate-500 flex justify-between items-center">
                                       <span>{user.email}</span>
                                       {user.subscription === 'trial' && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold uppercase">{t.settings.testMode}</span>}
                                   </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Globe className="text-brand-400" />
                          {t.settings.language}
                      </h3>
                      <div className="flex gap-2">
                          <button 
                              onClick={() => setLanguage('pt')} 
                              className={`flex-1 py-3 rounded-lg font-bold border transition-all ${language === 'pt' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                          >
                              🇧🇷 Português
                          </button>
                          <button 
                              onClick={() => setLanguage('en')} 
                              className={`flex-1 py-3 rounded-lg font-bold border transition-all ${language === 'en' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                          >
                              🇺🇸 English
                          </button>
                          <button 
                              onClick={() => setLanguage('es')} 
                              className={`flex-1 py-3 rounded-lg font-bold border transition-all ${language === 'es' ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                          >
                              🇪🇸 Español
                          </button>
                      </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Lock className="text-brand-400" />
                          {t.settings.security}
                      </h3>
                      <button 
                          onClick={() => setIsPasswordModalOpen(true)}
                          className="w-full bg-slate-900 hover:bg-slate-900/80 border border-slate-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                          <Lock size={18} />
                          {t.settings.changePassword}
                      </button>
                  </div>

                  <div className="text-center text-xs text-slate-600 pt-4">
                      <p>{t.appTitle} © 2024</p>
                      <p className="mt-1">{t.settings.about} v1.0.0</p>
                  </div>
              </div>
          )}
        </main>
      </div>

      <ClientForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveClient}
        initialData={editingClient}
        initialDate={selectedCalendarDate}
        planTemplates={user.planTemplates || DEFAULT_TEMPLATES}
        onUpdateTemplates={handleUpdatePlanTemplates}
        language={language}
      />

      <AiModal
        isOpen={!!aiClient}
        onClose={() => setAiClient(null)}
        client={aiClient}
        language={language}
      />

      <DeleteModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={confirmDelete}
        clientName={clientToDelete?.name || ''}
        language={language}
      />
      
      <DeleteModal
        isOpen={!!appUserToDelete}
        onClose={() => setAppUserToDelete(null)}
        onConfirm={confirmDeleteAppUser}
        clientName={appUserToDelete?.name || ''}
        title={t.modals.delete.resellerTitle}
        language={language}
      />

      <PasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleChangePassword}
        language={language}
      />

      <EditAppUserModal 
          isOpen={isEditAppUserModalOpen}
          onClose={() => setIsEditAppUserModalOpen(false)}
          onSave={handleSaveAppUser}
          userToEdit={appUserToEdit}
          language={language}
      />

      {showLimitAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-slate-800 rounded-xl p-6 max-w-sm text-center border border-slate-700 shadow-2xl animate-bounce-in">
              <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t.dashboard.limitReached}</h3>
              <p className="text-slate-400 mb-6">
                  {t.dashboard.limitMsg.replace('{max}', user.maxClients.toString())}
              </p>
              <div className="flex gap-3">
                  <button onClick={() => setShowLimitAlert(false)} className="flex-1 py-2 rounded-lg text-slate-400 hover:text-white font-medium">{t.modals.delete.cancel}</button>
                  <button onClick={() => { setShowLimitAlert(false); setCurrentView('renewal'); }} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-2 rounded-lg font-bold shadow-lg shadow-brand-500/20">{t.dashboard.viewPlans}</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
