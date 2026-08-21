import type { Alumno, Rol } from "@lib/datos";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUIÉN PUEDE HACER QUÉ
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Un solo sitio donde se decide qué permite cada rol. Antes esto era
 * `alumno.rol !== "admin"` escrito en el middleware y en el panel; funcionaba,
 * pero es la forma de comprobar permisos que peor envejece: el día que aparece
 * un tercer rol hay que ir a buscar todas las comparaciones sueltas por el
 * repositorio, y la que se escape es un agujero.
 *
 * ─── EL ROL DE AGENTE, QUE TODAVÍA NO EXISTE ───────────────────────────────
 *
 * El plan es que los agentes den de alta ellos mismos a quien les compra, sin
 * pasar por Pedro. Hoy NO está activado —hoy solo da de alta Pedro— pero este
 * archivo es la costura por la que entrará, y conviene que quede escrito para no
 * tener que reconstruir el razonamiento:
 *
 *   1. Añadir `"agente"` al tipo `Rol` en `datos.ts` y a la restricción CHECK de
 *      la columna `rol` en `db/schema.sql`.
 *   2. `puedeDarDeAlta` pasa a devolver `true` también para "agente".
 *   3. `puedeAdministrar` NO cambia: un agente no ve la lista de todos los
 *      alumnos ni puede dar de baja a nadie. Esa es la diferencia entera entre
 *      los dos roles, y es la que hace que darle acceso a un agente no sea
 *      darle las llaves de todo.
 *   4. El panel `/admin` ya tiene dos bloques —el formulario de alta y la
 *      lista—; el segundo se envuelve en `puedeAdministrar`.
 *   5. `rolDe()` en `acceso.ts` decide el rol al darse de alta. Hará falta una
 *      lista `AGENTE_EMAILS` equivalente a `ADMIN_EMAILS`, o marcarlos desde el
 *      panel.
 *
 * ⚠️ MIENTRAS TANTO, LAS DOS FUNCIONES DEVUELVEN LO MISMO. Eso es correcto y no
 * es duplicación por despiste: son dos preguntas distintas que hoy tienen la
 * misma respuesta. Fusionarlas ahorraría tres líneas y obligaría a volver a
 * separarlas justo cuando haya que tener cuidado.
 */

/** Roles que existen hoy. Ver la nota de arriba para el que viene. */
export const ROLES_ADMIN: readonly Rol[] = ["admin"];

/**
 * ¿Puede administrar el área? Ver la lista de alumnos, dar de baja, reactivar.
 *
 * Es el permiso FUERTE: quien lo tiene ve los datos de todo el mundo.
 */
export function puedeAdministrar(alumno: Alumno | null | undefined): boolean {
  return !!alumno && ROLES_ADMIN.includes(alumno.rol);
}

/**
 * ¿Puede dar de alta a un alumno nuevo?
 *
 * Es el permiso DÉBIL: crea una cuenta y le manda su enlace, y no deja ver ni
 * tocar las que ya existen. Es el que heredará el rol de agente.
 */
export function puedeDarDeAlta(alumno: Alumno | null | undefined): boolean {
  return !!alumno && ROLES_ADMIN.includes(alumno.rol);
}

/**
 * ¿Puede siquiera abrir `/admin`?
 *
 * Cualquiera de los dos permisos basta: el panel enseña lo que corresponda a
 * cada uno. Lo usa el middleware, que es quien decide si la ruta existe.
 */
export function puedeEntrarAlPanel(alumno: Alumno | null | undefined): boolean {
  return puedeAdministrar(alumno) || puedeDarDeAlta(alumno);
}
