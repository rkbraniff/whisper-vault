import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConfirm() {
  const token = 'f132a2fc78dbd8dd50200d3a8f4086feec7bfdb05fc27fdff044fed6d6c6404d6';
  console.log('Looking for token:', token);
  
  const user = await prisma.user.findFirst({ where: { confirmationToken: token } });
  console.log('User found:', user?.email);
  
  if (user) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { emailConfirmed: true, confirmationToken: null }
    });
    console.log('User updated, emailConfirmed:', updated.emailConfirmed);
  }
}

testConfirm().catch(console.error).finally(() => prisma.$disconnect());
