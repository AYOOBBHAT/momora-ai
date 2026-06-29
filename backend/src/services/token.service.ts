import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '@/config/env';
import { JwtPayload, PasswordResetJwtPayload } from '@/types';
import { ApiError } from '@/utils/ApiError';
import { HTTP_STATUS } from '@/constants/httpStatus';

const PASSWORD_RESET_TOKEN_EXPIRES_IN = '15m';

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as SignOptions);
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload & {
    purpose?: string;
  };

  if (payload.purpose === 'password_reset' || typeof payload.role !== 'string') {
    throw new jwt.JsonWebTokenError('Invalid access token');
  }

  return payload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export function signPasswordResetToken(payload: Omit<PasswordResetJwtPayload, 'purpose'>): string {
  const resetPayload: PasswordResetJwtPayload = {
    ...payload,
    purpose: 'password_reset',
  };

  return jwt.sign(resetPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: PASSWORD_RESET_TOKEN_EXPIRES_IN,
  } as SignOptions);
}

export function verifyPasswordResetToken(token: string): PasswordResetJwtPayload {
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as PasswordResetJwtPayload;

    if (payload.purpose !== 'password_reset' || !payload.sub || !payload.email) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset session.');
    }

    return payload;
  } catch {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset session.');
  }
}

export function getRefreshTokenExpiry(): Date {
  const expiresIn = env.JWT_REFRESH_EXPIRES_IN;
  const now = new Date();

  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'd':
      return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
    case 'h':
      return new Date(now.getTime() + value * 60 * 60 * 1000);
    case 'm':
      return new Date(now.getTime() + value * 60 * 1000);
    case 's':
      return new Date(now.getTime() + value * 1000);
    default:
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
}
