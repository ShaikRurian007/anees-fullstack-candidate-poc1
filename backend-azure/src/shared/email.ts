import sgMail from '@sendgrid/mail';

const key = process.env.SENDGRID_API_KEY || '';
const sender = process.env.SENDER_EMAIL || 'no-reply@example.com';

export async function sendEmail(to: string, subject: string, html: string) {
  if (!key) return { skipped: true, reason: 'SENDGRID_API_KEY missing' };
  sgMail.setApiKey(key);
  await sgMail.send({ to, from: sender, subject, html });
  return { ok: true };
}
