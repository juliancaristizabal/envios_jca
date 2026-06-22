import { Request, Response, NextFunction } from 'express';
import { CreateCarrierUseCase } from '../../../application/use-cases/carrier/CreateCarrierUseCase';
import { GetCarriersUseCase } from '../../../application/use-cases/carrier/GetCarriersUseCase';
import { UpdateCarrierAvailabilityUseCase } from '../../../application/use-cases/carrier/UpdateCarrierAvailabilityUseCase';

export class CarrierController {
  constructor(
    private readonly createCarrierUseCase: CreateCarrierUseCase,
    private readonly getCarriersUseCase: GetCarriersUseCase,
    private readonly updateAvailabilityUseCase: UpdateCarrierAvailabilityUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const carrier = await this.createCarrierUseCase.execute(req.body);
      res.status(201).json({ message: 'Transportista registrado exitosamente', data: carrier });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const onlyAvailable = req.query.available === 'true';
      const carriers = await this.getCarriersUseCase.execute(onlyAvailable);
      res.status(200).json({ data: carriers });
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { isAvailable } = req.body as { isAvailable: boolean };
      const carrier = await this.updateAvailabilityUseCase.execute(id, isAvailable);
      res.status(200).json({ message: 'Disponibilidad actualizada', data: carrier });
    } catch (error) {
      next(error);
    }
  }
}
