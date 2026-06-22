import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';
import { Carrier } from '../../../domain/entities/Carrier';
import { CreateCarrierDto } from '../../dtos/CarrierDto';
import { AppError } from '../../../shared/errors/AppError';

export class CreateCarrierUseCase {
  constructor(private readonly carrierRepository: ICarrierRepository) {}

  async execute(dto: CreateCarrierDto): Promise<Omit<Carrier, 'toPublic'>> {
    if (dto.capacityKg <= 0 || dto.capacityM3 <= 0) {
      throw new AppError('Las capacidades deben ser mayores a 0', 400);
    }

    const carrier = await this.carrierRepository.save(
      new Carrier(0, dto.name, dto.phone, dto.vehicleType, dto.capacityKg, dto.capacityM3, true, new Date()),
    );

    return carrier.toPublic();
  }
}
