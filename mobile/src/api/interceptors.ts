import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { apiClient } from './client';
import { CLIENT_PLATFORM_HEADER, CLIENT_PLATFORM_VALUE } from '../lib/constants';
import { performTokenRefresh } from '../lib/tokenRefresh';
import { useAuthStore } from '../stores/auth.store';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: ReturnType<typeof performTokenRefresh> | null = null;

async function refreshAccessTokenForRequest(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  const result = await refreshPromise;

  if (result.ok) {
    return result.accessToken;
  }

  if (result.reason === 'auth_failed' || result.reason === 'missing_refresh') {
    await useAuthStore.getState().clearSession();
  }

  return null;
}

export function setupInterceptors(): void {
  apiClient.interceptors.request.use((config) => {
    config.headers[CLIENT_PLATFORM_HEADER] = CLIENT_PLATFORM_VALUE;

    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const newAccessToken = await refreshAccessTokenForRequest();
      if (!newAccessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    },
  );
}
