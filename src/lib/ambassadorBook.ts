import { linesFor, pausedAt, type Line, type Summary } from "@lib/commissions";
import {
  ambassadorRepo,
  type Business,
  type ReferralChannel,
  type StoredFact,
  type StoredPayout,
} from "@lib/ambassadors";
import { repo, type Student } from "@lib/data";
import { unseal } from "@lib/sealed";
import { maybeSyncFromClinics } from "@lib/clinicsSync";
import { reversedSales, statsFor, type Stats } from "@lib/ambassadorStats";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL LIBRO DE UN EMBAJADOR: todo lo que enseña su portal, en una lectura
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Junta lo guardado (referidos, hechos, reglas, pagos, su equipo) y se lo pasa
 * a `@lib/commissions`, que decide cuánto y cuándo. Las cinco pestañas del
 * portal leen de aquí, y el admin lee lo mismo cuando abre a un Embajador:
 * dos pantallas con dos cuentas distintas del mismo dinero serían dos verdades.
 *
 * ⚠️ LOS NOMBRES SOLO SE DESCIFRAN SI SE PIDEN (`withNames`), y pedirlos deja
 * rastro en `registro_vistas`. Las pestañas que no enseñan nombres (Inicio,
 * Pagos) no los tocan.
 *
 * ⚠️ DEL EQUIPO SE VE A LOS EMBAJADORES, NUNCA A SUS CLIENTES. El nivel 2 es
 * dinero que te toca por las ventas de alguien a quien invitaste; los clientes
 * de esa persona son suyos y su consentimiento es para ELLA.
 */

export type ReferralStage = "lead" | "customer" | "reversed";

export interface BookReferral {
  id: string;
  /** Número por orden de llegada: el más antiguo es el #1. */
  number: number;
  business: Business | null;
  /** En claro solo con `withNames` y consentimiento; si no, `null`. */
  name: string | null;
  channel: ReferralChannel | null;
  firstContactAt: Date;
  stage: ReferralStage;
  /** Compras, renovaciones y citas que siguen en pie. */
  sales: number;
  lastActivityAt: Date;
  /** Lo que te ha dado este cliente, sin anulados. */
  earnedCents: number;
  /** Sus líneas, la más reciente primero. */
  lines: Line[];
  /** Lo que pasó con este cliente, del más reciente al más antiguo. */
  events: { id: string; at: Date; type: StoredFact["type"]; amountCents: number | null; paymentNumber: number | null }[];
  /** Lo que ha pagado en total (ventas en pie, menos reembolsos parciales). */
  spentCents: number;
  /** Lo que sigue en espera y cuándo sale la primera parte. */
  waitingCents: number;
  nextPayableAt: Date | null;
}

export interface TeamMember {
  student: Student;
  referrals: number;
  customers: number;
  /** Lo que te ha dado su trabajo (tu nivel 2), sin anulados. */
  earnedCents: number;
  /** Tus líneas de nivel 2 por sus ventas, la más reciente primero. */
  lines: Line[];
  /** Su última venta o contacto. */
  lastActivityAt: Date | null;
  /** Por negocio: sus clientes y lo que te dieron. */
  byBusiness: { name: string; customers: number; earnedCents: number }[];
}

export interface Book {
  ambassador: Student;
  businesses: Business[];
  referrals: BookReferral[];
  team: TeamMember[];
  lines: Line[];
  summary: Summary;
  payouts: StoredPayout[];
  byBusiness: { business: Business; referrals: number; customers: number; earnedCents: number }[];
  /** Ganado por semana (fecha del hecho), las últimas 8, la más antigua primero. */
  weekly: { weekStart: Date; earnedCents: number }[];
  /** `true` si no hay ni una regla: el portal avisa de que faltan los números. */
  noRules: boolean;
  /** Movimientos, mensualidades, mes a mes y totales desde el alta. */
  stats: Stats;
}

const SALE_TYPES = new Set(["purchase", "renewal", "attended"]);

function stageOf(facts: StoredFact[]): { stage: ReferralStage; sales: number } {
  const reversed = new Set(
    facts
      .filter((f) => (f.type === "refund" || f.type === "cancel") && f.originalId)
      .filter((f) => {
        if (f.type === "cancel") return true;
        /* Un reembolso parcial no deshace la venta. */
        const original = facts.find((o) => o.id === f.originalId);
        return !original?.amountCents || (f.amountCents ?? 0) >= original.amountCents;
      })
      .map((f) => f.originalId!),
  );
  const sales = facts.filter((f) => SALE_TYPES.has(f.type));
  const standing = sales.filter((f) => !reversed.has(f.id)).length;
  if (standing > 0) return { stage: "customer", sales: standing };
  return { stage: sales.length ? "reversed" : "lead", sales: 0 };
}

/** Lo pagado por un cliente: ventas en pie menos reembolsos parciales. */
function spentOf(facts: StoredFact[]): number {
  const gone = reversedSales(facts);
  let cents = 0;
  for (const f of facts) {
    if ((f.type === "purchase" || f.type === "renewal") && !gone.has(f.id)) cents += f.amountCents ?? 0;
    if (f.type === "refund" && f.originalId && !gone.has(f.originalId)) cents -= f.amountCents ?? 0;
  }
  return cents;
}

function startOfWeek(d: Date): Date {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dow = (x.getUTCDay() + 6) % 7; // lunes = 0
  return new Date(x.getTime() - dow * 86_400_000);
}

export async function loadBook(
  ambassador: Student,
  opts: { viewer: Student; withNames: boolean; now?: Date },
): Promise<Book> {
  const now = opts.now ?? new Date();
  const ar = ambassadorRepo();

  /* Lo último de clinics (Revivi, Venture, las clínicas) antes de contar.
     Como mucho una vez por minuto, y nunca rompe: sin clinics, lo de antes. */
  await maybeSyncFromClinics();

  const everyone = await repo().listStudents();
  const sponsorById = new Map(everyone.map((s) => [s.id, s.sponsorId]));
  const pausesById = new Map(everyone.map((s) => [s.id, s.ambassadorPauses]));
  const team = everyone.filter((s) => s.sponsorId === ambassador.id && s.id !== ambassador.id);
  const teamIds = team.map((s) => s.id);

  const [businesses, rules, referrals, payouts] = await Promise.all([
    ar.listBusinesses(),
    ar.listRules(),
    ar.referralsOf([ambassador.id, ...teamIds]),
    ar.listPayouts([ambassador.id]),
  ]);
  const facts = await ar.factsOf(referrals.map((r) => r.id));

  const { lines, summary } = linesFor(
    ambassador.id,
    facts,
    referrals,
    rules,
    (id) => sponsorById.get(id) ?? null,
    payouts,
    now,
    (id, at) => pausedAt(pausesById.get(id), at),
  );

  const businessById = new Map(businesses.map((b) => [b.id, b]));
  const factsByReferral = new Map<string, StoredFact[]>();
  for (const f of facts) {
    const list = factsByReferral.get(f.referralId) ?? [];
    list.push(f);
    factsByReferral.set(f.referralId, list);
  }
  const linesByReferral = new Map<string, Line[]>();
  for (const l of lines) {
    const list = linesByReferral.get(l.referralId) ?? [];
    list.push(l);
    linesByReferral.set(l.referralId, list);
  }
  const earned = (ls: Line[] | undefined) =>
    (ls ?? []).filter((l) => l.status !== "annulled").reduce((s, l) => s + l.amountCents, 0);

  /* ─── Sus referidos (nivel 1), numerados por llegada ────────────────────── */
  const own = referrals
    .filter((r) => r.ambassadorId === ambassador.id)
    .sort((a, b) => a.firstContactAt.getTime() - b.firstContactAt.getTime());

  const bookReferrals: BookReferral[] = own
    .map((r, i) => {
      const fs = factsByReferral.get(r.id) ?? [];
      const { stage, sales } = stageOf(fs);
      const last = fs.reduce((m, f) => (f.occurredAt > m ? f.occurredAt : m), r.firstContactAt);
      return {
        id: r.id,
        number: i + 1,
        business: businessById.get(r.businessId) ?? null,
        name: opts.withNames && r.consentAt ? unseal(r.sealedName) : null,
        channel: r.channel,
        firstContactAt: r.firstContactAt,
        stage,
        sales,
        lastActivityAt: last,
        earnedCents: earned(linesByReferral.get(r.id)),
        lines: linesByReferral.get(r.id) ?? [],
        events: [...fs]
          .sort((x, y) => y.occurredAt.getTime() - x.occurredAt.getTime())
          .map((f) => ({ id: f.id, at: f.occurredAt, type: f.type, amountCents: f.amountCents, paymentNumber: f.paymentNumber })),
        spentCents: spentOf(fs),
        waitingCents: (linesByReferral.get(r.id) ?? []).filter((l) => l.status === "waiting").reduce((s, l) => s + l.amountCents, 0),
        nextPayableAt:
          (linesByReferral.get(r.id) ?? [])
            .filter((l) => l.status === "waiting")
            .map((l) => l.payableFrom)
            .sort((x, y) => x.getTime() - y.getTime())[0] ?? null,
      };
    })
    .reverse();

  if (opts.withNames && bookReferrals.some((r) => r.name)) {
    await ar.logView({
      viewerId: opts.viewer.id,
      ambassadorId: ambassador.id,
      what: opts.viewer.id === ambassador.id ? "referrals" : "admin:referrals",
    });
  }

  /* ─── Su equipo (nivel 2): las personas, no sus clientes ────────────────── */
  const teamRows: TeamMember[] = team.map((member) => {
    const theirs = referrals.filter((r) => r.ambassadorId === member.id);
    const customers = theirs.filter(
      (r) => stageOf(factsByReferral.get(r.id) ?? []).stage === "customer",
    ).length;
    const theirLines = theirs
      .flatMap((r) => linesByReferral.get(r.id) ?? [])
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
    const theirFacts = theirs.flatMap((r) => factsByReferral.get(r.id) ?? []);
    const lastActivityAt = [...theirs.map((r) => r.firstContactAt), ...theirFacts.map((f) => f.occurredAt)].reduce<Date | null>(
      (m, d) => (!m || d > m ? d : m),
      null,
    );
    const byBiz = businesses
      .map((b) => {
        const refs = theirs.filter((r) => r.businessId === b.id);
        return {
          name: b.name,
          customers: refs.filter((r) => stageOf(factsByReferral.get(r.id) ?? []).stage === "customer").length,
          earnedCents: refs.reduce((s, r) => s + earned(linesByReferral.get(r.id)), 0),
        };
      })
      .filter((b) => b.customers > 0 || b.earnedCents !== 0);
    return {
      student: member,
      referrals: theirs.length,
      customers,
      earnedCents: theirs.reduce((s, r) => s + earned(linesByReferral.get(r.id)), 0),
      lines: theirLines,
      lastActivityAt,
      byBusiness: byBiz,
    };
  });
  teamRows.sort((a, b) => b.earnedCents - a.earnedCents);

  /* ─── Por negocio: solo los suyos y su nivel 1 ──────────────────────────── */
  const byBusiness = businesses
    .map((business) => {
      const refs = bookReferrals.filter((r) => r.business?.id === business.id);
      return {
        business,
        referrals: refs.length,
        customers: refs.filter((r) => r.stage === "customer").length,
        earnedCents: earned(lines.filter((l) => l.businessId === business.id)),
      };
    })
    .filter((b) => b.referrals > 0 || b.earnedCents !== 0);

  /* ─── Las últimas 8 semanas ─────────────────────────────────────────────── */
  const thisWeek = startOfWeek(now);
  const weekly = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(thisWeek.getTime() - (7 - i) * 7 * 86_400_000);
    const end = weekStart.getTime() + 7 * 86_400_000;
    return {
      weekStart,
      earnedCents: earned(
        lines.filter(
          (l) =>
            l.status !== "deduction" &&
            l.occurredAt.getTime() >= weekStart.getTime() &&
            l.occurredAt.getTime() < end,
        ),
      ),
    };
  });

  const ownerById = new Map(everyone.map((s) => [s.id, s]));
  const referralOwner = new Map(referrals.map((r) => [r.id, r.ambassadorId]));
  const stats = statsFor({
    ambassador,
    now,
    businesses,
    own: bookReferrals.map((r) => ({
      id: r.id,
      number: r.number,
      businessId: r.business?.id ?? "",
      firstContactAt: r.firstContactAt,
    })),
    facts,
    lines,
    payouts,
    ownerOf: (id) => ownerById.get(referralOwner.get(id) ?? "") ?? null,
  });

  return {
    ambassador,
    businesses,
    referrals: bookReferrals,
    team: teamRows,
    lines,
    summary,
    payouts,
    byBusiness,
    weekly,
    noRules: rules.length === 0,
    stats,
  };
}

/** El enlace de un negocio para un Embajador, o `null` si el negocio no tiene. */
export const referralLink = (business: Business, code: string): string | null =>
  business.linkTemplate ? business.linkTemplate.replaceAll("{codigo}", encodeURIComponent(code)) : null;
