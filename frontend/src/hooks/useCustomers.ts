/**
 * Customer Management Hooks
 * React Query hooks for customer data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerService, {
  type Customer,
  type CustomerListParams,
  type CreateCustomerData,
  type CustomerStats,
  type PaymentMethod,
  type CreatePaymentMethodData,
  type CustomerNote,
  type CreateCustomerNoteData,
} from '../services/customerService';

// Query Keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: CustomerListParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, 'stats'] as const,
  search: (query: string) => [...customerKeys.all, 'search', query] as const,
  paymentMethods: (customerId: string) => [...customerKeys.detail(customerId), 'payment-methods'] as const,
  notes: (customerId: string) => [...customerKeys.detail(customerId), 'notes'] as const,
};

// Customer Queries

/**
 * Hook to fetch customers list with pagination and filters
 */
export const useCustomers = (params?: CustomerListParams) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
  });
};

/**
 * Hook to fetch a single customer by ID
 */
export const useCustomer = (id: string, enabled = true) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomer(id),
    enabled: !!id && enabled,
  });
};

/**
 * Hook to fetch customer statistics
 */
export const useCustomerStats = () => {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => customerService.getCustomerStats(),
  });
};

/**
 * Hook to search customers
 */
export const useCustomerSearch = (query: string, enabled = true) => {
  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => customerService.searchCustomers(query),
    enabled: enabled && query.length > 0,
  });
};

/**
 * Hook to fetch customer's payment methods
 */
export const useCustomerPaymentMethods = (customerId: string, enabled = true) => {
  return useQuery({
    queryKey: customerKeys.paymentMethods(customerId),
    queryFn: () => customerService.getCustomerPaymentMethods(customerId),
    enabled: !!customerId && enabled,
  });
};

/**
 * Hook to fetch customer's notes
 */
export const useCustomerNotes = (customerId: string, enabled = true) => {
  return useQuery({
    queryKey: customerKeys.notes(customerId),
    queryFn: () => customerService.getCustomerNotes(customerId),
    enabled: !!customerId && enabled,
  });
};

// Customer Mutations

/**
 * Hook to create a new customer
 */
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerData) => customerService.createCustomer(data),
    onSuccess: () => {
      // Invalidate and refetch customers list and stats
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

/**
 * Hook to update a customer
 */
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCustomerData> }) =>
      customerService.updateCustomer(id, data),
    onSuccess: (data, variables) => {
      // Update the customer detail cache
      queryClient.setQueryData<Customer>(customerKeys.detail(variables.id), data);
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

/**
 * Hook to delete (soft delete) a customer
 */
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

/**
 * Hook to restore a deleted customer
 */
export const useRestoreCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.restoreCustomer(id),
    onSuccess: (response) => {
      queryClient.setQueryData<Customer>(customerKeys.detail(response.data.id), response.data);
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

/**
 * Hook to suspend a customer
 */
export const useSuspendCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.suspendCustomer(id),
    onSuccess: (response) => {
      queryClient.setQueryData<Customer>(customerKeys.detail(response.data.id), response.data);
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

/**
 * Hook to activate a customer
 */
export const useActivateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.activateCustomer(id),
    onSuccess: (response) => {
      queryClient.setQueryData<Customer>(customerKeys.detail(response.data.id), response.data);
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
  });
};

// Payment Method Mutations

/**
 * Hook to create a payment method
 */
export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentMethodData) => customerService.createPaymentMethod(data),
    onSuccess: (data) => {
      // Invalidate customer's payment methods
      queryClient.invalidateQueries({ queryKey: customerKeys.paymentMethods(data.customer) });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.customer) });
    },
  });
};

/**
 * Hook to update a payment method
 */
export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePaymentMethodData> }) =>
      customerService.updatePaymentMethod(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.paymentMethods(data.customer) });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.customer) });
    },
  });
};

/**
 * Hook to delete a payment method
 */
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) =>
      customerService.deletePaymentMethod(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.paymentMethods(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
    },
  });
};

/**
 * Hook to set payment method as default
 */
export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) =>
      customerService.setDefaultPaymentMethod(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.paymentMethods(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.customerId) });
    },
  });
};

// Customer Note Mutations

/**
 * Hook to create a customer note
 */
export const useCreateCustomerNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerNoteData) => customerService.createNote(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.notes(data.customer) });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(data.customer) });
    },
  });
};

/**
 * Hook to update a customer note
 */
export const useUpdateCustomerNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCustomerNoteData> }) =>
      customerService.updateNote(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.notes(data.customer) });
    },
  });
};

/**
 * Hook to delete a customer note
 */
export const useDeleteCustomerNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) =>
      customerService.deleteNote(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.notes(variables.customerId) });
    },
  });
};

/**
 * Hook to pin a customer note
 */
export const usePinCustomerNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) =>
      customerService.pinNote(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.notes(variables.customerId) });
    },
  });
};

/**
 * Hook to unpin a customer note
 */
export const useUnpinCustomerNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) =>
      customerService.unpinNote(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.notes(variables.customerId) });
    },
  });
};
