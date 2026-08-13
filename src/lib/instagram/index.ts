import { apifyProvider } from "./apify";
import { rapidApiProvider } from "./rapidapi";
import type { InstagramPost, InstagramProvider, ProviderName } from "./types";

export type { InstagramPost, ProviderName } from "./types";
export { ProviderError } from "./types";

const PROVIDERS: InstagramProvider[] = [apifyProvider, rapidApiProvider];

/**
 * Proveedor en uso. Se elige con INSTAGRAM_PROVIDER; si no está definida, se
 * toma el primero que tenga sus variables cargadas. Cambiar de proveedor es
 * cambiar una variable de entorno: estos servicios se caen o cambian de forma
 * seguido y no conviene atarse a uno.
 */
export function activeProvider(): InstagramProvider | null {
  const preferred = process.env.INSTAGRAM_PROVIDER?.trim() as ProviderName | undefined;

  if (preferred) {
    return PROVIDERS.find((provider) => provider.name === preferred) ?? null;
  }

  return PROVIDERS.find((provider) => provider.isConfigured()) ?? null;
}

export function providerStatus() {
  const active = activeProvider();
  return {
    active: active?.name ?? null,
    configured: active?.isConfigured() ?? false,
    missing: active?.missingConfig() ?? [],
    available: PROVIDERS.map((provider) => ({
      name: provider.name,
      configured: provider.isConfigured(),
    })),
  };
}

export async function fetchLatestPosts(username: string, limit = 12): Promise<InstagramPost[]> {
  const provider = activeProvider();
  if (!provider) throw new Error("No hay proveedor de Instagram configurado.");
  if (!provider.isConfigured()) {
    throw new Error(`Falta configurar ${provider.missingConfig().join(", ")}.`);
  }
  return provider.fetchLatestPosts({ username, limit });
}
