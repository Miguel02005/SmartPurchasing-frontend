import { useState, useEffect } from 'react';
import { getToken, clearToken, saveToken } from '@/services/auth.service';
import { decodeToken } from '@/utils/jwt';
import { VendorSafe } from '@/types/auth.types';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: VendorSafe | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  });

  useEffect(() => {
  const checkAuth = async () => {
    const token = getToken();

    if (token) {
      const payload = decodeToken(token);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: payload
          ? {
              businessEntityId: payload.sub,
              email: payload.email,
            }
          : null,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  checkAuth();
}, []);

  const login = async (token: string, user: VendorSafe) => {
    saveToken(token);
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user
    });
  };

  const logout = () => {
    clearToken();
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null
    });
  };

  return {
    ...authState,
    login,
    logout
  };
}
