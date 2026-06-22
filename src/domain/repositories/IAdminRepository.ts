import { Admin } from '../entities/Admin';

export interface IAdminRepository {
  findById(id: number): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  count(): Promise<number>;
  save(admin: Admin): Promise<Admin>;
}
