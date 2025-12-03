// Payment and transaction related types

export interface Transaction {
  id: string;
  transaction_number: string;
  customer_id: string;
  invoice_id: string | null;
  payment_method_id: string;
  type: TransactionType;
  status: TransactionStatus;
  gateway: string;
  gateway_transaction_id: string;
  currency: string;
  amount: number;
  fee: number;
  net_amount: number;
  description: string;
  failure_code: string | null;
  failure_message: string | null;
  metadata: Record<string, any>;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'payment' | 'refund' | 'chargeback' | 'adjustment';
export type TransactionStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';

export interface Refund {
  id: string;
  refund_number: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency: string;
  reason: string;
  status: RefundStatus;
  gateway_refund_id: string;
  processed_at: string | null;
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type RefundStatus = 'pending' | 'succeeded' | 'failed';

export interface PaymentIntent {
  customer_id: string;
  invoice_id?: string;
  payment_method_id: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface Subscription {
  id: string;
  subscription_number: string;
  customer_id: string;
  payment_method_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  currency: string;
  amount: number;
  billing_interval: BillingInterval;
  billing_day: number;
  current_period_start: string;
  current_period_end: string;
  trial_start: string | null;
  trial_end: string | null;
  canceled_at: string | null;
  ended_at: string | null;
  next_billing_date: string;
  failed_payment_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = 'active' | 'paused' | 'canceled' | 'expired';
export type BillingInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';
