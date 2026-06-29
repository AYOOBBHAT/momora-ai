import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerUser,
  loginUser,
  googleAuthHandler,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  forgotPasswordHandler,
  verifyResetOtpHandler,
  resetPasswordHandler,
} from '@/controllers/auth.controller';
import { validate } from '@/middleware/validate.middleware';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  refreshTokenBodySchema,
  logoutBodySchema,
  forgotPasswordSchema,
  verifyResetOtpSchema,
  resetPasswordSchema,
} from '@/validators/auth.validator';
import { authenticate, authenticateOptional } from '@/middleware/auth.middleware';
import { isMobileRefreshRequest, isMobileLogoutRequest } from '@/utils/clientPlatform';
import { NextFunction, Request, Response } from 'express';

const router = Router();

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.',
  },
});

function validateWhenMobileRefresh(req: Request, res: Response, next: NextFunction): void {
  if (isMobileRefreshRequest(req)) {
    validate(refreshTokenBodySchema)(req, res, next);
    return;
  }
  next();
}

function validateWhenMobileLogout(req: Request, res: Response, next: NextFunction): void {
  if (isMobileLogoutRequest(req)) {
    validate(logoutBodySchema)(req, res, next);
    return;
  }
  next();
}

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/google', validate(googleAuthSchema), googleAuthHandler);
router.post('/refresh', validateWhenMobileRefresh, refreshAccessToken);
router.post('/logout', authenticateOptional, validateWhenMobileLogout, logoutUser);
router.get('/me', authenticate, getCurrentUser);

router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordHandler,
);
router.post('/verify-reset-otp', validate(verifyResetOtpSchema), verifyResetOtpHandler);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordHandler);

export default router;
