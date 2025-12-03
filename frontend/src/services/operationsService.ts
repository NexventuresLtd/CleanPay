/**
 * Operations Service
 * API client for service areas, routes, collectors, and schedules
 */

import api from './api';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ServiceArea {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'planned';
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  latitude: number | null;
  longitude: number | null;
  boundary_geojson: object | null;
  estimated_households: number;
  estimated_customers: number;
  active_routes_count: number;
  assigned_collectors_count: number;
  full_address: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ServiceAreaStats {
  total_areas: number;
  active_areas: number;
  inactive_areas: number;
  planned_areas: number;
  total_households: number;
  total_customers: number;
  total_routes: number;
  total_collectors: number;
}

export interface Route {
  id: string;
  code: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
  service_area: string;
  service_area_name: string;
  default_collector: string | null;
  default_collector_name: string | null;
  sequence_number: number;
  estimated_distance_km: number;
  estimated_duration_minutes: number;
  path_geojson: object | null;
  frequency: 'daily' | 'twice_weekly' | 'weekly' | 'biweekly' | 'monthly';
  collection_days: string[];
  collection_time_start: string;
  collection_time_end: string;
  customers_count: number;
  collection_schedule_display: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Collector {
  id: string;
  employee_id: string;
  user: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  national_id: string;
  photo: string | null;
  address: string;
  employment_type: 'full_time' | 'part_time' | 'contractor' | 'temporary';
  hire_date: string;
  termination_date: string | null;
  status: 'active' | 'on_leave' | 'inactive' | 'suspended';
  device_id: string;
  nfc_reader_id: string;
  rating: string;
  total_collections: number;
  service_areas: string[];
  service_area_names: string[];
  assigned_routes_count: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CollectorPerformance {
  total_collections: number;
  total_schedules: number;
  completed_schedules: number;
  missed_schedules: number;
  completion_rate: number;
  rating: number;
  collections_this_month: number;
}

export interface Schedule {
  id: string;
  route: string;
  route_name: string;
  collector: string | null;
  collector_name: string | null;
  service_area_name: string;
  scheduled_date: string;
  scheduled_time_start: string;
  scheduled_time_end: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'missed';
  customers_scheduled: number;
  customers_collected: number;
  customers_missed: number;
  notes: string;
  cancellation_reason: string;
  collection_rate: number;
  duration_minutes: number | null;
  is_today: boolean;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreateServiceAreaData {
  code: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'planned';
  province: string;
  district: string;
  sector: string;
  cell?: string;
  village?: string;
  latitude?: number;
  longitude?: number;
  boundary_geojson?: object;
  estimated_households?: number;
  estimated_customers?: number;
}

export interface UpdateServiceAreaData extends Partial<CreateServiceAreaData> {
  id?: never;
}

export interface CreateRouteData {
  code: string;
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
  service_area: string;
  default_collector?: string;
  sequence_number: number;
  estimated_distance_km?: number;
  estimated_duration_minutes?: number;
  path_geojson?: object;
  frequency: 'daily' | 'twice_weekly' | 'weekly' | 'biweekly' | 'monthly';
  collection_days: string[];
  collection_time_start: string;
  collection_time_end: string;
}

export interface UpdateRouteData extends Partial<CreateRouteData> {
  id?: never;
}

export interface CreateCollectorData {
  employee_id: string;
  user?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  national_id?: string;
  photo?: File;
  address?: string;
  employment_type: 'full_time' | 'part_time' | 'contractor' | 'temporary';
  hire_date: string;
  termination_date?: string;
  status?: 'active' | 'on_leave' | 'inactive' | 'suspended';
  device_id?: string;
  nfc_reader_id?: string;
  rating?: number;
  service_areas?: string[];
}

export interface UpdateCollectorData extends Partial<CreateCollectorData> {
  id?: never;
}

export interface CreateScheduleData {
  route: string;
  collector?: string;
  scheduled_date: string;
  scheduled_time_start: string;
  scheduled_time_end: string;
  customers_scheduled?: number;
  notes?: string;
}

export interface UpdateScheduleData extends Partial<CreateScheduleData> {
  id?: never;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'missed';
  actual_start_time?: string;
  actual_end_time?: string;
  customers_collected?: number;
  customers_missed?: number;
  cancellation_reason?: string;
}

export interface GenerateScheduleData {
  start_date: string;
  end_date: string;
}

// ============================================================================
// Service Area API
// ============================================================================

export const serviceAreaService = {
  getAll: async (params?: { status?: string; province?: string; district?: string; search?: string }) => {
    const response = await api.get<{ results: ServiceArea[] }>('/operations/service-areas/', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ServiceArea>(`/operations/service-areas/${id}/`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ServiceAreaStats>('/operations/service-areas/stats/');
    return response.data;
  },

  create: async (data: CreateServiceAreaData) => {
    const response = await api.post<ServiceArea>('/operations/service-areas/', data);
    return response.data;
  },

  update: async (id: string, data: UpdateServiceAreaData) => {
    const response = await api.patch<ServiceArea>(`/operations/service-areas/${id}/`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/operations/service-areas/${id}/`);
  },

  activate: async (id: string) => {
    const response = await api.post<ServiceArea>(`/operations/service-areas/${id}/activate/`);
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await api.post<ServiceArea>(`/operations/service-areas/${id}/deactivate/`);
    return response.data;
  },

  getRoutes: async (id: string) => {
    const response = await api.get<Route[]>(`/operations/service-areas/${id}/routes/`);
    return response.data;
  },

  getCollectors: async (id: string) => {
    const response = await api.get<Collector[]>(`/operations/service-areas/${id}/collectors/`);
    return response.data;
  },
};

// ============================================================================
// Route API
// ============================================================================

export const routeService = {
  getAll: async (params?: { status?: string; service_area?: string; frequency?: string; search?: string }) => {
    const response = await api.get<{ results: Route[] }>('/operations/routes/', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Route>(`/operations/routes/${id}/`);
    return response.data;
  },

  create: async (data: CreateRouteData) => {
    const response = await api.post<Route>('/operations/routes/', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRouteData) => {
    const response = await api.patch<Route>(`/operations/routes/${id}/`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/operations/routes/${id}/`);
  },

  assignCollector: async (id: string, collectorId: string) => {
    const response = await api.post<Route>(`/operations/routes/${id}/assign_collector/`, {
      collector_id: collectorId,
    });
    return response.data;
  },

  getSchedules: async (id: string) => {
    const response = await api.get<Schedule[]>(`/operations/routes/${id}/schedules/`);
    return response.data;
  },

  generateSchedule: async (id: string, data: GenerateScheduleData) => {
    const response = await api.post<{ message: string; schedules: Schedule[] }>(
      `/operations/routes/${id}/generate_schedule/`,
      data
    );
    return response.data;
  },
};

// ============================================================================
// Collector API
// ============================================================================

export const collectorService = {
  getAll: async (params?: { status?: string; employment_type?: string; search?: string }) => {
    const response = await api.get<{ results: Collector[] }>('/operations/collectors/', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Collector>(`/operations/collectors/${id}/`);
    return response.data;
  },

  getAvailable: async () => {
    const response = await api.get<Collector[]>('/operations/collectors/available/');
    return response.data;
  },

  create: async (data: CreateCollectorData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'service_areas' && Array.isArray(value)) {
          value.forEach((area) => formData.append('service_areas', area));
        } else {
          formData.append(key, value instanceof File ? value : String(value));
        }
      }
    });
    const response = await api.post<Collector>('/operations/collectors/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateCollectorData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'service_areas' && Array.isArray(value)) {
          value.forEach((area) => formData.append('service_areas', area));
        } else {
          formData.append(key, value instanceof File ? value : String(value));
        }
      }
    });
    const response = await api.patch<Collector>(`/operations/collectors/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/operations/collectors/${id}/`);
  },

  activate: async (id: string) => {
    const response = await api.post<Collector>(`/operations/collectors/${id}/activate/`);
    return response.data;
  },

  suspend: async (id: string) => {
    const response = await api.post<Collector>(`/operations/collectors/${id}/suspend/`);
    return response.data;
  },

  setOnLeave: async (id: string) => {
    const response = await api.post<Collector>(`/operations/collectors/${id}/set_on_leave/`);
    return response.data;
  },

  getRoutes: async (id: string) => {
    const response = await api.get<Route[]>(`/operations/collectors/${id}/routes/`);
    return response.data;
  },

  getSchedules: async (id: string) => {
    const response = await api.get<Schedule[]>(`/operations/collectors/${id}/schedules/`);
    return response.data;
  },

  getPerformance: async (id: string) => {
    const response = await api.get<CollectorPerformance>(`/operations/collectors/${id}/performance/`);
    return response.data;
  },
};

// ============================================================================
// Schedule API
// ============================================================================

export const scheduleService = {
  getAll: async (params?: { status?: string; route?: string; collector?: string; scheduled_date?: string; search?: string }) => {
    const response = await api.get<{ results: Schedule[] }>('/operations/schedules/', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Schedule>(`/operations/schedules/${id}/`);
    return response.data;
  },

  getToday: async () => {
    const response = await api.get<Schedule[]>('/operations/schedules/today/');
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get<Schedule[]>('/operations/schedules/upcoming/');
    return response.data;
  },

  getOverdue: async () => {
    const response = await api.get<Schedule[]>('/operations/schedules/overdue/');
    return response.data;
  },

  create: async (data: CreateScheduleData) => {
    const response = await api.post<Schedule>('/operations/schedules/', data);
    return response.data;
  },

  update: async (id: string, data: UpdateScheduleData) => {
    const response = await api.patch<Schedule>(`/operations/schedules/${id}/`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/operations/schedules/${id}/`);
  },

  start: async (id: string) => {
    const response = await api.post<Schedule>(`/operations/schedules/${id}/start/`);
    return response.data;
  },

  complete: async (id: string, data?: { customers_collected?: number; customers_missed?: number }) => {
    const response = await api.post<Schedule>(`/operations/schedules/${id}/complete/`, data);
    return response.data;
  },

  cancel: async (id: string, reason?: string) => {
    const response = await api.post<Schedule>(`/operations/schedules/${id}/cancel/`, { reason });
    return response.data;
  },

  markMissed: async (id: string) => {
    const response = await api.post<Schedule>(`/operations/schedules/${id}/mark_missed/`);
    return response.data;
  },
};
