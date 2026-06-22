import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../connection';
import { IAdminRepository } from '../../../../domain/repositories/IAdminRepository';
import { Admin } from '../../../../domain/entities/Admin';

interface AdminRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

function toEntity(row: AdminRow): Admin {
  return new Admin(row.id, row.name, row.email, row.password, row.created_at);
}

export class AdminRepository implements IAdminRepository {
  async findById(id: number): Promise<Admin | null> {
    const [rows] = await pool.query<AdminRow[]>('SELECT * FROM admins WHERE id = ?', [id]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const [rows] = await pool.query<AdminRow[]>('SELECT * FROM admins WHERE email = ?', [email]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async count(): Promise<number> {
    const [rows] = await pool.query<(RowDataPacket & { total: number })[]>(
      'SELECT COUNT(*) as total FROM admins',
    );
    return rows[0].total;
  }

  async save(admin: Admin): Promise<Admin> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO admins (name, email, password, created_at) VALUES (?, ?, ?, ?)',
      [admin.name, admin.email, admin.password, admin.createdAt],
    );
    return new Admin(result.insertId, admin.name, admin.email, admin.password, admin.createdAt);
  }
}
