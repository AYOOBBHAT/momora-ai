import crypto from 'crypto';

import bcrypt from 'bcryptjs';

import { env } from '@/config/env';
import { User, IUserDocument } from '@/models/User.model';
import { RefreshToken, hashToken } from '@/models/RefreshToken.model';
import { sendPasswordResetOtpEmail } from '@/services/email.service';
import {
  signPasswordResetToken,
  verifyPasswordResetToken,
} from '@/services/token.service';
import { ApiError } from '@/utils/ApiError';
import { HTTP_STATUS } from '@/constants/httpStatus';

export const PASSWORD_RESET_GENERIC_MESSAGE =
  'If an account exists for this email, a verification code has been sent.';

const OTP_BCRYPT_ROUNDS = 10;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getOtpExpiryDate(): Date {
  return new Date(Date.now() + env.PASSWORD_RESET_OTP_EXPIRES_MINUTES * 60 * 1000);
}

function getResendCooldownMs(): number {
  return env.PASSWORD_RESET_RESEND_COOLDOWN_SECONDS * 1000;
}

async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, OTP_BCRYPT_ROUNDS);
}

async function verifyOtpHash(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

function generateSecureOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function clearPasswordResetFields(user: IUserDocument): void {
  user.passwordResetOtpHash = undefined;
  user.passwordResetOtpExpiresAt = undefined;
  user.passwordResetAttempts = 0;
  user.passwordResetSessionHash = undefined;
}

async function timingSafeDelay(): Promise<void> {
  const delayMs = 120 + crypto.randomInt(0, 180);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function requestPasswordReset(email: string): Promise<void> {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetAttempts +passwordResetRequestedAt',
  );

  if (!user || user.provider !== 'local') {
    await timingSafeDelay();
    return;
  }

  if (user.passwordResetRequestedAt) {
    const elapsed = Date.now() - user.passwordResetRequestedAt.getTime();
    if (elapsed < getResendCooldownMs()) {
      return;
    }
  }

  const otp = generateSecureOtp();
  const otpHash = await hashOtp(otp);

  user.passwordResetOtpHash = otpHash;
  user.passwordResetOtpExpiresAt = getOtpExpiryDate();
  user.passwordResetAttempts = 0;
  user.passwordResetSessionHash = undefined;
  user.passwordResetRequestedAt = new Date();
  await user.save();

  try {
    await sendPasswordResetOtpEmail(normalizedEmail, otp);
  } catch (error) {
    clearPasswordResetFields(user);
    user.passwordResetRequestedAt = undefined;
    await user.save();
    throw error;
  }
}

export async function verifyResetOtp(
  email: string,
  otp: string,
): Promise<{ resetToken: string }> {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetAttempts',
  );

  if (!user || user.provider !== 'local' || !user.passwordResetOtpHash) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired verification code.');
  }

  if ((user.passwordResetAttempts ?? 0) >= env.PASSWORD_RESET_MAX_ATTEMPTS) {
    throw new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Too many attempts. Please request a new code.',
    );
  }

  if (!user.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
    clearPasswordResetFields(user);
    await user.save();
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Verification code has expired. Please request a new one.',
    );
  }

  const isValid = await verifyOtpHash(otp, user.passwordResetOtpHash);
  if (!isValid) {
    user.passwordResetAttempts = (user.passwordResetAttempts ?? 0) + 1;
    await user.save();
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid verification code.');
  }

  clearPasswordResetFields(user);

  const resetToken = signPasswordResetToken({
    sub: user._id.toString(),
    email: user.email,
  });

  user.passwordResetSessionHash = hashToken(resetToken);
  await user.save();

  return { resetToken };
}

export async function resetPasswordWithToken(
  email: string,
  password: string,
  resetToken: string,
): Promise<void> {
  const normalizedEmail = normalizeEmail(email);
  const payload = verifyPasswordResetToken(resetToken);

  if (payload.email !== normalizedEmail) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset session.');
  }

  const user = await User.findById(payload.sub).select(
    '+password +passwordResetSessionHash',
  );

  if (!user || user.provider !== 'local' || user.email !== normalizedEmail) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset session.');
  }

  const sessionHash = hashToken(resetToken);
  if (!user.passwordResetSessionHash || user.passwordResetSessionHash !== sessionHash) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset session.');
  }

  user.password = password;
  clearPasswordResetFields(user);
  await user.save();

  await RefreshToken.updateMany(
    { userId: user._id, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}
