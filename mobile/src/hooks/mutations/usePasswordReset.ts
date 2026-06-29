import { useMutation } from '@tanstack/react-query';

import * as authService from '../../api/services/auth.service';

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
}

export function useVerifyResetOtp() {
  return useMutation({
    mutationFn: authService.verifyResetOtp,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
}
