import { IShipmentRepository } from '../../../domain/repositories/IShipmentRepository';
import { IShipmentTrackingRepository } from '../../../domain/repositories/IShipmentTrackingRepository';
import { ShipmentTracking } from '../../../domain/entities/ShipmentTracking';
import { AppError } from '../../../shared/errors/AppError';

export class GetShipmentHistoryUseCase {
  constructor(
    private readonly shipmentRepository: IShipmentRepository,
    private readonly trackingRepository: IShipmentTrackingRepository,
  ) {}

  async execute(shipmentId: number): Promise<Omit<ShipmentTracking, 'toPublic'>[]> {
    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) throw new AppError('Envío no encontrado', 404);

    const history = await this.trackingRepository.findByShipmentId(shipmentId);
    return history.map((h) => h.toPublic());
  }
}
