import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRouter from './routes/auth.routes';

export function createServer(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'API de Envios JCA' });
  });

  app.use('/', authRouter);

  app.use(errorHandler);

  return app;
}
