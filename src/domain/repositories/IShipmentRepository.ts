import { Shipment, ShipmentStatus } from '../entities/Shipment';

export interface IShipmentRepository {
  findById(id: number): Promise<Shipment | null>;
  findAll(status?: ShipmentStatus): Promise<Shipment[]>;
  findByUserId(userId: number): Promise<Shipment[]>;
  save(shipment: Shipment): Promise<Shipment>;
  assignWithLock(
    shipmentId: number,
    carrierId: number,
    routeId: number,
    shipmentWeightKg: number,
    shipmentVolumeM3: number,
  ): Promise<Shipment>;
  updateAssignment(id: number, carrierId: number, routeId: number): Promise<Shipment | null>;
  updateStatus(id: number, status: ShipmentStatus): Promise<Shipment | null>;
}
