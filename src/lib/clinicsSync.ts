import { ambassadorRepo } from "@lib/ambassadors";
import { ingestFact } from "@lib/facts";
import { notifyNewSale } from "@lib/ambassadorEmail";
import { clinicsConfigured, fetchClinicsEvents, ClinicsError } from "@lib/clinicsApi";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LEER LOS HECHOS DE CLINICS (Revivi, Venture, las clínicas)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Los negocios de GHL nos empujan sus hechos (webhook); los de clinics los
 * leemos nosotros, en orden y con un cursor que solo avanza. Cada hecho pasa
 * por el MISMO `ingestFact` que los de GHL: un solo contrato, una sola regla
 * de "el primero gana", una sola manera de no contar dos veces.
 *
 * Cada hecho trae `business`: el slug de la clínica donde pasó. Aquí tiene
 * que existir un negocio con ESE identificador y fuente "Clinics" (lo crea el
 * admin en Negocios). Así una venta de Revivi y una cita en una clínica PI
 * caen cada una en su negocio, con sus reglas.
 *
 * ⚠️ SI UN NEGOCIO FALTA, LA LECTURA SE DETIENE AHÍ y no avanza el cursor
 * más allá: saltar ese hecho sería perder su comisión para siempre. El aviso
 * sale en Negocios ("falta el negocio <slug>") y al crearlo, la siguiente
 * lectura sigue donde se quedó.
 *
 * ⚠️ UN HECHO QUE NO SE PUEDE APLICAR SÍ SE SALTA (con su motivo en el
 * registro): un Embajador desactivado, un reembolso de algo que no llegó.
 * Detener todo por uno así dejaría a todos los demás sin cobrar.
 *
 * Cuándo corre: al abrir el portal o el admin (como mucho una vez por minuto
 * en cada instancia), con el botón "Sincronizar ahora" en Negocios, y desde
 * `/api/cron/clinics` si se programa un cron. Nunca lanza: un clinics caído
 * deja el portal con lo último que tenía.
 */

const SOURCE = "clinics";
const PAGES_PER_RUN = 10;
const THROTTLE_MS = 60_000;

let lastRun = 0;
let running: Promise<SyncResult> | null = null;

export interface SyncResult {
  ran: boolean;
  stored: number;
  skipped: number;
  error: string | null;
}

/** La lectura, como mucho una vez por minuto. Para el portal y el admin. */
export function maybeSyncFromClinics(): Promise<SyncResult> {
  if (!clinicsConfigured()) return Promise.resolve({ ran: false, stored: 0, skipped: 0, error: null });
  if (running) return running;
  if (Date.now() - lastRun < THROTTLE_MS) {
    return Promise.resolve({ ran: false, stored: 0, skipped: 0, error: null });
  }
  return syncFromClinics();
}

/** La lectura, ya. Para el botón y el cron. */
export function syncFromClinics(): Promise<SyncResult> {
  if (!clinicsConfigured()) {
    return Promise.resolve({ ran: false, stored: 0, skipped: 0, error: "not_configured" });
  }
  running ??= run().finally(() => {
    lastRun = Date.now();
    running = null;
  });
  return running;
}

async function run(): Promise<SyncResult> {
  const ar = ambassadorRepo();
  let stored = 0;
  let skipped = 0;

  try {
    const businesses = (await ar.listBusinesses()).filter((b) => b.source === "clinics" && b.active);
    const bySlug = new Map(businesses.map((b) => [b.slug, b]));
    let { cursor } = await ar.syncState(SOURCE);

    for (let page = 0; page < PAGES_PER_RUN; page++) {
      const { events, next } = await fetchClinicsEvents(cursor);
      if (!events.length) break;

      for (const e of events) {
        const business = e.business ? bySlug.get(e.business) : undefined;
        if (!business) {
          const error = `Falta el negocio "${e.business ?? "(sin clínica)"}" con fuente Clinics: la lectura se detuvo ahí.`;
          await ar.saveSync(SOURCE, { cursor, error });
          return { ran: true, stored, skipped, error };
        }

        const result = await ingestFact(
          business,
          {
            event_id: e.event_id,
            type: e.type,
            referral_ref: e.referral_ref,
            ambassador_code: e.ambassador_code,
            occurred_at: e.occurred_at,
            amount_cents: e.amount_cents ?? undefined,
            payment_number: e.payment_number ?? undefined,
            original_event_id: e.original_event_id ?? undefined,
            channel: e.channel ?? undefined,
          },
          (ambassador, fact) => notifyNewSale(ambassador, fact, business.name),
        );
        if (result.ok) {
          if (result.status === "stored") stored++;
        } else {
          skipped++;
          console.warn(`[clinicsSync] Hecho ${e.event_id} sin aplicar: ${result.code} (${result.message})`);
        }
        cursor = e.cursor;
      }

      await ar.saveSync(SOURCE, { cursor });
      if (next === cursor && events.length < 200) break;
    }

    await ar.saveSync(SOURCE, { cursor, ok: true, error: null });
    return { ran: true, stored, skipped, error: null };
  } catch (error) {
    const message =
      error instanceof ClinicsError
        ? `clinics respondió ${error.status}${error.code ? ` (${error.code})` : ""}: ${error.message}`
        : `No se pudo leer de clinics: ${(error as Error).message}`;
    console.error("[clinicsSync]", message);
    try {
      await ar.saveSync(SOURCE, { error: message });
    } catch {
      /* Sin base tampoco se puede anotar: queda en el registro. */
    }
    return { ran: true, stored, skipped, error: message };
  }
}

/** Para enseñar en Negocios. */
export const clinicsSyncState = () => ambassadorRepo().syncState(SOURCE);
