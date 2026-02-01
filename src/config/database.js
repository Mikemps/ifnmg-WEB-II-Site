import pkg from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import 'dotenv/config';

const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
  log: ['query', 'info', 'warn', 'error'],
}).$extends(withAccelerate());

export default prisma;
