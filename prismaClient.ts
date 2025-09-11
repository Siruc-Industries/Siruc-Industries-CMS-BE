import { PrismaClient } from '@prisma/client'

const runtimeUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_POOL_URL || process.env.DATABASE_URL
    : process.env.DATABASE_URL

export const prisma = new PrismaClient({
  datasources: { db: { url: runtimeUrl } },
})