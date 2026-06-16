import { isAuthHttpError } from './apiError';
import type { TokenRefreshResult } from './tokenRefresh';

export type SessionRestoreResult = 'no_session' | 'restored' | 'offline' | 'auth_failed';

export interface SessionRestoreDeps {
  refreshToken: string | null;
  refresh: () => Promise<TokenRefreshResult>;
  getMe: () => Promise<unknown>;
  clearSession: () => Promise<void>;
  setSessionOffline: (offline: boolean) => void;
}

export async function restoreSession(deps: SessionRestoreDeps): Promise<SessionRestoreResult> {
  if (!deps.refreshToken) {
    deps.setSessionOffline(false);
    return 'no_session';
  }

  const refreshResult = await deps.refresh();

  if (!refreshResult.ok) {
    if (refreshResult.reason === 'auth_failed' || refreshResult.reason === 'missing_refresh') {
      await deps.clearSession();
      deps.setSessionOffline(false);
      return 'auth_failed';
    }

    deps.setSessionOffline(true);
    return 'offline';
  }

  try {
    await deps.getMe();
    deps.setSessionOffline(false);
    return 'restored';
  } catch (error) {
    if (isAuthHttpError(error)) {
      await deps.clearSession();
      deps.setSessionOffline(false);
      return 'auth_failed';
    }

    deps.setSessionOffline(true);
    return 'offline';
  }
}
