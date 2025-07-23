// Test the full confirmation flow
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConfirmationFlow() {
  console.log('=== Testing Confirmation Flow ===');
  
  // 1. First, let's see what users exist and their confirmation status
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      emailConfirmed: true,
      confirmationToken: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  console.log('\n1. Recent users:');
  users.forEach(user => {
    console.log(`   ${user.email}: confirmed=${user.emailConfirmed}, token=${user.confirmationToken ? 'present' : 'null'}`);
  });
  
  // 2. Find a user with a confirmation token
  const unconfirmedUser = users.find(u => u.confirmationToken && !u.emailConfirmed);
  
  if (!unconfirmedUser) {
    console.log('\n2. No unconfirmed users found. Creating a test user...');
    
    // Create a test user
    const testEmail = 'flow-test@example.com';
    const testToken = 'test-token-' + Date.now();
    
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: 'test-hash',
        firstName: 'Flow',
        lastName: 'Test',
        confirmationToken: testToken,
        totpSecret: 'TEST-SECRET-FOR-FLOW',
        is2faEnabled: true,
        emailConfirmed: false
      }
    });
    
    console.log(`   Created user: ${newUser.email} with token: ${newUser.confirmationToken}`);
    
    // 3. Test the confirmation
    console.log('\n3. Testing confirmation...');
    const response = await fetch(`http://localhost:4000/api/auth/confirm/${testToken}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Confirmation successful:', data);
      
      // 4. Verify the user was updated
      const updatedUser = await prisma.user.findUnique({
        where: { id: newUser.id },
        select: {
          email: true,
          emailConfirmed: true,
          confirmationToken: true
        }
      });
      
      console.log('\n4. User after confirmation:');
      console.log(`   ${updatedUser.email}: confirmed=${updatedUser.emailConfirmed}, token=${updatedUser.confirmationToken ? 'present' : 'null'}`);
      
    } else {
      const error = await response.text();
      console.log('   ❌ Confirmation failed:', response.status, error);
    }
    
  } else {
    console.log(`\n2. Found unconfirmed user: ${unconfirmedUser.email}`);
    console.log(`   Token: ${unconfirmedUser.confirmationToken}`);
    
    // 3. Test the confirmation
    console.log('\n3. Testing confirmation...');
    try {
      const response = await fetch(`http://localhost:4000/api/auth/confirm/${unconfirmedUser.confirmationToken}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Confirmation successful:', data);
        
        // 4. Verify the user was updated
        const updatedUser = await prisma.user.findUnique({
          where: { id: unconfirmedUser.id },
          select: {
            email: true,
            emailConfirmed: true,
            confirmationToken: true
          }
        });
        
        console.log('\n4. User after confirmation:');
        console.log(`   ${updatedUser.email}: confirmed=${updatedUser.emailConfirmed}, token=${updatedUser.confirmationToken ? 'present' : 'null'}`);
        
      } else {
        const error = await response.text();
        console.log('   ❌ Confirmation failed:', response.status, error);
      }
    } catch (err) {
      console.log('   ❌ Network error:', err.message);
      console.log('   This likely means the backend is not running on port 4000');
    }
  }
  
  await prisma.$disconnect();
}

testConfirmationFlow().catch(console.error);
