import { defineMiddleware } from "astro:middleware";
import { alumnoActual } from "@lib/acceso";
import { puedeEntrarAlPanel } from "@lib/permisos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MIDDLEWARE — la puerta del área de alumnos
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Una sola comprobación, en un solo sitio, ANTES de que se renderice nada.
 *
 * ⚠️ POR QUÉ AQUÍ Y NO EN CADA PÁGINA. Porque proteger página por página es una
 * lista que hay que acordarse de actualizar, y el día que alguien añada
 * `/alumno/certificado.astro` sin copiar el bloque de comprobación, esa página
 * queda abierta. Aquí la regla es el PREFIJO de la ruta: cualquier archivo nuevo
 * bajo `/alumno` o `/admin` nace protegido.
 *
 * ⚠️ LO QUE NO HACE. No decide qué ve cada alumno DENTRO del área; eso es cosa
 * de cada página. Solo responde a "¿puede pasar de la puerta?".
 *
 * A quien no ha entrado se le manda a `/acceso` con `?destino=`, para
 * devolverlo a donde iba después de identificarse. Sin eso, cualquiera que
 * llegue por un enlace a un video concreto acaba en el tablero y tiene que
 * buscarlo otra vez.
 */

const ZONA_ALUMNOS = "/alumno";
const ZONA_ADMIN = "/admin";

export const onRequest = defineMiddleware(async (contexto, siguiente) => {
  const { pathname } = contexto.url;

  const esAlumnos = pathname === ZONA_ALUMNOS || pathname.startsWith(`${ZONA_ALUMNOS}/`);
  const esAdmin = pathname === ZONA_ADMIN || pathname.startsWith(`${ZONA_ADMIN}/`);

  if (!esAlumnos && !esAdmin) return siguiente();

  const alumno = await alumnoActual(contexto.cookies);

  if (!alumno) {
    const destino = new URL("/acceso", contexto.url);
    destino.searchParams.set("destino", pathname);
    return contexto.redirect(destino.pathname + destino.search, 302);
  }

  /* Un alumno que llega a `/admin` NO recibe un 403 con explicación: recibe lo
     mismo que si la ruta no existiera. Un 403 confirma que el panel está ahí.

     La comprobación sale de `@lib/permisos` y no de un `rol !== "admin"` escrito
     aquí: cuando exista el rol de agente, esta línea no se toca. Ver la nota de
     ese archivo. */
  if (esAdmin && !puedeEntrarAlPanel(alumno)) {
    return new Response(null, { status: 404 });
  }

  /* El alumno resuelto viaja en `locals` para que las páginas no tengan que
     volver a consultarlo: una petición, una lectura de sesión. */
  contexto.locals.alumno = alumno;
  return siguiente();
});
