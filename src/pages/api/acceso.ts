import type { APIRoute } from "astro";
import { z } from "zod";
import { mandarEnlaceAcceso } from "@lib/acceso";
import { CORREO_ACCESO } from "@lib/correoAcceso";
import { consumir, ipDe } from "@lib/rateLimit";

export const prerender = false;

/**
 * POST /api/acceso — pide el enlace para poner la contraseña.
 *
 * Lo usa la isla de React de `/acceso`. El mismo trabajo, sin JavaScript, lo
 * hace el POST del propio formulario contra `/acceso`; los dos llaman a
 * `mandarEnlaceAcceso`, así que la decisión de a quién se le manda un correo
 * vive en UN solo sitio.
 *
 * ⚠️ RESPONDE LO MISMO EXISTA O NO EL ALUMNO, Y ESO ES LA MITAD DEL DISEÑO.
 *
 * Si contestara "ese correo no está dado de alta", este endpoint sería un
 * comprobador de clientes: cualquiera podría ir probando direcciones para
 * averiguar quién compró el curso.
 *
 * ⚠️ PEDIR EL ENLACE NO DA DE ALTA A NADIE. Ver `mandarEnlaceAcceso`.
 */

const esquema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  idioma: z.enum(["es", "en"]).default("es"),
  destino: z.string().max(200).optional(),
});

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  // Límite por IP, barato y antes de tocar la base.
  const ip = ipDe(request, clientAddress);
  if (!consumir(`acceso:${ip}`, 15, 10 * 60 * 1000).permitido) {
    return json({ ok: false, error: "limite" }, 429);
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return json({ ok: false, error: "peticion" }, 400);
  }

  const parsed = esquema.safeParse(cuerpo);
  if (!parsed.success) return json({ ok: false, error: "email" }, 400);

  const { email, idioma } = parsed.data;
  const { enlaceDev } = await mandarEnlaceAcceso(email, idioma, url, CORREO_ACCESO);

  /* `enlace` solo llega con valor en desarrollo y sin Resend configurado. En
     producción es siempre `null`, así que la respuesta es idéntica exista o no
     el alumno. */
  return json(enlaceDev ? { ok: true, enlace: enlaceDev } : { ok: true }, 200);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
