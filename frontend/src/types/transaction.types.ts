// Transaction related types

export interface TransactionRecord {
  id: string;
  transaction_number: string;
  customer_id: string;
  invoice_id: string | null;
  payment_method_id: string;
  type: 'payment' | 'refund' | 'chargeback' | 'adjustment';
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
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

export interface ReconciliationRecord {
  id: string;
  transaction_id: string;
  bank_statement_date: string;
  bank_amount: number;
  system_amount: number;
  difference: number;
  status: 'matched' | 'unmatched' | 'discrepancy';
  notes: string;
  reconciled_by: string;
  reconciled_at: string | null;
  created_at: string;
}
