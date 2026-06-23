import { Request, Response, NextFunction } from 'express';
import { CreateShipmentUseCase } from '../../../application/use-cases/shipment/CreateShipmentUseCase';
import { GetShipmentsUseCase } from '../../../application/use-cases/shipment/GetShipmentsUseCase';
import { AssignShipmentUseCase } from '../../../application/use-cases/shipment/AssignShipmentUseCase';

export class ShipmentController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly getShipmentsUseCase: GetShipmentsUseCase,
    private readonly assignShipmentUseCase: AssignShipmentUseCase,
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const shipment = await this.createShipmentUseCase.execute(userId, req.body);
      res.status(201).json({ message: 'Envío creado exitosamente', data: shipment });
    } catch (error) {
      next(error);
    }
  }

  async getMyShipments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const shipments = await this.getShipmentsUseCase.executeByUser(userId);
      res.status(200).json({ data: shipments });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shipments = await this.getShipmentsUseCase.executeAll();
      res.status(200).json({ data: shipments });
    } catch (error) {
      next(error);
    }
  }

  async assign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shipmentId = Number(req.params.id);
      const shipment = await this.assignShipmentUseCase.execute(shipmentId, req.body);
      res.status(200).json({ message: 'Envío asignado exitosamente', data: shipment });
    } catch (error) {
      next(error);
    }
  }
}
