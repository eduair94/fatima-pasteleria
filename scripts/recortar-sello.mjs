/**
 * Recorte circular del sello, con fondo transparente. El original es un JPG
 * cuadrado sobre su propio crema (#FDF5EA), dos puntos más cálido que el fondo
 * del sitio: sobre la página se le nota el borde. En círculo y sin fondo apoya
 * sobre cualquier crema.
 *
 *   node scripts/recortar-sello.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "sello-fatima.jpg");
const out = path.join(root, "public", "sello-fatima.png");

const SIZE = 600;

const mask = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="#fff"/></svg>`,
);

await sharp(src)
  .resize(SIZE, SIZE, { fit: "cover" })
  .composite([{ input: mask, blend: "dest-in" }])
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(`OK ${path.relative(root, out)} — ${SIZE}×${SIZE}`);
