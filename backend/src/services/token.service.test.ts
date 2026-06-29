import { describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import { verifyAccessToken } from '@/services/token.service';

describe('token.service access token guard', () => {
  it('rejects password reset tokens presented as access tokens', () => {
    const resetToken = jwt.sign(
      {
        sub: 'user-id',
        email: 'user@example.com',
        purpose: 'password_reset',
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    expect(() => verifyAccessToken(resetToken)).toThrow();
  });
});
