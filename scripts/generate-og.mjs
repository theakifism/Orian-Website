// Generates one 1200x630 Open Graph image per site section (public/og/<key>.png), re-using the
// logo band and top accent bar from public/og-image.png so previews stay on-brand.
// Run with: npm run generate-og  (output is committed; re-run when headlines or SITE_URL change).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SITE_URL } from '../src/seo/siteConfig.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = new URL(SITE_URL).host;
const BG = { r: 10, g: 11, b: 13 };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// key -> [headline lines, sub-line]. Keys match OG_SECTIONS in src/seo/siteConfig.js.
const SECTIONS = {
  services: [['Bulk SMS, Voice, DLT &', 'WhatsApp API Services'], 'Enterprise messaging on a carrier-grade network'],
  industries: [['Bulk SMS & Voice API', 'for Every Industry'], 'Banks · Hospitals · Retail · Education · Logistics'],
  'use-cases': [['Bulk SMS Use Cases:', 'OTP, Alerts & Campaigns'], 'Transactional · Promotional · Reminders'],
  'why-us': [['Why Choose Orian', 'for Bulk SMS Delivery'], '24/7 support · DLT setup · Strong carrier network'],
  resources: [['Bulk SMS & DLT Guides', 'for Indian Businesses'], 'SMS segments · DLT templates · OTP best practices'],
  developers: [['Bulk SMS API', 'REST & SMPP for Developers'], 'Send OTPs and alerts with real-time delivery reports'],
  compliance: [['DLT & TRAI Compliance', 'Made Simple'], 'Sender ID · Templates · Registration support'],
  about: [['About Orian Teleservices', 'Bulk SMS API Provider'], 'Built by messaging industry veterans'],
  local: [['Bulk SMS Service', 'in Nagpur, Maharashtra'], 'DLT-compliant bulk SMS · OTP API · Voice · WhatsApp'],
};

const header = await sharp(path.join(root, 'public/og-image.png')).extract({ left: 0, top: 0, width: 1200, height: 250 }).toBuffer();
await mkdir(path.join(root, 'public/og'), { recursive: true });

for (const [key, [lines, sub]] of Object.entries(SECTIONS)) {
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" font-family="DejaVu Sans, Verdana, sans-serif">
    <text x="80" y="335" font-size="60" font-weight="700" fill="#F4F5F7">${esc(lines[0])}</text>
    <text x="80" y="415" font-size="60" font-weight="700" fill="#F4F5F7">${esc(lines[1])}</text>
    <text x="80" y="498" font-size="30" fill="#9AA0AB">${esc(sub)}</text>
    <text x="80" y="580" font-size="30" fill="#00C48C">${esc(host)}</text>
  </svg>`;
  const out = path.join(root, 'public/og', `${key}.png`);
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: BG } })
    .composite([{ input: header, top: 0, left: 0 }, { input: Buffer.from(svg), top: 0, left: 0 }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out);
  console.log('og:', out);
}
