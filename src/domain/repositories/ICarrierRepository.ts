import { Carrier } from '../entities/Carrier';

export interface ICarrierRepository {
  findById(id: number): Promise<Carrier | null>;
  findAll(): Promise<Carrier[]>;
  findAvailable(): Promise<Carrier[]>;
  getUsedCapacity(carrierId: number): Promise<{ usedKg: number; usedM3: number }>;
  save(carrier: Carrier): Promise<Carrier>;
  updateAvailability(id: number, isAvailable: boolean): Promise<Carrier | null>;
}
