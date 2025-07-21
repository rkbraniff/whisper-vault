import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(to: string, body: string) {
  if (process.env.NODE_ENV === 'test') {
    console.log(`[FAKE SMS] to: ${to}, body: ${body}`);
    return Promise.resolve();
  }
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
}
