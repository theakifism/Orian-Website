// Generates square PWA/favicons from public/logo-icon.png:  node scripts/generate-icons.mjs
import sharp from 'sharp';

const SRC = 'public/logo-icon.png';
const BG = { r: 10, g: 11, b: 13, alpha: 1 }; // #0A0B0D, same as manifest background_color
const trimmed = await sharp(SRC).trim({ threshold: 5 }).toBuffer();
const { width: w, height: h } = await sharp(trimmed).metadata();
console.log(`trimmed mark: ${w}x${h}`);

// Place the mark centred in a size x size square, filling `fill` of the side.
const make = async (size, fill, background, out) => {
  const box = Math.round(size * fill);
  const mark = await sharp(trimmed).resize({ width: box, height: box, fit: 'inside' }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log('wrote', out);
};
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
await make(192, 0.84, clear, 'public/icon-192.png');
await make(512, 0.84, clear, 'public/icon-512.png');
await make(512, 0.58, BG, 'public/icon-maskable-512.png'); // inside the 80% maskable safe zone
await make(180, 0.7, BG, 'public/apple-touch-icon.png');
await make(48, 0.9, clear, 'public/favicon-48.png');
