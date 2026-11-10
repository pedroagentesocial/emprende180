import type { APIRoute } from "astro";
import { createHash, timingSafeEqual } from "node:crypto";
import { ambassadorRepo } from "@lib/ambassadors";
import { ingestFact } from "@lib/facts";
import { notifyNewSale } from "@lib/ambassadorEmail";
import { consume, clientIp } from "@lib/rateLimit";

export const prerender = false;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POST /api/facts/<negocio>: un negocio nos cuenta un hecho
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Lo llama un workflow de GoHighLevel (acción "Custom Webhook") cada vez que
 * pasa algo con un cliente referido: llegó, asistió, compró, renovó, se
 * reembolsó. El cuerpo es el contrato de `@lib/facts`. La guía para montar el
 * workflow está en `docs/embajadores.md`.
 *
 * ⚠️ ES LA ÚNICA RUTA QUE ACEPTA UN POST DE FUERA. El middleware rechaza todo
 * POST que no nace en nuestras páginas (CSRF); esta ruta queda fuera de esa
 * regla porque quien llama es el servidor de GHL, y a cambio exige su secreto.
 *
 * ⚠️ EL SECRETO VA EN LA CABECERA, NUNCA EN LA DIRECCIÓN. Las direcciones se
 * escriben en los registros de acceso; las cabeceras no. `Authorization:
 * Bearer <secreto>` (o `X-E180-Secret`). Aquí solo se guarda su hash.
 *
 * ⚠️ "NO EXISTE" Y "SECRETO MALO" CONTESTAN IGUAL (401), para que esta ruta no
 * sirva para averiguar qué negocios tenemos.
 *
 * ⚠️ UN NEGOCIO QUE VIENE DE CLINICS NO PUEDE EMPUJAR. A esos los leemos
 * nosotros; aceptar también su webhook sería contar dos veces cada venta.
 */

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

/** 16 KB: un hecho son unas pocas líneas. Más es un error o un abuso. */
const MAX_BODY = 16 * 1024;

const hash = (secret: string) => createHash("sha256").update(secret).digest();

function secretOf(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim() || null;
  return request.headers.get("x-e180-secret")?.trim() || null;
}

export const POST: APIRoute = async ({ params, request }) => {
  const ip = clientIp(request);
  /* Generoso: un negocio con mucho movimiento manda muchos hechos seguidos, y
     GHL reintenta. Lo que corta es un script golpeando desde una IP. */
  if (!consume(`facts:ip:${ip}`, 600, 10 * 60 * 1000).allowed) {
    return json(429, { ok: false, code: "rate_limited" });
  }

  const slug = String(params.business ?? "");
  const secret = secretOf(request);
  const ar = ambassadorRepo();
  const business = slug ? await ar.businessBySlug(slug) : null;
  const stored = business ? await ar.secretHashOf(business.id) : null;

  const given = secret ? hash(secret) : null;
  const expected = stored ? Buffer.from(stored, "hex") : null;
  const valid =
    !!business &&
    business.active &&
    !!given &&
    !!expected &&
    expected.length === given.length &&
    timingSafeEqual(expected, given);
  if (!valid || !business) return json(401, { ok: false, code: "unauthorized" });

  if (business.source !== "ghl") {
    return json(409, { ok: false, code: "wrong_source", message: "this business is read from clinics" });
  }

  const text = await request.text();
  if (text.length > MAX_BODY) return json(413, { ok: false, code: "too_large" });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json(400, { ok: false, code: "invalid", message: "body is not JSON" });
  }

  const result = await ingestFact(business, body, (ambassador, fact) =>
    notifyNewSale(ambassador, fact, business.name),
  );

  if (!result.ok) {
    /* 422: el mensaje estaba bien formado pero no se puede aplicar. GHL lo
       muestra en el historial del workflow, que es donde alguien lo va a leer. */
    return json(result.code === "invalid" ? 400 : 422, result);
  }
  return json(200, { ok: true, status: result.status });
};
