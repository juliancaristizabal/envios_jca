import Redis from 'ioredis';
import { env } from '../../config/env';

const redisConfig: { host: string; port: number; password?: string } = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

if (env.REDIS_PASSWORD) {
  redisConfig.password = env.REDIS_PASSWORD;
}

export const redisClient = new Redis(redisConfig);

export async function testRedisConnection(): Promise<void> {
  const pong = await redisClient.ping();
  if (pong !== 'PONG') throw new Error('Redis did not respond to PING');
}
