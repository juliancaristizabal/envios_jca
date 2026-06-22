import { Router } from 'express';
import { AdminRepository } from '../../database/mysql/repositories/AdminRepository';
import { JwtService } from '../../services/JwtService';
import { CreateAdminUseCase } from '../../../application/use-cases/admin/CreateAdminUseCase';
import { LoginAdminUseCase } from '../../../application/use-cases/admin/LoginAdminUseCase';
import { AdminController } from '../controllers/AdminController';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate';
import { CreateAdminSchema } from '../../../application/dtos/CreateAdminDto';
import { LoginAdminSchema } from '../../../application/dtos/LoginAdminDto';

const adminRepository = new AdminRepository();
const jwtService = new JwtService();
const createAdminUseCase = new CreateAdminUseCase(adminRepository);
const loginAdminUseCase = new LoginAdminUseCase(adminRepository, jwtService);
const adminController = new AdminController(createAdminUseCase, loginAdminUseCase);

const router = Router();

// POST /admin/login — público
router.post('/login', validate(LoginAdminSchema), (req, res, next) =>
  adminController.login(req, res, next),
);

// POST /admin — protegido, solo un admin puede crear otro admin
router.post(
  '/',
  adminAuthMiddleware(jwtService),
  validate(CreateAdminSchema),
  (req, res, next) => adminController.create(req, res, next),
);

export default router;
