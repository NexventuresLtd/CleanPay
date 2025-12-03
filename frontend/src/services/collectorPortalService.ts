/**
 * Collector Portal Service
 * API client for collector portal endpoints
 */

import api from './api';

// Types
export interface CollectorProfile {
  id: string | null;
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string | null;
  employment_type?: string;
  hire_date?: string;
  status: string;
  rating: number;
  total_collections: number;
  assigned_routes_count?: number;
  service_areas?: Array<{ id: string; name: string }>;
  message?: string;
}

export interface CollectorDashboard {
  collector: CollectorProfile;
  summary: {
    today_schedules: number;
    pending_pickups: number;
    completed_today: number;
    assigned_routes: number;
  };
  today_schedules: CollectorSchedule[];
  upcoming_schedules?: CollectorSchedule[];
  message?: string;
}

export interface CollectorSchedule {
  id: string;
  route_id: string;
  route_name: string;
  route_code?: string;
  service_area_name?: string;
  scheduled_date: string;
  scheduled_time_start: string;
  scheduled_time_end: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'missed';
  customers_scheduled: number;
  customers_collected: number;
  customers_missed: number;
  actual_start_time?: string | null;
  actual_end_time?: string | null;
  notes?: string;
  route_latitude?: number | null;
  route_longitude?: number | null;
}

export interface CollectorScheduleDetail extends CollectorSchedule {
  route: {
    id: string;
    name: string;
    code: string;
    description?: string;
    estimated_distance_km: number;
    estimated_duration_minutes: number;
    path_geojson?: object;
  };
  service_area: {
    id: string | null;
    name: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  customers: Array<{
    id: string;
    name: string;
    company_name?: string;
    phone?: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
  }>;
}

export interface CollectorRoute {
  id: string;
  name: string;
  code: string;
  description?: string;
  service_area_id?: string;
  service_area_name?: string;
  estimated_distance_km: number;
  estimated_duration_minutes: number;
  frequency: string;
  collection_days: string[];
  collection_time_start: string;
  collection_time_end: string;
  customers_count: number;
  path_geojson?: object;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SchedulesResponse {
  count: number;
  results: CollectorSchedule[];
  message?: string;
}

export interface RoutesResponse {
  count: number;
  results: CollectorRoute[];
  message?: string;
}

export interface ScheduleActionResponse {
  message: string;
  id: string;
  status: string;
  actual_start_time?: string;
  actual_end_time?: string;
}

export interface CompleteScheduleData {
  customers_collected: number;
  customers_missed: number;
  notes?: string;
}

export interface LocationUpdateData {
  latitude: number;
  longitude: number;
}

export interface LocationUpdateResponse {
  message: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

// API Functions
const collectorPortalService = {
  /**
   * Get collector dashboard data
   */
  getDashboard: async (): Promise<CollectorDashboard> => {
    const response = await api.get('/operations/collector-portal/dashboard/');
    return response.data;
  },

  /**
   * Get collector's schedules
   */
  getSchedules: async (params?: {
    date?: 'today' | 'upcoming' | 'past' | 'week';
    status?: string;
  }): Promise<SchedulesResponse> => {
    const response = await api.get('/operations/collector-portal/schedules/', { params });
    return response.data;
  },

  /**
   * Get schedule details by ID
   */
  getScheduleDetail: async (scheduleId: string): Promise<CollectorScheduleDetail> => {
    const response = await api.get(`/operations/collector-portal/schedules/${scheduleId}/`);
    return response.data;
  },

  /**
   * Start a scheduled collection
   */
  startSchedule: async (scheduleId: string): Promise<ScheduleActionResponse> => {
    const response = await api.post(`/operations/collector-portal/schedules/${scheduleId}/start/`);
    return response.data;
  },

  /**
   * Complete a collection schedule
   */
  completeSchedule: async (
    scheduleId: string,
    data: CompleteScheduleData
  ): Promise<ScheduleActionResponse> => {
    const response = await api.post(
      `/operations/collector-portal/schedules/${scheduleId}/complete/`,
      data
    );
    return response.data;
  },

  /**
   * Get collector's assigned routes
   */
  getRoutes: async (): Promise<RoutesResponse> => {
    const response = await api.get('/operations/collector-portal/routes/');
    return response.data;
  },

  /**
   * Update collector's current location
   */
  updateLocation: async (data: LocationUpdateData): Promise<LocationUpdateResponse> => {
    const response = await api.post('/operations/collector-portal/location/', data);
    return response.data;
  },

  /**
   * Get collector's profile
   */
  getProfile: async (): Promise<CollectorProfile> => {
    const response = await api.get('/operations/collector-portal/profile/');
    return response.data;
  },
};

export default collectorPortalService;
