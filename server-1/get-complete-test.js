import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCompleteTestUser() {
  const user = await prisma.user.findFirst({ 
    where: { email: 'complete-test@example.com' } 
  });
  
  console.log('Complete test user:', JSON.stringify(user, null, 2));
  
  await prisma.$disconnect();
}

getCompleteTestUser().catch(console.error);
