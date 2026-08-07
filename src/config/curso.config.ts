import type { Txt } from "@i18n/idioma";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * EMPRENDE180 — FUENTE ÚNICA DE VERDAD (bilingüe)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * LA REGLA QUE GOBIERNA ESTE ARCHIVO
 *
 *   COPY  →  escrito y listo. Titulares, dolores, beneficios, temario, FAQ,
 *            garantía, mini-curso. Se puede afinar, pero no bloquea el lanzamiento.
 *
 *   HECHO →  NO se inventa. Nunca. Nombre del instructor, sus años de
 *            experiencia, negocios que fundó, testimonios, número de alumnos,
 *            valoraciones, precio, horas semanales. Todo eso va como
 *            `[COMPLETAR: …]` y la página lo resalta en ámbar hasta que se
 *            rellene.
 *
 * Un titular flojo cuesta conversión. Un dato inventado cuesta credibilidad y,
 * según cuál, es publicidad engañosa. No es la misma categoría de error.
 *
 * IDIOMAS
 *  · `es` — español neutro latino (es-US). Trato de TÚ. Nada de "vosotros",
 *    "ordenador", "móvil" (→ celular), "coger", "vale". Cercano y motivador,
 *    con autoridad y sin humo: el emprendedor latino desconfía del vendehumo.
 *    Cero signos de exclamación, cero "¡Tú puedes!".
 *  · `en` — inglés de EE. UU. Traducción REAL, no literal. El vocabulario de
 *    negocio va como lo dice alguien de allá:
 *        validar la idea    → validate your idea
 *        propuesta de valor → value proposition
 *        flujo de caja      → cash flow
 *        cliente potencial  → prospect / lead
 *        cerrar una venta   → close a sale
 *    Varias frases NO son la traducción palabra por palabra. Es lo correcto.
 *
 * DOS REGLAS DE CONTENIDO QUE NO SE SALTAN:
 *
 * 1. El "180" es un GIRO DE 180°, no 180 días. Nunca "en 180 días".
 * 2. NO SE DECLARA LA DURACIÓN TOTAL DEL CURSO. El único plazo que se anuncia
 *    es el del mini-curso gratuito, porque ahí el plazo ES la promesa.
 *    (El tiempo semanal de dedicación sí se puede decir: es otra cosa, y va
 *    marcado como HECHO a rellenar.)
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Modulo {
  numero: number;
  titulo: Txt;
  /** Qué SABE HACER el alumno al terminar. Resultado, no descripción. */
  logras: Txt;
  lecciones?: Txt[];
}

export interface Testimonio {
  nombre: string;
  contexto: Txt;
  cita: Txt;
  /** Ruta en /public/imagenes/testimonios/. `null` → se muestran las iniciales. */
  foto: string | null;
  resultado?: Txt;
}

export interface Faq {
  pregunta: Txt;
  respuesta: Txt;
}

export interface DiaLeadMagnet {
  dia: number;
  titulo: Txt;
  entrega: Txt;
}

export interface Credencial {
  dato: Txt;
  /** Enlace que lo respalda. `null` si no lo hay. */
  prueba: string | null;
}

export type OrigenLead = "hero" | "lead-magnet" | "cierre" | "modal" | "footer";

// ─── Sitio ───────────────────────────────────────────────────────────────────

export const sitio = {
  nombre: "Emprende180",
  claim: {
    es: "Tu giro de 180° empieza aquí",
    en: "Your 180° turn starts here",
  },
  url: "https://emprende180.vercel.app", // SWAP: dominio definitivo

  titulo: {
    es: "Emprende180 — De la idea a tu primer cliente que paga",
    en: "Emprende180 — From idea to your first paying customer",
  },
  descripcion: {
    es: "Curso de emprendimiento paso a paso: valida tu idea, ponle precio y consigue clientes reales. Empieza gratis con el reto de 7 días.",
    en: "A step-by-step business course: validate your idea, price it right, and land real customers. Start free with the 7-day challenge.",
  },

  ogImagen: "/imagenes/og/og.jpg",
  themeColor: "#0D2B4D",

  logoDisponible: true,
  logo: { src: "/identidad/logo.png", w: 320, h: 308 },
  logoBlanco: { src: "/identidad/logo-blanco.png", w: 320, h: 308 },
  logoHorizontal: { src: "/identidad/logo-horizontal.png", w: 573, h: 120 },
  logoHorizontalBlanco: { src: "/identidad/logo-horizontal-blanco.png", w: 573, h: 120 },
  isotipo: { src: "/identidad/isotipo.png", w: 512, h: 632 },
  isotipoBlanco: { src: "/identidad/isotipo-blanco.png", w: 512, h: 632 },
} as const;

// ─── Titulares del hero ──────────────────────────────────────────────────────

/**
 * TRES OPCIONES DE TITULAR. Elige una cambiando `TITULAR_ELEGIDO`.
 *
 * Las tres apuntan a un RESULTADO, no a la actividad. "Aprende a emprender"
 * describe lo que hace el curso; "de la idea a tu primer cliente" describe
 * dónde acaba el alumno, que es lo único que le interesa.
 *
 *   0 — El recorrido completo. La más clara y la más fácil de defender.
 *   1 — La más provocadora. Ataca de frente la parálisis por análisis.
 *   2 — La más cercana. Baja la barrera: "esto está a tu alcance".
 *
 * Si dudas, quédate con la 0 y prueba la 1 en campañas frías.
 */
export const TITULARES: readonly Txt[] = [
  {
    es: "De la idea a tu primer cliente que paga",
    en: "From idea to your first paying customer",
  },
  {
    es: "Deja de planear tu negocio y empieza a venderlo",
    en: "Stop planning your business and start selling it",
  },
  {
    es: "Tu primera venta está más cerca de lo que crees",
    en: "Your first sale is closer than you think",
  },
];

/** SWAP: 0, 1 o 2. Ver arriba. */
const TITULAR_ELEGIDO = 0;

// ─── El curso ────────────────────────────────────────────────────────────────

export const curso = {
  nombre: {
    es: "Fundamentos de Emprende180",
    en: "Fundamentos de Emprende180",
  },
  subtitulo: {
    es: "10 videos, un quiz por video y tu certificación al terminar",
    en: "10 videos, a quiz after each one, and your certificate at the end",
  },

  /** El titular activo. El resto viven en `TITULARES` para poder probarlos. */
  promesa: TITULARES[TITULAR_ELEGIDO]!,

  /** Subtítulo: para quién es y qué se consigue. */
  promesaApoyo: {
    es: "Un método paso a paso para quien tiene una idea (o todavía ni eso) y quiere validarla, ponerle precio y conseguir clientes reales. Sin capital inicial, sin jerga de startup y sin dejar tu trabajo mientras arrancas.",
    en: "A step-by-step method for anyone with an idea (or not even that yet) who wants to validate it, price it, and land real customers. No seed money, no startup jargon, and no quitting your job to get started.",
  },

  // ─── SECCIÓN 2 · El problema ───────────────────────────────────────────────
  problema: {
    titular: {
      es: "El problema no es que te falten ideas",
      en: "Your problem isn't a shortage of ideas",
    },
    entradilla: {
      es: "Es que nadie te ha dicho en qué orden hacer las cosas. Así que empiezas, dudas, lo dejas, y tres meses después vuelves al mismo punto de partida.",
      en: "It's that nobody told you what order to do things in. So you start, second-guess yourself, drop it, and three months later you're back at the same starting line.",
    },

    /** En primera persona del lector. Que se reconozca en al menos dos. */
    dolores: [
      {
        es: "Llevas meses con la idea dando vueltas en la cabeza, y cada vez que te sientas a arrancar aparece algo más urgente.",
        en: "You've had the idea rattling around for months, and every time you sit down to start, something more urgent shows up.",
      },
      {
        es: "No sabes por dónde empezar. Cada persona te dice algo distinto y acabas con veinte pestañas abiertas y ninguna decisión tomada.",
        en: "You don't know where to start. Everyone tells you something different and you end up with twenty tabs open and not one decision made.",
      },
      {
        es: "Tienes la idea, pero no sabes si a alguien le va a interesar de verdad. Y que tu familia te diga que le encanta no cuenta.",
        en: "You have the idea, but you don't know if anyone actually wants it. And your family saying they love it doesn't count.",
      },
      {
        es: "Te frena el miedo a meter tiempo y dinero en algo que quizá no funcione, y prefieres no arriesgarte antes que equivocarte.",
        en: "You're held back by the fear of sinking time and money into something that might not work, so you'd rather not risk it than get it wrong.",
      },
      {
        es: "Aunque mañana tuvieras el producto listo, no sabrías cómo venderlo sin sentir que estás molestando a la gente.",
        en: "Even if the product were ready tomorrow, you wouldn't know how to sell it without feeling like you're bothering people.",
      },
    ] satisfies Txt[],

    coste: {
      es: "Dentro de un año vas a seguir con la misma idea. La única diferencia será que habrás perdido otro año para comprobar si funcionaba.",
      en: "A year from now you'll still have the same idea. The only difference is you'll have lost another year to find out whether it worked.",
    },
  },

  // ─── SECCIÓN 3 · Transformación ────────────────────────────────────────────
  /** Qué SABRÁS HACER al terminar. Verbo de acción + resultado. */
  transformaciones: [
    {
      titulo: {
        es: "Sabrás si tu idea tiene clientes",
        en: "You'll know if your idea has customers",
      },
      detalle: {
        es: "Validada hablando con gente que paga, no con la opinión de tu círculo. Y con criterio para descartarla a tiempo si no da.",
        en: "Validated by talking to people who pay, not by polling your circle. And with the judgment to drop it in time if it doesn't hold up.",
      },
    },
    {
      titulo: {
        es: "Explicarás tu negocio en una frase",
        en: "You'll explain your business in one sentence",
      },
      detalle: {
        es: "Qué vendes, a quién y por qué a ti. Tan claro que quien lo escuche sepa si le sirve sin tener que preguntarte nada.",
        en: "What you sell, who it's for, and why you. Clear enough that whoever hears it knows if it's for them without asking a single question.",
      },
    },
    {
      titulo: {
        es: "Pondrás precio con números detrás",
        en: "You'll price it with real numbers behind it",
      },
      detalle: {
        es: "Sabrás cuánto te cuesta cada venta, cuánto margen te queda y qué responder cuando te digan que está caro.",
        en: "You'll know what each sale costs you, what margin is left, and what to say when someone tells you it's expensive.",
      },
    },
    {
      titulo: {
        es: "Conseguirás tus primeros clientes",
        en: "You'll land your first customers",
      },
      detalle: {
        es: "Con una lista de contactos calificados y un guion propio para escribirles sin sonar a spam ni a vendedor.",
        en: "With a list of qualified prospects and your own outreach script that doesn't read like spam or a sales pitch.",
      },
    },
    {
      titulo: {
        es: "Controlarás tu flujo de caja",
        en: "You'll have your cash flow under control",
      },
      detalle: {
        es: "Sabrás cuántos meses de aire tienes, cuándo reinvertir y cuándo frenar. Facturar no es ganar.",
        en: "You'll know how many months of runway you have, when to reinvest and when to stop. Revenue isn't profit.",
      },
    },
    {
      titulo: {
        es: "Tendrás un proceso que puedes repetir",
        en: "You'll have a process you can repeat",
      },
      detalle: {
        es: "Lo que funcionó, convertido en rutina semanal. Sin depender de la motivación ni de que se alineen los astros.",
        en: "Whatever worked, turned into a weekly routine. No waiting on motivation or for the stars to align.",
      },
    },
  ],

  /** Versión corta, para el JSON-LD `teaches`. */
  resultados: [
    {
      es: "Validar una idea de negocio con clientes reales antes de invertir",
      en: "Validate a business idea with real customers before investing",
    },
    {
      es: "Definir tu propuesta de valor y ponerle precio con margen",
      en: "Define your value proposition and price it with real margin",
    },
    {
      es: "Conseguir los primeros clientes sin técnicas agresivas",
      en: "Land your first customers without pushy tactics",
    },
    {
      es: "Llevar el flujo de caja y los números básicos del negocio",
      en: "Manage cash flow and the basic numbers of the business",
    },
  ] satisfies Txt[],

  // ─── Auto-cualificación ────────────────────────────────────────────────────
  paraQuien: [
    {
      es: "Tienes una idea (o varias) y no sabes cuál perseguir ni cómo comprobar si sirve.",
      en: "You have an idea (or several) and don't know which to chase or how to check if it works.",
    },
    {
      es: "Quieres empezar sin dejar tu trabajo, sin endeudarte y sin esperar a tenerlo todo perfecto.",
      en: "You want to start without quitting your job, taking on debt, or waiting until everything is perfect.",
    },
    {
      es: "Ya intentaste arrancar y te frenaste. No te falta ganas: te falta un orden.",
      en: "You've tried to start before and stalled. You're not short on drive, you're short on sequence.",
    },
    {
      es: "Sabes hacer algo bien y quieres cobrar por ello sin sentirte un impostor.",
      en: "You're good at something and want to charge for it without feeling like a fraud.",
    },
  ] satisfies Txt[],

  /** Descalificar de verdad sube la conversión de los buenos y baja los reembolsos. */
  paraQuienNo: [
    {
      es: "Buscas ingresos pasivos sin trabajar. Aquí hay que hablar con clientes y ejecutar cada semana.",
      en: "You're after passive income with no work. This means talking to customers and executing every week.",
    },
    {
      es: "Quieres levantar inversión para una startup de tecnología. Este curso va de negocios que se financian vendiendo.",
      en: "You want to raise a round for a tech startup. This course is about businesses funded by selling.",
    },
    {
      es: "Esperas una fórmula garantizada. Aquí hay un método probado y trabajo tuyo, no una certeza.",
      en: "You expect a guaranteed formula. What's here is a proven method plus your work, not a certainty.",
    },
    {
      es: "Ya facturas de forma estable y quieres escalar equipo y operaciones. Se te va a quedar corto.",
      en: "You already have steady revenue and want to scale a team and operations. You'll outgrow this fast.",
    },
  ] satisfies Txt[],

  formato: {
    /** ⚠ NO DECLARAR DURACIÓN TOTAL mientras esto sea false. */
    declararDuracion: false,
    horas: null as number | null,

    /** Datos reales del curso. */
    videos: 10,
    conQuiz: true,
    conCertificado: true,

    modalidad: {
      es: "10 videos en línea, a tu ritmo",
      en: "10 online videos, at your own pace",
    },
    acceso: {
      es: "Acceso de por vida, actualizaciones incluidas",
      en: "Lifetime access, updates included",
    },

    // SWAP (HECHO): confirma que TODO lo de esta lista existe de verdad.
    incluye: [
      {
        es: "10 videos, uno por módulo, con acceso de por vida",
        en: "10 videos, one per module, with lifetime access",
      },
      {
        es: "Un quiz al final de cada video para fijar lo aprendido",
        en: "A quiz after every video to lock in what you learned",
      },
      {
        es: "Plantillas listas para usar: validación, canvas, precios, flujo de caja y guion de ventas",
        en: "Ready-to-use templates: validation, canvas, pricing, cash flow and sales script",
      },
      {
        es: "Ejercicios al final de cada módulo, para salir con algo hecho y no solo aprendido",
        en: "Exercises at the end of every module, so you leave with something done, not just learned",
      },
      {
        es: "Comunidad privada de alumnos",
        en: "Private student community",
      },
      {
        es: "Certificación de Fundamentos de Emprende180 al completar los 10 quizzes",
        en: "Fundamentos de Emprende180 certification once you pass all 10 quizzes",
      },
    ] satisfies Txt[],

    requisitos: [
      {
        es: "Ninguno. Se empieza desde cero, con o sin idea.",
        en: "None. You start from zero, with or without an idea.",
      },
    ] satisfies Txt[],
    idioma: { es: "Español", en: "Spanish" },
    nivel: {
      es: "De principiante a intermedio",
      en: "Beginner to intermediate",
    },
  },

  /**
   * ─── PRECIO Y ANCLA ──────────────────────────────────────────────────────
   *
   * El ancla es la técnica: enseñar primero una cifra alta (3.990) para que la
   * real (490) se lea como lo que es. Funciona, pero SOLO si la cifra alta se
   * sostiene. Un ancla que no se justifica no ancla nada: levanta sospechas.
   *
   * Por eso hay dos piezas que van juntas y no se pueden separar:
   *   · `desglose` — qué compone esos 3.990, componente a componente.
   *   · `framing`  — cómo se presenta esa cifra.
   *
   * SOBRE EL FRAMING (esto es legal, no estético):
   *
   *   'descuento'   → «3.990 tachado, hoy 490». Solo es legítimo si el curso
   *                   SE OFRECIÓ DE VERDAD a 3.990 durante un periodo real.
   *                   PROFECO (México) y la FTC (EE. UU.) exigen que el precio
   *                   anterior tachado haya sido real y vigente; inventarlo es
   *                   publicidad engañosa y es sancionable.
   *
   *   'lanzamiento' → «490, precio de fundadores. Subirá a 3.990». Presenta la
   *                   cifra alta como precio FUTURO, no pasado. Genera la misma
   *                   urgencia, es verdad desde el primer día y no hay que
   *                   demostrar ningún histórico.
   *
   * ACTIVO: 'lanzamiento'. Si algún día el curso se vende de verdad a 3.990 y
   * luego se baja, entonces —y solo entonces— tiene sentido pasar a 'descuento'.
   */
  precio: {
    /* El símbolo y los separadores los pone `formatMoney` con Intl. Aquí no
       hay ni un "$" escrito a mano ni un separador de miles decidido a dedo. */
    moneda: "USD",

    /** Lo que se paga hoy. */
    actual: 490,

    /**
     * La cifra ancla. Con `framing: 'lanzamiento'` es el precio FUTURO;
     * con `'descuento'`, el precio anterior (que debe haber sido real).
     * Tiene que cuadrar con la suma de `desglose`.
     */
    referencia: 3990,

    /** SWAP: 'lanzamiento' | 'descuento'. Ver el bloque de arriba. */
    framing: "lanzamiento" as "lanzamiento" | "descuento",

    /**
     * Pago fraccionado. `null` si no se ofrece.
     * 3 × 164 = 492: prácticamente sin recargo sobre 490.
     * SWAP (HECHO): ajusta a lo que ofrezca de verdad tu pasarela.
     */
    cuotas: { numero: 3, importe: 164 },

    nota: {
      es: "Pago único o 3 mensualidades. Los impuestos dependen de tu país y se calculan al pagar, así que ves el total antes de confirmar.",
      en: "One payment or 3 installments. Taxes depend on your country and are calculated at checkout, so you see the total before confirming.",
    },
    urlCheckout: "#", // SWAP (HECHO): URL real de la pasarela

    /**
     * ─── EL DESGLOSE QUE SOSTIENE EL ANCLA ─────────────────────────────────
     *
     * Sin esto, los 3.990 son un número puesto ahí. Con esto, son una suma que
     * el visitante puede recorrer y comprobar.
     *
     * ⚠️ Estos importes son TU valoración de cada componente, no un hecho del
     * mundo. La prueba a la que tienen que sobrevivir es simple: si un cliente
     * te pregunta «¿por qué las plantillas valen 690?», ¿tienes respuesta? Si
     * no la tienes, baja el número. Un desglose inflado hace más daño que no
     * poner desglose.
     *
     * La suma DEBE dar `referencia`. La sección lo comprueba al construir y
     * avisa en pantalla si no cuadra, para que no se descuadre en silencio al
     * tocar un valor.
     */
    desglose: [
      {
        valor: 1490,
        titulo: {
          es: "10 videos con quiz, de la idea a la primera venta",
          en: "10 videos with quizzes, from idea to first sale",
        },
        detalle: {
          es: "El método completo, en el orden en que hay que hacerlo. Cada video cierra con un quiz que te dice si de verdad lo fijaste.",
          en: "The full method, in the order you actually need it. Each video closes with a quiz that tells you whether it really stuck.",
        },
      },
      {
        valor: 890,
        titulo: {
          es: "12 plantillas listas para usar",
          en: "12 ready-to-use templates",
        },
        detalle: {
          es: "Validación, business model canvas, calculadora de precios, flujo de caja y guion de ventas. Rellenas y usas.",
          en: "Validation, business model canvas, pricing calculator, cash flow and sales script. Fill them in and go.",
        },
      },
      {
        valor: 790,
        titulo: {
          es: "Sesiones en vivo de preguntas",
          en: "Live Q&A sessions",
        },
        detalle: {
          es: "Traes tu caso concreto y sales con una respuesta. Quedan grabadas si no puedes asistir.",
          en: "Bring your specific case and leave with an answer. Recorded in case you can't make it.",
        },
      },
      {
        valor: 620,
        titulo: {
          es: "Comunidad privada de alumnos",
          en: "Private student community",
        },
        detalle: {
          es: "Gente que va dos pasos por delante y gente que va dos por detrás. Las dos cosas sirven.",
          en: "People two steps ahead of you and people two steps behind. Both help.",
        },
      },
      {
        valor: 200,
        titulo: {
          es: "Certificación, acceso de por vida y actualizaciones",
          en: "Certification, lifetime access and updates",
        },
        detalle: {
          es: "Tu certificación al aprobar los 10 quizzes, y el curso disponible para volver cuando lo necesites.",
          en: "Your certificate once you pass all 10 quizzes, and the course there whenever you need to come back.",
        },
      },
    ],

    /**
     * ─── URGENCIA ──────────────────────────────────────────────────────────
     *
     * NUNCA un contador que se reinicia en cada visita. Es el truco que más
     * rápido quema la confianza: basta con recargar para descubrirlo, y quien
     * lo descubre no vuelve.
     *
     *   'lanzamiento' → «Precio de lanzamiento por tiempo limitado». Sin
     *                   cuenta atrás. Verdad desde el día uno.
     *   'cupos'       → solo si el cupo es REAL y lo vas a respetar.
     *   'fecha'       → solo con una fecha de cierre REAL. ISO 8601.
     *   'ninguna'     → sin elemento de urgencia.
     */
    urgencia: {
      tipo: "lanzamiento" as "lanzamiento" | "cupos" | "fecha" | "ninguna",
      cupos: null as number | null, // SWAP (HECHO): solo si es real
      fechaCierre: null as string | null, // SWAP (HECHO): ISO 8601, solo si es real
    },
  },

  /** ⚠ Sin fechas ni cupos mientras no sean reales. La escasez inventada se nota. */
  fechas: {
    inscripcionAbierta: true,
    fechaCierre: null as string | null, // SWAP (HECHO)
    plazas: null as number | null, // SWAP (HECHO)
  },
} as const;

// ─── Instructor ──────────────────────────────────────────────────────────────

/**
 * ⚠️ TODO LO DE AQUÍ ES UN HECHO. NADA ESTÁ INVENTADO NI DEBE INVENTARSE.
 *
 * La bio tiene tres partes y funcionan en este orden:
 *
 *   1. GANCHO      — de dónde vienes. Idealmente desde donde está el lector
 *                    ahora. "Monté mi primer negocio sin saber nada y lo cerré
 *                    a los dos años" conecta más que cualquier título.
 *   2. CREDIBILIDAD — qué has conseguido, con números y fechas. Verificable.
 *   3. POR QUÉ ENSEÑAS — qué te llevó a dar el curso. Evita el "quiero ayudar
 *                    a la gente": di qué viste que te hizo montarlo.
 *
 * EJEMPLO DE CÓMO SE VE RELLENA (esto es un EJEMPLO, no la bio real):
 *
 *   "Monté mi primer negocio a los 24 sin capital y lo cerré a los 26 debiendo
 *    dinero. Con el segundo hice lo contrario: hablé con 40 clientes antes de
 *    construir nada. Hoy factura seis cifras al año con un equipo de cuatro
 *    personas. Doy este curso porque el 90 % de lo que me costó tres años
 *    entender se explica en una tarde, y nadie me lo explicó."
 *
 * Fíjate en lo que hace ese ejemplo: empieza con un fracaso (credibilidad
 * barata no, credibilidad real), da números concretos y termina con un motivo
 * que no suena a folleto. Escribe el tuyo con esa estructura y tus datos.
 */
export const instructor = {
  nombre: "[COMPLETAR: nombre y apellido]", // SWAP (HECHO)
  rol: {
    es: "[COMPLETAR: cargo real, p. ej. «Fundador de [Negocio]»]",
    en: "[COMPLETAR: real title, e.g. “Founder of [Business]”]",
  },
  bio: {
    es: "[COMPLETAR: 1) de dónde vienes, incluido lo que salió mal. 2) qué has conseguido, con números y fechas verificables. 3) por qué das este curso. Tres o cuatro frases. Ver el ejemplo en el comentario de arriba.]",
    en: "[COMPLETAR: 1) where you came from, including what went wrong. 2) what you've achieved, with verifiable numbers and dates. 3) why you teach this. Three or four sentences. See the example in the comment above.]",
  },

  /**
   * CREDIBILIDAD CON EVIDENCIA. Cada punto tiene que ser verificable.
   *
   * Mal:  "experto reconocido en emprendimiento"
   * Bien: "1.200 alumnos formados desde 2019" · "Mentor en [Aceleradora]"
   *
   * `prueba` es el enlace que lo respalda. Si no tienes enlace, deja `null`,
   * pero que el dato sea comprobable si alguien pregunta.
   */
  credenciales: [
    {
      dato: {
        es: "[COMPLETAR: años emprendiendo y cuántos negocios has fundado]",
        en: "[COMPLETAR: years in business and how many companies you've founded]",
      },
      prueba: null, // SWAP (HECHO)
    },
    {
      dato: {
        es: "[COMPLETAR: un resultado con cifra y año, p. ej. facturación o alumnos]",
        en: "[COMPLETAR: one result with a number and a year, e.g. revenue or students]",
      },
      prueba: null, // SWAP (HECHO)
    },
    {
      dato: {
        es: "[COMPLETAR: reconocimiento, mentoría o colaboración verificable]",
        en: "[COMPLETAR: an award, mentorship or verifiable collaboration]",
      },
      prueba: null, // SWAP (HECHO): enlace que lo demuestre
    },
    {
      dato: {
        es: "[COMPLETAR: publicaciones, ponencias o medios donde has salido]",
        en: "[COMPLETAR: publications, talks or press features]",
      },
      prueba: null, // SWAP (HECHO)
    },
  ] satisfies Credencial[],

  /* Esto sí es copy: define el alcance del curso, no las credenciales de nadie.
     Aun así, revisa que coincide con lo que de verdad enseñas. */
  queEnsena: [
    {
      es: "Validar una idea hablando con clientes antes de gastar un dólar",
      en: "Validating an idea by talking to customers before spending a dollar",
    },
    {
      es: "Construir una oferta y ponerle precio con criterio y margen",
      en: "Building an offer and pricing it with judgment and margin",
    },
    {
      es: "Vender de tú a tú, sin técnicas agresivas ni guiones enlatados",
      en: "Selling one-on-one, without pushy tactics or canned scripts",
    },
    {
      es: "Montar un negocio de servicios o de producto simple desde cero",
      en: "Starting a service business or a simple product business from scratch",
    },
  ] satisfies Txt[],

  /* Decir qué NO cubre el curso sube la confianza más que cualquier credencial,
     y evita reembolsos de gente que esperaba otra cosa. Tiene que ser sincero. */
  queNoCubre: [
    {
      es: "Publicidad pagada avanzada. Verás lo básico, pero no vas a aprender a escalar campañas.",
      en: "Advanced paid ads. You'll see the basics, but you won't learn to scale campaigns.",
    },
    {
      es: "Programación ni desarrollo de producto tecnológico.",
      en: "Coding or technical product development.",
    },
    {
      es: "Cómo levantar inversión o preparar una ronda.",
      en: "Raising capital or prepping a funding round.",
    },
    {
      es: "Contabilidad avanzada o fiscalidad internacional. Verás lo mínimo para operar en regla.",
      en: "Advanced accounting or international tax. You'll see the minimum to operate properly.",
    },
  ] satisfies Txt[],

  foto: "/imagenes/instructor/instructor.webp",
  fotoCuadrada: "/imagenes/instructor/instructor-cuadrado.webp",
  fotoAlt: {
    es: "[COMPLETAR: retrato de [nombre], instructor del curso]",
    en: "[COMPLETAR: portrait of [name], the course instructor]",
  },

  redes: {
    linkedin: null as string | null, // SWAP (HECHO)
    instagram: null as string | null, // SWAP (HECHO)
    youtube: null as string | null, // SWAP (HECHO)
  },
} as const;

// ─── Temario ─────────────────────────────────────────────────────────────────
/**
 * Diez módulos, en el orden en que hay que hacerlos.
 *
 * Cada uno vende por CAPACIDAD, no por tema: el título engancha y `logras`
 * dice qué sabe hacer el alumno al terminarlo. Un temario que lista temas
 * ("Módulo 4: MVP") vende mucho menos que uno que lista resultados.
 *
 * Sin duraciones: ver la regla 2 de la cabecera del archivo.
 */
export const temario: Modulo[] = [
  {
    numero: 1,
    titulo: {
      es: "Deja de dudar: elige una idea y ponla a prueba",
      en: "Stop second-guessing: pick one idea and put it to the test",
    },
    logras: {
      es: "Sales con una sola idea elegida con criterio y un plan concreto para comprobar si tiene demanda, en vez de seguir dándole vueltas.",
      en: "You leave with one idea chosen on purpose and a concrete plan to check whether there's demand, instead of turning it over in your head again.",
    },
    lecciones: [
      { es: "El coste real de no decidir", en: "What indecision actually costs you" },
      { es: "El filtro de las 3 preguntas para descartar ideas", en: "The 3-question filter for killing ideas" },
      { es: "Cómo se ve una idea validada, y cómo una que no lo está", en: "What a validated idea looks like, and what it doesn't" },
    ],
  },
  {
    numero: 2,
    titulo: {
      es: "A quién le vendes: encuentra a tu cliente antes de crear nada",
      en: "Who you're selling to: find your customer before you build anything",
    },
    logras: {
      es: "Describes a tu cliente por su problema, su presupuesto y dónde está, y tienes agendadas tus primeras conversaciones con gente real.",
      en: "You describe your customer by their problem, their budget and where they are, and you have your first conversations with real people booked.",
    },
    lecciones: [
      { es: "Del «todo el mundo» al cliente concreto", en: "From “everyone” to one specific customer" },
      { es: "20 conversaciones valen más que 200 encuestas", en: "20 conversations beat 200 surveys" },
      { es: "Dónde está tu cliente ahora mismo (y cómo llegar a él)", en: "Where your customer is right now, and how to reach them" },
    ],
  },
  {
    numero: 3,
    titulo: {
      es: "Tu modelo de negocio en una sola hoja",
      en: "Your entire business model on one page",
    },
    logras: {
      es: "Tienes tu business model canvas completo y una propuesta de valor que cualquiera entiende a la primera, sin que tengas que explicarla.",
      en: "You have a complete business model canvas and a value proposition anyone gets the first time, without you having to explain it.",
    },
    lecciones: [
      { es: "El canvas sin teoría: cómo se llena de verdad", en: "The canvas without the theory: how it actually gets filled in" },
      { es: "La frase que explica tu negocio en diez segundos", en: "The sentence that explains your business in ten seconds" },
      { es: "Por qué nadie entiende qué vendes (y cómo arreglarlo)", en: "Why nobody understands what you sell, and how to fix it" },
    ],
  },
  {
    numero: 4,
    titulo: {
      es: "Lanza tu versión mínima sin gastar de más",
      en: "Launch your minimum version without overspending",
    },
    logras: {
      es: "Tienes algo vendible listo en semanas, con lo mínimo indispensable, sin deuda y sin haber construido funciones que nadie pidió.",
      en: "You have something sellable ready in weeks, with the bare minimum, no debt, and none of the features nobody asked for.",
    },
    lecciones: [
      { es: "Qué es «mínimo» y qué es «viable»", en: "What “minimum” means and what “viable” means" },
      { es: "Herramientas gratis o casi para montarlo tú", en: "Free or nearly-free tools to build it yourself" },
      { es: "Cuándo NO construir nada todavía", en: "When NOT to build anything yet" },
    ],
  },
  {
    numero: 5,
    titulo: {
      es: "Ponle precio sin miedo y que salgan los números",
      en: "Price it without flinching, and make the numbers work",
    },
    logras: {
      es: "Fijas un precio con margen real, sabes cuánto te cuesta cada venta y tienes preparada la respuesta para cuando te digan que está caro.",
      en: "You set a price with real margin, know what each sale costs you, and have an answer ready for when someone says it's expensive.",
    },
    lecciones: [
      { es: "Coste, precio y valor no son lo mismo", en: "Cost, price and value are three different things" },
      { es: "Tus unit economics en una sola tabla", en: "Your unit economics in a single table" },
      { es: "Qué contestar a «está caro» sin bajar el precio", en: "What to say to “that's expensive” without discounting" },
    ],
  },
  {
    numero: 6,
    titulo: {
      es: "Tus primeros clientes: vender sin sentirte vendedor",
      en: "Your first customers: selling without feeling like a salesperson",
    },
    logras: {
      es: "Tienes una lista de contactos calificados, un guion propio que no suena a guion, y la primera venta cerrada y cobrada.",
      en: "You have a list of qualified prospects, your own script that doesn't sound like a script, and your first sale closed and paid.",
    },
    lecciones: [
      { es: "De dónde salen tus primeros 100 contactos", en: "Where your first 100 prospects come from" },
      { es: "El guion que no suena a guion", en: "The script that doesn't sound like one" },
      { es: "Cómo manejar el «déjame pensarlo»", en: "How to handle “let me think about it”" },
    ],
  },
  {
    numero: 7,
    titulo: {
      es: "Flujo de caja: lo que mata más negocios que la falta de ventas",
      en: "Cash flow: what kills more businesses than lack of sales",
    },
    logras: {
      es: "Llevas tus números básicos en una plantilla y sabes con cuántos meses de aire cuentas, cuándo reinvertir y cuándo frenar.",
      en: "You track your basic numbers in one spreadsheet and know how many months of runway you have, when to reinvest and when to pull back.",
    },
    lecciones: [
      { es: "Facturar no es ganar: ingreso, margen y caja", en: "Revenue isn't profit: income, margin and cash" },
      { es: "Tu plantilla de flujo de caja, paso a paso", en: "Your cash flow template, step by step" },
      { es: "Las tres señales de que te vas a quedar sin caja", en: "The three signs you're about to run out of cash" },
    ],
  },
  {
    numero: 8,
    titulo: {
      es: "Lo legal sin dolor: lo mínimo para dormir tranquilo",
      en: "The legal side, painlessly: the minimum to sleep at night",
    },
    logras: {
      es: "Sabes cuándo te toca formalizar, qué impuestos te afectan y qué papeles necesitas antes de emitir tu primera factura.",
      en: "You know when you need to register, which taxes apply to you, and what paperwork you need before issuing your first invoice.",
    },
    lecciones: [
      { es: "Cuándo formalizar y cuándo todavía no hace falta", en: "When to register, and when you don't need to yet" },
      { es: "Impuestos básicos explicados sin susto", en: "Basic taxes explained without the scare" },
      { es: "Qué cambia según tu país y cómo averiguarlo bien", en: "What changes by country, and how to find out properly" },
    ],
  },
  {
    numero: 9,
    titulo: {
      es: "Marca y marketing: que te encuentren en vez de perseguir",
      en: "Brand and marketing: get found instead of chasing",
    },
    logras: {
      es: "Tienes una presencia digital coherente y un solo canal funcionando que te trae clientes sin publicar todos los días.",
      en: "You have a coherent digital presence and one channel working that brings you customers without posting every single day.",
    },
    lecciones: [
      { es: "Marca no es el logo", en: "Your brand is not your logo" },
      { es: "Elegir UN canal y hacerlo bien", en: "Pick ONE channel and do it properly" },
      { es: "Contenido que vende sin parecer publicidad", en: "Content that sells without looking like an ad" },
    ],
  },
  {
    numero: 10,
    titulo: {
      es: "Escalar sin quemarte: qué hacer después de la primera venta",
      en: "Scaling without burning out: what to do after the first sale",
    },
    logras: {
      es: "Conviertes lo que funcionó en un proceso semanal repetible y sabes qué delegar o automatizar primero, y cuándo subir precios.",
      en: "You turn what worked into a repeatable weekly process and know what to delegate or automate first, and when to raise prices.",
    },
    lecciones: [
      { es: "Repetir lo que funcionó (y dejar de improvisar)", en: "Repeat what worked, and stop improvising" },
      { es: "Primera contratación o primera automatización", en: "First hire or first automation" },
      { es: "Cuándo y cómo subir precios", en: "When and how to raise your prices" },
    ],
  },
];

// ─── Lead magnet ─────────────────────────────────────────────────────────────
/**
 * El imán principal. NO es un PDF: es un mini-curso por email de 7 días.
 *
 * Cada día entrega UNA micro-victoria: algo que el lector puede hacer en diez
 * minutos y que le deja un resultado en la mano. Ese es el motivo por el que
 * deja su email, así que este bloque tiene que ser tan específico como el
 * temario del curso de pago.
 *
 * Aquí SÍ se declara el plazo, porque el plazo es la promesa.
 */
export const leadMagnet = {
  nombre: {
    es: "Valida tu idea de negocio en 7 días",
    en: "Validate your business idea in 7 days",
  },
  promesa: {
    es: "Siete emails, siete días, diez minutos al día. Al terminar sabrás si tu idea tiene clientes dispuestos a pagar, o cuál de tus ideas sí los tiene. Gratis y sin tarjeta.",
    en: "Seven emails, seven days, ten minutes a day. By the end you'll know whether your idea has customers willing to pay, or which of your ideas does. Free, no credit card.",
  },
  formato: {
    es: "7 emails · uno al día · 10 minutos cada uno · gratis",
    en: "7 emails · one a day · 10 minutes each · free",
  },
  duracionDias: 7,

  dias: [
    {
      dia: 1,
      titulo: { es: "Elige una y suelta el resto", en: "Pick one, drop the rest" },
      entrega: {
        es: "El filtro de 3 preguntas para quedarte con una sola idea en 20 minutos. Terminas el día con una decisión tomada, no con una lista.",
        en: "The 3-question filter to land on one idea in 20 minutes. You finish the day with a decision made, not a list.",
      },
    },
    {
      dia: 2,
      titulo: { es: "Ponle cara a tu cliente", en: "Put a face to your customer" },
      entrega: {
        es: "Cómo describir a quién le vendes sin caer en el «a todo el mundo». Sales con un perfil concreto y tres sitios donde encontrarlo.",
        en: "How to describe who you're selling to without landing on “everyone”. You leave with one specific profile and three places to find them.",
      },
    },
    {
      dia: 3,
      titulo: { es: "El problema por el que sí pagan", en: "The problem people actually pay for" },
      entrega: {
        es: "A separar lo que la gente dice que quiere de lo que de verdad paga. Con ejemplos reales de ideas que sonaban bien y no vendían.",
        en: "How to tell what people say they want apart from what they actually pay for. With real examples of ideas that sounded great and didn't sell.",
      },
    },
    {
      dia: 4,
      titulo: { es: "La conversación de 15 minutos", en: "The 15-minute conversation" },
      entrega: {
        es: "El guion exacto, pregunta por pregunta, para hablar con 5 clientes potenciales esta semana sin que parezca una encuesta.",
        en: "The exact script, question by question, to talk to 5 prospects this week without it feeling like a survey.",
      },
    },
    {
      dia: 5,
      titulo: { es: "Distinguir el interés de la intención", en: "Interest versus intent" },
      entrega: {
        es: "Cómo saber si un «qué interesante» es un «te lo compro». Las tres señales que confirman demanda y las tres que la fingen.",
        en: "How to tell “that's interesting” from “I'll take it”. The three signals that confirm demand and the three that fake it.",
      },
    },
    {
      dia: 6,
      titulo: { es: "La prueba de 48 horas", en: "The 48-hour test" },
      entrega: {
        es: "Un test que puedes montar en una tarde para confirmar que hay demanda antes de construir nada ni gastar un dólar.",
        en: "A test you can set up in an afternoon to confirm there's demand before building anything or spending a dollar.",
      },
    },
    {
      dia: 7,
      titulo: { es: "Tu veredicto y los próximos 30 días", en: "Your verdict and the next 30 days" },
      entrega: {
        es: "Adelante, pivota o descarta: decides con datos, no con corazonadas. Y te llevas el plan de las cuatro semanas siguientes en una hoja.",
        en: "Go, pivot or drop it: you decide with data, not gut feel. Plus your plan for the next four weeks on a single page.",
      },
    },
  ] satisfies DiaLeadMagnet[],

  cta: { es: "Quiero el reto de 7 días", en: "Get the 7-day challenge" },
  titularFormulario: {
    es: "Empieza hoy. Gratis.",
    en: "Start today. Free.",
  },
  aviso: {
    es: "Sin spam. Un email al día durante 7 días y ya está. Te das de baja en un clic.",
    en: "No spam. One email a day for 7 days, that's it. Unsubscribe in one click.",
  },

  /* La expectativa tiene que ser exacta: si dices "en minutos" y tarda una
     hora, el lead da por hecho que no llegó y te marca como spam. */
  exito: {
    titulo: { es: "Listo. Revisa tu correo.", en: "Done. Check your inbox." },
    texto: {
      es: "El día 1 llega en unos minutos. Si no lo ves, busca en Promociones o Spam y muévelo a tu bandeja principal: así no se pierden los otros seis.",
      en: "Day 1 lands in a few minutes. If you don't see it, check Promotions or Spam and drag it to your primary inbox so the other six don't get lost.",
    },
  },
} as const;

// ─── Prueba social ───────────────────────────────────────────────────────────
/**
 * ⚠️ CERO TESTIMONIOS INVENTADOS. Estas tarjetas están vacías A PROPÓSITO.
 *
 * QUÉ RECOLECTAR. Un testimonio que convierte tiene cuatro cosas:
 *
 *   1. RESULTADO CONCRETO, mejor con número o plazo.
 *      «Cerré mi primer cliente en la semana 6» convence.
 *      «Muy buen curso, lo recomiendo» no dice nada.
 *   2. EL ANTES. De dónde partía. El lector busca a alguien como él, y si no
 *      sabe de dónde salió esa persona, no puede compararse.
 *   3. NOMBRE Y APELLIDO REALES + a qué se dedica y de dónde es.
 *      Un «María G.» sin más pesa la mitad.
 *   4. FOTO real, cuadrada, 400×400. Sin foto se muestran las iniciales, que
 *      es honesto, pero una cara convierte más.
 *
 * CÓMO PEDIRLO. No preguntes «¿qué te pareció el curso?». Pregunta:
 *   · ¿Dónde estabas antes de empezar?
 *   · ¿Qué conseguiste, en concreto? ¿En cuánto tiempo?
 *   · ¿Qué le dirías a alguien que está donde estabas tú?
 *
 * PERMISO POR ESCRITO, siempre, y guardado. Publicar el nombre y la foto de
 * alguien sin su consentimiento expreso es un problema legal, no un descuido.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CÓMO SE VE UNO BUENO (ejemplo, NO publicar: aquí no hay ningún alumno real)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   nombre:   "Daniela Restrepo"
 *   contexto: "Repostería por encargo · Medellín"
 *   resultado:"Primer cliente en la semana 6"
 *   cita:     "Llevaba dos años diciendo que iba a vender mis pasteles y nunca
 *              pasaba de la idea. En el módulo 2 hablé con 14 personas y tres
 *              me preguntaron el precio antes de que yo se los diera. Esa
 *              semana cobré el primer pedido."
 *
 *   nombre:   "Andrés Peña"
 *   contexto: "Diseño web freelance · Guadalajara"
 *   resultado:"Subió su precio un 60 %"
 *   cita:     "Cobraba lo que me daba vergüenza cobrar. Con la calculadora del
 *              módulo 5 vi que estaba perdiendo dinero en cada proyecto. Subí
 *              el precio y no perdí un solo cliente."
 *
 * Fíjate en lo que hacen: cuentan el ANTES, dan un número o un plazo, y usan
 * palabras de persona normal. Ninguno dice «excelente curso, muy recomendado»,
 * que es lo que sale si preguntas «¿qué te pareció?».
 *
 * ⚠️ Los dos ejemplos de arriba son inventados y están en un comentario a
 * propósito: sirven de molde para lo que tienes que recolectar, NO para
 * publicarlos. Un testimonio falso en una landing es publicidad engañosa.
 */
export const testimonios: Testimonio[] = [
  {
    nombre: "[COMPLETAR: nombre y apellido]", // SWAP (HECHO)
    contexto: {
      es: "[COMPLETAR: a qué se dedica y ciudad]",
      en: "[COMPLETAR: what they do and their city]",
    },
    cita: {
      es: "PLACEHOLDER — AQUÍ VA UN TESTIMONIO REAL. Pídeselo a un alumno con permiso por escrito. Que incluya de dónde partía, qué consiguió y en cuánto tiempo.",
      en: "PLACEHOLDER — A REAL TESTIMONIAL GOES HERE. Ask a student, with written permission. It should cover where they started, what they achieved and how long it took.",
    },
    foto: null, // SWAP (HECHO): "/imagenes/testimonios/nombre.webp"
    resultado: {
      es: "[COMPLETAR: resultado con cifra o plazo]",
      en: "[COMPLETAR: result with a number or timeframe]",
    },
  },
  {
    nombre: "[COMPLETAR: nombre y apellido]", // SWAP (HECHO)
    contexto: {
      es: "[COMPLETAR: a qué se dedica y ciudad]",
      en: "[COMPLETAR: what they do and their city]",
    },
    cita: {
      es: "PLACEHOLDER — AQUÍ VA UN TESTIMONIO REAL. Busca uno que hable del miedo a empezar: es la objeción número uno de esta página.",
      en: "PLACEHOLDER — A REAL TESTIMONIAL GOES HERE. Look for one about the fear of starting: it's the number-one objection on this page.",
    },
    foto: null, // SWAP (HECHO)
    resultado: {
      es: "[COMPLETAR: resultado con cifra o plazo]",
      en: "[COMPLETAR: result with a number or timeframe]",
    },
  },
  {
    nombre: "[COMPLETAR: nombre y apellido]", // SWAP (HECHO)
    contexto: {
      es: "[COMPLETAR: a qué se dedica y ciudad]",
      en: "[COMPLETAR: what they do and their city]",
    },
    cita: {
      es: "PLACEHOLDER — AQUÍ VA UN TESTIMONIO REAL. Idealmente de alguien que empezó sin idea clara, para cubrir esa objeción.",
      en: "PLACEHOLDER — A REAL TESTIMONIAL GOES HERE. Ideally from someone who started with no clear idea, to cover that objection.",
    },
    foto: null, // SWAP (HECHO)
    resultado: {
      es: "[COMPLETAR: resultado con cifra o plazo]",
      en: "[COMPLETAR: result with a number or timeframe]",
    },
  },
];

/**
 * ⚠️ Cifras agregadas. Mientras `sonReales` sea false NO se muestran ni se
 * emiten en el JSON-LD. Google penaliza el `aggregateRating` sin reseñas
 * detrás, y un «+2.000 alumnos» inventado es lo primero que alguien comprueba.
 */
export const cifras = {
  sonReales: false, // SWAP (HECHO): true solo cuando los tres números sean verificables
  alumnos: 0, // SWAP (HECHO)
  valoracionMedia: 0, // SWAP (HECHO): sobre 5
  numeroValoraciones: 0, // SWAP (HECHO)
} as const;

// ─── Garantía ────────────────────────────────────────────────────────────────
/**
 * Reducción de riesgo. Va ANTES del precio: el miedo aparece justo al ver la
 * cifra, así que se neutraliza un momento antes.
 *
 * El copy está escrito para dar confianza sin sonar a letra chica: plazo claro,
 * una sola condición razonable y el proceso en una frase. `dias` y la condición
 * son parámetros: ajústalos a lo que de verdad puedas cumplir.
 *
 * ⚠️ Lo que escribas aquí tiene que coincidir PALABRA POR PALABRA con la
 * cláusula de devoluciones de los términos, en los dos idiomas.
 */
export const garantia = {
  activa: true,
  dias: 30, // SWAP (HECHO): plazo real de devolución

  titulo: {
    es: "Garantía de 30 días",
    en: "30-day guarantee",
  },
  /**
   * Versión de una línea, para la tarjeta de precio.
   * La garantía dejó de ser una sección entera: ocupaba una pantalla para
   * decir una frase, y el sitio donde de verdad hace falta es junto al botón.
   */
  resumen: {
    es: "Si no es para ti, escribes a soporte y te devolvemos el 100 %. Sin formularios ni preguntas.",
    en: "If it's not for you, email support and we refund 100%. No forms, no questions.",
  },
  texto: {
    es: "Entra, haz los ejercicios de los primeros módulos y ponlos a prueba con clientes reales. Si en 30 días ves que no es para ti, escribes a soporte y te devolvemos el 100 %. Sin formularios, sin llamadas de retención y sin que tengas que justificar nada.",
    en: "Get in, do the exercises in the first modules and test them with real customers. If within 30 days you decide it isn't for you, email support and we refund 100%. No forms, no retention calls, and no need to justify anything.",
  },
  /** La condición, dicha en claro. Una sola y razonable. */
  condicion: {
    es: "Lo único que pedimos es que lo hayas intentado: que hayas hecho los ejercicios. Si ni siquiera abriste el curso, también te devolvemos el dinero, pero preferimos que lo pruebes.",
    en: "The only thing we ask is that you actually tried it: that you did the exercises. If you never even opened the course we'll still refund you, but we'd rather you gave it a shot.",
  },
} as const;

// ─── FAQs ────────────────────────────────────────────────────────────────────
/**
 * Cada pregunta desactiva una OBJECIÓN DE COMPRA real. Si una no lo hace,
 * sobra. Van después del precio porque las dudas que quedan vivas a esas
 * alturas son justo las que nacen al ver la cifra.
 *
 * Las respuestas son completas y honestas: media respuesta genera más duda que
 * ninguna. Donde hace falta un dato tuyo, va marcado `[COMPLETAR: …]`.
 */
export const faqs: Faq[] = [
  {
    pregunta: {
      es: "No tengo experiencia en negocios. ¿Me va a servir?",
      en: "I have no business experience. Will this work for me?",
    },
    respuesta: {
      es: "Sí, el curso está pensado justo para eso. Se empieza desde cero y no se da por sabido nada: ni contabilidad, ni marketing, ni haber vendido antes. Lo que sí necesitas es tiempo para hacer los ejercicios y disposición para hablar con clientes potenciales, que es lo que de verdad mueve la aguja.",
      en: "Yes, that's exactly who it's built for. You start from zero and nothing is assumed: no accounting, no marketing, no prior sales experience. What you do need is time to do the exercises and a willingness to talk to potential customers, which is what actually moves the needle.",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo necesito a la semana?",
      en: "How much time do I need each week?",
    },
    respuesta: {
      es: "Cuenta con [COMPLETAR: X horas] a la semana: una parte para ver el módulo y otra, la más importante, para hacer los ejercicios y hablar con clientes. Si una semana no puedes, no pasa nada: el acceso no caduca y retomas donde lo dejaste. Pero avanzar sin hacer los ejercicios no sirve de mucho.",
      en: "Plan on [COMPLETAR: X hours] a week: part for watching the module and part, the more important one, for doing the exercises and talking to customers. If a week goes sideways, no problem: access doesn't expire and you pick up where you left off. But moving ahead without doing the exercises won't get you far.",
    },
  },
  {
    pregunta: {
      es: "¿Las clases son en vivo o grabadas?",
      en: "Are the classes live or recorded?",
    },
    respuesta: {
      es: "[COMPLETAR: describe el formato real. Ej.: «Todos los módulos están grabados y disponibles desde el primer día, así que avanzas a tu ritmo. Además hay sesiones en vivo de preguntas cada X semanas, y quedan grabadas por si no puedes asistir».]",
      en: "[COMPLETAR: describe the real format. E.g. “All modules are pre-recorded and available from day one, so you go at your own pace. There are also live Q&A sessions every X weeks, and they're recorded in case you can't make it.”]",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo tengo acceso al curso?",
      en: "How long do I have access to the course?",
    },
    respuesta: {
      es: "Acceso de por vida, incluidas las actualizaciones que hagamos más adelante. Pagas una vez y el material es tuyo: puedes volver al módulo de precios dentro de dos años, cuando te toque subirlos. No hay suscripción ni cargos recurrentes.",
      en: "Lifetime access, including any updates we make later. You pay once and the material is yours: you can come back to the pricing module in two years, when it's time to raise them. No subscription, no recurring charges.",
    },
  },
  {
    pregunta: {
      es: "Todavía no tengo una idea de negocio. ¿Puedo entrar igual?",
      en: "I don't have a business idea yet. Can I still join?",
    },
    respuesta: {
      es: "Sí, y de hecho es un buen momento. El módulo 1 está dedicado a elegir la idea correcta y descartar las que no van a ningún lado, así que llegar sin idea fija te ahorra el trabajo de desapegarte de una que ya tenías. Lo que no funciona es entrar esperando que te demos una idea: eso sale de tu experiencia y de las conversaciones que vas a tener.",
      en: "Yes, and honestly it's a good moment to start. Module 1 is all about picking the right idea and killing the ones going nowhere, so arriving without a fixed idea saves you the work of letting go of one. What doesn't work is expecting us to hand you an idea: that comes out of your own experience and the conversations you're about to have.",
    },
  },
  {
    pregunta: {
      es: "¿Hay soporte o estoy solo con los videos?",
      en: "Is there support, or am I alone with the videos?",
    },
    respuesta: {
      es: "[COMPLETAR: describe el soporte real. Ej.: «Tienes acceso a la comunidad privada de alumnos, donde puedes preguntar y ver los casos de otros. Además, [X] sesiones en vivo de preguntas y respuesta por email en un plazo de [Y] días hábiles».] Sé concreto aquí: prometer «soporte» sin decir qué es genera reembolsos.",
      en: "[COMPLETAR: describe the real support. E.g. “You get access to the private student community, where you can ask questions and see other people's cases. Plus [X] live Q&A sessions and email replies within [Y] business days.”] Be specific here: promising vague “support” is what causes refunds.",
    },
  },
  {
    pregunta: {
      es: "¿Puedo pagar en partes?",
      en: "Can I pay in installments?",
    },
    respuesta: {
      es: "Sí. Puedes pagar de una vez o repartirlo en 3 mensualidades. Con el pago fraccionado obtienes el acceso completo desde el primer día, no por partes: entras al curso entero con el primer pago. Los impuestos dependen de tu país y se calculan al pagar, así que ves el importe final antes de confirmar.",
      en: "Yes. You can pay in full or split it into 3 installments. With installments you get full access from day one, not in chunks: the first payment unlocks the whole course. Taxes depend on your country and are calculated at checkout, so you see the final amount before confirming.",
    },
  },
  {
    pregunta: {
      es: "¿Cómo funciona la garantía exactamente?",
      en: "How exactly does the guarantee work?",
    },
    respuesta: {
      es: "Tienes 30 días desde la compra. Si en ese plazo decides que no es para ti, escribes a nuestro correo de soporte y te devolvemos el 100 %. No hay formulario que rellenar, ni llamada para convencerte de que te quedes, ni preguntas incómodas. Lo único que pedimos es que lo hayas intentado: que hayas hecho los ejercicios de los primeros módulos.",
      en: "You have 30 days from purchase. If within that window you decide it isn't for you, email our support address and we refund 100%. No form to fill in, no call to talk you out of it, no awkward questions. The only thing we ask is that you actually tried it: that you did the exercises in the first modules.",
    },
  },
];

// ─── Contacto ────────────────────────────────────────────────────────────────

export const contacto = {
  email: "hola@emprende180.com", // SWAP (HECHO): confirmar
  /** Formato internacional, solo dígitos. Vacío para ocultar el botón. */
  whatsapp: "", // SWAP (HECHO)
  whatsappMensaje: {
    es: "Hola, tengo una duda sobre el curso Emprende180",
    en: "Hi, I have a question about the Emprende180 course",
  },
  razonSocial: "[COMPLETAR: nombre o razón social]", // SWAP (HECHO)
} as const;

// ─── CTA global ──────────────────────────────────────────────────────────────
/**
 * Dos acciones en toda la página, ni una más, y siempre con el mismo texto:
 *
 *  · `primario`   → COMPRAR. Lleva a la sección de precio.
 *  · `secundario` → EMAIL GRATIS. Lleva a la primera captura.
 *
 * El HERO usa el SECUNDARIO a propósito: quien lleva ocho segundos en la página
 * no está listo para pagar, pero sí para dar un email a cambio de algo útil.
 * La compra se pide en la sección 9, con temario, instructor y garantía vistos.
 */
export const cta = {
  primario: {
    texto: { es: "Inscribirme al curso", en: "Enroll in the course" },
    href: "#precio",
  },
  secundario: {
    texto: leadMagnet.cta,
    href: "#gratis",
  },
  /** Cierre de la página. Más directo que los anteriores: ya ha leído todo. */
  final: {
    texto: { es: "Quiero empezar ahora", en: "I want to start now" },
    href: "#precio",
  },
  /** Coletilla del CTA fijo de móvil. `{n}` = número de mensualidades. */
  notaCuotas: { es: "o {n} pagos", en: "or {n} payments" },

  /**
   * Menú del header.
   *
   * Va en contra del instinto de una landing de conversión (cada enlace es una
   * salida), así que estos tres están elegidos con criterio: los tres llevan
   * HACIA la compra, no fuera. Temario y FAQ son las dos objeciones que hacen
   * volver arriba a buscar; tenerlas a un clic evita que se pierdan.
   *
   * Solo se muestra de `md` para arriba: en móvil el CTA fijo ya cubre la
   * acción y meter cuatro enlaces más en 390 px aprieta el logo.
   */
  navegacion: [
    { texto: { es: "Temario", en: "Curriculum" }, href: "#temario" },
    { texto: { es: "Precio", en: "Pricing" }, href: "#precio" },
    { texto: { es: "Preguntas", en: "FAQ" }, href: "#faq" },
  ],
} as const;

// ─── Copy de secciones e interfaz ────────────────────────────────────────────
/**
 * Todo el texto que ve un visitante y que NO es un dato del curso: titulares
 * de sección, etiquetas de formulario, microcopy y textos accesibles.
 *
 * Los `aria-label` y los `alt` también viven aquí: se leen igual que el resto,
 * solo que con un lector de pantalla.
 */
export const copy = {
  hero: {
    microCta: { es: "Gratis. Sin tarjeta.", en: "Free. No credit card." },
    paraTiSi: { es: "Para ti si", en: "This is for you if" },
    pruebaSocial: {
      es: "{alumnos} alumnos · {nota}/5 en {n} valoraciones",
      en: "{alumnos} students · {nota}/5 from {n} reviews",
    },
  },

  problema: {
    aria: { es: "El problema y para quién es", en: "The problem, and who it's for" },
    paraTiTitulo: { es: "Este curso es para ti si…", en: "This course is for you if…" },
    noParaTiTitulo: { es: "NO es para ti si…", en: "It's NOT for you if…" },
  },

  resultados: {
    aria: { es: "Qué vas a lograr", en: "What you'll walk away with" },
    titulo: {
      es: "Qué sabrás hacer al terminar",
      en: "What you'll know how to do by the end",
    },
    entradilla: {
      es: "Nada de teoría. Seis cosas concretas que hoy no sabes hacer y al acabar sí.",
      en: "No theory. Six specific things you can't do today and will by the end.",
    },
  },

  captura: {
    aria: { es: "Mini-curso gratuito por email", en: "Free email mini-course" },
    kicker: { es: "Empieza gratis", en: "Start free" },
  },

  temario: {
    aria: { es: "Temario del curso", en: "Course curriculum" },
    titulo: {
      es: "{n} módulos, en el orden en que hay que hacerlos",
      en: "{n} modules, in the order you actually need them",
    },
    entradilla: {
      es: "Cada módulo termina con algo hecho, no con algo aprendido.",
      en: "Every module ends with something done, not something learned.",
    },
    extrasTitulo: { es: "Además del temario, entra:", en: "Beyond the curriculum:" },
  },

  instructor: {
    aria: { es: "Quién imparte el curso", en: "Who teaches the course" },
    kicker: { es: "Quién te enseña", en: "Who's teaching" },
    credencialesTitulo: { es: "Los datos", en: "The receipts" },
    ensenaTitulo: { es: "Lo que enseño bien", en: "What I'm good at teaching" },
    noCubreTitulo: {
      es: "Lo que este curso NO cubre",
      en: "What this course does NOT cover",
    },
    noCubreNota: {
      es: "Prefiero que lo sepas ahora y no cuando ya hayas pagado.",
      en: "I'd rather you know now than after you've paid.",
    },
    avisoPlaceholder: {
      es: "Faltan los datos del instructor. Son HECHOS: rellénalos en `instructor` de `src/config/curso.config.ts`. No los inventes.",
      en: "Instructor details are missing. These are FACTS: fill them in under `instructor` in `src/config/curso.config.ts`. Don't invent them.",
    },
  },

  pruebaSocial: {
    aria: { es: "Resultados de los alumnos", en: "Student results" },
    titulo: {
      es: "Qué han conseguido otros que empezaban donde tú",
      en: "What people who started where you are have pulled off",
    },
    etiquetaAlumnos: { es: "Alumnos", en: "Students" },
    etiquetaValoracion: { es: "Valoración", en: "Rating" },
    etiquetaNumValoraciones: { es: "Valoraciones", en: "Reviews" },
    avisoPlaceholder: {
      es: "Testimonios pendientes. No se ha inventado ninguno a propósito: pídeselos a alumnos reales, con permiso por escrito. En el comentario de `testimonios` tienes qué preguntar y qué recolectar.",
      en: "Testimonials pending. None were invented, deliberately: ask real students, with written permission. The comment on `testimonios` tells you what to ask for.",
    },
  },

  garantia: {
    aria: { es: "Garantía", en: "Guarantee" },
    remate: { es: "El riesgo lo asumo yo, no tú.", en: "I take the risk, not you." },
    avisoPlaceholder: {
      es: "Ajusta el plazo y las condiciones a lo que de verdad puedas cumplir, y haz que coincidan palabra por palabra con la cláusula de devoluciones de los términos.",
      en: "Match the window and conditions to what you can actually honor, and make them agree word for word with the refund clause in the terms.",
    },
  },

  precio: {
    aria: { es: "Precio y qué incluye", en: "Price and what's included" },
    titulo: { es: "Todo lo que te llevas", en: "Everything you get" },
    entradilla: {
      es: "Un solo pago y el acceso es tuyo para siempre. Sin suscripción ni cargos recurrentes.",
      en: "One payment and the access is yours for good. No subscription, no recurring charges.",
    },
    cuotas: { es: "o {n} pagos de {importe}", en: "or {n} payments of {importe}" },
    conGarantia: { es: "Con {garantia}.", en: "Includes {garantia}." },

    /** Cabecera del desglose que sostiene el ancla. */
    desgloseTitulo: {
      es: "Qué incluye, y cuánto vale cada parte",
      en: "What's included, and what each part is worth",
    },
    desgloseTotal: { es: "Valor total", en: "Total value" },

    // ── Framing 'lanzamiento' (activo) ──────────────────────────────────────
    lanzamiento: {
      kicker: { es: "Precio de fundadores", en: "Founding member price" },
      etiquetaPrecio: { es: "Precio de lanzamiento", en: "Launch price" },
      /** `{referencia}` = la cifra ancla ya formateada. */
      subira: { es: "Después subirá a {referencia}", en: "It goes up to {referencia} after that" },
      nota: {
        es: "Precio de lanzamiento por tiempo limitado. Quien entra ahora lo mantiene: el precio no te sube después.",
        en: "Launch price for a limited time. If you get in now you keep it: your price doesn't go up later.",
      },
    },

    // ── Framing 'descuento' (solo si el precio anterior fue real) ───────────
    descuento: {
      kicker: { es: "Precio con descuento", en: "Discounted price" },
      /** `{importe}` = ahorro, `{porcentaje}` = % de descuento. */
      ahorras: { es: "Ahorras {importe} ({porcentaje}%)", en: "You save {importe} ({porcentaje}%)" },
      nota: {
        es: "Descuento por tiempo limitado sobre el precio habitual del curso.",
        en: "Limited-time discount off the course's regular price.",
      },
    },

    // ── Urgencia ────────────────────────────────────────────────────────────
    urgencia: {
      /** `{n}` = cupos restantes. */
      cupos: { es: "Quedan {n} cupos en esta ronda", en: "{n} spots left in this round" },
      /** `{fecha}` = fecha de cierre ya formateada. */
      fecha: { es: "El precio sube el {fecha}", en: "The price goes up on {fecha}" },
    },

    /** Aviso cuando el desglose no suma la cifra ancla. */
    avisoDesglose: {
      es: "El desglose no suma el precio de referencia. Ajusta los valores de `precio.desglose` o `precio.referencia` en `curso.config.ts`: un ancla que no cuadra es peor que no poner ancla.",
      en: "The breakdown doesn't add up to the reference price. Adjust `precio.desglose` or `precio.referencia` in `curso.config.ts`: an anchor that doesn't add up is worse than no anchor.",
    },
    avisoPlaceholder: {
      es: "El botón de compra no lleva a ningún sitio todavía. Pon la URL real de la pasarela en `curso.precio.urlCheckout`.",
      en: "The buy button goes nowhere yet. Add the real checkout URL in `curso.precio.urlCheckout`.",
    },
  },

  faq: {
    aria: { es: "Preguntas frecuentes", en: "Frequently asked questions" },
    titulo: {
      es: "Preguntas que probablemente te estás haciendo",
      en: "Questions you're probably asking yourself",
    },
    dudaAntes: {
      es: "¿Te queda otra duda? Escríbeme a",
      en: "Still wondering something? Email me at",
    },
    dudaDespues: { es: "y te contesto yo.", en: "and I'll answer myself." },
    avisoPlaceholder: {
      es: "Quedan respuestas con datos por rellenar. El JSON-LD de FAQPage NO se emite hasta que estén completas.",
      en: "Some answers still have facts to fill in. The FAQPage JSON-LD is NOT emitted until they're complete.",
    },
  },

  cierre: {
    aria: { es: "Empezar", en: "Get started" },
    dudaTitulo: { es: "¿Todavía no lo tienes claro?", en: "Still not sure?" },
    dudaTexto: {
      es: "Empieza por el mini-curso gratis y decide después. {formato}.",
      en: "Start with the free mini-course and decide afterwards. {formato}.",
    },
    garantiaNota: {
      es: "{garantia}. Si no es para ti, te devolvemos el dinero.",
      en: "{garantia}. If it's not for you, you get your money back.",
    },
  },

  ui: {
    saltarAlContenido: { es: "Saltar al contenido", en: "Skip to content" },
    volverArriba: { es: "volver arriba", en: "back to top" },
    cerrar: { es: "Cerrar", en: "Close" },
    cargando: { es: "Cargando…", en: "Loading…" },
    enviando: { es: "Enviando…", en: "Sending…" },
    volverAInicio: { es: "Volver a la página principal", en: "Back to the main page" },
    abrirPaginaCompleta: { es: "Abrir como página completa", en: "Open as a full page" },
    infoLegal: { es: "Información legal", en: "Legal information" },
    enlacesLegales: { es: "Enlaces legales", en: "Legal links" },
    menuPrincipal: { es: "Menú principal", en: "Main menu" },
    copyright: {
      es: "© {anio} {razonSocial}. Todos los derechos reservados.",
      en: "© {anio} {razonSocial}. All rights reserved.",
    },
    placeholderAqui: { es: "Aquí va", en: "Goes here" },
    placeholderEnProduccion: {
      es: "Placeholder en producción",
      en: "Placeholder in production",
    },
    pendiente: { es: "Pendiente", en: "Pending" },
  },

  formulario: {
    nombreEtiqueta: { es: "Tu nombre", en: "Your name" },
    nombrePlaceholder: { es: "María", en: "Maria" },
    emailEtiqueta: { es: "Tu email", en: "Your email" },
    emailPlaceholder: { es: "maria@email.com", en: "maria@email.com" },
    errorRed: {
      es: "No pudimos conectar. Revisa tu conexión y vuelve a intentarlo.",
      en: "We couldn't connect. Check your connection and try again.",
    },
    errorGenerico: {
      es: "No pudimos registrarte.",
      en: "We couldn't sign you up.",
    },
  },

  /** Etiquetas del visual del hero. Datos reales del curso, no adorno. */
  heroVisual: {
    videos: { es: "videos", en: "videos" },
    quizzes: { es: "quizzes", en: "quizzes" },
    certificacion: { es: "Certificación", en: "Certificate" },
  },

  /** Distintivos de cada módulo del temario. */
  temarioBadges: {
    video: { es: "Video", en: "Video" },
    quiz: { es: "Quiz", en: "Quiz" },
  },

  placeholders: {
    mockupCurso: { es: "mockup del curso", en: "course mockup" },
    mockupCursoDetalle: {
      es: "1200×800 px · el curso abierto en una laptop o celular",
      en: "1200×800 px · the course open on a laptop or phone",
    },
    fotoInstructor: { es: "foto del instructor", en: "instructor photo" },
    fotoInstructorDetalle: {
      es: "800×1000 px · retrato vertical, cara nítida, fondo limpio",
      en: "800×1000 px · vertical portrait, sharp face, clean background",
    },
  },
} as const;

// ─── Legal ───────────────────────────────────────────────────────────────────

export const legal = {
  privacidad: "/legal/privacidad",
  terminos: "/legal/terminos",
} as const;

// ─── Export agrupado ─────────────────────────────────────────────────────────

export const config = {
  sitio,
  curso,
  instructor,
  temario,
  leadMagnet,
  testimonios,
  cifras,
  garantia,
  faqs,
  contacto,
  cta,
  copy,
  legal,
} as const;

export default config;
