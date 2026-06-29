import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/utils/ApiError';
import { HTTP_STATUS } from '@/constants/httpStatus';

function chainable<T>(value: T) {
  return {
    select: vi.fn().mockResolvedValue(value),
  };
}

vi.mock('@/models/User.model', () => ({
  User: {
    findOne: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('@/models/RefreshToken.model', () => ({
  RefreshToken: {
    updateMany: vi.fn(),
  },
  hashToken: (token: string) => {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(token).digest('hex');
  },
}));

vi.mock('@/services/email.service', () => ({
  sendPasswordResetOtpEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/services/token.service', () => ({
  signPasswordResetToken: vi.fn().mockReturnValue('reset-token'),
  verifyPasswordResetToken: vi.fn(),
}));

import { User } from '@/models/User.model';
import { RefreshToken } from '@/models/RefreshToken.model';
import { sendPasswordResetOtpEmail } from '@/services/email.service';
import {
  requestPasswordReset,
  verifyResetOtp,
  resetPasswordWithToken,
} from '@/services/passwordReset.service';
import { verifyPasswordResetToken } from '@/services/token.service';

describe('passwordReset.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not send email for unknown addresses', async () => {
    vi.mocked(User.findOne).mockReturnValue(chainable(null) as never);

    await requestPasswordReset('missing@example.com');

    expect(sendPasswordResetOtpEmail).not.toHaveBeenCalled();
  });

  it('stores hashed otp and sends email for local users', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    vi.mocked(User.findOne).mockReturnValue(
      chainable({
        provider: 'local',
        email: 'user@example.com',
        passwordResetRequestedAt: null,
        save,
      }) as never,
    );

    await requestPasswordReset('user@example.com');

    expect(save).toHaveBeenCalled();
    expect(sendPasswordResetOtpEmail).toHaveBeenCalledWith(
      'user@example.com',
      expect.stringMatching(/^\d{6}$/),
    );
  });

  it('rejects invalid otp', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    vi.mocked(User.findOne).mockReturnValue(
      chainable({
        provider: 'local',
        email: 'user@example.com',
        passwordResetOtpHash: '$2a$10$invalidhashvalue',
        passwordResetOtpExpiresAt: new Date(Date.now() + 60_000),
        passwordResetAttempts: 0,
        save,
      }) as never,
    );

    const bcrypt = await import('bcryptjs');
    vi.spyOn(bcrypt.default, 'compare').mockResolvedValue(false as never);

    await expect(verifyResetOtp('user@example.com', '123456')).rejects.toBeInstanceOf(ApiError);
    await expect(verifyResetOtp('user@example.com', '123456')).rejects.toMatchObject({
      statusCode: HTTP_STATUS.BAD_REQUEST,
    });
  });

  it('resets password and revokes refresh tokens', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    vi.mocked(verifyPasswordResetToken).mockReturnValue({
      sub: 'user-id',
      email: 'user@example.com',
      purpose: 'password_reset',
    });
    vi.mocked(User.findById).mockReturnValue(
      chainable({
        _id: 'user-id',
        email: 'user@example.com',
        provider: 'local',
        password: 'old',
        passwordResetSessionHash: (await import('crypto'))
          .createHash('sha256')
          .update('reset-token')
          .digest('hex'),
        save,
      }) as never,
    );

    await resetPasswordWithToken('user@example.com', 'NewPass123', 'reset-token');

    expect(save).toHaveBeenCalled();
    expect(RefreshToken.updateMany).toHaveBeenCalled();
  });
});
