import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = process.env.NODE_ENV === 'test'
  ? path.resolve(__dirname, '../../../.env.test')
  : path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const prisma = new PrismaClient().$extends(withAccelerate());
