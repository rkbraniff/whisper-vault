import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFinalTestUser() {
  const user = await prisma.user.findFirst({ 
    where: { email: 'final-test@example.com' } 
  });
  
  console.log('Final test user:', JSON.stringify(user, null, 2));
  
  await prisma.$disconnect();
}

checkFinalTestUser().catch(console.error);
