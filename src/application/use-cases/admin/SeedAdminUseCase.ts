import bcrypt from 'bcrypt';
import { IAdminRepository } from '../../../domain/repositories/IAdminRepository';
import { Admin } from '../../../domain/entities/Admin';

export interface SeedAdminConfig {
  name: string;
  email: string;
  password: string;
}

export class SeedAdminUseCase {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(config: SeedAdminConfig): Promise<void> {
    const total = await this.adminRepository.count();
    if (total > 0) return;

    const hashedPassword = await bcrypt.hash(config.password, 10);
    await this.adminRepository.save(
      new Admin(0, config.name, config.email, hashedPassword, new Date()),
    );

    console.log(`Admin inicial creado: ${config.email}`);
  }
}
