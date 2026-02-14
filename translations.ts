
import { Language } from "./types";

export const translations = {
  pt: {
    appTitle: 'Tbi Clientes',
    appSubtitle: 'Gestão Inteligente de IPTV',
    login: {
      email: 'Email',
      password: 'Senha',
      loginBtn: 'Entrar no Sistema',
      registerBtn: 'Criar Conta',
      toggleLogin: 'Já tem uma conta? Entrar',
      toggleRegister: 'Criar nova senha / conta',
      errorFill: 'Preencha todos os campos.',
      errorInvalid: 'Credenciais inválidas.'
    },
    sidebar: {
      dashboard: 'Dashboard',
      clients: 'Clientes',
      renewal: 'Renovar Gestão',
      support: 'Suporte',
      resellers: 'Revendas',
      settings: 'Configurações',
      logout: 'Sair do Sistema',
      version: 'Gestão v1.0',
      trialVersion: '(Versão Teste)'
    },
    dashboard: {
        title: 'Controle de Cobranças',
        tabs: {
            home: 'Home',
            calendar: 'Calendário',
            summary: 'Resumo'
        },
        pending: 'Pendentes',
        overdue: 'Em Atraso',
        today: 'Hoje',
        tomorrow: 'Amanhã (A Vencer)',
        access: 'Acesso',
        newCharge: 'Nova Cobrança',
        clientsBtn: 'Clientes',
        resellersBtn: 'Revendas',
        rateApp: 'Avalie o App! 😉',
        calendarHeader: 'Vencimentos em',
        selectDay: 'Selecione um dia',
        noClientsDay: 'Nenhum cliente vence neste dia.',
        scheduleClient: 'Agendar Novo Cliente',
        touchDetails: 'Toque em uma data acima para ver os detalhes.',
        summaryTitle: {
            total: 'Total Clientes',
            active: 'Ativos',
            trial: 'Testes (Trial)',
            expired: 'Vencidos',
            revenue: 'Receita Estimada'
        },
        limitReached: 'Limite Atingido',
        limitMsg: 'Você atingiu o limite de {max} clientes do plano gratuito. Faça o upgrade para cadastrar clientes ilimitados!',
        viewPlans: 'Ver Planos',
        renewBtn: 'Renovar',
        renewConfirm: 'Deseja renovar o plano de {name}?'
    },
    clients: {
        title: 'Gerenciar Clientes',
        newClient: 'Novo Cliente',
        searchPlaceholder: 'Buscar por nome, email ou telefone...',
        filters: {
            all: 'Todos',
            active: 'Ativos',
            expired: 'Vencidos',
            trial: 'Testes'
        },
        table: {
            client: 'Cliente',
            plan: 'Plano / Valor',
            status: 'Status',
            expiration: 'Vencimento',
            actions: 'Ações'
        },
        empty: 'Nenhum cliente encontrado.',
        card: {
             plan: 'Plano',
             value: 'Valor',
             expiration: 'Vencimento',
             msgBtn: 'Msg',
             editBtn: 'Editar',
             delBtn: 'Excluir'
        },
        status: {
            active: 'Ativo',
            expired: 'Vencido',
            trial: 'Teste',
            renovated: 'Renovado'
        }
    },
    renewal: {
        title: 'Renovar Gestão',
        planName: 'Plano Pro',
        planDesc: 'Sua gestão completa de clientes IPTV',
        month: '/mês',
        features: {
            unlimited: 'Clientes Ilimitados',
            ai: 'Controle de Cobranças completo',
            backup: 'Backup Automático'
        },
        btn: 'Renovar Agora',
        demoBtn: '[Demo] Simular Pagamento Aprovado',
        nextDue: 'Próximo vencimento:',
        history: 'Histórico de Pagamentos',
        paid: 'Pago',
        verifying: 'Verificando pagamento e atualizando assinatura...',
        subscriptionLabel: 'Mensalidade'
    },
    support: {
        title: 'Suporte & Ajuda',
        subtitle: 'Precisa de ajuda?',
        desc: 'Nossa equipe está disponível para tirar suas dúvidas sobre o funcionamento do app, pagamentos e sugestões.',
        whatsapp: 'WhatsApp',
        whatsappDesc: 'Atendimento rápido',
        email: 'Email'
    },
    settings: {
        title: 'Configurações',
        profile: 'Perfil do Usuário',
        displayName: 'Nome de Exibição',
        email: 'Email',
        testMode: 'Modo Teste',
        language: 'Idioma / Language',
        security: 'Segurança',
        changePassword: 'Alterar senha',
        about: 'Sobre'
    },
    modals: {
        client: {
            editTitle: 'Editar Cliente',
            newTitle: 'Novo Cliente',
            appPhoto: 'App Photo',
            tapToAdd: 'Toque para adicionar foto do App',
            name: 'Nome Completo',
            whatsapp: 'WhatsApp',
            planName: 'Nome do Plano',
            value: 'Valor (R$)',
            suggestions: 'Sugestões (Toque para preencher):',
            status: 'Status',
            dueDate: 'Data Vencimento',
            save: 'Salvar Cliente'
        },
        ai: {
            templates: 'Modelos',
            newTemplate: 'Novo Modelo',
            to: 'Para:',
            save: 'Salvar Modelo',
            type: 'Tipo:',
            types: {
                text: 'Texto',
                image: 'Imagem',
                video: 'Vídeo',
                audio: 'Áudio'
            },
            placeholder: 'Digite sua mensagem aqui...',
            variables: 'Variáveis disponíveis:',
            warning: 'Atenção:',
            warningText: 'O WhatsApp Web não permite anexar arquivos automaticamente via link. O texto será preenchido, mas você deve anexar a mídia manualmente antes de enviar.',
            copy: 'Copiar Texto',
            send: 'Enviar WhatsApp',
            mediaAttached: 'Mídia Anexada',
            clickToAdd: 'Clique para adicionar'
        },
        delete: {
            title: 'Excluir Cliente?',
            resellerTitle: 'Excluir Revenda?',
            msg: 'Tem certeza que deseja excluir',
            msg2: '? Esta ação não pode ser desfeita.',
            cancel: 'Cancelar',
            confirm: 'Excluir'
        },
        password: {
            title: 'Alterar Senha',
            current: 'Senha Atual',
            new: 'Nova Senha',
            confirm: 'Confirmar Nova Senha',
            save: 'Salvar Nova Senha',
            errorLen: 'A nova senha deve ter pelo menos 6 caracteres.',
            errorMatch: 'As novas senhas não coincidem.'
        },
        reseller: {
            title: 'Editar Revenda',
            name: 'Nome',
            email: 'Email (Login)',
            password: 'Senha',
            whatsapp: 'WhatsApp',
            subscriptionEnd: 'Vencimento da Assinatura',
            note: 'Ao alterar a data, o status será atualizado automaticamente ao salvar.',
            cancel: 'Cancelar',
            save: 'Salvar Alterações'
        }
    },
    resellers: {
        title: 'Controle de Revendas',
        total: 'Total:',
        table: {
            reseller: 'Revenda / Email',
            password: 'Senha',
            status: 'Status',
            due: 'Vencimento',
            actions: 'Ações'
        },
        empty: 'Nenhum usuário encontrado.'
    },
    trialBanner: {
        daysLeft: 'Teste Grátis: {days} dias restantes. Renove agora!',
        tomorrow: 'Atenção: Seu teste vence amanhã!',
        today: 'Urgente: Seu teste vence hoje!',
        renew: 'Renovar'
    }
  },
  en: {
    appTitle: 'Tbi Clientes',
    appSubtitle: 'Smart IPTV Management',
    login: {
      email: 'Email',
      password: 'Password',
      loginBtn: 'Login',
      registerBtn: 'Create Account',
      toggleLogin: 'Already have an account? Login',
      toggleRegister: 'Create new password / account',
      errorFill: 'Please fill in all fields.',
      errorInvalid: 'Invalid credentials.'
    },
    sidebar: {
      dashboard: 'Dashboard',
      clients: 'Clients',
      renewal: 'Renew Subscription',
      support: 'Support',
      resellers: 'Resellers',
      settings: 'Settings',
      logout: 'Logout',
      version: 'Manager v1.0',
      trialVersion: '(Trial Version)'
    },
    dashboard: {
        title: 'Billing Control',
        tabs: {
            home: 'Home',
            calendar: 'Calendar',
            summary: 'Summary'
        },
        pending: 'Pending',
        overdue: 'Overdue',
        today: 'Today',
        tomorrow: 'Tomorrow (Due)',
        access: 'Access',
        newCharge: 'New Charge',
        clientsBtn: 'Clients',
        resellersBtn: 'Resellers',
        rateApp: 'Rate the App! 😉',
        calendarHeader: 'Due on',
        selectDay: 'Select a day',
        noClientsDay: 'No clients due on this day.',
        scheduleClient: 'Schedule New Client',
        touchDetails: 'Tap a date above to see details.',
        summaryTitle: {
            total: 'Total Clientes',
            active: 'Active',
            trial: 'Trials',
            expired: 'Expired',
            revenue: 'Estimated Revenue'
        },
        limitReached: 'Limit Reached',
        limitMsg: 'You reached the limit of {max} clients on the free plan. Upgrade to register unlimited clients!',
        viewPlans: 'View Plans',
        renewBtn: 'Renew',
        renewConfirm: 'Do you want to renew {name}\'s plan?'
    },
    clients: {
        title: 'Manage Clients',
        newClient: 'New Client',
        searchPlaceholder: 'Search by name, email or phone...',
        filters: {
            all: 'All',
            active: 'Active',
            expired: 'Expired',
            trial: 'Trial'
        },
        table: {
            client: 'Client',
            plan: 'Plan / Price',
            status: 'Status',
            expiration: 'Expiration',
            actions: 'Actions'
        },
        empty: 'No clients found.',
        card: {
             plan: 'Plan',
             value: 'Price',
             expiration: 'Expires',
             msgBtn: 'Msg',
             editBtn: 'Edit',
             delBtn: 'Delete'
        },
        status: {
            active: 'Active',
            expired: 'Expired',
            trial: 'Trial',
            renovated: 'Renovated'
        }
    },
    renewal: {
        title: 'Renew Subscription',
        planName: 'Pro Plan',
        planDesc: 'Complete IPTV client management',
        month: '/month',
        features: {
            unlimited: 'Unlimited Clients',
            ai: 'Complete Billing Control',
            backup: 'Automatic Backup'
        },
        btn: 'Renew Now',
        demoBtn: '[Demo] Simulate Approved Payment',
        nextDue: 'Next due date:',
        history: 'Payment History',
        paid: 'Paid',
        verifying: 'Verifying payment and updating subscription...',
        subscriptionLabel: 'Monthly Fee'
    },
    support: {
        title: 'Support & Help',
        subtitle: 'Need help?',
        desc: 'Our team is available to answer your questions about the app, payments, and suggestions.',
        whatsapp: 'WhatsApp',
        whatsappDesc: 'Fast support',
        email: 'Email'
    },
    settings: {
        title: 'Settings',
        profile: 'User Profile',
        displayName: 'Display Name',
        email: 'Email',
        testMode: 'Test Mode',
        language: 'Language',
        security: 'Security',
        changePassword: 'Change Password',
        about: 'About'
    },
    modals: {
        client: {
            editTitle: 'Edit Client',
            newTitle: 'New Client',
            appPhoto: 'App Photo',
            tapToAdd: 'Tap to add App photo',
            name: 'Full Name',
            whatsapp: 'WhatsApp',
            planName: 'Plan Name',
            value: 'Price',
            suggestions: 'Suggestions (Tap to fill):',
            status: 'Status',
            dueDate: 'Expiration Date',
            save: 'Save Client'
        },
        ai: {
            templates: 'Templates',
            newTemplate: 'New Template',
            to: 'To:',
            save: 'Save Template',
            type: 'Type:',
            types: {
                text: 'Text',
                image: 'Image',
                video: 'Video',
                audio: 'Audio'
            },
            placeholder: 'Type your message here...',
            variables: 'Available variables:',
            warning: 'Warning:',
            warningText: 'WhatsApp Web does not allow automatically attaching files via link. Text will be filled, but you must attach media manually before sending.',
            copy: 'Copy Text',
            send: 'Send WhatsApp',
            mediaAttached: 'Media Attached',
            clickToAdd: 'Click to add'
        },
        delete: {
            title: 'Delete Client?',
            resellerTitle: 'Delete Reseller?',
            msg: 'Are you sure you want to delete',
            msg2: '? This action cannot be undone.',
            cancel: 'Cancel',
            confirm: 'Delete'
        },
        password: {
            title: 'Change Password',
            current: 'Current Password',
            new: 'New Password',
            confirm: 'Confirm New Password',
            save: 'Save New Password',
            errorLen: 'New password must be at least 6 characters.',
            errorMatch: 'New passwords do not match.'
        },
        reseller: {
            title: 'Edit Reseller',
            name: 'Name',
            email: 'Email (Login)',
            password: 'Password',
            whatsapp: 'WhatsApp',
            subscriptionEnd: 'Subscription Expiration',
            note: 'When changing the date, status will update automatically upon saving.',
            cancel: 'Cancel',
            save: 'Save Changes'
        }
    },
    resellers: {
        title: 'Reseller Control',
        total: 'Total:',
        table: {
            reseller: 'Reseller / Email',
            password: 'Password',
            status: 'Status',
            due: 'Due Date',
            actions: 'Actions'
        },
        empty: 'No users found.'
    },
    trialBanner: {
        daysLeft: 'Free Trial: {days} days left. Renew now!',
        tomorrow: 'Warning: Your trial expires tomorrow!',
        today: 'Urgent: Your trial expires today!',
        renew: 'Renew'
    }
  },
  es: {
    appTitle: 'Tbi Clientes',
    appSubtitle: 'Gestión Inteligente de IPTV',
    login: {
      email: 'Correo',
      password: 'Contraseña',
      loginBtn: 'Entrar al Sistema',
      registerBtn: 'Crear Cuenta',
      toggleLogin: '¿Ya tienes cuenta? Entrar',
      toggleRegister: 'Crear nueva contraseña / cuenta',
      errorFill: 'Complete todos los campos.',
      errorInvalid: 'Credenciales inválidas.'
    },
    sidebar: {
      dashboard: 'Panel',
      clients: 'Clientes',
      renewal: 'Renovar Gestión',
      support: 'Soporte',
      resellers: 'Revendedores',
      settings: 'Configuración',
      logout: 'Salir del Sistema',
      version: 'Gestión v1.0',
      trialVersion: '(Versión Prueba)'
    },
    dashboard: {
        title: 'Control de Cobros',
        tabs: {
            home: 'Inicio',
            calendar: 'Calendario',
            summary: 'Resumen'
        },
        pending: 'Pendientes',
        overdue: 'Atrasados',
        today: 'Hoy',
        tomorrow: 'Mañana (Vence)',
        access: 'Acceso',
        newCharge: 'Nuevo Cobro',
        clientsBtn: 'Clientes',
        resellersBtn: 'Revendedores',
        rateApp: '¡Califica la App! 😉',
        calendarHeader: 'Vencimientos el',
        selectDay: 'Selecciona un día',
        noClientsDay: 'Ningún cliente vence este día.',
        scheduleClient: 'Agendar Nuevo Cliente',
        touchDetails: 'Toca una fecha arriba para ver detalles.',
        summaryTitle: {
            total: 'Total Clientes',
            active: 'Activos',
            trial: 'Pruebas (Trial)',
            expired: 'Vencidos',
            revenue: 'Ingreso Estimado'
        },
        limitReached: 'Límite Alcanzado',
        limitMsg: 'Has alcanzado el límite de {max} clientes del plan gratuito. ¡Actualiza para registrar clientes ilimitados!',
        viewPlans: 'Ver Planes',
        renewBtn: 'Renovar',
        renewConfirm: '¿Desea renovar el plan de {name}?'
    },
    clients: {
        title: 'Gestionar Clientes',
        newClient: 'Nuevo Cliente',
        searchPlaceholder: 'Buscar por nombre, correo o teléfono...',
        filters: {
            all: 'Todos',
            active: 'Activos',
            expired: 'Vencidos',
            trial: 'Pruebas'
        },
        table: {
            client: 'Cliente',
            plan: 'Plan / Precio',
            status: 'Estado',
            expiration: 'Vencimiento',
            actions: 'Acciones'
        },
        empty: 'No se encontraron clientes.',
        card: {
             plan: 'Plan',
             value: 'Precio',
             expiration: 'Vence',
             msgBtn: 'Msg',
             editBtn: 'Editar',
             delBtn: 'Eliminar'
        },
        status: {
            active: 'Activo',
            expired: 'Vencido',
            trial: 'Prueba',
            renovated: 'Renovado'
        }
    },
    renewal: {
        title: 'Renovar Gestión',
        planName: 'Plan Pro',
        planDesc: 'Gestión completa de clientes IPTV',
        month: '/mes',
        features: {
            unlimited: 'Clientes Ilimitados',
            ai: 'Control de Cobros completo',
            backup: 'Copia de Seguridad Automática'
        },
        btn: 'Renovar Ahora',
        demoBtn: '[Demo] Simular Pago Aprobado',
        nextDue: 'Próximo vencimiento:',
        history: 'Historial de Pagos',
        paid: 'Pagado',
        verifying: 'Verificando pago y actualizando suscripción...',
        subscriptionLabel: 'Mensualidad'
    },
    support: {
        title: 'Soporte y Ayuda',
        subtitle: '¿Necesitas ayuda?',
        desc: 'Nuestro equipo está disponible para resolver dudas sobre la app, pagos y sugerencias.',
        whatsapp: 'WhatsApp',
        whatsappDesc: 'Soporte rápido',
        email: 'Correo'
    },
    settings: {
        title: 'Configuración',
        profile: 'Perfil de Usuario',
        displayName: 'Nombre para Mostrar',
        email: 'Correo',
        testMode: 'Modo Prueba',
        language: 'Idioma / Language',
        security: 'Seguridad',
        changePassword: 'Cambiar contraseña',
        about: 'Acerca de'
    },
    modals: {
        client: {
            editTitle: 'Editar Cliente',
            newTitle: 'Nuevo Cliente',
            appPhoto: 'Foto App',
            tapToAdd: 'Toca para agregar foto',
            name: 'Nome Completo',
            whatsapp: 'WhatsApp',
            planName: 'Nombre del Plan',
            value: 'Precio',
            suggestions: 'Sugerencias (Toca para llenar):',
            status: 'Estado',
            dueDate: 'Fecha Vencimiento',
            save: 'Guardar Cliente'
        },
        ai: {
            templates: 'Plantillas',
            newTemplate: 'Nueva Plantilla',
            to: 'Para:',
            save: 'Guardar Plantilla',
            type: 'Tipo:',
            types: {
                text: 'Texto',
                image: 'Imagem',
                video: 'Vídeo',
                audio: 'Áudio'
            },
            placeholder: 'Escribe tu mensaje aquí...',
            variables: 'Variables disponibles:',
            warning: 'Advertencia:',
            warningText: 'WhatsApp Web no permite adjuntar archivos automáticamente por enlace. El texto se llenará, pero debes adjuntar el medio manualmente.',
            copy: 'Copiar Texto',
            send: 'Enviar WhatsApp',
            mediaAttached: 'Medio Adjunto',
            clickToAdd: 'Clic para agregar'
        },
        delete: {
            title: '¿Eliminar Cliente?',
            resellerTitle: '¿Eliminar Revendedor?',
            msg: '¿Estás seguro de que deseas eliminar a',
            msg2: '? Esta acción no se puede deshacer.',
            cancel: 'Cancelar',
            confirm: 'Eliminar'
        },
        password: {
            title: 'Cambiar Contraseña',
            current: 'Contraseña Actual',
            new: 'Nueva Contraseña',
            confirm: 'Confirmar Nueva Contraseña',
            save: 'Guardar Nueva Contraseña',
            errorLen: 'La nueva contraseña debe tener al menos 6 caracteres.',
            errorMatch: 'Las nuevas contraseñas no coinciden.'
        },
        reseller: {
            title: 'Editar Revendedor',
            name: 'Nombre',
            email: 'Correo (Login)',
            password: 'Contraseña',
            whatsapp: 'WhatsApp',
            subscriptionEnd: 'Vencimiento Suscripción',
            note: 'Al cambiar la fecha, el estado se actualizará automáticamente al guardar.',
            cancel: 'Cancelar',
            save: 'Guardar Cambios'
        }
    },
    resellers: {
        title: 'Control de Revendedores',
        total: 'Total:',
        table: {
            reseller: 'Revendedor / Correo',
            password: 'Contraseña',
            status: 'Estado',
            due: 'Vencimiento',
            actions: 'Acciones'
        },
        empty: 'No se encontraron usuarios.'
    },
    trialBanner: {
        daysLeft: 'Prueba Gratis: quedan {days} días. ¡Renueva ahora!',
        tomorrow: 'Atención: ¡Tu prueba vence mañana!',
        today: 'Urgente: ¡Tu prueba vence hoy!',
        renew: 'Renovar'
    }
  }
};
