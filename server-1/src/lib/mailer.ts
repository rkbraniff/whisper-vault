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

export async function sendConfirmationEmail(to: string, token: string, otpauthUrl?: string, base32?: string, qrImg?: string) {
  // Use the SPA route for confirmation
  const url = `${process.env.CLIENT_ORIGIN}/whispervault/confirm/${token}`;
  // Use qrImg if provided, otherwise generate from otpauthUrl
  let qrImage = qrImg ?? await qrcode.toDataURL(otpauthUrl!, { errorCorrectionLevel: 'L', margin: 1, scale: 4 });
  if (!qrImage && otpauthUrl) {
    try {
      console.log('[MAILER] otpauthUrl:', otpauthUrl);
      qrImage = await qrcode.toDataURL(otpauthUrl);
      console.log('[MAILER] qrImg (first 100 chars):', qrImage?.slice(0, 100));
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  } else if (!qrImage) {
    console.warn('[MAILER] No otpauthUrl or qrImg provided, cannot generate QR code.');
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Confirm your WhisperVault account',
      html: `<p>Click <a href="${url}">here</a> to confirm your account.</p>
        ${qrImage ? `<p>Scan this QR code in your authenticator app:</p><img src='${qrImage}' alt='2FA QR Code' /><p>Or enter this code manually: <b>${base32}</b></p>` : ''}
        <p>After confirming your email, you will be required to use 2FA to log in.</p>`
    });
    console.log(`Confirmation email sent to ${to}`);
    console.log('Nodemailer info:', info);
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    console.error('SMTP config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS ? '***' : undefined,
      from: process.env.EMAIL_FROM
    });
    console.error('Recipient:', to);
    console.error('Confirmation URL:', url);
  }
}
