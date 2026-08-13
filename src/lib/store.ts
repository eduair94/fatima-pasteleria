import "server-only";

import { seedCatalog } from "./catalog-seed";
import type { Catalog, Product, Proposal, Settings, SyncReport } from "./types";

/**
 * Almacenamiento del catálogo, con cuatro controladores. Se elige el primero
 * que esté disponible:
 *
 *   1. `upstash`  — Redis por REST (Upstash o Vercel KV), sin dependencias.
 *   2. `blob`     — Vercel Blob. Alcanza con conectar un store al proyecto:
 *                   Vercel inyecta BLOB_READ_WRITE_TOKEN y esto se activa solo.
 *   3. `fs`       — archivo `data/catalog.json`. Sólo en desarrollo local.
 *   4. `memory`   — respaldo. Sirve para ver el sitio, pero cada instancia
 *                   arranca desde la semilla. El panel lo avisa.
 *
 * Ver README → "Persistencia del catálogo".
 */

const KEY = "fatima:catalog:v1";
const BLOB_PREFIX = "catalogo-";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export type StoreDriver = "upstash" | "blob" | "fs" | "memory";

export function storeDriver(): StoreDriver {
  if (REDIS_URL && REDIS_TOKEN) return "upstash";
  if (BLOB_TOKEN) return "blob";
  if (!process.env.VERCEL) return "fs";
  return "memory";
}

export function storeIsDurable(): boolean {
  return storeDriver() !== "memory";
}

/** Hay Blob conectado: se pueden subir fotos desde el panel. */
export function blobIsAvailable(): boolean {
  return Boolean(BLOB_TOKEN);
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

/* --------------------------------------------------------------- blob */

type BlobEntry = { url: string; pathname: string; uploadedAt: string };

/**
 * Cada guardado sube un archivo nuevo con marca de tiempo en el nombre y borra
 * los viejos: la URL cambia en cada cambio, así que el CDN nunca sirve una
 * versión vieja.
 *
 * El listado va por REST y no con `list()` del SDK, por dos razones que
 * costaron caro: hay que poder pedirlo con `no-store` —cacheado, una lectura
 * posterior a un guardado devolvía el catálogo anterior y lo resucitaba al
 * volver a escribirlo— y hay que ordenar por la marca de tiempo del nombre,
 * porque `uploadedAt` tiene resolución de segundo y dos guardados seguidos
 * quedan empatados.
 */
async function blobNewest(fresh: boolean): Promise<BlobEntry[] | null> {
  const response = await fetch(
    `https://blob.vercel-storage.com?prefix=${encodeURIComponent(BLOB_PREFIX)}&limit=100`,
    {
      headers: { authorization: `Bearer ${BLOB_TOKEN}` },
      // El modo sigue al de la lectura: `no-store` en todos lados volvía
      // dinámicas las páginas que tienen que prerenderizarse.
      cache: fresh ? "no-store" : "force-cache",
    },
  );

  if (!response.ok) {
    throw new Error(`Blob respondió ${response.status} al listar.`);
  }

  const { blobs } = (await response.json()) as { blobs?: BlobEntry[] };
  if (!blobs?.length) return null;

  const marca = (entry: BlobEntry) => {
    const match = /catalogo-(\d+)/.exec(entry.pathname);
    return match ? Number(match[1]) : Date.parse(entry.uploadedAt);
  };

  return [...blobs].sort((a, b) => marca(b) - marca(a));
}

async function readFromBlob(fresh: boolean): Promise<Catalog | null> {
  const blobs = await blobNewest(fresh);
  if (!blobs) return null;

  // Dos modos, a propósito:
  //
  // - Las páginas públicas leen cacheado. La URL cambia en cada guardado, así
  //   que su contenido es inmutable; pedirla con `no-store` volvía dinámicas
  //   las fichas de producto y las hacía caer a la semilla en el build.
  // - El panel y la sincronización leen fresco. Con caché, un cambio recién
  //   escrito no se ve en la llamada siguiente, y eso rompía el seguimiento
  //   del trabajo del scraper: cada consulta arrancaba una corrida nueva.
  const response = await fetch(blobs[0].url, { cache: fresh ? "no-store" : "force-cache" });
  if (!response.ok) return null;
  return (await response.json()) as Catalog;
}

async function writeToBlob(catalog: Catalog): Promise<void> {
  const { put, del } = await import("@vercel/blob");
  await put(`${BLOB_PREFIX}${Date.now()}.json`, JSON.stringify(catalog), {
    access: "public",
    token: BLOB_TOKEN,
    contentType: "application/json",
    addRandomSuffix: true,
  });

  // Se conservan las dos versiones anteriores por si hay que volver atrás.
  const blobs = await blobNewest(true);
  const stale = blobs?.slice(3) ?? [];
  if (stale.length) {
    await del(
      stale.map((blob) => blob.url),
      { token: BLOB_TOKEN },
    );
  }
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
    proposals: Array.isArray(raw.proposals) ? raw.proposals : [],
    lastSync: raw.lastSync,
    // Se conserva: sin esto cada consulta arrancaba una corrida nueva del
    // scraper en lugar de recolectar la que ya estaba andando.
    pendingJob: raw.pendingJob ?? null,
  };
}

/**
 * Lee el catálogo.
 *
 * `fresh` salta las cachés. Lo usan el panel y la sincronización, donde leer
 * un valor viejo significa perder un cambio recién guardado. Las páginas
 * públicas usan el modo cacheado, que es lo que les permite prerenderizarse.
 */
export async function readCatalog({ fresh = false } = {}): Promise<Catalog> {
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

  if (driver === "blob") {
    try {
      return normalize(await readFromBlob(fresh));
    } catch (error) {
      console.error("[store] no se pudo leer del Blob, se usa la semilla:", error);
      return seedCatalog();
    }
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

  if (driver === "blob") {
    await writeToBlob(catalog);
    return;
  }

  if (driver === "fs") {
    await writeToFile(catalog);
    return;
  }

  globalStore.__fatimaCatalog = catalog;
}

/* ------------------------------------------------------------- selectores */

/*
 * Los selectores de lectura NO piden lectura fresca: los usan las páginas
 * públicas —`getSettings` corre en el layout, o sea en todas— y forzarles
 * `no-store` vuelve dinámico el sitio entero. Se refrescan con el `revalidate`
 * de cada página y con el `revalidatePath` que dispara el panel al guardar.
 */

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
  const catalog = await readCatalog({ fresh: true });
  await writeCatalog({ ...catalog, products });
}

export async function saveSettings(settings: Settings): Promise<void> {
  const catalog = await readCatalog({ fresh: true });
  await writeCatalog({ ...catalog, settings: { ...settings, updatedAt: new Date().toISOString() } });
}

export async function resetCatalog(): Promise<void> {
  await writeCatalog(seedCatalog());
}

/* ------------------------------------------- propuestas de Instagram --- */

export async function getProposals(): Promise<Proposal[]> {
  const { proposals } = await readCatalog({ fresh: true });
  return proposals ?? [];
}

export async function saveProposals(proposals: Proposal[]): Promise<void> {
  const catalog = await readCatalog({ fresh: true });
  await writeCatalog({ ...catalog, proposals });
}

export async function saveSyncReport(report: SyncReport, proposals: Proposal[]): Promise<void> {
  const catalog = await readCatalog({ fresh: true });
  await writeCatalog({ ...catalog, proposals, lastSync: report });
}
