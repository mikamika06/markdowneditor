import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthState, LoginRequest, RegisterRequest, User } from '../types/auth.types';
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
          
          set({ 
            isAuthenticated: true, 
            isLoading: false 
          });
          console.log('AuthStore: Login successful, state updated');
        } catch (error) {
          console.error('AuthStore: Login failed', error);
          let errorMessage = 'Login failed';
          
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { detail?: string } }; message?: string };;
            errorMessage = axiosError.response?.data?.detail || axiosError.message || 'Login failed';
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
          const userResponse = await authService.register(credentials);
          console.log('AuthStore: Registration successful', userResponse);
          
          const user: User = {
            id: userResponse.id,
            email: userResponse.email,
            created_at: userResponse.created_at
          };
          
          set({ 
            user,
            isLoading: false 
          });
        } catch (error) {
          console.error('AuthStore: Registration failed', error);
          let errorMessage = 'Registration failed';
          
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { detail?: string } }; message?: string };;
            errorMessage = axiosError.response?.data?.detail || axiosError.message || 'Registration failed';
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
        authService.logout();
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      checkAuth: () => {
        const isAuth = authService.isAuthenticated();
        set({ isAuthenticated: isAuth });
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'auth-store' }
  )
);