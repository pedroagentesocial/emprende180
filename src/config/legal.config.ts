import type { Txt } from "@i18n/idioma";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TEXTOS LEGALES (bilingües)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ⚠️  ESTO NO ES ASESORAMIENTO JURÍDICO Y NO ESTÁ LISTO PARA PUBLICAR.
 *
 * Es el ESQUELETO de los documentos: las secciones que un aviso de privacidad
 * y unos términos necesitan tener, redactadas en lo genérico, con marcadores
 * `[COMPLETAR: …]` en todo lo que solo tú sabes.
 *
 * Antes de publicar:
 *   1. Rellena TODOS los `[COMPLETAR: …]` en LOS DOS IDIOMAS. La página los
 *      resalta en ámbar, así que no se pueden colar sin verlos.
 *   2. Que lo revise un abogado del país donde tributas. **Y que revise las
 *      dos versiones**: un aviso de privacidad en inglés que diga algo
 *      distinto del español es peor que no tener versión en inglés.
 *
 * Encargados de tratamiento que YA están en uso y que el aviso debe declarar:
 *   · Vercel Inc.       — alojamiento y logs de servidor (EE. UU.)
 *   · Resend            — envío de los emails del mini-curso (EE. UU.)
 *   · Google Analytics  — solo si el visitante lo acepta en el banner
 *   · La pasarela de pago que acabes conectando
 */

export interface SeccionLegal {
  titulo: Txt;
  parrafos?: Txt[];
  lista?: Txt[];
}

export interface DocumentoLegal {
  /** Slug de la URL: /legal/<slug>. No se traduce: una URL por documento. */
  slug: string;
  titulo: Txt;
  resumen: Txt;
  /** Fecha de la última revisión real del texto. */
  actualizado: Txt;
  secciones: SeccionLegal[];
}

/** Marcador que dispara el aviso visual de "sin terminar". */
export const MARCA_PENDIENTE = "[COMPLETAR:";

// SWAP: identidad del responsable. Aparece en los dos documentos.
export const responsable = {
  nombre: "[COMPLETAR: nombre o razón social]",
  identificacion: "[COMPLETAR: NIF / EIN / NIT]",
  direccion: "[COMPLETAR: dirección postal completa]",
  pais: "[COMPLETAR: país]",
  email: "hola@emprende180.com", // SWAP: confirmar
} as const;

const R = responsable;

// ─── Aviso de privacidad ─────────────────────────────────────────────────────

export const privacidad: DocumentoLegal = {
  slug: "privacidad",
  titulo: { es: "Aviso de privacidad", en: "Privacy notice" },
  resumen: {
    es: "Qué datos recogemos cuando te apuntas al mini-curso, para qué los usamos y cómo puedes borrarlos.",
    en: "What we collect when you sign up for the mini-course, what we use it for, and how to have it deleted.",
  },
  actualizado: {
    es: "[COMPLETAR: fecha de revisión]",
    en: "[COMPLETAR: review date]",
  },
  secciones: [
    {
      titulo: { es: "Quién trata tus datos", en: "Who handles your data" },
      parrafos: [
        {
          es: `El responsable del tratamiento es ${R.nombre}, con identificación fiscal ${R.identificacion} y domicilio en ${R.direccion}, ${R.pais}.`,
          en: `The data controller is ${R.nombre}, tax ID ${R.identificacion}, located at ${R.direccion}, ${R.pais}.`,
        },
        {
          es: `Para cualquier cuestión sobre tus datos puedes escribir a ${R.email}. Contestamos nosotros, no un formulario automático.`,
          en: `For anything related to your data, email ${R.email}. A person answers, not an autoresponder.`,
        },
      ],
    },
    {
      titulo: { es: "Qué datos recogemos", en: "What we collect" },
      parrafos: [
        {
          es: "Solo lo que nos das tú y lo mínimo que el servidor necesita registrar para funcionar y defenderse de abusos.",
          en: "Only what you give us, plus the minimum the server has to log to run and to fend off abuse.",
        },
      ],
      lista: [
        {
          es: "Nombre y dirección de email, cuando te apuntas al mini-curso gratuito.",
          en: "Name and email address, when you sign up for the free mini-course.",
        },
        {
          es: "La sección de la página desde la que enviaste el formulario, para saber qué parte funciona.",
          en: "Which section of the page you submitted from, so we know what's working.",
        },
        {
          es: "Dirección IP y navegador, registrados en el momento del envío para limitar el spam automatizado.",
          en: "IP address and browser, logged at submission time to limit automated spam.",
        },
        {
          es: "Si aceptas las cookies de medición, los datos de uso que recoge Google Analytics.",
          en: "If you accept analytics cookies, the usage data Google Analytics collects.",
        },
      ],
    },
    {
      titulo: { es: "Para qué los usamos", en: "What we use it for" },
      lista: [
        {
          es: "Enviarte los correos del mini-curso gratuito al que te apuntaste.",
          en: "Sending you the free mini-course emails you signed up for.",
        },
        {
          es: "Informarte sobre el curso de pago y sus novedades.",
          en: "Telling you about the paid course and its updates.",
        },
        { es: "Contestarte si nos escribes.", en: "Replying if you write to us." },
        {
          es: "Medir de forma agregada qué partes de la página funcionan, solo si aceptaste las cookies de medición.",
          en: "Measuring in aggregate which parts of the page work, only if you accepted analytics cookies.",
        },
      ],
    },
    {
      titulo: { es: "Con qué base legal", en: "On what legal basis" },
      parrafos: [
        {
          es: "Tratamos tus datos porque nos diste tu consentimiento expreso al marcar la casilla del formulario. Ese consentimiento es libre y puedes retirarlo cuando quieras, sin dar explicaciones y sin que te cueste nada.",
          en: "We process your data because you gave express consent by checking the box on the form. That consent is freely given and you can withdraw it at any time, with no explanation and at no cost.",
        },
        {
          es: "[COMPLETAR: si operas bajo el RGPD europeo, la LFPDPPP mexicana, la Ley 1581 colombiana de habeas data, la CCPA californiana o cualquier otra norma, cítala aquí de forma expresa.]",
          en: "[COMPLETAR: if you operate under the EU GDPR, Mexico's LFPDPPP, Colombia's Law 1581 on habeas data, California's CCPA/CPRA or any other statute, cite it explicitly here.]",
        },
      ],
    },
    {
      titulo: { es: "Quién más los ve", en: "Who else sees it" },
      parrafos: [
        {
          es: "No vendemos tus datos ni los cedemos a terceros para su publicidad. Solo los comparten los proveedores que necesitamos para que esto funcione, cada uno con su propio contrato de tratamiento:",
          en: "We don't sell your data or hand it to third parties for their advertising. It's shared only with the providers we need to run this, each under its own data processing agreement:",
        },
      ],
      lista: [
        {
          es: "Vercel Inc. (EE. UU.): alojamiento del sitio y registros del servidor.",
          en: "Vercel Inc. (USA): site hosting and server logs.",
        },
        {
          es: "Resend (EE. UU.): envío de los correos del mini-curso.",
          en: "Resend (USA): delivery of the mini-course emails.",
        },
        {
          es: "Google Ireland Ltd. / Google LLC: analítica, solo si la aceptaste.",
          en: "Google Ireland Ltd. / Google LLC: analytics, only if you accepted it.",
        },
        {
          es: "[COMPLETAR: la pasarela de pago, cuando esté conectada.]",
          en: "[COMPLETAR: the payment processor, once it's connected.]",
        },
        {
          es: "[COMPLETAR: la herramienta de email marketing, cuando se conecte la secuencia.]",
          en: "[COMPLETAR: the email marketing tool, once the sequence is connected.]",
        },
      ],
    },
    {
      titulo: {
        es: "Transferencias internacionales",
        en: "International transfers",
      },
      parrafos: [
        {
          es: "Algunos de estos proveedores están en Estados Unidos, así que tus datos pueden tratarse fuera de tu país de residencia.",
          en: "Some of these providers are in the United States, so your data may be processed outside your country of residence.",
        },
        {
          es: "[COMPLETAR: mecanismo de transferencia aplicable: cláusulas contractuales tipo, Data Privacy Framework, etc.]",
          en: "[COMPLETAR: applicable transfer mechanism: standard contractual clauses, Data Privacy Framework, etc.]",
        },
      ],
    },
    {
      titulo: { es: "Cuánto tiempo los guardamos", en: "How long we keep it" },
      parrafos: [
        {
          es: "Mientras sigas suscrito y durante [COMPLETAR: plazo, p. ej. 2 años] desde tu última interacción. Si te das de baja, borramos tu email de la lista de envío.",
          en: "For as long as you stay subscribed and for [COMPLETAR: period, e.g. 2 years] after your last interaction. If you unsubscribe, we delete your email from the sending list.",
        },
        {
          es: "[COMPLETAR: plazos legales de conservación obligatoria: facturación, garantías, etc.]",
          en: "[COMPLETAR: mandatory retention periods: invoicing, warranties, etc.]",
        },
      ],
    },
    {
      titulo: { es: "Qué puedes hacer con ellos", en: "Your rights" },
      parrafos: [
        {
          es: `Puedes acceder a tus datos, corregirlos, borrarlos, oponerte al tratamiento, limitarlo o pedir que te los enviemos en un formato portable. Escribe a ${R.email} y lo resolvemos.`,
          en: `You can access your data, correct it, delete it, object to or restrict processing, or ask for it in a portable format. Email ${R.email} and we'll take care of it.`,
        },
        {
          es: "Cada correo del mini-curso lleva un enlace de baja en un clic: no hace falta que nos escribas para dejar de recibirlos.",
          en: "Every mini-course email has a one-click unsubscribe link. You don't have to email us to stop receiving them.",
        },
        {
          es: "[COMPLETAR: autoridad de control ante la que reclamar en tu país.]",
          en: "[COMPLETAR: the supervisory authority you can complain to in your country.]",
        },
      ],
    },
    {
      titulo: { es: "Cookies", en: "Cookies" },
      parrafos: [
        {
          es: "Este sitio no usa cookies publicitarias ni de seguimiento entre webs.",
          en: "This site uses no advertising cookies and no cross-site tracking.",
        },
        {
          es: "Guardamos una preferencia técnica en tu navegador para recordar qué respondiste al banner de cookies; sin ella tendríamos que preguntártelo en cada visita.",
          en: "We store one technical preference in your browser to remember your answer to the cookie banner. Without it we'd have to ask on every visit.",
        },
        {
          es: "Las cookies de medición (Google Analytics) solo se activan si las aceptas, y puedes cambiar de opinión cuando quieras desde el enlace del pie de página.",
          en: "Analytics cookies (Google Analytics) only load if you accept them, and you can change your mind any time from the link in the footer.",
        },
      ],
    },
  ],
};

// ─── Términos y condiciones ──────────────────────────────────────────────────

export const terminos: DocumentoLegal = {
  slug: "terminos",
  titulo: { es: "Términos y condiciones", en: "Terms and conditions" },
  resumen: {
    es: "Las reglas del mini-curso gratuito y del curso de pago: qué incluye, cómo se paga y cómo se devuelve.",
    en: "The rules for the free mini-course and the paid course: what's included, how you pay, and how refunds work.",
  },
  actualizado: {
    es: "[COMPLETAR: fecha de revisión]",
    en: "[COMPLETAR: review date]",
  },
  secciones: [
    {
      titulo: { es: "Quién presta el servicio", en: "Who provides the service" },
      parrafos: [
        {
          es: `${R.nombre}, ${R.identificacion}, con domicilio en ${R.direccion}, ${R.pais}. Contacto: ${R.email}.`,
          en: `${R.nombre}, ${R.identificacion}, located at ${R.direccion}, ${R.pais}. Contact: ${R.email}.`,
        },
      ],
    },
    {
      titulo: { es: "El mini-curso gratuito", en: "The free mini-course" },
      parrafos: [
        {
          es: "Es gratis y lo es de verdad: no pedimos tarjeta ni se convierte en un cobro pasado un plazo.",
          en: "It's free, and it stays free: no credit card, and it doesn't turn into a charge after a trial period.",
        },
        {
          es: "Al apuntarte aceptas recibir la secuencia de correos y comunicaciones sobre el curso de pago. Puedes darte de baja en un clic desde cualquiera de ellos.",
          en: "By signing up you agree to receive the email sequence and messages about the paid course. You can unsubscribe in one click from any of them.",
        },
        {
          es: "Nos reservamos el derecho a cambiar o retirar el contenido gratuito en cualquier momento.",
          en: "We reserve the right to change or withdraw the free content at any time.",
        },
      ],
    },
    {
      titulo: { es: "El curso de pago", en: "The paid course" },
      lista: [
        {
          es: "El acceso es personal e intransferible: una compra, una persona.",
          en: "Access is personal and non-transferable: one purchase, one person.",
        },
        {
          es: "Se entrega en formato digital y en línea.",
          en: "It's delivered digitally and online.",
        },
        {
          es: "El acceso es permanente mientras el curso siga publicado. [COMPLETAR: compromiso mínimo de disponibilidad, p. ej. 24 meses.]",
          en: "Access is permanent for as long as the course stays published. [COMPLETAR: minimum availability commitment, e.g. 24 months.]",
        },
        {
          es: "[COMPLETAR: qué pasa si el curso deja de publicarse.]",
          en: "[COMPLETAR: what happens if the course is taken down.]",
        },
      ],
    },
    {
      titulo: { es: "Pago", en: "Payment" },
      parrafos: [
        {
          es: "Los precios se muestran en dólares estadounidenses (USD). Los impuestos aplicables dependen de tu país y se calculan al pagar.",
          en: "Prices are shown in US dollars (USD). Applicable taxes depend on your country and are calculated at checkout.",
        },
        {
          es: "[COMPLETAR: pasarela de pago utilizada y medios aceptados.]",
          en: "[COMPLETAR: payment processor used and accepted payment methods.]",
        },
        {
          es: "[COMPLETAR: condiciones del pago fraccionado: qué ocurre si falla una mensualidad.]",
          en: "[COMPLETAR: installment terms: what happens if a payment fails.]",
        },
      ],
    },
    {
      titulo: { es: "Devoluciones", en: "Refunds" },
      parrafos: [
        {
          es: "[COMPLETAR: condiciones exactas de la garantía de devolución: plazo, requisitos, cómo se solicita y en cuánto tiempo se abona. Deben coincidir palabra por palabra con lo que promete la sección de garantía de la landing, EN LOS DOS IDIOMAS.]",
          en: "[COMPLETAR: exact refund terms: window, requirements, how to request it, and how long it takes to be paid out. These must match the guarantee section of the landing page word for word, IN BOTH LANGUAGES.]",
        },
      ],
    },
    {
      titulo: { es: "Propiedad intelectual", en: "Intellectual property" },
      parrafos: [
        {
          es: "Los videos, plantillas y materiales del curso son propiedad del titular y se ceden solo para uso personal.",
          en: "The videos, templates and course materials belong to the owner and are licensed for personal use only.",
        },
        {
          es: "No está permitido revenderlos, compartirlos ni publicarlos, en todo o en parte.",
          en: "Reselling, sharing or publishing them, in whole or in part, is not permitted.",
        },
      ],
    },
    {
      titulo: { es: "Qué no prometemos", en: "What we don't promise" },
      parrafos: [
        {
          es: "El curso enseña un método y aporta herramientas. No garantiza ingresos, resultados económicos concretos ni el éxito de ningún negocio: eso depende de tu trabajo, tu mercado y factores que no controlamos.",
          en: "The course teaches a method and gives you tools. It does not guarantee income, specific financial results, or the success of any business: that depends on your work, your market, and factors outside our control.",
        },
        {
          es: "Cualquier resultado de otros alumnos que aparezca en la web es un caso individual, no una promesa de lo que vayas a conseguir tú.",
          en: "Any student result shown on this site is an individual case, not a promise of what you will achieve.",
        },
      ],
    },
    {
      titulo: { es: "Ley aplicable", en: "Governing law" },
      parrafos: [
        {
          es: "[COMPLETAR: legislación aplicable y tribunales competentes en caso de conflicto.]",
          en: "[COMPLETAR: governing law and competent courts in the event of a dispute.]",
        },
      ],
    },
  ],
};

export const documentos = [privacidad, terminos] as const;

export const documentosPorSlug: Record<string, DocumentoLegal> = {
  [privacidad.slug]: privacidad,
  [terminos.slug]: terminos,
};

// ─── Consentimiento del formulario ───────────────────────────────────────────

export const consentimiento = {
  /**
   * Casilla de aceptación obligatoria.
   *
   * `true` por defecto y a propósito: bajo RGPD (UE), Ley 1581 de habeas data
   * (Colombia), LFPDPPP (México) y LGPD (Brasil) el consentimiento tiene que
   * ser una acción afirmativa y expresa. Premarcar la casilla NO vale.
   */
  requerido: true,
  textoAntes: {
    es: "Acepto recibir los emails del mini-curso y he leído el ",
    en: "I agree to receive the mini-course emails and I've read the ",
  },
  /**
   * ⚠️ EL CONSENTIMIENTO DICE A QUÉ SE CONSIENTE, Y NO SON LA MISMA COSA.
   *
   * Quien pide el precio no se está apuntando a siete correos diarios: está
   * pidiendo que le contesten una pregunta. Reutilizar ahí la casilla del
   * mini-curso es pedir permiso para una cosa y hacer otra, que es
   * exactamente lo que el RGPD llama consentimiento no informado —y de paso
   * la forma más rápida de acabar marcado como spam.
   */
  textoAntesInformes: {
    es: "Acepto que me contacten y he leído el ",
    en: "I agree to be contacted and I've read the ",
  },
  /**
   * El de las dos secciones que reparten los artículos del blog (las guías y
   * la lista). No dice "mini-curso" porque no hay mini-curso, y no dice
   * "precio" porque no se va a llamar a nadie: se consiente a UNA cosa, que es
   * recibir lo que se publique.
   */
  textoAntesLista: {
    es: "Acepto recibir los correos de Emprende180 y he leído el ",
    en: "I agree to receive emails from Emprende180 and I have read the ",
  },
  enlaceTexto: { es: "aviso de privacidad", en: "privacy notice" },
  textoDespues: { es: ".", en: "." },
  nota: {
    es: "Puedes darte de baja en un clic desde cualquiera de los correos.",
    en: "You can unsubscribe in one click from any of the emails.",
  },
} as const;

// ─── Banner de cookies ───────────────────────────────────────────────────────

export const cookies = {
  titulo: { es: "Cookies", en: "Cookies" },
  texto: {
    es: "Usamos cookies propias necesarias para que la página funcione. Nos gustaría usar también cookies de medición para saber qué partes sirven y cuáles no. Tú decides.",
    en: "We use first-party cookies that the site needs to work. We'd also like to use analytics cookies to learn which parts of the page earn their place. Your call.",
  },
  aceptarTodo: { es: "Aceptar todas", en: "Accept all" },
  soloEsenciales: { es: "Solo las necesarias", en: "Only the necessary ones" },
  masInfo: { es: "Leer el aviso de privacidad", en: "Read the privacy notice" },
  cambiarPreferencias: { es: "Preferencias de cookies", en: "Cookie preferences" },
  /** Clave en localStorage. Cambiarla vuelve a preguntar a todo el mundo. */
  claveAlmacenamiento: "e180-consentimiento-cookies-v1",
} as const;

export const legalConfig = {
  responsable,
  privacidad,
  terminos,
  documentos,
  documentosPorSlug,
  consentimiento,
  cookies,
} as const;

export default legalConfig;
