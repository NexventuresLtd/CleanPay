/**
 * Customer Portal Hooks
 * React Query hooks for customer portal data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerPortalService, {
  type UpdateProfileData,
  type CustomerPortalPaymentMethod,
} from '../services/customerPortalService';

// ============================================================================
// Query Keys
// ============================================================================

export const portalKeys = {
  all: ['portal'] as const,
  dashboard: () => [...portalKeys.all, 'dashboard'] as const,
  profile: () => [...portalKeys.all, 'profile'] as const,
  paymentMethods: () => [...portalKeys.all, 'payment-methods'] as const,
  schedules: (params?: object) => [...portalKeys.all, 'schedules', params] as const,
  invoices: (params?: object) => [...portalKeys.all, 'invoices', params] as const,
  payments: (params?: object) => [...portalKeys.all, 'payments', params] as const,
};

// ============================================================================
// Dashboard Hooks
// ============================================================================

/**
 * Hook to fetch customer portal dashboard data
 */
export const usePortalDashboard = () => {
  return useQuery({
    queryKey: portalKeys.dashboard(),
    queryFn: () => customerPortalService.getDashboard(),
  });
};

// ============================================================================
// Profile Hooks
// ============================================================================

/**
 * Hook to fetch customer profile
 */
export const usePortalProfile = () => {
  return useQuery({
    queryKey: portalKeys.profile(),
    queryFn: () => customerPortalService.getProfile(),
  });
};

/**
 * Hook to update customer profile
 */
export const useUpdatePortalProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileData) => customerPortalService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalKeys.profile() });
      queryClient.invalidateQueries({ queryKey: portalKeys.dashboard() });
    },
  });
};

// ============================================================================
// Payment Methods Hooks
// ============================================================================

/**
 * Hook to fetch customer payment methods
 */
export const usePortalPaymentMethods = () => {
  return useQuery({
    queryKey: portalKeys.paymentMethods(),
    queryFn: () => customerPortalService.getPaymentMethods(),
  });
};

/**
 * Hook to add a new payment method
 */
export const useAddPortalPaymentMethod = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<CustomerPortalPaymentMethod>) => customerPortalService.addPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portalKeys.paymentMethods() });
      queryClient.invalidateQueries({ queryKey: portalKeys.dashboard() });
    },
  });
};

// ============================================================================
// Schedules Hooks
// ============================================================================

/**
 * Hook to fetch customer schedules
 */
export const usePortalSchedules = (params?: { status?: string; date?: 'upcoming' | 'past' | 'today' }) => {
  return useQuery({
    queryKey: portalKeys.schedules(params),
    queryFn: () => customerPortalService.getSchedules(params),
  });
};

/**
 * Hook to fetch upcoming schedules only
 */
export const usePortalUpcomingSchedules = () => {
  return useQuery({
    queryKey: portalKeys.schedules({ date: 'upcoming' }),
    queryFn: () => customerPortalService.getSchedules({ date: 'upcoming' }),
  });
};

/**
 * Hook to fetch today's schedules
 */
export const usePortalTodaySchedules = () => {
  return useQuery({
    queryKey: portalKeys.schedules({ date: 'today' }),
    queryFn: () => customerPortalService.getSchedules({ date: 'today' }),
  });
};

// ============================================================================
// Invoices Hooks
// ============================================================================

/**
 * Hook to fetch customer invoices
 */
export const usePortalInvoices = (params?: { status?: string }) => {
  return useQuery({
    queryKey: portalKeys.invoices(params),
    queryFn: () => customerPortalService.getInvoices(params),
  });
};

// ============================================================================
// Payments Hooks
// ============================================================================

/**
 * Hook to fetch customer payment history
 */
export const usePortalPayments = (params?: { status?: string }) => {
  return useQuery({
    queryKey: portalKeys.payments(params),
    queryFn: () => customerPortalService.getPayments(params),
  });
};
