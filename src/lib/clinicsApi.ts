import { createHash, createHmac, randomBytes } from "node:crypto";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CLINICS: lo que Emprende180 le pide al sistema de las clínicas
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Revivi, Venture y las clínicas viven en clinics. Para sus Embajadores,
 * Emprende180 le pide a clinics tres cosas, en `/partners/v1/emprende180`:
 *
 *   · los HECHOS de los clientes referidos, en orden y con cursor;
 *   · DAR DE ALTA a un Embajador allí (su afiliado de toda la organización);
 *   · ABONAR un pago en crédito de Revivi.
 *
 * ⚠️ CADA PETICIÓN VA FIRMADA y el secreto no viaja nunca. HMAC-SHA256 con
 * `CLINICS_PARTNER_SECRET` (el mismo valor que `EMPRENDE180_SECRET` en
 * clinics) sobre cinco líneas: hora, método, ruta con su consulta tal cual se
 * manda, un nonce de un solo uso y el sha256 del cuerpo. Es el mismo contrato
 * que usa la web de Revivi con `/booking/v1`. Si cambia allí, cambia aquí.
 *
 * ⚠️ SOLO DESDE EL SERVIDOR. Este archivo usa el secreto: nunca puede acabar
 * en una isla de React ni en un script del navegador.
 *
 * Sin `CLINICS_API_URL` o sin el secreto, `clinicsConfigured()` es `false` y
 * el portal sigue funcionando con los negocios de GHL.
 */

const TIMEOUT_MS = 8000;

const baseUrl = () => (import.meta.env.CLINICS_API_URL as string | undefined)?.replace(/\/+$/, "") || null;
const secret = () => (import.meta.env.CLINICS_PARTNER_SECRET as string | undefined)?.trim() || null;

export const clinicsConfigured = (): boolean => !!baseUrl() && !!secret();

export class ClinicsError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | null,
    message: string,
  ) {
    super(message);
  }
}

async function signedFetch<T>(method: "GET" | "POST", pathAndQuery: string, body?: unknown): Promise<T> {
  const url = baseUrl();
  const key = secret();
  if (!url || !key) throw new ClinicsError(0, "not_configured", "clinics link is not configured");

  const raw = body === undefined ? "" : JSON.stringify(body);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = randomBytes(18).toString("base64url");
  const canonical = [
    timestamp,
    method,
    pathAndQuery,
    nonce,
    createHash("sha256").update(raw).digest("hex"),
  ].join("\n");
  const signature = createHmac("sha256", key).update(canonical).digest("hex");

  const response = await fetch(url + pathAndQuery, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-e180-timestamp": timestamp,
      "x-e180-nonce": nonce,
      "x-e180-signature": signature,
    },
    body: raw || undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const text = await response.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* Un error de un proxy viene en HTML: se informa por el estado. */
  }
  if (!response.ok) {
    const j = (json ?? {}) as { code?: string; message?: string | { code?: string; message?: string } };
    const nested = typeof j.message === "object" ? j.message : null;
    throw new ClinicsError(
      response.status,
      j.code ?? nested?.code ?? null,
      (nested?.message ?? (typeof j.message === "string" ? j.message : null)) ?? `clinics answered ${response.status}`,
    );
  }
  return json as T;
}

const PREFIX = "/partners/v1/emprende180";

export interface ClinicsEvent {
  cursor: string;
  event_id: string;
  type: string;
  /** El slug de la clínica donde pasó: es el identificador del negocio aquí. */
  business: string | null;
  referral_ref: string;
  ambassador_code: string;
  occurred_at: string;
  amount_cents: number | null;
  payment_number: number | null;
  original_event_id: string | null;
  channel: string | null;
}

export const fetchClinicsEvents = (after: string, limit = 200) =>
  signedFetch<{ events: ClinicsEvent[]; next: string }>(
    "GET",
    `${PREFIX}/events?after=${encodeURIComponent(after)}&limit=${limit}`,
  );

export const linkAmbassadorInClinics = (data: {
  externalRef: string;
  code: string;
  name: string;
  email?: string;
}) =>
  signedFetch<{ affiliateId: string; displayId: string; code: string; created: boolean }>(
    "POST",
    `${PREFIX}/ambassadors`,
    data,
  );

export const grantReviviCredit = (data: { externalRef: string; key: string; amountCents: number }) =>
  signedFetch<{ payoutId: string; displayId: string; created: boolean }>("POST", `${PREFIX}/credits`, data);
