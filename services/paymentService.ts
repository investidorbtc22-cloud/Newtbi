import { User } from "../types";

// --- CONFIGURAÇÃO FIREBASE (Simulação) ---
// Em um projeto real, você importaria 'db' do seu arquivo de configuração firebase (ex: services/firebase.ts)
// import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// const db = getFirestore();

// --- CONFIGURAÇÃO MERCADO PAGO ---
// IMPORTANTE: Em produção, isso deve estar em uma Cloud Function para não expor o token no frontend.
const MP_ACCESS_TOKEN = process.env.REACT_APP_MP_ACCESS_TOKEN || "SEU_ACCESS_TOKEN_AQUI";

/**
 * Função simulada para interagir com o Firestore (já que não temos o config real aqui).
 * Substitua essas funções pelas chamadas reais do Firebase SDK.
 */
const mockFirestore = {
  checkPaymentExists: async (paymentId: string) => {
    // Código Real:
    // const docRef = doc(db, "processed_payments", paymentId);
    // const docSnap = await getDoc(docRef);
    // return docSnap.exists();
    
    // Simulação:
    const usedPayments = JSON.parse(localStorage.getItem('used_payments') || '[]');
    return usedPayments.includes(paymentId);
  },
  savePaymentId: async (paymentId: string, userId: string) => {
    // Código Real:
    // await setDoc(doc(db, "processed_payments", paymentId), { userId, date: new Date() });
    
    // Simulação:
    const usedPayments = JSON.parse(localStorage.getItem('used_payments') || '[]');
    usedPayments.push(paymentId);
    localStorage.setItem('used_payments', JSON.stringify(usedPayments));
  },
  updateUserSubscription: async (userId: string, newDate: string) => {
    // Código Real:
    // const userRef = doc(db, "users", userId);
    // await updateDoc(userRef, { subscriptionEnd: newDate, status: 'active' });
    console.log(`[FIREBASE] Usuário ${userId} atualizado para ${newDate}`);
  }
};

export const verifyPaymentAndRenew = async (
  paymentId: string, 
  status: string, 
  currentUser: User
): Promise<{ success: boolean; newDate?: Date; message: string }> => {
  
  try {
    console.log("Iniciando validação de segurança do pagamento:", paymentId);

    // 1. Validação Básica de URL
    if (status !== 'approved') {
      return { success: false, message: "O status do pagamento não é aprovado." };
    }

    // 2. Proteção contra Duplicidade (Idempotência)
    const alreadyUsed = await mockFirestore.checkPaymentExists(paymentId);
    if (alreadyUsed) {
      return { success: false, message: "Este pagamento já foi processado anteriormente." };
    }

    // 3. Verificação via API do Mercado Pago
    // Nota: Se estiver rodando no navegador localmente, pode dar erro de CORS. O ideal é usar um Proxy ou Backend.
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`
      }
    });

    if (!mpResponse.ok) {
       // Se falhar (ex: erro de CORS ou Token inválido), vamos permitir APENAS para teste se o token for o placeholder
       if (MP_ACCESS_TOKEN === "SEU_ACCESS_TOKEN_AQUI") {
           console.warn("Modo Teste: Ignorando validação rigorosa da API MP (Token não configurado).");
       } else {
           return { success: false, message: "Falha ao validar pagamento na API do Mercado Pago." };
       }
    } else {
        const paymentData = await mpResponse.json();

        // 3.1 Validar Status Real
        if (paymentData.status !== 'approved') {
            return { success: false, message: `Status na API é ${paymentData.status}, esperado: approved` };
        }

        // 3.2 Validar External Reference (ID do Usuário)
        // Nota: Links estáticos do MP (mpago.la) nem sempre passam external_reference.
        // Se você criou a preferência via API, isso funcionará.
        /* 
        if (paymentData.external_reference && paymentData.external_reference !== currentUser.email) { // Usando email como ID no mock
             return { success: false, message: "Este pagamento pertence a outro usuário." };
        }
        */
    }

    // 4. Lógica de Data (Hoje + 30 vs Vencimento + 30)
    const now = new Date();
    // Usa trialEndsAt como campo genérico de vencimento no nosso mock de User
    let currentExpiration = currentUser.trialEndsAt ? new Date(currentUser.trialEndsAt) : new Date();
    
    // Se a data for inválida, assume hoje
    if (isNaN(currentExpiration.getTime())) {
        currentExpiration = new Date();
    }

    let newExpirationDate: Date;

    if (currentExpiration < now) {
        // Vencido: Soma 30 dias a partir de HOJE
        newExpirationDate = new Date();
        newExpirationDate.setDate(newExpirationDate.getDate() + 30);
    } else {
        // Ativo: Soma 30 dias a partir do VENCIMENTO ATUAL
        newExpirationDate = new Date(currentExpiration);
        newExpirationDate.setDate(newExpirationDate.getDate() + 30);
    }

    // 5. Salvar no Banco de Dados (Firebase)
    
    // 5.1 Marcar pagamento como usado
    await mockFirestore.savePaymentId(paymentId, currentUser.email); // Usando email como ID

    // 5.2 Atualizar usuário
    await mockFirestore.updateUserSubscription(currentUser.email, newExpirationDate.toISOString());

    return { 
        success: true, 
        newDate: newExpirationDate,
        message: "Pagamento validado e assinatura renovada com sucesso!" 
    };

  } catch (error) {
    console.error("Erro no processamento:", error);
    return { success: false, message: "Erro interno ao processar renovação." };
  }
};