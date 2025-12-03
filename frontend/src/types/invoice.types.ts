// Invoice related types

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  notes: string;
  terms: string;
  footer: string;
  pdf_url: string;
  public_url: string;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  line_items: InvoiceLineItem[];
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'void';

export interface InvoiceLineItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_percent: number;
  amount: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface InvoiceCreateData {
  customer_id: string;
  issue_date: string;
  due_date: string;
  currency?: string;
  notes?: string;
  terms?: string;
  footer?: string;
  line_items: LineItemInput[];
}

export interface LineItemInput {
  description: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  tax_percent?: number;
}

export interface InvoiceUpdateData extends Partial<InvoiceCreateData> {
  status?: InvoiceStatus;
}
