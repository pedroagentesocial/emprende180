import type { Txt } from "@i18n/idioma";
import type { LineStatus } from "@lib/commissions";
import type { ReferralStage } from "@lib/ambassadorBook";
import type { PayoutMethod, ReferralChannel, BusinessSource } from "@lib/ambassadors";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TEXTOS DEL PORTAL DE EMBAJADORES (y de su administración)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Aparte de `studentArea.ts` porque es otro sitio con otra voz: el portal se
 * mira en el teléfono, rápido, y sus textos son cortos. Todo en los dos
 * idiomas, como el resto del proyecto.
 *
 * Sin rayas largas en ningún texto: el cliente las asocia con texto de IA.
 */

const t = (es: string, en: string): Txt => ({ es, en });

export const ambassadorCopy = {
  title: t("Mis referidos", "My referrals"),

  nav: {
    aria: t("Portal de Embajador", "Ambassador portal"),
    home: t("Inicio", "Home"),
    referrals: t("Referidos", "Referrals"),
    team: t("Equipo", "Team"),
    payouts: t("Pagos", "Payouts"),
    share: t("Compartir", "Share"),
    courses: t("Cursos", "Courses"),
  },

  home: {
    hello: t("Hola, {nombre}", "Hi, {nombre}"),
    available: t("Por cobrar", "Ready to collect"),
    owed: t("Saldo a descontar", "Balance to deduct"),
    owedHint: t(
      "Un reembolso después de pagarte. Se descuenta de tus próximas comisiones.",
      "A refund after you were paid. It comes off your next commissions.",
    ),
    waiting: t("En espera", "On hold"),
    paid: t("Cobrado", "Collected"),
    next: t("Próximo pago: {importe} el {fecha}", "Next payout: {importe} on {fecha}"),
    noNext: t("No tienes comisiones en espera.", "You have no commissions on hold."),
    weekly: t("Lo que ganaste, por semana", "What you earned, by week"),
    weeklyAria: t("Gráfica de lo ganado en las últimas 8 semanas", "Chart of earnings over the last 8 weeks"),
    byBusiness: t("Por negocio", "By business"),
    referralsCount: t("{n} referidos", "{n} referrals"),
    customersCount: t("{n} clientes", "{n} customers"),
    recent: t("Lo último", "Latest"),
    seeAll: t("Ver todos", "See all"),
    empty: t(
      "Todavía no tienes referidos. Comparte tu código y aquí verás a cada persona que llegue.",
      "You have no referrals yet. Share your code and you will see everyone who comes in here.",
    ),
    emptyCta: t("Compartir mi código", "Share my code"),
    noRules: t(
      "Las comisiones todavía no están configuradas. Tus referidos se guardan igual y se pagarán cuando estén.",
      "Commissions are not set up yet. Your referrals are saved anyway and will be paid once they are.",
    ),
  },

  referrals: {
    title: t("Mis referidos", "My referrals"),
    intro: t(
      "Cada persona que llegó con tu código. Sin su permiso no vemos su nombre, pero la comisión se cobra igual.",
      "Everyone who came with your code. Without their permission we don't see their name, but the commission is paid anyway.",
    ),
    all: t("Todos", "All"),
    client: t("Cliente #{n}", "Client #{n}"),
    since: t("Desde el {fecha}", "Since {fecha}"),
    sales: t("Compras: {n}", "Purchases: {n}"),
    earned: t("Ganado", "Earned"),
    empty: t("No hay referidos en este negocio todavía.", "No referrals at this business yet."),
    payableOn: t("Se paga el {fecha}", "Paid on {fecha}"),
    level2: t("Nivel 2", "Level 2"),
  },

  team: {
    title: t("Mi equipo", "My team"),
    intro: t(
      "Los Embajadores que invitaste. Por cada venta suya cobras una parte, sin que su cliente sea tuyo.",
      "The Ambassadors you invited. You earn a share of each of their sales, while their clients stay theirs.",
    ),
    member: t("{r} referidos · {c} clientes", "{r} referrals · {c} customers"),
    gave: t("Te ha generado", "Earned you"),
    empty: t(
      "Aún no tienes equipo. Cuando alguien se registre con tu código y lo activemos como Embajador, aparecerá aquí.",
      "You have no team yet. When someone signs up with your code and we activate them as an Ambassador, they will show up here.",
    ),
  },

  payouts: {
    title: t("Mis pagos", "My payouts"),
    intro: t(
      "Lo que ya te pagamos y lo que tienes por cobrar.",
      "What we have paid you and what is ready to collect.",
    ),
    history: t("Historial", "History"),
    empty: t("Todavía no hay pagos.", "No payouts yet."),
    pendingCredit: t("Pendiente de abonar en Revivi", "Waiting to be credited at Revivi"),
    movements: t("Movimientos", "Activity"),
  },

  share: {
    title: t("Compartir", "Share"),
    intro: t(
      "Tu código es el mismo en todos los negocios. Si alguien llega con él, es tuyo.",
      "Your code is the same at every business. Anyone who comes with it is yours.",
    ),
    yourCode: t("Tu código", "Your code"),
    copy: t("Copiar", "Copy"),
    copied: t("Copiado", "Copied"),
    share: t("Compartir", "Share"),
    noLink: t("Sin enlace propio: da tu código", "No link of its own: give your code"),
    install: t(
      "Para tenerlo a mano, agrega esta página a la pantalla de inicio de tu teléfono.",
      "To keep it handy, add this page to your phone's home screen.",
    ),
  },

  status: {
    waiting: t("En espera", "On hold"),
    ready: t("Por cobrar", "Ready"),
    paid: t("Pagada", "Paid"),
    annulled: t("Anulada", "Cancelled"),
    deduction: t("Descuento", "Deduction"),
  } satisfies Record<LineStatus, Txt>,

  stage: {
    lead: t("Lead", "Lead"),
    customer: t("Cliente", "Customer"),
    reversed: t("Reembolsado", "Refunded"),
  } satisfies Record<ReferralStage, Txt>,

  channel: {
    link: t("Enlace", "Link"),
    coupon: t("Cupón", "Coupon"),
    form: t("Formulario", "Form"),
    desk: t("En persona", "In person"),
    other: t("Otro", "Other"),
  } satisfies Record<ReferralChannel, Txt>,

  method: {
    cash: t("Dinero", "Money"),
    revivi_credit: t("Crédito Revivi", "Revivi credit"),
  } satisfies Record<PayoutMethod, Txt>,

  source: {
    ghl: t("GoHighLevel (webhook)", "GoHighLevel (webhook)"),
    clinics: t("Clinics", "Clinics"),
  } satisfies Record<BusinessSource, Txt>,

  /* ─── Administración ────────────────────────────────────────────────────── */
  admin: {
    navAmbassadors: t("Embajadores", "Ambassadors"),
    navBusinesses: t("Negocios", "Businesses"),

    title: t("Embajadores", "Ambassadors"),
    intro: t(
      "Quién es Embajador, cuánto tiene cada uno por cobrar y qué se le ha pagado.",
      "Who is an Ambassador, how much each one has to collect and what they have been paid.",
    ),
    activateTitle: t("Activar un Embajador", "Activate an Ambassador"),
    activateHint: t(
      "Desde que lo actives cobra comisiones. Su patrocinador (nivel 2) es quien lo invitó, si lo hubo; puedes cambiarlo aquí.",
      "From activation on they earn commissions. Their sponsor (level 2) is whoever invited them, if anyone; you can change it here.",
    ),
    person: t("Persona", "Person"),
    code: t("Código", "Code"),
    codeHint: t("Letras y números. Vacío = se genera solo.", "Letters and numbers. Empty = generated."),
    sponsor: t("Patrocinador", "Sponsor"),
    noSponsor: t("Sin patrocinador", "No sponsor"),
    sponsorInvited: t("Quien lo invitó", "Whoever invited them"),
    colName: t("Nombre", "Name"),
    colBusiness: t("Negocio", "Business"),
    colSince: t("Desde", "Since"),
    activate: t("Activar", "Activate"),
    noCandidates: t("No hay nadie por activar.", "Nobody left to activate."),
    listTitle: t("Embajadores activos", "Active Ambassadors"),
    colAmbassador: t("Embajador", "Ambassador"),
    colReferrals: t("Referidos", "Referrals"),
    colWaiting: t("En espera", "On hold"),
    colAvailable: t("Por cobrar", "Ready"),
    colPaid: t("Pagado", "Paid"),
    open: t("Abrir", "Open"),
    empty: t("Todavía no hay Embajadores activos.", "No active Ambassadors yet."),
    back: t("Volver a Embajadores", "Back to Ambassadors"),
    payoutTitle: t("Anotar un pago", "Record a payout"),
    payoutHint: t(
      "Se anota lo que ya se pagó por fuera. El crédito de Revivi queda pendiente de abonar en clinics hasta que esa conexión exista.",
      "Record what was already paid outside. Revivi credit stays pending in clinics until that connection exists.",
    ),
    amount: t("Importe (USD)", "Amount (USD)"),
    method: t("Método", "Method"),
    note: t("Nota", "Note"),
    record: t("Anotar pago", "Record payout"),
    sponsorTitle: t("Cambiar patrocinador", "Change sponsor"),
    sponsorHint: t(
      "Solo afecta a las ventas que pasen después. Lo ya ganado no se mueve.",
      "Only affects sales from now on. What was already earned stays.",
    ),
    save: t("Guardar", "Save"),

    noticeActivated: t("{nombre} ya es Embajador, con el código {codigo}.", "{nombre} is now an Ambassador, with code {codigo}."),
    noticeCodeTaken: t("Ese código ya lo tiene otra persona.", "Someone else already has that code."),
    noticeBadCode: t("El código tiene que tener entre 3 y 20 letras o números.", "The code needs 3 to 20 letters or numbers."),
    noticeBadAmount: t("Escribe un importe mayor que cero.", "Enter an amount greater than zero."),
    noticePaid: t("Pago anotado.", "Payout recorded."),
    noticeSponsor: t("Patrocinador cambiado.", "Sponsor changed."),
    noticeSelfSponsor: t("Nadie puede ser su propio patrocinador.", "Nobody can be their own sponsor."),

    /* Negocios */
    bizTitle: t("Negocios", "Businesses"),
    bizIntro: t(
      "Cada negocio que nos manda hechos de sus clientes, y las reglas de comisión de cada uno.",
      "Each business that sends us facts about its clients, and each one's commission rules.",
    ),
    bizNew: t("Nuevo negocio", "New business"),
    bizName: t("Nombre", "Name"),
    bizSlug: t("Identificador", "Identifier"),
    bizSlugHint: t("Va en la dirección del webhook: lira-medical", "Goes in the webhook address: lira-medical"),
    bizSource: t("De dónde llegan los hechos", "Where the facts come from"),
    bizLink: t("Enlace del Embajador", "Ambassador link"),
    bizLinkHint: t("Con {codigo} donde va el código. Opcional.", "With {codigo} where the code goes. Optional."),
    bizCreate: t("Crear negocio", "Create business"),
    bizActive: t("Activo", "Active"),
    bizInactive: t("Pausado", "Paused"),
    bizWebhook: t("Dirección del webhook", "Webhook address"),
    bizSecret: t("Secreto", "Secret"),
    bizSecretNone: t("Sin secreto: el webhook no acepta nada todavía.", "No secret: the webhook accepts nothing yet."),
    bizSecretSet: t("Creado el {fecha}", "Created on {fecha}"),
    bizSecretNew: t("Crear secreto nuevo", "Create new secret"),
    bizSecretOnce: t(
      "Cópialo ahora y pégalo en el workflow de GHL (cabecera Authorization: Bearer ...). No se vuelve a mostrar.",
      "Copy it now and paste it into the GHL workflow (header Authorization: Bearer ...). It is not shown again.",
    ),
    bizSecretReplaces: t("El secreto anterior deja de funcionar.", "The previous secret stops working."),
    bizSave: t("Guardar cambios", "Save changes"),
    bizToggleOn: t("Reactivar", "Reactivate"),
    bizToggleOff: t("Pausar", "Pause"),
    bizEmpty: t("Todavía no hay negocios.", "No businesses yet."),

    rulesTitle: t("Reglas de comisión", "Commission rules"),
    rulesHint: t(
      "Las reglas no se editan: una nueva sustituye a la anterior desde su fecha, y lo ya ganado no cambia.",
      "Rules are never edited: a new one replaces the previous one from its date, and what was earned stays.",
    ),
    rulesNone: t("Sin reglas: este negocio aún no paga comisión.", "No rules: this business pays no commission yet."),
    ruleLevel: t("Nivel", "Level"),
    ruleLevel1: t("1 · quien trajo al cliente", "1 · who brought the client"),
    ruleLevel2: t("2 · su patrocinador", "2 · their sponsor"),
    ruleKind: t("Por", "For"),
    ruleKindSale: t("Venta (compra o renovación)", "Sale (purchase or renewal)"),
    ruleKindVisit: t("Cita asistida", "Attended visit"),
    ruleFrom: t("Desde el pago número", "From payment number"),
    ruleFromHint: t("1 = primera compra, 2 = primera renovación...", "1 = first purchase, 2 = first renewal..."),
    rulePercent: t("Porcentaje (%)", "Percent (%)"),
    ruleFixed: t("Importe fijo (USD)", "Fixed amount (USD)"),
    ruleFromDate: t("Vigente desde", "Effective from"),
    ruleAdd: t("Añadir regla", "Add rule"),
    ruleRow: t("Nivel {nivel} · {clase} · desde el pago {pago}: {valor}", "Level {nivel} · {clase} · from payment {pago}: {valor}"),
    ruleSince: t("desde el {fecha}", "since {fecha}"),
    ruleReplaced: t("sustituida", "replaced"),

    noticeBizCreated: t("Negocio creado. Ahora crea su secreto para el webhook.", "Business created. Now create its webhook secret."),
    noticeBizExists: t("Ya hay un negocio con ese identificador.", "There is already a business with that identifier."),
    noticeBizBad: t("Falta el nombre o el identificador.", "Name or identifier is missing."),
    noticeBizSaved: t("Cambios guardados.", "Changes saved."),
    noticeRuleAdded: t("Regla añadida.", "Rule added."),
    noticeRuleBad: t(
      "Revisa la regla: una venta necesita un porcentaje entre 0 y 100, y una cita un importe fijo.",
      "Check the rule: a sale needs a percent between 0 and 100, and a visit a fixed amount.",
    ),
  },
} as const;
