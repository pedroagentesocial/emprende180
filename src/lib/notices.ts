import type { NombreIcono } from "@components/ui/Icono.astro";
import { ambassadorCopy } from "@config/ambassadorArea";
import type { Book } from "@lib/ambassadorBook";
import { money } from "@lib/ambassadorFormat";
import { repo, type Student } from "@lib/data";
import { canAdminister, isPreRegistered } from "@lib/permissions";
import { profilePercent } from "@lib/profile";
import { construirTxt, LOCALES, type Txt } from "@i18n/idioma";
import { interpolar } from "@i18n/formato";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOS AVISOS DE LA CAMPANA (12-11-2026)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * No se guardan: salen de lo que ya hay (las cuentas del Embajador, los
 * pre-registros, su perfil) cada vez que se pinta una página. Así no hay una
 * tabla de avisos que se quede desfasada de la realidad, y un aviso
 * desaparece solo cuando deja de ser verdad (un perfil completo ya no pide
 * completarse).
 *
 * Lo único que se recuerda es CUÁNDO abrió la campana por última vez, y eso
 * lo guarda su navegador: es una comodidad de quien mira (el número rojo), no
 * un dato que haga falta en ningún otro sitio.
 *
 * ⚠️ SIN NOMBRES DE CLIENTES: "Cliente #N", como en el resto del portal.
 */
export type NoticeTone = "brand" | "success" | "warning" | "danger" | "neutral";

export interface Notice {
  id: string;
  at: Date;
  icon: NombreIcono;
  tone: NoticeTone;
  title: Txt;
  body?: Txt;
  href?: string;
  /** Arriba del todo y sin contar como nuevo: una tarea pendiente, no un hecho. */
  pinned?: boolean;
}

const t = (es: string, en: string): Txt => ({ es, en });
const fill = (v: Txt, vars: Record<string, string | number | Txt>): Txt =>
  construirTxt((l) => interpolar(v[l], Object.fromEntries(Object.entries(vars).map(([k, x]) => [k, typeof x === "object" ? x[l] : x]))));

const DAY = 86_400_000;
const MAX = 15;

const copy = {
  profile: t("Completa tu perfil", "Complete your profile"),
  profileBody: t("Lo tienes al {pct}%. Te toma un minuto.", "It is {pct}% done. It takes a minute."),
  sale: t("Nueva comisión: {monto}", "New commission: {monto}"),
  saleBody: t("{tipo} de {cliente} en {negocio}", "{tipo} by {cliente} at {negocio}"),
  team: t("Tu equipo vendió: {monto}", "Your team made a sale: {monto}"),
  teamBody: t("{nombre} en {negocio}", "{nombre} at {negocio}"),
  ready: t("Ya puedes cobrar {monto}", "{monto} is ready to collect"),
  readyBody: t("Pasaron los 15 días de espera.", "The 15-day hold is over."),
  payout: t("Te pagamos {monto}", "We paid you {monto}"),
  refund: t("Reembolso de {cliente}", "Refund from {cliente}"),
  refundBody: t("Esa comisión ya no cuenta.", "That commission no longer counts."),
  late: t("La mensualidad de {cliente} no ha llegado", "{cliente}'s monthly payment hasn't come in"),
  lateBody: t("Tocaba el {fecha}. Quizá quieras escribirle.", "It was due on {fecha}. You may want to reach out."),
  joined: t("{nombre} se unió a tu equipo", "{nombre} joined your team"),
  joinedBody: t("Cada venta suya te deja tu parte.", "Each of their sales earns you a share."),
  preReg: t("{n} pre-registros esperan acceso", "{n} pre-registrations are waiting for access"),
  preRegOne: t("1 pre-registro espera acceso", "1 pre-registration is waiting for access"),
  neverIn: t("{n} alumnos no han entrado todavía", "{n} students haven't signed in yet"),
  neverInOne: t("1 alumno no ha entrado todavía", "1 student hasn't signed in yet"),
};

const short = (d: Date): Txt =>
  construirTxt((l) => new Intl.DateTimeFormat(LOCALES[l], { day: "numeric", month: "short" }).format(d));

export async function noticesFor(student: Student, book: Book | null, now = new Date()): Promise<Notice[]> {
  const out: Notice[] = [];
  const ac = ambassadorCopy;

  const pct = profilePercent(student);
  if (pct < 100) {
    out.push({
      id: "profile",
      at: student.createdAt,
      icon: "usuario",
      tone: "brand",
      title: copy.profile,
      body: fill(copy.profileBody, { pct }),
      href: "/student/profile",
      pinned: true,
    });
  }

  if (book) {
    const recent = (d: Date, days: number) => now.getTime() - d.getTime() <= days * DAY;
    const client = (n: number | null) => fill(ac.referrals.client, { n: n ?? "?" });

    for (const tx of book.stats.transactions) {
      if (tx.kind === "payout" && recent(tx.at, 60)) {
        out.push({ id: tx.id, at: tx.at, icon: "check", tone: "success", title: fill(copy.payout, { monto: money(tx.commissionCents) }), body: tx.method ? ac.method[tx.method] : undefined, href: "/student/ambassador/payouts?f=payouts#movimientos" });
      } else if ((tx.kind === "purchase" || tx.kind === "renewal" || tx.kind === "attended") && tx.commissionCents > 0 && recent(tx.at, 30)) {
        out.push(
          tx.level === 2
            ? { id: tx.id, at: tx.at, icon: "red", tone: "brand", title: fill(copy.team, { monto: money(tx.commissionCents) }), body: fill(copy.teamBody, { nombre: tx.teamMember ?? "", negocio: tx.businessName ?? "" }), href: "/student/ambassador/team" }
            : { id: tx.id, at: tx.at, icon: tx.kind === "renewal" ? "actualizar" : "billete", tone: "brand", title: fill(copy.sale, { monto: money(tx.commissionCents) }), body: fill(copy.saleBody, { tipo: ac.stats.kind[tx.kind], cliente: client(tx.clientNumber), negocio: tx.businessName ?? "" }), href: "/student/ambassador/payouts#movimientos" },
        );
      } else if ((tx.kind === "refund" || tx.kind === "cancel") && tx.level !== 2 && recent(tx.at, 30)) {
        out.push({ id: tx.id, at: tx.at, icon: "giro", tone: "danger", title: fill(copy.refund, { cliente: client(tx.clientNumber) }), body: copy.refundBody, href: "/student/ambassador/payouts?f=refunds#movimientos" });
      }
    }

    /* Lo que salió de la espera en las dos últimas semanas, en un solo aviso
       por día: varias comisiones que se liberan juntas son una buena noticia,
       no cinco. */
    const released = new Map<string, { at: Date; cents: number }>();
    for (const l of book.lines) {
      if ((l.status === "ready" || l.status === "paid") && l.payableFrom <= now && recent(l.payableFrom, 14)) {
        const key = l.payableFrom.toISOString().slice(0, 10);
        const g = released.get(key) ?? { at: l.payableFrom, cents: 0 };
        g.cents += l.amountCents;
        released.set(key, g);
      }
    }
    for (const [key, g] of released) {
      out.push({ id: `ready:${key}`, at: g.at, icon: "billete", tone: "success", title: fill(copy.ready, { monto: money(g.cents) }), body: copy.readyBody, href: "/student/ambassador/payouts?s=ready#movimientos" });
    }

    for (const r of book.stats.recurring) {
      if (r.state === "late" && r.nextAt) {
        out.push({ id: `late:${r.referralId}`, at: r.nextAt, icon: "reloj", tone: "warning", title: fill(copy.late, { cliente: client(r.clientNumber) }), body: fill(copy.lateBody, { fecha: short(r.nextAt) }), href: "/student/ambassador/payouts#mensualidades" });
      }
    }

    for (const m of book.team) {
      const since = m.student.ambassadorSince;
      if (since && recent(since, 60)) {
        const nombre = [m.student.name, m.student.lastName].filter(Boolean).join(" ") || m.student.email;
        out.push({ id: `team:${m.student.id}`, at: since, icon: "personas", tone: "brand", title: fill(copy.joined, { nombre }), body: copy.joinedBody, href: "/student/ambassador/team" });
      }
    }
  }

  if (canAdminister(student)) {
    const everyone = await repo().listStudents();
    const pre = everyone.filter((s) => s.active && isPreRegistered(s));
    if (pre.length) {
      const last = pre.reduce((m, s) => (s.createdAt > m ? s.createdAt : m), pre[0]!.createdAt);
      out.push({ id: `pre:${pre.length}:${last.getTime()}`, at: last, icon: "personas", tone: "warning", title: pre.length === 1 ? copy.preRegOne : fill(copy.preReg, { n: pre.length }), href: "/student/people?ver=pre" });
    }
    const never = everyone.filter((s) => s.active && s.role === "student" && !s.lastSignIn && !isPreRegistered(s));
    if (never.length) {
      const newest = never.reduce((m, s) => (s.createdAt > m ? s.createdAt : m), never[0]!.createdAt);
      out.push({ id: `never:${never.length}`, at: newest, icon: "reloj", tone: "neutral", title: never.length === 1 ? copy.neverInOne : fill(copy.neverIn, { n: never.length }), href: "/student/people?ver=sin-entrar" });
    }
  }

  return out
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.at.getTime() - a.at.getTime())
    .slice(0, MAX);
}
