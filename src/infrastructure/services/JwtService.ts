import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../domain/services/ITokenService';
import { env } from '../config/env';
import { AppError } from '../../shared/errors/AppError';

export class JwtService implements ITokenService {
  sign(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as `${number}${'s' | 'm' | 'h' | 'd'}` });
  }

  verify(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch {
      throw new AppError('Token inválido o expirado', 401);
    }
  }
}
