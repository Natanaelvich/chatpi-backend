import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
}

const cacheConfig = {
  driver: 'redis',

  config: {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASS || undefined,
    },
  },
} as ICacheConfig;

export default cacheConfig;
