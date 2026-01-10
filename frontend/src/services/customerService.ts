/**
 * Customer Service
 * Handles all API calls related to customer management.
 */

import api from './api';

// Rwanda address structure
export interface Address {
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  street?: string;
}

// Type for customer updates (partial fields allowed)
export type UpdateCustomerData = Partial<CreateCustomerData> & { id?: never };

export interface ServiceArea {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  user?: string;
  company_name: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  tax_id?: string;
  website?: string;
  industry?: string;
  billing_address?: Address;
  billing_address_string?: string;
  shipping_address?: Address;
  shipping_address_string?: string;
  payment_terms: 'immediate' | 'net_15' | 'net_30' | 'net_60' | 'net_90';
  credit_limit: string;
  preferred_payment_method?: string;
  status: 'active' | 'suspended' | 'archived';
  notes?: string;
  tags: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by?: string;
  created_by_name?: string;
  payment_methods?: PaymentMethod[];
  customer_notes?: CustomerNote[];
  is_active_flag?: boolean;
  service_area?: ServiceArea;
  prepaid_balance?: number;
}

export interface PaymentMethod {
  id: string;
  customer: string;
  type: 'card' | 'bank_account' | 'cash' | 'check' | 'other';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  card_holder_name?: string;
  bank_name?: string;
  account_last4?: string;
  routing_number_last4?: string;
  account_type?: 'checking' | 'savings' | 'business_checking';
  account_holder_name?: string;
  is_default: boolean;
  is_verified: boolean;
  billing_address?: Address;
  metadata?: Record<string, any>;
  display_name?: string;
  is_expired_flag?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CustomerNote {
  id: string;
  customer: string;
  created_by?: string;
  created_by_name?: string;
  note: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  suspended_customers: number;
  archived_customers: number;
  customers_with_payment_methods: number;
  total_credit_limit: string;
  new_customers_this_week: number;
  new_customers_this_month: number;
}

export interface CustomerListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  payment_terms?: string;
  industry?: string;
  tags?: string;
  ordering?: string;
  include_deleted?: boolean;
}

export interface CreateCustomerData {
  user?: string;
  company_name?: string;
  first_name: string;
  last_name: string;
  email?: string; // Optional for IsukuPay - customers use card numbers
  phone?: string;
  tax_id?: string;
  website?: string;
  industry?: string;
  billing_address?: Address;
  shipping_address?: Address;
  payment_terms?: 'immediate' | 'net_15' | 'net_30' | 'net_60' | 'net_90';
  credit_limit?: string;
  preferred_payment_method?: string;
  status?: 'active' | 'suspended' | 'archived';
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  create_user?: boolean;
  password?: string;
}

export interface CreatePaymentMethodData {
  customer: string;
  type: 'card' | 'bank_account' | 'cash' | 'check' | 'other';
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  card_holder_name?: string;
  bank_name?: string;
  account_last4?: string;
  routing_number_last4?: string;
  account_type?: 'checking' | 'savings' | 'business_checking';
  account_holder_name?: string;
  is_default?: boolean;
  is_verified?: boolean;
  billing_address?: Address;
  metadata?: Record<string, any>;
}

export interface CreateCustomerNoteData {
  customer: string;
  note: string;
  is_pinned?: boolean;
}

const customerService = {
  // Customer CRUD operations
  
  /**
   * Get list of customers with optional filters
   */
  getCustomers: async (params?: CustomerListParams) => {
    const response = await api.get<{ results: Customer[]; count: number; next: string | null; previous: string | null }>('/customers/', { params });
    return response.data;
  },

  /**
   * Get a single customer by ID
   */
  getCustomer: async (id: string) => {
    const response = await api.get<Customer>(`/customers/${id}/`);
    return response.data;
  },

  /**
   * Create a new customer
   */
  createCustomer: async (data: CreateCustomerData) => {
    const response = await api.post<Customer>('/customers/', data);
    return response.data;
  },

  /**
   * Update an existing customer
   */
  updateCustomer: async (id: string, data: Partial<CreateCustomerData>) => {
    const response = await api.patch<Customer>(`/customers/${id}/`, data);
    return response.data;
  },

  /**
   * Delete (soft delete) a customer
   */
  deleteCustomer: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/customers/${id}/`);
    return response.data;
  },

  // Customer Actions

  /**
   * Restore a deleted customer
   */
  restoreCustomer: async (id: string) => {
    const response = await api.post<{ message: string; data: Customer }>(`/customers/${id}/restore/`);
    return response.data;
  },

  /**
   * Suspend a customer
   */
  suspendCustomer: async (id: string) => {
    const response = await api.post<{ message: string; data: Customer }>(`/customers/${id}/suspend/`);
    return response.data;
  },

  /**
   * Activate a suspended customer
   */
  activateCustomer: async (id: string) => {
    const response = await api.post<{ message: string; data: Customer }>(`/customers/${id}/activate/`);
    return response.data;
  },

  /**
   * Get customer statistics
   */
  getCustomerStats: async () => {
    const response = await api.get<CustomerStats>('/customers/stats/');
    return response.data;
  },

  /**
   * Search customers
   */
  searchCustomers: async (query: string) => {
    const response = await api.get<Customer[]>('/customers/search/', { params: { q: query } });
    return response.data;
  },

  /**
   * Get payment methods for a customer
   */
  getCustomerPaymentMethods: async (customerId: string) => {
    const response = await api.get<PaymentMethod[]>(`/customers/${customerId}/payment_methods/`);
    return response.data;
  },

  /**
   * Get notes for a customer
   */
  getCustomerNotes: async (customerId: string) => {
    const response = await api.get<CustomerNote[]>(`/customers/${customerId}/notes/`);
    return response.data;
  },

  // Payment Method operations

  /**
   * Get list of payment methods
   */
  getPaymentMethods: async (params?: { customer_id?: string }) => {
    const response = await api.get<{ results: PaymentMethod[]; count: number }>('/payment-methods/', { params });
    return response.data;
  },

  /**
   * Get a single payment method
   */
  getPaymentMethod: async (id: string) => {
    const response = await api.get<PaymentMethod>(`/payment-methods/${id}/`);
    return response.data;
  },

  /**
   * Create a new payment method
   */
  createPaymentMethod: async (data: CreatePaymentMethodData) => {
    const response = await api.post<PaymentMethod>('/payment-methods/', data);
    return response.data;
  },

  /**
   * Update a payment method
   */
  updatePaymentMethod: async (id: string, data: Partial<CreatePaymentMethodData>) => {
    const response = await api.patch<PaymentMethod>(`/payment-methods/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a payment method
   */
  deletePaymentMethod: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/payment-methods/${id}/`);
    return response.data;
  },

  /**
   * Set payment method as default
   */
  setDefaultPaymentMethod: async (id: string) => {
    const response = await api.post<{ message: string; data: PaymentMethod }>(`/payment-methods/${id}/set_default/`);
    return response.data;
  },

  /**
   * Verify a payment method
   */
  verifyPaymentMethod: async (id: string) => {
    const response = await api.post<{ message: string; data: PaymentMethod }>(`/payment-methods/${id}/verify/`);
    return response.data;
  },

  /**
   * Get expired payment methods
   */
  getExpiredPaymentMethods: async () => {
    const response = await api.get<PaymentMethod[]>('/payment-methods/expired/');
    return response.data;
  },

  // Customer Note operations

  /**
   * Get list of customer notes
   */
  getNotes: async (params?: { customer_id?: string }) => {
    const response = await api.get<{ results: CustomerNote[]; count: number }>('/customer-notes/', { params });
    return response.data;
  },

  /**
   * Get a single note
   */
  getNote: async (id: string) => {
    const response = await api.get<CustomerNote>(`/customer-notes/${id}/`);
    return response.data;
  },

  /**
   * Create a new note
   */
  createNote: async (data: CreateCustomerNoteData) => {
    const response = await api.post<CustomerNote>('/customer-notes/', data);
    return response.data;
  },

  /**
   * Update a note
   */
  updateNote: async (id: string, data: Partial<CreateCustomerNoteData>) => {
    const response = await api.patch<CustomerNote>(`/customer-notes/${id}/`, data);
    return response.data;
  },

  /**
   * Delete a note
   */
  deleteNote: async (id: string) => {
    const response = await api.delete(`/customer-notes/${id}/`);
    return response.data;
  },

  /**
   * Pin a note
   */
  pinNote: async (id: string) => {
    const response = await api.post<{ message: string; data: CustomerNote }>(`/customer-notes/${id}/pin/`);
    return response.data;
  },

  /**
   * Unpin a note
   */
  unpinNote: async (id: string) => {
    const response = await api.post<{ message: string; data: CustomerNote }>(`/customer-notes/${id}/unpin/`);
    return response.data;
  },
};

export default customerService;
