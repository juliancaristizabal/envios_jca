import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';
import { Carrier } from '../../../domain/entities/Carrier';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateCarrierAvailabilityUseCase {
  constructor(private readonly carrierRepository: ICarrierRepository) {}

  async execute(id: number, isAvailable: boolean): Promise<Omit<Carrier, 'toPublic'>> {
    const carrier = await this.carrierRepository.findById(id);
    if (!carrier) throw new AppError('Transportista no encontrado', 404);

    const updated = await this.carrierRepository.updateAvailability(id, isAvailable);
    return updated!.toPublic();
  }
}
