export interface TokenPayload {
  id: number;
  email: string;
  type: 'user' | 'admin';
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
