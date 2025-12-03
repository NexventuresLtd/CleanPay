// User API service

import api, { handleApiError } from './api';
import type { User, UserUpdateData, UserCreateData, PaginatedResponse, Role, AuditLog } from '../types';

const userService = {
  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/users/me/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UserUpdateData): Promise<User> => {
    try {
      const response = await api.patch<User>('/users/update_profile/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all users (paginated)
   */
  getAllUsers: async (params?: Record<string, any>): Promise<PaginatedResponse<User>> => {
    try {
      const response = await api.get<PaginatedResponse<User>>('/users/', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${id}/`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create new user
   */
  createUser: async (data: UserCreateData): Promise<User> => {
    try {
      const response = await api.post<User>('/users/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: Partial<UserUpdateData>): Promise<User> => {
    try {
      const response = await api.patch<User>(`/users/${id}/`, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}/`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update user role
   */
  updateUserRole: async (id: string, roleId: string): Promise<User> => {
    try {
      const response = await api.patch<User>(`/users/${id}/update_role/`, { role_id: roleId });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get all roles
   */
  getRoles: async (): Promise<Role[]> => {
    try {
      const response = await api.get<Role[]>('/roles/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get audit logs
   */
  getAuditLogs: async (params?: Record<string, any>): Promise<PaginatedResponse<AuditLog>> => {
    try {
      const response = await api.get<PaginatedResponse<AuditLog>>('/audit-logs/', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default userService;
