import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import jwt from 'jsonwebtoken';

export class AuthController {
    constructor(private authService: AuthService) { }

    register = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const user = await this.authService.register(email, password);
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(409).json({ message: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }
            const user = await this.authService.login(email, password);
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            return res.json({ user, token });
        } catch (error) {
            throw error;
        }
    };
}