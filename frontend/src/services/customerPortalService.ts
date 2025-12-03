/**
 * Customer Portal Service
 * API client for customer portal endpoints (invoices, payments, schedules, profile)
 */

import api from './api';

// ============================================================================
// Type Definitions
// ============================================================================

export interface CustomerPortalProfile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  billing_address: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  shipping_address: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  payment_terms: string;
  preferred_payment_method: string;
  status: 'active' | 'suspended' | 'archived';
  created_at: string;
}

export interface CustomerPortalSummary {
  payment_methods_count: number;
  pending_invoices_count: number;
  upcoming_schedules_count: number;
  outstanding_balance: number;
}

export interface CustomerPortalSchedule {
  id: string;
  scheduled_date: string;
  scheduled_time_start: string;
  scheduled_time_end: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'missed';
  route_name: string | null;
  service_area_name: string | null;
  collector_name: string | null;
  notes: string;
}

export interface CustomerPortalInvoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description: string;
}

export interface CustomerPortalPayment {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference_number: string;
  invoice_id: string | null;
}

export interface CustomerPortalPaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'cash' | 'check' | 'other';
  is_default: boolean;
  is_verified: boolean;
  nickname: string;
  // Card specific
  card_brand?: string;
  card_last_four?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  // Bank account specific
  bank_name?: string;
  account_last_four?: string;
  account_type?: string;
  created_at: string;
}

export interface CustomerPortalDashboard {
  customer: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
    status: string;
    payment_terms: string;
  };
  summary: CustomerPortalSummary;
  upcoming_schedules: CustomerPortalSchedule[];
  recent_payments: CustomerPortalPayment[];
  pending_invoices: CustomerPortalInvoice[];
}

export interface UpdateProfileData {
  phone?: string;
  billing_address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  shipping_address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  preferred_payment_method?: string;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get customer portal dashboard data
 */
export const getDashboard = async (): Promise<CustomerPortalDashboard> => {
  const response = await api.get('/portal/dashboard/');
  return response.data;
};

/**
 * Get customer profile
 */
export const getProfile = async (): Promise<CustomerPortalProfile> => {
  const response = await api.get('/portal/profile/');
  return response.data;
};

/**
 * Update customer profile
 */
export const updateProfile = async (data: UpdateProfileData): Promise<{ message: string; data: CustomerPortalProfile }> => {
  const response = await api.patch('/portal/profile/', data);
  return response.data;
};

/**
 * Get customer payment methods
 */
export const getPaymentMethods = async (): Promise<CustomerPortalPaymentMethod[]> => {
  const response = await api.get('/portal/payment-methods/');
  return response.data;
};

/**
 * Add a new payment method
 */
export const addPaymentMethod = async (data: Partial<CustomerPortalPaymentMethod>): Promise<{ message: string; data: CustomerPortalPaymentMethod }> => {
  const response = await api.post('/portal/payment-methods/', data);
  return response.data;
};

/**
 * Get customer schedules
 */
export const getSchedules = async (params?: {
  status?: string;
  date?: 'upcoming' | 'past' | 'today';
}): Promise<{ count: number; results: CustomerPortalSchedule[] }> => {
  const response = await api.get('/portal/schedules/', { params });
  return response.data;
};

/**
 * Get customer invoices
 */
export const getInvoices = async (params?: {
  status?: string;
}): Promise<{ count: number; results: CustomerPortalInvoice[] }> => {
  const response = await api.get('/portal/invoices/', { params });
  return response.data;
};

/**
 * Get customer payment history
 */
export const getPayments = async (params?: {
  status?: string;
}): Promise<{ count: number; results: CustomerPortalPayment[] }> => {
  const response = await api.get('/portal/payments/', { params });
  return response.data;
};

// Export as default object for convenience
const customerPortalService = {
  getDashboard,
  getProfile,
  updateProfile,
  getPaymentMethods,
  addPaymentMethod,
  getSchedules,
  getInvoices,
  getPayments,
};

export default customerPortalService;
