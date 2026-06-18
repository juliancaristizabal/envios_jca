import { UserRole } from '../entities/User';

export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
