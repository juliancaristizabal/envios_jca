import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { RegisterUserDto } from '../../dtos/RegisterUserDto';
import { AppError } from '../../../shared/errors/AppError';

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterUserDto): Promise<Omit<User, 'password' | 'toPublic'>> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new AppError('El correo ya está registrado', 409);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      new User(0, dto.name, dto.email, hashedPassword, new Date()),
    );

    return user.toPublic();
  }
}
