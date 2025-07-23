import nodemailer from 'nodemailer';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

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
  
  console.log('[MAILER] Received otpauthUrl:', otpauthUrl);
  console.log('[MAILER] Received base32 secret:', base32);
  
  // Use the provided otpauthUrl if available, otherwise generate from base32
  let qrImage = '';
  let finalOtpauthUrl = otpauthUrl;
  
  if (!finalOtpauthUrl && base32) {
    finalOtpauthUrl = speakeasy.otpauthURL({
      secret: base32,
      label: to,
      issuer: process.env.TOTP_ISSUER || 'WhisperVault',
    });
    console.log('[MAILER] Generated otpauthUrl from base32:', finalOtpauthUrl);
  }
  
  if (finalOtpauthUrl) {
    qrImage = await qrcode.toDataURL(finalOtpauthUrl);
    console.log('[MAILER] QR code generated from otpauthUrl');
  }
  try {
    // Convert QR code to attachment if we have one
    const attachments = [];
    let qrCodeCid = null;
    
    if (qrImage) {
      // Extract base64 data from data URL
      const base64Data = qrImage.replace(/^data:image\/png;base64,/, '');
      qrCodeCid = 'qrcode@whispervault';
      
      attachments.push({
        filename: '2fa-qrcode.png',
        content: base64Data,
        encoding: 'base64',
        cid: qrCodeCid
      });
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Confirm your WhisperVault account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Confirm your WhisperVault account</h2>
          <p>Click <a href="${url}" style="color: #007bff;">here</a> to confirm your account.</p>
          
          ${qrCodeCid ? `
            <div style="margin: 20px 0; text-align: center;">
              <h3>Setup 2FA Authentication</h3>
              <p>Scan this QR code with your authenticator app:</p>
              <div style="background: white; padding: 20px; display: inline-block; border-radius: 8px;">
                <img src="cid:${qrCodeCid}" alt="2FA QR Code" style="display: block; max-width: 200px; height: auto;" />
              </div>
              <p style="margin-top: 15px;">
                <strong>Or enter this code manually:</strong><br>
                <code style="background: #f8f9fa; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 14px;">${base32}</code>
              </p>
            </div>
          ` : `
            <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border-radius: 4px;">
              <p><strong>Manual Setup Code:</strong></p>
              <code style="background: #f8f9fa; padding: 8px 12px; border-radius: 4px; font-family: monospace;">${base32 || 'Not available'}</code>
            </div>
          `}
          
          <p style="margin-top: 20px; color: #666;">
            After confirming your email, you must use 2-factor authentication to log in.
          </p>
        </div>
      `,
      attachments: attachments
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
