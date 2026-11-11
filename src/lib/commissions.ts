/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMISIONES DE EMBAJADORES: el cálculo, sin base de datos
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Todo lo que un Embajador ve en su portal sale de aquí: cuánto ganó, cuánto
 * está en espera, cuánto puede cobrar y cuándo. Recibe los hechos que contaron
 * los negocios, las reglas y los pagos, y devuelve las líneas con su estado.
 *
 * ⚠️ ES PURO A PROPÓSITO: sin base de datos, sin fechas del sistema (el "ahora"
 * entra como argumento) y sin imports. Por eso se prueba con `npm test` sin
 * montar nada, y por eso no hay una tabla de comisiones: lo guardado es lo que
 * pasó (hechos, reglas, pagos) y la comisión se deduce cada vez. Un reembolso
 * la corrige sola.
 *
 * ─── LAS REGLAS DEL TICKET "REPARTO DE COMISIONES" ─────────────────────────
 *
 *  1. Genera comisión una compra validada, cada renovación y, en los negocios
 *     donde no se paga en caja (las clínicas), cada cita asistida.
 *  2. Cobran dos niveles: el Embajador que trajo al cliente (nivel 1) y quien
 *     invitó a ese Embajador (nivel 2), sobre la misma venta.
 *  3. Cada línea espera 15 días (`HOLD_DAYS`) desde el hecho antes de poder
 *     cobrarse.
 *  4. Un reembolso dentro de la espera ANULA la línea. Uno después se resta
 *     del siguiente pago, y si el saldo queda en negativo se arrastra.
 *  5. La regla que vale es la que estaba en vigor el día del hecho: cambiar un
 *     porcentaje solo toca lo que pase después.
 *  6. Un Embajador DESACTIVADO no gana con lo que pase mientras lo está
 *     (`Pause`), en ninguno de los dos niveles. Lo que ganó antes se queda y
 *     se le paga igual; reactivarlo no devuelve lo de la pausa.
 */

/** Días de espera desde el hecho hasta que la comisión se puede cobrar. */
export const HOLD_DAYS = 15;
const DAY_MS = 24 * 60 * 60 * 1000;

export type FactType =
  | "lead"
  | "attended"
  | "purchase"
  | "renewal"
  | "refund"
  | "cancel";

export const FACT_TYPES: readonly FactType[] = [
  "lead",
  "attended",
  "purchase",
  "renewal",
  "refund",
  "cancel",
];

/** Lo que paga: una venta cobra un porcentaje; una cita, un importe fijo. */
export type RuleKind = "sale" | "visit";

export interface Fact {
  id: string;
  businessId: string;
  referralId: string;
  type: FactType;
  /** Centavos. Nulo en `lead` y en `attended`. */
  amountCents: number | null;
  /** 1 = primera compra, 2 = primera renovación... */
  paymentNumber: number | null;
  occurredAt: Date;
  /** Solo en `refund` / `cancel`: el hecho que deshacen. */
  originalId: string | null;
}

export interface Rule {
  businessId: string;
  level: 1 | 2;
  kind: RuleKind;
  fromPayment: number;
  /** Para `sale`. */
  percent: number | null;
  /** Para `visit`. */
  fixedCents: number | null;
  effectiveFrom: Date;
}

export interface Referral {
  id: string;
  businessId: string;
  ambassadorId: string;
}

export interface Payout {
  ambassadorId: string;
  amountCents: number;
  paidAt: Date;
}

/** Quién cobra el nivel 2 de cada Embajador: su patrocinador, o nadie. */
export type SponsorOf = (ambassadorId: string) => string | null;

/** Un tramo en que el Embajador estuvo desactivado. `to` nulo = sigue así. */
export interface Pause {
  from: Date;
  to: Date | null;
}

/** ¿Estaba desactivado en ese momento? El tramo incluye su inicio, no su fin. */
export function pausedAt(pauses: readonly Pause[] | null | undefined, at: Date): boolean {
  const t = at.getTime();
  return (pauses ?? []).some(
    (p) => t >= p.from.getTime() && (p.to === null || t < p.to.getTime()),
  );
}

/** Quién estaba desactivado cuándo. Por defecto, nadie. */
export type PausedAt = (ambassadorId: string, at: Date) => boolean;

export type LineStatus =
  /** Dentro de los 15 días. */
  | "waiting"
  /** Se puede cobrar y aún no se ha pagado. */
  | "ready"
  /** Cubierta por un pago. */
  | "paid"
  /** Reembolsada dentro de la espera: no cuenta. */
  | "annulled"
  /** Un reembolso después de la espera: se resta del siguiente pago. */
  | "deduction";

export interface Line {
  /** El hecho que la genera (para un descuento, el reembolso). */
  factId: string;
  /** El hecho de venta o cita al que pertenece. */
  sourceFactId: string;
  ambassadorId: string;
  level: 1 | 2;
  businessId: string;
  referralId: string;
  occurredAt: Date;
  payableFrom: Date;
  /** Porcentaje o importe fijo aplicado, para enseñarlo. */
  percent: number | null;
  fixedCents: number | null;
  /** Lo que mueve la línea. Negativo en un descuento. */
  amountCents: number;
  status: LineStatus;
}

export interface Summary {
  /** En espera: aún no se puede cobrar. */
  waitingCents: number;
  /** Lo que se puede cobrar ya. Negativo si un descuento pasa lo ganado. */
  availableCents: number;
  /** Todo lo pagado. */
  paidCents: number;
  /** Ganado de verdad: todo lo que no se anuló, esperando o no. */
  earnedCents: number;
  /** La próxima línea que sale de la espera. */
  next: { date: Date; amountCents: number } | null;
}

const kindOf = (type: FactType): RuleKind | null =>
  type === "purchase" || type === "renewal"
    ? "sale"
    : type === "attended"
      ? "visit"
      : null;

/**
 * La regla que vale para un hecho: del negocio, nivel y clase, en vigor el día
 * del hecho, y de entre ellas la de mayor `fromPayment` que no pase el número
 * de pago. A igualdad, la más reciente: así una regla nueva sustituye a la
 * anterior sin borrarla.
 */
export function ruleFor(
  rules: readonly Rule[],
  businessId: string,
  level: 1 | 2,
  kind: RuleKind,
  paymentNumber: number,
  at: Date,
): Rule | null {
  let best: Rule | null = null;
  for (const r of rules) {
    if (r.businessId !== businessId || r.level !== level || r.kind !== kind) continue;
    if (r.effectiveFrom.getTime() > at.getTime()) continue;
    if (r.fromPayment > paymentNumber) continue;
    if (
      !best ||
      r.fromPayment > best.fromPayment ||
      (r.fromPayment === best.fromPayment &&
        r.effectiveFrom.getTime() > best.effectiveFrom.getTime())
    ) {
      best = r;
    }
  }
  return best;
}

/** Un importe por un porcentaje, redondeado al centavo. */
const pct = (cents: number, percent: number) => Math.round((cents * percent) / 100);

/** El número de pago de un hecho: la compra es el 1, una renovación al menos el 2. */
const paymentOf = (f: Fact): number =>
  f.type === "renewal"
    ? Math.max(2, f.paymentNumber ?? 2)
    : Math.max(1, f.paymentNumber ?? 1);

interface RawLine extends Omit<Line, "status"> {
  /** En un descuento: la línea que deshace. */
  reverses?: RawLine;
}

/**
 * Las líneas que genera un hecho de venta o de cita, para los dos niveles.
 * Sin regla para un nivel, ese nivel no cobra: no hay comisión inventada.
 */
function earningLines(
  fact: Fact,
  ambassadorId: string,
  sponsorOf: SponsorOf,
  rules: readonly Rule[],
  isPaused: PausedAt,
): RawLine[] {
  const kind = kindOf(fact.type);
  if (!kind) return [];

  const earners: [1 | 2, string | null][] = [
    [1, ambassadorId],
    [2, sponsorOf(ambassadorId)],
  ];

  const out: RawLine[] = [];
  for (const [level, earner] of earners) {
    /* Nadie se cobra a sí mismo el nivel 2: un patrocinio circular (A invitó a
       B y alguien puso a B como patrocinador de A) no puede duplicar. */
    if (!earner || (level === 2 && earner === ambassadorId)) continue;
    /* Desactivado el día del hecho: ese nivel no cobra. */
    if (isPaused(earner, fact.occurredAt)) continue;

    const rule = ruleFor(rules, fact.businessId, level, kind, paymentOf(fact), fact.occurredAt);
    if (!rule) continue;

    const amountCents =
      kind === "sale"
        ? pct(Math.max(0, fact.amountCents ?? 0), rule.percent ?? 0)
        : Math.max(0, rule.fixedCents ?? 0);
    if (amountCents <= 0) continue;

    out.push({
      factId: fact.id,
      sourceFactId: fact.id,
      ambassadorId: earner,
      level,
      businessId: fact.businessId,
      referralId: fact.referralId,
      occurredAt: fact.occurredAt,
      payableFrom: new Date(fact.occurredAt.getTime() + HOLD_DAYS * DAY_MS),
      percent: kind === "sale" ? rule.percent : null,
      fixedCents: kind === "visit" ? rule.fixedCents : null,
      amountCents,
    });
  }
  return out;
}

/**
 * Todas las líneas de un conjunto de hechos, con su estado, para UN Embajador.
 *
 * Se le pasan los hechos de sus referidos (nivel 1) y los de los referidos de
 * su equipo (nivel 2): esta función decide qué le toca de cada uno.
 */
export function linesFor(
  ambassadorId: string,
  facts: readonly Fact[],
  referrals: readonly Referral[],
  rules: readonly Rule[],
  sponsorOf: SponsorOf,
  payouts: readonly Payout[],
  now: Date,
  isPaused: PausedAt = () => false,
): { lines: Line[]; summary: Summary } {
  const referralById = new Map(referrals.map((r) => [r.id, r]));
  const factById = new Map(facts.map((f) => [f.id, f]));

  /* 1. Las líneas de ganancia de cada venta o cita. */
  const earnings = new Map<string, RawLine[]>();
  for (const f of facts) {
    const ref = referralById.get(f.referralId);
    if (!ref) continue;
    const lines = earningLines(f, ref.ambassadorId, sponsorOf, rules, isPaused);
    if (lines.length) earnings.set(f.id, lines);
  }

  /* 2. Los reembolsos y cancelaciones, contra la línea que deshacen. Uno
     parcial resta su parte: reembolsar 30 de 100 resta el 30 % de la línea.
     Varios reembolsos de la misma venta nunca restan más que la línea. */
  const reversed = new Map<RawLine, number>();
  const deductions: RawLine[] = [];
  const ordered = [...facts].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());

  for (const f of ordered) {
    if (f.type !== "refund" && f.type !== "cancel") continue;
    const original = f.originalId ? factById.get(f.originalId) : undefined;
    if (!original) continue;

    for (const line of earnings.get(original.id) ?? []) {
      const already = reversed.get(line) ?? 0;
      const left = line.amountCents - already;
      if (left <= 0) continue;

      const share =
        f.type === "cancel" || !original.amountCents || f.amountCents == null
          ? left
          : Math.min(left, Math.round((line.amountCents * f.amountCents) / original.amountCents));
      if (share <= 0) continue;
      reversed.set(line, already + share);

      /* Dentro de la espera, la línea simplemente baja (o se anula entera).
         Después, es un descuento aparte que vale desde el día del reembolso. */
      if (f.occurredAt.getTime() >= line.payableFrom.getTime()) {
        deductions.push({
          ...line,
          factId: f.id,
          occurredAt: f.occurredAt,
          payableFrom: f.occurredAt,
          amountCents: -share,
          reverses: line,
        });
      }
    }
  }

  /* 3. Solo lo que es de este Embajador, con el importe ya neto. */
  type Draft = Omit<Line, "status"> & { status?: LineStatus };
  const mine: Draft[] = [];
  for (const lines of earnings.values()) {
    for (const line of lines) {
      if (line.ambassadorId !== ambassadorId) continue;
      const lateDeducted = deductions
        .filter((d) => d.reverses === line)
        .reduce((s, d) => s - d.amountCents, 0);
      /* Lo reembolsado dentro de la espera baja la línea; lo reembolsado
         después va en su descuento y la línea conserva su importe. */
      const net = line.amountCents - ((reversed.get(line) ?? 0) - lateDeducted);
      mine.push({
        ...line,
        amountCents: net,
        status: net <= 0 ? "annulled" : undefined,
      });
    }
  }
  for (const d of deductions) {
    if (d.ambassadorId !== ambassadorId) continue;
    const { reverses: _r, ...rest } = d;
    mine.push({ ...rest, status: "deduction" });
  }

  /* 4. Estados y saldo. Los pagos cubren las líneas por orden de vencimiento
     (las más antiguas primero), después de compensar los descuentos. */
  const nowMs = now.getTime();
  const paidCents = payouts
    .filter((p) => p.ambassadorId === ambassadorId)
    .reduce((s, p) => s + p.amountCents, 0);
  const deductionCents = mine
    .filter((l) => l.status === "deduction")
    .reduce((s, l) => s - l.amountCents, 0);

  let cover = paidCents + deductionCents;
  const payable = mine
    .filter((l) => !l.status && l.payableFrom.getTime() <= nowMs)
    .sort((a, b) => a.payableFrom.getTime() - b.payableFrom.getTime());
  for (const l of payable) {
    if (cover >= l.amountCents) {
      l.status = "paid";
      cover -= l.amountCents;
    } else {
      l.status = "ready";
    }
  }
  for (const l of mine) if (!l.status) l.status = "waiting";

  const lines = (mine as Line[]).sort(
    (a, b) => b.occurredAt.getTime() - a.occurredAt.getTime(),
  );

  const sum = (pred: (l: Line) => boolean) =>
    lines.filter(pred).reduce((s, l) => s + l.amountCents, 0);

  const waiting = lines
    .filter((l) => l.status === "waiting")
    .sort((a, b) => a.payableFrom.getTime() - b.payableFrom.getTime());
  const first = waiting[0];

  const payableTotal = sum(
    (l) => l.status === "ready" || l.status === "paid" || l.status === "deduction",
  );

  return {
    lines,
    summary: {
      waitingCents: sum((l) => l.status === "waiting"),
      availableCents: payableTotal - paidCents,
      paidCents,
      earnedCents: sum((l) => l.status !== "annulled"),
      next: first
        ? {
            date: first.payableFrom,
            amountCents: waiting
              .filter((l) => l.payableFrom.getTime() === first.payableFrom.getTime())
              .reduce((s, l) => s + l.amountCents, 0),
          }
        : null,
    },
  };
}
