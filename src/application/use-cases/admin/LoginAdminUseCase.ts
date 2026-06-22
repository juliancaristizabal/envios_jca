import bcrypt from 'bcrypt';
import { IAdminRepository } from '../../../domain/repositories/IAdminRepository';
import { ITokenService, TokenPayload } from '../../../domain/services/ITokenService';
import { LoginAdminDto } from '../../dtos/LoginAdminDto';
import { AppError } from '../../../shared/errors/AppError';
import { Admin } from '../../../domain/entities/Admin';

export interface LoginAdminResult {
  token: string;
  admin: Omit<Admin, 'password' | 'toPublic'>;
}

export class LoginAdminUseCase {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginAdminDto): Promise<LoginAdminResult> {
    const admin = await this.adminRepository.findByEmail(dto.email);
    if (!admin) throw new AppError('Credenciales inválidas', 401);

    const passwordValid = await bcrypt.compare(dto.password, admin.password);
    if (!passwordValid) throw new AppError('Credenciales inválidas', 401);

    const payload: TokenPayload = { id: admin.id, email: admin.email, type: 'admin' };
    const token = this.tokenService.sign(payload);

    return { token, admin: admin.toPublic() };
  }
}
