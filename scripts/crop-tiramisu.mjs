/**
 * La portada del reel de tiramisú viene con banda negra arriba y abajo
 * (fragmento de video vertical). Se recorta al área con imagen y se guarda
 * como WebP para usarla en el catálogo.
 *
 *   node scripts/crop-tiramisu.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "fotos", "03_tiramisu_reel_cover_01.jpg");
const out = path.join(root, "public", "fotos", "03_tiramisu_01.webp");

const image = sharp(src);
const { width, height } = await image.metadata();

// Las bandas negras ocupan el 32,5 % superior y el 32,5 % inferior del alto.
const top = Math.round(height * 0.325);
const cropHeight = height - top * 2;

await image
  .extract({ left: 0, top, width, height: cropHeight })
  .webp({ quality: 82 })
  .toFile(out);

console.log(`OK ${path.relative(root, out)} — ${width}×${cropHeight}`);
