import { Router } from 'express';
import { UserRepository } from '../../database/mysql/repositories/UserRepository';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate';
import { RegisterUserSchema } from '../../../application/dtos/RegisterUserDto';

const userRepository = new UserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const authController = new AuthController(registerUserUseCase);

const router = Router();

router.post('/register', validate(RegisterUserSchema), (req, res, next) =>
  authController.register(req, res, next),
);

export default router;
