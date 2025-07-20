import 'dotenv/config';
import { afterAll } from 'vitest';
import { prisma } from './src/lib/prisma.js';
afterAll(async () => prisma.$disconnect());
