/**
 * Imagen social (Open Graph / Twitter) a partir de la foto del carrot cake.
 * Las fotos del feed son verticales; para compartir hace falta 1200 × 630, así
 * que se recorta la banda donde se ven el frosting y las capas.
 *
 *   node scripts/generar-og.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "fotos", "02_carrot_cake_02.webp");
const out = path.join(root, "public", "og.jpg");

const WIDTH = 1200;
const HEIGHT = 630;

const resized = await sharp(src).resize({ width: WIDTH }).toBuffer();
const { height } = await sharp(resized).metadata();

// La banda interesante arranca por debajo de la mitad: espiral de frosting
// arriba, nuez y capas abajo.
const top = Math.round(height * 0.4);

await sharp(resized)
  .extract({ left: 0, top, width: WIDTH, height: HEIGHT })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(out);

console.log(`OK ${path.relative(root, out)} — ${WIDTH}×${HEIGHT}`);
