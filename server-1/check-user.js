import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'confirm-test@example.com' }
  });
  
  console.log('User found:', {
    id: user?.id,
    email: user?.email,
    confirmationToken: user?.confirmationToken,
    totpSecret: user?.totpSecret,
    emailConfirmed: user?.emailConfirmed
  });

  if (user?.totpSecret) {
    // Generate a test TOTP
    const token = speakeasy.totp({ secret: user.totpSecret, encoding: 'base32' });
    console.log('Current TOTP token:', token);
  }
}

checkUser().catch(console.error).finally(() => prisma.$disconnect());
