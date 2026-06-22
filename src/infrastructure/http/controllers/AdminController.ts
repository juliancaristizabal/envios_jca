import { Request, Response, NextFunction } from 'express';
import { CreateAdminUseCase } from '../../../application/use-cases/admin/CreateAdminUseCase';
import { LoginAdminUseCase } from '../../../application/use-cases/admin/LoginAdminUseCase';
import { CreateAdminDto } from '../../../application/dtos/CreateAdminDto';
import { LoginAdminDto } from '../../../application/dtos/LoginAdminDto';

export class AdminController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly loginAdminUseCase: LoginAdminUseCase,
  ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.loginAdminUseCase.execute(req.body as LoginAdminDto);
      res.status(200).json({ message: 'Inicio de sesión exitoso', data: result });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = await this.createAdminUseCase.execute(req.body as CreateAdminDto);
      res.status(201).json({ message: 'Administrador creado exitosamente', data: admin });
    } catch (error) {
      next(error);
    }
  }
}
