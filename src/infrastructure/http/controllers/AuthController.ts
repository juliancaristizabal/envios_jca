import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/auth/LoginUserUseCase';
import { RegisterUserDto } from '../../../application/dtos/RegisterUserDto';
import { LoginUserDto } from '../../../application/dtos/LoginUserDto';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.registerUserUseCase.execute(req.body as RegisterUserDto);
      res.status(201).json({ message: 'Usuario registrado exitosamente', data: user });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.loginUserUseCase.execute(req.body as LoginUserDto);
      res.status(200).json({ message: 'Inicio de sesión exitoso', data: result });
    } catch (error) {
      next(error);
    }
  }
}
