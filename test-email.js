import { Resend } from 'resend';
import fs from 'fs';

let apiKey = '';
let fromEmail = '';
let fromName = 'Orian Teleservices';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('RESEND_API_KEY=')) {
      apiKey = trimmed.replace('RESEND_API_KEY=', '').trim();
    }
    if (trimmed.startsWith('RESEND_FROM_EMAIL=')) {
      fromEmail = trimmed.replace('RESEND_FROM_EMAIL=', '').trim();
    }
    if (trimmed.startsWith('FROM_NAME=')) {
      fromName = trimmed.replace('FROM_NAME=', '').trim().replace(/^"|"$/g, '') || fromName;
    }
  });
} catch (e) {
  console.error('Could not read .env.local file');
}

console.log('--- Email Setup Diagnostics (Resend) ---');
console.log('RESEND_API_KEY:', apiKey ? 'Loaded (' + apiKey.length + ' chars)' : 'NOT FOUND');
console.log('RESEND_FROM_EMAIL:', fromEmail || 'NOT FOUND');

if (!apiKey || !fromEmail) {
  console.error('❌ Missing RESEND_API_KEY or RESEND_FROM_EMAIL in .env.local');
  process.exit(1);
}

const resend = new Resend(apiKey);

console.log('Attempting to send test email...');
const { data, error } = await resend.emails.send({
  from: `${fromName} <${fromEmail}>`,
  to: fromEmail,
  subject: 'Local Resend Verification Test',
  text: 'If you receive this, your Resend API key, verified domain, and sender address are all working correctly!',
});

if (error) {
  console.error('❌ FAILED with Error:');
  console.error(error);
  process.exit(1);
} else {
  console.log('🎉 SUCCESS! Email sent successfully.');
  console.log('Message ID:', data?.id);
}
