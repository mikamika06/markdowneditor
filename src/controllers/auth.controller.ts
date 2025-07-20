import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

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
            if (error.message === 'User with this email already exists') {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes('Password must be') || 
                error.message.includes('Invalid email')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
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

            return res.json(user);
        } catch (error: any) {
            if (error.message === 'Email and password are required') {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}