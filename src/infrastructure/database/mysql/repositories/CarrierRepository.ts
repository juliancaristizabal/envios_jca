import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../connection';
import { ICarrierRepository } from '../../../../domain/repositories/ICarrierRepository';
import { Carrier, VehicleType } from '../../../../domain/entities/Carrier';

interface CarrierRow extends RowDataPacket {
  id: number;
  name: string;
  phone: string;
  vehicle_type: VehicleType;
  capacity_kg: number;
  capacity_m3: number;
  is_available: number;
  created_at: Date;
}

function toEntity(row: CarrierRow): Carrier {
  return new Carrier(
    row.id,
    row.name,
    row.phone,
    row.vehicle_type,
    row.capacity_kg,
    row.capacity_m3,
    row.is_available === 1,
    row.created_at,
  );
}

export class CarrierRepository implements ICarrierRepository {
  async findById(id: number): Promise<Carrier | null> {
    const [rows] = await pool.query<CarrierRow[]>('SELECT * FROM carriers WHERE id = ?', [id]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async findAll(): Promise<Carrier[]> {
    const [rows] = await pool.query<CarrierRow[]>('SELECT * FROM carriers ORDER BY name ASC');
    return rows.map(toEntity);
  }

  async findAvailable(): Promise<Carrier[]> {
    const [rows] = await pool.query<CarrierRow[]>(
      'SELECT * FROM carriers WHERE is_available = TRUE ORDER BY name ASC',
    );
    return rows.map(toEntity);
  }

  async getUsedCapacity(carrierId: number): Promise<{ usedKg: number; usedM3: number }> {
    const [rows] = await pool.query<(RowDataPacket & { used_kg: number; used_m3: number })[]>(
      `SELECT
        COALESCE(SUM(weight), 0)                        AS used_kg,
        COALESCE(SUM(width * height * length / 1000000), 0) AS used_m3
       FROM shipments
       WHERE carrier_id = ? AND status IN ('assigned', 'in_transit')`,
      [carrierId],
    );
    return { usedKg: rows[0].used_kg, usedM3: rows[0].used_m3 };
  }

  async save(carrier: Carrier): Promise<Carrier> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO carriers (name, phone, vehicle_type, capacity_kg, capacity_m3, is_available, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        carrier.name,
        carrier.phone,
        carrier.vehicleType,
        carrier.capacityKg,
        carrier.capacityM3,
        carrier.isAvailable,
        carrier.createdAt,
      ],
    );
    return new Carrier(
      result.insertId,
      carrier.name,
      carrier.phone,
      carrier.vehicleType,
      carrier.capacityKg,
      carrier.capacityM3,
      carrier.isAvailable,
      carrier.createdAt,
    );
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<Carrier | null> {
    await pool.query('UPDATE carriers SET is_available = ? WHERE id = ?', [isAvailable, id]);
    return this.findById(id);
  }
}
