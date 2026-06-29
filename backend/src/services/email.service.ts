import { Resend } from 'resend';

import { env } from '@/config/env';
import { ApiError } from '@/utils/ApiError';
import { HTTP_STATUS } from '@/constants/httpStatus';
import {
  buildPasswordResetEmailHtml,
  buildPasswordResetEmailText,
} from '@/templates/passwordResetEmail';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!env.RESEND_API_KEY) {
    throw new ApiError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      'Email delivery is not configured. Please try again later.',
    );
  }

  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }

  return resendClient;
}

export async function sendPasswordResetOtpEmail(to: string, otp: string): Promise<void> {
  const from = env.EMAIL_FROM ?? 'Memora <onboarding@resend.dev>';
  const expiresMinutes = env.PASSWORD_RESET_OTP_EXPIRES_MINUTES;

  const { error } = await getResendClient().emails.send({
    from,
    to,
    subject: 'Your Memora password reset code',
    html: buildPasswordResetEmailHtml(otp, expiresMinutes),
    text: buildPasswordResetEmailText(otp, expiresMinutes),
  });

  if (error) {
    throw new ApiError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      'Unable to send verification email. Please try again later.',
    );
  }
}
