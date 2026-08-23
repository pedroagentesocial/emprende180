import { repo } from "@lib/data";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIMPIEZA DE LO QUE YA NO SIRVE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Sesiones caducadas, enlaces de acceso viejos y, sobre todo, las filas de
 * `peticiones_acceso`: el correo de cualquiera que escriba una dirección en "he
 * olvidado mi contraseña" queda anotado para poder limitar a cinco por hora, y
 * pasada esa hora es una dirección guardada sin ningún motivo. Ver el comentario
 * de `purgeExpired` en `@lib/data`.
 *
 * ─── POR QUÉ NO ES UN CRON ─────────────────────────────────────────────────
 *
 * Vercel tiene tareas programadas y habrían servido, pero atan el proyecto a
 * Vercel: son una entrada en su configuración, una ruta que solo existe para
 * eso, y un secreto que proteja esa ruta para que no la pueda llamar cualquiera.
 * Esto son doce líneas que funcionan en cualquier sitio donde corra Node, y este
 * proyecto ya está escrito para poder mudarse (solo `DATABASE_URL`, sin SDK de
 * nadie).
 *
 * La contrapartida, dicha en voz alta: si NADIE entra al portal en un mes, no se
 * limpia nada en ese mes. Da igual, y por una razón bonita: si nadie entra,
 * nadie está creando sesiones ni pidiendo enlaces, así que no hay nada nuevo que
 * limpiar. La basura solo crece cuando hay uso, y el uso es justo lo que dispara
 * esto.
 *
 * ⚠️ NO SE ESPERA, NO SE MIRA Y NO PUEDE ROMPER NADA. Se llama sin `await` desde
 * sitios que ya estaban tocando la base. Si la limpieza falla, quien estaba
 * entrando entra igual y el fallo queda en el registro.
 */

/** Una vez por hora y por instancia. */
const CADA = 60 * 60 * 1000;

/**
 * ⚠️ EN MEMORIA, Y A SABIENDAS. En serverless cada instancia tiene su propio
 * reloj y las instancias van y vienen, así que esto no garantiza "una vez por
 * hora en todo el sistema": garantiza que una misma instancia no lo repita en
 * bucle. Guardar la marca en la base costaría una consulta más en cada visita
 * para ahorrar tres DELETE sobre tablas diminutas, que es peor negocio.
 */
let ultima = 0;

/** Limpia si toca. Vuelve enseguida y nunca lanza. */
export function limpiarSiToca(): void {
  const ahora = Date.now();
  if (ahora - ultima < CADA) return;
  ultima = ahora;

  repo()
    .purgeExpired()
    .then(({ sesiones, tokens, peticiones }) => {
      if (sesiones || tokens || peticiones) {
        console.log(
          `[mantenimiento] Borradas ${sesiones} sesiones, ${tokens} enlaces y ${peticiones} peticiones caducadas`,
        );
      }
    })
    .catch((error) => {
      /* Sin base de datos, o con la base caída. Se intentará dentro de una hora:
         no hay nada que reintentar ahora, y desde luego no a costa de la
         petición de alguien que solo quería entrar. */
      console.warn("[mantenimiento] No se pudo limpiar:", error);
    });
}
