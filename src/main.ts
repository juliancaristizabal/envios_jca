import { createServer } from './infrastructure/http/server';
import { env } from './infrastructure/config/env';
import { testConnection } from './infrastructure/database/mysql/connection';

async function bootstrap(): Promise<void> {
  await testConnection();
  console.log('Database connection established');

  const app = createServer();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
