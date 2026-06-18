import { TokenPayload } from '../../domain/services/ITokenService';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
