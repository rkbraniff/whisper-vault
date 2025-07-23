import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConfirmQuery() {
  // Test the exact query from the confirmation endpoint
  const token = 'a76480a7ea24f7949adec247b9444a0abd31fa1c15d31cb8a71e10ae6d5f22b9e';
  
  console.log('Testing findFirst query...');
  const user1 = await prisma.user.findFirst({ where: { confirmationToken: token } });
  console.log('findFirst result:', user1 ? 'Found user' : 'No user found');
  
  console.log('Testing findUnique query...');
  try {
    const user2 = await prisma.user.findUnique({ where: { confirmationToken: token } });
    console.log('findUnique result:', user2 ? 'Found user' : 'No user found');
  } catch (error) {
    console.log('findUnique error:', error.message);
  }
  
  console.log('Testing findMany query...');
  const users = await prisma.user.findMany({ where: { confirmationToken: token } });
  console.log('findMany result:', users.length, 'users found');
  
  // Let's also check the exact string match
  console.log('Token length:', token.length);
  console.log('Token type:', typeof token);
  
  // Get all users and check their tokens manually
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, confirmationToken: true }
  });
  
  console.log('Manual token comparison:');
  for (const user of allUsers) {
    if (user.confirmationToken) {
      console.log(`User ${user.email}:`);
      console.log(`  Token: ${user.confirmationToken}`);
      console.log(`  Length: ${user.confirmationToken.length}`);
      console.log(`  Matches: ${user.confirmationToken === token}`);
      console.log(`  Strict match: ${user.confirmationToken.toString() === token.toString()}`);
    }
  }
  
  await prisma.$disconnect();
}

testConfirmQuery().catch(console.error);
