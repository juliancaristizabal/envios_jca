import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../connection';
import { IShipmentTrackingRepository } from '../../../../domain/repositories/IShipmentTrackingRepository';
import { ShipmentTracking } from '../../../../domain/entities/ShipmentTracking';
import { ShipmentStatus } from '../../../../domain/entities/Shipment';

interface TrackingRow extends RowDataPacket {
  id: number;
  shipment_id: number;
  status: ShipmentStatus;
  carrier_id: number | null;
  notes: string | null;
  changed_at: Date;
}

function toEntity(row: TrackingRow): ShipmentTracking {
  return new ShipmentTracking(
    row.id, row.shipment_id, row.status, row.carrier_id, row.notes, row.changed_at,
  );
}

export class ShipmentTrackingRepository implements IShipmentTrackingRepository {
  async findByShipmentId(shipmentId: number): Promise<ShipmentTracking[]> {
    const [rows] = await pool.query<TrackingRow[]>(
      'SELECT * FROM shipment_tracking WHERE shipment_id = ? ORDER BY changed_at ASC',
      [shipmentId],
    );
    return rows.map(toEntity);
  }

  async save(entry: ShipmentTracking): Promise<ShipmentTracking> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO shipment_tracking (shipment_id, status, carrier_id, notes, changed_at)
       VALUES (?, ?, ?, ?, ?)`,
      [entry.shipmentId, entry.status, entry.carrierId, entry.notes, entry.changedAt],
    );
    return new ShipmentTracking(
      result.insertId, entry.shipmentId, entry.status,
      entry.carrierId, entry.notes, entry.changedAt,
    );
  }
}
