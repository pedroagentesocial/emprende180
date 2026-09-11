/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CUANDO LA BASE DE DATOS NO CONTESTA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El portal entero depende de Postgres: identificar a alguien es leer una fila.
 * Eso no se puede evitar sin dejar entrar a quien no debe, así que la base caída
 * significa portal cerrado. Lo que sí se puede evitar es CÓMO se cierra.
 *
 * Sin esto, una base que no contesta produce un 500 del servidor: pantalla en
 * blanco con un mensaje de error, y quien lo ve concluye que la página está
 * rota o —peor— que le han quitado el acceso. Con esto ve una página nuestra
 * que dice qué pasa, que es temporal y que no ha perdido nada.
 *
 * ⚠️ 503 Y NO 500, Y NO ES UN DETALLE. El 500 dice "este servidor tiene un
 * fallo"; el 503 dice "no estoy disponible ahora, vuelve". Los buscadores
 * tratan un 503 con `Retry-After` como una pausa y no desindexan; con 500
 * repetidos sí empiezan a quitar páginas. Y los monitores saben distinguir un
 * error de programación de una dependencia caída.
 *
 * ⚠️ LO QUE ESTA PÁGINA NO HACE: no tapa errores de programación. Solo se pinta
 * cuando el fallo es RECONOCIBLE como de base de datos; cualquier otra
 * excepción se vuelve a lanzar tal cual, para que salga en el registro y se
 * arregle. Una red de seguridad que se traga todos los fallos es una manera
 * cara de no enterarse de nada.
 *
 * ⚠️ LA LANDING NO PASA POR AQUÍ, a propósito: no toca la base de datos, y el
 * formulario de contacto tampoco depende de ella para capturar (ver
 * `src/lib/cupones.ts`). Comprobado con la base parada: la página pública sigue
 * en 200 y los leads siguen entrando. Que el portal esté caído no puede costar
 * ni una sola visita ni un solo lead.
 */

/** Códigos de `postgres` y del sistema que significan "no llego a la base". */
const CODIGOS_DE_RED = new Set([
  "ECONNREFUSED", // nadie escuchando: base parada o puerto equivocado
  "ENOTFOUND", // el host no resuelve: cadena mal o DNS caído
  "ETIMEDOUT",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EPIPE",
  "CONNECT_TIMEOUT", // de `postgres`: aceptó la conexión y no respondió
  "CONNECTION_CLOSED",
  "CONNECTION_ENDED",
  "CONNECTION_DESTROYED",
  "57P01", // admin_shutdown: la base se está reiniciando
  "57P02", // crash_shutdown
  "57P03", // cannot_connect_now: arrancando (Neon despertando, por ejemplo)
  "53300", // too_many_connections: sin sitio en el pool
  "08006", // connection_failure
  "08001", // sqlclient_unable_to_establish_sqlconnection
  "3D000", // invalid_catalog_name: la base no existe
  "28P01", // invalid_password: credenciales mal en el entorno
]);

/**
 * ¿Este error es "la base no está", y no un fallo nuestro?
 *
 * Mira el código antes que el texto. El texto se compara solo para el caso de
 * `repo()` sin `DATABASE_URL`, que es un `Error` normal y no trae código, y es
 * justo el que se dará el primer día en producción si la variable no está
 * puesta: conviene que ese también salga como página y no como 500.
 */
export function esFalloDeBase(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const e = error as { code?: unknown; message?: unknown; cause?: unknown };

  if (typeof e.code === "string" && CODIGOS_DE_RED.has(e.code)) return true;

  if (typeof e.message === "string") {
    const m = e.message;
    if (m.includes("[data] DATABASE_URL is missing")) return true;
    /* `postgres` envuelve algunos fallos de conexión sin código propio. */
    if (m.includes("ECONNREFUSED") || m.includes("ENOTFOUND")) return true;
    if (m.includes("Connection terminated")) return true;
    if (m.includes("terminating connection")) return true;
  }

  /* Astro y `fetch` envuelven excepciones: el motivo real va dentro. Una sola
     vuelta basta y evita quedarse dando vueltas si algo se apunta a sí mismo. */
  if (e.cause && e.cause !== error) return esFalloDeBase(e.cause);

  return false;
}

const TEXTOS = {
  es: {
    titulo: "Volvemos enseguida",
    entrada: "El portal no está disponible en este momento.",
    detalle:
      "Es un problema temporal nuestro, no de tu cuenta. No has perdido nada: tus datos y tu acceso siguen donde estaban.",
    reintentar: "Reintentar",
    volver: "Ir a la página principal",
    ayuda: "Si tienes prisa, escríbenos a",
    /* La marca también vive aquí. Esta página se pinta a mano, sin componentes
       ni config, porque tiene que funcionar justo cuando la base de datos NO
       responde: importar `sitio` aquí sería depender de lo que está caído. */
    marca: "Emprende180",
  },
  en: {
    titulo: "Back in a moment",
    entrada: "The portal is unavailable right now.",
    detalle:
      "This is a temporary problem on our side, not with your account. Nothing is lost: your data and your access are still there.",
    reintentar: "Try again",
    volver: "Go to the main page",
    ayuda: "If it is urgent, write to",
    marca: "Entrepreneur180",
  },
} as const;

const CORREO = "hola@emprende180.com";

/**
 * La página, escrita a mano y sin depender de nada.
 *
 * ⚠️ NI LAYOUT, NI COMPONENTES, NI FUENTE EXTERNA, NI CSS DEL PROYECTO. Esto se
 * pinta desde el middleware, cuando algo ya ha fallado; cada dependencia que se
 * añada aquí es una manera más de que la página de error también falle. Colores
 * de marca copiados a mano en hexadecimal por la misma razón, y tipografía del
 * sistema: pedir una fuente a un servidor externo mientras las cosas van mal es
 * añadir una espera a alguien que ya está esperando.
 */
function pagina(lang: "es" | "en"): string {
  const t = TEXTOS[lang];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${t.titulo} · ${t.marca}</title>
<link rel="icon" href="/favicon.ico" sizes="any">
<style>
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body {
    margin: 0; min-height: 100svh;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1.25rem;
    background: #0D2B4D; color: #fff;
    font-family: "Montserrat", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.6;
  }
  main { max-width: 34rem; text-align: center }
  .marca {
    display: inline-flex; align-items: center; gap: .625rem;
    font-size: .8125rem; letter-spacing: .12em; text-transform: uppercase;
    color: #80CFC6; margin-bottom: 2rem;
  }
  .punto { width: .5rem; height: .5rem; border-radius: 50%; background: #80CFC6 }
  h1 { font-size: clamp(1.75rem, 5vw, 2.5rem); line-height: 1.15; margin: 0 0 1rem; font-weight: 700 }
  .entrada { font-size: 1.0625rem; margin: 0 0 .75rem; color: #E8EDF3 }
  .detalle { font-size: .9375rem; margin: 0 0 2rem; color: #A9BACD }
  .botones { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center }
  a, button {
    font: inherit; font-weight: 600; cursor: pointer;
    padding: .75rem 1.5rem; border-radius: .625rem; text-decoration: none;
    border: 1px solid transparent; transition: background-color .2s, border-color .2s;
  }
  .primario { background: #04827A; color: #fff }
  .primario:hover { background: #036B65 }
  .secundario { border-color: rgba(255,255,255,.28); color: #E8EDF3 }
  .secundario:hover { border-color: rgba(255,255,255,.55) }
  .ayuda { margin: 2rem 0 0; font-size: .875rem; color: #A9BACD }
  .ayuda a { padding: 0; color: #80CFC6; font-weight: 500; text-decoration: underline }
  :focus-visible { outline: 2px solid #80CFC6; outline-offset: 2px }
</style>
</head>
<body>
<main>
  <p class="marca"><span class="punto"></span>${t.marca}</p>
  <h1>${t.titulo}</h1>
  <p class="entrada">${t.entrada}</p>
  <p class="detalle">${t.detalle}</p>
  <div class="botones">
    <button class="primario" onclick="location.reload()">${t.reintentar}</button>
    <a class="secundario" href="/">${t.volver}</a>
  </div>
  <p class="ayuda">${t.ayuda} <a href="mailto:${CORREO}">${CORREO}</a></p>
</main>
</body>
</html>`;
}

/**
 * La respuesta que sustituye al 500.
 *
 * Las rutas de API contestan JSON: quien llama es el island de React, y un
 * pegote de HTML dentro de un `await response.json()` es un error distinto y
 * más confuso que el original.
 */
export function respuestaSinBase(
  pathname: string,
  acceptLanguage: string | null,
  esApi: boolean,
): Response {
  const lang: "es" | "en" = (acceptLanguage ?? "").toLowerCase().startsWith("en")
    ? "en"
    : "es";

  /* `Retry-After` en segundos: una base que se recupera sola (un reinicio, un
     Neon despertando) suele tardar menos que esto. */
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "Retry-After": "30",
  };

  if (esApi) {
    return new Response(
      JSON.stringify({ ok: false, error: "unavailable", retryAfter: 30 }),
      {
        status: 503,
        headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }

  return new Response(pagina(lang), {
    status: 503,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}
