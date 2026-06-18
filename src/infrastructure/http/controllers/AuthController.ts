import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { RegisterUserDto } from '../../../application/dtos/RegisterUserDto';

export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.registerUserUseCase.execute(req.body as RegisterUserDto);
      res.status(201).json({ message: 'Usuario registrado exitosamente', data: user });
    } catch (error) {
      next(error);
    }
  }
}
