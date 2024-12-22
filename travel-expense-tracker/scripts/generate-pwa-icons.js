import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateIcons() {
  const sizes = [192, 512];
  const sourceIcon = join(__dirname, '../public/vite.svg');
  const outputDir = join(__dirname, '../public');

  for (const size of sizes) {
    await sharp(sourceIcon)
      .resize(size, size)
      .toFormat('png')
      .toFile(join(outputDir, `pwa-${size}x${size}.png`));
  }

  // Generate apple-touch-icon
  await sharp(sourceIcon)
    .resize(180, 180)
    .toFormat('png')
    .toFile(join(outputDir, 'apple-touch-icon.png'));

  // Generate favicon
  await sharp(sourceIcon)
    .resize(32, 32)
    .toFormat('png')
    .toFile(join(outputDir, 'favicon.png'));
}

generateIcons().catch(console.error);
