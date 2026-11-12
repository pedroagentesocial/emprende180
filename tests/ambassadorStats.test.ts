/**
 * Movimientos, mensualidades, mes a mes y totales del Embajador (12-11-2026).
 * `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { linesFor, type Rule } from "../src/lib/commissions.ts";
import { reversedSales, statsFor } from "../src/lib/ambassadorStats.ts";

const DAY = 86_400_000;
const NOW = new Date("2026-11-12T12:00:00Z");
const ago = (d: number) => new Date(NOW.getTime() - d * DAY);

const LIRA = "lira";
const ANA = "ana";
const BEA = "bea"; // del equipo de Ana

const rules: Rule[] = [
  { businessId: LIRA, level: 1, kind: "sale", fromPayment: 1, percent: 20, fixedCents: null, effectiveFrom: ago(400) },
  { businessId: LIRA, level: 1, kind: "sale", fromPayment: 2, percent: 10, fixedCents: null, effectiveFrom: ago(400) },
  { businessId: LIRA, level: 2, kind: "sale", fromPayment: 1, percent: 5, fixedCents: null, effectiveFrom: ago(400) },
];

const referrals = [
  { id: "r1", businessId: LIRA, ambassadorId: ANA, firstContactAt: ago(100) },
  { id: "r2", businessId: LIRA, ambassadorId: ANA, firstContactAt: ago(40) },
  { id: "r3", businessId: LIRA, ambassadorId: ANA, firstContactAt: ago(5) },
  { id: "t1", businessId: LIRA, ambassadorId: BEA, firstContactAt: ago(30) },
];

let n = 0;
const fact = (referralId: string, type: string, days: number, amountCents: number | null, paymentNumber: number | null = null, originalId: string | null = null) => ({
  id: `f${++n}`,
  businessId: LIRA,
  referralId,
  type,
  amountCents,
  paymentNumber,
  occurredAt: ago(days),
  originalId,
  externalId: `e${n}`,
  receivedAt: ago(days),
});

/* r1: mensualidad de $100 al día (cobros a 90, 60, 30 y 5 días).
   r2: compra de $300 reembolsada entera dentro de la espera.
   r3: solo contacto. t1: una venta de Bea, nivel 2 para Ana. */
const facts = [
  fact("r1", "purchase", 90, 10_000, 1),
  fact("r1", "renewal", 60, 10_000, 2),
  fact("r1", "renewal", 30, 10_000, 3),
  fact("r1", "renewal", 5, 10_000, 4),
  fact("r2", "purchase", 38, 30_000, 1),
];
facts.push(fact("r2", "refund", 35, 30_000, null, facts[4]!.id));
facts.push(fact("t1", "purchase", 20, 20_000, 1));

const payouts = [{ id: "p1", ambassadorId: ANA, method: "cash" as const, amountCents: 2_000, paidAt: ago(10), note: null, clinicsRef: null, recordedBy: null }];

const { lines } = linesFor(
  ANA,
  facts as never,
  referrals as never,
  rules,
  (id) => (id === BEA ? ANA : null),
  payouts,
  NOW,
  () => false,
);

const ana = { id: ANA, name: "Ana", lastName: null, email: "ana@x.com", createdAt: ago(200), ambassadorSince: ago(100) } as never;
const bea = { id: BEA, name: "Bea", lastName: "Luna", email: "bea@x.com" } as never;

const stats = statsFor({
  ambassador: ana,
  now: NOW,
  businesses: [{ id: LIRA, name: "Lira Medical" }] as never,
  own: [
    { id: "r1", number: 1, businessId: LIRA, firstContactAt: ago(100) },
    { id: "r2", number: 2, businessId: LIRA, firstContactAt: ago(40) },
    { id: "r3", number: 3, businessId: LIRA, firstContactAt: ago(5) },
  ],
  facts: facts as never,
  lines,
  payouts,
  ownerOf: (id) => (id === "t1" ? bea : null),
});

test("un reembolso entero deshace la venta; uno parcial no", () => {
  const sale = fact("x", "purchase", 3, 10_000, 1);
  const partial = fact("x", "refund", 2, 4_000, null, sale.id);
  assert.equal(reversedSales([sale, partial] as never).has(sale.id), false);
  const full = fact("x", "refund", 2, 10_000, null, sale.id);
  assert.equal(reversedSales([sale, full] as never).has(sale.id), true);
});

test("cada venta, renovación, reembolso y pago es un movimiento, del más reciente al más antiguo", () => {
  const kinds = stats.transactions.map((t) => t.kind);
  assert.ok(kinds.includes("payout"));
  assert.ok(kinds.includes("refund"));
  assert.equal(kinds.filter((k) => k === "renewal").length, 3);
  for (let i = 1; i < stats.transactions.length; i++) {
    assert.ok(stats.transactions[i - 1]!.at >= stats.transactions[i]!.at);
  }
});

test("el reembolso dentro de la espera anula la comisión y se ve como movimiento sin comisión", () => {
  const refund = stats.transactions.find((t) => t.kind === "refund")!;
  assert.equal(refund.commissionCents, 0);
  assert.equal(refund.clientNumber, 2);
  const sale = stats.transactions.find((t) => t.kind === "purchase" && t.clientNumber === 2)!;
  assert.equal(sale.status, "annulled");
});

test("una venta del equipo es nivel 2 y lleva el nombre del Embajador, nunca el del cliente", () => {
  const team = stats.transactions.find((t) => t.level === 2)!;
  assert.equal(team.teamMember, "Bea Luna");
  assert.equal(team.clientNumber, null);
  assert.equal(team.commissionCents, 1_000); // 5% de $200
});

test("una mensualidad al día dice cuánto deja al mes y estima el próximo cobro", () => {
  assert.equal(stats.recurring.length, 1);
  const r = stats.recurring[0]!;
  assert.equal(r.state, "active");
  assert.equal(r.payments, 4);
  assert.equal(r.lastCommissionCents, 1_000); // 10% de $100
  assert.equal(r.nextAt!.getTime(), ago(5).getTime() + 30 * DAY);
  assert.equal(stats.lifetime.recurringMonthlyCents, 1_000);
});

test("una mensualidad sin cobro en 40 días está atrasada, y en 70, parada", () => {
  const mk = (last: number) =>
    statsFor({
      ambassador: ana,
      now: NOW,
      businesses: [],
      own: [{ id: "m", number: 1, businessId: LIRA, firstContactAt: ago(200) }],
      facts: [fact("m", "purchase", last + 30, 5_000, 1), fact("m", "renewal", last, 5_000, 2)] as never,
      lines: [],
      payouts: [],
      ownerOf: () => null,
    }).recurring[0]!.state;
  assert.equal(mk(40), "late");
  assert.equal(mk(70), "stopped");
});

test("mes a mes cubre desde el alta hasta hoy y el acumulado cuadra con lo ganado", () => {
  assert.ok(stats.monthly.length >= 4);
  assert.equal(stats.monthly[0]!.monthStart.getUTCMonth(), ago(100).getUTCMonth());
  const last = stats.monthly.at(-1)!;
  assert.equal(last.cumulativeCents, stats.lifetime.earnedCents);
  assert.equal(stats.monthly.reduce((s, m) => s + m.paidCents, 0), 2_000);
});

test("los totales desde el alta: clientes, conversión, ventas y ganado", () => {
  const l = stats.lifetime;
  assert.equal(l.referrals, 3);
  assert.equal(l.customers, 1); // r2 se reembolsó entera, r3 no compró
  assert.equal(l.conversionPct, 33);
  assert.equal(l.salesCents, 40_000); // 4 cobros de $100; la compra reembolsada no cuenta
  assert.equal(l.ownEarnedCents, 2_000 + 3 * 1_000); // 20% de la primera, 10% de 3 renovaciones
  assert.equal(l.teamEarnedCents, 1_000);
  assert.equal(l.paidCents, 2_000);
});
