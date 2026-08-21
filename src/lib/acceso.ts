import type { AstroCookies } from "astro";
import { repo, normalizarEmail, type Alumno, type Rol } from "@lib/datos";
import { cifrarClave, verificarClave, quemarTiempo } from "@lib/claves";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ACCESO — enlaces mágicos y sesiones
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ─── DOS PUERTAS PARA LA MISMA CASA ────────────────────────────────────────
 *
 *   · CORREO Y CONTRASEÑA — el día a día. Lo que la gente espera y lo que no
 *     obliga a abrir el buzón cada vez que quiere ver un video.
 *   · ENLACE POR CORREO — estrenar la cuenta y recuperarla. El alumno al que
 *     dan de alta todavía no tiene contraseña, y el que la olvida necesita
 *     poner otra. Las dos cosas son el mismo gesto: demostrar que el buzón es
 *     tuyo y elegir clave.
 *
 * Las dos acaban en `abrirSesion`, así que a partir de ahí el resto del sistema
 * no sabe ni le importa por dónde entró nadie.
 *
 * ⚠️ La contraseña se guarda como scrypt con sal. Ver `src/lib/claves.ts`: aquí
 * no hay ni una línea que meta una contraseña en la base tal cual.
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

/** Abre sesión para un alumno ya identificado y planta la cookie. */
async function abrirSesion(
  alumno: Alumno,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<void> {
  const r = repo();
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
}

/**
 * Canjea un token por una sesión. Devuelve el alumno o `null`.
 *
 * El enlace del correo es la INVITACIÓN y el RESTABLECIMIENTO: entra y lleva a
 * ponerse contraseña. No es la forma normal de entrar —eso es el correo y la
 * contraseña—, sino la de estrenar cuenta y la de recuperarla.
 */
export async function entrarConToken(
  token: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<Alumno | null> {
  const alumno = await repo().consumirTokenAcceso(await hash(token));
  if (!alumno) return null;
  await abrirSesion(alumno, cookies, userAgent);
  return alumno;
}

/**
 * Entrar con correo y contraseña.
 *
 * ⚠️ DEVUELVE `null` PARA LOS TRES FALLOS POSIBLES —no existe, está de baja, la
 * contraseña no es— y quien llama solo puede decir "correo o contraseña
 * incorrectos". Distinguirlos sería regalar un comprobador de clientes:
 * "contraseña incorrecta" confirma que ese correo compró el curso.
 *
 * ⚠️ Y CUANDO NO EXISTE, SE QUEMA EL MISMO TIEMPO. Sin eso, el "no existe"
 * respondería al instante y el "contraseña mala" tardaría los ~100 ms del
 * scrypt: cronometrando las respuestas se puede enumerar la lista de alumnos
 * sin acertar ni una contraseña.
 */
export async function entrarConClave(
  email: string,
  clave: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<Alumno | null> {
  const r = repo();
  const guardado = await r.claveDe(email);

  if (!guardado) {
    await quemarTiempo(clave);
    return null;
  }

  if (!(await verificarClave(clave, guardado))) return null;

  const alumno = await r.alumnoPorEmail(email);
  if (!alumno?.activo) return null;

  await abrirSesion(alumno, cookies, userAgent);
  return alumno;
}

/**
 * Guarda una contraseña nueva y CIERRA LAS DEMÁS SESIONES.
 *
 * Esa segunda parte es la mitad del motivo de existir del restablecimiento:
 * quien cambia su contraseña porque cree que alguien más entró en su cuenta
 * espera echarlo, no compartir cuenta con él hasta que caduque su cookie. Se
 * vuelve a abrir sesión aquí mismo para no echar también a quien la cambió.
 */
export async function cambiarClave(
  alumno: Alumno,
  clave: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<void> {
  const r = repo();
  await r.guardarClave(alumno.id, await cifrarClave(clave));
  await r.borrarSesionesDe(alumno.id);
  await abrirSesion(alumno, cookies, userAgent);
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
 * Manda el enlace de acceso a ese correo, si procede.
 *
 * Vive aquí y no dentro de la ruta de API porque hay DOS sitios que necesitan
 * hacer exactamente esto: el endpoint JSON que usa la isla de React y el POST
 * del formulario cuando el JavaScript no ha llegado. Dos copias de una decisión
 * de seguridad es una copia de más — la que se acaba olvidando de actualizar.
 *
 * ⚠️ NO DICE si el correo existe. Devuelve lo mismo en los dos casos, y quien
 * llama tampoco puede distinguirlos: `enlaceDev` solo se rellena en desarrollo.
 */
export async function mandarEnlaceAcceso(
  email: string,
  idioma: "es" | "en",
  origen: URL,
  correo: {
    asunto: (lang: "es" | "en") => string;
    cuerpo: (lang: "es" | "en", url: string) => string;
    responderA: string;
  },
): Promise<{ enlaceDev: string | null }> {
  const r = repo();

  // Límite por EMAIL: el de IP no protege al dueño del buzón, que es quien
  // recibiría los correos si alguien decide usar esto para molestarle.
  const haceUnaHora = new Date(Date.now() - 3_600_000);
  if ((await r.contarPeticiones(email, haceUnaHora)) >= MAX_PETICIONES_HORA) {
    console.warn(`[acceso] Demasiadas peticiones para ${email}`);
    return { enlaceDev: null };
  }
  await r.registrarPeticion(email);

  let alumno = await r.alumnoPorEmail(email);

  // Arranque: el primer admin no tiene panel donde darse de alta.
  if (!alumno && esAdminPorConfig(email)) {
    alumno = await r.crearAlumno({ email, nombre: null, rol: rolDe(email), idioma });
    console.log(`[acceso] Admin creado desde ADMIN_EMAILS: ${email}`);
  }

  if (!alumno || !alumno.activo) {
    console.log(`[acceso] Petición para un email sin alta activa: ${email}`);
    return { enlaceDev: null };
  }

  const enlace = await crearEnlaceAcceso(alumno, origen);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.NOTIFY_EMAIL_FROM;

  /* Sin credenciales de correo el enlace se escribe en la consola, y en
     desarrollo se devuelve además a quien llamó: es lo que permite probar el
     circuito entero sin montar un buzón. `import.meta.env.DEV` lo sustituye
     Vite por `false` al compilar, así que esta rama no existe en producción. */
  if (!apiKey || !from) {
    console.warn(
      `[acceso] MODO DEMO — sin RESEND_API_KEY. Enlace para ${email}:\n  ${enlace}`,
    );
    return { enlaceDev: import.meta.env.DEV ? enlace : null };
  }

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [alumno.email],
        reply_to: correo.responderA,
        subject: correo.asunto(alumno.idioma),
        text: correo.cuerpo(alumno.idioma, enlace),
      }),
    });
    if (!respuesta.ok) {
      console.error("[acceso] Resend rechazó el envío:", await respuesta.text());
    }
  } catch (error) {
    console.error("[acceso] Error al contactar con Resend:", error);
  }

  return { enlaceDev: null };
}

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
