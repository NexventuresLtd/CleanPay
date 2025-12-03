/**
 * Collector Portal Hooks
 * React Query hooks for collector portal data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import collectorPortalService from '../services/collectorPortalService';
import type {
  CollectorDashboard,
  SchedulesResponse,
  CollectorScheduleDetail,
  RoutesResponse,
  CollectorProfile,
  CompleteScheduleData,
  LocationUpdateData,
} from '../services/collectorPortalService';

// Query Keys
export const collectorPortalKeys = {
  all: ['collector-portal'] as const,
  dashboard: () => [...collectorPortalKeys.all, 'dashboard'] as const,
  schedules: () => [...collectorPortalKeys.all, 'schedules'] as const,
  schedulesList: (filters?: { date?: string; status?: string }) =>
    [...collectorPortalKeys.schedules(), filters] as const,
  scheduleDetail: (id: string) => [...collectorPortalKeys.schedules(), id] as const,
  routes: () => [...collectorPortalKeys.all, 'routes'] as const,
  profile: () => [...collectorPortalKeys.all, 'profile'] as const,
};

/**
 * Hook to fetch collector dashboard data
 */
export function useCollectorDashboard() {
  return useQuery<CollectorDashboard>({
    queryKey: collectorPortalKeys.dashboard(),
    queryFn: () => collectorPortalService.getDashboard(),
  });
}

/**
 * Hook to fetch collector's schedules
 */
export function useCollectorSchedules(filters?: {
  date?: 'today' | 'upcoming' | 'past' | 'week';
  status?: string;
}) {
  return useQuery<SchedulesResponse>({
    queryKey: collectorPortalKeys.schedulesList(filters),
    queryFn: () => collectorPortalService.getSchedules(filters),
  });
}

/**
 * Hook to fetch a specific schedule detail
 */
export function useCollectorScheduleDetail(scheduleId: string) {
  return useQuery<CollectorScheduleDetail>({
    queryKey: collectorPortalKeys.scheduleDetail(scheduleId),
    queryFn: () => collectorPortalService.getScheduleDetail(scheduleId),
    enabled: !!scheduleId,
  });
}

/**
 * Hook to fetch collector's assigned routes
 */
export function useCollectorRoutes() {
  return useQuery<RoutesResponse>({
    queryKey: collectorPortalKeys.routes(),
    queryFn: () => collectorPortalService.getRoutes(),
  });
}

/**
 * Hook to fetch collector's profile
 */
export function useCollectorProfile() {
  return useQuery<CollectorProfile>({
    queryKey: collectorPortalKeys.profile(),
    queryFn: () => collectorPortalService.getProfile(),
  });
}

/**
 * Hook to start a collection schedule
 */
export function useStartSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => collectorPortalService.startSchedule(scheduleId),
    onSuccess: () => {
      // Invalidate all schedule-related queries
      queryClient.invalidateQueries({ queryKey: collectorPortalKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: collectorPortalKeys.schedules() });
    },
  });
}

/**
 * Hook to complete a collection schedule
 */
export function useCompleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduleId, data }: { scheduleId: string; data: CompleteScheduleData }) =>
      collectorPortalService.completeSchedule(scheduleId, data),
    onSuccess: () => {
      // Invalidate all schedule-related queries and profile (total_collections updates)
      queryClient.invalidateQueries({ queryKey: collectorPortalKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: collectorPortalKeys.schedules() });
      queryClient.invalidateQueries({ queryKey: collectorPortalKeys.profile() });
    },
  });
}

/**
 * Hook to update collector's location
 */
export function useUpdateLocation() {
  return useMutation({
    mutationFn: (data: LocationUpdateData) => collectorPortalService.updateLocation(data),
  });
}
