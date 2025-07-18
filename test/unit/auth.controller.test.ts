import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import { Request, Response } from 'express';

jest.mock('../../src/services/auth.service');

describe('AuthController', () => {
    let authController: AuthController;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    beforeEach(() => {
        responseJson = jest.fn().mockReturnThis();
        responseStatus = jest.fn().mockReturnValue({ json: responseJson });

        mockRequest = {
            body: {}
        };

        mockResponse = {
            status: responseStatus,
            json: responseJson
        };

        mockAuthService = new AuthService() as jest.Mocked<AuthService>;
        authController = new AuthController(mockAuthService);
    });

    describe('register', () => {
        it('should return 400 if email or password is missing', async () => {
            mockRequest.body = {};

            await authController.register(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Email and password are required' });
        });

        it('should return 201 and user data on successful registration', async () => {
            mockRequest.body = { email: 'test@example.com', password: 'password123' };
            const mockUser = { id: 'user123', email: 'test@example.com' };
            mockAuthService.register = jest.fn().mockResolvedValue(mockUser);

            await authController.register(mockRequest as Request, mockResponse as Response);

            expect(mockAuthService.register).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(responseStatus).toHaveBeenCalledWith(201);
            expect(responseJson).toHaveBeenCalledWith(mockUser);
        });

        it('should return 409 if user already exists', async () => {
            mockRequest.body = { email: 'test@example.com', password: 'password123' };
            mockAuthService.register = jest.fn().mockRejectedValue(new Error('User with this email already exists'));

            await authController.register(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(409);
            expect(responseJson).toHaveBeenCalledWith({ message: 'User with this email already exists' });
        });
    });

    describe('login', () => {
        it('should return 400 if email or password is missing', async () => {
            mockRequest.body = {};

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(responseStatus).toHaveBeenCalledWith(400);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Email and password are required' });
        });

        it('should return 401 if login fails', async () => {
            mockRequest.body = { email: 'test@example.com', password: 'wrong_password' };
            mockAuthService.login = jest.fn().mockResolvedValue(null);

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'wrong_password');
            expect(responseStatus).toHaveBeenCalledWith(401);
            expect(responseJson).toHaveBeenCalledWith({ message: 'Invalid email or password' });
        });

        it('should return user and token on successful login', async () => {
            mockRequest.body = { email: 'test@example.com', password: 'password123' };
            const loginResult = {
                user: { id: 'user123', email: 'test@example.com' },
                token: 'jwt_token_here'
            };
            mockAuthService.login = jest.fn().mockResolvedValue(loginResult);

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(responseJson).toHaveBeenCalledWith(loginResult);
        });
    });
});
