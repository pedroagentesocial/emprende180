/**
 * Las reglas del ticket "Reparto de comisiones", una prueba por regla.
 * `npm test` (Node corre TypeScript sin compilar desde la versión 22.6).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  HOLD_DAYS,
  linesFor,
  ruleFor,
  type Fact,
  type Payout,
  type Referral,
  type Rule,
} from "../src/lib/commissions.ts";

const DAY = 24 * 60 * 60 * 1000;
const T0 = new Date("2026-11-01T12:00:00Z");
const at = (days: number) => new Date(T0.getTime() + days * DAY);

const LIRA = "lira";
const ANA = "ana"; // Embajador 1 de Bea
const BEA = "bea"; // invitada por Ana
const sponsorOf = (id: string) => (id === BEA ? ANA : null);

const rules: Rule[] = [
  { businessId: LIRA, level: 1, kind: "sale", fromPayment: 1, percent: 20, fixedCents: null, effectiveFrom: at(-100) },
  { businessId: LIRA, level: 1, kind: "sale", fromPayment: 2, percent: 10, fixedCents: null, effectiveFrom: at(-100) },
  { businessId: LIRA, level: 2, kind: "sale", fromPayment: 1, percent: 5, fixedCents: null, effectiveFrom: at(-100) },
  { businessId: LIRA, level: 1, kind: "visit", fromPayment: 1, percent: null, fixedCents: 2500, effectiveFrom: at(-100) },
];

const referrals: Referral[] = [
  { id: "r-ana", businessId: LIRA, ambassadorId: ANA },
  { id: "r-bea", businessId: LIRA, ambassadorId: BEA },
];

let n = 0;
const fact = (p: Partial<Fact> & Pick<Fact, "type" | "referralId">): Fact => ({
  id: `f${++n}`,
  businessId: LIRA,
  amountCents: null,
  paymentNumber: null,
  occurredAt: T0,
  originalId: null,
  ...p,
});

const run = (who: string, facts: Fact[], now: Date, payouts: Payout[] = []) =>
  linesFor(who, facts, referrals, rules, sponsorOf, payouts, now);

test("una compra espera 15 días y después se puede cobrar", () => {
  const facts = [fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000 })];

  const before = run(ANA, facts, at(HOLD_DAYS - 1));
  assert.equal(before.lines[0]!.status, "waiting");
  assert.equal(before.summary.waitingCents, 2_000);
  assert.equal(before.summary.availableCents, 0);
  assert.deepEqual(before.summary.next?.date, at(HOLD_DAYS));

  const after = run(ANA, facts, at(HOLD_DAYS));
  assert.equal(after.lines[0]!.status, "ready");
  assert.equal(after.summary.availableCents, 2_000);
});

test("la venta de alguien de tu equipo te da el nivel 2", () => {
  const facts = [fact({ type: "purchase", referralId: "r-bea", amountCents: 10_000 })];
  const ana = run(ANA, facts, at(20));
  assert.equal(ana.lines.length, 1);
  assert.equal(ana.lines[0]!.level, 2);
  assert.equal(ana.lines[0]!.amountCents, 500);
  const bea = run(BEA, facts, at(20));
  assert.equal(bea.lines[0]!.amountCents, 2_000);
});

test("las renovaciones cobran el porcentaje que baja", () => {
  const facts = [
    fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000 }),
    fact({ type: "renewal", referralId: "r-ana", amountCents: 10_000, paymentNumber: 2, occurredAt: at(30) }),
  ];
  const { lines } = run(ANA, facts, at(60));
  assert.deepEqual(
    lines.map((l) => l.amountCents).sort((a, b) => a - b),
    [1_000, 2_000],
  );
});

test("una cita asistida cobra el importe fijo", () => {
  const { lines } = run(ANA, [fact({ type: "attended", referralId: "r-ana" })], at(20));
  assert.equal(lines[0]!.amountCents, 2_500);
});

test("un reembolso dentro de la espera anula la comisión", () => {
  const sale = fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000 });
  const refund = fact({ type: "refund", referralId: "r-ana", amountCents: 10_000, originalId: sale.id, occurredAt: at(5) });
  const { lines, summary } = run(ANA, [sale, refund], at(30));
  assert.equal(lines.length, 1);
  assert.equal(lines[0]!.status, "annulled");
  assert.equal(summary.availableCents, 0);
  assert.equal(summary.earnedCents, 0);
});

test("un reembolso después de pagar se descuenta del siguiente pago", () => {
  const sale = fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000 });
  const refund = fact({ type: "refund", referralId: "r-ana", amountCents: 10_000, originalId: sale.id, occurredAt: at(20) });
  const paid: Payout[] = [{ ambassadorId: ANA, amountCents: 2_000, paidAt: at(16) }];

  const { lines, summary } = run(ANA, [sale, refund], at(21), paid);
  assert.equal(lines.find((l) => l.status === "deduction")?.amountCents, -2_000);
  /* Ya cobró los 2 000 y luego se reembolsó: queda a deber 2 000. */
  assert.equal(summary.availableCents, -2_000);

  /* La siguiente venta lo cubre antes de dar nada. */
  const next = fact({ type: "purchase", referralId: "r-ana", amountCents: 15_000, occurredAt: at(22) });
  const later = run(ANA, [sale, refund, next], at(40), paid);
  assert.equal(later.summary.availableCents, 1_000);
});

test("un reembolso parcial resta solo su parte", () => {
  const sale = fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000 });
  const refund = fact({ type: "refund", referralId: "r-ana", amountCents: 3_000, originalId: sale.id, occurredAt: at(2) });
  const { lines } = run(ANA, [sale, refund], at(30));
  assert.equal(lines[0]!.amountCents, 1_400);
});

test("cambiar un porcentaje no toca lo que ya pasó", () => {
  const newer: Rule[] = [
    ...rules,
    { businessId: LIRA, level: 1, kind: "sale", fromPayment: 1, percent: 30, fixedCents: null, effectiveFrom: at(10) },
  ];
  assert.equal(ruleFor(newer, LIRA, 1, "sale", 1, at(5))?.percent, 20);
  assert.equal(ruleFor(newer, LIRA, 1, "sale", 1, at(11))?.percent, 30);
});

test("sin regla no hay comisión inventada", () => {
  const facts = [fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000, businessId: "otro" })];
  const refs: Referral[] = [{ id: "r-ana", businessId: "otro", ambassadorId: ANA }];
  const { lines } = linesFor(ANA, facts, refs, rules, sponsorOf, [], at(30));
  assert.equal(lines.length, 0);
});

test("los pagos marcan como pagadas las líneas más antiguas", () => {
  const facts = [
    fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000 }),
    fact({ type: "purchase", referralId: "r-ana", amountCents: 10_000, occurredAt: at(1) }),
  ];
  const { lines, summary } = run(ANA, facts, at(30), [{ ambassadorId: ANA, amountCents: 2_000, paidAt: at(20) }]);
  const byDate = [...lines].sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
  assert.equal(byDate[0]!.status, "paid");
  assert.equal(byDate[1]!.status, "ready");
  assert.equal(summary.availableCents, 2_000);
  assert.equal(summary.paidCents, 2_000);
});
