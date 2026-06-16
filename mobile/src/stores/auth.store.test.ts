import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/secureStorage', () => ({
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  saveTokens: vi.fn(),
  clearTokens: vi.fn(),
}));

import * as secureStorage from '../lib/secureStorage';
import { useAuthStore } from './auth.store';

describe('useAuthStore hydration', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,
      isSessionOffline: false,
    });
    vi.clearAllMocks();
  });

  it('treats refresh token as the source of truth for authentication', async () => {
    vi.mocked(secureStorage.getAccessToken).mockResolvedValue(null);
    vi.mocked(secureStorage.getRefreshToken).mockResolvedValue('refresh-token');

    await useAuthStore.getState().hydrate();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.refreshToken).toBe('refresh-token');
    expect(state.accessToken).toBeNull();
    expect(state.isHydrated).toBe(true);
  });

  it('does not authenticate when only an access token is present', async () => {
    vi.mocked(secureStorage.getAccessToken).mockResolvedValue('access-token');
    vi.mocked(secureStorage.getRefreshToken).mockResolvedValue(null);

    await useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('authenticates when both tokens are present', async () => {
    vi.mocked(secureStorage.getAccessToken).mockResolvedValue('access-token');
    vi.mocked(secureStorage.getRefreshToken).mockResolvedValue('refresh-token');

    await useAuthStore.getState().hydrate();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
