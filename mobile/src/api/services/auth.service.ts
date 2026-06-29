import { apiClient } from '../client';
import type { ApiResponse, MobileAuthData, SafeUser } from '../types';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface GoogleAuthInput {
  idToken: string;
}

function unwrapAuthData(response: ApiResponse<MobileAuthData>): MobileAuthData {
  if (!response.success || !response.data) {
    throw new Error(response.message || 'Authentication failed');
  }
  return response.data;
}

export async function login(input: LoginInput): Promise<MobileAuthData> {
  const { data } = await apiClient.post<ApiResponse<MobileAuthData>>('/auth/login', input);
  return unwrapAuthData(data);
}

export async function register(input: RegisterInput): Promise<MobileAuthData> {
  const { data } = await apiClient.post<ApiResponse<MobileAuthData>>('/auth/register', input);
  return unwrapAuthData(data);
}

export async function googleAuth(input: GoogleAuthInput): Promise<MobileAuthData> {
  const { data } = await apiClient.post<ApiResponse<MobileAuthData>>('/auth/google', input);
  return unwrapAuthData(data);
}

export async function logout(refreshToken?: string | null): Promise<void> {
  await apiClient.post<ApiResponse>('/auth/logout', refreshToken ? { refreshToken } : {});
}

export async function getMe(): Promise<SafeUser> {
  const { data } = await apiClient.get<ApiResponse<{ user: SafeUser }>>('/auth/me');
  if (!data.success || !data.data?.user) {
    throw new Error(data.message || 'Failed to load profile');
  }
  return data.data.user;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface VerifyResetOtpInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  password: string;
  resetToken: string;
}

function unwrapMessage(response: ApiResponse<unknown>): string {
  if (!response.success) {
    throw new Error(response.message || 'Request failed');
  }
  return response.message || 'Success';
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<string> {
  const { data } = await apiClient.post<ApiResponse>('/auth/forgot-password', input);
  return unwrapMessage(data);
}

export async function verifyResetOtp(
  input: VerifyResetOtpInput,
): Promise<{ resetToken: string }> {
  const { data } = await apiClient.post<ApiResponse<{ resetToken: string }>>(
    '/auth/verify-reset-otp',
    input,
  );

  if (!data.success || !data.data?.resetToken) {
    throw new Error(data.message || 'Verification failed');
  }

  return { resetToken: data.data.resetToken };
}

export async function resetPassword(input: ResetPasswordInput): Promise<string> {
  const { data } = await apiClient.post<ApiResponse>('/auth/reset-password', input);
  return unwrapMessage(data);
}
