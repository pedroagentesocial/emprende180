/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Lo que cada página del admin explica de sí misma (11-11-2026)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Cada sección del portal abre con lo mismo: su nombre, UNA frase de para qué
 * sirve, el botón de lo que se viene a hacer y un "Cómo funciona" de tres
 * pasos que se puede plegar. Se pidió porque nadie sabía qué se hacía en
 * cada pantalla. Los textos viven aquí, juntos, para que se lean como una
 * sola voz y se cambien en un sitio.
 */
import type { Txt } from "@i18n/idioma";

const t = (es: string, en: string): Txt => ({ es, en });

export interface PageGuide {
  purpose: Txt;
  steps: Txt[];
}

export const guideLabel = t("Cómo funciona", "How it works");

export const adminGuide = {
  people: {
    purpose: t(
      "Los alumnos de Emprende180. Cada alumno es Embajador: tiene su código y está dado de alta en clinics. Solo tú das de alta.",
      "Emprende180's students. Every student is an Ambassador: they have a code and are set up in clinics. Only you add people.",
    ),
    steps: [
      t("Pulsa «Dar de alta», escribe su correo y elige quién lo trajo, si alguien lo trajo.", "Press “Add a student”, type their email and pick who brought them, if anyone."),
      t("Al guardarlo ya es Embajador: recibe su código y queda dado de alta en clinics.", "Once saved they are an Ambassador: they get a code and are set up in clinics."),
      t("Quien se apunta en la web llega a «Pre-registros», sin acceso. Cuando se inscriba, «Dar acceso» lo hace alumno en un clic.", "Whoever signs up on the website lands in “Pre-registrations”, with no access. Once enrolled, “Give access” makes them a student in one click."),
    ],
  },
  ambassadors: {
    purpose: t(
      "Lo que gana cada alumno como Embajador: sus clientes, lo que se le debe y sus pagos.",
      "What each student earns as an Ambassador: their clients, what they are owed and their payouts.",
    ),
    steps: [
      t("Cuando un cliente suyo compra en Revivi o en una clínica, su comisión aparece aquí.", "When one of their clients buys at Revivi or a clinic, the commission shows up here."),
      t("La comisión espera 15 días y luego se puede cobrar. Quien lo trajo gana su parte (nivel 2).", "The commission waits 15 days and then can be paid. Whoever brought them earns a share (level 2)."),
      t("Abre su ficha para anotarle un pago, en dinero o en crédito Revivi.", "Open their page to record a payout, in cash or Revivi credit."),
    ],
  },
  businesses: {
    purpose: t(
      "Los negocios que los Embajadores recomiendan, de dónde llegan sus ventas y cuánto se paga por cada una.",
      "The businesses Ambassadors recommend, where their sales come from, and how much each one pays.",
    ),
    steps: [
      t("Da de alta cada negocio y elige su fuente: Clinics se lee solo, GHL manda un aviso.", "Add each business and pick its source: Clinics is read on its own, GHL sends a notice."),
      t("Ponle reglas: qué porcentaje o monto se paga por venta, renovación o cita.", "Give it rules: what percentage or amount a sale, renewal or visit pays."),
      t("Una regla nueva vale desde su fecha. Lo ya ganado no cambia.", "A new rule applies from its date. What was already earned does not change."),
    ],
  },
  coupons: {
    purpose: t(
      "Los códigos que alguien escribe al pedir información del curso. Dicen qué precio se le prometió y por qué canal llegó.",
      "The codes someone types when asking about the course. They tell which price was promised and which channel they came from.",
    ),
    steps: [
      t("Crea un cupón con su código y lo que promete, por ejemplo LAURA20.", "Create a coupon with its code and what it promises, for example LAURA20."),
      t("Quien llama ve el cupón en el aviso y en GHL. El cupón no cobra ni descuenta nada solo.", "Whoever calls sees it in the notice and in GHL. The coupon doesn't charge or discount anything by itself."),
      t("Compara cuántos lo pidieron con cuántos se dieron de alta.", "Compare how many asked with how many signed up."),
    ],
  },
  settings: {
    purpose: t(
      "Qué está conectado y qué falta. Aquí no se cambia nada: solo se revisa.",
      "What is connected and what is missing. Nothing is changed here: it's a check.",
    ),
    steps: [
      t("En verde, lo que ya funciona.", "In green, what already works."),
      t("En amarillo, lo que falta y el nombre de la configuración que hay que poner.", "In yellow, what is missing and the name of the setting to add."),
      t("Las claves se ponen en el servidor, nunca en esta pantalla.", "Keys are set on the server, never on this screen."),
    ],
  },
} satisfies Record<string, PageGuide>;

/** Los grupos del menú lateral del admin. */
export const navGroups = {
  people: t("Personas", "People"),
  ambassadors: t("Comisiones", "Commissions"),
  sales: t("Ventas", "Sales"),
  system: t("Sistema", "System"),
  /* Los del alumno (12-11-2026): sus secciones de Embajador y sus herramientas. */
  mine: t("Embajador", "Ambassador"),
  tools: t("Herramientas", "Tools"),
};

/** Textos de la página de inicio del admin. */
export const adminHome = {
  today: t("Hoy", "Today"),
  pendingTitle: t("Pendiente", "To do"),
  allClear: t("Todo al día. No hay nada pendiente.", "All clear. Nothing to do."),
  pendingPay: t("{n} Embajadores ya pueden cobrar · {monto}", "{n} Ambassadors can be paid · {monto}"),
  pendingPayOne: t("{nombre} ya puede cobrar · {monto}", "{nombre} can be paid · {monto}"),
  pendingPayCta: t("Pagar", "Pay"),
  pendingNeverIn: t("{n} alumnos todavía no han entrado", "{n} students haven't signed in yet"),
  pendingNeverInOne: t("1 alumno todavía no ha entrado", "1 student hasn't signed in yet"),
  pendingNeverInCta: t("Revisarlos", "Review"),
  pendingNoRules: t("{nombre} no tiene reglas de comisión", "{nombre} has no commission rules"),
  pendingNoRulesCta: t("Ponerlas", "Add them"),
  pendingSync: t("No se pudo leer clinics: {error}", "Couldn't read clinics: {error}"),
  pendingSyncCta: t("Revisar", "Check"),
  pendingNoBusiness: t("Todavía no hay ningún negocio dado de alta", "No business has been added yet"),
  pendingNoBusinessCta: t("Crear uno", "Add one"),
  statStudents: t("Alumnos", "Students"),
  statStudentsSub: t("{n} ya entraron", "{n} signed in"),
  statAmbassadors: t("Embajadores", "Ambassadors"),
  statAmbassadorsSub: t("{n} en pausa", "{n} paused"),
  statAmbassadorsSubNone: t("Todos activos", "All active"),
  statClients: t("Clientes referidos", "Referred clients"),
  statClientsSub: t("{n} ya compraron", "{n} have bought"),
  statToPay: t("Por pagar", "To pay"),
  statToPaySub: t("{monto} en espera", "{monto} waiting"),
  topTitle: t("Embajadores con más ganado", "Top Ambassadors"),
  topEmpty: t("Todavía no hay Embajadores. Actívalos desde Embajadores.", "No Ambassadors yet. Activate them in Ambassadors."),
  topClients: t("{n} clientes", "{n} clients"),
  topClientsOne: t("1 cliente", "1 client"),
  topAll: t("Ver todos", "See all"),
  activityTitle: t("Lo último que pasó", "Latest activity"),
  activityEmpty: t("Aún no hay movimiento.", "No activity yet."),
  actSignup: t("Alta de alumno: {nombre}", "New student: {nombre}"),
  actClient: t("Cliente nuevo de {nombre}", "New client for {nombre}"),
  actPayout: t("Pago a {nombre} · {monto}", "Payout to {nombre} · {monto}"),
  actSale: t("Venta de un cliente de {nombre} · {monto}", "Sale by a client of {nombre} · {monto}"),
  quickTitle: t("Acciones rápidas", "Quick actions"),
  quickAdd: t("Dar de alta alumno", "Add a student"),
  quickAmbassador: t("Ver comisiones", "See commissions"),
  pendingWeb: t("{n} pre-registros esperan acceso", "{n} pre-registrations are waiting for access"),
  pendingWebOne: t("1 pre-registro espera acceso", "1 pre-registration is waiting for access"),
  pendingWebCta: t("Verlos", "See them"),
  quickBusinesses: t("Reglas de comisión", "Commission rules"),
};
