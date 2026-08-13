import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Sesión del panel de administración.
 *
 * No hay base de usuarios: hay una sola contraseña, y vive **sólo** en la
 * variable de entorno ADMIN_PASSWORD. No hay valor por defecto en el código:
 * sin esa variable el panel no abre para nadie. Al validarla se emite una
 * cookie httpOnly firmada con HMAC-SHA256 y vencimiento, así el servidor no
 * guarda estado y la contraseña no viaja en cada request.
 *
 * Ver README → "Seguridad del panel".
 */

const COOKIE = "fp_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 horas

/** `null` cuando la variable no está definida o quedó vacía. */
function adminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value ? value : null;
}

/** El panel sólo funciona si hay contraseña configurada. */
export function adminIsConfigured(): boolean {
  return adminPassword() !== null;
}

/**
 * Sin ADMIN_SESSION_SECRET la firma se deriva de la contraseña. Funciona, pero
 * ata las dos cosas: cambiar la contraseña invalida las sesiones abiertas.
 */
export function usingDerivedSecret(): boolean {
  return !process.env.ADMIN_SESSION_SECRET?.trim();
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || `fatima-pasteleria::${adminPassword() ?? ""}`;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Se compara igual para no filtrar la longitud por tiempo de respuesta.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(candidate: string): boolean {
  const expected = adminPassword();
  // Sin contraseña configurada no entra nadie, ni siquiera mandando vacío.
  if (expected === null) return false;
  return safeEqual(candidate ?? "", expected);
}

function createToken(): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

function tokenIsValid(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload))) return false;
  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return tokenIsValid(store.get(COOKIE)?.value);
}

/* ------------------------------------------------- límite de intentos --- */

type Attempt = { count: number; until: number };
const attempts = new Map<string, Attempt>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

export function tooManyAttempts(key: string): boolean {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.until < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function registerFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.until < now) {
    attempts.set(key, { count: 1, until: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
