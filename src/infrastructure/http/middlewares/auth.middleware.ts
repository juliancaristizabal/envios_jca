import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../domain/services/ITokenService';
import { UserRole } from '../../../domain/entities/User';
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

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('No tienes permisos para acceder a este recurso', 403));
    }
    next();
  };
}
