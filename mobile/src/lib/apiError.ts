import { AxiosError } from 'axios';

import type { ApiResponse } from '../api/types';

export function isAuthHttpError(error: unknown): boolean {
  if (!(error instanceof AxiosError) || !error.response) {
    return false;
  }

  const status = error.response.status;
  return status === 401 || status === 403;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response;
  }

  return false;
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.message) {
      return data.message;
    }
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
