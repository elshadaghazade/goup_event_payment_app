import "@testing-library/jest-dom";
import { prisma, redis } from "./prisma/prisma";

afterAll(async () => {
    
});

afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
});