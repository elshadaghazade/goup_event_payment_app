import { PrismaClient, Prisma } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
});

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ["query", "error", "info", "warn"] : [],
});

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  models: [
    { model: "speakers", cacheTime: 300, cacheKey: "speakers" },
    { model: "events", cacheTime: 300, cacheKey: "events" },
    { model: "packages", cacheTime: 300, cacheKey: "packages" },
    { model: "coupons", cacheTime: 300, cacheKey: "coupons" },
    { model: "participants", cacheTime: 300, cacheKey: "participants" },
    { model: "payments", cacheTime: 300, cacheKey: "payments" },
    { model: "event_speakers", cacheTime: 300, cacheKey: "event_speakers" }
  ],
  storage: {
    type: "redis",
    options: {
      client: redis,
      invalidation: { referencesTTL: 60 },
      log: process.env.NODE_ENV === 'development' ? console : undefined,
    },
  },
  cacheTime: 60,
  excludeMethods: ["count", "groupBy"],
  excludeModels: ["User"],
  onHit: (key) => {
    process.env.NODE_ENV === 'development' && console.log("hit", key);
  },
  onMiss: (key) => {
    process.env.NODE_ENV === 'development' && console.log("miss", key);
  },
  onError: (key) => {
    process.env.NODE_ENV === 'development' && console.log("error", key);
  },
});

prisma.$use(cacheMiddleware);