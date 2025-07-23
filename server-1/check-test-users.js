import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTestUsers() {
  console.log('Checking all users...');
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      confirmationToken: true,
      emailConfirmed: true,
      createdAt: true
    }
  });
  
  console.log('All users:', JSON.stringify(allUsers, null, 2));
  
  // Check specifically for test users
  const testUsers = allUsers.filter(user => 
    user.email.includes('test-url') || 
    user.email.includes('fresh-test') ||
    user.email.includes('smoketest')
  );
  
  console.log('\nTest users:', JSON.stringify(testUsers, null, 2));
  
  // Check if any users have null confirmationToken
  const confirmedUsers = allUsers.filter(user => user.confirmationToken === null);
  console.log('\nUsers with null confirmation token:', JSON.stringify(confirmedUsers, null, 2));
  
  await prisma.$disconnect();
}

checkTestUsers().catch(console.error);
