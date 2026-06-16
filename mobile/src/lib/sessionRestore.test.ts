import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { restoreSession } from './sessionRestore';

function createAuthError(status: number) {
  return new AxiosError('Unauthorized', status.toString(), undefined, undefined, {
    status,
    statusText: status === 401 ? 'Unauthorized' : 'Forbidden',
    data: {},
    headers: {},
    config: {} as never,
  });
}

describe('restoreSession', () => {
  const refresh = vi.fn();
  const getMe = vi.fn();
  const clearSession = vi.fn().mockResolvedValue(undefined);
  const setSessionOffline = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns no_session when refresh token is missing', async () => {
    const result = await restoreSession({
      refreshToken: null,
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('no_session');
    expect(refresh).not.toHaveBeenCalled();
    expect(clearSession).not.toHaveBeenCalled();
    expect(setSessionOffline).toHaveBeenCalledWith(false);
  });

  it('preserves session on offline startup when refresh fails with network error', async () => {
    refresh.mockResolvedValue({ ok: false, reason: 'network_error' });

    const result = await restoreSession({
      refreshToken: 'valid-refresh-token',
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('offline');
    expect(clearSession).not.toHaveBeenCalled();
    expect(getMe).not.toHaveBeenCalled();
    expect(setSessionOffline).toHaveBeenCalledWith(true);
  });

  it('restores session when access token is expired but refresh succeeds', async () => {
    refresh.mockResolvedValue({ ok: true, accessToken: 'new-access-token' });
    getMe.mockResolvedValue({ id: 'user-1' });

    const result = await restoreSession({
      refreshToken: 'valid-refresh-token',
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('restored');
    expect(refresh).toHaveBeenCalledOnce();
    expect(getMe).toHaveBeenCalledOnce();
    expect(clearSession).not.toHaveBeenCalled();
    expect(setSessionOffline).toHaveBeenCalledWith(false);
  });

  it('restores session when access token is missing but refresh token is valid', async () => {
    refresh.mockResolvedValue({ ok: true, accessToken: 'new-access-token' });
    getMe.mockResolvedValue({ id: 'user-1' });

    const result = await restoreSession({
      refreshToken: 'valid-refresh-token',
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('restored');
    expect(clearSession).not.toHaveBeenCalled();
  });

  it('clears session when refresh token is revoked', async () => {
    refresh.mockResolvedValue({ ok: false, reason: 'auth_failed' });

    const result = await restoreSession({
      refreshToken: 'revoked-refresh-token',
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('auth_failed');
    expect(clearSession).toHaveBeenCalledOnce();
    expect(getMe).not.toHaveBeenCalled();
    expect(setSessionOffline).toHaveBeenCalledWith(false);
  });

  it('clears session when getMe returns 401 after a successful refresh', async () => {
    refresh.mockResolvedValue({ ok: true, accessToken: 'new-access-token' });
    getMe.mockRejectedValue(createAuthError(401));

    const result = await restoreSession({
      refreshToken: 'valid-refresh-token',
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('auth_failed');
    expect(clearSession).toHaveBeenCalledOnce();
    expect(setSessionOffline).toHaveBeenCalledWith(false);
  });

  it('preserves session when getMe fails due to network error after refresh', async () => {
    refresh.mockResolvedValue({ ok: true, accessToken: 'new-access-token' });
    getMe.mockRejectedValue(new AxiosError('Network Error', 'ERR_NETWORK'));

    const result = await restoreSession({
      refreshToken: 'valid-refresh-token',
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('offline');
    expect(clearSession).not.toHaveBeenCalled();
    expect(setSessionOffline).toHaveBeenCalledWith(true);
  });

  it('supports long-lived sessions by refreshing before profile fetch', async () => {
    const callOrder: string[] = [];

    refresh.mockImplementation(async () => {
      callOrder.push('refresh');
      return { ok: true, accessToken: 'rotated-access-token' };
    });
    getMe.mockImplementation(async () => {
      callOrder.push('getMe');
      return { id: 'user-1', email: 'user@example.com' };
    });

    const result = await restoreSession({
      refreshToken: '30-day-refresh-token',
      refresh,
      getMe,
      clearSession,
      setSessionOffline,
    });

    expect(result).toBe('restored');
    expect(callOrder).toEqual(['refresh', 'getMe']);
  });
});
