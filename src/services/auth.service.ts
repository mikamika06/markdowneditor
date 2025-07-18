import { User } from "../models/user.model";
import bcrypt from 'bcrypt';



const users: User[] = [];

export class AuthService {
    async register(email: string, password: string): Promise<Omit<User, 'passwordHash'>> {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser: User = {
            id: Math.random().toString(36).slice(2, 9),
            email,
            passwordHash,
        };
        users.push(newUser);

        const { passwordHash: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    async login(email: string, password: string): Promise<Omit<User, 'passwordHash'> | null> {
        const user = users.find(u => u.email == email);
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) return null;
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}