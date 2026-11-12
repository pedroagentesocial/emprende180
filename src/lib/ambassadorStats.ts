import type { Line, LineStatus } from "@lib/commissions";
import type { Business, PayoutMethod, StoredFact, StoredPayout } from "@lib/ambassadors";
import type { Student } from "@lib/data";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LO QUE EL EMBAJADOR VE DE SU HISTORIA (12-11-2026)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Sobre el mismo libro (`loadBook`), sin leer nada más:
 *
 *   · MOVIMIENTOS: cada venta, renovación, cita, reembolso y pago, con lo que
 *     movió la venta y lo que te tocó a ti.
 *   · MENSUALIDADES: los clientes que pagan cada mes (una membresía, un plan),
 *     si siguen al día y cuándo toca el siguiente cobro.
 *   · MES A MES desde que abriste tu cuenta: ventas que trajiste, lo ganado y lo
 *     pagado. Es el "estado de cuenta" y la gráfica larga del inicio.
 *   · DESDE EL ALTA: los totales de toda la cuenta.
 *
 * ⚠️ AQUÍ TAMPOCO HAY NOMBRES DE CLIENTES. Un cliente es su número ("Cliente
 * #3"); del equipo se dice el nombre del Embajador, nunca el de sus clientes.
 *
 * ⚠️ UNA MENSUALIDAD ES UN CÁLCULO, NO UN DATO: es un cliente con dos pagos o
 * más. "Al día" = pagó en los últimos 35 días; "atrasada" = de 35 a 60;
 * después se da por parada. Los negocios no avisan cuándo vence la siguiente,
 * así que "próximo cobro" es el último más 30 días, y se dice que es estimado.
 */

export type TxKind = "purchase" | "renewal" | "attended" | "refund" | "cancel" | "payout";

export interface Transaction {
  id: string;
  at: Date;
  kind: TxKind;
  businessName: string | null;
  /** El número del cliente si es tuyo (nivel 1). */
  clientNumber: number | null;
  /** El Embajador de tu equipo, si la venta es suya (nivel 2). */
  teamMember: string | null;
  level: 1 | 2 | null;
  paymentNumber: number | null;
  /** Lo que pagó el cliente (o lo que se le devolvió). */
  saleCents: number | null;
  /** Lo que te toca: positivo, negativo en un descuento, el importe en un pago. */
  commissionCents: number;
  status: LineStatus | null;
  payableFrom: Date | null;
  percent: number | null;
  method: PayoutMethod | null;
  pendingCredit: boolean;
  businessId: string | null;
  note: string | null;
}

export type RecurringState = "active" | "late" | "stopped" | "cancelled";

export interface Recurring {
  referralId: string;
  clientNumber: number;
  businessName: string | null;
  payments: number;
  firstAt: Date;
  lastAt: Date;
  lastAmountCents: number;
  /** Lo que te dio el último cobro: lo que puedes esperar del siguiente. */
  lastCommissionCents: number;
  /** Todo lo que te ha dado esta mensualidad. */
  totalCommissionCents: number;
  state: RecurringState;
  /** Estimado: el último cobro más 30 días. Nulo si está parada. */
  nextAt: Date | null;
}

export interface MonthRow {
  monthStart: Date;
  /** Lo que pagaron tus clientes ese mes (ventas en pie). */
  salesCents: number;
  /** Lo que ganaste ese mes (niveles 1 y 2, sin anulados). */
  earnedCents: number;
  /** Descuentos por reembolsos de ese mes (negativo o cero). */
  deductedCents: number;
  /** Lo que se te pagó ese mes. */
  paidCents: number;
  newReferrals: number;
  newCustomers: number;
  /** Ganado acumulado hasta el final del mes. */
  cumulativeCents: number;
}

export interface Lifetime {
  since: Date;
  days: number;
  months: number;
  referrals: number;
  customers: number;
  /** De 0 a 100, entero. Nulo sin referidos. */
  conversionPct: number | null;
  salesCents: number;
  earnedCents: number;
  ownEarnedCents: number;
  teamEarnedCents: number;
  paidCents: number;
  payoutsCount: number;
  avgPerCustomerCents: number | null;
  bestMonth: { monthStart: Date; earnedCents: number } | null;
  recurringActive: number;
  /** Lo que te dejan cada mes las mensualidades al día. */
  recurringMonthlyCents: number;
}

export interface Stats {
  transactions: Transaction[];
  recurring: Recurring[];
  monthly: MonthRow[];
  lifetime: Lifetime;
}

const DAY = 86_400_000;
const SALE_TYPES = new Set(["purchase", "renewal", "attended"]);
const MAX_MONTHS = 24;

const monthStart = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
const nextMonth = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));

/** Las ventas que un reembolso total o una cancelación deshacen. */
export function reversedSales(facts: readonly StoredFact[]): Set<string> {
  const byId = new Map(facts.map((f) => [f.id, f]));
  const out = new Set<string>();
  for (const f of facts) {
    if (!f.originalId) continue;
    if (f.type === "cancel") out.add(f.originalId);
    if (f.type === "refund") {
      const original = byId.get(f.originalId);
      if (!original?.amountCents || (f.amountCents ?? 0) >= original.amountCents) out.add(f.originalId);
    }
  }
  return out;
}

export function statsFor(input: {
  ambassador: Student;
  now: Date;
  businesses: readonly Business[];
  /** Sus referidos (nivel 1) con su número de cliente. */
  own: readonly { id: string; number: number; businessId: string; firstContactAt: Date }[];
  /** Los hechos de sus referidos Y de los de su equipo. */
  facts: readonly StoredFact[];
  lines: readonly Line[];
  payouts: readonly StoredPayout[];
  /** Embajador dueño de cada referido del equipo. */
  ownerOf: (referralId: string) => Student | null;
}): Stats {
  const { ambassador, now, own, facts, lines, payouts } = input;
  const businessName = new Map(input.businesses.map((b) => [b.id, b.name]));
  const factById = new Map(facts.map((f) => [f.id, f]));
  const numberOf = new Map(own.map((r) => [r.id, r.number]));
  const ownIds = new Set(own.map((r) => r.id));
  const reversed = reversedSales(facts);

  /* ─── Movimientos ───────────────────────────────────────────────────────── */
  const transactions: Transaction[] = [];
  const refundsWithLine = new Set<string>();

  for (const l of lines) {
    const fact = factById.get(l.factId);
    if (!fact) continue;
    const own1 = l.level === 1;
    if (l.status === "deduction") refundsWithLine.add(fact.id);
    transactions.push({
      id: `l:${l.factId}:${l.level}`,
      at: l.occurredAt,
      kind: fact.type as TxKind,
      businessName: businessName.get(l.businessId) ?? null,
      businessId: l.businessId,
      note: null,
      clientNumber: own1 ? (numberOf.get(l.referralId) ?? null) : null,
      teamMember: own1 ? null : (nameOf(input.ownerOf(l.referralId))),
      level: l.level,
      paymentNumber: (factById.get(l.sourceFactId) ?? fact).paymentNumber,
      saleCents: fact.amountCents,
      commissionCents: l.amountCents,
      status: l.status,
      payableFrom: l.status === "waiting" ? l.payableFrom : null,
      percent: l.percent,
      method: null,
      pendingCredit: false,
    });
  }

  /* Un reembolso o una cancelación dentro de la espera no deja línea (anula la
     venta), pero sí es un movimiento que el Embajador tiene que ver. */
  for (const f of facts) {
    if ((f.type !== "refund" && f.type !== "cancel") || refundsWithLine.has(f.id)) continue;
    if (!ownIds.has(f.referralId)) continue;
    transactions.push({
      id: `f:${f.id}`,
      at: f.occurredAt,
      kind: f.type,
      businessName: businessName.get(f.businessId) ?? null,
      businessId: f.businessId,
      note: null,
      clientNumber: numberOf.get(f.referralId) ?? null,
      teamMember: null,
      level: 1,
      paymentNumber: null,
      saleCents: f.amountCents,
      commissionCents: 0,
      status: null,
      payableFrom: null,
      percent: null,
      method: null,
      pendingCredit: false,
    });
  }

  for (const p of payouts) {
    transactions.push({
      id: `p:${p.id}`,
      at: p.paidAt,
      kind: "payout",
      businessName: null,
      businessId: null,
      note: p.note,
      clientNumber: null,
      teamMember: null,
      level: null,
      paymentNumber: null,
      saleCents: null,
      commissionCents: p.amountCents,
      status: null,
      payableFrom: null,
      percent: null,
      method: p.method,
      pendingCredit: p.method === "revivi_credit" && !p.clinicsRef,
    });
  }
  transactions.sort((a, b) => b.at.getTime() - a.at.getTime());

  /* ─── Mensualidades ─────────────────────────────────────────────────────── */
  const recurring: Recurring[] = [];
  for (const r of own) {
    const fs = facts.filter((f) => f.referralId === r.id);
    const paid = fs
      .filter((f) => (f.type === "purchase" || f.type === "renewal") && f.amountCents && !reversed.has(f.id))
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
    const isRecurring = paid.length >= 2 || paid.some((f) => f.type === "renewal");
    if (!isRecurring) continue;
    const last = paid[paid.length - 1]!;
    const myLines = lines.filter((l) => l.referralId === r.id && l.level === 1 && l.status !== "annulled");
    const lastLine = myLines.find((l) => l.sourceFactId === last.id && l.status !== "deduction");
    const cancelled = fs.some((f) => f.type === "cancel");
    const age = (now.getTime() - last.occurredAt.getTime()) / DAY;
    const state: RecurringState = cancelled ? "cancelled" : age <= 35 ? "active" : age <= 60 ? "late" : "stopped";
    recurring.push({
      referralId: r.id,
      clientNumber: r.number,
      businessName: businessName.get(r.businessId) ?? null,
      payments: paid.length,
      firstAt: paid[0]!.occurredAt,
      lastAt: last.occurredAt,
      lastAmountCents: last.amountCents ?? 0,
      lastCommissionCents: lastLine?.amountCents ?? 0,
      totalCommissionCents: myLines.reduce((s, l) => s + l.amountCents, 0),
      state,
      nextAt: state === "active" || state === "late" ? new Date(last.occurredAt.getTime() + 30 * DAY) : null,
    });
  }
  const order: Record<RecurringState, number> = { active: 0, late: 1, stopped: 2, cancelled: 3 };
  recurring.sort((a, b) => order[a.state] - order[b.state] || b.lastAt.getTime() - a.lastAt.getTime());

  /* ─── Mes a mes desde el alta ───────────────────────────────────────────── */
  const firstSeen = [
    ambassador.ambassadorSince,
    ...own.map((r) => r.firstContactAt),
    ...lines.map((l) => l.occurredAt),
  ].filter((d): d is Date => !!d);
  const since = firstSeen.length
    ? new Date(Math.min(...firstSeen.map((d) => d.getTime())))
    : ambassador.createdAt;

  let start = monthStart(since);
  const end = monthStart(now);
  const span = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth() + 1;
  if (span > MAX_MONTHS) start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - (MAX_MONTHS - 1), 1));

  const firstStandingSale = new Map<string, Date>();
  for (const f of [...facts].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())) {
    if (ownIds.has(f.referralId) && SALE_TYPES.has(f.type) && !reversed.has(f.id) && !firstStandingSale.has(f.referralId)) {
      firstStandingSale.set(f.referralId, f.occurredAt);
    }
  }

  const inRange = (d: Date, a: Date, b: Date) => d.getTime() >= a.getTime() && d.getTime() < b.getTime();
  const monthly: MonthRow[] = [];
  let cumulative = lines
    .filter((l) => l.status !== "annulled" && l.status !== "deduction" && l.occurredAt.getTime() < start.getTime())
    .reduce((s, l) => s + l.amountCents, 0);
  for (let m = start; m.getTime() <= end.getTime(); m = nextMonth(m)) {
    const n = nextMonth(m);
    const ls = lines.filter((l) => inRange(l.occurredAt, m, n));
    const earnedCents = ls
      .filter((l) => l.status !== "annulled" && l.status !== "deduction")
      .reduce((s, l) => s + l.amountCents, 0);
    cumulative += earnedCents;
    monthly.push({
      monthStart: m,
      salesCents: salesOf(facts.filter((f) => ownIds.has(f.referralId) && inRange(f.occurredAt, m, n)), reversed, factById),
      earnedCents,
      deductedCents: ls.filter((l) => l.status === "deduction").reduce((s, l) => s + l.amountCents, 0),
      paidCents: payouts.filter((p) => inRange(p.paidAt, m, n)).reduce((s, p) => s + p.amountCents, 0),
      newReferrals: own.filter((r) => inRange(r.firstContactAt, m, n)).length,
      newCustomers: [...firstStandingSale.values()].filter((d) => inRange(d, m, n)).length,
      cumulativeCents: cumulative,
    });
  }

  /* ─── Desde el alta ─────────────────────────────────────────────────────── */
  const counted = lines.filter((l) => l.status !== "annulled");
  const ownEarnedCents = counted.filter((l) => l.level === 1 && l.status !== "deduction").reduce((s, l) => s + l.amountCents, 0);
  const teamEarnedCents = counted.filter((l) => l.level === 2 && l.status !== "deduction").reduce((s, l) => s + l.amountCents, 0);
  const customers = firstStandingSale.size;
  const best = monthly.reduce<MonthRow | null>((b, m) => (m.earnedCents > (b?.earnedCents ?? 0) ? m : b), null);
  const active = recurring.filter((r) => r.state === "active");

  const lifetime: Lifetime = {
    since,
    days: Math.max(1, Math.floor((now.getTime() - since.getTime()) / DAY)),
    months: monthly.length,
    referrals: own.length,
    customers,
    conversionPct: own.length ? Math.round((customers / own.length) * 100) : null,
    salesCents: salesOf(facts.filter((f) => ownIds.has(f.referralId)), reversed, factById),
    earnedCents: ownEarnedCents + teamEarnedCents,
    ownEarnedCents,
    teamEarnedCents,
    paidCents: payouts.reduce((s, p) => s + p.amountCents, 0),
    payoutsCount: payouts.length,
    avgPerCustomerCents: customers ? Math.round(ownEarnedCents / customers) : null,
    bestMonth: best ? { monthStart: best.monthStart, earnedCents: best.earnedCents } : null,
    recurringActive: active.length,
    recurringMonthlyCents: active.reduce((s, r) => s + r.lastCommissionCents, 0),
  };

  return { transactions, recurring, monthly, lifetime };
}

/** Ventas en pie, menos los reembolsos parciales. */
function salesOf(fs: readonly StoredFact[], reversed: Set<string>, byId: Map<string, StoredFact>): number {
  let cents = 0;
  for (const f of fs) {
    if ((f.type === "purchase" || f.type === "renewal") && !reversed.has(f.id)) cents += f.amountCents ?? 0;
    if (f.type === "refund" && f.originalId && !reversed.has(f.originalId) && byId.has(f.originalId)) {
      cents -= f.amountCents ?? 0;
    }
  }
  return cents;
}

function nameOf(s: Student | null): string | null {
  if (!s) return null;
  return [s.name, s.lastName].filter(Boolean).join(" ") || null;
}
