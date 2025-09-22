import { api } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, UserResponse } from '../types/auth.types';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);
        
        const response = await api.post('auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        
        return response.data;
    },

    async register(credentials: RegisterRequest): Promise<UserResponse> {
        const response = await api.post('auth/register', {
            email: credentials.email,
            password: credentials.password,
        });
        return response.data;
    },

    logout(): void {
        localStorage.removeItem('token');
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};