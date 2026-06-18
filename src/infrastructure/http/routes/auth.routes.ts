import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middlewares/validate';
import { RegisterUserSchema } from '../../../application/dtos/RegisterUserDto';

const router = Router();

router.post('/register', validate(RegisterUserSchema), AuthController.register);

export default router;
