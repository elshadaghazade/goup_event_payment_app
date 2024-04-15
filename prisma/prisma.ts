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
    { model: "Country", cacheTime: 86400, cacheKey: "country" },
    { model: "City", cacheTime: 86400, cacheKey: "city" },
    { model: "State", cacheTime: 86400, cacheKey: "state" },
    { model: "Currency", cacheTime: 3600, cacheKey: "currency" },
    { model: "Language", cacheTime: 3600, cacheKey: "language" },
    { model: "Specialty", cacheTime: 3600, cacheKey: "specialty" },
    { model: "Service", cacheTime: 3600, cacheKey: "service" },
    { model: "HealthcareFacilityType", cacheTime: 86400, cacheKey: "healthcareFacilityType" },
    { model: "Doctor", cacheTime: 300, cacheKey: "doctor" },
    { model: "Patient", cacheTime: 300, cacheKey: "patient" },
    { model: "HealthcareFacility", cacheTime: 300, cacheKey: "healthcareFacility" },
    { model: "DoctorPassport", cacheTime: 300, cacheKey: "doctorPassport" },
    { model: "DoctorEducation", cacheTime: 300, cacheKey: "doctorEducation" },
    { model: "DoctorCertifications", cacheTime: 300, cacheKey: "doctorCertifications" },
    { model: "DoctorWorkExperience", cacheTime: 300, cacheKey: "doctorWorkExperience" },
    { model: "DoctorReview", cacheTime: 60, cacheKey: "doctorReview" },
    { model: "DoctorHealthService", cacheTime: 300, cacheKey: "doctorHealthService" },
    { model: "DoctorContact", cacheTime: 300, cacheKey: "doctorContact" },
    { model: "DoctorHotelService", cacheTime: 300, cacheKey: "doctorHotelService" },
    { model: "DoctorCarService", cacheTime: 300, cacheKey: "doctorCarService" },
    { model: "DoctorInsurance", cacheTime: 300, cacheKey: "doctorInsurance" },
    { model: "HealthcareFacilityBranch", cacheTime: 300, cacheKey: "healthcareFacilityBranch" },
    { model: "HealthcareFacilityContact", cacheTime: 300, cacheKey: "healthcareFacilityContact" },
    { model: "HealthcareFacilityReview", cacheTime: 60, cacheKey: "healthcareFacilityReview" },
    { model: "HealthcareFacilityHealthService", cacheTime: 300, cacheKey: "healthcareFacilityHealthService" },
    { model: "HealthcareFacilityHotelService", cacheTime: 300, cacheKey: "healthcareFacilityHotelService" },
    { model: "HealthcareFacilityCarService", cacheTime: 300, cacheKey: "healthcareFacilityCarService" },
    { model: "HealthcareFacilityInsurance", cacheTime: 300, cacheKey: "healthcareFacilityInsurance" },
    { model: "Cart", cacheTime: 300, cacheKey: "cart" },
    { model: "OrderDetail", cacheTime: 300, cacheKey: "orderDetail" },
    { model: "OTPVerification", cacheTime: 300, cacheKey: "otpVerification" },
    { model: "Acceptances", cacheTime: 86400, cacheKey: "acceptances" },
    { model: "UserAcceptances", cacheTime: 86400, cacheKey: "userAcceptances" },
    { model: "BlacklistedRefreshToken", cacheTime: 86400, cacheKey: "blacklistedRefreshToken" },
    { model: "RefreshToken", cacheTime: 86400, cacheKey: "refreshToken" },
    { model: "UploadedFile", cacheTime: 86400, cacheKey: "uploadedFile" },
    { model: "CarManufacturer", cacheTime: 300, cacheKey: "carManufacturer" },
    { model: "CarModel", cacheTime: 300, cacheKey: "carModel" },
    { model: "Hotel", cacheTime: 300, cacheKey: "hotel" },
    { model: "Insurance", cacheTime: 300, cacheKey: "insurance" },
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