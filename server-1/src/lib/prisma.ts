

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const url = process.env.DATABASE_URL || '';
const useAccelerate = url.startsWith('prisma://') || url.startsWith('prisma+postgres://');

let prisma: PrismaClient;
if (useAccelerate) {
	// Use Accelerate in prod, but cast to PrismaClient for type safety
	prisma = new PrismaClient().$extends(withAccelerate()) as PrismaClient;
} else {
	prisma = new PrismaClient();
}

export { prisma };
