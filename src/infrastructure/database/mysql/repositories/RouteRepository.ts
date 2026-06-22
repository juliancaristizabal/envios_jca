import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../connection';
import { IRouteRepository } from '../../../../domain/repositories/IRouteRepository';
import { Route } from '../../../../domain/entities/Route';

interface RouteRow extends RowDataPacket {
  id: number;
  name: string;
  origin_city: string;
  destination_city: string;
  estimated_days: number;
  created_at: Date;
}

function toEntity(row: RouteRow): Route {
  return new Route(
    row.id,
    row.name,
    row.origin_city,
    row.destination_city,
    row.estimated_days,
    row.created_at,
  );
}

export class RouteRepository implements IRouteRepository {
  async findById(id: number): Promise<Route | null> {
    const [rows] = await pool.query<RouteRow[]>('SELECT * FROM routes WHERE id = ?', [id]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async findAll(): Promise<Route[]> {
    const [rows] = await pool.query<RouteRow[]>('SELECT * FROM routes ORDER BY name ASC');
    return rows.map(toEntity);
  }

  async save(route: Route): Promise<Route> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO routes (name, origin_city, destination_city, estimated_days, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [route.name, route.originCity, route.destinationCity, route.estimatedDays, route.createdAt],
    );
    return new Route(
      result.insertId,
      route.name,
      route.originCity,
      route.destinationCity,
      route.estimatedDays,
      route.createdAt,
    );
  }
}
