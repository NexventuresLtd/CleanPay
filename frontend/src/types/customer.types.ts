// Customer related types

export interface Customer {
  id: string;
  customer_number: string;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  billing_address: Address;
  shipping_address: Address;
  tax_id: string;
  currency: string;
  payment_terms: number;
  credit_limit: number;
  notes: string;
  tags: string[];
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface PaymentMethod {
  id: string;
  customer_id: string;
  type: 'card' | 'bank_account' | 'wallet';
  is_default: boolean;
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  bank_name?: string;
  bank_account_last4?: string;
  bank_routing_number?: string;
  gateway_customer_id: string;
  gateway_payment_method_id: string;
  is_verified: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CustomerCreateData {
  company_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  billing_address?: Address;
  shipping_address?: Address;
  tax_id?: string;
  currency?: string;
  payment_terms?: number;
  credit_limit?: number;
  notes?: string;
  tags?: string[];
}

export interface CustomerUpdateData extends Partial<CustomerCreateData> {}
