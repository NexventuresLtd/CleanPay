// Axios instance and API configuration

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const { access } = JSON.parse(tokens);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // If 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('tokens');
        if (tokens) {
          const { refresh } = JSON.parse(tokens);
          
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh,
          });

          const { access } = response.data;
          
          // Update stored tokens
          const updatedTokens = { access, refresh };
          localStorage.setItem('tokens', JSON.stringify(updatedTokens));

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const responseData = axiosError.response?.data as Record<string, unknown> | undefined;
    
    // Handle Django REST Framework validation errors
    if (responseData && typeof responseData === 'object') {
      // Check if it's a DRF validation error (field: [errors] format)
      const fieldErrors: string[] = [];
      let hasFieldErrors = false;
      
      for (const [field, errors] of Object.entries(responseData)) {
        if (Array.isArray(errors)) {
          hasFieldErrors = true;
          errors.forEach((err: string) => {
            // Capitalize field name and format nicely
            const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (field === 'non_field_errors' || field === 'detail') {
              fieldErrors.push(err);
            } else {
              fieldErrors.push(`${fieldName}: ${err}`);
            }
          });
        } else if (typeof errors === 'string') {
          hasFieldErrors = true;
          if (field === 'detail' || field === 'message') {
            fieldErrors.push(errors);
          } else {
            const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            fieldErrors.push(`${fieldName}: ${errors}`);
          }
        }
      }
      
      if (hasFieldErrors && fieldErrors.length > 0) {
        return {
          message: fieldErrors.join('\n'),
          errors: responseData as Record<string, string[]>,
          status: axiosError.response?.status || 400,
        };
      }
      
      // Check for common error message fields
      if (responseData.message && typeof responseData.message === 'string') {
        return {
          message: responseData.message,
          errors: responseData.errors as Record<string, string[]> | undefined,
          status: axiosError.response?.status || 500,
        };
      }
      
      if (responseData.detail && typeof responseData.detail === 'string') {
        return {
          message: responseData.detail,
          status: axiosError.response?.status || 500,
        };
      }
    }
    
    return {
      message: axiosError.message || 'An error occurred',
      status: axiosError.response?.status || 500,
    };
  }
  return {
    message: 'An unexpected error occurred',
    status: 500,
  };
};

export default api;
