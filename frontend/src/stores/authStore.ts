import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthState, LoginRequest, RegisterRequest } from '../types/auth.types';
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
          console.log('AuthStore: Starting login process');
          const response = await authService.login(credentials);
          console.log('AuthStore: Login response received', response);
          
          localStorage.setItem('token', response.token);
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          console.log('AuthStore: Login successful, state updated');
        } catch (error) {
          console.error('AuthStore: Login failed', error);
          let errorMessage = 'Login failed';
          
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string } }; message?: string };;
            errorMessage = axiosError.response?.data?.message || axiosError.message || 'Login failed';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          set({ 
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          console.log('AuthStore: Starting registration process');
          await authService.register(credentials);
          console.log('AuthStore: Registration successful');
          set({ isLoading: false });
        } catch (error) {
          console.error('AuthStore: Registration failed', error);
          let errorMessage = 'Registration failed';
          
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string } }; message?: string };;
            errorMessage = axiosError.response?.data?.message || axiosError.message || 'Registration failed';
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          set({ 
            error: errorMessage,
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