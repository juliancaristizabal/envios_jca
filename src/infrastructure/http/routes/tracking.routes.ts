import { Router } from 'express';
import { JwtService } from '../../services/JwtService';
import { ShipmentRepository } from '../../database/mysql/repositories/ShipmentRepository';
import { ShipmentTrackingRepository } from '../../database/mysql/repositories/ShipmentTrackingRepository';
import { UpdateShipmentStatusUseCase } from '../../../application/use-cases/tracking/UpdateShipmentStatusUseCase';
import { GetShipmentHistoryUseCase } from '../../../application/use-cases/tracking/GetShipmentHistoryUseCase';
import { TrackingController } from '../controllers/TrackingController';
import { authMiddleware, adminAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { UpdateStatusSchema } from '../../../application/dtos/TrackingDto';

const jwtService = new JwtService();
const shipmentRepository = new ShipmentRepository();
const trackingRepository = new ShipmentTrackingRepository();

const trackingController = new TrackingController(
  new UpdateShipmentStatusUseCase(shipmentRepository, trackingRepository),
  new GetShipmentHistoryUseCase(shipmentRepository, trackingRepository),
);

const router = Router();

// PATCH /shipments/:id/status — transportista actualiza estado (token de usuario)
router.patch(
  '/:id/status',
  authMiddleware(jwtService),
  validate(UpdateStatusSchema),
  (req, res, next) => trackingController.updateStatus(req, res, next),
);

// GET /shipments/:id/tracking — admin consulta historial de un envío
router.get(
  '/:id/tracking',
  adminAuthMiddleware(jwtService),
  (req, res, next) => trackingController.getHistory(req, res, next),
);

// GET /shipments/:id/stream — admin se suscribe a actualizaciones SSE en tiempo real
router.get(
  '/:id/stream',
  adminAuthMiddleware(jwtService),
  (req, res) => trackingController.stream(req, res),
);

export default router;
