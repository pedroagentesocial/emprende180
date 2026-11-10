import { sharedSql, repo as studentsRepo } from "@lib/data";
import type { Fact, FactType, Rule, RuleKind } from "@lib/commissions";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATOS DEL PORTAL DE EMBAJADORES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Negocios, reglas, referidos, hechos y pagos. El mismo patrón que
 * `@lib/data`: un contrato y dos implementaciones, Postgres (la de verdad) y
 * memoria (solo en desarrollo sin `DATABASE_URL`, con una demo sembrada).
 *
 * Los nombres de tablas y columnas están en español (ver `db/schema.sql`) y
 * este archivo es el único sitio donde aparecen: de aquí para arriba, inglés.
 *
 * ⚠️ AQUÍ NO SE CALCULA NINGUNA COMISIÓN. Eso es `@lib/commissions`, puro. Este
 * archivo solo lee y escribe lo que pasó.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type BusinessSource = "ghl" | "clinics";
export type ReferralChannel = "link" | "coupon" | "form" | "desk" | "other";
export type PayoutMethod = "cash" | "revivi_credit";

export interface Business {
  id: string;
  slug: string;
  name: string;
  source: BusinessSource;
  /** Con `{codigo}` donde va el código del Embajador. */
  linkTemplate: string | null;
  hasSecret: boolean;
  secretCreatedAt: Date | null;
  active: boolean;
  createdAt: Date;
}

export interface StoredRule extends Rule {
  id: string;
  createdAt: Date;
}

export interface StoredReferral {
  id: string;
  businessId: string;
  externalRef: string;
  ambassadorId: string;
  channel: ReferralChannel | null;
  firstContactAt: Date;
  /** El nombre CIFRADO (`@lib/sealed`). Nunca en claro aquí. */
  sealedName: string | null;
  consentAt: Date | null;
}

export interface StoredFact extends Fact {
  externalId: string;
  receivedAt: Date;
}

export interface StoredPayout {
  id: string;
  ambassadorId: string;
  method: PayoutMethod;
  amountCents: number;
  paidAt: Date;
  note: string | null;
  /** El abono en clinics de un pago en crédito, una vez hecho. */
  clinicsRef: string | null;
  recordedBy: string | null;
}

export interface SyncState {
  cursor: string;
  lastOkAt: Date | null;
  lastError: string | null;
}

export interface AmbassadorRepo {
  listBusinesses(): Promise<Business[]>;
  businessBySlug(slug: string): Promise<Business | null>;
  /** Solo el hash del secreto, para comprobar un webhook. */
  secretHashOf(businessId: string): Promise<string | null>;
  /** `null` si el slug ya existe. */
  createBusiness(data: {
    slug: string;
    name: string;
    source: BusinessSource;
    linkTemplate: string | null;
  }): Promise<Business | null>;
  updateBusiness(
    id: string,
    data: { name: string; source: BusinessSource; linkTemplate: string | null; active: boolean },
  ): Promise<void>;
  setBusinessSecret(id: string, hash: string): Promise<void>;

  listRules(): Promise<StoredRule[]>;
  addRule(rule: Rule & { createdBy: string }): Promise<void>;

  /**
   * Busca el referido; si no existe, lo crea con este Embajador.
   *
   * ⚠️ EL PRIMERO GANA: si ya existía con otro Embajador, devuelve el que había
   * y NO lo cambia. Dos hechos simultáneos del mismo cliente nuevo no pueden
   * crear dos referidos: lo impide el UNIQUE de la tabla.
   */
  findOrCreateReferral(data: {
    businessId: string;
    externalRef: string;
    ambassadorId: string;
    channel: ReferralChannel | null;
    firstContactAt: Date;
  }): Promise<StoredReferral>;
  referralByRef(businessId: string, externalRef: string): Promise<StoredReferral | null>;
  setReferralName(id: string, sealedName: string | null, consentAt: Date | null): Promise<void>;
  /** Los referidos de esos Embajadores (nivel 1 de cada uno). */
  referralsOf(ambassadorIds: string[]): Promise<StoredReferral[]>;

  factByExternal(businessId: string, externalId: string): Promise<StoredFact | null>;
  /** `created: false` si ese hecho ya estaba: repetir no duplica. */
  insertFact(data: Omit<StoredFact, "id" | "receivedAt">): Promise<{ fact: StoredFact; created: boolean }>;
  factsOf(referralIds: string[]): Promise<StoredFact[]>;

  /** Sin filtro, los de todos (para el admin). */
  listPayouts(ambassadorIds?: string[]): Promise<StoredPayout[]>;
  /** Devuelve el id del pago anotado. */
  addPayout(data: Omit<StoredPayout, "id">): Promise<string>;
  /** El abono en clinics de un pago en crédito Revivi, ya hecho. */
  setPayoutClinicsRef(id: string, ref: string): Promise<void>;

  /** Hasta dónde se leyó de una fuente (`clinics`). */
  syncState(source: string): Promise<SyncState>;
  saveSync(source: string, data: { cursor?: string; ok?: boolean; error?: string | null }): Promise<void>;

  /** Deja rastro de que alguien vio nombres de clientes. Nunca lanza. */
  logView(data: { viewerId: string; ambassadorId: string | null; what: string }): Promise<void>;
}

// ─── Puentes con los valores en español de la base ──────────────────────────

const CHANNEL_DB: Record<ReferralChannel, string> = {
  link: "enlace",
  coupon: "cupon",
  form: "formulario",
  desk: "mostrador",
  other: "otro",
};
const channelFromDb = (v: unknown): ReferralChannel | null => {
  const hit = Object.entries(CHANNEL_DB).find(([, db]) => db === v);
  return hit ? (hit[0] as ReferralChannel) : null;
};

const METHOD_DB: Record<PayoutMethod, string> = { cash: "dinero", revivi_credit: "credito_revivi" };
const methodFromDb = (v: unknown): PayoutMethod => (v === "credito_revivi" ? "revivi_credit" : "cash");

const KIND_DB: Record<RuleKind, string> = { sale: "venta", visit: "cita" };
const kindFromDb = (v: unknown): RuleKind => (v === "cita" ? "visit" : "sale");

const sourceFromDb = (v: unknown): BusinessSource => (v === "clinics" ? "clinics" : "ghl");

/** Minúsculas, números y guiones: es la dirección del webhook. */
export const normaliseSlug = (slug: string) =>
  slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

// ─── Postgres ────────────────────────────────────────────────────────────────

function postgresRepo(url: string): AmbassadorRepo {
  const sql = sharedSql(url);

  const toBusiness = (f: Record<string, unknown>): Business => ({
    id: f.id as string,
    slug: f.slug as string,
    name: f.nombre as string,
    source: sourceFromDb(f.fuente),
    linkTemplate: (f.enlace_plantilla as string) ?? null,
    hasSecret: Boolean(f.secreto_hash),
    secretCreatedAt: (f.secreto_creado_en as Date) ?? null,
    active: f.activo as boolean,
    createdAt: f.creado_en as Date,
  });

  const toRule = (f: Record<string, unknown>): StoredRule => ({
    id: f.id as string,
    businessId: f.negocio_id as string,
    level: Number(f.nivel) === 2 ? 2 : 1,
    kind: kindFromDb(f.clase),
    fromPayment: Number(f.pago_desde),
    percent: f.porcentaje == null ? null : Number(f.porcentaje),
    fixedCents: f.importe_fijo_centavos == null ? null : Number(f.importe_fijo_centavos),
    effectiveFrom: f.vigente_desde as Date,
    createdAt: f.creado_en as Date,
  });

  const toReferral = (f: Record<string, unknown>): StoredReferral => ({
    id: f.id as string,
    businessId: f.negocio_id as string,
    externalRef: f.ref_externa as string,
    ambassadorId: f.embajador_id as string,
    channel: channelFromDb(f.canal),
    firstContactAt: f.primer_contacto_en as Date,
    sealedName: (f.nombre_cifrado as string) ?? null,
    consentAt: (f.consentimiento_en as Date) ?? null,
  });

  const toFact = (f: Record<string, unknown>): StoredFact => ({
    id: f.id as string,
    businessId: f.negocio_id as string,
    externalId: f.evento_externo as string,
    referralId: f.referido_id as string,
    type: f.tipo as FactType,
    amountCents: f.importe_centavos == null ? null : Number(f.importe_centavos),
    paymentNumber: f.numero_pago == null ? null : Number(f.numero_pago),
    occurredAt: f.ocurrido_en as Date,
    originalId: (f.original_id as string) ?? null,
    receivedAt: f.recibido_en as Date,
  });

  const toPayout = (f: Record<string, unknown>): StoredPayout => ({
    id: f.id as string,
    ambassadorId: f.embajador_id as string,
    method: methodFromDb(f.metodo),
    amountCents: Number(f.importe_centavos),
    paidAt: f.pagado_en as Date,
    note: (f.nota as string) ?? null,
    clinicsRef: (f.ref_clinics as string) ?? null,
    recordedBy: (f.registrado_por as string) ?? null,
  });

  return {
    async listBusinesses() {
      const rows = await sql`SELECT * FROM negocios ORDER BY nombre, id`;
      return rows.map(toBusiness);
    },

    async businessBySlug(slug) {
      const [f] = await sql`SELECT * FROM negocios WHERE slug = ${normaliseSlug(slug)} LIMIT 1`;
      return f ? toBusiness(f) : null;
    },

    async secretHashOf(businessId) {
      const [f] = await sql`SELECT secreto_hash FROM negocios WHERE id = ${businessId}`;
      return (f?.secreto_hash as string) ?? null;
    },

    async createBusiness({ slug, name, source, linkTemplate }) {
      const [f] = await sql`
        INSERT INTO negocios (slug, nombre, fuente, enlace_plantilla)
        VALUES (${normaliseSlug(slug)}, ${name}, ${source}, ${linkTemplate})
        ON CONFLICT (slug) DO NOTHING
        RETURNING *`;
      return f ? toBusiness(f) : null;
    },

    async updateBusiness(id, { name, source, linkTemplate, active }) {
      await sql`
        UPDATE negocios
        SET nombre = ${name}, fuente = ${source}, enlace_plantilla = ${linkTemplate}, activo = ${active}
        WHERE id = ${id}`;
    },

    async setBusinessSecret(id, hash) {
      await sql`
        UPDATE negocios SET secreto_hash = ${hash}, secreto_creado_en = now()
        WHERE id = ${id}`;
    },

    async listRules() {
      const rows = await sql`SELECT * FROM reglas_comision ORDER BY vigente_desde, id`;
      return rows.map(toRule);
    },

    async addRule(r) {
      await sql`
        INSERT INTO reglas_comision (
          negocio_id, nivel, clase, pago_desde, porcentaje,
          importe_fijo_centavos, vigente_desde, creado_por
        ) VALUES (
          ${r.businessId}, ${r.level}, ${KIND_DB[r.kind]}, ${r.fromPayment}, ${r.percent},
          ${r.fixedCents}, ${r.effectiveFrom}, ${r.createdBy}
        )`;
    },

    async findOrCreateReferral({ businessId, externalRef, ambassadorId, channel, firstContactAt }) {
      /* INSERT ... ON CONFLICT DO NOTHING y luego SELECT: si dos hechos llegan
         a la vez, uno inserta, el otro no, y los dos leen el mismo referido. */
      await sql`
        INSERT INTO referidos (negocio_id, ref_externa, embajador_id, canal, primer_contacto_en)
        VALUES (${businessId}, ${externalRef}, ${ambassadorId},
                ${channel ? CHANNEL_DB[channel] : null}, ${firstContactAt})
        ON CONFLICT (negocio_id, ref_externa) DO NOTHING`;
      const [f] = await sql`
        SELECT * FROM referidos
        WHERE negocio_id = ${businessId} AND ref_externa = ${externalRef}`;
      return toReferral(f!);
    },

    async referralByRef(businessId, externalRef) {
      const [f] = await sql`
        SELECT * FROM referidos
        WHERE negocio_id = ${businessId} AND ref_externa = ${externalRef}`;
      return f ? toReferral(f) : null;
    },

    async setReferralName(id, sealedName, consentAt) {
      await sql`
        UPDATE referidos SET nombre_cifrado = ${sealedName}, consentimiento_en = ${consentAt}
        WHERE id = ${id}`;
    },

    async referralsOf(ambassadorIds) {
      if (!ambassadorIds.length) return [];
      const rows = await sql`
        SELECT * FROM referidos WHERE embajador_id IN ${sql(ambassadorIds)}
        ORDER BY primer_contacto_en DESC, id`;
      return rows.map(toReferral);
    },

    async factByExternal(businessId, externalId) {
      const [f] = await sql`
        SELECT * FROM hechos WHERE negocio_id = ${businessId} AND evento_externo = ${externalId}`;
      return f ? toFact(f) : null;
    },

    async insertFact(d) {
      const [f] = await sql`
        INSERT INTO hechos (
          negocio_id, evento_externo, referido_id, tipo, importe_centavos,
          numero_pago, ocurrido_en, original_id
        ) VALUES (
          ${d.businessId}, ${d.externalId}, ${d.referralId}, ${d.type}, ${d.amountCents},
          ${d.paymentNumber}, ${d.occurredAt}, ${d.originalId}
        )
        ON CONFLICT (negocio_id, evento_externo) DO NOTHING
        RETURNING *`;
      if (f) return { fact: toFact(f), created: true };
      const [old] = await sql`
        SELECT * FROM hechos WHERE negocio_id = ${d.businessId} AND evento_externo = ${d.externalId}`;
      return { fact: toFact(old!), created: false };
    },

    async factsOf(referralIds) {
      if (!referralIds.length) return [];
      const rows = await sql`
        SELECT * FROM hechos WHERE referido_id IN ${sql(referralIds)}
        ORDER BY ocurrido_en, id`;
      return rows.map(toFact);
    },

    async listPayouts(ambassadorIds) {
      const rows = ambassadorIds
        ? ambassadorIds.length
          ? await sql`
              SELECT * FROM pagos_embajador WHERE embajador_id IN ${sql(ambassadorIds)}
              ORDER BY pagado_en DESC, id`
          : []
        : await sql`SELECT * FROM pagos_embajador ORDER BY pagado_en DESC, id`;
      return rows.map(toPayout);
    },

    async addPayout(p) {
      const [f] = await sql`
        INSERT INTO pagos_embajador (
          embajador_id, metodo, importe_centavos, pagado_en, nota, ref_clinics, registrado_por
        ) VALUES (
          ${p.ambassadorId}, ${METHOD_DB[p.method]}, ${p.amountCents}, ${p.paidAt},
          ${p.note}, ${p.clinicsRef}, ${p.recordedBy}
        )
        RETURNING id`;
      return f!.id as string;
    },

    async setPayoutClinicsRef(id, ref) {
      await sql`UPDATE pagos_embajador SET ref_clinics = ${ref} WHERE id = ${id}`;
    },

    async syncState(source) {
      const [f] = await sql`SELECT * FROM sincronizacion WHERE fuente = ${source}`;
      return {
        cursor: (f?.cursor as string) ?? "0",
        lastOkAt: (f?.ultimo_ok_en as Date) ?? null,
        lastError: (f?.ultimo_error as string) ?? null,
      };
    },

    async saveSync(source, { cursor, ok, error }) {
      /* Una sola sentencia: la fila nace la primera vez. Cada campo solo se
         toca si viene; el cursor no vuelve atrás porque solo se escribe el
         que devolvió clinics después del último hecho guardado. */
      await sql`
        INSERT INTO sincronizacion (fuente, cursor, ultimo_ok_en, ultimo_error)
        VALUES (${source}, ${cursor ?? "0"}, ${ok ? new Date() : null}, ${error ?? null})
        ON CONFLICT (fuente) DO UPDATE SET
          cursor = COALESCE(${cursor ?? null}, sincronizacion.cursor),
          ultimo_ok_en = CASE WHEN ${!!ok} THEN now() ELSE sincronizacion.ultimo_ok_en END,
          ultimo_error = CASE WHEN ${error === undefined} THEN sincronizacion.ultimo_error ELSE ${error ?? null} END,
          actualizado_en = now()`;
    },

    async logView({ viewerId, ambassadorId, what }) {
      try {
        await sql`
          INSERT INTO registro_vistas (quien_id, embajador_id, que)
          VALUES (${viewerId}, ${ambassadorId}, ${what})`;
      } catch (error) {
        console.error("[ambassadors] No se pudo anotar la vista:", error);
      }
    },
  };
}

// ─── Memoria (solo desarrollo) ───────────────────────────────────────────────

function memoryRepo(): AmbassadorRepo {
  const businesses = new Map<string, Business & { secretHash: string | null }>();
  const rules: StoredRule[] = [];
  const referrals = new Map<string, StoredReferral>();
  const facts = new Map<string, StoredFact>();
  const payouts: StoredPayout[] = [];
  const syncs = new Map<string, SyncState>();
  let n = 0;
  const newId = () => `amb-${++n}`;

  /* ─── LA DEMO ─────────────────────────────────────────────────────────────
     Con la demo de `@lib/data` (Laura es Embajadora, código LAURA) se siembran
     dos negocios, unas reglas de EJEMPLO y unos hechos, para que el portal se
     pueda abrir con números. Los porcentajes son inventados y solo viven aquí:
     los de verdad los pone el admin. */
  let seeded: Promise<void> | null = null;
  const seed = async () => {
    const laura = await studentsRepo().studentByAmbassadorCode("LAURA");
    if (!laura) return;
    const day = 86_400_000;
    const ago = (d: number) => new Date(Date.now() - d * day);

    const mk = (slug: string, name: string, linkTemplate: string | null): Business => {
      const b = {
        id: newId(), slug, name, source: "ghl" as const, linkTemplate,
        hasSecret: false, secretCreatedAt: null, active: true, createdAt: ago(90), secretHash: null,
      };
      businesses.set(b.id, b);
      return b;
    };
    const lira = mk("lira-medical", "Lira Medical", "https://liramedical.com/?ref={codigo}");
    const revivi = mk("revivi", "Revivi Med Spa", "https://revivimedspa.com/r/{codigo}");

    for (const b of [lira, revivi]) {
      rules.push(
        { id: newId(), businessId: b.id, level: 1, kind: "sale", fromPayment: 1, percent: 20, fixedCents: null, effectiveFrom: ago(90), createdAt: ago(90) },
        { id: newId(), businessId: b.id, level: 1, kind: "sale", fromPayment: 2, percent: 10, fixedCents: null, effectiveFrom: ago(90), createdAt: ago(90) },
        { id: newId(), businessId: b.id, level: 2, kind: "sale", fromPayment: 1, percent: 5, fixedCents: null, effectiveFrom: ago(90), createdAt: ago(90) },
      );
    }

    const ref = (b: Business, ext: string, days: number): StoredReferral => {
      const r: StoredReferral = {
        id: newId(), businessId: b.id, externalRef: ext, ambassadorId: laura.id,
        channel: "link", firstContactAt: ago(days), sealedName: null, consentAt: null,
      };
      referrals.set(r.id, r);
      return r;
    };
    const fact = (r: StoredReferral, type: FactType, days: number, amountCents: number | null, paymentNumber: number | null = null, originalId: string | null = null) => {
      const f: StoredFact = {
        id: newId(), businessId: r.businessId, externalId: newId(), referralId: r.id, type,
        amountCents, paymentNumber, occurredAt: ago(days), originalId, receivedAt: ago(days),
      };
      facts.set(f.id, f);
      return f;
    };

    const a = ref(lira, "c-1", 50);
    fact(a, "lead", 50, null);
    fact(a, "purchase", 45, 29_900, 1);
    fact(a, "renewal", 15, 29_900, 2);
    const b = ref(lira, "c-2", 10);
    fact(b, "lead", 10, null);
    fact(b, "purchase", 6, 29_900, 1);
    const c = ref(revivi, "c-3", 30);
    const sale = fact(c, "purchase", 28, 45_000, 1);
    fact(c, "refund", 25, 45_000, null, sale.id);
    ref(revivi, "c-4", 3);

    payouts.push({
      id: newId(), ambassadorId: laura.id, method: "cash", amountCents: 5_980,
      paidAt: ago(20), note: "Demo", clinicsRef: null, recordedBy: null,
    });
  };
  const ready = () => (seeded ??= seed());

  const strip = ({ secretHash: _s, ...b }: Business & { secretHash: string | null }): Business => b;

  return {
    async listBusinesses() {
      await ready();
      return [...businesses.values()].map(strip).sort((a, b) => a.name.localeCompare(b.name));
    },
    async businessBySlug(slug) {
      await ready();
      const b = [...businesses.values()].find((x) => x.slug === normaliseSlug(slug));
      return b ? strip(b) : null;
    },
    async secretHashOf(id) {
      await ready();
      return businesses.get(id)?.secretHash ?? null;
    },
    async createBusiness({ slug, name, source, linkTemplate }) {
      await ready();
      const s = normaliseSlug(slug);
      if ([...businesses.values()].some((b) => b.slug === s)) return null;
      const b = {
        id: newId(), slug: s, name, source, linkTemplate, hasSecret: false,
        secretCreatedAt: null, active: true, createdAt: new Date(), secretHash: null,
      };
      businesses.set(b.id, b);
      return strip(b);
    },
    async updateBusiness(id, data) {
      const b = businesses.get(id);
      if (b) businesses.set(id, { ...b, ...data });
    },
    async setBusinessSecret(id, hash) {
      const b = businesses.get(id);
      if (b) businesses.set(id, { ...b, secretHash: hash, hasSecret: true, secretCreatedAt: new Date() });
    },
    async listRules() {
      await ready();
      return [...rules];
    },
    async addRule({ createdBy: _c, ...r }) {
      rules.push({ ...r, id: newId(), createdAt: new Date() });
    },
    async findOrCreateReferral(d) {
      await ready();
      const old = [...referrals.values()].find(
        (r) => r.businessId === d.businessId && r.externalRef === d.externalRef,
      );
      if (old) return old;
      const r: StoredReferral = { ...d, id: newId(), sealedName: null, consentAt: null };
      referrals.set(r.id, r);
      return r;
    },
    async referralByRef(businessId, externalRef) {
      await ready();
      return [...referrals.values()].find((r) => r.businessId === businessId && r.externalRef === externalRef) ?? null;
    },
    async setReferralName(id, sealedName, consentAt) {
      const r = referrals.get(id);
      if (r) referrals.set(id, { ...r, sealedName, consentAt });
    },
    async referralsOf(ids) {
      await ready();
      return [...referrals.values()]
        .filter((r) => ids.includes(r.ambassadorId))
        .sort((a, b) => b.firstContactAt.getTime() - a.firstContactAt.getTime());
    },
    async factByExternal(businessId, externalId) {
      await ready();
      return [...facts.values()].find((f) => f.businessId === businessId && f.externalId === externalId) ?? null;
    },
    async insertFact(d) {
      await ready();
      const old = [...facts.values()].find((f) => f.businessId === d.businessId && f.externalId === d.externalId);
      if (old) return { fact: old, created: false };
      const f: StoredFact = { ...d, id: newId(), receivedAt: new Date() };
      facts.set(f.id, f);
      return { fact: f, created: true };
    },
    async factsOf(ids) {
      await ready();
      return [...facts.values()]
        .filter((f) => ids.includes(f.referralId))
        .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
    },
    async listPayouts(ids) {
      await ready();
      return payouts
        .filter((p) => !ids || ids.includes(p.ambassadorId))
        .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());
    },
    async addPayout(p) {
      const id = newId();
      payouts.push({ ...p, id });
      return id;
    },
    async setPayoutClinicsRef(id, ref) {
      const p = payouts.find((x) => x.id === id);
      if (p) p.clinicsRef = ref;
    },
    async syncState(source) {
      return syncs.get(source) ?? { cursor: "0", lastOkAt: null, lastError: null };
    },
    async saveSync(source, { cursor, ok, error }) {
      const old = syncs.get(source) ?? { cursor: "0", lastOkAt: null, lastError: null };
      syncs.set(source, {
        cursor: cursor ?? old.cursor,
        lastOkAt: ok ? new Date() : old.lastOkAt,
        lastError: error === undefined ? old.lastError : error,
      });
    },
    async logView() {
      /* En memoria no hay rastro que guardar. */
    },
  };
}

// ─── Selección ───────────────────────────────────────────────────────────────

let cached: AmbassadorRepo | null = null;

/**
 * El repositorio. Misma regla que `@lib/data`: Postgres si hay `DATABASE_URL`,
 * memoria solo en desarrollo, y en producción sin base es un error, nunca un
 * portal que funciona a ratos.
 */
export function ambassadorRepo(): AmbassadorRepo {
  if (cached) return cached;
  const url = import.meta.env.DATABASE_URL;
  if (url) return (cached = postgresRepo(url));
  if (import.meta.env.DEV) return (cached = memoryRepo());
  throw new Error("[ambassadors] DATABASE_URL is missing.");
}
