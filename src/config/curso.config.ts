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
 *  · `en` — inglés de EE. UU. Traducción REAL, no literal. El vocabulario va
 *    como lo dice alguien de allá:
 *        referido           → referral
 *        oportunidad        → opportunity / lead
 *        cumplimiento       → compliance
 *        contacto           → contact
 *        red de contactos   → network
 *    Varias frases NO son la traducción palabra por palabra. Es lo correcto.
 *
 * QUÉ SE VENDE AQUÍ (para no volver a escribir la página equivocada)
 *
 *   "Fundamentos de Emprende180" NO es un curso genérico de emprendimiento.
 *   Es la formación para entrar al Ecosistema Emprende180 como EMBAJADOR: diez
 *   cursos en video, cada uno con su quiz de validación, que van de qué es el
 *   Ecosistema hasta el Plan de 90 Días, empezando por dos servicios concretos,
 *   Accidentes de Auto y Vivienda. Los títulos de los diez son del cliente y
 *   están en `temario` tal cual los dio.
 *
 * TRES REGLAS DE CONTENIDO QUE NO SE SALTAN:
 *
 * 1. El "180" es un GIRO DE 180°, no 180 días. Nunca "en 180 días".
 * 2. NO SE DECLARA LA DURACIÓN TOTAL DEL CURSO. El único plazo que se anuncia
 *    es el del mini-curso gratuito, porque ahí el plazo ES la promesa.
 *    (El tiempo semanal de dedicación sí se puede decir: es otra cosa, y va
 *    marcado como HECHO a rellenar.)
 * 3. CERO DECLARACIONES DE INGRESOS. Ni cifras, ni rangos, ni "un Embajador
 *    promedio", ni un testimonio que mencione cuánto ganó alguien, ni un
 *    "reemplaza tu sueldo". En EE. UU. eso son income claims: la FTC exige
 *    poder documentar que la cifra es representativa de lo que consigue un
 *    participante normal, y en un programa de referidos es por donde más fácil
 *    se cae. Se promete FORMACIÓN y MÉTODO, que es lo que de verdad se entrega.
 *    Lo que sí se puede contar es lo que la persona HIZO: contactos ordenados,
 *    conversaciones tenidas, referidos pedidos. Convierte igual y se sostiene.
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
    es: "Emprende180 — Conviértete en Embajador",
    en: "Emprende180 — Become an Ambassador",
  },
  descripcion: {
    es: "Formación para Embajadores Emprende180: 10 cursos con quiz de validación, del Ecosistema a tu Plan de 90 Días. Empieza gratis con el reto de 7 días.",
    en: "Training for Emprende180 Ambassadors: 10 courses with validation quizzes, from the ecosystem to your 90-Day Plan. Start free with the 7-day challenge.",
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
 * Las tres nombran un ESTADO al que se llega, no la actividad del curso.
 * "Aprende sobre referidos" describe lo que hace el curso; "conviértete en
 * Embajador" describe en qué se convierte el alumno, que es lo que le interesa.
 *
 * Ninguna promete dinero, y no es un descuido: ver la regla 3 de la cabecera.
 *
 *   0 — El rol. La más clara y la más fácil de defender.
 *   1 — La más provocadora. Le dice que ya tiene el activo y le falta el cómo.
 *   2 — La más cercana. Baja la barrera: "no hace falta que empieces de cero".
 *
 * Si dudas, quédate con la 0 y prueba la 1 en campañas frías.
 */
export const TITULARES: readonly Txt[] = [
  {
    es: "Conviértete en Embajador Emprende180",
    en: "Become an Emprende180 Ambassador",
  },
  {
    es: "Tu red de contactos ya vale. Falta saber usarla.",
    en: "Your network is already worth something. You just need to know how to use it.",
  },
  {
    es: "Empieza con la gente que ya conoces",
    en: "Start with the people you already know",
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
    es: "10 cursos, un quiz de validación en cada uno y tu certificación de Embajador al terminar",
    en: "10 courses, a validation quiz in each one, and your Ambassador certificate at the end",
  },

  /** El titular activo. El resto viven en `TITULARES` para poder probarlos. */
  promesa: TITULARES[TITULAR_ELEGIDO]!,

  /** Subtítulo: para quién es y qué se consigue. */
  promesaApoyo: {
    es: "La formación completa para entrar al Ecosistema Emprende180. Diez cursos que te llevan de no saber qué es esto a tener tu Plan de 90 Días escrito, empezando por dos servicios concretos: Accidentes de Auto y Vivienda. Sin experiencia previa en el sector.",
    en: "The complete training to join the Emprende180 ecosystem. Ten courses that take you from not knowing what this is to having your 90-Day Plan in writing, starting with two concrete services: Auto and Home Accidents. No prior industry experience needed.",
  },

  // ─── SECCIÓN 2 · El problema ───────────────────────────────────────────────
  problema: {
    titular: {
      es: "El problema no es que no conozcas gente",
      en: "Your problem isn't that you don't know people",
    },
    entradilla: {
      es: "Es que nadie te ha enseñado qué hacer con esos contactos. Así que las situaciones pasan por delante de ti, se resuelven sin ti, y te enteras después.",
      en: "It's that nobody taught you what to do with those contacts. So situations pass right by you, get handled without you, and you find out afterwards.",
    },

    /** En primera persona del lector. Que se reconozca en al menos dos. */
    dolores: [
      {
        es: "Conoces a mucha gente, pero no sabes cómo convertir eso en algo sin que parezca que vas a aprovecharte de tus amistades.",
        en: "You know a lot of people, but you don't know how to turn that into anything without looking like you're using your friends.",
      },
      {
        es: "Intuyes que hay oportunidades a tu alrededor y no sabes reconocerlas cuando las tienes delante, ni qué hacer con ellas si las reconoces.",
        en: "You sense there are opportunities around you, and you can't spot them when they're in front of you, or know what to do with them if you do.",
      },
      {
        es: "Alguien cercano tuvo un accidente de auto o un problema en su casa, y no supiste ni qué decirle ni a quién mandarlo.",
        en: "Someone close to you had a car accident or a problem at home, and you didn't know what to say or who to send them to.",
      },
      {
        es: "Pedir un referido te da pena. Prefieres no preguntar antes que sonar a que le quieres vender algo a un conocido.",
        en: "Asking for a referral makes you cringe. You'd rather not ask than sound like you're selling something to someone you know.",
      },
      {
        es: "Te has apuntado a cosas con muchas ganas y a las tres semanas ya no sabías por dónde ibas, porque nadie te dio un plan con fechas.",
        en: "You've signed up for things full of enthusiasm and three weeks later lost the thread, because nobody gave you a plan with dates on it.",
      },
    ] satisfies Txt[],

    coste: {
      es: "Dentro de un año vas a conocer a la misma gente. La diferencia es que las oportunidades que te pasaron por delante se habrán resuelto sin ti otra vez.",
      en: "A year from now you'll know the same people. The difference is that the opportunities that passed you by will have been handled without you again.",
    },
  },

  // ─── SECCIÓN 3 · Transformación ────────────────────────────────────────────
  /** Qué SABRÁS HACER al terminar. Verbo de acción + resultado.
   *  Cada una sale de un curso concreto del temario: no hay ninguna promesa
   *  aquí que no tenga detrás un video que la sostenga. */
  transformaciones: [
    {
      titulo: {
        es: "Sabrás qué es esto y dónde encajas tú",
        en: "You'll know what this is and where you fit",
      },
      detalle: {
        es: "Qué es Emprende180, qué es ser Embajador y cómo funciona el Ecosistema completo. Quién hace qué, y qué parte te toca a ti.",
        en: "What Emprende180 is, what being an Ambassador means, and how the whole ecosystem works. Who does what, and which part is yours.",
      },
    },
    {
      titulo: {
        es: "Reconocerás una oportunidad cuando la tengas delante",
        en: "You'll recognize an opportunity when it's in front of you",
      },
      detalle: {
        es: "Empezando por los dos servicios iniciales, Accidentes de Auto y Vivienda: para qué sirven y en qué situaciones aplican.",
        en: "Starting with the two initial services, Auto and Home Accidents: what they're for and when they apply.",
      },
    },
    {
      titulo: {
        es: "Pedirás referidos sin que se te caiga la cara",
        en: "You'll ask for referrals without cringing",
      },
      detalle: {
        es: "La comunicación básica para pedir con confianza y sin quemar la relación. Es lo que más frena a la gente, y se entrena.",
        en: "The basic communication to ask with confidence and without burning the relationship. It stops most people, and it's trainable.",
      },
    },
    {
      titulo: {
        es: "Tendrás tus contactos organizados",
        en: "You'll have your contacts organized",
      },
      detalle: {
        es: "Uso básico del CRM: cada contacto y cada oportunidad en un sitio y con su estado al día, no en notas sueltas del celular.",
        en: "Basic CRM use: every contact and every opportunity in one place with its status current, not scattered across phone notes.",
      },
    },
    {
      titulo: {
        es: "Publicarás para que te escriban a ti",
        en: "You'll post so people message you",
      },
      detalle: {
        es: "Contenido y redes sociales con un objetivo concreto: generar conversaciones. No seguidores, no likes. Conversaciones.",
        en: "Content and social media with one concrete goal: starting conversations. Not followers, not likes. Conversations.",
      },
    },
    {
      titulo: {
        es: "Sabrás qué se puede decir y qué no",
        en: "You'll know what you can say and what you can't",
      },
      detalle: {
        es: "Ética, cumplimiento y comunicación responsable. Es lo que separa a un Embajador que dura del que se mete en un problema el primer mes.",
        en: "Ethics, compliance and responsible communication. It separates an Ambassador who lasts from one who hits trouble in month one.",
      },
    },
  ],

  /** Versión corta, para el JSON-LD `teaches`. */
  resultados: [
    {
      es: "Entender el Ecosistema Emprende180 y el rol del Embajador",
      en: "Understand the Emprende180 ecosystem and the Ambassador role",
    },
    {
      es: "Detectar oportunidades de Accidentes de Auto y Vivienda en tu red de contactos",
      en: "Spot Auto and Home Accident opportunities in your own network",
    },
    {
      es: "Pedir referidos y comunicarte con criterio ético y de cumplimiento",
      en: "Ask for referrals and communicate within ethical and compliance limits",
    },
    {
      es: "Organizar contactos en el CRM y ejecutar un plan de 90 días",
      en: "Organize contacts in the CRM and execute a 90-day plan",
    },
  ] satisfies Txt[],

  // ─── Auto-cualificación ────────────────────────────────────────────────────
  paraQuien: [
    {
      es: "Tienes una red de contactos, aunque te parezca pequeña, y quieres hacer algo con ella además de saludar.",
      en: "You have a network, even one you think is small, and you want to do something with it beyond saying hello.",
    },
    {
      es: "Quieres empezar con algo estructurado: pasos, orden y un plan con fechas, no un «échale ganas».",
      en: "You want to start with something structured: steps, sequence and a plan with dates, not just “give it your all”.",
    },
    {
      es: "No vienes del sector y necesitas que te expliquen desde qué es esto hasta qué se puede decir y qué no.",
      en: "You don't come from this industry and you need it explained from what this even is through to what you may and may not say.",
    },
    {
      es: "Te mueves bien con la gente, pero te trabas justo cuando toca pedir algo.",
      en: "You're good with people, but you freeze at exactly the moment you have to ask for something.",
    },
  ] satisfies Txt[],

  /** Descalificar de verdad sube la conversión de los buenos y baja los reembolsos. */
  paraQuienNo: [
    {
      es: "Buscas ingresos pasivos sin hablar con nadie. Esto es lo contrario: es conversación, una detrás de otra.",
      en: "You want passive income without talking to anyone. This is the opposite: it's conversations, one after another.",
    },
    {
      es: "Quieres el resultado sin ejecutar. El Plan de 90 Días es tuyo y nadie lo va a ejecutar por ti.",
      en: "You want the outcome without doing the work. The 90-Day Plan is yours, and nobody is going to run it for you.",
    },
    {
      es: "Te incomoda la parte de reglas. El curso 9 es de ética y cumplimiento porque aquí hay límites y se respetan.",
      en: "The rules part bothers you. Course 9 is on ethics and compliance because there are limits here and they're respected.",
    },
    {
      es: "Esperas una cifra garantizada. Aquí hay formación y un método; lo que salga depende de lo que tú hagas con ellos.",
      en: "You expect a guaranteed number. What's here is training and a method; what comes of it depends on what you do with them.",
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
      es: "10 cursos en video, a tu ritmo",
      en: "10 video courses, at your own pace",
    },
    acceso: {
      es: "Acceso de por vida, actualizaciones incluidas",
      en: "Lifetime access, updates included",
    },

    /**
     * ⚠️ SOLO LO QUE CONSTA. Las tres primeras líneas salen de lo que el
     * cliente confirmó: diez cursos, un quiz de validación en cada uno y la
     * certificación al superarlos. Lo demás se quedó como `[COMPLETAR:]`
     * porque son HECHOS que no se pueden deducir del temario, y prometer en
     * esta lista algo que luego no está es la causa número uno de reembolsos.
     */
    incluye: [
      {
        es: "10 cursos en video, con acceso de por vida",
        en: "10 video courses, with lifetime access",
      },
      {
        es: "Un quiz de validación al final de cada curso",
        en: "A validation quiz at the end of every course",
      },
      {
        es: "Certificación de Embajador Emprende180 al superar los 10 quizzes",
        en: "Emprende180 Ambassador certification once you pass all 10 quizzes",
      },
      {
        es: "[COMPLETAR: ¿el acceso al CRM va incluido con el curso o se contrata aparte?]",
        en: "[COMPLETAR: is CRM access included with the course, or contracted separately?]",
      },
      {
        es: "[COMPLETAR: ¿hay acompañamiento, comunidad o soporte después del curso? Si no lo hay, borra esta línea.]",
        en: "[COMPLETAR: is there any mentoring, community or support after the course? If not, delete this line.]",
      },
    ] satisfies Txt[],

    /**
     * ⚠️ ESTO NO ES UN DETALLE DE MAQUETACIÓN. Un programa de referidos sobre
     * servicios de accidentes de auto y vivienda está regulado, y en muchos
     * territorios quién puede recibir una compensación por un referido —y de
     * qué tipo— depende de si tiene licencia. El propio curso 9 existe por
     * esto. Que lo confirme quien lleve cumplimiento antes de publicar, y que
     * la respuesta viva aquí para que la página no prometa lo que no puede.
     */
    requisitos: [
      {
        es: "Ninguno para empezar el curso: se entra desde cero y sin experiencia en el sector.",
        en: "None to start the course: you begin from zero, with no industry experience.",
      },
      {
        es: "[COMPLETAR: ¿hace falta licencia, registro o algún requisito legal para actuar como Embajador? ¿En qué estados o países aplica?]",
        en: "[COMPLETAR: is any license, registration or legal requirement needed to act as an Ambassador? Which states or countries does it apply in?]",
      },
    ] satisfies Txt[],
    idioma: { es: "Español", en: "Spanish" },
    nivel: {
      es: "Desde cero, sin experiencia previa en el sector",
      en: "From zero, no prior industry experience",
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
        valor: 2190,
        titulo: {
          es: "Los 10 cursos en video, con acceso de por vida",
          en: "The 10 video courses, with lifetime access",
        },
        detalle: {
          es: "De qué es Emprende180 hasta tu Plan de 90 Días, en el orden en que hay que hacerlos. Vuelves a cualquiera cuando lo necesites.",
          en: "From what Emprende180 is through to your 90-Day Plan, in the order you need them. Come back to any of them whenever you need to.",
        },
      },
      {
        valor: 700,
        titulo: {
          es: "Los 10 quizzes de validación",
          en: "The 10 validation quizzes",
        },
        detalle: {
          es: "Uno por curso. No están para poner nota: están para que sepas si de verdad lo fijaste antes de pasar al siguiente.",
          en: "One per course. They're not there to grade you: they tell you whether it actually stuck before you move on.",
        },
      },
      {
        valor: 700,
        titulo: {
          es: "La certificación de Embajador Emprende180",
          en: "The Emprende180 Ambassador certification",
        },
        detalle: {
          es: "Al superar los diez quizzes. Es la constancia de que hiciste la formación completa, incluida la de ética y cumplimiento.",
          en: "Once you pass all ten quizzes. It's the record that you completed the full training, ethics and compliance included.",
        },
      },
      {
        valor: 400,
        titulo: {
          es: "Tu Plan de 90 Días, escrito",
          en: "Your 90-Day Plan, in writing",
        },
        detalle: {
          es: "El último curso no es teoría: sales con qué haces cada semana, con quién hablas y cómo sabes si vas bien.",
          en: "The last course isn't theory: you leave with what you do each week, who you talk to, and how you know it's working.",
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
      tipo: "fecha" as "lanzamiento" | "cupos" | "fecha" | "ninguna",
      cupos: null as number | null, // SWAP (HECHO): solo si es real

      /**
       * ⚠️ SWAP (HECHO) — LA FECHA MANDA SOBRE EL PRECIO, NO AL REVÉS.
       *
       * Con `tipo: "fecha"` esto enciende la cuenta atrás de la sección de
       * precio. Es una fecha FIJA en ISO 8601 con zona horaria: no se calcula
       * desde la visita, así que no se reinicia al recargar ni al abrir la
       * página en otro navegador. Todo el mundo ve el mismo número.
       *
       * EL COMPROMISO QUE ADQUIERES AL PONER UNA FECHA AQUÍ: cuando llegue,
       * `actual` tiene que subir de verdad. Si el día siguiente el precio sigue
       * siendo 490 y aparece otra cuenta atrás, es el contador falso de toda la
       * vida, y basta con que un visitante vuelva en una semana para verlo.
       *
       * Si llega la fecha y no has subido el precio, el contador NO se queda
       * en cero engañando: desaparece solo y en desarrollo sale un aviso.
       * Pon aquí `null` (o `tipo: "lanzamiento"`) si prefieres no comprometerte
       * a una fecha: la sección sigue funcionando sin contador.
       */
      fechaCierre: "2026-08-31T23:59:59-05:00" as string | null,
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
 * Los diez cursos, en el orden en que hay que hacerlos.
 *
 * LOS TÍTULOS SON LOS REALES, tal cual los dio el cliente. No se tocan sin que
 * él lo diga: son el contenido del producto, no copy de la página.
 *
 * `logras` sí es copy: dice qué sabe hacer el Embajador al terminar cada curso.
 * Está escrito PEGADO al título y sin añadir nada que el título no prometa ya,
 * porque un temario que promete de más se paga en reembolsos.
 *
 * ⚠️ `lecciones` (los puntos que se despliegan) está VACÍO a propósito. Sería
 * lo que hay DENTRO de cada video, y eso es un HECHO que no se puede deducir
 * del título: inventarlo significa que alguien compre esperando una lección que
 * no existe. Pásame el guion o el índice de cada video y los relleno en un
 * momento. Sin ellos el acordeón no se despliega, que es exactamente lo que
 * tiene que pasar mientras no haya nada real que enseñar.
 *
 * Cada curso cierra con su Quiz de validación. Eso no va aquí como módulo
 * aparte (serían veinte filas para diez contenidos): va en `formato.incluye` y
 * en la insignia "Quiz" que pinta cada fila del acordeón.
 *
 * Sin duraciones: ver la regla 2 de la cabecera del archivo.
 */
export const temario: Modulo[] = [
  {
    numero: 1,
    titulo: {
      es: "Qué es Emprende180",
      en: "What Emprende180 is",
    },
    logras: {
      es: "Entiendes qué es Emprende180, qué problema resuelve y qué lugar ocupas tú dentro. Es la base sobre la que se apoyan los nueve cursos siguientes.",
      en: "You understand what Emprende180 is, what problem it solves and where you fit into it. This is the base the other nine courses stand on.",
    },
  },
  {
    numero: 2,
    titulo: {
      es: "Qué es ser Embajador Emprende180",
      en: "What being an Emprende180 Ambassador means",
    },
    logras: {
      es: "Sabes en qué consiste el rol: qué haces, qué no te toca hacer a ti y qué se espera de un Embajador desde el primer día.",
      en: "You know what the role involves: what you do, what isn't yours to do, and what's expected of an Ambassador from day one.",
    },
  },
  {
    numero: 3,
    titulo: {
      es: "Cómo funciona el Ecosistema Emprende180",
      en: "How the Emprende180 ecosystem works",
    },
    logras: {
      es: "Ves el circuito completo y quién hace qué en cada paso, desde que detectas una oportunidad hasta que se resuelve. Dejas de trabajar a ciegas.",
      en: "You see the full circuit and who does what at each step, from spotting an opportunity to closing it out. No more working blind.",
    },
  },
  {
    numero: 4,
    titulo: {
      es: "Cómo se generan oportunidades con contactos y referidos",
      en: "How opportunities come from contacts and referrals",
    },
    logras: {
      es: "Sabes de dónde salen las oportunidades de verdad y cómo mirar la red que ya tienes con otros ojos, en vez de esperar a que aparezcan solas.",
      en: "You know where real opportunities come from and how to look at the network you already have with fresh eyes, instead of waiting for them to appear.",
    },
  },
  {
    numero: 5,
    titulo: {
      es: "Servicios iniciales: Accidentes de Auto y Vivienda",
      en: "Starting services: Auto and Home Accidents",
    },
    logras: {
      es: "Conoces los dos servicios con los que empiezas: para qué sirven, en qué situaciones aplican y cómo reconocer una cuando la tienes delante.",
      en: "You know the two services you start with: what they're for, when they apply, and how to recognize one when it's in front of you.",
    },
  },
  {
    numero: 6,
    titulo: {
      es: "Comunicación básica y confianza para pedir referidos",
      en: "Basic communication and the confidence to ask for referrals",
    },
    logras: {
      es: "Sabes pedir un referido sin sonar a vendedor y sin quemar la relación. Es la parte que más frena a la gente, y se entrena.",
      en: "You know how to ask for a referral without sounding like a salesperson or burning the relationship. It's the part that stops most people, and it's trainable.",
    },
  },
  {
    numero: 7,
    titulo: {
      es: "Uso básico del CRM para organizar contactos y oportunidades",
      en: "Using the CRM to organize contacts and opportunities",
    },
    logras: {
      es: "Tienes tus contactos y tus oportunidades en un sitio, con su estado al día. Se acabó perder una porque se quedó en una nota del celular.",
      en: "Your contacts and opportunities live in one place, with their status current. No more losing one because it stayed in a note on your phone.",
    },
  },
  {
    numero: 8,
    titulo: {
      es: "Contenido y redes sociales para generar conversaciones",
      en: "Content and social media that start conversations",
    },
    logras: {
      es: "Sabes qué publicar para que la gente te escriba a ti, en vez de tener que escribir tú a todo el mundo. El objetivo es la conversación, no el like.",
      en: "You know what to post so people message you, instead of you having to message everyone. The goal is the conversation, not the like.",
    },
  },
  {
    numero: 9,
    titulo: {
      es: "Ética, cumplimiento y comunicación responsable",
      en: "Ethics, compliance and responsible communication",
    },
    logras: {
      es: "Sabes qué puedes decir y qué no, y por qué. Es lo que separa a un Embajador que dura de uno que se mete en un problema en el primer mes.",
      en: "You know what you can say and what you can't, and why. It's what separates an Ambassador who lasts from one who lands in trouble in month one.",
    },
  },
  {
    numero: 10,
    titulo: {
      // SWAP (HECHO): el título llegó cortado en "ejecuci". Confirma el final.
      es: "Tu Plan de 90 Días: ejecución",
      en: "Your 90-Day Plan: execution",
    },
    logras: {
      es: "Sales con tu plan de 90 días escrito: qué haces cada semana, con quién hablas y cómo sabes si vas bien. Se acaba el curso y empieza lo tuyo.",
      en: "You leave with your 90-day plan in writing: what you do each week, who you talk to, and how you know it's working. The course ends and your part begins.",
    },
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
    es: "Tu red de contactos en 7 días",
    en: "Your network in 7 days",
  },
  promesa: {
    es: "Siete emails, siete días, diez minutos al día. Al terminar tendrás tu lista de contactos ordenada, sabrás reconocer una oportunidad cuando la tengas delante y habrás tenido tu primera conversación sin sonar a vendedor. Gratis y sin tarjeta.",
    en: "Seven emails, seven days, ten minutes a day. By the end you'll have your contact list sorted, you'll recognize an opportunity when it's in front of you, and you'll have had your first conversation without sounding like a salesperson. Free, no credit card.",
  },
  formato: {
    es: "7 emails · uno al día · 10 minutos cada uno · gratis",
    en: "7 emails · one a day · 10 minutes each · free",
  },
  duracionDias: 7,

  dias: [
    {
      dia: 1,
      titulo: { es: "Sácala de la cabeza", en: "Get it out of your head" },
      entrega: {
        es: "El ejercicio para escribir tus primeros 50 contactos en 15 minutos, con las cinco preguntas que te hacen acordarte de la gente que siempre se te olvida.",
        en: "The exercise to write down your first 50 contacts in 15 minutes, with the five prompts that make you remember the people you always forget.",
      },
    },
    {
      dia: 2,
      titulo: { es: "Quién es quién en tu lista", en: "Who's who on your list" },
      entrega: {
        es: "Cómo ordenar esos 50 por cercanía real y no por cuánto los quieres. Terminas sabiendo por cuáles cinco empezar esta semana.",
        en: "How to sort those 50 by actual closeness, not by how much you like them. You finish knowing which five to start with this week.",
      },
    },
    {
      dia: 3,
      titulo: { es: "Qué es una oportunidad", en: "What an opportunity looks like" },
      entrega: {
        es: "Las situaciones concretas de accidentes de auto y vivienda que la gente cuenta en una conversación normal sin darles importancia. Aprendes a oírlas.",
        en: "The specific auto and home accident situations people mention in ordinary conversation without thinking twice. You learn to hear them.",
      },
    },
    {
      dia: 4,
      titulo: { es: "El mensaje que no incomoda", en: "The message that doesn't make it weird" },
      entrega: {
        es: "Cómo abrir la conversación con alguien que no ves hace meses sin que el primer mensaje parezca que vas a venderle algo.",
        en: "How to open a conversation with someone you haven't seen in months without the first message reading like a sales pitch.",
      },
    },
    {
      dia: 5,
      titulo: { es: "Pedir sin que suene a pedir", en: "Asking without it sounding like asking" },
      entrega: {
        es: "La diferencia entre pedir un favor y ofrecer una ayuda, y por qué la segunda funciona. Con las palabras exactas.",
        en: "The difference between asking a favor and offering help, and why the second one works. With the exact words.",
      },
    },
    {
      dia: 6,
      titulo: { es: "Dónde se guarda todo esto", en: "Where all of this lives" },
      entrega: {
        es: "Por qué una lista en notas del celular se pierde y qué hace un CRM que una libreta no puede hacer. Con lo mínimo para empezar hoy.",
        en: "Why a list in your phone's notes gets lost, and what a CRM does that a notebook can't. With the bare minimum to start today.",
      },
    },
    {
      dia: 7,
      titulo: { es: "Tu plan de la semana que viene", en: "Your plan for next week" },
      entrega: {
        es: "Con quién hablas, cuándo y qué dices. En una hoja. Y qué tendrías que aprender después si esto te encaja.",
        en: "Who you talk to, when, and what you say. On one page. Plus what you'd need to learn next if this fits you.",
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
 *   1. RESULTADO CONCRETO, mejor con número o plazo, y de lo que la persona
 *      HIZO: «Pedí mi primer referido en la semana 2», «ordené 60 contactos en
 *      el CRM». «Muy buen curso, lo recomiendo» no dice nada.
 *   2. EL ANTES. De dónde partía. El lector busca a alguien como él, y si no
 *      sabe de dónde salió esa persona, no puede compararse.
 *   3. NOMBRE Y APELLIDO REALES + a qué se dedica y de dónde es.
 *      Un «María G.» sin más pesa la mitad.
 *   4. FOTO real, cuadrada, 400×400. Sin foto se muestran las iniciales, que
 *      es honesto, pero una cara convierte más.
 *
 * ⚠️ Y UNA QUINTA, QUE ES LA QUE TE PUEDE COSTAR CARA: NINGUNA CIFRA DE
 * INGRESOS. Ni en la cita ni en la etiqueta de resultado. Un testimonio que
 * dice cuánto ganó alguien es una declaración de ingresos: la FTC exige poder
 * documentar que esa cifra es lo que consigue un Embajador NORMAL, no el mejor.
 * Si un alumno te la manda, agradécesela y publica la parte de lo que hizo.
 * Ver la regla 3 de la cabecera del archivo.
 *
 * CÓMO PEDIRLO. No preguntes «¿qué te pareció el curso?». Pregunta:
 *   · ¿Dónde estabas antes de empezar?
 *   · ¿Qué conseguiste, en concreto? ¿En cuánto tiempo?
 *   · ¿Qué le dirías a alguien que está donde estabas tú?
 *   · ¿Hay algo más que quieras contar, que no te haya preguntado?
 *
 * La cuarta va SIEMPRE, y es abierta a propósito: las tres primeras solo
 * recogen lo que ya se te había ocurrido preguntar. En la cuarta es donde
 * aparece la objeción que no habías previsto y el mejor titular.
 *
 * PERMISO POR ESCRITO, siempre, y guardado. Publicar el nombre y la foto de
 * alguien sin su consentimiento expreso es un problema legal, no un descuido.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * El molde completo, con seis ejemplos y el mensaje listo para enviar, está en
 * `docs/pedir-testimonios.md` y en `src/config/testimonios.muestra.ts`. Los de
 * ahí NO son alumnos reales y no se publican: solo se ven en desarrollo, para
 * poder ajustar el carrusel.
 * ─────────────────────────────────────────────────────────────────────────────
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
      es: "PLACEHOLDER — AQUÍ VA UN TESTIMONIO REAL. Busca uno que hable de la vergüenza a pedir un referido: es la objeción número uno de esta página.",
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
      es: "PLACEHOLDER — AQUÍ VA UN TESTIMONIO REAL. Idealmente de alguien que entró sin experiencia en el sector, para cubrir esa objeción.",
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
    es: "Entra, haz los primeros cursos y ponlos a prueba con tus contactos reales. Si en 30 días ves que no es para ti, escribes a soporte y te devolvemos el 100 %. Sin formularios, sin llamadas de retención y sin que tengas que justificar nada.",
    en: "Get in, do the first courses and test them on your real contacts. If within 30 days you decide it isn't for you, email support and we refund 100%. No forms, no retention calls, and no need to justify anything.",
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
      es: "No tengo experiencia en el sector. ¿Me va a servir?",
      en: "I have no experience in this industry. Will this work for me?",
    },
    respuesta: {
      es: "Sí, está pensado justo para eso. El curso 1 empieza explicando qué es Emprende180 y no da por sabido nada: ni el sector, ni los servicios, ni haber pedido un referido antes. Lo que sí hace falta es tiempo para hacerlo y disposición para hablar con gente, que es lo que de verdad mueve la aguja.",
      en: "Yes, that's exactly who it's built for. Course 1 starts by explaining what Emprende180 is and assumes nothing: not the industry, not the services, not having ever asked for a referral. What you do need is time to do it and a willingness to talk to people, which is what actually moves the needle.",
    },
  },
  {
    pregunta: {
      es: "¿Tengo que tener licencia para ser Embajador?",
      en: "Do I need a license to be an Ambassador?",
    },
    respuesta: {
      es: "[COMPLETAR (HECHO): esta es LA pregunta que va a hacer todo el mundo, y la respuesta depende del estado o país. Un programa de referidos sobre servicios de accidentes de auto y vivienda está regulado, y en muchos territorios quién puede recibir una compensación por un referido depende de si tiene licencia. Que la redacte quien lleve cumplimiento y no se publique sin su visto bueno. El curso 9 cubre esto, pero la página tiene que poder responderlo antes de que alguien pague.]",
      en: "[COMPLETAR (FACT): this is THE question everyone will ask, and the answer depends on the state or country. A referral program around auto and home accident services is regulated, and in many territories whether an unlicensed person may receive referral compensation is restricted. Have whoever handles compliance write this, and don't publish without their sign-off. Course 9 covers it, but the page has to answer it before anyone pays.]",
    },
  },
  {
    pregunta: {
      es: "¿Cómo gana un Embajador?",
      en: "How does an Ambassador earn?",
    },
    respuesta: {
      es: "[COMPLETAR (HECHO): describe el modelo real de compensación: si es una tarifa fija por referido, una comisión, un bono, o ninguna de las tres. No pongas cifras de ingresos ni ejemplos de «un Embajador promedio gana X»: en EE. UU. eso son declaraciones de ingresos y la FTC las regula, y una cifra sin respaldo documentado es sancionable. Si no puedes documentarla, no la pongas.]",
      en: "[COMPLETAR (FACT): describe the actual compensation model: a flat referral fee, a commission, a bonus, or none of them. Do not put earnings figures or “the average Ambassador makes X” examples: in the US those are income claims, the FTC regulates them, and an unsubstantiated figure is actionable. If you can't document it, leave it out.]",
    },
  },
  {
    pregunta: {
      es: "¿Desde dónde puedo trabajar como Embajador?",
      en: "Where can I work as an Ambassador from?",
    },
    respuesta: {
      es: "[COMPLETAR (HECHO): en qué estados o países opera el Ecosistema hoy y a qué zonas se pueden referir Accidentes de Auto y Vivienda. Si alguien compra desde una zona donde el servicio no llega, tienes un reembolso asegurado y un cliente enfadado con razón.]",
      en: "[COMPLETAR (FACT): which states or countries the ecosystem operates in today, and where Auto and Home Accident cases can be referred. If someone buys from an area the service doesn't reach, you've bought yourself a refund and a rightly annoyed customer.]",
    },
  },
  {
    pregunta: {
      es: "¿El CRM va incluido en el precio?",
      en: "Is the CRM included in the price?",
    },
    respuesta: {
      es: "[COMPLETAR (HECHO): el curso 7 enseña a usarlo, pero hay que decir si el acceso viene con el curso, si se contrata aparte o si es una herramienta de terceros que pone el Embajador.]",
      en: "[COMPLETAR (FACT): course 7 teaches you to use it, but you need to state whether access comes with the course, is contracted separately, or is a third-party tool the Ambassador provides.]",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo necesito a la semana?",
      en: "How much time do I need per week?",
    },
    respuesta: {
      es: "Cuenta con [COMPLETAR: X horas] a la semana: una parte para ver el curso y otra, la más importante, para hablar con tus contactos. Si una semana no puedes, no pasa nada: el acceso no caduca y retomas donde lo dejaste. Pero avanzar sin tener las conversaciones no sirve de mucho.",
      en: "Plan on [COMPLETAR: X hours] a week: part for watching the course and part, the important part, for talking to your contacts. If you miss a week, nothing breaks: access doesn't expire and you pick up where you left off. But moving forward without having the conversations doesn't get you far.",
    },
  },
  {
    pregunta: {
      es: "¿Los cursos son en vivo o grabados?",
      en: "Are the courses live or recorded?",
    },
    respuesta: {
      es: "[COMPLETAR: describe el formato real. Ej.: «Los diez cursos están grabados y disponibles desde el primer día, así que avanzas a tu ritmo y repites el que quieras».]",
      en: "[COMPLETAR: describe the real format. E.g.: “All ten courses are recorded and available from day one, so you go at your own pace and rewatch whichever you want.”]",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo tengo acceso?",
      en: "How long do I have access?",
    },
    respuesta: {
      es: "Acceso de por vida, incluidas las actualizaciones que hagamos más adelante. Pagas una vez y el material es tuyo: puedes volver al curso del CRM dentro de un año, cuando te haga falta. No hay suscripción ni cargos recurrentes.",
      en: "Lifetime access, including any updates we make later. You pay once and the material is yours: you can come back to the CRM course a year from now, when you need it. No subscription, no recurring charges.",
    },
  },
  {
    pregunta: {
      es: "¿Tengo que perseguir a mis amigos y familiares?",
      en: "Do I have to chase my friends and family?",
    },
    respuesta: {
      es: "No, y el curso 6 va precisamente de lo contrario. La diferencia entre incomodar a alguien y ayudarle está en cuándo hablas y qué dices, y eso se entrena. El curso 8 además trabaja el otro lado: publicar de forma que te escriban a ti, en vez de tener que escribir tú a todo el mundo.",
      en: "No, and course 6 is about the opposite. The difference between bothering someone and helping them is when you speak and what you say, and that's trainable. Course 8 works the other side too: posting in a way that gets people to message you, instead of you messaging everyone.",
    },
  },
  {
    pregunta: {
      es: "¿Puedo pagar en partes?",
      en: "Can I pay in installments?",
    },
    respuesta: {
      es: "Sí. Puedes pagar de una vez o repartirlo en 3 mensualidades. Con el pago fraccionado obtienes el acceso completo desde el primer día, no por partes. Los impuestos dependen de tu país y se calculan al pagar, así que ves el importe final antes de confirmar.",
      en: "Yes. You can pay in one go or split it into 3 monthly payments. With installments you get full access from day one, not in pieces. Taxes depend on your country and are calculated at checkout, so you see the final amount before confirming.",
    },
  },
  {
    pregunta: {
      es: "¿Cómo funciona la garantía exactamente?",
      en: "How exactly does the guarantee work?",
    },
    respuesta: {
      es: "Tienes 30 días desde la compra. Si en ese plazo decides que no es para ti, escribes a nuestro correo de soporte y te devolvemos el 100 %. No hay formulario que rellenar, ni llamada para convencerte de que te quedes, ni preguntas incómodas. Lo único que pedimos es que lo hayas intentado: que hayas hecho los primeros cursos.",
      en: "You have 30 days from purchase. If within that window you decide it isn't for you, email our support address and we refund 100%. No form to fill in, no retention call, no awkward questions. The only thing we ask is that you actually tried it: that you did the first few courses.",
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
    paraTiTitulo: {
      es: "Si te reconociste arriba, esto es para ti",
      en: "If you recognized yourself above, this is for you",
    },
    /** Ya no se pinta: ver la cabecera de `02-Problema.astro`. Se conserva por
     *  si se recupera la columna de descalificación. */
    noParaTiTitulo: { es: "NO es para ti si…", en: "It's NOT for you if…" },
    /** Remate antes del CTA de la sección 2. */
    remate: {
      es: "Empieza por el reto gratuito. Siete días, diez minutos al día, y ya sabes si esto encaja contigo antes de pagar nada.",
      en: "Start with the free challenge. Seven days, ten minutes a day, and you'll know whether this fits you before paying anything.",
    },
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
      es: "{n} cursos, en el orden en que hay que hacerlos",
      en: "{n} courses, in the order you actually need them",
    },
    entradilla: {
      es: "Cada uno cierra con su quiz de validación. Los diez, con tu certificación de Embajador.",
      en: "Each one closes with its validation quiz. All ten, with your Ambassador certificate.",
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
    avisoMuestra: {
      es: "SOLO EN DESARROLLO. Estas seis tarjetas son una muestra de maquetación para poder ver el carrusel: no son alumnos reales y no se publican. Sustituye `testimonios` por citas reales y el carrusel pasa a usarlas.",
      en: "DEV ONLY. These six cards are layout samples so the carousel can be seen: they are not real students and they never ship. Replace `testimonios` with real quotes and the carousel switches to them.",
    },

    /** Controles del carrusel. Los lee un lector de pantalla, así que van en el
     *  idioma de la página como cualquier otro texto. */
    carrusel: {
      etiqueta: { es: "Testimonios de alumnos", en: "Student testimonials" },
      rol: { es: "carrusel", en: "carousel" },
      anterior: { es: "Testimonio anterior", en: "Previous testimonial" },
      siguiente: { es: "Testimonio siguiente", en: "Next testimonial" },
      /** `{n}` de `{total}`, para el aria-label de cada tarjeta. */
      posicion: { es: "{n} de {total}", en: "{n} of {total}" },
      irA: { es: "Ir al testimonio {n}", en: "Go to testimonial {n}" },
      pausar: { es: "Pausar el avance automático", en: "Pause auto-advance" },
      reanudar: { es: "Reanudar el avance automático", en: "Resume auto-advance" },
    },

    /**
     * QUÉ SE ENSEÑA MIENTRAS NO HAY TESTIMONIOS REALES.
     *
     * Un curso recién abierto no tiene alumnos graduados, así que no tiene
     * resultados que enseñar. Las dos salidas malas son dejar tres tarjetas
     * vacías (parece una página a medio hacer) o inventarse las citas
     * (publicidad engañosa, y encima se nota).
     *
     * La tercera salida es decirlo. Reconocer que eres nuevo y explicar qué
     * ganas tú por serlo convierte la ausencia de prueba en el argumento del
     * precio de lanzamiento, que ya es el `framing` de la sección 09. Y es
     * verdad, que es lo importante.
     *
     * En cuanto `testimonios` tenga citas reales, este bloque desaparece solo
     * y vuelve la rejilla. No hay que tocar nada.
     */
    fundador: {
      titulo: {
        es: "Aquí todavía no hay testimonios",
        en: "There are no testimonials here yet",
      },
      entradilla: {
        es: "El curso acaba de abrir: nadie lo ha terminado todavía, así que no hay resultados de alumnos que enseñarte. Podría inventármelos. No lo voy a hacer, porque una cita falsa se huele a un kilómetro y porque entonces nada de lo demás valdría nada. Esto es lo que sí te puedo poner por delante hoy.",
        en: "The course just opened. Nobody has finished it yet, so there are no student results to show you. I could make some up. I'm not going to, because a fake quote is obvious from a mile away, and because if I did, nothing else on this page would be worth anything either. Here's what I can put in front of you today.",
      },
      puntos: [
        {
          titulo: { es: "Entras al precio más bajo", en: "You get in at the lowest price" },
          texto: {
            es: "{actual} en lugar de {referencia}. Cuesta esto precisamente porque todavía no hay una fila de casos de éxito detrás. Cuando la haya, el precio será el otro.",
            en: "{actual} instead of {referencia}. It costs this precisely because there is no line of success stories behind it yet. Once there is, the price becomes the other one.",
          },
        },
        {
          titulo: { es: "El riesgo lo pongo yo", en: "I carry the risk" },
          texto: {
            es: "{dias} días para entrar, hacer los ejercicios y probarlos con clientes reales. Si no es para ti, escribes a soporte y te devolvemos el 100 %. No tienes que fiarte de mi palabra: tienes que poder echarte atrás.",
            en: "{dias} days to get in, do the exercises and test them on real customers. If it isn't for you, email support and we refund 100%. You don't have to take my word for it: you have to be able to walk back out.",
          },
        },
        {
          titulo: { es: "Puedes ver qué compras antes de pagar", en: "You can see what you're buying before you pay" },
          texto: {
            es: "{videos} cursos, un quiz de validación en cada uno y la certificación de Embajador al completar los diez. El temario está entero unas líneas más arriba, curso por curso. Sin letra chica y sin “y mucho más”.",
            en: "{videos} courses, a validation quiz in each one and the Ambassador certificate once you finish all ten. The full curriculum is a few lines up, course by course. No fine print, no “and much more”.",
          },
        },
      ],
      remate: {
        es: "Cuando los primeros terminen, sus resultados van justo aquí: con nombre y apellido, foto y permiso por escrito. Ni uno inventado.",
        en: "When the first students finish, their results go right here: full name, photo and written permission. Not one of them invented.",
      },
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

    /** Cuenta atrás. Ver `precio.urgencia.fechaCierre`. */
    contador: {
      /**
       * CORTO A PROPÓSITO, y no es una cuestión de gusto. "El precio de
       * fundador termina en" ocupaba dos líneas o una según un reflujo de 13 px
       * de ancho al cargar la página, y esas dos alturas distintas movían la
       * columna del precio entera (es `justify-center`): 0.008 de CLS por un
       * titular que estaba justo en el límite del salto de línea.
       * Si lo alargas, comprueba que sigue cabiendo en una línea a 320 px.
       * El contexto ya lo da el antetítulo "Precio de fundadores", justo arriba.
       */
      titulo: { es: "Se acaba en", en: "Ends in" },
      dias: { es: "días", en: "days" },
      horas: { es: "horas", en: "hours" },
      minutos: { es: "min", en: "min" },
      segundos: { es: "seg", en: "sec" },
      /**
       * Alternativa para lectores de pantalla. Los dígitos que cambian cada
       * segundo van con `aria-hidden`: anunciarlos convertiría el lector en
       * una radio. Esta frase dice lo mismo una sola vez. `{fecha}` ya viene
       * formateada con la hora incluida.
       */
      /* `{fecha}` va en medio de la frase a propósito: en español el formato
         de hora acaba en "p. m." y dejarlo al final producía "10:59 p.m..". */
      alternativa: {
        es: "El precio de fundador termina el {fecha} y después sube a {referencia}.",
        en: "The founding price ends on {fecha}, after which it goes up to {referencia}.",
      },
      /** Solo en desarrollo, cuando la fecha ya pasó. */
      avisoCaducado: {
        es: "La fecha de `precio.urgencia.fechaCierre` ya pasó, así que la cuenta atrás dejó de mostrarse sola. Sube `precio.actual` como habías anunciado y pon una fecha nueva, o cambia `urgencia.tipo` a `lanzamiento`. Lo que no puede pasar es que el precio siga igual y aparezca otro contador.",
        en: "The date in `precio.urgencia.fechaCierre` has passed, so the countdown removed itself. Raise `precio.actual` as announced and set a new date, or switch `urgencia.tipo` to `lanzamiento`. What must not happen is the price staying the same and a new countdown appearing.",
      },
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
