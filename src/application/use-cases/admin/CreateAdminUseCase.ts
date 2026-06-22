import bcrypt from 'bcrypt';
import { IAdminRepository } from '../../../domain/repositories/IAdminRepository';
import { Admin } from '../../../domain/entities/Admin';
import { CreateAdminDto } from '../../dtos/CreateAdminDto';
import { AppError } from '../../../shared/errors/AppError';

export class CreateAdminUseCase {
  constructor(private readonly adminRepository: IAdminRepository) {}

  async execute(dto: CreateAdminDto): Promise<Omit<Admin, 'password' | 'toPublic'>> {
    const existing = await this.adminRepository.findByEmail(dto.email);
    if (existing) throw new AppError('El correo ya está registrado', 409);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = await this.adminRepository.save(
      new Admin(0, dto.name, dto.email, hashedPassword, new Date()),
    );

    return admin.toPublic();
  }
}
