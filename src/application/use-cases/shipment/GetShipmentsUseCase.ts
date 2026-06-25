import { IShipmentRepository } from '../../../domain/repositories/IShipmentRepository';
import { Shipment, ShipmentStatus } from '../../../domain/entities/Shipment';

export class GetShipmentsUseCase {
  constructor(private readonly shipmentRepository: IShipmentRepository) {}

  async executeAll(status?: ShipmentStatus): Promise<Omit<Shipment, 'toPublic'>[]> {
    const shipments = await this.shipmentRepository.findAll(status);
    return shipments.map((s) => s.toPublic());
  }

  async executeByUser(userId: number): Promise<Omit<Shipment, 'toPublic'>[]> {
    const shipments = await this.shipmentRepository.findByUserId(userId);
    return shipments.map((s) => s.toPublic());
  }
}
