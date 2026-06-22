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
      const payload = tokenService.verify(token);
      if (payload.type !== 'user') {
        return next(new AppError('Token no válido para este recurso', 403));
      }
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function adminAuthMiddleware(tokenService: ITokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      return next(new AppError('Token no proporcionado', 401));
    }

    const token = authorization.split(' ')[1];
    try {
      const payload = tokenService.verify(token);
      if (payload.type !== 'admin') {
        return next(new AppError('No tienes permisos para acceder a este recurso', 403));
      }
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
}
