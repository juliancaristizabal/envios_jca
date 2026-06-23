import { IShipmentRepository } from '../../../domain/repositories/IShipmentRepository';
import { Shipment } from '../../../domain/entities/Shipment';
import { CreateShipmentDto } from '../../dtos/ShipmentDto';

export class CreateShipmentUseCase {
  constructor(private readonly shipmentRepository: IShipmentRepository) {}

  async execute(userId: number, dto: CreateShipmentDto): Promise<Omit<Shipment, 'toPublic'>> {
    const shipment = await this.shipmentRepository.save(
      new Shipment(
        0, userId, null, null,
        dto.weight, dto.width, dto.height, dto.length,
        dto.productType, dto.destAddress, dto.destCity,
        dto.destCountry, dto.destZip, 'pending', new Date(),
      ),
    );
    return shipment.toPublic();
  }
}
