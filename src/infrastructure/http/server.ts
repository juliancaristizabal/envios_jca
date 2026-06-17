import express, { Application } from 'express';
import { errorHandler } from './middlewares/errorHandler';
import healthRouter from './routes/health.routes';

export function createServer(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/health', healthRouter);

  app.use(errorHandler);

  return app;
}
