import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../connection';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

function toEntity(row: UserRow): User {
  return new User(row.id, row.name, row.email, row.password, row.created_at);
}

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] ? toEntity(rows[0]) : null;
  }

  async findAll(): Promise<User[]> {
    const [rows] = await pool.query<UserRow[]>('SELECT * FROM users');
    return rows.map(toEntity);
  }

  async save(user: User): Promise<User> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
      [user.name, user.email, user.password, user.createdAt],
    );
    return new User(result.insertId, user.name, user.email, user.password, user.createdAt);
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), id];
    await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
