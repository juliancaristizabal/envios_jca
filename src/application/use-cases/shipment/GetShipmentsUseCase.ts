import { IShipmentRepository } from '../../../domain/repositories/IShipmentRepository';
import { Shipment } from '../../../domain/entities/Shipment';

export class GetShipmentsUseCase {
  constructor(private readonly shipmentRepository: IShipmentRepository) {}

  async executeAll(): Promise<Omit<Shipment, 'toPublic'>[]> {
    const shipments = await this.shipmentRepository.findAll();
    return shipments.map((s) => s.toPublic());
  }

  async executeByUser(userId: number): Promise<Omit<Shipment, 'toPublic'>[]> {
    const shipments = await this.shipmentRepository.findByUserId(userId);
    return shipments.map((s) => s.toPublic());
  }
}
