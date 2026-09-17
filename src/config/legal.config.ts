import type { Txt } from "@i18n/idioma";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TEXTOS LEGALES (bilingües)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * El aviso de privacidad y los términos, completos y sin huecos desde el
 * 17-09-2026, escritos para Utah y el resto de Estados Unidos: Utah Consumer
 * Privacy Act, CAN-SPAM (correo), TCPA (llamadas y mensajes), COPPA (menores),
 * la ley de Utah de notificación de brechas, y CCPA/CPRA para quien viva en
 * California. Ley aplicable y tribunales: Utah, condado de Salt Lake.
 *
 * ⚠️ ESTO NO ES ASESORAMIENTO JURÍDICO. Está escrito con cuidado y sobre lo
 * que el sitio hace de verdad, pero conviene que lo lea un abogado de Utah, y
 * que lea LAS DOS versiones: un aviso en inglés que diga algo distinto del
 * español es peor que no tener versión en inglés.
 *
 * ⚠️ LO QUE DICE TIENE QUE SEGUIR SIENDO VERDAD. Si el sitio empieza a cobrar,
 * a usar otra herramienta o a recoger otro dato, se cambia aquí el mismo día
 * y se actualiza la fecha (`actualizado`). Los proveedores declarados son los
 * que hay: Vercel (alojamiento), Resend (correo), HighLevel/LeadConnector
 * (formularios y chat), Google (analítica si se acepta, y el mapa del about).
 *
 * El marcador `[COMPLETAR: …]` sigue existiendo para el día que haga falta
 * abrir un hueco: la página lo resalta en ámbar y no se puede colar sin verlo.
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

/* La identidad del responsable. Datos dados por el cliente (dirección el
   15-09-2026, teléfono el 17-09-2026). El correo es el mismo que
   `contacto.email` en curso.config. No se publica número fiscal: en Estados
   Unidos un aviso de privacidad no lo lleva, y el EIN no es un dato público. */
export const responsable = {
  nombre: "Emprende180",
  direccion: "1515 East Fort Union Blvd, Cottonwood Heights, UT 84121",
  pais: { es: "Estados Unidos", en: "United States" },
  email: "contact@emprende180.com",
  telefono: "(385) 588-3717",
} as const;

const R = responsable;

// ─── Aviso de privacidad ─────────────────────────────────────────────────────

export const privacidad: DocumentoLegal = {
  slug: "privacidad",
  titulo: { es: "Aviso de privacidad", en: "Privacy notice" },
  resumen: {
    es: "Qué datos recogemos cuando nos dejas los tuyos, para qué los usamos, con quién los compartimos y cómo puedes verlos o borrarlos.",
    en: "What we collect when you share your details, what we use it for, who we share it with, and how you can see or delete it.",
  },
  /* Reescrito entero el 17-09-2026 para Utah y el resto de Estados Unidos, a
     petición del cliente y sin ningún hueco por rellenar. Se apoya en la Utah
     Consumer Privacy Act (UCPA), en las leyes federales que aplican a lo que
     el sitio hace (CAN-SPAM para el correo, TCPA para llamadas y mensajes,
     COPPA para menores) y, para quien viva en California, en la CCPA/CPRA.
     Lo que dice es lo que el sitio HACE hoy: formularios, correo, chat de
     GoHighLevel si se aceptan cookies, analítica si se acepta, mapa de Google
     en el about, y registros del servidor. Si el sitio empieza a cobrar o a
     usar otra herramienta, esto se actualiza el mismo día. */
  actualizado: {
    es: "17 de septiembre de 2026",
    en: "September 17, 2026",
  },
  secciones: [
    {
      titulo: { es: "Quién trata tus datos", en: "Who handles your data" },
      parrafos: [
        {
          es: `El responsable de tus datos es ${R.nombre}, con domicilio en ${R.direccion}, ${R.pais.es}.`,
          en: `Your data is handled by ${R.nombre}, located at ${R.direccion}, ${R.pais.en}.`,
        },
        {
          es: `Para cualquier cuestión sobre tus datos puedes escribir a ${R.email} o llamar al ${R.telefono}. Contesta una persona, no un formulario automático.`,
          en: `For anything related to your data, email ${R.email} or call ${R.telefono}. A person answers, not an autoresponder.`,
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
          es: "Nombre y dirección de correo, cuando rellenas un formulario para que te escribamos, para recibir las guías o para apuntarte a la lista.",
          en: "Name and email address, when you fill in a form so we can write to you, to receive the guides, or to join the list.",
        },
        {
          es: "Teléfono, solo si decides dejarlo, y el nombre de quien te recomendó, si lo escribes.",
          en: "Phone number, only if you choose to leave it, and the name of whoever referred you, if you enter it.",
        },
        {
          es: "La sección de la página desde la que enviaste el formulario, para saber qué parte funciona.",
          en: "Which section of the page you submitted from, so we know what's working.",
        },
        {
          es: "Dirección IP, navegador y fecha del envío, registrados en ese momento para limitar el spam automatizado y proteger el formulario.",
          en: "IP address, browser and time of submission, logged at that moment to limit automated spam and protect the form.",
        },
        {
          es: "Lo que escribas en el chat, si decides usarlo, y el correo o teléfono que dejes en él.",
          en: "Whatever you type into the chat, if you choose to use it, and any email or phone number you leave there.",
        },
        {
          es: "Si aceptas las cookies de medición, los datos de uso agregados que recoge Google Analytics (páginas vistas, dispositivo, país aproximado). No identifican a nadie por su nombre.",
          en: "If you accept analytics cookies, the aggregate usage data Google Analytics collects (pages viewed, device, approximate country). It doesn't identify anyone by name.",
        },
      ],
    },
    {
      titulo: { es: "Para qué los usamos", en: "What we use it for" },
      lista: [
        {
          es: "Escribirte o llamarte para contarte cómo se entra en la comunidad de Embajadores y resolver lo que preguntes. Es lo que pediste al dejar tus datos.",
          en: "Writing or calling you to explain how to join the Ambassador community and answer your questions. That's what you asked for when you left your details.",
        },
        {
          es: "Mandarte el acuse de recibo cuando dejas tus datos y, si te apuntaste a las guías o a la lista, avisarte cuando publiquemos algo nuevo.",
          en: "Sending you a confirmation when you leave your details and, if you signed up for the guides or the list, letting you know when we publish something new.",
        },
        {
          es: "Contestarte si nos escribes por correo, por teléfono o por el chat.",
          en: "Replying when you write to us by email, phone or chat.",
        },
        {
          es: "Mantener el sitio seguro y en funcionamiento: detectar abusos, limitar envíos automatizados y diagnosticar errores.",
          en: "Keeping the site secure and running: detecting abuse, limiting automated submissions and diagnosing errors.",
        },
        {
          es: "Medir de forma agregada qué partes de la página funcionan, solo si aceptaste las cookies de medición.",
          en: "Measuring in aggregate which parts of the page work, only if you accepted analytics cookies.",
        },
      ],
    },
    {
      titulo: { es: "Lo que no hacemos", en: "What we don't do" },
      lista: [
        {
          es: "No vendemos tus datos a nadie, ni los cedemos a terceros para su publicidad.",
          en: "We don't sell your data to anyone, and we don't hand it to third parties for their advertising.",
        },
        {
          es: "No hacemos publicidad dirigida a partir de tus datos ni te seguimos por otras webs.",
          en: "We don't run targeted advertising based on your data and we don't track you across other websites.",
        },
        {
          es: "No tomamos decisiones automatizadas sobre ti ni elaboramos perfiles con efectos legales o similares.",
          en: "We don't make automated decisions about you or build profiles with legal or similar effects.",
        },
        {
          es: "No recogemos a sabiendas datos de menores de 13 años. Este sitio está dirigido a adultos; si crees que un menor nos dejó sus datos, escríbenos y los borramos.",
          en: "We don't knowingly collect data from children under 13. This site is intended for adults; if you believe a child has given us their details, write to us and we'll delete them.",
        },
      ],
    },
    {
      titulo: {
        es: "Correos, llamadas y mensajes",
        en: "Emails, calls and texts",
      },
      parrafos: [
        {
          es: "Te escribimos porque nos lo pediste al marcar la casilla del formulario. Cada correo que mandamos lleva quiénes somos y un enlace para darte de baja en un clic; si lo pulsas, dejamos de escribirte en un plazo máximo de diez días hábiles, como exige la ley CAN-SPAM.",
          en: "We email you because you asked us to when you checked the box on the form. Every email we send says who we are and includes a one-click unsubscribe link; if you use it, we stop within ten business days at most, as the CAN-SPAM Act requires.",
        },
        {
          es: "Si nos dejas tu teléfono, te llamaremos o te escribiremos un mensaje de texto solo para atender tu solicitud, en horario razonable y sin sistemas automáticos de marcado. Puedes pedirnos que dejemos de hacerlo cuando quieras: basta con decírnoslo o responder STOP a un mensaje. Pueden aplicarse las tarifas de mensajes y datos de tu operador.",
          en: "If you leave your phone number, we'll call or text you only to handle your request, at reasonable hours and without autodialers. You can ask us to stop at any time: just tell us, or reply STOP to a text. Your carrier's message and data rates may apply.",
        },
      ],
    },
    {
      titulo: { es: "Quién más los ve", en: "Who else sees it" },
      parrafos: [
        {
          es: "Solo los proveedores que necesitamos para que esto funcione, cada uno con su propio contrato de tratamiento y solo para el servicio que nos presta:",
          en: "Only the providers we need to run this, each under its own data processing agreement and only for the service it provides us:",
        },
      ],
      lista: [
        {
          es: "Vercel Inc. (EE. UU.): alojamiento del sitio y registros del servidor.",
          en: "Vercel Inc. (USA): site hosting and server logs.",
        },
        {
          es: "Resend Inc. (EE. UU.): envío de los correos de acuse y de las guías.",
          en: "Resend Inc. (USA): delivery of confirmation and guide emails.",
        },
        {
          es: "HighLevel Inc. (EE. UU.), la plataforma LeadConnector: gestión de los datos que nos dejas en los formularios y el chat en vivo del sitio, que solo se carga si aceptas las cookies.",
          en: "HighLevel Inc. (USA), the LeadConnector platform: managing the details you leave in our forms, and the site's live chat, which only loads if you accept cookies.",
        },
        {
          es: 'Google LLC (EE. UU.): la analítica, solo si la aceptaste; y el mapa de Google Maps de la página "Quiénes somos", que carga desde sus servidores al abrirla.',
          en: 'Google LLC (USA): analytics, only if you accepted it; and the Google Maps map on the "About us" page, which loads from their servers when you open it.',
        },
        {
          es: "Las autoridades, si la ley nos obliga a entregarlos o si hace falta para defender nuestros derechos o los de otras personas.",
          en: "Public authorities, if the law requires us to hand data over or if it's needed to defend our rights or someone else's.",
        },
      ],
    },
    {
      titulo: { es: "Dónde se guardan", en: "Where it's stored" },
      parrafos: [
        {
          es: "Emprende180 opera desde Utah y sus proveedores están en Estados Unidos, así que tus datos se guardan y tratan en Estados Unidos. Si nos escribes desde otro país, al hacerlo aceptas que se traten aquí, con las protecciones de este aviso.",
          en: "Entrepreneur180 operates from Utah and its providers are in the United States, so your data is stored and processed in the United States. If you write to us from another country, by doing so you agree to it being processed here, with the protections in this notice.",
        },
      ],
    },
    {
      titulo: { es: "Cuánto tiempo los guardamos", en: "How long we keep it" },
      parrafos: [
        {
          es: "Los datos que nos dejas para que te escribamos, mientras dure la conversación y hasta veinticuatro meses desde tu última interacción con nosotros. Después los borramos, salvo que mientras tanto hayas pasado a formar parte del programa, en cuyo caso se guardan lo que dure tu relación con nosotros.",
          en: "The details you leave so we can write to you, for as long as the conversation lasts and up to twenty-four months after your last interaction with us. After that we delete them, unless you've joined the program in the meantime, in which case they're kept for as long as your relationship with us lasts.",
        },
        {
          es: "El correo de las guías y de la lista, mientras sigas suscrito. Si te das de baja, lo borramos de la lista de envío.",
          en: "Your email for the guides and the list, for as long as you stay subscribed. If you unsubscribe, we remove it from the sending list.",
        },
        {
          es: "Los registros del servidor (dirección IP, navegador, fecha), noventa días como máximo.",
          en: "Server logs (IP address, browser, time), ninety days at most.",
        },
        {
          es: "Lo que la ley nos obligue a conservar más tiempo, solo ese tiempo y solo para eso.",
          en: "Anything the law requires us to keep longer, only for that time and only for that purpose.",
        },
      ],
    },
    {
      titulo: { es: "Cómo los protegemos", en: "How we protect it" },
      parrafos: [
        {
          es: "El sitio se sirve cifrado (HTTPS), los formularios llevan protección contra envíos automatizados, y solo accede a tus datos quien los necesita para atenderte. Ningún sistema es infalible; si alguna vez hubiera un acceso indebido que te afectara, te avisaríamos como exige la ley de Utah sobre notificación de brechas.",
          en: "The site is served encrypted (HTTPS), the forms are protected against automated submissions, and only the people who need your data to help you can access it. No system is infallible; if there were ever a breach affecting you, we would notify you as Utah's breach notification law requires.",
        },
      ],
    },
    {
      titulo: { es: "Tus derechos", en: "Your rights" },
      parrafos: [
        {
          es: "Vivas donde vivas, puedes pedirnos en cualquier momento que te digamos qué datos tuyos tenemos, que los corrijamos, que los borremos o que te los entreguemos en un formato que puedas llevarte. También puedes retirar tu consentimiento y dejar de recibir nuestros correos, llamadas o mensajes.",
          en: "Wherever you live, you can ask us at any time to tell you what data we hold about you, to correct it, to delete it, or to give it to you in a format you can take with you. You can also withdraw your consent and stop receiving our emails, calls or texts.",
        },
        {
          es: "Si vives en Utah, la Utah Consumer Privacy Act te reconoce expresamente el derecho a acceder a tus datos, a borrarlos, a obtener una copia portable y a oponerte a su venta o a la publicidad dirigida. No vendemos datos ni hacemos publicidad dirigida, así que a lo último no hay nada a lo que oponerse. Si vives en California, la CCPA/CPRA te da derechos equivalentes, incluido saber qué categorías de datos tenemos y no ser tratado distinto por ejercerlos.",
          en: "If you live in Utah, the Utah Consumer Privacy Act expressly gives you the right to access your data, delete it, obtain a portable copy, and opt out of its sale or of targeted advertising. We don't sell data or run targeted advertising, so there's nothing to opt out of on that front. If you live in California, the CCPA/CPRA gives you equivalent rights, including knowing which categories of data we hold and not being treated differently for exercising them.",
        },
        {
          es: `Para ejercer cualquiera de ellos, escribe a ${R.email} o llama al ${R.telefono}. Te contestamos en un plazo máximo de cuarenta y cinco días, gratis, y si necesitáramos más tiempo te lo diríamos antes. Solo te pediremos lo mínimo para comprobar que eres tú. Si la respuesta no te satisface, puedes pedirnos que la revisemos, y también puedes acudir a la División de Protección al Consumidor de Utah (Utah Division of Consumer Protection) o al fiscal general de tu estado.`,
          en: `To exercise any of them, email ${R.email} or call ${R.telefono}. We reply within forty-five days at most, free of charge, and if we needed more time we'd tell you first. We'll only ask for the minimum needed to confirm it's you. If our answer doesn't satisfy you, you can ask us to review it, and you can also contact the Utah Division of Consumer Protection or your state's attorney general.`,
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
          es: "Guardamos una preferencia técnica en tu navegador para recordar qué respondiste al aviso de cookies y otra para recordar tu idioma. Sin ellas tendríamos que preguntártelo en cada visita. Son necesarias y no requieren consentimiento.",
          en: "We store one technical preference in your browser to remember your answer to the cookie notice and another to remember your language. Without them we'd have to ask on every visit. They're necessary and don't require consent.",
        },
        {
          es: "Las cookies de medición (Google Analytics) y el chat en vivo (LeadConnector) solo se activan si aceptas las cookies, y puedes cambiar de opinión cuando quieras desde el enlace de preferencias del pie de página. Si no las aceptas, el sitio funciona igual y puedes escribirnos por los formularios o al correo.",
          en: "Analytics cookies (Google Analytics) and the live chat (LeadConnector) only turn on if you accept cookies, and you can change your mind at any time from the preferences link in the footer. If you don't accept them, the site works the same and you can reach us through the forms or by email.",
        },
        {
          es: "Tu navegador puede enviar la señal Global Privacy Control. No vendemos datos ni hacemos publicidad dirigida, así que ya se cumple lo que esa señal pide.",
          en: "Your browser may send a Global Privacy Control signal. We don't sell data or run targeted advertising, so what that signal asks for is already the case.",
        },
      ],
    },
    {
      titulo: { es: "Cambios en este aviso", en: "Changes to this notice" },
      parrafos: [
        {
          es: "Si cambiamos algo que te afecte, actualizaremos la fecha de arriba y, si el cambio es de fondo, te lo diremos por correo antes de que entre en vigor. La versión vigente es siempre la que está publicada en esta página.",
          en: "If we change anything that affects you, we'll update the date above and, if the change is substantial, we'll tell you by email before it takes effect. The current version is always the one published on this page.",
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
    es: "Las reglas de uso de este sitio: qué es, qué puedes hacer con lo que hay en él, qué prometemos y qué no.",
    en: "The rules for using this site: what it is, what you can do with what's on it, what we promise and what we don't.",
  },
  /* Reescritos enteros el 17-09-2026, sin huecos por rellenar. La versión
     anterior era la de una landing que vendía un curso (precio, pago
     fraccionado, devoluciones) y llevaba huecos por rellenar que se veían
     en producción resaltados en ámbar. Hoy el sitio no cobra nada ("sin
     inversión inicial", dice el hero) y lo que hace es informar y recoger
     datos de quien quiere entrar en la comunidad de Embajadores: los términos
     dicen eso. El día que se venda algo desde aquí hay que volver a poner las
     secciones de pago y devolución, con los datos reales. */
  actualizado: {
    es: "17 de septiembre de 2026",
    en: "September 17, 2026",
  },
  secciones: [
    {
      titulo: {
        es: "Quién presta el servicio",
        en: "Who provides the service",
      },
      parrafos: [
        {
          es: `${R.nombre}, con domicilio en ${R.direccion}, ${R.pais.es}. Contacto: ${R.email}, ${R.telefono}.`,
          en: `${R.nombre}, located at ${R.direccion}, ${R.pais.en}. Contact: ${R.email}, ${R.telefono}.`,
        },
        {
          es: "Al usar este sitio aceptas estos términos. Si no estás de acuerdo con alguno, lo mejor es no usarlo.",
          en: "By using this site you accept these terms. If you disagree with any of them, the best thing is not to use it.",
        },
      ],
    },
    {
      titulo: { es: "Qué es este sitio", en: "What this site is" },
      parrafos: [
        {
          es: "Este sitio explica el programa Emprende180 y la comunidad de Embajadores, publica artículos y guías, y te permite dejarnos tus datos para que te escribamos o te llamemos y te contemos cómo se entra. Nada de lo que hay aquí se cobra: navegar, leer y dejar tus datos es gratis y no genera ninguna obligación de pago.",
          en: "This site explains the Entrepreneur180 program and the Ambassador community, publishes articles and guides, and lets you leave your details so we can write or call you and explain how to join. Nothing here is charged for: browsing, reading and leaving your details is free and creates no payment obligation.",
        },
        {
          es: "Entrar en el programa es una conversación aparte, con una persona del equipo, y se rige por lo que se acuerde en ese momento.",
          en: "Joining the program is a separate conversation with a member of the team, governed by whatever is agreed at that point.",
        },
      ],
    },
    {
      titulo: { es: "Los formularios y el chat", en: "The forms and the chat" },
      parrafos: [
        {
          es: "Al enviar un formulario o escribir en el chat te comprometes a dar datos verdaderos y tuyos. Nosotros nos comprometemos a usarlos solo para lo que dice el aviso de privacidad: contestarte, contarte cómo se entra y, si te apuntaste a las guías, avisarte cuando publiquemos algo.",
          en: "When you submit a form or write in the chat, you agree to give true details that are your own. We commit to using them only for what the privacy notice says: replying, explaining how to join and, if you signed up for the guides, letting you know when we publish something.",
        },
        {
          es: "Puedes darte de baja de los correos en un clic desde cualquiera de ellos, y pedirnos que dejemos de llamarte o escribirte cuando quieras.",
          en: "You can unsubscribe from the emails with one click from any of them, and ask us to stop calling or writing to you at any time.",
        },
        {
          es: "Nos reservamos el derecho a no atender solicitudes que sean claramente automatizadas, abusivas o falsas.",
          en: "We reserve the right not to act on requests that are clearly automated, abusive or false.",
        },
      ],
    },
    {
      titulo: { es: "Propiedad intelectual", en: "Intellectual property" },
      parrafos: [
        {
          es: "Los textos, vídeos, imágenes propias, guías, el nombre Emprende180 y su logotipo son de su titular. Puedes leerlos, compartir los enlaces y citar fragmentos breves indicando la fuente.",
          en: "The texts, videos, our own images, the guides, the Entrepreneur180 name and its logo belong to their owner. You may read them, share the links and quote short excerpts crediting the source.",
        },
        {
          es: "No está permitido copiarlos, reproducirlos, venderlos ni publicarlos en otro sitio, en todo o en parte, sin permiso por escrito. Los materiales que se entregan dentro del programa son para uso personal de cada Embajador.",
          en: "You may not copy, reproduce, sell or republish them elsewhere, in whole or in part, without written permission. Materials delivered within the program are for each Ambassador's personal use.",
        },
        {
          es: "Los logotipos de las empresas que representamos son de sus respectivos dueños y aparecen solo para identificarlas.",
          en: "The logos of the companies we represent belong to their respective owners and appear only to identify them.",
        },
      ],
    },
    {
      titulo: { es: "Qué no prometemos", en: "What we don't promise" },
      parrafos: [
        {
          es: "El programa enseña un método y da herramientas y acompañamiento. No garantiza ingresos, resultados económicos concretos ni el éxito de ningún negocio: eso depende de tu trabajo, de tu mercado y de factores que no controlamos.",
          en: "The program teaches a method and provides tools and support. It doesn't guarantee income, specific financial results or the success of any business: that depends on your work, your market and factors beyond our control.",
        },
        {
          es: "Los testimonios que aparecen en la web son experiencias individuales de personas reales, publicadas con su permiso. No son una promesa de lo que vayas a conseguir tú.",
          en: "The testimonials on the site are individual experiences of real people, published with their permission. They are not a promise of what you will achieve.",
        },
        {
          es: "Tú conectas personas con empresas; los servicios financieros, inmobiliarios o de cualquier otro tipo los presta cada empresa con su propio equipo certificado y bajo sus propias condiciones. Emprende180 no presta esos servicios ni responde por ellos.",
          en: "You connect people with companies; the financial, real estate or other services are provided by each company with its own certified team and under its own terms. Entrepreneur180 doesn't provide those services and isn't responsible for them.",
        },
      ],
    },
    {
      titulo: {
        es: "Enlaces y servicios de terceros",
        en: "Links and third-party services",
      },
      parrafos: [
        {
          es: "El sitio enlaza a webs de terceros (las empresas que representamos, redes sociales, Google Maps) y, si aceptas las cookies, carga un chat de LeadConnector. Esos servicios tienen sus propias condiciones y su propia política de privacidad; no controlamos su contenido ni respondemos por él.",
          en: "The site links to third-party websites (the companies we represent, social networks, Google Maps) and, if you accept cookies, loads a LeadConnector chat. Those services have their own terms and privacy policies; we don't control their content and aren't responsible for it.",
        },
      ],
    },
    {
      titulo: {
        es: "Disponibilidad y responsabilidad",
        en: "Availability and liability",
      },
      parrafos: [
        {
          es: "Procuramos que el sitio esté disponible y sea correcto, pero se ofrece tal cual, sin garantía de que esté libre de errores o interrupciones. Podemos cambiar, suspender o retirar cualquier parte del sitio en cualquier momento.",
          en: "We do our best to keep the site available and accurate, but it's provided as is, with no warranty that it's free of errors or interruptions. We may change, suspend or remove any part of the site at any time.",
        },
        {
          es: "En la medida en que la ley lo permita, Emprende180 no responde por daños indirectos derivados del uso del sitio o de la imposibilidad de usarlo. Nada de esto limita los derechos que la ley te reconoce como consumidor y que no se pueden renunciar.",
          en: "To the extent the law allows, Entrepreneur180 isn't liable for indirect damages arising from the use of the site or the inability to use it. Nothing here limits the rights the law grants you as a consumer that cannot be waived.",
        },
      ],
    },
    {
      titulo: { es: "Ley aplicable", en: "Governing law" },
      parrafos: [
        {
          es: "Estos términos se rigen por las leyes del estado de Utah y las leyes federales de Estados Unidos que resulten aplicables. Cualquier disputa se resolverá ante los tribunales estatales o federales con sede en el condado de Salt Lake, Utah, salvo que la ley de tu lugar de residencia te dé un derecho irrenunciable a acudir a otros.",
          en: "These terms are governed by the laws of the State of Utah and applicable United States federal law. Any dispute will be resolved before the state or federal courts located in Salt Lake County, Utah, unless the law where you live gives you a non-waivable right to go elsewhere.",
        },
        {
          es: "Antes de llegar a eso, escríbenos: casi todo se resuelve hablando.",
          en: "Before it gets to that, write to us: almost everything gets resolved by talking.",
        },
      ],
    },
    {
      titulo: { es: "Cambios", en: "Changes" },
      parrafos: [
        {
          es: "Podemos actualizar estos términos. La fecha de arriba dice cuándo fue la última vez, y la versión vigente es siempre la publicada en esta página.",
          en: "We may update these terms. The date above says when we last did, and the current version is always the one published on this page.",
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
    en: "I agree to receive emails from Entrepreneur180 and I have read the ",
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
  cambiarPreferencias: {
    es: "Preferencias de cookies",
    en: "Cookie preferences",
  },
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
