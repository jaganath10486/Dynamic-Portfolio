import { createClient, RedisClientType } from 'redis';
import { IS_REDIS_CACHE_ENABLED, REDIS_URL } from '@config/app.config';
import { Utilities } from '@utils/utils';
import { CacheError } from '@errors/cache.error';

class CacheService {
  private static instance: CacheService;
  private client: RedisClientType | null = null;
  private readonly isEnabled: boolean;

  private constructor() {
    this.isEnabled = Utilities.toBoolean(IS_REDIS_CACHE_ENABLED);
    if (this.isEnabled) {
      this.connect();
    }
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private connect(): void {
    this.client = createClient({ url: REDIS_URL }) as RedisClientType;
    this.client.connect().then(() => {
      console.info('Redis connected successfully');
    }).catch((err: Error) => {
      console.error(new CacheError('Redis connection failed').message, err.message);
      this.client = null;
    });
    this.client.on('error', (err: Error) => {
      console.error(new CacheError('Redis client error').message, err.message);
    });
  }

  public async get(key: string): Promise<string | null> {
    if (!this.isEnabled || !this.client) return null;
    try {
      return await this.client.get(key);
    } catch (err) {
      console.warn(new CacheError(`Redis get failed for key "${key}"`).message, err);
      return null;
    }
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.isEnabled || !this.client) return;
    try {
      if (ttlSeconds !== undefined) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (err) {
      console.warn(new CacheError(`Redis set failed for key "${key}"`).message, err);
    }
  }

  public async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  public async delete(key: string): Promise<void> {
    if (!this.isEnabled || !this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      console.warn(new CacheError(`Redis delete failed for key "${key}"`).message, err);
    }
  }

  public async quit(): Promise<void> {
    if (this.client) await this.client.quit();
  }
}

export default CacheService;
