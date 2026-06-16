import { create } from 'zustand';

import * as secureStorage from '../lib/secureStorage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isSessionOffline: boolean;
  hydrate: () => Promise<void>;
  setSession: (accessToken: string, refreshToken: string) => Promise<void>;
  setSessionOffline: (offline: boolean) => void;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,
  isSessionOffline: false,

  hydrate: async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        secureStorage.getAccessToken(),
        secureStorage.getRefreshToken(),
      ]);

      set({
        accessToken,
        refreshToken,
        isAuthenticated: Boolean(refreshToken),
        isHydrated: true,
        isSessionOffline: false,
      });
    } catch {
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isHydrated: true,
        isSessionOffline: false,
      });
    }
  },

  setSession: async (accessToken, refreshToken) => {
    await secureStorage.saveTokens(accessToken, refreshToken);
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isSessionOffline: false,
    });
  },

  setSessionOffline: (offline) => {
    set({ isSessionOffline: offline });
  },

  clearSession: async () => {
    await secureStorage.clearTokens();
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isSessionOffline: false,
    });
  },
}));
