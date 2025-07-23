import speakeasy from 'speakeasy';

// Test what speakeasy does with our base32 secret
const testSecret = 'FBZSYKK2LBXXK2B3HFLWMQ3HKVLE4VD5PAUVK3JSGBFG2SZ4M54A';

console.log('Input secret:', testSecret);

const otpauthUrl = speakeasy.otpauthURL({
  secret: testSecret,
  label: 'test@example.com',
  issuer: 'WhisperVault',
});

console.log('OtpauthUrl:', otpauthUrl);

// Extract secret from the URL
const urlParams = new URLSearchParams(otpauthUrl.split('?')[1]);
const secretFromUrl = urlParams.get('secret');
console.log('Secret from URL:', secretFromUrl);
console.log('Secrets match:', testSecret === secretFromUrl);

// Test generating a TOTP to see what secret we should use
console.log('\nTesting TOTP generation:');
const token1 = speakeasy.totp({ secret: testSecret, encoding: 'base32' });
const token2 = speakeasy.totp({ secret: secretFromUrl, encoding: 'base32' });
console.log('Token from original secret:', token1);
console.log('Token from URL secret:', token2);
console.log('Tokens match:', token1 === token2);
