import { Request, Response, NextFunction } from 'express';
import { UpdateShipmentStatusUseCase } from '../../../application/use-cases/tracking/UpdateShipmentStatusUseCase';
import { GetShipmentHistoryUseCase } from '../../../application/use-cases/tracking/GetShipmentHistoryUseCase';
import { sseService } from '../../services/SseService';

export class TrackingController {
  constructor(
    private readonly updateStatusUseCase: UpdateShipmentStatusUseCase,
    private readonly getHistoryUseCase: GetShipmentHistoryUseCase,
  ) {}

  // El transportista actualiza el estado del envío
  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shipmentId = Number(req.params.id);
      const carrierId = req.user!.id;
      const entry = await this.updateStatusUseCase.execute(shipmentId, carrierId, req.body);
      res.status(200).json({ message: 'Estado actualizado', data: entry });
    } catch (error) {
      next(error);
    }
  }

  // El admin consulta el historial completo de un envío
  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const shipmentId = Number(req.params.id);
      const history = await this.getHistoryUseCase.execute(shipmentId);
      res.status(200).json({ data: history });
    } catch (error) {
      next(error);
    }
  }

  // El admin se suscribe a actualizaciones en tiempo real de un envío
  stream(req: Request, res: Response): void {
    const shipmentId = Number(req.params.id);
    sseService.addClient(shipmentId, res);
  }
}
