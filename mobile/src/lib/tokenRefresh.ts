import axios from 'axios';

import { env } from '../config/env';
import { ApiResponse, MobileAuthData } from '../api/types';
import {
  API_VERSION_PATH,
  CLIENT_PLATFORM_HEADER,
  CLIENT_PLATFORM_VALUE,
} from './constants';
import { isAuthHttpError } from './apiError';
import { useAuthStore } from '../stores/auth.store';
import * as secureStorage from './secureStorage';

export type TokenRefreshResult =
  | { ok: true; accessToken: string }
  | { ok: false; reason: 'missing_refresh' | 'auth_failed' | 'network_error' };

const refreshClient = axios.create({
  baseURL: `${env.apiUrl}${API_VERSION_PATH}`,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    [CLIENT_PLATFORM_HEADER]: CLIENT_PLATFORM_VALUE,
  },
});

export async function performTokenRefresh(): Promise<TokenRefreshResult> {
  const refreshToken =
    useAuthStore.getState().refreshToken ?? (await secureStorage.getRefreshToken());

  if (!refreshToken) {
    return { ok: false, reason: 'missing_refresh' };
  }

  try {
    const { data } = await refreshClient.post<ApiResponse<MobileAuthData>>('/auth/refresh', {
      refreshToken,
    });

    if (!data.success || !data.data) {
      return { ok: false, reason: 'auth_failed' };
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data;
    await useAuthStore.getState().setSession(accessToken, newRefreshToken);
    return { ok: true, accessToken };
  } catch (error) {
    if (isAuthHttpError(error)) {
      return { ok: false, reason: 'auth_failed' };
    }

    return { ok: false, reason: 'network_error' };
  }
}
