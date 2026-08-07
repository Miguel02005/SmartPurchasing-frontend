import { api } from '@/lib/api';
import { LoginVendorDto, RegisterVendorDto, AuthResponse } from '@/types/auth.types';

const TOKEN_KEY = 'accessToken';

export async function loginVendor(data: LoginVendorDto): Promise<AuthResponse> {
  return api.post<AuthResponse>('/vendors/login', data);
}

export async function registerVendor(data: RegisterVendorDto): Promise<AuthResponse> {
  return api.post<AuthResponse>('/vendors/register', data);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}