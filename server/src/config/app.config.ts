import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  IS_REDIS_CACHE_ENABLED: z.string().default('true'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables');
  process.exit(1);
}

const env = parsed.data;

export const PORT = env.PORT;
export const NODE_ENV = env.NODE_ENV;
export const REDIS_URL = env.REDIS_URL;
export const IS_REDIS_CACHE_ENABLED = env.IS_REDIS_CACHE_ENABLED;
export const CORS_ORIGIN = env.CORS_ORIGIN;
