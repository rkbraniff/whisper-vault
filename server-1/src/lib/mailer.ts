import nodemailer from 'nodemailer';
import qrcode from 'qrcode';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendConfirmationEmail(to: string, token: string, otpauthUrl?: string, base32?: string) {
  // Use the SPA route for confirmation
  const url = `${process.env.CLIENT_ORIGIN}/confirm/${token}`;
  let qrImg = '';
  if (otpauthUrl) {
    try {
      console.log('[MAILER] otpauthUrl:', otpauthUrl);
      qrImg = await qrcode.toDataURL(otpauthUrl);
      console.log('[MAILER] qrImg (first 100 chars):', qrImg?.slice(0, 100));
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  } else {
    console.warn('[MAILER] No otpauthUrl provided, cannot generate QR code.');
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Confirm your WhisperVault account',
      html: `<p>Click <a href="${url}">here</a> to confirm your account.</p>
        ${qrImg ? `<p>Scan this QR code in your authenticator app:</p><img src='${qrImg}' alt='2FA QR Code' /><p>Or enter this code manually: <b>${base32}</b></p>` : ''}
        <p>After confirming your email, you will be required to use 2FA to log in.</p>`
    });
    console.log(`Confirmation email sent to ${to}`);
    console.log('Nodemailer info:', info);
  } catch (err) {
    console.error('Error sending confirmation email:', err);
  }
}
