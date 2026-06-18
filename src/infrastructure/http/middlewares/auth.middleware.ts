import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../domain/services/ITokenService';
import { AppError } from '../../../shared/errors/AppError';

export function authMiddleware(tokenService: ITokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      return next(new AppError('Token no proporcionado', 401));
    }

    const token = authorization.split(' ')[1];
    try {
      req.user = tokenService.verify(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}
