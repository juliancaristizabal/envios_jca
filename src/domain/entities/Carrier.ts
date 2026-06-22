export type VehicleType = 'moto' | 'van' | 'camion';

export class Carrier {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly phone: string,
    public readonly vehicleType: VehicleType,
    public readonly capacityKg: number,
    public readonly capacityM3: number,
    public readonly isAvailable: boolean,
    public readonly createdAt: Date,
  ) {}

  toPublic(): Omit<Carrier, 'toPublic'> {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      vehicleType: this.vehicleType,
      capacityKg: this.capacityKg,
      capacityM3: this.capacityM3,
      isAvailable: this.isAvailable,
      createdAt: this.createdAt,
    };
  }
}
