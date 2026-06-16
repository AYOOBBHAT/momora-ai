import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env', () => ({
  env: {
    JWT_REFRESH_EXPIRES_IN: '30d',
  },
}));

import { getRefreshTokenExpiry } from '@/services/token.service';

describe('getRefreshTokenExpiry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a date 30 days in the future when JWT_REFRESH_EXPIRES_IN is 30d', () => {
    const expiry = getRefreshTokenExpiry();

    expect(expiry.toISOString()).toBe('2026-07-15T12:00:00.000Z');
  });
});
