import { createServer } from './infrastructure/http/server';
import { env } from './infrastructure/config/env';
import { testConnection } from './infrastructure/database/mysql/connection';
import { initializeDatabase } from './infrastructure/database/mysql/initializer';
import { testRedisConnection } from './infrastructure/database/redis/client';

async function bootstrap(): Promise<void> {
  await testConnection();
  console.log('Conexión a MySQL establecida');

  await initializeDatabase();
  console.log('Tablas verificadas');

  await testRedisConnection();
  console.log('Conexión a Redis establecida');

  const app = createServer();
  app.listen(env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  console.error('Error al iniciar el servidor:', err);
  process.exit(1);
});
