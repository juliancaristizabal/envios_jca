import { ShipmentStatus } from './Shipment';

export class ShipmentTracking {
  constructor(
    public readonly id: number,
    public readonly shipmentId: number,
    public readonly status: ShipmentStatus,
    public readonly carrierId: number | null,
    public readonly notes: string | null,
    public readonly changedAt: Date,
  ) {}

  toPublic(): Omit<ShipmentTracking, 'toPublic'> {
    return {
      id: this.id,
      shipmentId: this.shipmentId,
      status: this.status,
      carrierId: this.carrierId,
      notes: this.notes,
      changedAt: this.changedAt,
    };
  }
}
