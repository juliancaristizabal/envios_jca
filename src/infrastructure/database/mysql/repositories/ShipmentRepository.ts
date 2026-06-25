import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../connection';
import { IShipmentRepository } from '../../../../domain/repositories/IShipmentRepository';
import { Shipment, ShipmentStatus, ProductType } from '../../../../domain/entities/Shipment';
import { AppError } from '../../../../shared/errors/AppError';

interface ShipmentRow extends RowDataPacket {
  id: number;
  user_id: number;
  carrier_id: number | null;
  route_id: number | null;
  weight: number;
  width: number;
  height: number;
  length: number;
  product_type: ProductType;
  dest_address: string;
  dest_city: string;
  dest_country: string;
  dest_zip: string;
  status: ShipmentStatus;
  created_at: Date;
}

interface CarrierLockRow extends RowDataPacket {
  capacity_kg: number;
  capacity_m3: number;
  is_available: number;
}

interface CapacityRow extends RowDataPacket {
  used_kg: number;
  used_m3: number;
}

function toEntity(row: ShipmentRow): Shipment {
  return new Shipment(
    row.id, row.user_id, row.carrier_id, row.route_id,
    row.weight, row.width, row.height, row.length,
    row.product_type, row.dest_address, row.dest_city,
    row.dest_country, row.dest_zip, row.status, row.created_at,
  );
}

export class ShipmentRepository implements IShipmentRepository {
  async findById(id: number): Promise<Shipment | null> {
    const [rows] = await pool.query<ShipmentRow[]>('SELECT * FROM shipments WHERE id = ?', [id]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async findAll(status?: ShipmentStatus): Promise<Shipment[]> {
    const [rows] = status
      ? await pool.query<ShipmentRow[]>(
          'SELECT * FROM shipments WHERE status = ? ORDER BY created_at DESC',
          [status],
        )
      : await pool.query<ShipmentRow[]>(
          'SELECT * FROM shipments ORDER BY created_at DESC',
        );
    return rows.map(toEntity);
  }

  async findByUserId(userId: number): Promise<Shipment[]> {
    const [rows] = await pool.query<ShipmentRow[]>(
      'SELECT * FROM shipments WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
    );
    return rows.map(toEntity);
  }

  async save(shipment: Shipment): Promise<Shipment> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO shipments
        (user_id, weight, width, height, length, product_type,
         dest_address, dest_city, dest_country, dest_zip, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shipment.userId, shipment.weight, shipment.width, shipment.height,
        shipment.length, shipment.productType, shipment.destAddress,
        shipment.destCity, shipment.destCountry, shipment.destZip,
        shipment.status, shipment.createdAt,
      ],
    );
    return new Shipment(
      result.insertId, shipment.userId, null, null,
      shipment.weight, shipment.width, shipment.height, shipment.length,
      shipment.productType, shipment.destAddress, shipment.destCity,
      shipment.destCountry, shipment.destZip, shipment.status, shipment.createdAt,
    );
  }

  async assignWithLock(
    shipmentId: number,
    carrierId: number,
    routeId: number,
    shipmentWeightKg: number,
    shipmentVolumeM3: number,
  ): Promise<Shipment> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Bloquea la fila del transportista: ninguna otra transacción puede
      // leer ni modificar este carrier hasta que hagamos COMMIT o ROLLBACK
      const [carriers] = await conn.query<CarrierLockRow[]>(
        'SELECT capacity_kg, capacity_m3, is_available FROM carriers WHERE id = ? FOR UPDATE',
        [carrierId],
      );
      const carrier = carriers[0];
      if (!carrier.is_available) {
        throw new AppError('El transportista no está disponible', 400);
      }

      // Lee la capacidad ya comprometida dentro de la misma transacción
      // para garantizar que el dato es consistente con el lock
      const [cap] = await conn.query<CapacityRow[]>(
        `SELECT
           COALESCE(SUM(weight), 0)                           AS used_kg,
           COALESCE(SUM(width * height * length / 1000000), 0) AS used_m3
         FROM shipments
         WHERE carrier_id = ? AND status IN ('assigned', 'in_transit')`,
        [carrierId],
      );

      if (cap[0].used_kg + shipmentWeightKg > carrier.capacity_kg) {
        throw new AppError(
          `Capacidad de peso excedida. Disponible: ${(carrier.capacity_kg - cap[0].used_kg).toFixed(2)} kg`,
          400,
        );
      }
      if (cap[0].used_m3 + shipmentVolumeM3 > carrier.capacity_m3) {
        throw new AppError(
          `Capacidad de volumen excedida. Disponible: ${(carrier.capacity_m3 - cap[0].used_m3).toFixed(2)} m³`,
          400,
        );
      }

      await conn.query(
        `UPDATE shipments SET carrier_id = ?, route_id = ?, status = 'assigned' WHERE id = ?`,
        [carrierId, routeId, shipmentId],
      );

      await conn.commit();

      const updated = await this.findById(shipmentId);
      return updated!;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async updateAssignment(id: number, carrierId: number, routeId: number): Promise<Shipment | null> {
    await pool.query(
      `UPDATE shipments SET carrier_id = ?, route_id = ?, status = 'assigned' WHERE id = ?`,
      [carrierId, routeId, id],
    );
    return this.findById(id);
  }

  async updateStatus(id: number, status: ShipmentStatus): Promise<Shipment | null> {
    await pool.query('UPDATE shipments SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }
}
