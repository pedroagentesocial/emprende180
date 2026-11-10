import { z } from "zod";
import { FACT_TYPES, type FactType } from "@lib/commissions";
import {
  ambassadorRepo,
  type Business,
  type ReferralChannel,
  type StoredFact,
} from "@lib/ambassadors";
import { repo, type Student } from "@lib/data";
import { seal } from "@lib/sealed";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL CONTRATO DE HECHOS: lo que un negocio nos cuenta
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Todos los negocios hablan igual, vengan de un webhook de GoHighLevel o de
 * clinics: un hecho por mensaje, con esta forma (ver `docs/embajadores.md`).
 *
 *   event_id           id único del hecho en su negocio (repetir no duplica)
 *   type               lead | attended | purchase | renewal | refund | cancel
 *   referral_ref       id opaco del cliente en su negocio
 *   ambassador_code    el código del Embajador (hace falta la primera vez)
 *   occurred_at        cuándo pasó (por defecto, ahora)
 *   amount_cents       importe en centavos (o `amount` en dólares: "299.00")
 *   payment_number     1 = primera compra, 2 = primera renovación...
 *   original_event_id  en refund / cancel: el hecho que deshacen
 *   channel            link | coupon | form | desk | other
 *   client_name        el nombre, SOLO si hay consentimiento
 *   consent_at         cuándo autorizó el cliente que su Embajador lo vea
 *
 * ⚠️ GHL MANDA LOS CAMPOS VACÍOS COMO "". Un workflow con un campo de
 * contacto sin rellenar pone una cadena vacía, no lo omite. Por eso todo
 * opcional acepta "" y lo trata como "no viene".
 */

/** "" y null son "no viene", para todos los campos opcionales. */
const blank = (v: unknown) => (v === "" || v === null ? undefined : v);

/** "$1,299.00", "1299", 1299.5 → centavos. */
const dollarsToCents = (v: unknown) => {
  if (v === undefined) return undefined;
  const n = Number(String(v).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
};

const optionalText = (max: number) =>
  z.preprocess(blank, z.string().trim().max(max).optional());

const CHANNELS = ["link", "coupon", "form", "desk", "other"] as const;

export const factSchema = z
  .object({
    event_id: z.string().trim().min(1).max(200),
    type: z.enum(FACT_TYPES as [FactType, ...FactType[]]),
    referral_ref: z.string().trim().min(1).max(200),
    ambassador_code: optionalText(40),
    occurred_at: z.preprocess(blank, z.coerce.date().optional()),
    amount_cents: z.preprocess(blank, z.coerce.number().int().min(0).max(1_000_000_000).optional()),
    amount: z.preprocess(
      (v) => dollarsToCents(blank(v)),
      z.number().int().min(0).max(1_000_000_000).optional(),
    ),
    payment_number: z.preprocess(blank, z.coerce.number().int().min(1).max(1000).optional()),
    original_event_id: optionalText(200),
    channel: z.preprocess(blank, z.enum(CHANNELS).optional()),
    client_name: optionalText(120),
    consent_at: z.preprocess(blank, z.coerce.date().optional()),
  })
  .passthrough();

export type FactInput = z.infer<typeof factSchema>;

export type IngestResult =
  | { ok: true; status: "stored" | "duplicate"; fact: StoredFact }
  | { ok: false; code: IngestError; message: string };

export type IngestError =
  | "invalid"
  | "unknown_ambassador"
  | "unknown_referral"
  | "unknown_original"
  | "missing_amount"
  | "in_future";

const fail = (code: IngestError, message: string): IngestResult => ({ ok: false, code, message });

/** Un hecho con fecha de más de un día en el futuro es un error de reloj o de datos. */
const FUTURE_TOLERANCE_MS = 24 * 60 * 60 * 1000;

/**
 * Guarda un hecho de un negocio. Devuelve qué pasó; NUNCA calcula dinero.
 *
 * `onNewSale` se llama con el Embajador cuando entra una compra, una
 * renovación o una cita NUEVA (no repetida), para el correo de aviso.
 */
export async function ingestFact(
  business: Business,
  raw: unknown,
  onNewSale?: (ambassador: Student, fact: StoredFact) => Promise<void>,
): Promise<IngestResult> {
  const parsed = factSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return fail("invalid", issue ? `${issue.path.join(".")}: ${issue.message}` : "invalid body");
  }
  const input = parsed.data;
  const ar = ambassadorRepo();

  const occurredAt = input.occurred_at ?? new Date();
  if (occurredAt.getTime() > Date.now() + FUTURE_TOLERANCE_MS) {
    return fail("in_future", "occurred_at is in the future");
  }

  const amountCents = input.amount_cents ?? input.amount ?? null;
  const isMoney = input.type === "purchase" || input.type === "renewal";
  if (isMoney && amountCents == null) {
    return fail("missing_amount", "purchase and renewal need amount_cents or amount");
  }

  /* ─── 1. El referido: existe, o lo crea su primer hecho ─────────────────── */
  let referral = await ar.referralByRef(business.id, input.referral_ref);

  if (!referral) {
    /* Un reembolso de alguien que nunca vimos no tiene nada que deshacer. */
    if (input.type === "refund" || input.type === "cancel") {
      return fail("unknown_referral", "refund or cancel for a referral we never received");
    }
    const ambassador = input.ambassador_code
      ? await repo().studentByAmbassadorCode(input.ambassador_code)
      : null;
    if (!ambassador || !ambassador.ambassadorSince || !ambassador.active) {
      return fail("unknown_ambassador", "ambassador_code is missing or is not an active ambassador");
    }
    referral = await ar.findOrCreateReferral({
      businessId: business.id,
      externalRef: input.referral_ref,
      ambassadorId: ambassador.id,
      channel: (input.channel as ReferralChannel | undefined) ?? null,
      firstContactAt: occurredAt,
    });
  }

  /* ─── 2. Lo que deshace un reembolso ────────────────────────────────────── */
  let originalId: string | null = null;
  if (input.type === "refund" || input.type === "cancel") {
    const original = input.original_event_id
      ? await ar.factByExternal(business.id, input.original_event_id)
      : null;
    if (
      !original ||
      original.referralId !== referral.id ||
      !["purchase", "renewal", "attended"].includes(original.type)
    ) {
      return fail("unknown_original", "original_event_id must be a purchase, renewal or visit of this referral");
    }
    originalId = original.id;
  }

  /* ─── 3. El nombre, solo con consentimiento, y cifrado ──────────────────── */
  if (input.client_name && input.consent_at) {
    const sealed = seal(input.client_name);
    if (sealed) await ar.setReferralName(referral.id, sealed, input.consent_at);
  }

  /* ─── 4. El hecho ──────────────────────────────────────────────────────── */
  const { fact, created } = await ar.insertFact({
    businessId: business.id,
    externalId: input.event_id,
    referralId: referral.id,
    type: input.type,
    amountCents: input.type === "lead" || input.type === "attended" ? null : amountCents,
    paymentNumber:
      input.type === "purchase"
        ? (input.payment_number ?? 1)
        : input.type === "renewal"
          ? Math.max(2, input.payment_number ?? 2)
          : null,
    occurredAt,
    originalId,
  });

  if (created && onNewSale && ["purchase", "renewal", "attended"].includes(fact.type)) {
    const ambassador = await repo().studentById(referral.ambassadorId);
    if (ambassador) {
      try {
        await onNewSale(ambassador, fact);
      } catch (error) {
        /* El aviso nunca tumba un hecho que ya está guardado. */
        console.error("[facts] No se pudo avisar al Embajador:", error);
      }
    }
  }

  return { ok: true, status: created ? "stored" : "duplicate", fact };
}
