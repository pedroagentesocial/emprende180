import type { APIRoute } from "astro";
import { z } from "zod";
import { enviarCodigo, entrarConCodigo, internalPath } from "@lib/auth";
import { consume, clientIp } from "@lib/rateLimit";

export const prerender = false;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POST /api/codigo — pedir el código de acceso y canjearlo
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Dos acciones:
 *   · `pedir`     → manda un código de seis dígitos al correo.
 *   · `verificar` → lo canjea y deja la sesión puesta.
 *
 * ⚠️ `pedir` RESPONDE LO MISMO EXISTA LA CUENTA O NO, y eso es media ruta. Si
 * contestara "ese correo no está registrado", esto sería un comprobador de
 * clientes: cualquiera podría probar direcciones para averiguar quién compró el
 * curso. Misma regla que `api/magic-link.ts`.
 *
 * ⚠️ `verificar` TAMPOCO DISTINGUE POR QUÉ FALLA. Código equivocado, caducado,
 * intentos agotados o cuenta inexistente dan la misma respuesta. Diferenciarlos
 * diría "ese correo sí existe, el código es lo que fallaste", que es justo la
 * mitad del secreto.
 *
 * ⚠️ LOS DOS LÍMITES SON DISTINTOS A PROPÓSITO. Pedir es caro —manda un
 * correo— y se limita fuerte. Verificar se limita MÁS fuerte todavía, porque es
 * la puerta por la que se adivinaría un código a base de intentos. El tope real
 * por código son cinco, contados en la base (ver `entrarConCodigo`); esto de
 * aquí es el cinturón de encima, para quien pruebe con muchos correos.
 */

const pedir = z.object({
  accion: z.literal("pedir"),
  email: z.string().trim().toLowerCase().email().max(254),
  idioma: z.enum(["es", "en"]).default("es"),
});

const verificar = z.object({
  accion: z.literal("verificar"),
  email: z.string().trim().toLowerCase().email().max(254),
  /* Seis dígitos exactos. El formulario ya los filtra, pero esta ruta la puede
     llamar cualquiera sin pasar por él. */
  codigo: z.string().trim().regex(/^\d{6}$/),
  next: z.string().max(200).optional(),
});

const schema = z.discriminatedUnion("accion", [pedir, verificar]);

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  const ip = clientIp(request, clientAddress);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "peticion" }, 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "datos" }, 400);
  const d = parsed.data;

  if (d.accion === "pedir") {
    if (!consume(`codigo-pedir:${ip}`, 10, 10 * 60 * 1000).allowed) {
      return json({ ok: false, error: "limite" }, 429);
    }
    const { devCodigo } = await enviarCodigo(d.email, d.idioma);
    /* `devCodigo` solo llega en desarrollo: en producción vale `null` y este
       campo no viaja. Es lo que permite probar sin abrir el correo. */
    return json({ ok: true, ...(devCodigo ? { devCodigo } : {}) }, 200);
  }

  if (!consume(`codigo-verificar:${ip}`, 20, 10 * 60 * 1000).allowed) {
    return json({ ok: false, error: "limite" }, 429);
  }

  const { student } = await entrarConCodigo(
    d.email,
    d.codigo,
    cookies,
    request.headers.get("user-agent"),
  );

  /* El motivo se descarta aquí a propósito: ver la nota de arriba. */
  if (!student) return json({ ok: false, error: "codigo" }, 401);

  return json({ ok: true, destino: internalPath(d.next ?? null) }, 200);
};
