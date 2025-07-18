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

describe('AuthService', () => {
    let authService: AuthService;
    
    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService();
        
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('test_jwt_token');
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const result = await authService.register('test@example.com', 'password123');

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('email', 'test@example.com');
            expect(result).not.toHaveProperty('passwordHash');
        });

        it('should throw an error if user with the same email already exists', async () => {
            await authService.register('test@example.com', 'password123');

            await expect(
                authService.register('test@example.com', 'different_password')
            ).rejects.toThrow('User with this email already exists');
        });
    });

    describe('login', () => {
        it('should return user and token on successful login', async () => {
            await authService.register('test@example.com', 'password123');
            
            const result = await authService.login('test@example.com', 'password123');

            expect(result).not.toBeNull();
            expect(result?.user).toHaveProperty('email', 'test@example.com');
            expect(result?.token).toBe('test_jwt_token');
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
            expect(jwt.sign).toHaveBeenCalled();
        });

        it('should return null if user is not found', async () => {
            const result = await authService.login('nonexistent@example.com', 'password');
            expect(result).toBeNull();
        });

        it('should return null if password is incorrect', async () => {
            await authService.register('test@example.com', 'correct_password');
            
            // Для цього тесту перевизначаємо мок
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await authService.login('test@example.com', 'wrong_password');

            expect(result).toBeNull();
        });
    });
});
