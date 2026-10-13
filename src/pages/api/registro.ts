import type { APIRoute } from "astro";
import { z } from "zod";
import { repo } from "@lib/data";
import { comprobarCupon } from "@lib/cupones";
import { abrirSesionDeProveedor, roleFor, sendMagicLink } from "@lib/auth";
import { consume, clientIp } from "@lib/rateLimit";
import { LOGIN_EMAIL } from "@lib/loginEmail";

export const prerender = false;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POST /api/registro — el alta desde /subscribe
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Es la PRIMERA puerta por la que alguien se da de alta solo. Hasta el
 * 13-10-2026 todas las cuentas las creaba un agente o Pedro desde el panel, y
 * eso cambia dos cosas que conviene tener delante:
 *
 *  1. El correo NO está verificado. Quien crea una cuenta desde el panel es
 *     alguien de casa escribiendo el correo de un cliente con el que ya habló;
 *     aquí lo escribe un desconocido y puede ser el de otra persona. Por eso
 *     SIEMPRE se manda el enlace mágico: si alguien usa un correo ajeno, el
 *     dueño recibe un aviso de que existe esa cuenta. Es la única detección
 *     que hay, y es mejor que ninguna.
 *
 *  2. Se abre sesión en el momento. Lo pidió el cliente ("crea la cuenta y
 *     entra"). No hay nada que proteger detrás todavía —los vídeos no son
 *     secretos y no hay cobro—, así que el coste de entrar sin verificar es
 *     bajo y el de mandar a alguien a su bandeja antes de ver nada es alto.
 *     ⚠️ EL DÍA QUE HAYA PAGO, ESTO SE REVISA: una cuenta con acceso pagado
 *     creada con el correo de otro ya no es un detalle.
 *
 * ⚠️ UN CORREO QUE YA EXISTE NO SE DICE. Responde igual que un alta nueva y
 * manda el enlace mágico de siempre. Si contestara "ya estás registrado", esto
 * sería un comprobador de clientes: cualquiera podría probar direcciones para
 * averiguar quién compró el curso. Es la misma regla que `api/magic-link.ts`.
 *
 * ⚠️ EL CÓDIGO DE EMBAJADOR HACE DOS COSAS DISTINTAS Y SE GUARDAN LAS DOS:
 * `cupon` conserva lo que la persona escribió, valga o no; `alta_por` apunta
 * al Embajador sólo si el código existe y está vigente. La primera es el
 * registro de con qué promesa entró, la segunda es a quién hay que pagarle.
 * Ver la nota de `cupones` en `db/schema.sql`.
 */

/** Los canales que ofrece el formulario. Si se abre otro, se añade aquí. */
const ORIGENES = [
  "revista",
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "referido",
  "otro",
] as const;

const schema = z.object({
  nombre: z.string().trim().min(1).max(80),
  apellido: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  telefono: z.string().trim().min(7).max(40),
  whatsapp: z.boolean().default(false),
  ciudad: z.string().trim().max(80).optional().default(""),
  estado: z.string().trim().max(80).optional().default(""),
  origen: z.enum(ORIGENES),
  /* El código sólo tiene sentido con `origen: "referido"`, pero se acepta
     siempre: el QR puede traerlo en la URL y la persona elegir otro canal. */
  codigo: z.string().trim().max(40).optional().default(""),
  consentimiento: z.literal(true),
  idioma: z.enum(["es", "en"]).default("es"),
  /* Trampa para robots: un campo que nadie ve y que sólo ellos rellenan. */
  empresa: z.string().max(200).optional().default(""),
});

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request, clientAddress, cookies, url }) => {
  const ip = clientIp(request, clientAddress);
  if (!consume(`registro:${ip}`, 10, 10 * 60 * 1000).allowed) {
    return json({ ok: false, error: "limit" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "request" }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    /* Se devuelve QUÉ campo falla para poder señalarlo en pantalla. No se
       devuelve el mensaje de zod: está en inglés y es para programadores. */
    const campo = parsed.error.issues[0]?.path[0];
    return json({ ok: false, error: "campo", campo: String(campo ?? "") }, 400);
  }

  const d = parsed.data;
  /* El robot que rellenó el campo invisible se va con un 200: si le dijéramos
     que ha fallado, el siguiente intento vendría sin rellenarlo. */
  if (d.empresa.trim()) return json({ ok: true, entra: false }, 200);

  const r = repo();

  /* El código, antes de crear nada: si resuelve, el alta nace ya atribuida. */
  const cupon = await comprobarCupon(d.codigo);
  const codigoEscrito = cupon?.escrito || null;
  const embajador = cupon?.valido?.agentId ?? null;

  try {
    const existe = await r.studentByEmail(d.email);
    /* Si ya existe no se toca: ni se pisan sus datos ni se le cambia el
       Embajador. Sólo se le manda el enlace, abajo. */
    if (!existe) {
      await r.createStudent({
        email: d.email,
        name: d.nombre,
        /* El rol lo decide la configuración, NUNCA el formulario: así nadie se
           da de alta como administrador escribiendo un JSON a mano. */
        role: roleFor(d.email),
        language: d.idioma,
        registeredBy: embajador,
        lastName: d.apellido,
        phone: d.telefono,
        whatsapp: d.whatsapp,
        city: d.ciudad || null,
        state: d.estado || null,
        source: d.origen,
        coupon: codigoEscrito,
      });
    }
  } catch (error) {
    console.error("[registro] No se pudo crear la cuenta:", error instanceof Error ? error.name : "error");
    return json({ ok: false, error: "servidor" }, 500);
  }

  /* El enlace mágico va SIEMPRE, sea cuenta nueva o repetida. Es la forma de
     volver a entrar más adelante, y el aviso al dueño del correo si alguien lo
     usó sin ser suyo. Si falla el envío, el alta ya está hecha: no se tira por
     eso, se deja entrar igual. */
  await sendMagicLink(d.email, d.idioma, new URL(url.origin), LOGIN_EMAIL).catch((error) => {
    console.warn("[registro] No se pudo enviar el enlace:", error instanceof Error ? error.name : "error");
  });

  /* Y se entra. `abrirSesionDeProveedor` devuelve null si la cuenta está
     inactiva —una baja que vuelve a registrarse— y entonces se le manda a su
     correo en vez de dejarle pasar con una cuenta dada de baja. */
  const dentro = await abrirSesionDeProveedor(
    d.email,
    cookies,
    request.headers.get("user-agent"),
  ).catch(() => null);

  /* ⚠️ NO SE DEVUELVE SI LA CUENTA YA EXISTÍA. La respuesta es idéntica para
     un alta nueva y para un correo repetido. Devolverlo convertiría esta ruta
     en un comprobador de clientes: cualquiera podría probar direcciones para
     averiguar quién compró el curso. Misma regla que `api/magic-link.ts`. */
  return json({ ok: true, entra: Boolean(dentro) }, 200);
};
