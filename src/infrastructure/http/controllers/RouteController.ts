import { Request, Response, NextFunction } from 'express';
import { CreateRouteUseCase } from '../../../application/use-cases/route/CreateRouteUseCase';
import { GetRoutesUseCase } from '../../../application/use-cases/route/GetRoutesUseCase';

export class RouteController {
  constructor(
    private readonly createRouteUseCase: CreateRouteUseCase,
    private readonly getRoutesUseCase: GetRoutesUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const route = await this.createRouteUseCase.execute(req.body);
      res.status(201).json({ message: 'Ruta creada exitosamente', data: route });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const routes = await this.getRoutesUseCase.execute();
      res.status(200).json({ data: routes });
    } catch (error) {
      next(error);
    }
  }
}
