import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/auth.routes';
import adminRouter from './routes/admin.routes';
import carrierRouter from './routes/carrier.routes';
import routeRouter from './routes/route.routes';
import { swaggerSpec } from '../config/swagger';

export function createServer(): Application {
  const app = express();

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'API de Envios JCA' });
  });

  app.use('/', authRouter);
  app.use('/admin', adminRouter);
  app.use('/admin/carriers', carrierRouter);
  app.use('/admin/routes', routeRouter);

  app.use(errorHandler);

  return app;
}
