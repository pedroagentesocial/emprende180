import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { PREVIEW_DEMO } from "@lib/previewDemo";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATOS SELLADOS: el nombre del cliente referido, cifrado en la base
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * En los negocios médicos (las clínicas, Lira Medical), saber que alguien es
 * cliente ya es información protegida. El Embajador puede ver el nombre de
 * quien refirió solo si ese cliente lo autorizó, y aun así el nombre no se
 * guarda en claro: si alguien se lleva una copia de la base, se lleva texto
 * que no se puede leer sin la clave.
 *
 * AES-256-GCM: cifra y además detecta cualquier cambio en lo cifrado (la
 * etiqueta). Formato guardado: `v1.<iv>.<etiqueta>.<cifrado>`, en base64url.
 * La `v1` es para poder cambiar de clave o de algoritmo algún día sin dejar de
 * leer lo viejo.
 *
 * ⚠️ LA CLAVE ES `AMBASSADOR_DATA_KEY`: 32 bytes en base64
 * (`openssl rand -base64 32`). Vive en las variables de entorno de Vercel y
 * nunca en el repositorio. Perderla es perder los nombres guardados; las
 * comisiones no dependen de ella.
 *
 * ⚠️ SIN CLAVE EN PRODUCCIÓN NO SE GUARDA NINGÚN NOMBRE. `seal` devuelve
 * `null` y el portal enseña "Cliente #4": mejor sin nombre que con un nombre
 * en claro. En desarrollo se usa una clave fija de prueba, avisando.
 */

const VERSION = "v1";
let warned = false;

function key(): Buffer | null {
  const raw = import.meta.env.AMBASSADOR_DATA_KEY as string | undefined;
  if (raw) {
    const k = Buffer.from(raw, "base64");
    if (k.length === 32) return k;
    console.error("[sealed] AMBASSADOR_DATA_KEY no son 32 bytes en base64: no se cifra nada.");
    return null;
  }
  if (import.meta.env.DEV || PREVIEW_DEMO) {
    if (!warned) {
      console.warn("[sealed] Sin AMBASSADOR_DATA_KEY: se usa una clave de PRUEBA (solo desarrollo).");
      warned = true;
    }
    return Buffer.alloc(32, 7);
  }
  return null;
}

/** Cifra un texto. `null` si no hay clave: el llamador guarda `null`. */
export function seal(plain: string): string | null {
  const k = key();
  if (!k) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv, tag, body]
    .map((p) => (typeof p === "string" ? p : p.toString("base64url")))
    .join(".");
}

/**
 * Descifra. `null` si no hay clave, si el formato no es el nuestro o si lo
 * cifrado se tocó: un nombre que no se puede leer se enseña como "Cliente #4",
 * nunca rompe la página.
 */
export function unseal(sealed: string | null | undefined): string | null {
  if (!sealed) return null;
  const k = key();
  if (!k) return null;
  const [version, iv, tag, body] = sealed.split(".");
  if (version !== VERSION || !iv || !tag || !body) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", k, Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(body, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}
