import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTokens() {
  const users = await prisma.user.findMany({
    where: { email: { contains: 'test' } },
    select: { email: true, confirmationToken: true, emailConfirmed: true }
  });
  
  console.log('All test users:');
  users.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Token: ${user.confirmationToken}`);
    console.log(`Confirmed: ${user.emailConfirmed}`);
    console.log('---');
  });
}

checkTokens().catch(console.error).finally(() => prisma.$disconnect());
