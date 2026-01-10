/**
 * Company Service
 * API calls for system admin company management
 */

import api from './api';

export interface Company {
  id: string;
  name: string;
  registration_number?: string;
  tax_id?: string;
  email: string;
  phone?: string;
  website?: string;
  address: {
    district?: string;
    sector?: string;
    cell?: string;
    village?: string;
    street?: string;
  };
  service_districts: string[];
  status: 'active' | 'suspended' | 'inactive';
  is_verified: boolean;
  license_start_date?: string;
  license_end_date?: string;
  max_customers: number;
  max_collectors: number;
  logo?: string;
  primary_color: string;
  prepaid_collection_price: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  
  // Computed fields
  customer_count?: number;
  collector_count?: number;
  active_customers?: number;
}

export interface CreateCompanyData {
  name: string;
  registration_number?: string;
  tax_id?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: {
    district?: string;
    sector?: string;
    cell?: string;
    village?: string;
    street?: string;
  };
  service_districts?: string[];
  license_start_date?: string;
  license_end_date?: string;
  max_customers?: number;
  max_collectors?: number;
  primary_color?: string;
  prepaid_collection_price?: string;
  notes?: string;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  status?: 'active' | 'suspended' | 'inactive';
  is_verified?: boolean;
}

export interface CompanyStats {
  total_companies: number;
  active_companies: number;
  suspended_companies: number;
  total_customers: number;
  total_collectors: number;
  total_collections_today: number;
}

const companyService = {
  // List all companies
  async getCompanies(): Promise<{ count: number; results: Company[] }> {
    const response = await api.get<{ count: number; results: Company[] }>('/system-admin/companies/');
    return response.data;
  },

  // Get single company
  async getCompany(id: string): Promise<Company> {
    const response = await api.get<Company>(`/system-admin/companies/${id}/`);
    return response.data;
  },

  // Create company
  async createCompany(data: CreateCompanyData): Promise<Company> {
    const response = await api.post<Company>('/system-admin/companies/', data);
    return response.data;
  },

  // Update company
  async updateCompany(id: string, data: UpdateCompanyData): Promise<Company> {
    const response = await api.patch<Company>(`/system-admin/companies/${id}/`, data);
    return response.data;
  },

  // Delete company
  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/system-admin/companies/${id}/`);
  },

  // Activate company
  async activateCompany(id: string): Promise<Company> {
    const response = await api.post<Company>(`/system-admin/companies/${id}/activate/`);
    return response.data;
  },

  // Suspend company
  async suspendCompany(id: string): Promise<Company> {
    const response = await api.post<Company>(`/system-admin/companies/${id}/suspend/`);
    return response.data;
  },

  // Verify company
  async verifyCompany(id: string): Promise<Company> {
    const response = await api.post<Company>(`/system-admin/companies/${id}/verify/`);
    return response.data;
  },

  // Get company stats
  async getCompanyStats(id: string): Promise<{
    total_customers: number;
    total_collectors: number;
    active_customers: number;
    collections_today: number;
    service_areas: number;
  }> {
    const response = await api.get(`/system-admin/companies/${id}/stats/`);
    return response.data;
  },

  // Get system-wide statistics
  async getSystemStats(): Promise<CompanyStats> {
    const response = await api.get<CompanyStats>('/system-admin/companies/statistics/');
    return response.data;
  },
};

export default companyService;
