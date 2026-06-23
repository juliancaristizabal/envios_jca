import { Router } from 'express';
import { JwtService } from '../../services/JwtService';
import { ShipmentRepository } from '../../database/mysql/repositories/ShipmentRepository';
import { CarrierRepository } from '../../database/mysql/repositories/CarrierRepository';
import { RouteRepository } from '../../database/mysql/repositories/RouteRepository';
import { CreateShipmentUseCase } from '../../../application/use-cases/shipment/CreateShipmentUseCase';
import { GetShipmentsUseCase } from '../../../application/use-cases/shipment/GetShipmentsUseCase';
import { AssignShipmentUseCase } from '../../../application/use-cases/shipment/AssignShipmentUseCase';
import { ShipmentController } from '../controllers/ShipmentController';
import { authMiddleware, adminAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { CreateShipmentSchema, AssignShipmentSchema } from '../../../application/dtos/ShipmentDto';

const jwtService = new JwtService();
const shipmentRepository = new ShipmentRepository();
const carrierRepository = new CarrierRepository();
const routeRepository = new RouteRepository();

const shipmentController = new ShipmentController(
  new CreateShipmentUseCase(shipmentRepository),
  new GetShipmentsUseCase(shipmentRepository),
  new AssignShipmentUseCase(shipmentRepository, carrierRepository, routeRepository),
);

const router = Router();

// POST /shipments — usuario crea un envío
router.post(
  '/',
  authMiddleware(jwtService),
  validate(CreateShipmentSchema),
  (req, res, next) => shipmentController.create(req, res, next),
);

// GET /shipments/my — usuario ve sus propios envíos
router.get(
  '/my',
  authMiddleware(jwtService),
  (req, res, next) => shipmentController.getMyShipments(req, res, next),
);

// GET /shipments — admin ve todos los envíos
router.get(
  '/',
  adminAuthMiddleware(jwtService),
  (_req, res, next) => shipmentController.getAll(_req, res, next),
);

// PATCH /shipments/:id/assign — admin asigna transportista y ruta
router.patch(
  '/:id/assign',
  adminAuthMiddleware(jwtService),
  validate(AssignShipmentSchema),
  (req, res, next) => shipmentController.assign(req, res, next),
);

export default router;
