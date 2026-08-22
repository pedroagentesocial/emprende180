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
export const MIN_PASSWORD = 10;

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

/**
 * Is this password acceptable? Returns the reason, or `null` if it's fine.
 *
 * ─── A MINIMUM LENGTH AND NOTHING ELSE ─────────────────────────────────────
 *
 * No mandatory capital, no digit, no symbol. Those rules have been discouraged
 * for years (NIST SP 800-63B) because they don't produce stronger passwords:
 * they produce "Password1!" and a sticky note on the monitor. What actually
 * matters is LENGTH, so length is what's asked for.
 */
export function validatePassword(password: string): "short" | "long" | null {
  const p = password.normalize("NFKC");
  if (p.length < MIN_PASSWORD) return "short";
  /* A high but existing ceiling: with no limit, a one-megabyte password turns
     every attempt into a denial-of-service attack against our own server, which
     is the one that has to derive it. */
  if (p.length > 200) return "long";
  return null;
}
