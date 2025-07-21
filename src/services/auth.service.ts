import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/interfaces/user-repository.interface';
import { RepositoryFactory } from '../repositories/repository-factory';

export class AuthService {
    private userRepository: IUserRepository;
    
    constructor() {
        this.userRepository = RepositoryFactory.getUserRepository();
    }
    
    async register(email: string, password: string): Promise<Omit<User, 'passwordHash'>> {
        if (!email || !this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        if (!password) {
            throw new Error('Password is required');
        }
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }
        if (password.length > 100) {
            throw new Error('Password must be less than 100 characters');
        }

        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        return this.userRepository.create(email, passwordHash);
    }

    async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string } | null> {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) return null;

        const { passwordHash: _, ...userWithoutPassword } = user;
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        return { user: userWithoutPassword, token };
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}