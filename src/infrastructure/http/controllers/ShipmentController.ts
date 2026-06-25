import { Request, Response, NextFunction } from 'express';
import { CreateShipmentUseCase } from '../../../application/use-cases/shipment/CreateShipmentUseCase';
import { GetShipmentsUseCase } from '../../../application/use-cases/shipment/GetShipmentsUseCase';
import { AssignShipmentUseCase } from '../../../application/use-cases/shipment/AssignShipmentUseCase';
import { ShipmentStatus } from '../../../domain/entities/Shipment';

const VALID_STATUSES: ShipmentStatus[] = ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'];

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

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawStatus = req.query.status as string | undefined;
      if (rawStatus !== undefined && !VALID_STATUSES.includes(rawStatus as ShipmentStatus)) {
        res.status(400).json({
          error: 'Estado inválido',
          details: [{ field: 'status', message: `Valores permitidos: ${VALID_STATUSES.join(', ')}` }],
        });
        return;
      }
      const shipments = await this.getShipmentsUseCase.executeAll(rawStatus as ShipmentStatus | undefined);
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
