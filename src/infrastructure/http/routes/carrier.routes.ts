import { Router } from 'express';
import { CarrierRepository } from '../../database/mysql/repositories/CarrierRepository';
import { JwtService } from '../../services/JwtService';
import { CreateCarrierUseCase } from '../../../application/use-cases/carrier/CreateCarrierUseCase';
import { GetCarriersUseCase } from '../../../application/use-cases/carrier/GetCarriersUseCase';
import { UpdateCarrierAvailabilityUseCase } from '../../../application/use-cases/carrier/UpdateCarrierAvailabilityUseCase';
import { CarrierController } from '../controllers/CarrierController';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { CreateCarrierSchema } from '../../../application/dtos/CarrierDto';

const carrierRepository = new CarrierRepository();
const jwtService = new JwtService();
const carrierController = new CarrierController(
  new CreateCarrierUseCase(carrierRepository),
  new GetCarriersUseCase(carrierRepository),
  new UpdateCarrierAvailabilityUseCase(carrierRepository),
);

const router = Router();

router.use(adminAuthMiddleware(jwtService));

// GET  /admin/carriers?available=true
router.get('/', (req, res, next) => carrierController.getAll(req, res, next));

// POST /admin/carriers
router.post('/', validate(CreateCarrierSchema), (req, res, next) =>
  carrierController.create(req, res, next),
);

// PATCH /admin/carriers/:id/availability
router.patch('/:id/availability', (req, res, next) =>
  carrierController.updateAvailability(req, res, next),
);

export default router;
