const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Email is required';
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address';
  }
  return null;
}

export function validatePassword(value: string, minLength = 8): string | null {
  if (!value) {
    return 'Password is required';
  }
  if (value.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return null;
}

export function validateName(value: string): string | null {
  if (!value.trim()) {
    return 'Name is required';
  }
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export function getPasswordStrength(value: string): PasswordStrength {
  if (!value) {
    return 'weak';
  }

  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'fair';
  if (score <= 5) return 'good';
  return 'strong';
}

export function validateStrongPassword(value: string): string | null {
  const baseError = validatePassword(value);
  if (baseError) {
    return baseError;
  }
  if (!/[a-z]/.test(value)) {
    return 'Include at least one lowercase letter';
  }
  if (!/[A-Z]/.test(value)) {
    return 'Include at least one uppercase letter';
  }
  if (!/[0-9]/.test(value)) {
    return 'Include at least one number';
  }
  return null;
}
