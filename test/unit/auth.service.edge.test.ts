import { AuthService } from '../../src/services/auth.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('AuthService Edge Cases', () => {
    let authService: AuthService;
    const {users} = jest.requireActual('../../src/services/auth.service');
    
    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService();
        users.length = 0;
        
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('test_jwt_token');
    });

    describe('register', () => {
        it('should reject empty email', async () => {
            await expect(
                authService.register('', 'password123')
            ).rejects.toThrow('Invalid email format');
        });

        it('should reject invalid email format', async () => {
            await expect(
                authService.register('not-an-email', 'password123')
            ).rejects.toThrow('Invalid email format');
        });

        it('should reject password that is too short', async () => {
            await expect(
                authService.register('test@example.com', '123')
            ).rejects.toThrow('Password must be at least 8 characters');
        });

        it('should reject extremely long passwords', async () => {
            const veryLongPassword = 'a'.repeat(101);
            await expect(
                authService.register('test@example.com', veryLongPassword)
            ).rejects.toThrow('Password must be less than 100 characters');
        });
    });

    describe('login', () => {
        it('should handle login with non-existent user gracefully', async () => {
            const result = await authService.login('nonexistent@example.com', 'password123');
            expect(result).toBeNull();
        });

        it('should reject login with empty credentials', async () => {
            await expect(
                authService.login('', '')
            ).rejects.toThrow('Email and password are required');
        });
    });
});