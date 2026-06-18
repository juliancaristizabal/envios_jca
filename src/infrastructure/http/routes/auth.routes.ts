import { Router } from 'express';
import { UserRepository } from '../../database/mysql/repositories/UserRepository';
import { JwtService } from '../../services/JwtService';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/auth/LoginUserUseCase';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate';
import { RegisterUserSchema } from '../../../application/dtos/RegisterUserDto';
import { LoginUserSchema } from '../../../application/dtos/LoginUserDto';

const userRepository = new UserRepository();
const jwtService = new JwtService();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

const router = Router();

router.post('/register', validate(RegisterUserSchema), (req, res, next) =>
  authController.register(req, res, next),
);

router.post('/login', validate(LoginUserSchema), (req, res, next) =>
  authController.login(req, res, next),
);

export default router;
