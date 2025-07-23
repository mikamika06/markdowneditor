import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";


const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);


router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;

