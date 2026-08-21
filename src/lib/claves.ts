import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTRASEÑAS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ UNA CONTRASEÑA NO SE GUARDA NUNCA. Se guarda el resultado de pasarla por
 * una función de derivación lenta, con una sal distinta para cada alumno. Si
 * algún día alguien se lleva la tabla `alumnos`, lo que se lleva no sirve para
 * entrar aquí ni —lo que es peor— en el banco de nadie que haya reutilizado su
 * contraseña.
 *
 * ─── POR QUÉ scrypt Y NO bcrypt NI argon2 ──────────────────────────────────
 *
 * Los dos son excelentes y los dos son módulos NATIVOS: hay que compilarlos, y
 * en un despliegue serverless eso es una dependencia binaria más que puede
 * romperse al cambiar de runtime. `scrypt` viene DENTRO de Node, está diseñado
 * exactamente para esto y es duro contra ataques con hardware dedicado porque
 * exige memoria, no solo ciclos.
 *
 * ─── LOS PARÁMETROS, Y POR QUÉ VIAJAN EN EL PROPIO HASH ─────────────────────
 *
 * `scrypt$N$r$p$sal$clave`. Guardar los parámetros junto al hash es lo que
 * permite subirlos dentro de dos años sin invalidar las contraseñas de todo el
 * mundo: cada hash sabe con qué coste se calculó, así que los viejos se siguen
 * comprobando con el suyo mientras los nuevos usan el nuevo.
 *
 * N = 16384 es el coste recomendado por el RFC 7914 para uso interactivo. Sube
 * el tiempo a ~100 ms por intento, que es imperceptible para quien entra y
 * carísimo para quien prueba millones.
 *
 * ─── COMPARAR EN TIEMPO CONSTANTE ──────────────────────────────────────────
 *
 * Con `===`, la comparación se corta en el primer byte que no cuadra, y el
 * tiempo que tarda filtra cuántos bytes eran correctos. `timingSafeEqual`
 * siempre tarda lo mismo.
 */

const derivar = promisify(scrypt) as (
  clave: string,
  sal: Buffer,
  largo: number,
  opciones: { N: number; r: number; p: number },
) => Promise<Buffer>;

const N = 16384;
const R = 8;
const P = 1;
const LARGO = 64;

/** Mínimo de caracteres. Ver la nota de `validarClave`. */
export const MIN_CLAVE = 10;

/** Devuelve `scrypt$N$r$p$sal$hash`, todo en hexadecimal. */
export async function cifrarClave(clave: string): Promise<string> {
  const sal = randomBytes(16);
  const hash = await derivar(clave.normalize("NFKC"), sal, LARGO, { N, r: R, p: P });
  return ["scrypt", N, R, P, sal.toString("hex"), hash.toString("hex")].join("$");
}

/**
 * ¿Coincide? Devuelve `false` ante cualquier cosa rara en lugar de reventar:
 * un hash con formato inesperado en la base no puede tumbar el inicio de sesión
 * de todo el mundo.
 */
export async function verificarClave(
  clave: string,
  guardado: string | null,
): Promise<boolean> {
  if (!guardado) return false;

  const partes = guardado.split("$");
  if (partes.length !== 6 || partes[0] !== "scrypt") return false;

  const [, n, r, p, salHex, hashHex] = partes;
  const opciones = { N: Number(n), r: Number(r), p: Number(p) };
  if (!Number.isFinite(opciones.N) || !Number.isFinite(opciones.r)) return false;

  try {
    const esperado = Buffer.from(hashHex!, "hex");
    const calculado = await derivar(
      clave.normalize("NFKC"),
      Buffer.from(salHex!, "hex"),
      esperado.length,
      opciones,
    );
    return timingSafeEqual(esperado, calculado);
  } catch {
    return false;
  }
}

/**
 * Trabajo en balde, a propósito.
 *
 * ⚠️ ESTO NO ES UN DESPERDICIO, ES LA DEFENSA CONTRA LA ENUMERACIÓN POR TIEMPO.
 * Si al no existir el correo respondiéramos al instante y al existir tardáramos
 * 100 ms comprobando el hash, cualquiera podría averiguar qué correos están
 * dados de alta cronometrando las respuestas — sin necesidad de acertar ni una
 * contraseña. Con esto, los dos caminos cuestan lo mismo.
 */
export async function quemarTiempo(clave: string): Promise<void> {
  await verificarClave(
    clave,
    `scrypt$${N}$${R}$${P}$${"0".repeat(32)}$${"0".repeat(128)}`,
  );
}

/**
 * ¿Vale esta contraseña? Devuelve el motivo, o `null` si está bien.
 *
 * ─── LARGO MÍNIMO Y NADA MÁS ───────────────────────────────────────────────
 *
 * Ni mayúsculas obligatorias, ni un número, ni un símbolo. Esas reglas están
 * desaconsejadas desde hace años (NIST SP 800-63B) porque no producen
 * contraseñas más fuertes: producen "Password1!" y un post-it en el monitor.
 * Lo que de verdad importa es la LONGITUD, así que se pide longitud.
 */
export function validarClave(clave: string): "corta" | "larga" | null {
  const c = clave.normalize("NFKC");
  if (c.length < MIN_CLAVE) return "corta";
  /* Tope alto pero existente: sin límite, una contraseña de un megabyte
     convierte cada intento en un ataque de denegación de servicio contra
     nuestro propio servidor, que es quien tiene que derivarla. */
  if (c.length > 200) return "larga";
  return null;
}
