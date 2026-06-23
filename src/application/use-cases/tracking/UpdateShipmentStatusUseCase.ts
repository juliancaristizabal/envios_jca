import { IShipmentRepository } from '../../../domain/repositories/IShipmentRepository';
import { IShipmentTrackingRepository } from '../../../domain/repositories/IShipmentTrackingRepository';
import { ShipmentTracking } from '../../../domain/entities/ShipmentTracking';
import { UpdateStatusDto } from '../../dtos/TrackingDto';
import { AppError } from '../../../shared/errors/AppError';
import { sseService } from '../../../infrastructure/services/SseService';

export class UpdateShipmentStatusUseCase {
  constructor(
    private readonly shipmentRepository: IShipmentRepository,
    private readonly trackingRepository: IShipmentTrackingRepository,
  ) {}

  async execute(
    shipmentId: number,
    carrierId: number | null,
    dto: UpdateStatusDto,
  ): Promise<Omit<ShipmentTracking, 'toPublic'>> {
    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) throw new AppError('Envío no encontrado', 404);

    if (shipment.status === 'delivered' || shipment.status === 'cancelled') {
      throw new AppError('No se puede actualizar un envío ya finalizado', 400);
    }

    // Actualiza el estado actual del envío
    await this.shipmentRepository.updateStatus(shipmentId, dto.status);

    // Inserta una nueva fila en el historial de seguimiento
    const entry = await this.trackingRepository.save(
      new ShipmentTracking(0, shipmentId, dto.status, carrierId, dto.notes ?? null, new Date()),
    );

    // Notifica en tiempo real a todos los clientes conectados a este envío
    sseService.emit(shipmentId, entry.toPublic());

    return entry.toPublic();
  }
}
