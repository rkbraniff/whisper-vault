import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSpecificToken() {
  // Token from the logs for confirm-test@example.com
  const token = 'a76480a7ea24f7949adec247b9444a0abd31fa1c15d31cb8a71e10ae6d5f22b9e';
  
  console.log('Looking for token:', token);
  
  const user = await prisma.user.findFirst({ where: { confirmationToken: token } });
  console.log('User found:', user);
  
  // Also check if this user exists by email
  const userByEmail = await prisma.user.findFirst({ where: { email: 'confirm-test@example.com' } });
  console.log('User by email:', userByEmail);
  
  await prisma.$disconnect();
}

checkSpecificToken().catch(console.error);
