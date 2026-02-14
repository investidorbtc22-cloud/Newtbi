
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  price: number;
  appImage?: string; // New field for App Photo (Base64 URL)
  status: 'active' | 'expired' | 'trial';
  expirationDate: string; // ISO date string
  notes?: string;
}

export interface User {
  email: string;
  name: string;
  photo?: string; // Profile photo (Base64 URL)
  subscription: 'trial' | 'pro';
  maxClients: number; // 20 for trial, Infinity for pro
  trialEndsAt?: string; // ISO date for trial expiration
  planTemplates?: string[]; // Custom plan names saved by user
}

// Interface for the Users of the CRM (Admin View)
export interface AppUser {
  id: string;
  name: string;
  email: string; // Login
  password: string; // Password (visible for admin)
  phone: string;
  status: 'active' | 'expired' | 'trial';
  subscriptionEnd: string;
}

export enum ClientStatus {
  Active = 'active',
  Expired = 'expired',
  Trial = 'trial'
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  expiredClients: number;
  trialClients: number;
  revenue: number;
}

export type Language = 'pt' | 'en' | 'es';
