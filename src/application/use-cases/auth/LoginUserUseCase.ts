import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ITokenService, TokenPayload } from '../../../domain/services/ITokenService';
import { LoginUserDto } from '../../dtos/LoginUserDto';
import { AppError } from '../../../shared/errors/AppError';
import { User } from '../../../domain/entities/User';

export interface LoginResult {
  token: string;
  user: Omit<User, 'password' | 'toPublic'>;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: LoginUserDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new AppError('Credenciales inválidas', 401);

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new AppError('Credenciales inválidas', 401);

    const payload: TokenPayload = { id: user.id, email: user.email };
    const token = this.tokenService.sign(payload);

    return { token, user: user.toPublic() };
  }
}
