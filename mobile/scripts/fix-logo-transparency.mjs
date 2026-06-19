import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, '..', 'assets');
const inputPath = path.join(assetsDir, 'new_memora_app_logo.png');
const outputPath = path.join(assetsDir, 'new_memora_app_logo.png');

const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const centerX = width / 2;
const centerY = height / 2;
const cornerDistance = Math.min(width, height) * 0.36;

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const index = (y * width + x) * channels;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isNearWhite = r > 235 && g > 235 && b > 235;
    const isCornerPadding = distance > cornerDistance;

    if (isNearWhite && isCornerPadding) {
      data[index + 3] = 0;
    }
  }
}

const radius = Math.round(Math.min(width, height) * 0.18);
const mask = Buffer.from(
  `<svg width="${width}" height="${height}"><rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/></svg>`,
);

await sharp(data, { raw: { width, height, channels } })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toFile(outputPath);

console.log(`Updated ${outputPath} (${width}x${height})`);
