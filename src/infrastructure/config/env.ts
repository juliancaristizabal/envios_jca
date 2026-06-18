import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variable de entorno requerida no definida: ${key}`);
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(requireEnv('PORT')),

  DB_HOST: requireEnv('DB_HOST'),
  DB_PORT: Number(requireEnv('DB_PORT')),
  DB_USER: requireEnv('DB_USER'),
  DB_PASSWORD: requireEnv('DB_PASSWORD'),
  DB_NAME: requireEnv('DB_NAME'),

  REDIS_HOST: requireEnv('REDIS_HOST'),
  REDIS_PORT: Number(requireEnv('REDIS_PORT')),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? '',

  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: requireEnv('JWT_EXPIRES_IN'),
};
