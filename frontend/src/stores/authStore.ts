import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type{ AuthState, LoginRequest, RegisterRequest } from '../types/auth.types';
import { authService } from '../services/authService';

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          localStorage.setItem('token', response.token);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          await authService.register(credentials);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ isAuthenticated: true });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'auth-store' }
  )
);