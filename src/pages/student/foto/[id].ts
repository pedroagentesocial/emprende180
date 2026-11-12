import type { APIRoute } from "astro";
import { repo } from "@lib/data";
import { canOpenStaffPanel } from "@lib/permissions";

/**
 * GET /student/foto/<id>: la foto de perfil de un alumno (12-11-2026).
 *
 * Bajo `/student`, así que el middleware ya exige sesión. Además, solo la ve:
 *
 *   · el propio alumno,
 *   · el equipo de Emprende180 (admin),
 *   · quien lo trajo (su foto sale en el Equipo de su patrocinador).
 *
 * A cualquier otro, 404: un 403 confirmaría que esa persona tiene foto.
 *
 * La dirección lleva `?v=<cuándo cambió>`, así que se puede guardar en caché
 * mucho tiempo: una foto nueva es otra dirección. `private` porque es de una
 * persona: ningún proxy compartido la guarda.
 */
export const prerender = false;

const DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/;

export const GET: APIRoute = async ({ params, locals }) => {
  const me = locals.student;
  const id = params.id ?? "";
  if (!me || !id) return new Response(null, { status: 404 });

  const r = repo();
  const target = id === me.id ? me : await r.studentById(id);
  const allowed = target && (target.id === me.id || canOpenStaffPanel(me) || target.sponsorId === me.id);
  if (!allowed) return new Response(null, { status: 404 });

  const data = await r.photoOf(target.id);
  const m = data?.match(DATA_URL);
  if (!m) return new Response(null, { status: 404 });

  return new Response(Buffer.from(m[2]!, "base64"), {
    headers: {
      "Content-Type": m[1]!,
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
