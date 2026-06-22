import { createServer } from './infrastructure/http/server';
import { env } from './infrastructure/config/env';
import { testConnection } from './infrastructure/database/mysql/connection';
import { initializeDatabase } from './infrastructure/database/mysql/initializer';
import { testRedisConnection } from './infrastructure/database/redis/client';
import { AdminRepository } from './infrastructure/database/mysql/repositories/AdminRepository';
import { SeedAdminUseCase } from './application/use-cases/admin/SeedAdminUseCase';

async function bootstrap(): Promise<void> {
  await testConnection();
  console.log('Conexión a MySQL establecida');

  await initializeDatabase();
  console.log('Tablas verificadas');

  const seedAdmin = new SeedAdminUseCase(new AdminRepository());
  await seedAdmin.execute({
    name: env.ADMIN_SEED_NAME,
    email: env.ADMIN_SEED_EMAIL,
    password: env.ADMIN_SEED_PASSWORD,
  });
  console.log('Seed de administrador verificado');

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
