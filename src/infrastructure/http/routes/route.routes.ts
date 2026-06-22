import { Router } from 'express';
import { RouteRepository } from '../../database/mysql/repositories/RouteRepository';
import { JwtService } from '../../services/JwtService';
import { CreateRouteUseCase } from '../../../application/use-cases/route/CreateRouteUseCase';
import { GetRoutesUseCase } from '../../../application/use-cases/route/GetRoutesUseCase';
import { RouteController } from '../controllers/RouteController';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { CreateRouteSchema } from '../../../application/dtos/RouteDto';

const routeRepository = new RouteRepository();
const jwtService = new JwtService();
const routeController = new RouteController(
  new CreateRouteUseCase(routeRepository),
  new GetRoutesUseCase(routeRepository),
);

const router = Router();

router.use(adminAuthMiddleware(jwtService));

// GET  /admin/routes
router.get('/', (_req, res, next) => routeController.getAll(_req, res, next));

// POST /admin/routes
router.post('/', validate(CreateRouteSchema), (req, res, next) =>
  routeController.create(req, res, next),
);

export default router;
