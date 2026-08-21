import type { AstroCookies } from "astro";
import { repo, normalizarEmail, type Alumno, type Rol } from "@lib/datos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ACCESO — enlaces mágicos y sesiones
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ─── POR QUÉ NO HAY CONTRASEÑAS ────────────────────────────────────────────
 *
 * Porque no hacen falta para entrar y sí obligan a custodiar un secreto ajeno.
 * Con enlace mágico: no hay hashes que filtrar, no hay recuperación que
 * mantener, no hay nadie reutilizando aquí la contraseña de su banco, y quien
 * pierde el acceso a su correo pierde el acceso a la cuenta — que es
 * exactamente lo mismo que pasa con "he olvidado mi contraseña".
 *
 * Añadir contraseña opcional más adelante no obliga a rehacer esto: sería una
 * segunda forma de crear la misma sesión.
 *
 * ─── LAS TRES REGLAS DEL TOKEN ─────────────────────────────────────────────
 *
 * 1. Se genera con `crypto.getRandomValues`, 32 bytes. No `Math.random()`, que
 *    es predecible y aquí eso significa entrar en la cuenta de otro.
 * 2. En la base se guarda el SHA-256, nunca el token. Un volcado de la tabla no
 *    sirve para entrar.
 * 3. Caduca en 20 minutos y es de un solo uso.
 *
 * ─── LA COOKIE ─────────────────────────────────────────────────────────────
 *
 * `httpOnly` para que ningún script pueda leerla, `sameSite: lax` para que no
 * viaje en peticiones de terceros —que es la defensa contra CSRF— y `secure`
 * fuera de desarrollo. El valor es otro token aleatorio cuyo hash vive en la
 * tabla `sesiones`: la cookie por sí sola no dice quién eres, hay que preguntar.
 */

/** Nombre de la cookie de sesión. */
export const COOKIE_SESION = "e180_sesion";

/** Cuánto vive un enlace mágico. Corto: es un secreto que viaja por correo. */
const MINUTOS_TOKEN = 20;

/** Cuánto vive una sesión iniciada. 30 días, como cualquier área de alumnos. */
const DIAS_SESION = 30;

/** Máximo de enlaces por email y hora. Evita usar el endpoint como buzón. */
export const MAX_PETICIONES_HORA = 5;

/** Token aleatorio en hexadecimal. 32 bytes = 256 bits. */
function tokenAleatorio(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 en hexadecimal. Es lo único que se guarda. */
export async function hash(valor: string): Promise<string> {
  const datos = new TextEncoder().encode(valor);
  const digest = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Crea un enlace mágico para ese alumno y devuelve la URL completa.
 * El token en claro solo existe aquí y dentro del correo; nunca se persiste.
 */
export async function crearEnlaceAcceso(alumno: Alumno, origen: URL): Promise<string> {
  const token = tokenAleatorio();
  const expira = new Date(Date.now() + MINUTOS_TOKEN * 60_000);
  await repo().crearTokenAcceso(alumno.id, await hash(token), expira);

  const url = new URL("/acceso/entrar", origen);
  url.searchParams.set("t", token);
  return url.href;
}

/**
 * Canjea un token por una sesión. Devuelve el alumno o `null`.
 * Al entrar se cierran las sesiones anteriores: quien pide un enlace nuevo
 * porque cree que alguien más tiene acceso espera exactamente eso.
 */
export async function entrarConToken(
  token: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<Alumno | null> {
  const r = repo();
  const alumno = await r.consumirTokenAcceso(await hash(token));
  if (!alumno) return null;

  const sesion = tokenAleatorio();
  const expira = new Date(Date.now() + DIAS_SESION * 86_400_000);
  await r.crearSesion(alumno.id, await hash(sesion), expira, userAgent);
  await r.marcarAcceso(alumno.id);

  cookies.set(COOKIE_SESION, sesion, {
    httpOnly: true,
    sameSite: "lax",
    secure: !import.meta.env.DEV,
    path: "/",
    expires: expira,
  });

  return alumno;
}

/** Quién es quien hace esta petición, o `null`. */
export async function alumnoActual(cookies: AstroCookies): Promise<Alumno | null> {
  const valor = cookies.get(COOKIE_SESION)?.value;
  if (!valor) return null;
  return repo().alumnoDeSesion(await hash(valor));
}

/** Cierra la sesión de este navegador. */
export async function salir(cookies: AstroCookies): Promise<void> {
  const valor = cookies.get(COOKIE_SESION)?.value;
  if (valor) await repo().borrarSesion(await hash(valor));
  cookies.delete(COOKIE_SESION, { path: "/" });
}

/**
 * ¿Este email es admin por configuración?
 *
 * `ADMIN_EMAILS` es una lista separada por comas. Existe para resolver el
 * problema del huevo y la gallina: el primer admin no puede darse de alta desde
 * un panel al que todavía nadie puede entrar. A partir del segundo, se crean
 * desde el panel.
 */
export function esAdminPorConfig(email: string): boolean {
  const lista = import.meta.env.ADMIN_EMAILS ?? "";
  return lista
    .split(",")
    .map((e: string) => normalizarEmail(e))
    .filter(Boolean)
    .includes(normalizarEmail(email));
}

/** El rol que le toca a un email al darse de alta. */
export const rolDe = (email: string): Rol =>
  esAdminPorConfig(email) ? "admin" : "alumno";

/**
 * Depura el `?destino=` con el que se vuelve después de entrar.
 *
 * ⚠️ ESTO EVITA UN REDIRECTOR ABIERTO. Sin filtrar, `?destino=https://otro`
 * convertiría `/acceso/entrar` en una URL que empieza por nuestro dominio y
 * termina en el de un tercero — el envoltorio clásico de un enlace de phishing,
 * y encima dentro de un correo que mandamos nosotros.
 *
 * Solo pasa una ruta interna: empieza por una barra, NO por dos (`//otro.com`
 * es una URL absoluta con el esquema implícito) y no lleva más que letras,
 * números, guiones y barras. Cualquier otra cosa cae al tablero.
 */
export const rutaInterna = (pedido: string | null): string =>
  pedido && /^\/(?!\/)[\w\-/]*$/.test(pedido) ? pedido : "/alumno";
