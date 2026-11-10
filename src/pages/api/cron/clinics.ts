import type { APIRoute } from "astro";
import { timingSafeEqual } from "node:crypto";
import { syncFromClinics } from "@lib/clinicsSync";

export const prerender = false;

/**
 * GET /api/cron/clinics: lee los hechos nuevos de clinics.
 *
 * Para un cron de Vercel (que manda `Authorization: Bearer <CRON_SECRET>`).
 * Es opcional: sin cron, la lectura corre igual al abrir el portal o el
 * admin, y con el botón "Sincronizar ahora" de Negocios.
 *
 * Sin `CRON_SECRET` configurado, contesta 404: no hay cron que atender.
 */
export const GET: APIRoute = async ({ request }) => {
  const expected = (import.meta.env.CRON_SECRET as string | undefined)?.trim();
  if (!expected) return new Response(null, { status: 404 });

  const given = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new Response(null, { status: 401 });
  }

  const result = await syncFromClinics();
  return new Response(JSON.stringify(result), {
    status: result.error ? 502 : 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
