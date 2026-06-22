import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';
import { Carrier } from '../../../domain/entities/Carrier';

export class GetCarriersUseCase {
  constructor(private readonly carrierRepository: ICarrierRepository) {}

  async execute(onlyAvailable = false): Promise<Omit<Carrier, 'toPublic'>[]> {
    const carriers = onlyAvailable
      ? await this.carrierRepository.findAvailable()
      : await this.carrierRepository.findAll();

    return carriers.map((c) => c.toPublic());
  }
}
