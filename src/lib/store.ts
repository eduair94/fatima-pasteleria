import "server-only";

import { seedCatalog } from "./catalog-seed";
import type { Catalog, Product, Settings } from "./types";

/**
 * Almacenamiento del catálogo, con tres controladores y sin dependencias:
 *
 *   1. `upstash`  — Redis por REST (Upstash o Vercel KV). Es el modo de
 *                   producción: persiste entre despliegues y entre regiones.
 *   2. `fs`       — archivo `data/catalog.json`. Sólo en desarrollo local.
 *   3. `memory`   — respaldo. Sirve para ver el sitio, pero cada instancia
 *                   arranca desde la semilla. El panel lo avisa.
 *
 * Ver README → "Persistencia del catálogo".
 */

const KEY = "fatima:catalog:v1";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export type StoreDriver = "upstash" | "fs" | "memory";

export function storeDriver(): StoreDriver {
  if (REDIS_URL && REDIS_TOKEN) return "upstash";
  if (!process.env.VERCEL) return "fs";
  return "memory";
}

export function storeIsDurable(): boolean {
  return storeDriver() !== "memory";
}

/* ------------------------------------------------------------------ memoria */

const globalStore = globalThis as unknown as { __fatimaCatalog?: Catalog };

/* ------------------------------------------------------------------ upstash */

async function redisCommand(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Redis respondió ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`Redis: ${json.error}`);
  return json.result ?? null;
}

/* ----------------------------------------------------------------- archivo */

async function fsPaths() {
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "data");
  return { dir, file: path.join(dir, "catalog.json") };
}

// El controlador de archivo es sólo para desarrollo local: en Vercel el disco
// es de sólo lectura y storeDriver() nunca lo elige. Los comentarios
// `turbopackIgnore` evitan que el trazador incluya todo el proyecto en el
// bundle del servidor por culpa de estas rutas dinámicas.
async function readFromFile(): Promise<Catalog | null> {
  try {
    const fs = await import("node:fs/promises");
    const { file } = await fsPaths();
    return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ file, "utf8")) as Catalog;
  } catch {
    return null;
  }
}

async function writeToFile(catalog: Catalog): Promise<void> {
  const fs = await import("node:fs/promises");
  const { dir, file } = await fsPaths();
  await fs.mkdir(/*turbopackIgnore: true*/ dir, { recursive: true });
  await fs.writeFile(/*turbopackIgnore: true*/ file, JSON.stringify(catalog, null, 2), "utf8");
}

/* -------------------------------------------------------------------- API */

function normalize(raw: Partial<Catalog> | null): Catalog {
  const seed = seedCatalog();
  if (!raw || !Array.isArray(raw.products) || raw.products.length === 0) return seed;
  return {
    products: raw.products.map((p) => ({ ...p, images: p.images ?? [] })),
    settings: { ...seed.settings, ...(raw.settings ?? {}) },
  };
}

export async function readCatalog(): Promise<Catalog> {
  const driver = storeDriver();

  if (driver === "upstash") {
    try {
      const value = await redisCommand(["GET", KEY]);
      if (typeof value === "string") return normalize(JSON.parse(value));
      if (value && typeof value === "object") return normalize(value as Partial<Catalog>);
    } catch (error) {
      console.error("[store] no se pudo leer de Redis, se usa la semilla:", error);
    }
    return seedCatalog();
  }

  if (driver === "fs") {
    return normalize(await readFromFile());
  }

  globalStore.__fatimaCatalog ??= seedCatalog();
  return globalStore.__fatimaCatalog;
}

export async function writeCatalog(catalog: Catalog): Promise<void> {
  const driver = storeDriver();

  if (driver === "upstash") {
    await redisCommand(["SET", KEY, JSON.stringify(catalog)]);
    return;
  }

  if (driver === "fs") {
    await writeToFile(catalog);
    return;
  }

  globalStore.__fatimaCatalog = catalog;
}

/* ------------------------------------------------------------- selectores */

export async function getProducts(): Promise<Product[]> {
  const { products } = await readCatalog();
  return [...products].sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.order - b.order;
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { products } = await readCatalog();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getSettings(): Promise<Settings> {
  const { settings } = await readCatalog();
  return settings;
}

export async function saveProducts(products: Product[]): Promise<void> {
  const catalog = await readCatalog();
  await writeCatalog({ ...catalog, products });
}

export async function saveSettings(settings: Settings): Promise<void> {
  const catalog = await readCatalog();
  await writeCatalog({ ...catalog, settings: { ...settings, updatedAt: new Date().toISOString() } });
}

export async function resetCatalog(): Promise<void> {
  await writeCatalog(seedCatalog());
}
