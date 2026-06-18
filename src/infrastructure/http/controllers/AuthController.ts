import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { UserRepository } from '../../database/mysql/repositories/UserRepository';
import { RegisterUserDto } from '../../../application/dtos/RegisterUserDto';

const userRepository = new UserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await registerUserUseCase.execute(req.body as RegisterUserDto);
      res.status(201).json({ message: 'Usuario registrado exitosamente', data: user });
    } catch (error) {
      next(error);
    }
  },
};
