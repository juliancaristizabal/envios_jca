import { ShipmentTracking } from '../entities/ShipmentTracking';
import { ShipmentStatus } from '../entities/Shipment';

export interface IShipmentTrackingRepository {
  findByShipmentId(shipmentId: number): Promise<ShipmentTracking[]>;
  save(entry: ShipmentTracking): Promise<ShipmentTracking>;
}
