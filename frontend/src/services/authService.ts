// Authentication API service

import api, { handleApiError } from './api';
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  ChangePassword,
} from '../types';

const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login/', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/register/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/users/me/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Logout user
   */
  logout: async (refreshToken: string): Promise<void> => {
    try {
      await api.post('/auth/logout/logout/', { refresh_token: refreshToken });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    try {
      const response = await api.post<{ access: string }>('/auth/token/refresh/', {
        refresh: refreshToken,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    try {
      const response = await api.post('/auth/password-reset/request_reset/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Confirm password reset
   */
  confirmPasswordReset: async (data: PasswordResetConfirm): Promise<{ message: string }> => {
    try {
      const response = await api.post('/auth/password-reset/confirm_reset/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePassword): Promise<{ message: string }> => {
    try {
      const response = await api.post('/users/change_password/', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default authService;
