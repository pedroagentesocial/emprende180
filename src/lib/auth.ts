import type { AstroCookies } from "astro";
import { repo, normaliseEmail, type Student, type Role } from "@lib/data";
import { hashPassword, verifyPassword, burnTime } from "@lib/passwords";
import { avisarAGhl } from "@lib/ghl";
import { limpiarSiToca } from "@lib/mantenimiento";
import { CODE_EMAIL } from "@lib/loginEmail";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUTH — magic links and sessions
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ─── TWO DOORS INTO THE SAME HOUSE ─────────────────────────────────────────
 *
 *   · EMAIL AND PASSWORD — the everyday one. What people expect, and what
 *     doesn't force them to open their inbox every time they want to watch a
 *     video.
 *   · EMAILED LINK — starting the account and recovering it. A student who has
 *     just been registered has no password yet, and one who forgets theirs
 *     needs to set another. Both are the same gesture: prove the inbox is yours
 *     and choose a password.
 *
 * Both end in `openSession`, so from there on the rest of the system neither
 * knows nor cares which way anyone came in.
 *
 * ⚠️ The password is stored as scrypt with a salt. See `src/lib/passwords.ts`:
 * there is not one line here that puts a password into the database as-is.
 *
 * ─── THE THREE RULES OF THE TOKEN ──────────────────────────────────────────
 *
 * 1. Generated with `crypto.getRandomValues`, 32 bytes. Not `Math.random()`,
 *    which is predictable, and here that means getting into someone's account.
 * 2. The database stores the SHA-256, never the token. A dump of the table is
 *    no use for getting in.
 * 3. It expires in 20 minutes and works once.
 *
 * ─── THE COOKIE ────────────────────────────────────────────────────────────
 *
 * `httpOnly` so no script can read it, `sameSite: lax` so it doesn't travel on
 * third-party requests — which is the defence against CSRF — and `secure`
 * outside development. The value is another random token whose hash lives in
 * the `sesiones` table: the cookie on its own doesn't say who you are, you have
 * to ask.
 */

/** Name of the session cookie. */
export const SESSION_COOKIE = "e180_sesion";

/** How long a magic link lives. Short: it's a secret that travels by email. */
const TOKEN_MINUTES = 20;

/** How long a started session lives. 30 days, like any student area. */
const SESSION_DAYS = 30;

/** Maximum links per email per hour. Stops the endpoint being used as a mailer. */
export const MAX_REQUESTS_PER_HOUR = 5;

/** Random token in hexadecimal. 32 bytes = 256 bits. */
function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 in hexadecimal. It is the only thing stored. */
export async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Creates a magic link for that student and returns the full URL.
 * The plaintext token only exists here and inside the email; it is never stored.
 */
export async function createMagicLink(student: Student, origin: URL): Promise<string> {
  const token = randomToken();
  const expires = new Date(Date.now() + TOKEN_MINUTES * 60_000);
  await repo().createMagicToken(student.id, await sha256(token), expires);

  /**
   * ⚠️ EN PRODUCCIÓN EL ENLACE SE CONSTRUYE CON EL DOMINIO CONFIGURADO, NO CON
   * EL DE LA PETICIÓN, y esto no es una preferencia de estilo.
   *
   * Este enlace ES la llave de la cuenta. Si el dominio sale de una cabecera
   * que llega de fuera, quien pueda manipular esa cabecera decide a qué
   * servidor va a parar la llave del alumno. Y aunque nadie lo manipule, ya
   * pasó lo otro: sin `security.allowedDomains` en `astro.config.mjs`,
   * `Astro.url` valía `https://localhost` en producción y CADA enlace enviado
   * habría sido inservible, pareciendo un fallo del correo.
   *
   * Con esto, el enlace solo puede apuntar al sitio configurado, pase lo que
   * pase con las cabeceras o con la configuración del framework. En desarrollo
   * se sigue usando la petición, o los enlaces de prueba en local llevarían a
   * producción.
   */
  const base =
    import.meta.env.PROD && import.meta.env.SITE
      ? new URL(import.meta.env.SITE)
      : origin;

  const url = new URL("/login/verify", base);
  url.searchParams.set("t", token);
  return url.href;
}

/** Opens a session for an already-identified student and plants the cookie. */
async function openSession(
  student: Student,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<void> {
  const r = repo();
  const session = randomToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await r.createSession(student.id, await sha256(session), expires, userAgent);

  /**
   * ¿Es la primera vez que esta persona entra?
   *
   * ⚠️ SE MIRA ANTES DE `markSignIn`, Y ESE ORDEN ES TODO. `markSignIn` estampa
   * la fecha de entrada; después de llamarlo, `lastSignIn` ya no está vacío
   * NUNCA y esta comprobación no volvería a ser cierta jamás. El `student` que
   * llega aquí se leyó antes de tocar nada, así que su `lastSignIn` en blanco
   * significa exactamente "no había entrado hasta ahora".
   */
  const primeraVez = student.lastSignIn === null;

  await r.markSignIn(student.id);

  /* Sin `await`, igual que en el panel: entrar no puede depender de que GHL
     conteste. Ver `@lib/ghl`, que además nunca lanza. */
  if (primeraVez) avisarAGhl("activacion", student).catch(() => {});

  cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: !import.meta.env.DEV,
    path: "/",
    expires,
  });
}

/**
 * Exchanges a token for a session. Returns the student or `null`.
 *
 * The emailed link is the INVITATION and the RESET: it gets you in and takes you
 * to set a password. It is not the normal way in — that's email and password —
 * but the way to start an account and the way to recover one.
 */
export async function signInWithToken(
  token: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<Student | null> {
  const student = await repo().consumeMagicToken(await sha256(token));
  if (!student) return null;
  await openSession(student, cookies, userAgent);
  return student;
}

/**
 * Sign in with email and password.
 *
 * ⚠️ RETURNS `null` FOR ALL THREE POSSIBLE FAILURES — doesn't exist, is
 * deactivated, wrong password — and the caller can only say "wrong email or
 * password". Telling them apart would hand out a customer checker: "wrong
 * password" confirms that this email bought the course.
 *
 * ⚠️ AND WHEN THERE IS NO SUCH ACCOUNT, THE SAME TIME IS BURNED. Without that,
 * "no such account" would answer instantly while "bad password" took the ~100 ms
 * of the scrypt: timing the responses would enumerate the student list without
 * guessing a single password.
 */
export async function signInWithPassword(
  email: string,
  password: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<Student | null> {
  const r = repo();
  const stored = await r.passwordHashOf(email);

  if (!stored) {
    await burnTime(password);
    return null;
  }

  if (!(await verifyPassword(password, stored))) return null;

  const student = await r.studentByEmail(email);
  if (!student?.active) return null;

  await openSession(student, cookies, userAgent);
  return student;
}

/**
 * Entra con un proveedor externo (Google, Facebook).
 *
 * ⚠️ NO CREA CUENTAS, Y ESE ES EL PUNTO ENTERO. Recibe un correo que el
 * proveedor ya verificó (ver `@lib/oauth`) y busca al alumno que lo tiene. Si
 * no existe, devuelve `null` y quien llama manda de vuelta al acceso.
 *
 * El portal es de quien compró el curso: un "entrar con Google" que diera de
 * alta convertiría el área de alumnos en algo a lo que entra cualquiera con
 * una cuenta de Gmail.
 *
 * ⚠️ Y DEVUELVE `null` IGUAL para "no existe" y para "está desactivado", por
 * lo mismo que `signInWithPassword`: dos mensajes distintos son un
 * comprobador de clientes.
 */
export async function abrirSesionDeProveedor(
  email: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<Student | null> {
  const student = await repo().studentByEmail(email.trim().toLowerCase());
  if (!student?.active) return null;

  await openSession(student, cookies, userAgent);
  return student;
}

/**
 * Saves a new password and CLOSES EVERY OTHER SESSION.
 *
 * That second part is half the reason a reset exists: someone changing their
 * password because they think somebody else got into their account expects to
 * throw them out, not to share the account until their cookie expires. A new
 * session is opened right here so the person who made the change isn't thrown
 * out too.
 */
export async function changePassword(
  student: Student,
  password: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<void> {
  const r = repo();
  await r.savePassword(student.id, await hashPassword(password));
  await r.deleteSessionsOf(student.id);
  await openSession(student, cookies, userAgent);
}

/** Who is making this request, or `null`. */
export async function currentStudent(cookies: AstroCookies): Promise<Student | null> {
  const value = cookies.get(SESSION_COOKIE)?.value;
  if (!value) return null;
  return repo().studentBySession(await sha256(value));
}

/**
 * Signs this browser out.
 *
 * ⚠️ THE ROW GOES BEFORE THE COOKIE, AND BOTH GO. Deleting only the cookie
 * would leave the token valid for anyone who had copied it; deleting only the
 * row would leave the browser sending a dead cookie on every request.
 */
export async function signOut(cookies: AstroCookies): Promise<void> {
  const value = cookies.get(SESSION_COOKIE)?.value;
  if (value) await repo().deleteSession(await sha256(value));
  cookies.delete(SESSION_COOKIE, { path: "/" });
}

/**
 * Is this email an admin by configuration?
 *
 * `ADMIN_EMAILS` is a comma-separated list. It exists to solve the chicken and
 * egg problem: the first admin cannot register from a panel nobody can get into
 * yet. From the second one on, they are created from the panel.
 */
export function isAdminByConfig(email: string): boolean {
  const list = import.meta.env.ADMIN_EMAILS ?? "";
  return list
    .split(",")
    .map((e: string) => normaliseEmail(e))
    .filter(Boolean)
    .includes(normaliseEmail(email));
}

/** The role an email gets at sign-up. */
export const roleFor = (email: string): Role =>
  isAdminByConfig(email) ? "admin" : "student";

/**
 * Sends the access link to that address, if appropriate.
 *
 * It lives here and not inside the API route because TWO places need to do
 * exactly this: the JSON endpoint the React island calls, and the form POST for
 * when JavaScript hasn't arrived. Two copies of a security decision is one copy
 * too many — the one that eventually stops being updated.
 *
 * ⚠️ IT DOESN'T SAY whether the email exists. It returns the same thing either
 * way, and the caller can't tell them apart either: `devLink` is only filled in
 * during development.
 */
export async function sendMagicLink(
  email: string,
  language: "es" | "en",
  origin: URL,
  mail: {
    subject: (lang: "es" | "en") => string;
    body: (lang: "es" | "en", url: string) => string;
    replyTo: string;
  },
): Promise<{ devLink: string | null }> {
  const r = repo();

  /* Buen momento para tirar lo caducado: es justo la operación que llena
     `peticiones_acceso`, y así la tabla se vacía al mismo ritmo al que se llena.
     Sin `await`: ver `@lib/mantenimiento`. */
  limpiarSiToca();

  // Limit by EMAIL: the IP one doesn't protect the owner of the inbox, who is
  // the person who would receive the mail if somebody used this to annoy them.
  const anHourAgo = new Date(Date.now() - 3_600_000);
  if ((await r.countRequests(email, anHourAgo)) >= MAX_REQUESTS_PER_HOUR) {
    console.warn(`[auth] Too many requests for ${email}`);
    return { devLink: null };
  }
  await r.recordRequest(email);

  let student = await r.studentByEmail(email);

  // Bootstrap: the first admin has no panel to register from.
  if (!student && isAdminByConfig(email)) {
    student = await r.createStudent({
      email,
      name: null,
      role: roleFor(email),
      language,
    });
    console.log(`[auth] Admin created from ADMIN_EMAILS: ${email}`);
  }

  if (!student || !student.active) {
    console.log(`[auth] Request for an email with no active account: ${email}`);
    return { devLink: null };
  }

  const link = await createMagicLink(student, origin);

  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.NOTIFY_EMAIL_FROM;

  /* With no mail credentials the link is written to the console, and in
     development it is also handed back to the caller: that is what makes it
     possible to test the whole circuit without setting up an inbox.
     `import.meta.env.DEV` is replaced by `false` at build time, so this branch
     does not exist in production. */
  if (!apiKey || !from) {
    console.warn(
      `[auth] DEMO MODE — no RESEND_API_KEY. Link for ${email}:\n  ${link}`,
    );
    return { devLink: import.meta.env.DEV ? link : null };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [student.email],
        reply_to: mail.replyTo,
        subject: mail.subject(student.language),
        text: mail.body(student.language, link),
      }),
    });
    if (!response.ok) {
      console.error("[auth] Resend rejected the send:", await response.text());
    }
  } catch (error) {
    console.error("[auth] Error contacting Resend:", error);
  }

  return { devLink: null };
}

/**
 * Sanitises the `?next=` that brings someone back after signing in.
 *
 * ⚠️ THIS IS WHAT PREVENTS AN OPEN REDIRECT. Unfiltered, `?next=https://other`
 * would turn `/login/verify` into a URL that starts with our domain and ends at
 * a third party's — the classic wrapper of a phishing link, and inside an email
 * we sent ourselves.
 *
 * Only an internal path gets through: it starts with one slash, NOT two
 * (`//other.com` is an absolute URL with an implicit scheme) and contains
 * nothing but letters, digits, dashes and slashes. Anything else falls back to
 * the dashboard.
 */
/* ═══════════════════════════════════════════════════════════════════════════
   EL CÓDIGO DE SEIS DÍGITOS
   ═══════════════════════════════════════════════════════════════════════════

   Sustituye al enlace mágico EN LA PANTALLA DE ACCESO (13-10-2026). El enlace
   sigue existiendo para /subscribe, que manda uno al darse de alta: ahí no es
   un reto de entrada, es la forma de volver más adelante.

   ⚠️ POR QUÉ UN CÓDIGO Y NO UN ENLACE. Un enlace se abre donde se abre el
   correo. Con público que lee el correo en el móvil, el enlace abre el
   navegador DENTRO de Gmail, que es otro navegador sin la sesión ni el
   historial: entras en un sitio donde no querías estar. Un código se teclea
   donde ya estabas.

   ⚠️ Y POR QUÉ UN CÓDIGO ES SEGURO AQUÍ. Seis dígitos son un millón de
   combinaciones, que para una máquina no es nada. Lo que lo sostiene son tres
   cosas juntas, y quitar cualquiera lo rompe:

     1. CINCO INTENTOS por código, contados EN LA BASE y no en memoria. Ver la
        nota de `intentos` en `db/schema.sql`: en serverless hay varias
        instancias y un contador en memoria es como no tener ninguno.
     2. DIEZ MINUTOS de vida. El del enlace eran veinte; un código que se
        teclea en el momento no necesita tanto, y cada minuto de más es tiempo
        de ataque.
     3. EL LÍMITE POR IP de la ruta, que corta a quien prueba en masa.

   ⚠️ EL CÓDIGO NO SE GUARDA, SE GUARDA SU HASH. Igual que el enlace y que las
   contraseñas: quien lea esa tabla —una copia de seguridad, un volcado— no
   puede entrar en ninguna cuenta. */

/**
 * Manda el correo con el código. Mismo camino que el del enlace: si no hay
 * credenciales de correo, lo escribe en la consola, que es lo que permite
 * probar el circuito entero sin montar un buzón.
 */
async function enviarCorreoCodigo(
  destino: string,
  language: "es" | "en",
  codigo: string,
): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.NOTIFY_EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(`[auth] MODO DEMO — sin RESEND_API_KEY. Código para ${destino}: ${codigo}`);
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [destino],
        reply_to: CODE_EMAIL.replyTo,
        subject: CODE_EMAIL.subject(language),
        text: CODE_EMAIL.body(language, codigo),
      }),
    });
    if (!response.ok) {
      console.error("[auth] Resend rechazó el envío del código:", await response.text());
    }
  } catch (error) {
    console.error("[auth] Error contactando con Resend:", error);
  }
}

const CODIGO_MINUTOS = 10;
const CODIGO_INTENTOS = 5;

/**
 * Seis dígitos de verdad al azar.
 *
 * ⚠️ `crypto.getRandomValues` Y NO `Math.random()`. El segundo es predecible a
 * partir de unas pocas salidas, y esto es la llave de una cuenta.
 *
 * El rango va de 0 a 999999 y se rellena con ceros a la izquierda, así que
 * "000042" es un código posible: recortar los ceros dejaría fuera una parte
 * del espacio y haría el resto más fácil de adivinar.
 */
function nuevoCodigo(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0]! % 1_000_000;
  return String(n).padStart(6, "0");
}

/**
 * Crea y manda el código. Devuelve el código SOLO en desarrollo, para poder
 * probar sin abrir el correo; en producción devuelve `null`.
 *
 * ⚠️ NO DICE SI LA CUENTA EXISTE, igual que `sendMagicLink`. Si respondiera
 * distinto, esta ruta sería un comprobador de clientes: cualquiera podría
 * probar direcciones para averiguar quién compró el curso.
 */
export async function enviarCodigo(
  email: string,
  language: "es" | "en",
): Promise<{ devCodigo: string | null }> {
  const r = repo();
  const student = await r.studentByEmail(email.trim().toLowerCase());
  /* Sin cuenta, o dada de baja: se calla y responde como si nada. */
  if (!student?.active) return { devCodigo: null };

  const codigo = nuevoCodigo();
  const expira = new Date(Date.now() + CODIGO_MINUTOS * 60_000);
  await r.createMagicToken(student.id, await sha256(codigo), expira);

  await enviarCorreoCodigo(student.email, language, codigo);

  return { devCodigo: import.meta.env.DEV ? codigo : null };
}

/**
 * Canjea el código por una sesión.
 *
 * Devuelve el alumno si entra, o el motivo por el que no. Los motivos NO se
 * distinguen de cara al visitante —la pantalla dice lo mismo para todos— pero
 * sí hacen falta aquí: `agotado` tiene que dejar de aceptar intentos aunque el
 * siguiente sea el bueno.
 */
export async function entrarConCodigo(
  email: string,
  codigo: string,
  cookies: AstroCookies,
  userAgent: string | null,
): Promise<{ student: Student | null; motivo: "ok" | "malo" | "agotado" | "caducado" }> {
  const r = repo();
  const student = await r.studentByEmail(email.trim().toLowerCase());
  if (!student?.active) return { student: null, motivo: "caducado" };

  const fila = await r.findActiveCode(student.id);
  if (!fila) return { student: null, motivo: "caducado" };

  /* El tope se mira ANTES de comparar: si ya se gastaron los cinco, da igual
     que este sea el correcto. Lo contrario dejaría probar indefinidamente
     mientras se acierte al final. */
  if (fila.intentos >= CODIGO_INTENTOS) return { student: null, motivo: "agotado" };

  if (fila.tokenHash !== (await sha256(codigo.trim()))) {
    await r.bumpCodeAttempt(fila.id);
    return { student: null, motivo: "malo" };
  }

  const entrado = await r.consumeCodeById(fila.id);
  if (!entrado) return { student: null, motivo: "caducado" };

  await openSession(entrado, cookies, userAgent);
  return { student: entrado, motivo: "ok" };
}

export const internalPath = (requested: string | null): string =>
  requested && /^\/(?!\/)[\w\-/]*$/.test(requested) ? requested : "/student";
