
import { GoogleGenAI } from "@google/genai";
import { Client, Language } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateClientMessage = async (client: Client, type: 'renewal' | 'welcome' | 'promo', language: Language): Promise<string> => {
  if (!ai) {
    console.warn("API Key not found, returning mock response");
    return language === 'en' ? "Error: Gemini API Key not configured." : 
           language === 'es' ? "Error: Clave API de Gemini no configurada." :
           "Erro: Chave de API do Gemini não configurada. Por favor, configure a API_KEY.";
  }

  const model = "gemini-3-flash-preview";
  let prompt = "";

  const locale = language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES';
  const today = new Date().toLocaleDateString(locale);
  const expiration = new Date(client.expirationDate).toLocaleDateString(locale);
  const priceFormatted = client.price ? client.price.toLocaleString(locale, { style: 'currency', currency: 'BRL' }) : '';

  // Prompt logic based on language
  if (language === 'pt') {
      switch (type) {
        case 'renewal':
          prompt = `
            Você é um assistente virtual de um serviço de IPTV chamado 'Tbi Clientes'.
            Escreva uma mensagem curta, educada e persuasiva para o WhatsApp.
            Cliente: ${client.name}
            Plano: ${client.plan}
            Valor: ${priceFormatted}
            Vencimento: ${expiration}
            Hoje: ${today}
            
            Objetivo: Lembrar o cliente que a assinatura vence em breve ou já venceu. Inclua emojis.
            Não use placeholders como [Link], apenas mencione que o pagamento pode ser feito via PIX.
          `;
          break;
        case 'welcome':
          prompt = `
            Você é um assistente da 'Tbi Clientes' IPTV.
            Escreva uma mensagem de boas-vindas curta e animada para o novo cliente ${client.name}.
            Plano contratado: ${client.plan}.
            Inclua emojis e agradeça a preferência.
          `;
          break;
        case 'promo':
          prompt = `
            Crie uma mensagem curta de promoção de renovação antecipada para o cliente IPTV ${client.name}.
            Ofereça um desconto simbólico se renovar hoje. Use emojis.
          `;
          break;
      }
  } else if (language === 'en') {
      switch (type) {
        case 'renewal':
          prompt = `
            You are a virtual assistant for an IPTV service called 'Tbi Clientes'.
            Write a short, polite, and persuasive WhatsApp message.
            Client: ${client.name}
            Plan: ${client.plan}
            Price: ${priceFormatted}
            Due Date: ${expiration}
            Today: ${today}
            
            Goal: Remind the client that the subscription is expiring soon or has expired. Include emojis.
            Do not use placeholders like [Link].
          `;
          break;
        case 'welcome':
          prompt = `
            You are an assistant for 'Tbi Clientes' IPTV.
            Write a short and lively welcome message for the new client ${client.name}.
            Plan: ${client.plan}.
            Include emojis and thank them for their business.
          `;
          break;
        case 'promo':
          prompt = `
            Create a short early renewal promo message for IPTV client ${client.name}.
            Offer a small discount if they renew today. Use emojis.
          `;
          break;
      }
  } else { // ES
       switch (type) {
        case 'renewal':
          prompt = `
            Eres un asistente virtual de un servicio de IPTV llamado 'Tbi Clientes'.
            Escribe un mensaje corto, educado y persuasivo para WhatsApp.
            Cliente: ${client.name}
            Plan: ${client.plan}
            Precio: ${priceFormatted}
            Vencimiento: ${expiration}
            Hoy: ${today}
            
            Objetivo: Recordar al cliente que la suscripción vence pronto o ha vencido. Incluye emojis.
            No uses marcadores como [Link].
          `;
          break;
        case 'welcome':
          prompt = `
            Eres un asistente de 'Tbi Clientes' IPTV.
            Escribe un mensaje de bienvenida corto y animado para el nuevo cliente ${client.name}.
            Plan contratado: ${client.plan}.
            Incluye emojis y agradece la preferencia.
          `;
          break;
        case 'promo':
          prompt = `
            Crea un mensaje corto de promoción de renovación anticipada para el cliente IPTV ${client.name}.
            Ofrece un descuento simbólico si renueva hoy. Usa emojis.
          `;
          break;
      }
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a mensagem.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Erro ao conectar com a IA. Tente novamente mais tarde.";
  }
};
