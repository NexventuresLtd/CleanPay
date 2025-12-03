/**
 * Operations Management Hooks
 * React Query hooks for service areas, routes, collectors, and schedules
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  serviceAreaService,
  routeService,
  collectorService,
  scheduleService,
  type CreateServiceAreaData,
  type UpdateServiceAreaData,
  type CreateRouteData,
  type UpdateRouteData,
  type CreateCollectorData,
  type UpdateCollectorData,
  type CreateScheduleData,
  type UpdateScheduleData,
  type GenerateScheduleData,
} from '../services/operationsService';

// ============================================================================
// Query Keys
// ============================================================================

export const serviceAreaKeys = {
  all: ['serviceAreas'] as const,
  lists: () => [...serviceAreaKeys.all, 'list'] as const,
  list: (params?: { status?: string; province?: string; district?: string; search?: string }) => 
    [...serviceAreaKeys.lists(), params] as const,
  details: () => [...serviceAreaKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceAreaKeys.details(), id] as const,
  stats: () => [...serviceAreaKeys.all, 'stats'] as const,
  routes: (id: string) => [...serviceAreaKeys.detail(id), 'routes'] as const,
  collectors: (id: string) => [...serviceAreaKeys.detail(id), 'collectors'] as const,
};

export const routeKeys = {
  all: ['routes'] as const,
  lists: () => [...routeKeys.all, 'list'] as const,
  list: (params?: { status?: string; service_area?: string; frequency?: string; search?: string }) => 
    [...routeKeys.lists(), params] as const,
  details: () => [...routeKeys.all, 'detail'] as const,
  detail: (id: string) => [...routeKeys.details(), id] as const,
  customers: (id: string) => [...routeKeys.detail(id), 'customers'] as const,
  schedules: (id: string) => [...routeKeys.detail(id), 'schedules'] as const,
};

export const collectorKeys = {
  all: ['collectors'] as const,
  lists: () => [...collectorKeys.all, 'list'] as const,
  list: (params?: { status?: string; service_area?: string; employment_type?: string; search?: string }) => 
    [...collectorKeys.lists(), params] as const,
  details: () => [...collectorKeys.all, 'detail'] as const,
  detail: (id: string) => [...collectorKeys.details(), id] as const,
  available: () => [...collectorKeys.all, 'available'] as const,
  performance: (id: string) => [...collectorKeys.detail(id), 'performance'] as const,
  routes: (id: string) => [...collectorKeys.detail(id), 'routes'] as const,
  schedules: (id: string) => [...collectorKeys.detail(id), 'schedules'] as const,
};

export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (params?: { 
    status?: string; 
    route?: string; 
    collector?: string; 
    date_from?: string; 
    date_to?: string;
    search?: string;
  }) => [...scheduleKeys.lists(), params] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
  today: () => [...scheduleKeys.all, 'today'] as const,
  upcoming: () => [...scheduleKeys.all, 'upcoming'] as const,
  overdue: () => [...scheduleKeys.all, 'overdue'] as const,
  calendar: (year: number, month: number) => [...scheduleKeys.all, 'calendar', year, month] as const,
};

// ============================================================================
// Service Area Hooks
// ============================================================================

/**
 * Hook to fetch service areas list
 */
export const useServiceAreas = (params?: { status?: string; province?: string; district?: string; search?: string }) => {
  return useQuery({
    queryKey: serviceAreaKeys.list(params),
    queryFn: () => serviceAreaService.getAll(params),
  });
};

/**
 * Hook to fetch a single service area
 */
export const useServiceArea = (id: string, enabled = true) => {
  return useQuery({
    queryKey: serviceAreaKeys.detail(id),
    queryFn: () => serviceAreaService.getById(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch service area statistics
 */
export const useServiceAreaStats = () => {
  return useQuery({
    queryKey: serviceAreaKeys.stats(),
    queryFn: () => serviceAreaService.getStats(),
  });
};

/**
 * Hook to fetch routes for a service area
 */
export const useServiceAreaRoutes = (id: string, enabled = true) => {
  return useQuery({
    queryKey: serviceAreaKeys.routes(id),
    queryFn: () => serviceAreaService.getRoutes(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch collectors for a service area
 */
export const useServiceAreaCollectors = (id: string, enabled = true) => {
  return useQuery({
    queryKey: serviceAreaKeys.collectors(id),
    queryFn: () => serviceAreaService.getCollectors(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to create a service area
 */
export const useCreateServiceArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateServiceAreaData) => serviceAreaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.all });
    },
  });
};

/**
 * Hook to update a service area
 */
export const useUpdateServiceArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceAreaData }) => 
      serviceAreaService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.lists() });
    },
  });
};

/**
 * Hook to delete a service area
 */
export const useDeleteServiceArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceAreaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.all });
    },
  });
};

/**
 * Hook to activate a service area
 */
export const useActivateServiceArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceAreaService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.lists() });
    },
  });
};

/**
 * Hook to deactivate a service area
 */
export const useDeactivateServiceArea = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => serviceAreaService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.lists() });
    },
  });
};

// ============================================================================
// Route Hooks
// ============================================================================

/**
 * Hook to fetch routes list
 */
export const useRoutes = (params?: { status?: string; service_area?: string; frequency?: string; search?: string }) => {
  return useQuery({
    queryKey: routeKeys.list(params),
    queryFn: () => routeService.getAll(params),
  });
};

/**
 * Hook to fetch a single route
 */
export const useRoute = (id: string, enabled = true) => {
  return useQuery({
    queryKey: routeKeys.detail(id),
    queryFn: () => routeService.getById(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch schedules for a route
 */
export const useRouteSchedules = (id: string, enabled = true) => {
  return useQuery({
    queryKey: routeKeys.schedules(id),
    queryFn: () => routeService.getSchedules(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to create a route
 */
export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRouteData) => routeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.all });
    },
  });
};

/**
 * Hook to update a route
 */
export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRouteData }) => 
      routeService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: routeKeys.lists() });
    },
  });
};

/**
 * Hook to delete a route
 */
export const useDeleteRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => routeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceAreaKeys.all });
    },
  });
};

/**
 * Hook to assign collector to route
 */
export const useAssignCollectorToRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ routeId, collectorId }: { routeId: string; collectorId: string }) => 
      routeService.assignCollector(routeId, collectorId),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.detail(routeId) });
      queryClient.invalidateQueries({ queryKey: collectorKeys.all });
    },
  });
};

/**
 * Hook to generate schedules for a route
 */
export const useGenerateRouteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ routeId, data }: { routeId: string; data: GenerateScheduleData }) => 
      routeService.generateSchedule(routeId, data),
    onSuccess: (_, { routeId }) => {
      queryClient.invalidateQueries({ queryKey: routeKeys.schedules(routeId) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
};

// ============================================================================
// Collector Hooks
// ============================================================================

/**
 * Hook to fetch collectors list
 */
export const useCollectors = (params?: { status?: string; service_area?: string; employment_type?: string; search?: string }) => {
  return useQuery({
    queryKey: collectorKeys.list(params),
    queryFn: () => collectorService.getAll(params),
  });
};

/**
 * Hook to fetch a single collector
 */
export const useCollector = (id: string, enabled = true) => {
  return useQuery({
    queryKey: collectorKeys.detail(id),
    queryFn: () => collectorService.getById(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch available collectors
 */
export const useAvailableCollectors = (enabled = true) => {
  return useQuery({
    queryKey: collectorKeys.available(),
    queryFn: () => collectorService.getAvailable(),
    enabled,
  });
};

/**
 * Hook to fetch collector performance
 */
export const useCollectorPerformance = (id: string, enabled = true) => {
  return useQuery({
    queryKey: collectorKeys.performance(id),
    queryFn: () => collectorService.getPerformance(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch collector routes
 */
export const useCollectorRoutes = (id: string, enabled = true) => {
  return useQuery({
    queryKey: collectorKeys.routes(id),
    queryFn: () => collectorService.getRoutes(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch collector schedules
 */
export const useCollectorSchedules = (id: string, enabled = true) => {
  return useQuery({
    queryKey: collectorKeys.schedules(id),
    queryFn: () => collectorService.getSchedules(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to create a collector
 */
export const useCreateCollector = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCollectorData) => collectorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectorKeys.all });
    },
  });
};

/**
 * Hook to update a collector
 */
export const useUpdateCollector = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCollectorData }) => 
      collectorService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: collectorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collectorKeys.lists() });
    },
  });
};

/**
 * Hook to delete a collector
 */
export const useDeleteCollector = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => collectorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectorKeys.all });
    },
  });
};

/**
 * Hook to activate a collector
 */
export const useActivateCollector = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => collectorService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: collectorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collectorKeys.lists() });
    },
  });
};

/**
 * Hook to set collector on leave
 */
export const useSetCollectorOnLeave = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => collectorService.setOnLeave(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: collectorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collectorKeys.lists() });
    },
  });
};

/**
 * Hook to suspend a collector
 */
export const useSuspendCollector = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => collectorService.suspend(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: collectorKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: collectorKeys.lists() });
    },
  });
};

// ============================================================================
// Schedule Hooks
// ============================================================================

/**
 * Hook to fetch schedules list
 */
export const useSchedules = (params?: { 
  status?: string; 
  route?: string; 
  collector?: string; 
  date_from?: string; 
  date_to?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => scheduleService.getAll(params),
  });
};

/**
 * Hook to fetch a single schedule
 */
export const useSchedule = (id: string, enabled = true) => {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => scheduleService.getById(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch today's schedules
 */
export const useTodaySchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.today(),
    queryFn: () => scheduleService.getToday(),
  });
};

/**
 * Hook to fetch upcoming schedules
 */
export const useUpcomingSchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.upcoming(),
    queryFn: () => scheduleService.getUpcoming(),
  });
};

/**
 * Hook to fetch overdue schedules
 */
export const useOverdueSchedules = () => {
  return useQuery({
    queryKey: scheduleKeys.overdue(),
    queryFn: () => scheduleService.getOverdue(),
  });
};

/**
 * Hook to create a schedule
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateScheduleData) => scheduleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
};

/**
 * Hook to update a schedule
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleData }) => 
      scheduleService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};

/**
 * Hook to delete a schedule
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => scheduleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
    },
  });
};

/**
 * Hook to start a schedule
 */
export const useStartSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => scheduleService.start(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.today() });
    },
  });
};

/**
 * Hook to complete a schedule
 */
export const useCompleteSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { customers_collected: number; customers_missed: number; notes?: string } }) => 
      scheduleService.complete(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.today() });
    },
  });
};

/**
 * Hook to cancel a schedule
 */
export const useCancelSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      scheduleService.cancel(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};

/**
 * Hook to mark schedule as missed
 */
export const useMarkScheduleMissed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => scheduleService.markMissed(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.lists() });
    },
  });
};
