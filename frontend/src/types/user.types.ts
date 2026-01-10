// User related types

import type { RegisterData } from "./auth.types";

export interface Role {
  id: string;
  name: 'admin' | 'finance_manager' | 'accountant' | 'customer_service' | 'customer' | 'system_admin' | 'collector' | string;
  display_name: string;
  description: string;
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: string | null;
  role_details: Role | null;
  avatar: string | null;
  company: string;
  job_title: string;
  address: string;
  city: string;
  country: string;
  timezone: string;
  language: string;
  is_verified: boolean;
  is_active: boolean;
  mfa_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: File | null;
  company?: string;
  job_title?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  language?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
}

export interface UserCreateData extends RegisterData {
  role?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  user_email: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string;
  created_at: string;
}
