import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PASSWORDS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ A PASSWORD IS NEVER STORED. What is stored is the result of running it
 * through a slow derivation function, with a different salt for every student.
 * If someone ever walks off with the `alumnos` table, what they take is useless
 * for getting in here and — which matters more — useless at the bank of anyone
 * who reused their password.
 *
 * ─── WHY scrypt AND NOT bcrypt OR argon2 ───────────────────────────────────
 *
 * Both are excellent and both are NATIVE modules: they have to be compiled, and
 * in a serverless deploy that is one more binary dependency that can break when
 * the runtime changes. `scrypt` ships INSIDE Node, is designed for exactly this,
 * and is hard on dedicated-hardware attacks because it demands memory, not just
 * cycles.
 *
 * ─── THE PARAMETERS, AND WHY THEY TRAVEL INSIDE THE HASH ────────────────────
 *
 * `scrypt$N$r$p$salt$key`. Storing the parameters next to the hash is what makes
 * it possible to raise them in two years without invalidating everyone's
 * password: each hash knows what cost it was computed with, so the old ones keep
 * being checked with theirs while new ones use the new cost.
 *
 * N = 16384 is the cost RFC 7914 recommends for interactive use. It puts each
 * attempt at ~100 ms, which is imperceptible for the person signing in and
 * ruinous for anyone trying millions.
 *
 * ─── CONSTANT-TIME COMPARISON ──────────────────────────────────────────────
 *
 * With `===`, the comparison stops at the first byte that doesn't match, and how
 * long it took leaks how many bytes were right. `timingSafeEqual` always takes
 * the same time.
 */

const derive = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  length: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

const N = 16384;
const R = 8;
const P = 1;
const LENGTH = 64;

/** Minimum length. See the note on `validatePassword`. */
export const MIN_PASSWORD = 8;

/**
 * Un signo: cualquier cosa que no sea letra ni número.
 *
 * `\p{L}` y `\p{N}` con la bandera `u` en vez de `[a-zA-Z0-9]`, porque si no la
 * "ñ" y las vocales con tilde contarían como símbolo y alguien pasaría la regla
 * escribiendo "Contraseña1" creyendo que ha puesto un signo.
 */
const SIGNO = /[^\p{L}\p{N}]/u;
const MAYUSCULA = /\p{Lu}/u;

/** Returns `scrypt$N$r$p$salt$hash`, all in hexadecimal. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password.normalize("NFKC"), salt, LENGTH, { N, r: R, p: P });
  return ["scrypt", N, R, P, salt.toString("hex"), hash.toString("hex")].join("$");
}

/**
 * Does it match? Returns `false` on anything odd instead of blowing up: a hash
 * with an unexpected shape sitting in the database must not be able to take
 * everybody's sign-in down.
 */
export async function verifyPassword(
  password: string,
  stored: string | null,
): Promise<boolean> {
  if (!stored) return false;

  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, n, r, p, saltHex, hashHex] = parts;
  const options = { N: Number(n), r: Number(r), p: Number(p) };
  if (!Number.isFinite(options.N) || !Number.isFinite(options.r)) return false;

  try {
    const expected = Buffer.from(hashHex!, "hex");
    const computed = await derive(
      password.normalize("NFKC"),
      Buffer.from(saltHex!, "hex"),
      expected.length,
      options,
    );
    return timingSafeEqual(expected, computed);
  } catch {
    return false;
  }
}

/**
 * Wasted work, on purpose.
 *
 * ⚠️ THIS ISN'T WASTE, IT IS THE DEFENCE AGAINST TIMING ENUMERATION. If a
 * missing email answered instantly and an existing one took 100 ms checking the
 * hash, anyone could work out which emails are registered by timing the
 * responses — without ever guessing a password. With this, both paths cost the
 * same.
 */
export async function burnTime(password: string): Promise<void> {
  await verifyPassword(
    password,
    `scrypt$${N}$${R}$${P}$${"0".repeat(32)}$${"0".repeat(128)}`,
  );
}

export type FalloClave = "short" | "long" | "upper" | "symbol";

/**
 * Is this password acceptable? Returns the reason, or `null` if it's fine.
 *
 * ─── OCHO CARACTERES, UNA MAYÚSCULA Y UN SIGNO ─────────────────────────────
 *
 * Decisión del negocio, tomada a sabiendas, y conviene que quede escrito por qué
 * no es lo que recomienda el manual: NIST SP 800-63B desaconseja desde hace años
 * obligar a mayúsculas y símbolos, porque no producen contraseñas más fuertes
 * sino "Password1!" y un papelito pegado al monitor. Ocho con reglas de
 * composición es, en la práctica, más débil que doce libres.
 *
 * Se pide igualmente porque es lo que la gente espera de un portal serio y
 * porque discutirlo en cada alta cuesta más de lo que vale. Lo que sí se hace es
 * NO castigar al que hace lo correcto: una frase larga sin símbolos falla, pero
 * la pantalla enseña las tres reglas desde el principio en vez de rechazar tres
 * veces seguidas, que es donde la gente se rinde.
 *
 * El orden de las comprobaciones importa: se responde por el primer fallo, y va
 * primero la longitud porque es el que se arregla escribiendo más.
 */
export function validatePassword(password: string): FalloClave | null {
  const p = password.normalize("NFKC");
  if (p.length < MIN_PASSWORD) return "short";
  /* A high but existing ceiling: with no limit, a one-megabyte password turns
     every attempt into a denial-of-service attack against our own server, which
     is the one that has to derive it. */
  if (p.length > 200) return "long";
  if (!MAYUSCULA.test(p)) return "upper";
  if (!SIGNO.test(p)) return "symbol";
  return null;
}
