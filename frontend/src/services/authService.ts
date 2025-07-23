import { api } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post('auth/login', credentials);
        return response.data;
    },
    async register(credentials: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post('auth/register', credentials);
        return response.data;
    },
};