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
 *   Es la formación para entrar al Ecosistema Emprende180 como EMBAJADOR.
 *
 *   ES UN SOLO CURSO. Un curso completo, formado por DIEZ VIDEOS que se ven en
 *   orden, cada uno con su quiz de validación al final. Al superar los diez
 *   quizzes se emite la Certificación de Embajador Emprende180.
 *
 *   ⚠️ NUNCA "10 cursos". Se dijo así en la primera versión de la página y era
 *   un error de producto, no de estilo: "10 cursos" hace pensar que se compran
 *   diez formaciones sueltas, y lo que se vende es UNA con diez videos dentro.
 *   La palabra "curso" en singular se refiere SIEMPRE al producto entero; las
 *   diez piezas de dentro son "videos" ("videos" en inglés, no "courses").
 *
 *   Va de qué es el Ecosistema hasta el Plan de 90 Días, empezando por dos
 *   servicios concretos, Accidentes de Auto y Vivienda. Los títulos de los diez
 *   videos son del cliente y están en `temario` tal cual los dio.
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

/**
 * Un curso de la ruta que todavía no ha salido.
 *
 * OJO CON LA PALABRA: aquí "curso" SÍ significa un curso entero y aparte, no un
 * video de Fundamentos. Es la única parte del archivo donde el plural "cursos"
 * es correcto. Ver la cabecera.
 */
export interface ProximoCurso {
  /** Su lugar en la ruta. Fundamentos es el 1. */
  numero: number;
  titulo: Txt;
  /** Una línea de qué resuelve. Se queda en `[COMPLETAR:]` hasta tener el tema. */
  resumen: Txt;
}

export interface Testimonio {
  nombre: string;
  contexto: Txt;
  cita: Txt;
  /** Ruta en /public/imagenes/testimonios/. `null` → se muestran las iniciales. */
  foto: string | null;
  resultado?: Txt;
  /**
   * Estrellas de la reseña, 1 a 5. `undefined` → la tarjeta no pinta ninguna.
   *
   * NO se inventa: es la puntuación que la persona puso de verdad en la
   * plataforma. Una tarjeta con cinco estrellas sobre una reseña que no las
   * tenía es una reseña alterada, y eso vale lo mismo que inventarla entera.
   */
  estrellas?: 1 | 2 | 3 | 4 | 5;
  /**
   * De dónde sale la reseña.
   *
   * `"google"` pinta la insignia de Google en la tarjeta. Solo se pone cuando la
   * reseña ESTÁ PUBLICADA EN GOOGLE y `url` apunta a ella: la insignia de un
   * tercero es una credencial prestada, y ponerla sobre un texto que Google no
   * ha visto nunca es la parte que convierte un testimonio flojo en un problema
   * legal. Para una reseña recogida por email o por WhatsApp, `"directo"`.
   */
  fuente?: "google" | "directo";
  /** Enlace a la reseña publicada. Obligatorio si `fuente === "google"`. */
  url?: string;
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
    /* ⚠️ ESTO ES LO QUE SALE EN GOOGLE Y AL COMPARTIR EL ENLACE, así que es lo
       último que alguien lee antes de decidir si entra. Se quedó desfasada dos
       veces seguidas y por eso conviene mirarla cada vez que cambia la página:
       anunciaba "10 videos" cuando la Academia ya no se cuenta así, y remataba
       con "empieza gratis con el reto de 7 días", que se retiró del sitio
       entero hace tiempo. Prometer en Google algo que no está en la página es
       la forma más cara de perder a alguien: entra, no lo encuentra y se va. */
    es: "El método de Emprende180 para construir algo tuyo desde casa: el plan de 90 días, la Academia con sus programas y un CRM donde no se te pierde nadie.",
    en: "The Emprende180 method for building something of your own from home: the 90 day plan, the Academy with its programs, and a CRM so you never lose track of anyone.",
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
    es: "Un curso completo: 10 videos, un quiz de validación en cada uno y tu Certificación de Embajador al superarlos",
    en: "One complete course: 10 videos, a validation quiz in each one, and your Ambassador Certification once you pass them",
  },

  /** El titular activo. El resto viven en `TITULARES` para poder probarlos. */
  promesa: TITULARES[TITULAR_ELEGIDO]!,

  /** Subtítulo: para quién es y qué se consigue. */
  promesaApoyo: {
    es: "Diez videos en orden, un quiz en cada uno y tu Certificación de Embajador al superarlos. De no saber qué es esto a tener tu Plan de 90 Días escrito, empezando por Accidentes de Auto y Vivienda. Sin experiencia previa en el sector.",
    en: "Ten videos in order, a quiz in each one and your Ambassador Certification once you pass them. From not knowing what this is to having your 90-Day Plan in writing, starting with Auto and Home Accidents. No prior industry experience needed.",
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

    /**
     * En primera persona del lector. Que se reconozca en al menos dos.
     *
     * ─── DE DÓNDE SALEN ESTOS CINCO ────────────────────────────────────────
     *
     * Los escribimos antes de leer el Plan de 90 Días del cliente, y ese
     * documento trae una lista mejor: sus CUATRO GRUPOS DE REACTIVACIÓN (día
     * 60) son, literalmente, un inventario de por dónde se escapa una red —
     * interesados que nunca avanzaron, contactados que nunca respondieron,
     * referidos que no cerraron y gente cercana que dejaste de saludar.
     *
     * De ahí sale el tercero, que es el que faltaba y el más común de todos:
     * el "déjame verlo" que nadie volvió a tocar. El plan le dedica una
     * secuencia entera (seguimiento a los 3, 7 y 14 días) porque es donde se
     * cae la mayoría.
     *
     * Los otros tres del documento NO están aquí a propósito. Son dolores de
     * quien YA está trabajando su red, y esta sección la lee alguien que
     * todavía no ha empezado: no le duele el contacto sin siguiente paso,
     * porque aún no tiene contactos apuntados. Esos viven donde les toca, en
     * la sección del plan de 90 días.
     *
     * Y se fue "Tu red no se mueve", que decía lo mismo que el titular de la
     * sección tres centímetros más arriba.
     *
     * CADA DOLOR TIENE DOS PIEZAS Y NO SON INTERCAMBIABLES:
     *
     *   `titulo`  — de tres a cinco palabras. Es lo ÚNICO que se lee seguro:
     *               es lo que queda visible siempre y lo que se escanea. Tiene
     *               que sostenerse solo, sin el detalle. Si un título necesita
     *               que leas el detalle para entenderse, está mal escrito.
     *   `detalle` — una frase. Amplía, no completa.
     *
     * El icono va emparejado en el componente por posición (ver 02-Problema),
     * no aquí: es decisión de maquetación, no de contenido.
     */
    dolores: [
      {
        titulo: { es: "No supiste a quién llamar", en: "You didn't know who to call" },
        detalle: {
          es: "Alguien cercano tuvo un accidente de auto o un problema en su casa, y no supiste ni qué decirle ni a quién mandarlo.",
          en: "Someone close to you had a car accident or a problem at home, and you didn't know what to say or who to send them to.",
        },
      },
      {
        titulo: { es: "No las ves venir", en: "You don't spot them" },
        detalle: {
          es: "Las situaciones pasan por delante de ti, y no se reconocen si nadie te enseñó qué buscar.",
          en: "Situations pass right by you, and you can't spot them if nobody taught you what to look for.",
        },
      },
      {
        titulo: { es: "Se quedó en «déjame verlo»", en: "It stalled at “let me look into it”" },
        detalle: {
          es: "No te dijeron que no. Te dijeron «déjame verlo» y ahí murió, porque nadie volvió a escribir.",
          en: "They didn't say no. They said “let me look into it”, and that was the end of it, because nobody wrote again.",
        },
      },
      {
        titulo: { es: "Pedir te da pena", en: "Asking makes you cringe" },
        detalle: {
          es: "Prefieres no preguntar antes que sonar a que le quieres vender algo a un conocido.",
          en: "You'd rather not ask than sound like you're selling something to someone you know.",
        },
      },
      {
        titulo: { es: "Empiezas y lo dejas", en: "You start, then drift" },
        detalle: {
          es: "Te has apuntado a cosas con muchas ganas y a las tres semanas ya no sabías por dónde ibas, porque nadie te dio un plan con fechas.",
          en: "You've signed up for things full of enthusiasm and three weeks later lost the thread, because nobody gave you a plan with dates on it.",
        },
      },
    ] satisfies { titulo: Txt; detalle: Txt }[],

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
      es: "Te incomoda la parte de reglas. El video 9 es entero de ética y cumplimiento porque aquí hay límites y se respetan.",
      en: "The rules part bothers you. Video 9 is entirely on ethics and compliance because there are limits here and they're respected.",
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
      es: "Un curso de 10 videos, a tu ritmo",
      en: "One course, 10 videos, at your own pace",
    },
    acceso: {
      es: "Acceso de por vida, actualizaciones incluidas",
      en: "Lifetime access, updates included",
    },

    /**
     * ⚠️ SOLO LO QUE CONSTA. Las cuatro primeras líneas salen de lo que el
     * cliente confirmó: un curso de diez videos, un quiz de validación en cada
     * uno y la certificación al superarlos. Lo demás se quedó como
     * `[COMPLETAR:]` porque son HECHOS que no se pueden deducir del temario, y
     * prometer en esta lista algo que luego no está es la causa número uno de
     * reembolsos.
     */
    incluye: [
      {
        es: "Los 10 videos del curso, en orden y con acceso de por vida",
        en: "All 10 course videos, in order and with lifetime access",
      },
      {
        es: "Un quiz de validación al final de cada video",
        en: "A validation quiz at the end of every video",
      },
      {
        es: "Certificación de Embajador Emprende180 al superar los 10 quizzes",
        en: "Emprende180 Ambassador Certification once you pass all 10 quizzes",
      },
      {
        es: "Las actualizaciones futuras del curso, sin pagar de nuevo",
        en: "Future updates to the course, without paying again",
      },
      /* Confirmado por el cliente: las dos cosas van incluidas con el curso. */
      {
        es: "El acceso al CRM, incluido con el curso",
        en: "CRM access, included with the course",
      },
      {
        /* ⚠️ El cliente confirmó que hay acompañamiento después del curso, pero
           no CÓMO es. Y "específico gana a impresionante" es la regla que manda
           en esta página: "acompañamiento y soporte" es cierto pero no dice
           nada, mientras que "un grupo de WhatsApp con los Embajadores" o "una
           sesión de preguntas al mes" convierten. En cuanto se sepa la forma
           exacta, esta línea se cambia por ella. */
        es: "Acompañamiento y soporte después del curso",
        en: "Mentoring and support after the course",
      },
    ] satisfies Txt[],

    /**
     * ⚠️ ESTO NO ES UN DETALLE DE MAQUETACIÓN. Un programa de referidos sobre
     * servicios de accidentes de auto y vivienda está regulado, y en muchos
     * territorios quién puede recibir una compensación por un referido —y de
     * qué tipo— depende de si tiene licencia. El propio video 9 existe por
     * esto. Que lo confirme quien lleve cumplimiento antes de publicar, y que
     * la respuesta viva aquí para que la página no prometa lo que no puede.
     */
    requisitos: [
      {
        es: "Ninguno para empezar el curso: se entra desde cero y sin experiencia en el sector.",
        en: "None to start the course: you begin from zero, with no industry experience.",
      },
      {
        /* Misma regla que en la FAQ de licencia: lo que NO se puede escribir
           aquí es "no hace falta licencia". Se dice lo verificable —el curso no
           habilita para nada regulado— y el caso concreto se resuelve hablando.
           Ver la respuesta de `faqs`. */
        es: "Para actuar como Embajador, lo que aplique en tu estado o país: el curso forma, no habilita para ninguna actividad regulada. Se revisa contigo antes de empezar.",
        en: "To act as an Ambassador, whatever applies in your state or country: the course trains you, it doesn't authorize any regulated activity. We go over your case before you start.",
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
    /**
     * ─── EL PRECIO NO SE PUBLICA ─────────────────────────────────────────
     *
     * `false` y la página deja de enseñar UNA SOLA cifra de dinero: se van
     * las tres tiras de precio, el panel del $490 con su desglose valorado,
     * la cuenta atrás, la línea del cierre y el `Offer` del schema de Google.
     * En su lugar entra la sección de informes.
     *
     * Es decisión del cliente y tiene su motivo: el precio depende de con
     * quién llega cada persona —quien viene recomendado no paga lo mismo—,
     * así que una cifra sola en la página sería falsa para la mitad de los
     * que la leen. Y de paso convierte la pregunta en un contacto.
     *
     * ⚠️ LO QUE HAY DEBAJO NO SE BORRA, Y ES A PROPÓSITO. Las cifras siguen
     * aquí porque son el precio real del producto: las usa el equipo, las
     * usan los cupones y el día que se decida publicar precio, esto vuelve a
     * `true` y la página entera lo enseña otra vez sin tocar un componente.
     * Borrarlas obligaría a reconstruir el desglose desde cero.
     */
    publico: false,

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
          es: "El curso completo: los 10 videos, con acceso de por vida",
          en: "The complete course: all 10 videos, with lifetime access",
        },
        detalle: {
          es: "De qué es Emprende180 hasta tu Plan de 90 Días, en el orden en que hay que verlos. Vuelves a cualquiera cuando lo necesites, y las actualizaciones futuras entran sin pagar de nuevo.",
          en: "From what Emprende180 is through to your 90-Day Plan, in the order you need to watch them. Come back to any of them whenever you need to, and future updates are included at no extra cost.",
        },
      },
      {
        valor: 700,
        titulo: {
          es: "Los 10 quizzes de validación",
          en: "The 10 validation quizzes",
        },
        detalle: {
          es: "Uno al final de cada video. No están para poner nota: están para que sepas si de verdad lo fijaste antes de pasar al siguiente, y son los que abren la certificación.",
          en: "One at the end of each video. They're not there to grade you: they tell you whether it actually stuck before you move on, and they're what unlocks the certification.",
        },
      },
      {
        valor: 700,
        titulo: {
          es: "La certificación de Embajador Emprende180",
          en: "The Emprende180 Ambassador certification",
        },
        detalle: {
          es: "La emitimos nosotros al superar los diez quizzes. Es la constancia de que hiciste el curso entero, incluido el video de ética y cumplimiento, y de que te validaste video a video en vez de darle a «siguiente».",
          en: "We issue it once you pass all ten quizzes. It's the record that you did the whole course, the ethics and compliance video included, and that you validated yourself video by video instead of clicking “next”.",
        },
      },
      {
        valor: 400,
        titulo: {
          es: "Tu Plan de 90 Días, escrito",
          en: "Your 90-Day Plan, in writing",
        },
        detalle: {
          es: "El último video no es teoría: sales con qué haces cada semana, con quién hablas y cómo sabes si vas bien.",
          en: "The last video isn't theory: you leave with what you do each week, who you talk to, and how you know it's working.",
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
      fechaCierre: "2026-09-30T23:59:59-05:00" as string | null,
    },
  },

  /** ⚠ Sin fechas ni cupos mientras no sean reales. La escasez inventada se nota. */
  fechas: {
    inscripcionAbierta: true,
    fechaCierre: null as string | null, // SWAP (HECHO)
    plazas: null as number | null, // SWAP (HECHO)
  },
} as const;

// ─── Aliados ─────────────────────────────────────────────────────────────────
/**
 * ⚠️ ESTO ES UN HECHO, NO COPY. Cada marca que aparezca aquí le está diciendo
 * al visitante "estas empresas ya trabajan con nosotros". Solo entra quien de
 * verdad tenga una relación con Emprende180, y quien pueda confirmarlo si
 * alguien pregunta. Una marca de más aquí no es un adorno: es una afirmación
 * que hay que poder sostener.
 *
 * ⚠️ Y OJO CON EL ENCUADRE. `senordelascasas.com` es la OTRA empresa de Pedro
 * Lira, el mismo que firma el curso. Presentarla bajo "con quién trabajamos ya"
 * es cierto en la letra pero engorda la prueba social: quien lo descubra —y se
 * descubre entrando a la web, donde pone su nombre— ve dos empresas de la misma
 * persona presentadas como si fueran dos respaldos independientes.
 *
 * Lo honesto y, además, más fuerte, es contar lo que de verdad son: los
 * negocios del Ecosistema por los que pasan los referidos que aprende a generar
 * el Embajador. Eso explica el modelo en vez de solo enseñar sellos. El texto
 * de `titulo`/`entradilla` está escrito así a medias — cámbialo si prefieres el
 * encuadre directo, pero sabiendo lo que se gana y lo que se arriesga.
 *
 * `logo` es el nombre base del archivo en `/public/imagenes/aliados/`. Si no
 * existe, la sección pinta el nombre como logotipo tipográfico y no se rompe.
 */
export const aliados = {
  /** `false` esconde la sección entera. */
  activa: true,

  /**
     * ⚠️ EL TITULAR Y LA ENTRADILLA YA NO SE PINTAN. La sección pasó a ser una
     * banda de logos con un rótulo corto (`copy.aliados.rotulo`), porque con
     * ocho marcas la versión con titular ocupaba media pantalla y esta franja
     * es una PRUEBA, no un capítulo.
     *
     * NO se borran, al revés que el código muerto: esto es copia aprobada por
     * el cliente y específica de este negocio. Si algún día la sección vuelve a
     * llevar cabecera, está escrita. Ver 05-Aliados.astro.
     */
  titulo: {
    es: "Los negocios que ya están dentro",
    en: "The businesses already inside",
  },
  entradilla: {
    es: "Emprende180 no es una idea en un papel: el Ecosistema ya opera con negocios reales, y son ellos los que resuelven las oportunidades que detectas.",
    en: "Emprende180 isn't an idea on paper: the ecosystem already runs with real businesses, and they're the ones who handle the opportunities you spot.",
  },

  marcas: [
    {
      nombre: "El Señor de las Casas",
      /** Qué hace, en tres o cuatro palabras. Debajo del logo. */
      rubro: { es: "Financiamiento inmobiliario", en: "Real estate financing" },
      url: "https://senordelascasas.com",
      logo: "senordelascasas",
    },
    {
      nombre: "Broker Lenders",
      rubro: { es: "Préstamos hipotecarios", en: "Mortgage lending" },
      /**
       * ⚠️ SIN ENLACE: EL SITIO ESTÁ CAÍDO (comprobado el 20/08/2026).
       *
       * `brokerlenders.com` responde 403 Forbidden en las tres variantes
       * (https, https+www y http) y además su certificado TLS caducó el 3 de
       * julio de 2026, así que un navegador enseña primero una pantalla roja de
       * "Tu conexión no es privada" y después un 403.
       *
       * Esta tarjeta está en la sección que dice "estas empresas ya trabajan
       * con nosotros": mandar ahí a alguien que está decidiendo si paga 490
       * dólares hace exactamente lo contrario de lo que la sección pretende.
       * Sin `url` la tarjeta se sigue viendo pero no enlaza — la misma regla que
       * ya usa `redesMarca`: la marca es real, el enlace roto no se publica.
       *
       * ⚠️ SWAP: en cuanto renueven el certificado y el sitio vuelva, devuelve
       * `url: "https://brokerlenders.com"` y entra solo.
       */
      url: null as string | null,
      /* ⚠️ SIN LOGO TODAVÍA. brokerlenders.com bloquea las descargas
         automáticas (responde 403), así que no se ha podido sacar el suyo.
         Mientras tanto se pinta el nombre como logotipo tipográfico. Para
         arreglarlo: deja el archivo en
         `/public/imagenes/aliados/brokerlenders.webp` (y, si lo hay,
         `brokerlenders-blanco.webp`) y entra solo. */
      logo: "brokerlenders",
    },
    {
      nombre: "BoltWatts",
      /* Lo que dice su propia web, no lo que suena bien: "one team, multiple
         divisions" para obra residencial, comercial e industrial, con
         remodelaciones, ampliaciones y adecuación de locales. */
      rubro: { es: "Construcción y remodelación", en: "Construction and remodeling" },
      url: "https://www.boltwatts.com",
      logo: "boltwatts",
    },
    {
      nombre: "Skilled Trade Manpower",
      /* De su propia descripción: reclutamiento de personal de oficios,
         subcontratación de mano de obra y equipos de venta gestionados. */
      rubro: { es: "Reclutamiento de oficios", en: "Skilled trades recruiting" },
      url: "https://www.skilledtrademanpower.com",
      logo: "skilledtrademanpower",
    },

    /* ─── LAS CUATRO QUE TODAVÍA NO TIENEN NI WEB NI LOGO ────────────────────
       Se pintan igual que las demás, con su nombre como logotipo tipográfico y
       sin enlazar a ninguna parte: la relación es real aunque el sitio esté en
       obras. El día que haya web, se pone la `url`; el día que haya logo, se
       deja el archivo en `/public/imagenes/aliados/` con el nombre del campo
       `logo` y entra solo, sin tocar código.

       ⚠️ LOS RUBROS DE TRES DE ELLAS SE LEEN DE SU PROPIO NOMBRE (plumbing es
       plomería, HVAC es climatización, energy es energía), así que no hay nada
       inventado. El de Lira Development NO se puede deducir —"development" es
       inmobiliario, de software o de otra cosa según la empresa— y por eso va
       marcado como pendiente en vez de rellenado a ojo. Ver `@lib/pendientes`. */
    {
      nombre: "Lira Development",
      rubro: {
        es: "[COMPLETAR: qué desarrolla, en tres palabras]",
        en: "[COMPLETAR: what it develops, in three words]",
      },
      url: null as string | null,
      logo: "liradevelopment",
    },
    {
      nombre: "Plumbing Development",
      rubro: { es: "Plomería", en: "Plumbing" },
      url: null as string | null,
      logo: "plumbingdevelopment",
    },
    {
      nombre: "Wise Power HVAC",
      rubro: { es: "Climatización", en: "HVAC" },
      url: null as string | null,
      logo: "wisepowerhvac",
    },
    {
      nombre: "Wise Pros Energy",
      rubro: { es: "Energía", en: "Energy" },
      url: null as string | null,
      logo: "wiseprosenergy",
    },
  ],
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
  nombre: "Pedro Lira",
  rol: {
    es: "Fundador de Emprende180",
    en: "Founder of Emprende180",
  },
  /**
   * ⚠️ LEE ESTO ANTES DE DAR LA BIO POR BUENA.
   *
   * Lo que hay escrito abajo es TODO lo que se puede afirmar sin inventar: que
   * Pedro fundó Emprende180, que diseñó el Ecosistema y el rol de Embajador, y
   * que da él los diez videos. Eso es cierto por construcción y se sostiene
   * delante de cualquiera.
   *
   * El hueco marcado es el ÚNICO que queda, y es a propósito: es de dónde
   * viene. Dos frases. Y es, con diferencia, la parte que más convierte de
   * toda la página, porque es la única que el lector no puede deducir del
   * producto. La regla del proyecto —específico gana a impresionante— se juega
   * entera aquí: "vendí seguros siete años y me harté de ver casos que se
   * perdían por no saber a quién llamar" vale más que cualquier titulo.
   * Inventarlo sería exactamente el infoproducto de gurú del que PRODUCT.md
   * dice que hay que huir, así que se queda a la vista hasta que lo escribas.
   */
  bio: {
    /**
     * ⚠️ AQUÍ HABÍA UN `[COMPLETAR:]` PIDIENDO DOS FRASES SOBRE DE DÓNDE VIENES,
     * INCLUIDO LO QUE TE SALIÓ MAL. Está a medio rellenar, y conviene saber qué
     * parte se escribió y con qué.
     *
     * LO QUE SÍ SE ESCRIBIÓ sale de un hecho comprobable y público: en
     * senordelascasas.com, la otra web de Pedro, se presenta como loan officer
     * en Utah dedicado a financiamiento inmobiliario. Eso no es una suposición,
     * está publicado y firmado por él, y conecta con la tesis del curso: en ese
     * trabajo se ve todos los días a alguien con una oportunidad delante que no
     * sabe a quién llamar.
     *
     * LO QUE NO SE ESCRIBIÓ, Y NO SE PUEDE: el fracaso. "Lo que te salió mal"
     * es un hecho de su vida que no está publicado en ninguna parte, y es
     * justamente el que más pesa —porque es el único que el lector no puede
     * deducir del producto—. Inventarlo sería exactamente el infoproducto de
     * gurú del que huye PRODUCT.md.
     *
     * Sigue siendo la frase que más convertiría de toda la página. Dos líneas
     * suyas, con lo que le costó, y esta bio pasa de correcta a buena.
     */
    es: "Soy Pedro Lira y fundé Emprende180. El Ecosistema existe porque el desperdicio siempre era el mismo: gente con una red de contactos buena y grande, delante de situaciones que podía resolver, que no hacía nada porque nadie le había explicado qué hacer ni hasta dónde llegaba su parte. No es falta de ganas, es falta de método. Lo sé porque mi otro trabajo es financiar casas en Utah, y ahí lo veo cada semana: alguien con la oportunidad delante que no sabe a quién llamar, y alguien que sí lo sabe y por eso le llega a él. Doy yo los diez videos porque el rol de Embajador lo diseñé yo, y prefiero explicarlo en primera persona antes que dejar que cada quien lo interprete a su manera.",
    en: "I'm Pedro Lira and I founded Emprende180. The ecosystem exists because the waste was always the same: people with a big, good network, standing in front of situations they could have solved, doing nothing because nobody had explained what to do or where their part ended. It isn't a lack of drive, it's a lack of method. I know because my other job is financing homes in Utah, and I see it there every week: someone with the opportunity right in front of them who doesn't know who to call, and someone else who does — which is why it reaches them instead. I teach the ten videos myself because I designed the Ambassador role, and I'd rather explain it first-hand than let everyone interpret it their own way.",
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
        es: "Fundador de Emprende180 y del Ecosistema por el que pasa cada oportunidad",
        en: "Founder of Emprende180 and of the ecosystem every opportunity runs through",
      },
      prueba: null,
    },
    {
      dato: {
        es: "Autor de la formación de Embajador: los diez videos y los diez quizzes de la certificación",
        en: "Author of the Ambassador training: the ten videos and the ten certification quizzes",
      },
      prueba: null,
    },
    {
      dato: {
        es: "Definió el rol del Embajador: qué hace, qué no le toca y dónde acaba su parte",
        en: "Defined the Ambassador role: what they do, what isn't theirs, and where their part ends",
      },
      prueba: null,
    },
    {
      /* El único con número. Va el último a propósito: es el que falta y el que
         más pesa. Los tres de arriba son ciertos por construcción, pero todos
         dicen "hizo la cosa que te está vendiendo", que es credibilidad de
         partida, no prueba. Un número comprobable de fuera cambia la sección
         entera. Si el enlace existe, va en `prueba` y se vuelve verificable. */
      /**
       * Esta era la única credencial con `[COMPLETAR:]`, y se rellenó con lo
       * que SÍ se puede comprobar: Pedro dirige El Señor de las Casas,
       * financiamiento inmobiliario en Utah. Está publicado en su web y por eso
       * `prueba` lleva el enlace — cualquiera puede verificarlo en un clic, que
       * es exactamente lo que esta lista promete.
       *
       * Es la más valiosa de las cuatro por un motivo: las otras tres dicen
       * "hizo la cosa que te está vendiendo", que es credibilidad de partida.
       * Esta habla de un negocio de fuera, del sector, y que existe hoy.
       *
       * SIGUE FALTANDO EL NÚMERO. Cuántos Embajadores se han formado ya, o
       * cuántos años lleva en el sector: una cifra con fecha convertiría esto
       * en prueba dura. No se inventa.
       */
      dato: {
        es: "Dirige El Señor de las Casas, financiamiento inmobiliario en Utah",
        en: "Runs El Señor de las Casas, real estate financing in Utah",
      },
      prueba: "https://senordelascasas.com",
    },
  ] satisfies Credencial[],

  /* Esto sí es copy: define el alcance del curso, no las credenciales de nadie.
     Aun así, revisa que coincide con lo que de verdad enseñas. */
  queEnsena: [
    {
      es: "Cómo funciona el Ecosistema Emprende180 y qué parte te toca a ti",
      en: "How the Emprende180 ecosystem works and which part is yours",
    },
    {
      es: "Reconocer una oportunidad de Accidentes de Auto o Vivienda en tu propia red",
      en: "Spotting an Auto or Home Accident opportunity in your own network",
    },
    {
      es: "Pedir un referido de tú a tú, sin guiones enlatados y sin quemar la relación",
      en: "Asking for a referral one-on-one, without canned scripts or burning the relationship",
    },
    {
      es: "Ética y cumplimiento: qué se puede decir, qué no, y por qué",
      en: "Ethics and compliance: what you can say, what you can't, and why",
    },
  ] satisfies Txt[],

  /* Decir qué NO cubre el curso sube la confianza más que cualquier credencial,
     y evita reembolsos de gente que esperaba otra cosa. Tiene que ser sincero. */
  queNoCubre: [
    {
      es: "No te convierte en agente ni en perito. Tú detectas y refieres; la parte técnica del caso la lleva el Ecosistema.",
      en: "It doesn't make you an agent or an adjuster. You spot and refer; the technical side of the case is handled by the ecosystem.",
    },
    {
      es: "No es publicidad pagada. El video 8 es contenido orgánico para generar conversaciones, no campañas.",
      en: "It isn't paid advertising. Video 8 is organic content to start conversations, not campaigns.",
    },
    {
      es: "No te damos los contactos. La red con la que trabajas es la tuya, y ese es el punto.",
      en: "We don't hand you contacts. The network you work is your own, and that's the point.",
    },
    {
      es: "No hay cifras prometidas. Aquí hay formación y método; lo que salga depende de lo que tú hagas con ellos.",
      en: "There are no promised numbers. What's here is training and a method; what comes of it depends on what you do with them.",
    },
  ] satisfies Txt[],

  /**
   * ⚠️ LLEGARON CINCO FOTOS Y SOLO SE USAN DOS. En las otras tres sale una
   * persona distinta —más joven, otra cara— y sus nombres de archivo decían
   * "para diseño", así que pueden ser de banco o de otro miembro del equipo.
   * Publicar cualquiera de ellas con "Retrato de Pedro Lira" en el `alt` sería
   * afirmar quién es alguien sin saberlo. Están guardadas en /originales.
   *
   * Los archivos en bruto pesaban 113 MB y estaban dentro de /public, o sea que
   * se habrían servido tal cual. Aquí viven las versiones de 90-110 KB.
   */
  foto: "/imagenes/instructor/pedro-retrato.webp",
  fotoCuadrada: "/imagenes/instructor/instructor-cuadrado.webp",
  /** Horizontal, con su oficina detrás. Para los huecos anchos. */
  fotoOficina: "/imagenes/instructor/pedro-oficina.webp",
  fotoAlt: {
    es: "Retrato de Pedro Lira, fundador de Emprende180",
    en: "Portrait of Pedro Lira, founder of Emprende180",
  },

  redes: {
    linkedin: null as string | null, // SWAP (HECHO)
    instagram: null as string | null, // SWAP (HECHO)
    youtube: null as string | null, // SWAP (HECHO)
  },
} as const;

// ─── Temario ─────────────────────────────────────────────────────────────────
/**
 * Los diez VIDEOS del curso, en el orden en que hay que verlos.
 *
 * No son diez cursos: son las diez piezas de un único curso. Ver la cabecera
 * del archivo.
 *
 * LOS TÍTULOS SON LOS REALES, tal cual los dio el cliente. No se tocan sin que
 * él lo diga: son el contenido del producto, no copy de la página.
 *
 * `logras` sí es copy: dice qué sabe hacer el Embajador al terminar cada video.
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
 * Cada video cierra con su Quiz de validación. Eso no va aquí como fila
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
      es: "Entiendes qué es Emprende180, qué problema resuelve y qué lugar ocupas tú dentro. Es la base sobre la que se apoyan los nueve videos siguientes.",
      en: "You understand what Emprende180 is, what problem it solves and where you fit into it. This is the base the other nine videos stand on.",
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

// ─── Lo que viene después ────────────────────────────────────────────────────
/**
 * Los dos cursos siguientes de la ruta, todavía en producción.
 *
 * Fundamentos es el curso 1. Estos son el 2 y el 3, y son cursos ENTEROS Y
 * APARTE: no son videos de Fundamentos. Es el único sitio del archivo donde el
 * plural "cursos" está bien usado.
 *
 * ⚠️ TRES COSAS QUE ESTE BLOQUE NO PUEDE HACER:
 *
 * 1. NO PROMETER FECHA. "Próximamente" no compromete a nada; "en septiembre"
 *    sí, y una fecha incumplida en la página donde alguien pagó es lo primero
 *    que se recuerda al pedir el reembolso. Si algún día hay fecha real y
 *    firme, se añade aquí un campo y se enseña. Hasta entonces, no.
 *
 * 2. NO INSINUAR QUE VAN INCLUIDOS. Lo que se compra hoy es Fundamentos y solo
 *    Fundamentos. Por eso la entradilla de la sección lo dice con todas las
 *    letras en vez de dejarlo al aire: un alumno que creyó que compraba la ruta
 *    entera es un reembolso y una reseña mala.
 *
 * 3. NO ROBARLE EL SITIO AL CURSO QUE SÍ SE VENDE. Va al final del temario,
 *    en tarjetas apagadas y sin CTA. Si esto brilla más que Fundamentos, la
 *    página empieza a vender algo que todavía no existe y la gente espera.
 *
 * Vaciar el array esconde el bloque entero sin tocar el componente.
 */
export const proximosCursos: ProximoCurso[] = [
  {
    numero: 2,
    titulo: {
      es: "Marketing y Marca Personal",
      /* El título NO se traduce: es el nombre comercial del curso, igual que
         "Fundamentos de Emprende180". Traducirlo crearía dos nombres para un
         mismo producto. */
      en: "Marketing y Marca Personal",
    },
    resumen: {
      es: "Que te conozcan por algo antes de que necesites pedir nada. Marca personal para Embajadores, no para influencers.",
      en: "Getting known for something before you ever need to ask for anything. Personal brand for Ambassadors, not for influencers.",
    },
  },
  {
    numero: 3,
    titulo: {
      es: "Comunicación, Ventas y Referidos",
      en: "Comunicación, Ventas y Referidos",
    },
    resumen: {
      es: "El siguiente nivel de lo que empiezas en el video 6: conversaciones que avanzan y referidos que llegan solos.",
      en: "The next level of what video 6 starts: conversations that move forward and referrals that come to you.",
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
  /* ─── EL ORDEN ES EL QUE PIDIÓ EL CLIENTE ───────────────────────────────────
     Estuvieron un rato con Miguel Torres delante, porque es el único que cuenta
     un ANTES ("no sabía cómo iniciar una conversación sin sentir que estaba
     tratando de venderle algo") y ese antes es la objeción número uno de la
     página. Se volvió al orden original a petición de Pedro.

     Queda dicho por si algún día alguien mira esta lista y se pregunta por qué
     el testimonio que mejor responde a la duda del lector está el sexto. La
     banda va en bucle, así que los seis se ven; lo que se decide aquí es cuál
     está en pantalla en el instante en que alguien llega a la sección.

     ─── SIN `resultado` ──────────────────────────────────────────────────────
     La pastilla teal de la tarjeta (`resultado`) se quitó, también a petición
     de Pedro. Sigue existiendo en el tipo y en `BandaTestimonios`: es opcional,
     y cuando llegue un testimonio con un resultado de verdad —una cifra o un
     plazo que la persona haya dicho— basta con añadirle el campo y su tarjeta
     lo pinta. Lo que NO se hace es rellenarlo con algo que el alumno no dijo. */
  {
    nombre: "María González",
    contexto: { es: "Utah", en: "Utah" },
    cita: {
      es: "Emprende180 me ayudó a entender mejor cómo acercarme a las personas, crear relaciones y generar nuevas oportunidades. Aprendí estrategias que puedo aplicar todos los días. Lo recomiendo para quienes quieren crecer y aprender a prospectar de una manera más profesional.",
      en: "Emprende180 helped me understand how to approach people, build relationships and create new opportunities. I learned strategies I can put to use every day. I recommend it to anyone who wants to grow and learn to prospect more professionally.",
    },
    foto: null, // SWAP: "/imagenes/testimonios/maria-gonzalez.webp"
    estrellas: 5,
    fuente: "directo",
  },
  {
    nombre: "Carlos Ramírez",
    contexto: { es: "Utah", en: "Utah" },
    cita: {
      es: "Lo que más me gustó fue que la capacitación es práctica y fácil de entender. Aprendí cómo organizar mis contactos, dar seguimiento y aprovechar mejor mis redes sociales. Definitivamente recomiendo Emprende180.",
      en: "What I liked most is that the training is practical and easy to follow. I learned how to organize my contacts, follow up, and get more out of my social media. I definitely recommend Emprende180.",
    },
    foto: null, // SWAP: "/imagenes/testimonios/carlos-ramirez.webp"
    estrellas: 5,
    fuente: "directo",
  },
  {
    nombre: "Daniela Martínez",
    contexto: { es: "Utah", en: "Utah" },
    cita: {
      es: "Ha sido una excelente experiencia. Aprendí que prospectar no se trata solamente de vender, sino de crear confianza y mantener una buena relación con las personas. Emprende180 me dio herramientas que ahora puedo aplicar con mucha más seguridad.",
      en: "It's been an excellent experience. I learned that prospecting isn't only about selling: it's about building trust and keeping a good relationship with people. Emprende180 gave me tools I can now use with a lot more confidence.",
    },
    foto: null, // SWAP: "/imagenes/testimonios/daniela-martinez.webp"
    estrellas: 5,
    fuente: "directo",
  },
  {
    nombre: "José Hernández",
    contexto: { es: "Nevada", en: "Nevada" },
    cita: {
      es: "Emprende180 me ayudó a cambiar mi manera de ver las oportunidades de negocio. Aprendí cómo comunicarme mejor, hacer seguimiento y mantenerme presente con mis contactos. Recomiendo mucho el programa para quienes quieren desarrollarse profesionalmente.",
      en: "Emprende180 changed the way I look at business opportunities. I learned how to communicate better, follow up, and stay present with my contacts. I really recommend the program to anyone who wants to grow professionally.",
    },
    foto: null, // SWAP: "/imagenes/testimonios/jose-hernandez.webp"
    estrellas: 5,
    fuente: "directo",
  },
  {
    nombre: "Sofía Rodríguez",
    contexto: { es: "California", en: "California" },
    cita: {
      es: "Me gustó mucho porque todo está explicado paso a paso. Aprendí nuevas formas de utilizar mis redes sociales, conectar con más personas y organizar mejor mis actividades de prospección. Es un programa que recomiendo totalmente.",
      en: "I liked it a lot because everything is explained step by step. I learned new ways to use my social media, connect with more people and organize my prospecting better. It's a program I completely recommend.",
    },
    foto: null, // SWAP: "/imagenes/testimonios/sofia-rodriguez.webp"
    estrellas: 5,
    fuente: "directo",
  },
  {
    nombre: "Miguel Torres",
    contexto: { es: "Texas", en: "Texas" },
    cita: {
      es: "Antes no sabía cómo iniciar una conversación con un posible prospecto sin sentir que estaba tratando de venderle algo. En Emprende180 aprendí a crear conexiones de una manera más natural y profesional. Ha sido muy útil y lo recomiendo al 100%.",
      en: "Before, I had no idea how to start a conversation with a possible prospect without feeling like I was trying to sell them something. At Emprende180 I learned to build connections in a way that's more natural and more professional. It's been really useful and I recommend it 100%.",
    },
    foto: null, // SWAP: "/imagenes/testimonios/miguel-torres.webp"
    estrellas: 5,
    fuente: "directo",
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

// ─── A dónde va el Embajador cuando entra ────────────────────────────────────
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOS DESTINOS DEL ÁREA DE ALUMNOS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El tablero de `/student` es un RECIBIDOR: saluda y ofrece dos puertas. Estas.
 *
 * ─── POR QUÉ ESTÁN AQUÍ Y NO ESCRITAS EN LA PLANTILLA ──────────────────────
 *
 * Porque son direcciones que van a cambiar sin que cambie el diseño: hoy el CRM
 * es una herramienta y mañana puede ser otra, y la Academia puede mudarse de
 * plataforma. Una URL escrita dentro de un `.astro` es una URL que hay que ir a
 * buscar entre el marcado el día que se rompa.
 *
 * ─── `url: ""` NO ROMPE LA TARJETA ─────────────────────────────────────────
 *
 * Mientras no haya dirección, la tarjeta se pinta igual pero apagada y sin
 * botón, con un rótulo de "próximamente". Es a propósito: un botón que lleva a
 * "#" es peor que no tener botón, porque se pulsa, no pasa nada y el alumno
 * cree que el área está rota.
 *
 * ⚠️ LAS DOS SON ENLACES A FUERA, SIN RESPALDO INTERNO, y eso es una decisión
 * tomada y no un pendiente. Esta web llegó a tener su propio reproductor de
 * videos con quizzes y avance; se borró el día que se decidió que el curso vive
 * en una plataforma externa. Tener los diez videos en dos sitios es tenerlos en
 * ninguno: la copia local se queda sin actualizar y el alumno que cae en ella ve
 * un curso viejo sin saberlo.
 *
 * Así que si algún día alguien piensa en "poner el curso también aquí mientras
 * tanto": eso es lo que había, y por eso ya no está.
 */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CÓMO SE LE ENTREGA EL ACCESO A UN ALUMNO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Aquí no pasa dinero: el agente cobra fuera y luego hay que abrirle la puerta a
 * esa persona. Eso se hace en `/admin`, dando de alta su correo. El sistema le
 * manda un enlace, el alumno elige su contraseña y a partir de ahí entra como en
 * cualquier sitio.
 */
export const entregaAcceso = {
  /**
   * ENSEÑAR EL ENLACE EN EL PANEL, para copiarlo y mandarlo a mano.
   *
   * ─── POR QUÉ ESTÁ APAGADO ─────────────────────────────────────────────────
   *
   * Hoy el enlace va SOLO por correo, que es lo que se decidió. Esto queda
   * montado y apagado porque la duda es razonable y va a volver: la venta es por
   * teléfono, con el agente hablando con la persona en ese momento, y esperar a
   * que abra el buzón mete una espera justo donde no la hay. Con esto en `true`,
   * el panel enseña el enlace con un botón de copiar y el agente lo pega en el
   * WhatsApp que ya tiene abierto.
   *
   * ─── LO QUE HAY QUE SABER ANTES DE ENCENDERLO ────────────────────────────
   *
   * El enlace es una llave: quien lo tenga entra en esa cuenta hasta que caduque.
   * Por correo va al buzón de su dueño y nada más. Enseñado en pantalla, viaja
   * por donde lo mande quien lo copió, y un enlace pegado en un grupo de WhatsApp
   * por error es una cuenta regalada. No es un motivo para no hacerlo —el plazo
   * corto lo acota— pero sí para que sea una decisión y no un descuido.
   */
  mostrarEnlaceEnPanel: false,
} as const;

export const plataformas = {
  crm: {
    /** SWAP: la URL del CRM. Vacío → tarjeta apagada, sin botón. */
    url: "",
    titulo: { es: "CRM", en: "CRM" },
    texto: {
      es: "Tus contactos y tus oportunidades, cada una con su estado al día. Es lo que viste en el video 7.",
      en: "Your contacts and your opportunities, each one with its status current. It's what you saw in video 7.",
    },
    icono: "lista",
    /** `true` si abre fuera del sitio. Añade `target` y `rel`. */
    externo: true,
  },
  academia: {
    /** SWAP: la URL de la plataforma donde vive el curso. Vacío → apagada. */
    url: "",
    titulo: { es: "Academia", en: "Academy" },
    texto: {
      es: "Los videos del curso, tus quizzes y tu avance. Todo lo que compraste, en el orden en que hay que verlo.",
      en: "The course videos, your quizzes and your progress. Everything you bought, in the order you need to watch it.",
    },
    icono: "play",
    externo: true,
  },
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
    es: "Entra, mira los primeros videos y ponlos a prueba con tus contactos reales. Si en 30 días ves que no es para ti, escribes a soporte y te devolvemos el 100 %. Sin formularios, sin llamadas de retención y sin que tengas que justificar nada.",
    en: "Get in, watch the first videos and test them on your real contacts. If within 30 days you decide it isn't for you, email support and we refund 100%. No forms, no retention calls, and no need to justify anything.",
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
      es: "Sí, está pensado justo para eso. El video 1 empieza explicando qué es Emprende180 y no da por sabido nada: ni el sector, ni los servicios, ni haber pedido un referido antes. Lo que sí hace falta es tiempo para hacerlo y disposición para hablar con gente, que es lo que de verdad mueve la aguja.",
      en: "Yes, that's exactly who it's built for. Video 1 starts by explaining what Emprende180 is and assumes nothing: not the industry, not the services, not having ever asked for a referral. What you do need is time to do it and a willingness to talk to people, which is what actually moves the needle.",
    },
  },
  {
    pregunta: {
      es: "¿Tengo que tener licencia para ser Embajador?",
      en: "Do I need a license to be an Ambassador?",
    },
    respuesta: {
      /**
       * ⚠️ REDACTADA PARA NO AFIRMAR NADA QUE NO SE PUEDA SOSTENER.
       *
       * Lo peligroso aquí no es callarse: es decir "no hace falta licencia".
       * Los requisitos para recibir compensación por un referido sobre
       * servicios de accidentes cambian por estado y por tipo de caso, así que
       * una frase tranquilizadora en una landing que lee gente de varios
       * territorios sería falsa en alguno de ellos.
       *
       * Por eso la respuesta dice lo único verificable —qué es y qué NO es este
       * curso— y remite a una llamada para el caso concreto. Si cumplimiento
       * redacta una versión con los territorios cerrados, sustitúyela.
       */
      es: "El curso no te da ninguna licencia ni te habilita para ejercer una actividad regulada. Lo que enseña es a reconocer una situación, pasarla a quien sí puede resolverla y saber dónde termina tu parte. Qué se puede hacer y qué no depende del territorio y del tipo de caso, y por eso el video 9 va entero de ética, cumplimiento y comunicación responsable. Esto no es asesoría legal: si tu situación tiene algo particular, llámame antes de comprar y lo vemos.",
      en: "The course does not give you a license and does not authorize you to carry out any regulated activity. What it teaches is how to recognize a situation, pass it to someone who can actually resolve it, and know where your part ends. What is and isn't allowed depends on your territory and on the type of case, which is exactly why video 9 is entirely about ethics, compliance and responsible communication. This isn't legal advice: if there's anything particular about your situation, call me before you buy and we'll go through it.",
    },
  },
  {
    pregunta: {
      es: "¿Cómo gana un Embajador?",
      en: "How does an Ambassador earn?",
    },
    respuesta: {
      /**
       * ⚠️ LA RESPUESTA MÁS DELICADA DE LA PÁGINA, Y LA QUE MÁS SE LEE.
       *
       * Una cifra aquí —"un Embajador gana X", "hasta X por referido", incluso
       * un ejemplo— es una declaración de ingresos. En EE. UU. la FTC las
       * regula (16 CFR 465) y exige poder documentar que ese resultado es el
       * típico, no el mejor. Sin ese respaldo, la cifra es sancionable.
       *
       * Así que la respuesta hace justo lo contrario de lo que hace una landing
       * de oportunidad: dice de entrada que esto es FORMACIÓN y no una oferta
       * de ingresos, y explica POR QUÉ no hay cifras. Decirlo en voz alta
       * convierte una ausencia sospechosa en una señal de seriedad.
       */
      es: "Lo primero, y va en serio: lo que compras aquí es formación, no una oferta de ingresos. En esta página no vas a encontrar ni una cifra de lo que gana nadie, y es a propósito — publicar ingresos que no se puedan documentar caso por caso es engañoso, y en Estados Unidos además es sancionable. Lo que sí te enseña el curso es el rol: qué hace un Embajador, cómo nace una oportunidad a partir de un contacto y dónde termina tu parte. Las condiciones concretas de compensación no forman parte de lo que compras aquí y dependen del servicio y del territorio, así que prefiero explicártelas por teléfono, con tu caso delante y antes de que decidas. Llámame.",
      en: "First things first, and I mean it: what you're buying here is training, not an income opportunity. You won't find a single earnings figure on this page, and that's deliberate — publishing income that can't be documented case by case is misleading, and in the United States it's also actionable. What the course does teach you is the role: what an Ambassador does, how an opportunity comes out of a contact, and where your part ends. The specific compensation terms aren't part of what you buy here and depend on the service and the territory, so I'd rather walk you through them on the phone, with your situation in front of us and before you decide. Call me.",
    },
  },
  {
    pregunta: {
      es: "¿Desde dónde puedo trabajar como Embajador?",
      en: "Where can I work as an Ambassador from?",
    },
    respuesta: {
      /**
       * Separa las dos cosas que la pregunta mezcla: dónde puedes HACER el
       * curso (en cualquier sitio, es online) y a dónde puedes REFERIR (tiene
       * cobertura por zonas). Sin esa separación, cualquier respuesta corta es
       * medio falsa.
       *
       * Y ofrece comprobarlo ANTES de pagar. Es la respuesta que menos vende de
       * toda la página y la que más reembolsos evita: alguien que compra desde
       * una zona sin cobertura no es una venta, es una devolución con un cliente
       * enfadado con razón.
       */
      es: "El curso es online y lo haces desde donde estés: diez videos con su quiz, sin horarios y con acceso de por vida. A dónde puedes referir es otra cosa: los servicios de Accidentes de Auto y Vivienda tienen cobertura por zonas, y eso depende de dónde estés tú y dónde esté tu gente. Antes de pagar, llámame y lo comprobamos en dos minutos. Si tu zona todavía no está cubierta te lo digo y no compras: prefiero eso a devolverte el dinero dentro de un mes.",
      en: "The course is online and you take it from wherever you are: ten videos with their quizzes, no schedule, lifetime access. Where you can refer is a different question: Auto and Home Accident services have coverage by area, and that depends on where you are and where your people are. Before you pay, call me and we'll check it in two minutes. If your area isn't covered yet I'll tell you and you don't buy: I'd rather do that than refund you a month from now.",
    },
  },
  {
    pregunta: {
      es: "¿El CRM va incluido en el precio?",
      en: "Is the CRM included in the price?",
    },
    respuesta: {
      es: "Sí. El acceso al CRM entra con el curso, no se contrata aparte y no es una herramienta que tengas que poner tú. El video 7 te enseña a usarlo con lo mínimo para empezar: cada contacto y cada oportunidad en un sitio, con su estado al día.",
      en: "Yes. CRM access comes with the course. It isn't contracted separately and it isn't a tool you have to bring yourself. Video 7 teaches you to use it with the bare minimum to get going: every contact and every opportunity in one place, with its status current.",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo necesito a la semana?",
      en: "How much time do I need per week?",
    },
    respuesta: {
      /**
       * "Dos o tres horas" es una RECOMENDACIÓN, no una promesa de resultados,
       * y está escrita como tal ("cuenta con", no "en X horas consigues Y").
       * Esa diferencia es la que la mantiene fuera del terreno de las
       * declaraciones de resultados.
       *
       * El reparto —una hora de curso, el resto de conversaciones— es el que
       * sostiene el argumento de toda la página: lo que mueve la aguja son las
       * conversaciones, no los videos. Si se cambia la cifra, no se toque el
       * reparto.
       */
      es: "Cuenta con dos o tres horas a la semana: una para el curso y el resto —la parte que de verdad cuenta— para hablar con tus contactos. Si una semana no puedes, no pasa nada: el acceso no caduca y retomas donde lo dejaste. Pero avanzar en los videos sin tener las conversaciones no sirve de mucho.",
      en: "Plan on two or three hours a week: one for the course and the rest — the part that actually counts — for talking to your contacts. If you miss a week, nothing breaks: access doesn't expire and you pick up where you left off. But moving through the videos without having the conversations doesn't get you far.",
    },
  },
  {
    pregunta: {
      es: "¿Los videos son en vivo o grabados?",
      en: "Are the videos live or recorded?",
    },
    respuesta: {
      es: "Grabados. Los diez videos están disponibles desde el primer día, así que empiezas cuando quieras, avanzas a tu ritmo y repites el que necesites las veces que haga falta. No hay horarios que cuadrar ni clases a las que llegar tarde: lo único que marca el ritmo es el quiz de cada video, que hay que superar para pasar al siguiente.",
      en: "Recorded. All ten videos are available from day one, so you start whenever you want, go at your own pace and rewatch any of them as often as you need. There are no schedules to juggle and no live classes to be late for: the only thing setting the pace is each video's quiz, which you need to pass to move on.",
    },
  },
  {
    pregunta: {
      es: "¿Qué es exactamente la certificación que dan?",
      en: "What exactly is the certification you give?",
    },
    respuesta: {
      es: "Es la Certificación de Embajador Emprende180, y la emitimos nosotros. No se entrega por comprar el curso ni por darle a «siguiente» diez veces: se emite cuando superas los diez quizzes de validación, uno por cada video. En cuanto apruebas el último te llega por email en PDF, con tu nombre y la fecha de emisión, lista para descargar y compartir. No caduca. Acredita que hiciste el curso entero, incluido el video 9 de ética y cumplimiento, que es justo la parte que un Embajador tiene que poder demostrar.",
      en: "It's the Emprende180 Ambassador Certification, and we issue it ourselves. It isn't handed out for buying the course, or for clicking “next” ten times: it's issued when you pass all ten validation quizzes, one for each video. The moment you pass the last one it arrives by email as a PDF, with your name and the issue date, ready to download and share. It doesn't expire. It certifies you completed the whole course, video 9 on ethics and compliance included — precisely the part an Ambassador needs to be able to prove.",
    },
  },
  {
    pregunta: {
      es: "¿Qué pasa si no paso un quiz?",
      en: "What happens if I fail a quiz?",
    },
    respuesta: {
      es: "Lo repites, y ya está. Los quizzes no están para filtrarte: están para que no sigas avanzando con un hueco detrás. Si fallas, ves qué parte no te quedó fija, vuelves a ese video y lo intentas otra vez. Puedes repetir cada quiz las veces que necesites, sin esperas entre intentos y sin coste. Para darlo por superado hace falta acertar el 80 % de las preguntas, y hay que superar el de un video para pasar al siguiente. Por eso el orden importa, y por eso la certificación significa algo cuando la tienes.",
      en: "You retake it, that's all. The quizzes aren't there to screen you out: they're there so you don't move on with a gap behind you. If you get one wrong, you see which part didn't stick, go back to that video and try again. You can retake each quiz as many times as you need, with no waiting between attempts and no cost. Passing takes 80% of the questions right, and you have to pass one video's quiz to move to the next. That's why the order matters, and why the certification means something once you have it.",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo tengo acceso?",
      en: "How long do I have access?",
    },
    respuesta: {
      es: "Acceso de por vida, incluidas las actualizaciones que hagamos más adelante. Pagas una vez y el material es tuyo: puedes volver al video del CRM dentro de un año, cuando te haga falta. No hay suscripción ni cargos recurrentes.",
      en: "Lifetime access, including any updates we make later. You pay once and the material is yours: you can come back to the CRM video a year from now, when you need it. No subscription, no recurring charges.",
    },
  },
  {
    pregunta: {
      es: "¿Tengo que perseguir a mis amigos y familiares?",
      en: "Do I have to chase my friends and family?",
    },
    respuesta: {
      es: "No, y el video 6 va precisamente de lo contrario. La diferencia entre incomodar a alguien y ayudarle está en cuándo hablas y qué dices, y eso se entrena. El video 8 además trabaja el otro lado: publicar de forma que te escriban a ti, en vez de tener que escribir tú a todo el mundo.",
      en: "No, and video 6 is about the opposite. The difference between bothering someone and helping them is when you speak and what you say, and that's trainable. Video 8 works the other side too: posting in a way that gets people to message you, instead of you messaging everyone.",
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
      es: "Tienes 30 días desde la compra. Si en ese plazo decides que no es para ti, escribes a nuestro correo de soporte y te devolvemos el 100 %. No hay formulario que rellenar, ni llamada para convencerte de que te quedes, ni preguntas incómodas. Lo único que pedimos es que lo hayas intentado: que hayas visto los primeros videos.",
      en: "You have 30 days from purchase. If within that window you decide it isn't for you, email our support address and we refund 100%. No form to fill in, no retention call, no awkward questions. The only thing we ask is that you actually tried it: that you watched the first few videos.",
    },
  },
];

// ─── Contacto ────────────────────────────────────────────────────────────────

export const contacto = {
  email: "hola@emprende180.com", // SWAP (HECHO): confirmar
  /**
   * Teléfono para el botón de "Llámame ahora". Formato internacional.
   *
   * ⚠️ SWAP (HECHO) — CONFÍRMALO. Este número NO lo inventé: está publicado en
   * senordelascasas.com, la otra web de Pedro, y es el mismo que usa allí para
   * WhatsApp. Pero en esa web hay VARIOS números (801 838 9808, 801 308 0273),
   * así que este es el más probable, no el confirmado. Un botón de llamar que
   * suena en el teléfono equivocado es peor que no tener botón.
   *
   * Vacío (`""`) esconde el botón en todas partes.
   */
  telefono: "+18017557181",
  /** Cómo se enseña escrito. Se separa del `tel:` porque el enlace no lleva
   *  espacios y el texto sí. */
  telefonoVisible: "(801) 755-7181",
  /** Formato internacional, solo dígitos. Vacío para ocultar el botón. */
  whatsapp: "", // SWAP (HECHO)
  whatsappMensaje: {
    es: "Hola, tengo una duda sobre el curso Emprende180",
    en: "Hi, I have a question about the Emprende180 course",
  },
  /**
   * Quién firma el copyright del pie.
   *
   * Se rellena con la MARCA, no con una sociedad. "Emprende180" es cierto y es
   * lo que el visitante reconoce. Poner aquí "Emprende180 LLC" o "S. de R.L."
   * sin que exista esa sociedad sería inventarse una figura mercantil en el
   * único sitio de la página donde se hace una afirmación legal.
   *
   * ⚠️ SWAP si hay entidad registrada: cámbialo por la razón social exacta tal
   * como aparece en el registro. Es también la que debería figurar en el aviso
   * de privacidad y en los términos.
   */
  razonSocial: "Emprende180",
} as const;

/**
 * Las CINCO redes de la marca, siempre en este orden y siempre visibles en el
 * pie. Sin url se muestran pero no enlazan: nunca publicamos un perfil que no
 * existe ni apuntamos a la portada de la red.
 */
export const redesMarca = [
  { key: "facebook", label: "Facebook", url: "" }, // SWAP
  { key: "instagram", label: "Instagram", url: "" }, // SWAP
  { key: "tiktok", label: "TikTok", url: "" }, // SWAP
  { key: "youtube", label: "YouTube", url: "" }, // SWAP
  { key: "linkedin", label: "LinkedIn", url: "" }, // SWAP
] as const;

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
  /**
   * ⚠️ DECÍA "INSCRIBIRME AL CURSO" Y AHORA DICE "PEDIR EL PRECIO".
   *
   * No es un cambio de tono, es que el botón tiene que prometer lo que de
   * verdad pasa al pulsarlo. Sin precio publicado y sin pasarela, "inscribirme"
   * llevaba a una sección que no dejaba inscribirse: eso se lee como un fallo
   * de la página, no como un proceso.
   *
   * Y funciona a favor: el precio que falta deja de ser un hueco y pasa a ser
   * el motivo de pulsar. Ver `copy.informes`.
   */
  primario: {
    texto: { es: "Quiero empezar", en: "I want to start" },
    /* Al cierre, que es donde vive el formulario desde que la sección de
       precio se quitó de la página. Ver 09-Cierre. */
    href: "#empezar",
  },
  secundario: {
    texto: leadMagnet.cta,
    /* Iba a "#gratis", el bloque del mini-curso dentro del plan de 90 días.
       Esa sección ya no está: el correo se pide ahora en las guías. */
    href: "#guias",
  },
  /**
   * ─── ACCESO DE ALUMNOS ────────────────────────────────────────────────────
   *
   * El punto de entrada de quien YA compró. Va en el header, separado del CTA
   * de compra, porque son dos personas distintas: una viene a decidir y la otra
   * viene a entrar. Mezclarlos obliga a la segunda a buscar.
   *
   * Lleva a `/login`, que es el login de verdad: correo y contraseña, con
   * "es mi primera vez o la he olvidado" en el mismo formulario. Los textos de
   * esa zona no viven aquí sino en `src/config/studentArea.ts`, porque la
   * plataforma y la página de venta cambian por motivos distintos.
   */
  acceso: {
    texto: { es: "Acceso", en: "Log in" },
    /** Rótulo largo, para el aria-label y la página. */
    textoLargo: { es: "Acceso de alumnos", en: "Student log in" },
    href: "/login",
  },

  /** Cierre de la página. Más directo que los anteriores: ya ha leído todo. */
  final: {
    texto: { es: "Quiero empezar ahora", en: "I want to start now" },
    href: "#empezar",
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
  /**
   * ⚠️ LA NAVEGACIÓN CAMBIÓ DE CRITERIO CON EL REDISEÑO.
   *
   * Antes eran atajos a las secciones que más se preguntan (temario, precio,
   * preguntas). Ahora es la estructura de un SITIO —quiénes somos, qué
   * ofrecemos, recursos— porque la página dejó de ser solo una landing.
   *
   * Los destinos son reales, y eso no es negociable: cada uno apunta a una
   * sección que existe o a una página que existe. La entrega del rediseño
   * traía Home / About / Programs / Resources, de los que tres no existían:
   * cuatro enlaces muertos en la barra que se ve en todas las pantallas.
   */
  navegacion: [
    { texto: { es: "Inicio", en: "Home" }, href: "#inicio" },
    { texto: { es: "Quiénes somos", en: "About" }, href: "/about" },
    { texto: { es: "Programas", en: "Programs" }, href: "#como-trabajar" },
    { texto: { es: "Recursos", en: "Resources" }, href: "/recursos" },
    /* El plan entra en el menú y no se queda solo en el scroll: es la
       respuesta a "¿qué hago yo exactamente?", que es la pregunta que trae
       aquí a la mitad de la gente. Son cuatro enlaces y siguen cabiendo: el
       menú solo existe de `md` para arriba. */
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
    /**
     * Segundo botón del hero. Es NAVEGACIÓN, no conversión: baja al temario
     * dentro de la misma página. Existe para el visitante que no da su email
     * sin ver antes qué hay dentro, que si no tiene dónde pulsar se va.
     */
    verTemario: { es: "Ver el temario", en: "See the curriculum" },
    /** La línea de datos del hero. La usa `copy.hero`, no la sección. */
    pruebaSocial: {
      es: "{alumnos} alumnos · {nota}/5 en {n} valoraciones",
      en: "{alumnos} students · {nota}/5 from {n} reviews",
    },
  },

  problema: {
    aria: { es: "El problema y para quién es", en: "The problem, and who it's for" },
    /** Encabeza la rejilla de dolores. Corto: el trabajo lo hacen los títulos. */
    doloresTitulo: {
      es: "Dónde se te escapa, en concreto",
      en: "Where it slips away, specifically",
    },
    costeTitulo: {
      es: "Y dentro de un año",
      en: "And a year from now",
    },
    /**
     * Etiquetas de los dos gráficos de la sección.
     *
     * Los gráficos son ILUSTRACIONES, no datos: no hay ninguna cifra dentro y
     * no representan ninguna medición. Dibujan lo que dice el texto de al lado
     * y nada más. `alt` es lo que se lee en voz alta en su lugar, así que tiene
     * que decir la IDEA, no describir formas ("doce puntos y unas líneas" no le
     * sirve a nadie).
     */
    /**
     * ─── LOS DOS MOCKUPS DE CONVERSACIÓN ─────────────────────────────────
     *
     * AQUÍ HUBO DOS DIAGRAMAS Y NO FUNCIONARON. Eran una red de nodos ("tu red,
     * hoy") y una línea de tiempo de un año. El cliente los vio dos veces: la
     * primera preguntó qué eran, se les añadieron títulos y leyenda, y la
     * segunda dijo que seguían sin entenderse. Ese es el veredicto y no hay que
     * discutirlo: un gráfico conceptual le pide al visitante que descifre una
     * metáfora, y en una página de venta nadie hace ese trabajo.
     *
     * Lo que los sustituye no es otro diagrama: es la ESCENA, literal. Dos
     * mensajes en el celular, que es exactamente donde ocurre lo que cuenta el
     * texto. No hay nada que interpretar.
     *
     * ⚠️ SON ILUSTRACIONES, NO CAPTURAS. Y la diferencia importa, porque
     * PRODUCT.md prohíbe las capturas falsas por nombre. Estas no imitan a
     * WhatsApp ni a iOS: van en los colores de la marca, el remitente es
     * genérico ("un contacto tuyo") y no hay foto de perfil, ni hora, ni
     * nombre de persona. Dramatizan una situación que el texto de al lado ya
     * describe; no presentan una prueba de nada. Si alguien las rediseña para
     * que parezcan una captura de verdad, cruzan la línea.
     */
    escena: {
      remitente: { es: "Un contacto tuyo", en: "Someone you know" },
      /* El mensaje que llega y se queda sin respuesta. */
      /* "Un desmadre" se fue: en México es coloquial, pero en buena parte del
         español es vulgar, y esto lo lee gente de varios países en la primera
         pantalla que les habla de su propia vida. "Un lío" dice exactamente lo
         mismo y no chirría en ningún sitio. */
      mensaje1: {
        es: "Oye, ayer choqué el carro. Un lío tremendo, no sé ni por dónde empezar.",
        en: "Hey, I crashed my car yesterday. Total mess, I don't even know where to start.",
      },
      sinResponder: { es: "Visto. Sin responder.", en: "Seen. No reply." },
      escena1Alt: {
        es: "Un mensaje de un contacto contando que chocó el carro, visto y sin responder.",
        en: "A message from a contact saying they crashed their car, seen and left unanswered.",
      },
      /* Semanas después: se resolvió, y sin ti. */
      despues: { es: "Tres semanas después", en: "Three weeks later" },
      sinTi: { es: "Se resolvió sin ti.", en: "It got handled without you." },
      mensaje2: {
        es: "Ya se resolvió. Al final me ayudó un conocido de mi primo.",
        en: "It's sorted now. A friend of my cousin ended up helping me.",
      },
      escena2Alt: {
        es: "Tres semanas después, el mismo contacto avisa de que su problema ya se resolvió: lo ayudó otra persona.",
        en: "Three weeks later the same contact says their problem is already sorted: someone else helped them.",
      },
    },
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
    /* El alt describe la ESCENA: quien no ve la foto recibe lo mismo que
       quien la ve, que aquí es la actitud, no el decorado. */
    fotoAlt: {
      es: "Una persona sonriendo mientras habla por teléfono en la calle, tranquila, en mitad de la conversación.",
      en: "Someone smiling mid-conversation on the phone out in the street, completely at ease.",
    },
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
    /**
     * ─── LA MUESTRA DEL DÍA 1 ────────────────────────────────────────────
     *
     * La sección enseñaba los siete `entrega` completos: siete párrafos, unas
     * 210 palabras, para pedir un email. Nadie los lee.
     *
     * Ahora el raíl enseña los siete TÍTULOS y solo se despliega el contenido
     * de UNO, el primero. Es el mismo argumento con la novena parte del texto:
     * lo que convence no es leer los siete, es comprobar que el primero es
     * concreto de verdad. Si el día 1 entrega algo real, los otros seis se dan
     * por buenos.
     *
     * Va el día 1 y no otro a propósito: es el único que el visitante puede
     * verificar mañana.
     */
    muestraTitulo: {
      es: "Esto es lo que te llega el día 1",
      en: "This is what lands on day 1",
    },
    railTitulo: { es: "Los siete días", en: "The seven days" },
  },

  temario: {
    aria: { es: "Temario del curso", en: "Course curriculum" },
    titulo: {
      es: "Un curso, {n} videos, en el orden en que hay que hacerlos",
      en: "One course, {n} videos, in the order you actually need them",
    },
    entradilla: {
      es: "Cada video cierra con su quiz de validación. Supera los {n} y te emitimos tu Certificación de Embajador Emprende180.",
      en: "Every video closes with its validation quiz. Pass all {n} and we issue your Emprende180 Ambassador Certification.",
    },
    /* El alt describe la ESCENA, no el archivo: quien no ve la foto tiene
       que recibir lo mismo que recibe quien la ve, y lo que esta transmite es
       en qué condiciones se hace el curso. */
    fotoAlt: {
      es: "Una persona sola frente a su portátil en la mesa de la cocina, de noche, con un café al lado.",
      en: "Someone alone with their laptop at the kitchen table at night, a coffee beside them.",
    },
    extrasTitulo: { es: "Y además", en: "And on top of that" },
    /**
     * ─── LO QUE ENTRA ADEMÁS DEL TEMARIO ────────────────────────────────
     *
     * Aquí había una lista de las seis frases de `curso.formato.incluye`, a
     * cuerpo pequeño y a dos columnas: unas 90 palabras que casi nadie leía.
     * Y cuatro de las seis ya estaban dichas dos veces más arriba — la franja
     * del hero y la rejilla de diez videos ya dicen "10 videos", "un quiz en
     * cada uno" y "acceso de por vida".
     *
     * Lo que de verdad quedaba por decir después de ver los diez videos son
     * TRES cosas, y ahora se dicen con un icono grande y cuatro palabras.
     *
     * Las frases largas siguen en `curso.formato.incluye`, que es donde vive
     * el detalle y de donde salen los dos `[COMPLETAR:]` que la sección sigue
     * enseñando aparte para que no se olviden.
     */
    extras: [
      {
        titulo: { es: "Certificación de Embajador", en: "Ambassador Certification" },
        nota: {
          es: "Al superar los diez quizzes",
          en: "Once you pass all ten quizzes",
        },
      },
      {
        titulo: { es: "Acceso de por vida", en: "Lifetime access" },
        nota: {
          es: "Sin suscripción ni cargos recurrentes",
          en: "No subscription, no recurring charges",
        },
      },
      {
        titulo: { es: "Actualizaciones incluidas", en: "Updates included" },
        nota: { es: "Sin pagar de nuevo", en: "Without paying again" },
      },
    ],
    /** Encabeza los `[COMPLETAR:]` que quedan por decidir. */
    pendientesTitulo: {
      es: "Falta confirmar",
      en: "Still to confirm",
    },
    /** Cierre de la sección: invitación + las dos salidas. */
    cierre: {
      es: "Eso es todo lo que incluye Fundamentos. Ni más ni menos.",
      en: "That's everything Fundamentos includes. No more, no less.",
    },

    /**
     * Distintivo de la columna del título. `{n}` = número de videos, que van
     * con su quiz cada uno, así que la misma cifra sirve para los dos.
     */
    cuantos: {
      es: "{n} videos · {n} quizzes",
      en: "{n} videos · {n} quizzes",
    },

    /**
     * Sustituye a los veinte distintivos "Video/Quiz" que llevaban las diez
     * tarjetas: repetir diez veces lo mismo no lo refuerza, lo convierte en
     * ruido. Se dice una vez, al lado del título.
     */
    todosConQuiz: {
      es: "Los {n} llevan quiz al final. Se hacen en orden.",
      en: "All {n} end with a quiz. You take them in order.",
    },
  },

  /** Bloque de cursos futuros, al final del temario. Ver `proximosCursos`. */
  proximos: {
    badge: { es: "Próximamente", en: "Coming soon" },
    titulo: { es: "Y después de Fundamentos", en: "And after Fundamentos" },
    /** Dice explícitamente que NO van incluidos. No se suaviza: ver el comentario
     *  de `proximosCursos`, punto 2. */
    entradilla: {
      es: "Fundamentos es el primer curso de la ruta y el que compras hoy. Estos dos ya están en producción y se venden aparte cuando salgan. Si estás dentro, te enteras antes que nadie.",
      en: "Fundamentos is the first course in the track, and the one you're buying today. These two are already in production and will be sold separately when they're ready. If you're already in, you'll hear about them first.",
    },
  },

  instructor: {
    aria: { es: "Quién imparte el curso", en: "Who teaches the course" },
    kicker: { es: "Quién te enseña", en: "Who's teaching" },
    credencialesTitulo: { es: "Los datos", en: "The receipts" },

    ensenaTitulo: { es: "Lo que enseño bien", en: "What I'm good at teaching" },
    /**
     * ⚠️ ESTE BLOQUE NO SE BORRA. Se rediseñó porque no gustaba cómo se veía
     * —cuatro aspas rojas seguidas parecen una lista de errores— pero el
     * contenido se queda: PRODUCT.md dice que la honestidad se usa como
     * herramienta de venta y que los límites llevan el mismo peso que las
     * promesas. Quien admite lo que no hace resulta creíble en todo lo demás, y
     * de paso no le vende a quien esperaba otra cosa (reembolso y reseña mala).
     *
     * Lo que cambió es el encuadre: de "lo que NO cubre" (negación) a "para que
     * no haya sorpresas" (cuidado). Dice exactamente lo mismo y se lee como una
     * cortesía en vez de como una advertencia.
     */
    noCubreTitulo: {
      es: "Para que no haya sorpresas",
      en: "So there are no surprises",
    },
    noCubreNota: {
      es: "Prefiero que lo sepas ahora y no cuando ya hayas pagado.",
      en: "I'd rather you know now than after you've paid.",
    },
    /** Bajo el logo de su otra empresa. Es una credencial, no un anuncio. */
    tambien: { es: "También al frente de", en: "Also runs" },
    /**
     * El botón de contacto directo.
     *
     * Era "Escríbeme" con un `mailto:`. Se cambió a llamada por petición del
     * cliente, y es mejor decisión de lo que parece: un correo tarda horas y
     * enfría; una llamada se resuelve en el momento, y quien llega hasta aquí
     * con una duda concreta está a un paso de comprar. El número está en
     * `contacto.telefono`; si se vacía, el botón desaparece.
     */
    llamame: { es: "Llámame ahora", en: "Call me now" },
    whatsapp: { es: "WhatsApp", en: "WhatsApp" },
    avisoPlaceholder: {
      es: "Faltan los datos del instructor. Son HECHOS: rellénalos en `instructor` de `src/config/curso.config.ts`. No los inventes.",
      en: "Instructor details are missing. These are FACTS: fill them in under `instructor` in `src/config/curso.config.ts`. Don't invent them.",
    },
  },

  /**
   * ⚠️ EL TITULAR AFIRMA UNA COSA Y LA PRUEBA ESTÁ DEBAJO, EN LA MISMA
   * PANTALLA. "Ya están dentro" se sostiene en los seis testimonios reales que
   * pasan justo debajo, tres de ellos de mujeres, con nombre y contexto. No es
   * una frase de relleno: es la conclusión de lo que se ve sin bajar más.
   *
   * ⚠️ Y POR ESO NO LLEVA NÚMERO. La referencia que pasó el cliente (bossbabe)
   * encabeza su prueba social con "trusted by 4m women entrepreneurs like you";
   * nosotros no tenemos esa cifra y `cifras.sonReales` sigue en `false`. Lo que
   * sí se puede tomar es el mecanismo: nombrar al público y rematar con "como
   * tú". Un "cientos de mujeres" inventado hunde la sección entera, porque es
   * justo la que existe para que te fíes.
   */
  pruebaSocial: {
    aria: { es: "Resultados de los alumnos", en: "Student results" },
    kicker: { es: "No serías la primera", en: "You wouldn't be the first" },
    titulo: [
      { es: "Mujeres como tú,", en: "Women like you," },
      { es: "ya dentro.", en: "already inside.", enfasis: true },
    ],
    etiquetaAlumnos: { es: "Alumnos", en: "Students" },
    etiquetaValoracion: { es: "Valoración", en: "Rating" },
    etiquetaNumValoraciones: { es: "Valoraciones", en: "Reviews" },

    /* ─── Reseñas ────────────────────────────────────────────────────────────
       `notaDeCinco` lo usa `Estrellas.astro` y es lo que hace que la fila de
       estrellas no sea la única forma de saber la puntuación: quien la escucha
       con un lector de pantalla, o quien no distingue el ámbar del gris, lee la
       cifra. Por eso va SIEMPRE, no solo cuando cabe. */
    notaDeCinco: { es: "{nota} de 5", en: "{nota} out of 5" },
    /* La insignia solo se pinta sobre reseñas realmente publicadas en Google y
       con enlace. Ver `MarcaGoogle.astro`. */
    enGoogle: { es: "Reseña en Google", en: "Review on Google" },
    verEnGoogle: { es: "Ver en Google", en: "See on Google" },
    resumenGoogle: {
      es: "{nota} de 5 en {n} reseñas de Google",
      en: "{nota} out of 5 from {n} Google reviews",
    },
    /* La misma frase sin nombrar la plataforma. La usa el resumen cuando las
       reseñas se recogieron en directo: decir "de Google" sobre citas que
       llegaron por WhatsApp es la parte que convierte un testimonio en un
       problema, aunque la cita sea verdad. */
    resumenDirecto: {
      es: "{nota} de 5 en {n} valoraciones",
      en: "{nota} out of 5 from {n} reviews",
    },
    avisoPlaceholder: {
      es: "Testimonios pendientes. No se ha inventado ninguno a propósito: pídeselos a alumnos reales, con permiso por escrito. En el comentario de `testimonios` tienes qué preguntar y qué recolectar.",
      en: "Testimonials pending. None were invented, deliberately: ask real students, with written permission. The comment on `testimonios` tells you what to ask for.",
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
            es: "Un curso de {videos} videos, un quiz de validación en cada uno y la Certificación de Embajador al superar los diez. El temario está entero unas líneas más arriba, video por video. Sin letra chica y sin “y mucho más”.",
            en: "One course of {videos} videos, a validation quiz in each one and the Ambassador Certification once you pass all ten. The full curriculum is a few lines up, video by video. No fine print, no “and much more”.",
          },
        },
      ],

      /**
       * El primer punto, cuando el precio no se publica.
       *
       * El original dice "{actual} en lugar de {referencia}", o sea las dos
       * cifras juntas: es EL sitio donde el ancla se cuela en una sección que
       * no es la de precio. Con `precio.publico` en false hay que sustituirlo,
       * no esconderlo: el argumento —entras antes que la fila de casos de
       * éxito, y eso se nota en lo que pagas— sigue siendo verdad y sigue
       * siendo el bueno.
       *
       * Lo que NO dice es que el precio vaya a subir. Es lo que el config da
       * por hecho (`framing: 'lanzamiento'`), pero mientras no haya una fecha
       * real detrás, anunciarlo en la página es una promesa que nadie ha
       * firmado.
       */
      puntoPrecioSinCifras: {
        titulo: { es: "Entras antes que la fila", en: "You get in before the queue" },
        texto: {
          es: "Todavía no hay una hilera de casos de éxito detrás de esto, y lo que cuesta hoy lo refleja. Pregunta el precio y te lo decimos: depende de quién te haya recomendado.",
          en: "There is no line of success stories behind this yet, and what it costs today reflects that. Ask for the price and we'll tell you: it depends on who referred you.",
        },
      },

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

  /**
   * ─── EL HERO DE TRES FOTOS ─────────────────────────────────────────────
   *
   * La segunda dirección visual: foto a sangre completa, tres escenas que
   * rotan, y el bloque de texto cargado a la derecha.
   *
   * ─── LOS SALTOS DE LÍNEA SON MANUALES, Y ES LO MÁS IMPORTANTE DE AQUÍ ──
   *
   * Cada titular es un ARRAY DE LÍNEAS, no una frase. El navegador no decide
   * nunca dónde parte: a pantalla completa, dejado a su aire, deja una palabra
   * sola en el último renglón —una "huérfana"— y eso es lo que hace que un
   * titular grande parezca mal hecho.
   *
   * ⚠️ SI SE CAMBIA UN TEXTO, HAY QUE VOLVER A MIRARLO EN PANTALLA. Las líneas
   * están cortadas para ESTAS palabras; una palabra más larga en inglés puede
   * desbordar la línea y partirse igual. La regla, cuando pase: agrandar el
   * contenedor o bajar el cuerpo, nunca acortar la idea.
   *
   * ─── LAS FOTOS SON PROVISIONALES ───────────────────────────────────────
   *
   * Son las que había en el repo: 800×600 y 880×620. A pantalla completa en un
   * monitor grande se van a ver blandas. Para publicar hacen falta tres fotos
   * horizontales de 2400 px de ancho como mínimo.
   *
   * Y están elegidas POR LUMINOSIDAD, no por gusto: el texto va en blanco y sin
   * velo encima —lo pidió el cliente— así que la única defensa del contraste es
   * que la foto sea oscura donde va el texto. Medidas en la mitad derecha: 30,
   * 32 y 49 sobre 100. La tercera es la justa; si se cambia por una más clara,
   * el texto deja de leerse.
   */
  /**
   * ═══════════════════════════════════════════════════════════════════════
   * EL HERO
   * ═══════════════════════════════════════════════════════════════════════
   *
   * ─── A QUIÉN LE HABLA ──────────────────────────────────────────────────
   *
   * A quien tiene el tiempo y no el método: gente en casa, con la agenda
   * llena de gente que le tiene confianza, que quiere montar algo propio sin
   * salir por la puerta. Esa persona no está buscando un curso, está buscando
   * que alguien le diga qué hacer el lunes por la mañana.
   *
   * ⚠️ Y POR ESO NO SE PROMETE DINERO EN NINGUNA LÍNEA. Ni cifras, ni "ingreso
   * extra", ni "gana desde casa". No es prudencia de más: la FTC (16 CFR 465)
   * y la PROFECO tratan eso como publicidad engañosa salvo que esté probado con
   * datos reales, y aquí no los hay. Lo que sí se puede decir, y es lo que
   * engancha de verdad, es CÓMO SE TRABAJA: noventa días, un paso cada día, y
   * no tienes que inventarte ninguno.
   *
   * Si alguien añade "ingresos" o una cifra a estas tres frases, esto deja de
   * ser una promesa de método y pasa a ser una promesa de resultado.
   *
   * ─── DÓNDE CAE EL TEXTO EN CADA FOTO ───────────────────────────────────
   *
   * `posicion` lo decide slide a slide, y ese es el recurso: tres pantallas
   * con el bloque en el mismo sitio se leen como una sola imagen con el texto
   * cambiado. Moviéndolo, la rotación se nota aunque no se esté mirando.
   *
   * Los valores viven en `HeroSlider.astro`, en una tabla cerrada. No se
   * pueden inventar aquí: Tailwind lee las clases como texto literal y una
   * armada al vuelo no genera CSS.
   */
  heroSlider: {
    aria: { es: "Presentación", en: "Introduction" },

    /* ⚠️ EL ORDEN NO ES ESTÉTICO: LA PRIMERA FOTO ES LA QUE DICE PARA QUIÉN ES
       ESTO. La página le habla a mujeres que están en casa y tienen el tiempo,
       así que la que abre es la única de las tres en la que salen mujeres.

       ⚠️ Y LAS TRES SON DE BANCO, con hombres en dos de ellas. Es lo primero
       que hay que cambiar cuando haya sesión de fotos: tres horizontales de
       2400 px de ancho para arriba, con la gente a la que de verdad le hablamos.
       Ver el README de /public/imagenes. */
    /**
     * ⚠️ EL PRIMER RENGLÓN DE CADA FOTO DICE PARA QUIÉN ES ESTO, y esa es la
     * única razón de que exista el `kicker`. Es el recurso que usa bossbabe,
     * que es la referencia que pasó el cliente: una línea pequeña nombra al
     * público ("we help women entrepreneurs") y el titular grande TERMINA esa
     * misma frase. Se lee del tirón y en dos segundos sabes si te habla a ti.
     *
     * De ahí se toma el mecanismo, no las palabras: las suyas son suyas.
     *
     * ⚠️ Y AQUÍ SE SEPARAN LOS CAMINOS EN UNA COSA. Bossbabe escribe "to make
     * more money" en su titular; nosotros no podemos y no es timidez. La FTC
     * (16 CFR 465) y la PROFECO tratan las promesas de ingreso como publicidad
     * engañosa salvo que estén respaldadas con datos reales de alumnos, y esos
     * datos hoy no existen. Se puede nombrar lo que ella QUIERE y lo que
     * nosotros DAMOS; no se puede prometer lo que va a conseguir.
     *
     * Por eso los ganchos no van de dinero sino de las tres cosas que de verdad
     * la frenan: creer que hace falta salir de casa, creer que no tiene tiempo
     * y creer que no conoce a nadie. Las tres son falsas y las tres se
     * responden con un dato: dos horas al día, noventa días, y una agenda que
     * ya tiene.
     *
     * ⚠️ LAS TRES FOTOS SIGUEN SIENDO DE BANCO. Dos ya son de mujeres, pero
     * ninguna es de una alumna de verdad ni está hecha en una casa. Es lo
     * primero de la lista en cuanto haya sesión: horizontales, 2400 px de
     * ancho para arriba.
     */
    slides: [
      /**
       * ─── EL DÍPTICO: DOS PÚBLICOS EN LA MISMA PANTALLA ──────────────────
       *
       * La primera imagen no es UNA foto: son DOS, partidas por la mitad, y
       * cada mitad le habla a una persona distinta. Ella a la izquierda, él a
       * la derecha, el botón en medio y la promesa debajo.
       *
       * POR QUÉ SE RECONOCE EN TRES SEGUNDOS. Un hero normal elige un público
       * y el otro se va. Aquí los dos ganchos se ven a la vez y cada uno
       * encuentra el suyo por el lado en el que está mirando: no hay que leer
       * los dos para saber cuál te toca.
       *
       * ⚠️ LAS DOS FRASES NO SON LA MISMA IDEA EN DOS VOCES. La de ella
       * desmonta "tendría que montar un negocio fuera de casa"; la de él
       * desmonta "hace falta un título o experiencia en ventas". Si algún día
       * se reescriben, esa es la pareja de objeciones que tienen que seguir
       * tumbando, no el género de la foto.
       *
       * ⚠️ LA TIPOGRAFÍA CAMBIA DE UN LADO A OTRO, Y ES DELIBERADO. `voz`
       * decide cómo se pinta cada mitad: `editorial` va en caja baja, peso
       * medio y remata en Fraunces itálica; `directa` va apretada, en
       * extrabold y sin cursiva. Dos sistemas tipográficos, no dos tamaños.
       * Ver `HeroDiptico.astro`.
       *
       * ⚠️ Y LAS DOS FOTOS SIGUEN SIENDO DE BANCO. Ninguna está hecha en una
       * casa y ninguna es de un Embajador de verdad. En cuanto haya sesión,
       * las dos que hacen falta son VERTICALES (cada una ocupa media
       * pantalla, no una horizontal recortada): 1400×1800 px para arriba, la
       * persona mirando HACIA EL CENTRO y con aire en el lado de fuera, que
       * es donde cae el texto. Se dejan en /public/imagenes/hero/ como
       * `ella.webp` y `el.webp` y entran solas, sin tocar código.
       */
      {
        tipo: "diptico",
        paneles: [
          {
            lado: "ella",
            foto: "/imagenes/resultados/03.webp",
            /* El recorte deja a la mujer de la izquierda, que mira hacia el
               centro del díptico. Si se cambia la foto, hay que volver a
               mirar este número: es lo único que decide a quién se ve. */
            encuadre: "30% center",
            alt: {
              es: "Una mujer conversando en la calle con un café en la mano",
              en: "A woman talking on the street holding a coffee",
            },
            voz: "editorial",
            titulo: [
              {
                es: "Tu casa ya es tu oficina.",
                en: "Your home is already your office.",
                estilo: "lead",
              },
              { es: "Que también sea", en: "Make it your" },
              {
                es: "tu punto de partida.",
                en: "starting line too.",
                estilo: "acento",
              },
            ],
          },
          {
            lado: "el",
            foto: "/imagenes/secciones/resultados.webp",
            /* Él está en la mitad derecha del original y mira hacia la
               izquierda, o sea hacia ella. */
            encuadre: "58% center",
            alt: {
              es: "Un hombre riéndose mientras habla por teléfono en la calle",
              en: "A man laughing on a phone call out in the street",
            },
            voz: "directa",
            titulo: [
              {
                es: "Si sabes hablar con la gente,",
                en: "If you know how to talk to people,",
                estilo: "lead",
              },
              { es: "ya tienes lo que", en: "you already have" },
              { es: "se necesita.", en: "what it takes.", estilo: "acento" },
            ],
          },
        ],

        /**
         * ⚠️ ESTA FRASE DICE "GENERA INGRESOS EXTRA" Y ESO ES UNA PROMESA DE
         * INGRESO. Va tal cual la pidió el cliente y se queda, pero conviene
         * saber dónde está el límite: la FTC (16 CFR 465) y la PROFECO
         * permiten describir la OPORTUNIDAD y prohíben afirmar un RESULTADO
         * que no se pueda documentar con datos de Embajadores normales.
         *
         * "Genera ingresos extra" está del lado seguro mientras NO se le
         * ponga cifra, plazo ni frecuencia. En cuanto alguien escriba "hasta
         * 2.000 al mes" o "desde la primera semana", hace falta el respaldo
         * documental. Ver la regla 3 de la cabecera del archivo.
         */
        subtitulo: {
          es: "Únete a la comunidad de Embajadores Emprende180 y genera ingresos extra ayudando a tu gente a conseguir su casa o recuperarse de un accidente.",
          en: "Join the Emprende180 Ambassador community and earn extra income helping your people get their home or recover from an accident.",
        },

        /* ⚠️ "QUIERO SER EMBAJADOR" Y NO "REGÍSTRATE", y no es cuestión de
           gusto: uno nombra a quién te conviertes y el otro nombra el
           trámite. Lleva al cierre, que es el único sitio de la página donde
           se puede pedir información. Sustituye al CTA común de las otras dos
           imágenes, que va a ver cómo funciona. */
        cta: {
          texto: { es: "Quiero ser Embajador", en: "I want to be an Ambassador" },
          href: "#empezar",
        },
      },
      {
        foto: "/imagenes/secciones/temario.webp",
        alt: {
          es: "Una persona sentada a la mesa de su cocina, de noche, trabajando con su portátil",
          en: "Somebody at their kitchen table at night, working on their laptop",
        },
        posicion: "derecha-arriba",
        kicker: { es: "Y no, no hace falta el día entero", en: "And no, it doesn't take all day" },
        titulo: [
          { es: "Dos horas al día.", en: "Two hours a day." },
          { es: "Noventa días.", en: "Ninety days.", enfasis: true },
          { es: "Ninguno lo pones tú.", en: "You invent none of them." },
        ],
        subtitulo: {
          es: "Cada mañana sabes exactamente qué te toca hacer.",
          en: "Every morning you know exactly what you have to do.",
        },
      },
      {
        foto: "/imagenes/resultados/06.webp",
        alt: {
          es: "Una mujer hablando por teléfono en la calle",
          en: "A woman on a phone call out in the street",
        },
        posicion: "derecha-abajo",
        kicker: { es: "Empiezas con lo que ya tienes", en: "You start with what you already have" },
        titulo: [
          { es: "Tu agenda vale", en: "Your contacts are worth" },
          { es: "más de lo que crees.", en: "more than you think.", enfasis: true },
        ],
        subtitulo: {
          es: "La Academia te enseña a moverla. El CRM se acuerda por ti.",
          en: "The Academy teaches you how to work it. The CRM remembers for you.",
        },
      },
    ],

    /* Un solo botón, y el mismo en las tres. Dos botones en un hero que cambia
       cada seis segundos son dos decisiones que tomar mientras la pantalla se
       mueve.

       ⚠️ YA NO LLEVA A PEDIR NADA. Llevaba al formulario del precio; ahora
       lleva a la sección donde se explica cómo funciona el método, que es lo
       que esta página vende. */
    cta: {
      texto: { es: "Ver cómo funciona", en: "See how it works" },
      href: "#como-trabajar",
    },

    /* Los mandos. La rotación es contenido en movimiento de más de cinco
       segundos, así que la WCAG 2.2.2 exige poder pararla: no es un extra. */
    pausar: { es: "Pausar la presentación", en: "Pause the slideshow" },
    reanudar: { es: "Reanudar la presentación", en: "Resume the slideshow" },
    irASlide: { es: "Ver la imagen {n}", en: "Show image {n}" },
  },

  /**
   * ─── LAS GUÍAS (formulario simple) Y LA LISTA (el del teléfono) ─────────
   *
   * Son las dos secciones nuevas del rediseño que capturan correo, y las dos
   * piden lo mismo. No es un descuido del brief: una PIDE y la otra ENSEÑA lo
   * que llega. Aun así conviene decidir si las dos se quedan, porque dos
   * formularios idénticos separados por una pantalla se leen como un fallo.
   *
   * ⚠️ NINGUNA PROMETE NADA QUE NO EXISTA. El reto de 7 correos se retiró como
   * imán, así que lo que se ofrece es lo único que hay de verdad: los artículos
   * del blog, que son guías cortas, y el aviso cuando sale uno nuevo. Ni
   * "contenido exclusivo", ni "descargables", ni una frecuencia que no se pueda
   * cumplir.
   */
  guias: {
    aria: { es: "Recibe las guías", en: "Get the guides" },
    titulo: [
      { es: "Guías cortas para", en: "Short guides on" },
      { es: "mover tu red", en: "working your network", enfasis: true },
      { es: "sin incomodar a nadie.", en: "without making it weird." },
    ],
    texto: {
      es: "Cada vez que publico una, te llega. Nada más: ni ofertas, ni tres correos a la semana.",
      en: "Every time I publish one, it lands in your inbox. That's it: no offers, no three emails a week.",
    },
    cta: { es: "Quiero recibirlas", en: "Send them to me" },
    /* El aviso de debajo del botón NO puede ser el del mini-curso, que dice
       "un email al día durante 7 días": aquí no hay secuencia de siete, hay
       un aviso cuando se publica. Prometer la cadencia equivocada es la
       forma más rápida de que alguien marque el correo como spam. */
    aviso: {
      es: "Sin spam. Solo cuando hay una nueva, y te das de baja en un clic.",
      en: "No spam. Only when there's a new one, and you can unsubscribe in one click.",
    },
    exitoTitulo: { es: "Hecho.", en: "Done." },
    exitoTexto: {
      es: "La próxima que escriba te llega a ti.",
      en: "The next one I write goes to you.",
    },
  },

  /**
   * ─── LA LISTA ──────────────────────────────────────────────────────────
   *
   * ⚠️ SE FUE "LO ESCRIBE PEDRO, NO UNA AGENCIA". Era una frase buena y estaba
   * en el sitio equivocado: en una sección que le habla a alguien que todavía
   * no sabe quién es Pedro, presumir de quién escribe no dice nada. Quien quiera
   * saber quién está detrás tiene el botón de la sección anterior y la página
   * /about entera. Aquí lo único que importa es QUÉ LLEGA.
   *
   * ⚠️ Y LO QUE LLEGA NO TIENE FRECUENCIA. "Cuando hay algo, no cuando toca" es
   * literal: no hay boletín semanal ni nadie que lo escriba los martes.
   * Prometer una cadencia que no se cumple es la forma más rápida de que un
   * correo acabe marcado como spam, y de las tres cosas que se anuncian
   * —recursos, programas y artículos— solo la tercera tiene hoy un ritmo real.
   */
  lista: {
    aria: { es: "Únete a la lista", en: "Join the list" },
    kicker: { es: "La lista de Emprende180", en: "The Emprende180 list" },
    titulo: [
      { es: "Entérate", en: "Find out" },
      { es: "antes que nadie.", en: "before anyone else.", enfasis: true },
    ],
    texto: {
      es: "Los recursos nuevos, los programas que vamos abriendo y cada artículo que se publica.",
      en: "New resources, the programs we open up, and every article as it goes out.",
    },
    /* La línea en negrita. Dice lo único que hay que saber antes de dejar un
       correo, y es verdad: no hay serie de ventas detrás. */
    remate: {
      es: "Cuando hay algo, no cuando toca. Y te das de baja en un clic.",
      en: "When there's something, not when it's due. And you can leave in one click.",
    },
    cta: { es: "Quiero enterarme", en: "Keep me posted" },
    aviso: {
      es: "Sin spam. Te das de baja en un clic.",
      en: "No spam. Unsubscribe in one click.",
    },
    exitoTitulo: { es: "Ya estás dentro.", en: "You're in." },
    exitoTexto: {
      es: "Te escribo cuando haya algo que valga la pena.",
      en: "I'll write when there's something worth your time.",
    },
    /* El remitente que se ve en el teléfono. */
    remitente: { es: "EMPRENDE180", en: "EMPRENDE180" },
    telefonoAlt: {
      es: "Un teléfono con la bandeja de entrada y los últimos artículos",
      en: "A phone showing the inbox with the latest articles",
    },
  },

  /**
   * ─── QUÉ ES UNA EMBAJADORA ─────────────────────────────────────────────
   *
   * Mismo mecanismo que el hero: el renglón pequeño nombra y el titular
   * termina la frase.
   *
   * ⚠️ EL GANCHO ES QUE YA LO ESTÁ HACIENDO. A una mujer que lleva la casa ya
   * le preguntan por un plomero, por un abogado, por quién arregla el techo.
   * Contesta por WhatsApp y ahí acaba. Decirle "conviértete en Embajadora"
   * suena a empezar de cero; decirle "eso que ya haces tiene nombre" no le pide
   * que cambie, le pide que lo aproveche. Es la misma sección y es otra puerta.
   *
   * ⚠️ "EMBAJADORA" EN FEMENINO, y no es un descuido con el nombre del
   * producto. La certificación se sigue llamando "Certificación de Embajador
   * Emprende180" porque ese es su nombre oficial; el texto que le habla a ella
   * la trata como lo que es. Mezclar las dos formas en español es normal y lo
   * raro sería lo contrario.
   *
   * ⚠️ Y NO SE PROMETE NADA A CAMBIO. "Ahí acaba todo" describe lo que pasa
   * hoy, no insinúa cuánto se cobra mañana. En cuanto una de estas líneas
   * sugiera dinero, deja de ser una descripción y pasa a ser una promesa de
   * ingresos. Ver la nota del hero.
   */
  embajador: {
    aria: { es: "Qué es una Embajadora", en: "What an Ambassador is" },
    kicker: { es: "Ser Embajadora Emprende180 es esto", en: "Being an Emprende180 Ambassador is this" },
    titulo: [
      { es: "La que siempre", en: "The one who always" },
      { es: "conoce a alguien.", en: "knows someone.", enfasis: true },
    ],
    texto: [
      {
        es: "Ya te preguntan por un plomero, por un abogado, por quién arregla el techo. Contestas por WhatsApp y ahí acaba todo.",
        en: "People already ask you for a plumber, a lawyer, someone to fix the roof. You answer on WhatsApp and that's where it ends.",
      },
      {
        es: "Una Embajadora contesta igual, con un Ecosistema detrás que se encarga del resto. Ese es todo el cambio.",
        en: "An Ambassador answers the same way, with an ecosystem behind her that handles the rest. That's the whole change.",
      },
    ],
    cta: { es: "Conócenos", en: "Get to know us" },
    fotoGrande: {
      es: "Dos mujeres conversando en la calle con un café en la mano",
      en: "Two women talking on the street holding coffee",
    },
    fotoChica: {
      es: "Una mujer hablando por teléfono en la calle",
      en: "A woman on a phone call out in the street",
    },
  },

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * LA PÁGINA DE QUIÉNES SOMOS
   * ═══════════════════════════════════════════════════════════════════════
   *
   * ─── DE DÓNDE SALE LA ESTRUCTURA ───────────────────────────────────────
   *
   * Del "about" de bossbabe, que es la referencia que pasó el cliente. Su orden
   * es: repetir la promesa arriba del todo, presentarse ("in case you're new
   * here, allow us to introduce ourselves"), enseñar en qué creen, presentar a
   * la fundadora con su foto y su historia, y rematar con una llamada.
   *
   * Se toma ese orden. No se toma nada más, y hay un motivo por cada cosa que
   * se queda fuera:
   *
   *   · "SINCE 2018, WE'VE GROWN: 146K students, 96M video views" — son cifras
   *     suyas. Las nuestras no existen: `cifras.sonReales` sigue en `false`.
   *   · "Only 18% of women business owners make 6 figures" — un dato de
   *     mercado con fuente. Si el cliente tiene uno equivalente y comprobable,
   *     este es el sitio; inventarlo sería peor que no tenerlo.
   *
   * ─── LOS AÑOS DE EXPERIENCIA ───────────────────────────────────────────
   *
   * ⚠️ ES UN HECHO Y NO SE INVENTA. El cliente pidió que la página presente sus
   * años en el sector, y ese número no está en ninguna parte del proyecto: ni
   * en su web, ni en el brief, ni en los documentos que pasó. Así que el bloque
   * está montado y esperando, marcado con `[COMPLETAR`, y NO SE PUBLICA hasta
   * que lo rellene: en producción no se pinta (ver `09-About`), en local sale
   * resaltado en ámbar para que se vea que falta.
   *
   * Un número inventado aquí no es un titular flojo, es publicidad engañosa, y
   * encima en la página cuyo único trabajo es que alguien se fíe.
   */
  about: {
    aria: { es: "Quiénes somos", en: "About us" },
    kicker: { es: "Quiénes somos", en: "About us" },

    /**
     * ─── EL HERO ES CORTO Y EMPIEZA POR UN NO ──────────────────────────
     *
     * La referencia abre su "about" repitiendo su promesa. Aquí se abre con lo
     * contrario, y es a propósito: quien llega a esta página ya ha leído la
     * promesa en la portada, y a una mujer a la que le han vendido diez veces
     * "gana dinero desde casa" lo que la para en seco no es una promesa más,
     * es alguien que empieza diciendo que no se la va a hacer.
     *
     * ⚠️ Y ES UNA FRASE QUE HAY QUE PODER SOSTENER. Se sostiene: no hay una
     * sola cifra de ingresos en toda la web, y el bloque "en qué creemos" de
     * más abajo la desarrolla. El día que la página ponga un número, esta
     * frase pasa a ser una mentira que el propio sitio desmiente.
     *
     * `conFoto` marca la línea que lleva la foto incrustada dentro del propio
     * titular. Ver `09-About`.
     */
    titulo: [
      { es: "Nadie te va a prometer", en: "Nobody here is going to promise" },
      { es: "una cifra.", en: "you a number.", conFoto: true },
      { es: "Te damos un método.", en: "We give you a method.", enfasis: true },
    ],
    entradilla: {
      es: "Y un Ecosistema detrás. El resto lo decides tú.",
      en: "And an ecosystem behind you. The rest is yours to decide.",
    },
    fotoIncrustada: {
      es: "Dos mujeres conversando en la calle con un café en la mano",
      en: "Two women talking on the street holding coffee",
    },

    /**
     * ─── LA FRANJA CON LAS DOS FOTOS ───────────────────────────────────
     *
     * Es el bloque que en la referencia dice "supporting women around the
     * world in building a life + business they love": una sola línea centrada
     * con una foto a cada lado. Se toma la forma, no la frase.
     *
     * Debajo van los datos, que antes vivían al final de la página, junto a la
     * bio. Aquí trabajan mejor: la línea afirma a quién acompañamos y los
     * cuatro datos son lo que respalda que podamos decirlo.
     */
    franja: [
      { es: "Acompañamos a mujeres", en: "We walk with women" },
      { es: "con la agenda llena", en: "whose contacts are full" },
      { es: "a hacer algo con ella.", en: "to finally do something with them.", enfasis: true },
    ],
    franjaFotoIzq: {
      es: "Una mujer hablando por teléfono en la calle",
      en: "A woman on a phone call out in the street",
    },
    franjaFotoDer: {
      es: "Una mujer escribiendo la semana en una agenda",
      en: "A woman writing her week into a planner",
    },
    descripcion: {
      es: "Quién está detrás de Emprende180, por qué existe y cómo ayuda a quien tiene el tiempo y le falta el método.",
      en: "Who is behind Emprende180, why it exists, and how it helps someone who has the time but not the method.",
    },

    /* El bloque de "por si acabas de llegar". */
    introTitulo: { es: "Por si acabas de llegar", en: "In case you're new here" },
    fotoIntro: {
      es: "Dos personas hablando apoyadas en la barra de una cafetería",
      en: "Two people talking, leaning on a coffee shop counter",
    },
    introTexto: {
      es: "Emprende180 es un método y un Ecosistema. El método es el reto de 90 días: qué hacer cada mañana, en orden, sin tener que decidirlo tú. El Ecosistema es lo que hay detrás cuando alguien de tu agenda necesita algo de verdad.",
      en: "Emprende180 is a method and an ecosystem. The method is the 90 day challenge: what to do each morning, in order, without having to decide it yourself. The ecosystem is what stands behind you when someone in your contacts actually needs something.",
    },

    /**
     * ─── PARA QUIEN ESTÁ EN CASA ─────────────────────────────────────────
     *
     * Tres frases y las tres empiezan igual: "no tienes que". Es a propósito.
     * A quien lleva una casa no le convence una lista de lo que va a
     * conseguir; le convence que le quiten de encima las tres cosas que da por
     * imposibles antes de empezar. Son las mismas tres objeciones que responde
     * el hero, aquí en su forma corta.
     */
    paraTiTitulo: { es: "Si estás en casa", en: "If you're at home" },
    paraTi: [
      {
        titulo: { es: "No tienes que salir.", en: "You don't have to leave." },
        texto: {
          es: "Todo se hace desde donde estés y con el teléfono que ya usas.",
          en: "It all happens from wherever you are, on the phone you already use.",
        },
      },
      {
        titulo: { es: "No tienes que saber del sector.", en: "You don't have to know the industry." },
        texto: {
          es: "Se empieza desde cero. Lo que hace falta lo enseña la Academia.",
          en: "You start from zero. What you need is what the Academy teaches.",
        },
      },
      {
        titulo: { es: "No tienes que inventarte nada.", en: "You don't have to invent anything." },
        texto: {
          es: "El reto de 90 días te dice qué toca cada día, y son dos horas.",
          en: "The 90 day challenge tells you what's on for each day, and it's two hours.",
        },
      },
    ],

    /**
     * ─── EN QUÉ CREEMOS ──────────────────────────────────────────────────
     *
     * El equivalente al "OUR VALUES" de la referencia, y la parte de esta
     * página que más trabaja. No son valores de folleto: las cuatro son
     * decisiones que ya están tomadas y que se pueden comprobar en el propio
     * sitio, y las cuatro dicen lo mismo por dentro: aquí no se promete lo que
     * no se puede sostener.
     *
     * Para alguien a quien le han vendido diez veces "gana dinero desde casa",
     * esto no es relleno: es la única diferencia que se nota antes de pagar.
     *
     * ⚠️ CADA UNA TIENE QUE SEGUIR SIENDO VERDAD. Si algún día la página pone
     * una cifra de ingresos, la primera se cae y con ella las otras tres.
     */
    creemosKicker: {
      es: "Lo que damos por cierto",
      en: "What we believe to be true",
    },
    creemosTitulo: { es: "En qué creemos", en: "What we believe" },
    creemos: [
      {
        ilustracion: "cifra",
        titulo: { es: "No te vamos a prometer una cifra.", en: "We won't promise you a number." },
        texto: {
          es: "Ni aquí ni por teléfono. No sabemos cuánto vas a hacer tú, y quien te dé un número se lo está inventando.",
          en: "Not here and not on a call. We don't know what you'll make, and anyone who gives you a number is making it up.",
        },
      },
      {
        ilustracion: "limites",
        titulo: { es: "Te decimos lo que no cubrimos.", en: "We tell you what we don't cover." },
        texto: {
          es: "Antes de que pagues, no después. Preferimos que no compres a que pidas la devolución en un mes.",
          en: "Before you pay, not after. We'd rather you didn't buy than have you asking for a refund in a month.",
        },
      },
      {
        ilustracion: "parte",
        titulo: { es: "Tu parte acaba donde acaba.", en: "Your part ends where it ends." },
        texto: {
          es: "Tú conectas a la persona; el Ecosistema resuelve. No tienes que vender nada que no sepas explicar.",
          en: "You connect the person; the ecosystem handles it. You never have to sell anything you can't explain.",
        },
      },
      {
        ilustracion: "horario",
        titulo: { es: "Se aprende en tu horario.", en: "You learn on your schedule." },
        texto: {
          es: "Sin clases en directo y sin grupos a las nueve de la noche. Si hoy no puedes, mañana sigue ahí.",
          en: "No live classes and no group calls at nine at night. If today isn't the day, it's still there tomorrow.",
        },
      },

      /**
       * ─── LOS TRES QUE HABLAN DE SU CASA ────────────────────────────────
       *
       * Los cuatro de arriba son compromisos sobre cómo vendemos. Estos tres
       * son sobre lo que NO le va a pasar a ella, y son los que de verdad
       * separan esto de lo que le han ofrecido antes: quien ha estado cerca de
       * una venta por catálogo reconoce las tres a la primera.
       *
       * ⚠️ LAS TRES SON COMPROBABLES EN EL PROPIO PRODUCTO, y por eso se pueden
       * escribir: no hay producto que revender porque lo que se conecta son
       * servicios del Ecosistema; no hay clases en directo, así que no hay
       * reunión obligatoria; y el acceso no caduca ni hay suscripción, así que
       * parar no cuesta nada.
       *
       * Si algún día aparece un pedido mínimo, una reunión semanal o una cuota,
       * estas tres frases hay que quitarlas el mismo día.
       */
      {
        ilustracion: "inventario",
        titulo: { es: "No compras nada para revender.", en: "You buy nothing to resell." },
        texto: {
          es: "Ni inventario, ni cajas en el garaje, ni pedido mínimo al mes. Lo que conectas son servicios, no productos.",
          en: "No inventory, no boxes in the garage, no monthly minimum. What you connect are services, not products.",
        },
      },
      {
        ilustracion: "casa",
        titulo: { es: "Tu casa sigue siendo tu casa.", en: "Your home stays your home." },
        texto: {
          es: "No hay reuniones obligatorias ni grupos que escriben a deshoras. Nadie va a contar las horas que le dedicas.",
          en: "No mandatory meetings and no groups messaging at odd hours. Nobody is counting the hours you put in.",
        },
      },
      {
        ilustracion: "volver",
        titulo: { es: "Puedes parar y volver.", en: "You can stop and come back." },
        texto: {
          es: "El acceso no caduca y no hay suscripción. Si este mes no puedes, no pierdes nada de lo que llevas.",
          en: "Access doesn't expire and there's no subscription. If this month isn't the one, you lose nothing.",
        },
      },
    ],

    /* Los mandos del carrusel. Son botones, así que dicen lo que hacen. */
    creemosAnterior: { es: "Ver los anteriores", en: "See previous" },
    creemosSiguiente: { es: "Ver los siguientes", en: "See next" },

    /**
     * ═════════════════════════════════════════════════════════════════════
     * POR QUÉ HACEMOS ESTO
     * ═════════════════════════════════════════════════════════════════════
     *
     * El equivalente al "WHY WE DO WHAT WE DO" de la referencia. De ahí se toma
     * el mecanismo, que son dos cosas y muy concretas:
     *
     *   1. Una frase de existencia: "[la marca] existe para que…". No dice qué
     *      vende, dice qué tiene que dejar de pasar en el mundo. Es lo que
     *      convierte un catálogo en una postura.
     *   2. UNA LISTA DE A QUIÉN AYUDAMOS, en cuatro perfiles. Ellos ponen
     *      cuatro etapas de negocio; aquí son cuatro versiones de la misma
     *      mujer, para que se reconozca en una sin tener que leerse las cuatro.
     *
     * ⚠️ NINGUNO DE LOS CUATRO PERFILES PROMETE NADA. Describen de dónde viene
     * ella, no a dónde llega. La diferencia se juega en una palabra: "ya
     * recomienda a todo el mundo sin que nadie se entere" es una descripción;
     * "sin sacar nada a cambio" habría sido una insinuación de ingresos, y esa
     * frase no se puede escribir sin datos.
     *
     * ⚠️ Y EL TERCERO NOMBRA LA VENTA POR CATÁLOGO SIN NOMBRARLA. Es el perfil
     * que más se reconoce y el que más desconfía, y por eso está: si no lo
     * decimos nosotros, lo piensa ella igual.
     */
    porqueKicker: { es: "Por qué hacemos esto", en: "Why we do what we do" },
    porqueTitulo: [
      { es: "Emprende180 existe para que", en: "Emprende180 exists so that" },
      { es: "conocer a la gente adecuada", en: "knowing the right people" },
      { es: "no acabe en un WhatsApp.", en: "stops ending in a text.", enfasis: true },
    ],
    porqueTexto: {
      es: "Cada semana alguien de tu agenda tiene delante algo que se puede resolver: una hipoteca, una obra, un accidente. Hoy contestas lo que puedes y ahí acaba todo. Nosotros ponemos el método para que no acabe ahí y el Ecosistema que se encarga del resto.",
      en: "Every week someone in your contacts is facing something that can be solved: a mortgage, a build, an accident. Today you answer what you can and that's where it ends. We bring the method so it doesn't end there, and the ecosystem that handles the rest.",
    },
    porqueListaTitulo: { es: "A quién ayudamos", en: "Who we help" },
    porqueLista: [
      {
        es: "A la que está en casa, tiene el tiempo y no sabe por dónde se empieza.",
        en: "The one who's at home, has the time and doesn't know where to start.",
      },
      {
        es: "A la que ya recomienda a todo el mundo sin que nadie se entere.",
        en: "The one who already refers everyone, with nobody noticing.",
      },
      {
        es: "A la que probó una venta por catálogo y acabó con cajas en el garaje.",
        en: "The one who tried catalog sales and ended up with boxes in the garage.",
      },
      {
        es: "A la que tiene un trabajo que no la llena y quiere algo suyo sin dejarlo todo.",
        en: "The one with a job that doesn't fulfil her, who wants something of her own without dropping everything.",
      },
    ],
    porqueFoto: {
      es: "Una mano escribiendo a lápiz en una mesa, con una taza al lado",
      en: "A hand writing in pencil at a table, a mug beside it",
    },

    /**
     * ─── EL BLOQUE DEL FUNDADOR ──────────────────────────────────────────
     *
     * La referencia abre el suyo con una línea suelta y personal antes de la
     * biografía ("hey love - i'm so happy you're here!"). No es adorno: cambia
     * quién habla. Hasta ese punto la página habla en plural y de repente hay
     * una persona sola dirigiéndose a ti, y eso es lo que hace que se lea la
     * biografía en vez de saltarla.
     *
     * La nuestra es más seca porque el tono de la marca lo es. Y sigue siendo
     * suya: el resto del bloque va en primera persona.
     */
    /**
     * ─── LA CITA DE PEDRO ────────────────────────────────────────────────
     *
     * ✅ CONFIRMADA POR ÉL el 9 de septiembre de 2026. Se redactó en su voz y
     * él la leyó y la firmó, así que ya son sus palabras y se pueden publicar
     * entrecomilladas y con su nombre debajo.
     *
     * ⚠️ Y POR ESO NO SE TOCA SIN VOLVER A PREGUNTARLE. Lo que está aprobado es
     * este texto, no la idea: cambiarle una frase "para que quede mejor"
     * devuelve la cita al estado en el que estaba antes de que él la leyera, y
     * una cita con su nombre que él no ha dicho es exactamente lo que esta
     * página no puede permitirse.
     *
     * Está construida solo con lo que ya decía su biografía —que en su otro
     * trabajo ve cada semana a alguien con una oportunidad delante que no sabe
     * a quién llamar— extendido a por qué el público son mujeres en casa. No
     * lleva ni una cifra, ni años, ni un episodio privado.
     */
    fundadorCita: {
      es: "Cada semana veo lo mismo: quien resuelve no es el que más sabe, es el que conoce a alguien. Y las que más gente conocen casi nunca están en una oficina. Están en casa, organizando la vida de todos, con media ciudad en el teléfono. A ellas nadie les había dicho que eso vale, ni qué hacer con ello. Emprende180 es el qué hacer.",
      en: "Every week I see the same thing: the one who solves it isn't the one who knows the most, it's the one who knows somebody. And the people who know the most people are almost never in an office. They're at home, running everyone's life, with half the city in their phone. Nobody had told them that's worth something, or what to do with it. Emprende180 is the what to do.",
    },
    fundadorSaludo: {
      es: "Hola. Si has llegado hasta aquí, esto es lo mío.",
      en: "Hi. If you've made it this far, here's my part.",
    },
    fundadorKicker: { es: "Quién está detrás", en: "Who's behind it" },

    /**
     * ⚠️ AQUÍ HUBO UN BLOQUE DE "LOS AÑOS" Y SE QUITÓ, PERO EL HUECO SIGUE.
     *
     * Los años ya son un dato y viven en la ficha de arriba: más de 20. Lo que
     * pedía este bloque era la otra mitad, y esa no ha llegado: de dónde viene
     * él, incluido lo que le salió mal.
     *
     * Sigue siendo lo único de esta página que un lector no puede deducir del
     * producto, y por eso lo que más convertiría. Dos frases suyas, en primera
     * persona, y esta página pasa de correcta a buena. Cuando existan, el sitio
     * es justo debajo de la cita.
     */

    credencialesTitulo: { es: "Los datos", en: "The receipts" },
    /**
     * ─── LOS DATOS, CON SU ETIQUETA ──────────────────────────────────────
     *
     * Cada dato lleva delante lo que ES: años en el sector, qué fundó, qué
     * escribió, qué dirige. Sin la etiqueta, los cuatro se leían como cuatro
     * frases sueltas; con ella se leen como una ficha, que es lo que el cliente
     * pidió al decir "datos de tipo años de experiencia".
     *
     * ⚠️ EL PRIMERO ES EL QUE FALTA Y ES EL QUE MÁS PESA. Los años en el sector
     * son un HECHO y no se inventan: mientras siga con `[COMPLETAR`, el dato no
     * se publica. En local sale resaltado en ámbar; en producción, la ficha
     * enseña tres en vez de cuatro. Ver `09-About`.
     */
    datos: [
      {
        /**
         * ✅ LO DIO EL CLIENTE el 9 de septiembre de 2026: más de 20 años.
         *
         * ⚠️ "MÁS DE 20" Y NO UN NÚMERO EXACTO, porque eso es lo que dijo. Si
         * mañana alguien lo convierte en "23 años" para que suene más
         * concreto, está inventando una precisión que nadie ha dado: un dato
         * redondeado es cierto, uno afinado a ojo no.
         */
        etiqueta: { es: "Años en el sector", en: "Years in the industry" },
        valor: { es: "Más de 20", en: "More than 20" },
      },
      {
        etiqueta: { es: "Fundador", en: "Founder" },
        valor: {
          es: "Emprende180 y el Ecosistema por el que pasa cada oportunidad",
          en: "Emprende180 and the ecosystem every opportunity runs through",
        },
      },
      {
        etiqueta: { es: "Autor", en: "Author" },
        valor: {
          es: "De la formación de Embajador y de la certificación",
          en: "Of the Ambassador training and its certification",
        },
      },
      {
        etiqueta: { es: "También dirige", en: "Also runs" },
        valor: {
          es: "El Señor de las Casas, financiamiento inmobiliario en Utah",
          en: "El Señor de las Casas, real estate financing in Utah",
        },
        prueba: "https://senordelascasas.com",
      },
    ],

    /**
     * ═══════════════════════════════════════════════════════════════════════
     * LAS EMPRESAS DEL ECOSISTEMA
     * ═══════════════════════════════════════════════════════════════════════
     *
     * Tres de los negocios que resuelven lo que un Embajador conecta, cada uno
     * con su logotipo y su comentario. Los dos logotipos que faltaban se
     * bajaron de sus propias webs y viven ya en `/public/imagenes/aliados/`.
     *
     * ⚠️ LO QUE HAY DEBAJO DE CADA LOGOTIPO NO ES UNA CITA SUYA, Y LA
     * DIFERENCIA ES TODA LA DIFERENCIA.
     *
     * Un testimonio entrecomillado de una empresa que esa empresa no ha escrito
     * es publicidad engañosa (FTC 16 CFR 465), y encima con su nombre y su
     * logotipo al lado: no es solo un problema nuestro, es poner palabras en
     * boca de otro negocio.
     *
     * Lo que sí podemos escribir —y es lo que hay— es QUÉ RESUELVE CADA UNO
     * cuando le llega alguien del Ecosistema. Va en nuestra voz, sin comillas y
     * sin firmar por ellos: es una descripción de la relación, no un elogio que
     * nadie ha dicho.
     *
     * `cita` queda preparada para el día que alguno mande un texto suyo, con
     * permiso por escrito. Mientras siga con `[COMPLETAR`, no se pinta.
     *
     * ⚠️ LO MISMO CON LAS ESTRELLAS. `estrellas: null` significa que nadie ha
     * puntuado nada. Cinco estrellas que no ha dado nadie son una valoración
     * inventada, exactamente la misma categoría de error que la cita inventada.
     * Cuando haya puntuación real, se pone el número y salen.
     */
    aliadosTitulo: [
      { es: "El Ecosistema", en: "The ecosystem" },
      { es: "que resuelve.", en: "that handles it.", enfasis: true },
    ],
    aliadosEntradilla: {
      es: "Tú conectas a la persona. Esto es lo que hay al otro lado.",
      en: "You connect the person. This is what's waiting on the other side.",
    },
    aliados: [
      {
        nombre: "Broker Lenders",
        /* Nuestra descripción de qué resuelven, no una cita suya. Ver arriba. */
        queResuelve: {
          es: "Cuando alguien de tu agenda necesita una hipoteca, la trabajan ellos. Tú solo hiciste la presentación.",
          en: "When someone in your contacts needs a mortgage, they handle it. All you did was make the introduction.",
        },
        logo: "/imagenes/aliados/brokerlenders.webp",
        url: "https://www.brokerlenders.com",
        rubro: { es: "Préstamos hipotecarios", en: "Mortgage lending" },
        estrellas: null as number | null,
        cita: {
          es: "[COMPLETAR (HECHO): cita textual de Broker Lenders sobre trabajar con Emprende180, con permiso por escrito de quien lo firma.]",
          en: "[COMPLETAR (FACT): verbatim quote from Broker Lenders about working with Emprende180, with written permission from whoever signs it.]",
        },
      },
      {
        nombre: "BoltWatts",
        /* Nuestra descripción de qué resuelven, no una cita suya. Ver arriba. */
        queResuelve: {
          es: "Obra, reforma y eléctrico. Lo que en una conversación normal acaba en «conozco a alguien», aquí acaba resuelto.",
          en: "Building, remodeling and electrical. What in a normal conversation ends in a vague promise, here ends solved.",
        },
        logo: "/imagenes/aliados/boltwatts.webp",
        url: "https://www.boltwatts.com",
        rubro: { es: "Construcción y remodelación", en: "Construction and remodeling" },
        estrellas: null as number | null,
        cita: {
          es: "[COMPLETAR (HECHO): cita textual de BoltWatts sobre trabajar con Emprende180, con permiso por escrito de quien lo firma.]",
          en: "[COMPLETAR (FACT): verbatim quote from BoltWatts about working with Emprende180, with written permission from whoever signs it.]",
        },
      },
      {
        nombre: "Car Injury Clinics",
        /* Nuestra descripción de qué resuelven, no una cita suya. Ver arriba. */
        queResuelve: {
          es: "Atención médica y apoyo legal después de un accidente, en el mismo sitio. Es de lo primero que aprende un Embajador a reconocer.",
          en: "Medical care and legal support after an accident, in one place. It's one of the first things an Ambassador learns to spot.",
        },
        logo: "/imagenes/aliados/carinjuryclinics.webp",
        /* ⚠️ SU LOGOTIPO ES BLANCO. Medido: el color medio de los píxeles
           opacos es 246,243,247, o sea que está dibujado para fondos oscuros.
           Sobre la placa blanca que llevan los otros dos, desaparecía entero y
           la tarjeta se veía vacía. Con esto, su placa es navy. */
        logoClaro: true,
        url: "https://carinjuryclinics.com",
        rubro: { es: "Atención médica y apoyo legal", en: "Medical care and legal support" },
        estrellas: null as number | null,
        cita: {
          es: "[COMPLETAR (HECHO): cita textual de Car Injury Clinics sobre trabajar con Emprende180, con permiso por escrito de quien lo firma.]",
          en: "[COMPLETAR (FACT): verbatim quote from Car Injury Clinics about working with Emprende180, with written permission from whoever signs it.]",
        },
      },
    ],
    volver: { es: "Ver cómo funciona el método", en: "See how the method works" },
    empezar: { es: "Quiero empezar", en: "I want to start" },
    fotoRetrato: {
      es: "Retrato de Pedro Lira, fundador de Emprende180",
      en: "Portrait of Pedro Lira, founder of Emprende180",
    },
  },

  /**
   * ─── CÓMO TRABAJAR CON EMPRENDE180 ─────────────────────────────────────
   *
   * Las tres piezas, numeradas. No son tres productos que se compren por
   * separado: son las tres cosas que se reciben con lo mismo, y por eso
   * ninguna tarjeta lleva precio ni "contratar".
   *
   * ⚠️ CADA BOTÓN VA A UN SITIO DISTINTO Y A UN SITIO QUE EXISTE. La maqueta
   * llevaba los tres a páginas nuevas; aquí van a las tres secciones de esta
   * misma página que ya responden a cada una. Las plataformas de verdad
   * (`plataformas.crm.url`, `plataformas.academia.url`) todavía no tienen
   * dirección, y hasta que la tengan no se enlazan desde fuera del área de
   * alumnos: un botón que se pulsa y no lleva a ningún sitio hace más daño
   * que no estar.
   */
  comoTrabajar: {
    aria: { es: "Cómo trabajar con Emprende180", en: "How to work with Emprende180" },
    kicker: { es: "Cómo se trabaja", en: "How it works" },
    titulo: [
      { es: "Tres piezas.", en: "Three pieces." },
      { es: "Una forma de trabajar.", en: "One way of working.", enfasis: true },
    ],
    piezas: [
      {
        numero: "01",
        titulo: { es: "La Academia", en: "The Academy" },
        texto: {
          es: "Los programas y el método que los sostiene, en videos cortos y en orden. Se ven cuando puedas.",
          en: "The programs and the method behind them, in short videos and in order. Watch them when you can.",
        },
        cta: { es: "Ver la Academia", en: "See the Academy" },
        href: "#academia",
      },
      {
        numero: "02",
        titulo: { es: "El CRM", en: "The CRM" },
        texto: {
          es: "Tus contactos y tus oportunidades en un sitio, con su estado al día. Va incluido.",
          en: "Your contacts and opportunities in one place, status current. It comes included.",
        },
        cta: { es: "Quiero empezar", en: "I want to start" },
        href: "#empezar",
      },
      {
        numero: "03",
        titulo: { es: "El reto de 90 días", en: "The 90 day challenge" },
        texto: {
          es: "Qué haces cada día desde el primero. No tienes que inventarte la agenda.",
          en: "What you do each day from day one. You don't have to invent the schedule.",
        },
        cta: { es: "Quiero empezar", en: "I want to start" },
        href: "#empezar",
      },
    ],
  },

  /**
   * ─── EL BLOG EN LA PORTADA ─────────────────────────────────────────────
   *
   * Los títulos que se ven aquí NO se escriben aquí: salen de
   * `getCollection("blog")`. Es la misma regla del teléfono de la lista, y por
   * el mismo motivo: una portada que anuncia artículos que no existen se cae
   * sola en cuanto alguien pulsa.
   *
   * ─── DE DÓNDE SALE LA FORMA ────────────────────────────────────────────
   *
   * Del bloque del podcast de bossbabe, que es la referencia que pasó el
   * cliente. Lo que se toma de ahí son tres cosas, y ninguna es una palabra
   * suya:
   *
   *   1. Un rótulo corto que nombra la cosa y un titular que la remata en
   *      cursiva.
   *   2. UNA FRASE DE ESCENA COTIDIANA antes de la lista. Ellos escriben
   *      "pour your raw milk latte, grab your favorite journal". No es relleno:
   *      es lo que convierte "aquí hay artículos" en "esto es para ti, y este
   *      es el momento del día en que lo lees". La nuestra habla de su día, no
   *      del nuestro.
   *   3. Un rótulo encima de la lista ("MY TOP 5 EPISODES:") que la presenta en
   *      vez de dejarla suelta.
   *
   * ⚠️ Y LA ESCENA TIENE QUE SER LA SUYA. "Antes de que te vuelvan a preguntar"
   * solo funciona si a quien lee ya le preguntan cosas, que es exactamente lo
   * que dice la sección del Embajador tres pantallas más arriba. Si algún día
   * el público cambia, esta frase es la primera que deja de valer.
   */
  blogPortada: {
    aria: { es: "Lo último del blog", en: "Latest from the blog" },
    kicker: { es: "El blog", en: "The blog" },
    titulo: [
      { es: "Las respuestas", en: "The answers" },
      { es: "que ya te piden.", en: "people already ask you for.", enfasis: true },
    ],
    texto: {
      es: "Casos que pasan de verdad y qué contestar en cada uno. Ni teoría ni motivación: la frase exacta.",
      en: "Things that actually happen and what to answer in each one. No theory, no pep talk: the exact words.",
    },
    /* La escena. Ver la nota de arriba. */
    escena: {
      es: "Se leen en cinco minutos, con el café y sin dejar el correo. Justo antes de que te vuelvan a preguntar.",
      en: "Five minute reads, with your coffee and without leaving your email. Right before someone asks you again.",
    },
    listaTitulo: { es: "Lo último que escribí", en: "The latest I've written" },
    /* El botón de cada título. No dice "leer más": dice qué va a pasar al
       pulsar, que es que el artículo se abre encima sin salir de la página. */
    abrir: { es: "Abrir", en: "Open" },
    cerrar: { es: "Cerrar", en: "Close" },
    /* Dentro del diálogo, para quien quiera la dirección de verdad: la que se
       comparte y la que indexa Google. */
    verEnBlog: { es: "Ver en el blog", en: "View on the blog" },
    verTodos: { es: "Todos los artículos", en: "All articles" },
    redes: { es: "Dónde publico", en: "Where I post" },
    foto: {
      es: "Retrato de Pedro Lira, fundador de Emprende180",
      en: "Portrait of Pedro Lira, founder of Emprende180",
    },
    vacio: {
      es: "Todavía no hay artículos publicados.",
      en: "No articles published yet.",
    },
  },

  /**
   * ─── LA ACADEMIA ───────────────────────────────────────────────────────
   *
   * ⚠️ AQUÍ YA NO SE DICE "DIEZ VIDEOS", y el cambio lo pidió el cliente con
   * un motivo de producto, no de estilo: la Academia NO es un curso, es donde
   * viven los programas, y va a haber más de uno. Contarla por el número de
   * videos de uno solo la encoge a la mitad de lo que es.
   *
   * Lo que la sección vende ahora es el MÉTODO: el plan de 90 días, que es lo
   * único que responde "¿y yo qué hago mañana?". El formato —videos cortos, en
   * orden, con su quiz— sigue estando porque es cierto y porque quita miedo,
   * pero va detrás, no delante.
   *
   * ⚠️ Y SIGUE SIN PROMETER UNA CADENCIA. "Los programas" en plural es un hecho
   * del producto que dijo el cliente; "un programa nuevo cada mes" sería una
   * promesa que hay que cumplir. Si alguien añade una frecuencia a esta
   * sección, la está inventando.
   *
   * ─── EL GANCHO ES UNA HORA DEL DÍA, NO UNA VENTAJA ─────────────────────
   *
   * "Se ve de noche, en la mesa de la cocina" no describe el producto: describe
   * el momento en que ella puede. Es el mismo recurso de la frase del café en
   * el blog, y responde sin discutirla la objeción que de verdad frena a
   * alguien con la casa a cuestas, que no es el precio ni el temario, es
   * "¿cuándo lo voy a hacer?".
   *
   * Por eso el segundo párrafo dice lo que NO hay: ni directos ni horarios. Un
   * curso con clase el martes a las seis está descartado antes de leer de qué
   * va.
   *
   * Tampoco habla del CRM ni del Ecosistema: eso tiene su sitio en
   * `comoTrabajar`, y repetirlo aquí diluye las dos.
   */
  academia: {
    aria: { es: "La Academia", en: "The Academy" },
    kicker: { es: "La Academia", en: "The Academy" },
    titulo: [
      { es: "Se ve de noche,", en: "You watch it at night," },
      { es: "en la mesa de la cocina.", en: "at the kitchen table.", enfasis: true },
    ],
    texto: [
      {
        es: "Dentro están los programas de Emprende180 y el método que los sostiene: el reto de 90 días, un paso cada día, para que no tengas que inventarte la agenda.",
        en: "Inside are the Emprende180 programs and the method that holds them together: the 90 day challenge, one step a day, so you never have to invent your own schedule.",
      },
      {
        es: "Cada programa en videos cortos y en orden, con un quiz que confirma que lo tienes. Sin clases en directo ni horarios: si hoy no puedes, mañana sigue ahí.",
        en: "Each program in short videos, in order, with a quiz that confirms you've got it. No live classes and no schedule: if today isn't the day, it's still there tomorrow.",
      },
    ],
    cta: { es: "Entrar", en: "Log in" },
    foto: {
      es: "Una persona sentada a la mesa de su cocina, de noche, trabajando con su portátil",
      en: "Somebody at their kitchen table at night, working on their laptop",
    },
  },

  /**
   * ─── LOS RECURSOS ──────────────────────────────────────────────────────
   *
   * La franja oscura que manda a `/recursos`. El enlace del menú apunta ahí
   * desde antes que esta sección, así que la página tiene que existir: dos
   * sitios llevando a un 404 es peor que uno.
   *
   * ─── EL GANCHO ES LO QUE NO PEDIMOS ────────────────────────────────────
   *
   * El titular anterior era una lista de sustantivos: "guías, respuestas
   * directas y trucos". Eso no engancha porque no dice nada que el lector no
   * dé por hecho; cualquier página promete guías.
   *
   * Lo que sí es raro en internet, y por eso es el gancho, es que NO haya que
   * dejar el correo para leer. Ella ya sabe cómo funciona esto: das el email y
   * empiezan a llegarte cosas. Decirle por adelantado que aquí no pasa quita la
   * única duda que tiene antes de pulsar.
   *
   * ⚠️ Y TIENE QUE SEGUIR SIENDO VERDAD. En `/recursos` los artículos se leen
   * sin formulario; el que hay al final es opcional y solo sirve para avisar de
   * los siguientes. El día que algo de esa página se ponga detrás de un correo,
   * esta frase pasa a ser mentira y hay que cambiarla.
   */
  recursos: {
    aria: { es: "Recursos gratis", en: "Free resources" },
    kicker: { es: "Recursos", en: "Resources" },
    titulo: [
      { es: "Todo lo que escribimos,", en: "Everything we write," },
      { es: "sin dejar el correo.", en: "without leaving your email.", enfasis: true },
    ],
    texto: {
      es: "Guías cortas para mover tu red sin incomodar a nadie. Se abren y se leen: ni registro, ni prueba gratis.",
      en: "Short guides on working your network without making it weird. You open them and read: no sign-up, no free trial.",
    },
    cta: { es: "Ver los recursos", en: "See the resources" },

    /**
     * ─── LA PÁGINA ───────────────────────────────────────────────────────
     *
     * ⚠️ AQUÍ NO HAY "DESCARGABLES" NI "CONTENIDO EXCLUSIVO", y no es por
     * modestia: es que no existen. Lo que hay son los artículos publicados y
     * el aviso cuando sale uno nuevo, y eso es lo que dice la página. El día
     * que haya una plantilla o un PDF de verdad, se añade aquí y el texto
     * cambia con él.
     */
    paginaTitulo: { es: "Recursos", en: "Resources" },
    paginaEntradilla: {
      es: "Todo lo que hay publicado, sin pedir nada a cambio.",
      en: "Everything published so far, with nothing asked in return.",
    },
    paginaDescripcion: {
      es: "Guías cortas para mover tu red sin incomodar a nadie. Gratis y sin registro.",
      en: "Short guides on working your network without making it weird. Free, no sign-up.",
    },
    paginaArticulos: { es: "Los artículos", en: "The articles" },
    paginaVacio: {
      es: "Todavía no hay nada publicado. Déjame tu correo y te aviso con lo primero.",
      en: "Nothing published yet. Leave me your email and I'll let you know about the first one.",
    },
  },

  /**
   * ─── EL PLAN DE 90 DÍAS ────────────────────────────────────────────────
   *
   * Todo sale del documento "Plan de 90 Días — Prospección Diaria del
   * Embajador" que pasó el cliente, y de su guion en video. No hay una sola
   * cifra inventada: los repartos de tiempo, los días de cada fase y los tres
   * hitos están ahí, tal cual.
   *
   * ─── ESTÁ ESCRITO PARA MIRARSE, NO PARA LEERSE ─────────────────────────
   *
   * ⚠️ SI ALGUIEN AMPLÍA ESTOS TEXTOS, SE ROMPE LA SECCIÓN. Cada frase de aquí
   * cabe en una o dos líneas a propósito: la sección es una rejilla de piezas
   * cortas —tres bloques de tiempo, cuatro fases, tres hitos— y en cuanto una
   * frase pasa a tres renglones, su vecina se queda corta, la fila se descuadra
   * y el bloque deja de escanearse.
   *
   * La primera versión era el doble de larga. La cambió el cliente con una
   * frase: "no tanto texto, sea poco que leer".
   *
   * ⚠️ NI UNA CIFRA DE RESULTADOS. Las metas del documento (450 contactos, 700
   * personas contactadas, 30 referidos) son de ACTIVIDAD, no de ingresos, y aun
   * así no se publican: en una página de venta, cualquier número junto a la
   * palabra "meta" se lee como una promesa. La regla 5 del propio documento
   * dice "nunca prometas resultados, montos, tiempos ni diagnósticos".
   */
  plan90: {
    aria: { es: "El plan de 90 días", en: "The 90-day plan" },
    kicker: { es: "Después del curso", en: "After the course" },
    titulo: {
      es: "Los 90 días que cambian tu rutina",
      en: "The 90 days that change your routine",
    },
    entradilla: {
      es: "Cuatro fases y un trabajo que cabe en una frase: un mensaje, a una persona, con su nombre.",
      en: "Four phases and work that fits in one sentence: one message, to one person, by name.",
    },

    /* El dato que más cualifica de toda la página: espanta a quien no puede
       darlas y tranquiliza a quien sí. Por eso va grande y solo. */
    compromiso: {
      etiqueta: { es: "Al día", en: "A day" },
      valor: { es: "2 horas", en: "2 hours" },
      nota: {
        es: "Ni más, ni menos. La constancia vence a la intensidad.",
        en: "No more, no less. Consistency beats intensity.",
      },
    },

    regla: {
      es: "Si no está en el CRM, no existió.",
      en: "If it isn't in the CRM, it didn't happen.",
    },

    /**
     * DÓNDE ACABA TU PARTE. Es la regla 5 del documento del cliente, y en una
     * línea contesta tres objeciones a la vez: ¿necesito licencia?, ¿tengo
     * que saber de seguros?, ¿me hago responsable de lo que pase?
     *
     * Va aquí, en el plan, y no solo en el FAQ: quien lee cómo es el trabajo
     * diario es quien se está preguntando hasta dónde llega su parte.
     */
    limite: {
      es: "Tú conectas; el equipo certificado resuelve.",
      en: "You connect people; the certified team handles it.",
    },

    /* Confirmado por el cliente: la llamada semanal y el CRM configurado
       existen hoy. Si dejan de existir, esta frase se cae con ellos. */
    acompanamiento: {
      es: "Con una llamada de equipo cada semana y el CRM ya configurado.",
      en: "With a team call every week and your CRM already set up.",
    },

    dia: {
      titulo: { es: "Tu día, en tres bloques", en: "Your day, in three blocks" },
      bloques: [
        {
          nombre: { es: "Prospección", en: "Prospecting" },
          minutos: { es: "60 min", en: "60 min" },
          /* Los referidos van AQUÍ, en el bloque de todos los días, y no en
             una pieza aparte: en el plan del cliente pedir referidos no es
             una fase ni un extra, es parte de la hora de prospección desde
             el día 10. Dos palabras, en el sitio donde se hace. */
          para: {
            es: "Gente nueva y referidos, por mensaje",
            en: "New people and referrals, by message",
          },
        },
        {
          nombre: { es: "Seguimiento", en: "Follow-up" },
          minutos: { es: "45 min", en: "45 min" },
          para: {
            es: "Conversaciones abiertas y contactos fríos",
            en: "Open conversations and cold contacts",
          },
        },
        {
          nombre: { es: "Cierre en CRM", en: "Closing in the CRM" },
          minutos: { es: "15 min", en: "15 min" },
          para: { es: "Tareas, contactos y notas del día", en: "Tasks, contacts and the day's notes" },
        },
      ],
      cambia: {
        es: "Al final el reparto es 35 · 70 · 15: menos gente nueva y más seguimiento, porque ya hay algo que cuidar.",
        en: "By the end it's 35 · 70 · 15: fewer new people, more follow-up, because by then there's something to look after.",
      },
    },

    /* `dias` es el ANCHO de cada fase en la barra, y sale de los días que dura:
       20, 25, 25 y 20 de un total de 90. La barra no es una decoración con
       cuatro trozos iguales, es el calendario a escala. */
    fasesTitulo: { es: "Las cuatro fases", en: "The four phases" },
    fases: [
      {
        dias: 20,
        rango: { es: "Días 1–20", en: "Days 1–20" },
        nombre: { es: "Fundación", en: "Foundation" },
        /* El primer referido se pide el DÍA 10 según el plan, o sea dentro
           de esta fase. Se dice aquí y no más adelante porque es lo que
           sorprende: no hay que esperar tres meses para pedirlo. */
        objetivo: {
          es: "Construyes tu base y pides tu primer referido, sin vender nada.",
          en: "You build your base and ask for your first referral, without selling anything.",
        },
      },
      {
        dias: 25,
        rango: { es: "Días 21–45", en: "Days 21–45" },
        nombre: { es: "Sistematización", en: "Systematizing" },
        objetivo: {
          es: "Cada contacto con su etapa, su etiqueta y su próximo paso.",
          en: "Every contact with its stage, its tag and its next step.",
        },
      },
      {
        dias: 25,
        rango: { es: "Días 46–70", en: "Days 46–70" },
        nombre: { es: "Red y base viva", en: "Network and living base" },
        objetivo: {
          es: "Alianzas locales y reactivación de todo lo que sembraste.",
          en: "Local alliances, and reactivating everything you sowed.",
        },
      },
      {
        dias: 20,
        rango: { es: "Días 71–90", en: "Days 71–90" },
        nombre: { es: "Consolidación", en: "Consolidation" },
        objetivo: {
          es: "La rutina se sostiene sola. Cierras y decides qué sigue.",
          en: "The routine holds on its own. You close up and decide what's next.",
        },
      },
    ],

    /* Los tres días en que el programa se para a mirarte. Una línea cada uno:
       son lo que hace creíble el resto —un plan que admite que a la mitad te
       puede decir "esto no es para ti" no está vendiendo humo— y para eso no
       hacen falta párrafos. */
    hitosTitulo: {
      es: "Tres días que no son de trámite",
      en: "Three days that aren't a formality",
    },
    hitos: [
      {
        dia: { es: "Día 45", en: "Day 45" },
        texto: {
          es: "Corte con tu líder: sigues, ajustas o pausas.",
          en: "Checkpoint with your leader: carry on, adjust or pause.",
        },
      },
      {
        dia: { es: "Día 78", en: "Day 78" },
        texto: {
          es: "Dejas de recibir tareas y escribes las tuyas.",
          en: "You stop being handed tasks and write your own.",
        },
      },
      {
        dia: { es: "Día 90", en: "Day 90" },
        texto: {
          es: "Con tus números delante, eliges qué sigue.",
          en: "With your numbers in front of you, you choose what's next.",
        },
      },
    ],

    /* El puente al imán gratuito. El plan son 90 días y nadie los empieza desde
       una página de venta; el reto de 7 correos sí se empieza hoy. */
    gratisTitulo: {
      es: "Empieza por los primeros 7 días",
      en: "Start with the first 7 days",
    },
  },

  /**
   * ─── LA SECCIÓN DE INFORMES ───────────────────────────────────────────
   *
   * Sustituye al panel de precio mientras `curso.precio.publico` sea `false`.
   *
   * El texto está escrito con una regla: NO fingir que el precio es un
   * secreto. Se dice por qué no está y se dice cómo conseguirlo. Una página
   * que esconde la cifra sin explicarse se lee como "es caro y no te lo
   * quiero decir", que es justo la conclusión que hay que evitar.
   */
  informes: {
    kicker: { es: "Empezar", en: "Getting started" },
    titulo: [
      { es: "El reto empieza", en: "The challenge starts" },
      { es: "cuando tú digas.", en: "when you say.", enfasis: true },
    ],
    /* El porqué, sin rodeos: es lo que separa "reservado" de "sospechoso". */
    porQue: {
      es: "Déjanos tu nombre y tu correo. Te escribimos, te contamos cómo se entra y decides tú.",
      en: "Leave us your name and your email. We'll write, tell you how it works, and you decide.",
    },
    /* Lo que SÍ se puede decir de dinero sin dar la cifra. */
    hechos: [
      { es: "Un solo pago. Ni suscripción ni cargos recurrentes.", en: "One payment. No subscription, no recurring charges." },
      { es: "El acceso al curso no caduca.", en: "Course access doesn't expire." },
      { es: "Se puede pagar en {n} partes.", en: "You can pay it in {n} parts." },
    ],
    ctaBoton: { es: "Quiero empezar", en: "I want to start" },
    aviso: {
      es: "Te escribimos una vez y resolvemos dudas. Sin insistir después.",
      en: "We write once and answer your questions. No pestering afterwards.",
    },
    exitoTitulo: { es: "Listo. Te escribimos.", en: "Done. We'll be in touch." },
    exitoTexto: {
      es: "Te contactamos con todo lo que necesites saber antes de decidir.",
      en: "We'll reach out with everything you need to know before deciding.",
    },
    telefonoEtiqueta: { es: "Teléfono (opcional)", en: "Phone (optional)" },
    telefonoAyuda: {
      es: "Por teléfono se resuelve en cinco minutos lo que por correo tarda tres días.",
      en: "A phone call settles in five minutes what email takes three days to sort out.",
    },
    recomendadoEtiqueta: {
      es: "¿Quién te recomendó? (opcional)",
      en: "Who referred you? (optional)",
    },
    recomendadoAyuda: {
      es: "Nombre y apellido de quien te habló de Emprende180.",
      en: "First and last name of whoever told you about Emprende180.",
    },
    llamar: { es: "Prefiero que me llamen", en: "I'd rather you call me" },

    /**
     * Lo que dicen las tres tiras mientras no haya precio publicado.
     *
     * ⚠️ CONFIRMAR ANTES DE PUBLICAR: esto afirma que el precio cambia según
     * quién te recomiende. Es lo que nos dijo el cliente, y es el motivo de
     * que la cifra no esté en la página. Si el descuento por recomendación
     * no existe o funciona de otra forma, esta frase hay que cambiarla: es
     * una condición comercial, y decirla mal es publicidad engañosa.
     */
    cinta: {
      etiqueta: { es: "El precio", en: "The price" },
      texto: {
        es: "depende de con quién llegas",
        en: "depends on who sends you",
      },
      enlace: { es: "Pide el tuyo", en: "Ask for yours" },
    },

    /* La frase que ocupa el sitio del "Precio de lanzamiento: $490" en la
       tira de anuncios. Más corta que la de la cinta: aquí pasa moviéndose y
       hay que poder leerla de una pasada. */
    anuncio: {
      es: "El precio depende de quién te recomienda",
      en: "The price depends on who refers you",
    },
  },

  precio: {
    aria: { es: "Precio y qué incluye", en: "Price and what's included" },
    titulo: { es: "Todo lo que te llevas", en: "Everything you get" },
    entradilla: {
      es: "Un solo pago: el curso completo, los diez quizzes y tu Certificación de Embajador al superarlos. El acceso es tuyo para siempre, sin suscripción ni cargos recurrentes.",
      en: "One payment: the complete course, all ten quizzes and your Ambassador Certification once you pass them. The access is yours for good, with no subscription and no recurring charges.",
    },
    cuotas: { es: "o {n} pagos de {importe}", en: "or {n} payments of {importe}" },
    conGarantia: { es: "Con {garantia}.", en: "Includes {garantia}." },

    /** Cabecera del desglose que sostiene el ancla. */
    desgloseTitulo: {
      es: "Qué incluye, y cuánto vale cada parte",
      en: "What's included, and what each part is worth",
    },
    /* La misma cabecera cuando no hay cifras que enseñar: la lista sigue
       siendo la misma, pero prometer "cuánto vale cada parte" y no poner ni
       un número al lado sería una cabecera que miente. */
    desgloseTituloSinPrecio: {
      es: "Qué incluye, parte por parte",
      en: "What is included, piece by piece",
    },

    desgloseTotal: { es: "Valor total", en: "Total value" },

    // ── Framing 'lanzamiento' (activo) ──────────────────────────────────────
    lanzamiento: {
      kicker: { es: "Precio de fundadores", en: "Founding member price" },
      etiquetaPrecio: { es: "Precio de lanzamiento", en: "Launch price" },
      /** `{referencia}` = la cifra ancla ya formateada. */
      subira: { es: "Después subirá a {referencia}", en: "It goes up to {referencia} after that" },
      /**
       * EL ENGANCHE DE LA SECCIÓN, y está escrito con mucho cuidado.
       *
       * Compara el precio de hoy con LO QUE SUMA EL DESGLOSE, no con un precio
       * anterior. Esa distinción es toda la diferencia:
       *
       *   · "Ahorras 3.500" a secas insinúa que antes costaba 3.990. Nunca
       *     costó eso, y afirmarlo es el precio anterior falso que persiguen
       *     PROFECO y la FTC.
       *   · "3.500 menos de lo que suma el desglose" es comprobable en la misma
       *     pantalla: el visitante tiene las cuatro partidas al lado y puede
       *     sumarlas. La sección incluso avisa si dejan de cuadrar.
       *
       * Y por eso el desglose no es decoración: es lo que le da derecho a esta
       * frase a existir. Si alguien infla una partida, esta frase pasa a mentir.
       */
      frenteAlDesglose: {
        es: "{importe} menos de lo que suma el desglose",
        en: "{importe} less than the breakdown adds up to",
      },
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
    /**
     * Texto del botón mientras `urlCheckout` siga siendo "#". No es un aviso:
     * es la acción real que hay disponible hoy para inscribirse. Ver el
     * comentario del botón en `09-Precio.astro`.
     */
    llamarParaInscribirse: {
      es: "Llámame para inscribirte",
      en: "Call me to enroll",
    },

    /**
     * ─── LAS CINTAS DE PRECIO ────────────────────────────────────────────
     *
     * Texto de `CintaPrecio.astro`, el aviso de "esto sube de precio" que se
     * repite en tres puntos de la página.
     *
     * TODO ESTO SALE DE UN ÚNICO DATO: `curso.precio.urgencia.fechaCierre`.
     * No hay una segunda fecha en ningún sitio, no hay un contador que arranque
     * en la visita y no hay forma de que dos cintas digan cosas distintas.
     * Si esa fecha se pone a `null`, las tres desaparecen a la vez.
     *
     * LO QUE SE DICE ES LA FECHA, NO EL TIEMPO QUE QUEDA. "El precio sube el 31
     * de agosto" no caduca nunca aunque la página se quede cacheada en un CDN o
     * en el botón de atrás del navegador; "quedan 12 días" sí, y quedarse a
     * medio día de distancia de la verdad en una página que presume de no
     * inflar nada sale muy caro. Los días los añade JavaScript en el cliente,
     * que sí sabe qué hora es. Sin JavaScript se lee la fecha y se entiende
     * igual.
     */
    cinta: {
      /** Se antepone al precio. Corto: la cinta tiene que caber en una línea. */
      etiqueta: { es: "Precio de lanzamiento", en: "Launch price" },
      /**
       * El argumento fuerte, y el que faltaba: enseñar las DOS cifras juntas.
       *
       * "$490 · sube a $3,990 el 30 de septiembre" pega mucho más que "el precio
       * sube el 30 de septiembre", porque el salto se ve en vez de imaginarse.
       *
       * ⚠️ Y AUN ASÍ NO ES UN DESCUENTO, NI PUEDE PRESENTARSE COMO TAL. Con
       * `framing: "lanzamiento"` los 3.990 son el precio FUTURO, no uno pasado.
       * Nada de tachar los 3.990 ni de escribir "antes 3.990": PROFECO y la FTC
       * exigen que un precio anterior tachado haya sido real y estado vigente,
       * y este nunca lo ha estado. Enseñar las dos cifras con un "sube a" es
       * verdad desde el primer día; tacharlas sería publicidad engañosa.
       */
      sube: {
        es: "sube a {referencia} el {fecha}",
        en: "goes up to {referencia} on {fecha}",
      },
      /** Lo rellena el script del cliente. `{n}` = días completos que faltan. */
      quedanDias: { es: "quedan {n} días", en: "{n} days left" },
      quedaUnDia: { es: "queda 1 día", en: "1 day left" },
      ultimoDia: { es: "último día", en: "last day" },
      verPrecio: { es: "Ver el precio", en: "See pricing" },
    },
  },

  faq: {
    aria: { es: "Preguntas frecuentes", en: "Frequently asked questions" },
    titulo: {
      es: "Preguntas que probablemente te estás haciendo",
      en: "Questions you're probably asking yourself",
    },

    /**
     * La columna del título es lo único que se ve mientras se recorren las
     * preguntas, así que no puede ser solo el título: tiene que decir qué son
     * estas respuestas y quién las escribe. `entradilla` hace ese trabajo.
     */
    entradilla: {
      es: "Las que más me llegan por teléfono, contestadas sin rodeos. Si algo aquí no te cuadra, prefiero que lo sepas antes de pagar y no después.",
      en: "The ones I get most on the phone, answered straight. If something here doesn't add up for you, I'd rather you knew before paying, not after.",
    },
    /** Se rellena con el número real de preguntas. Ver `10-Faq.astro`. */
    cuantas: {
      es: "{n} dudas resueltas",
      en: "{n} questions answered",
    },

    /** Cierre de la sección: la duda que no está en la lista. */
    quedaDuda: {
      es: "¿Y si tu duda no está aquí?",
      en: "And if your question isn't here?",
    },
    quedaDudaTexto: {
      es: "Te contesto yo, no un chatbot ni un formulario. Llámame y lo resolvemos en cinco minutos.",
      en: "I answer, not a chatbot or a form. Call me and we sort it out in five minutes.",
    },
    contactar: { es: "Dejarme tus datos", en: "Leave me your details" },
  },

  /**
   * ─── CINTAS ENTRE SECCIONES ──────────────────────────────────────────────
   *
   * Bandas finas que se cuelan entre dos secciones para recordar por qué vale
   * la pena. Las pinta `CintaMensaje.astro`.
   *
   * TRES REGLAS, Y LAS TRES SON DE CREDIBILIDAD, NO DE ESTILO:
   *
   * 1. CADA UNA DICE ALGO DISTINTO. Si las tres repiten "aprovecha, sube el
   *    precio", la página deja de ser una página y pasa a ser un cartel: es
   *    exactamente el infoproducto de gurú del que huye PRODUCT.md. Una habla
   *    de riesgo (garantía), otra de propiedad (acceso de por vida) y solo la
   *    última del precio.
   *
   * 2. NINGUNA INVENTA NADA. Los 30 días salen de `garantia.dias`, el acceso de
   *    `curso.formato.acceso`, las cuotas de `precio.cuotas` y las dos cifras de
   *    `precio.actual` y `precio.referencia`. Si mañana cambia un dato en el
   *    config, cambia la cinta. No hay ni un número escrito a mano aquí.
   *
   * 3. EL `detalle` AMPLÍA, NUNCA COMPLETA. Se despliega al pasar el cursor, así
   *    que el `titulo` tiene que entenderse solo. En móvil el detalle se ve
   *    siempre (ahí no hay cursor que pasar), de modo que nadie se queda sin la
   *    promoción: lo único que cambia es si hay que hacer un gesto para ver la
   *    letra pequeña.
   *
   * ⚠️ Si algún día son cinco o seis, el problema no será el diseño: será que la
   * página ya no argumenta, insiste.
   */
  /**
   * ─── LAS TIRAS EN MOVIMIENTO ─────────────────────────────────────────────
   *
   * Franjas navy que cruzan la página anunciando el precio, el plazo y lo que
   * incluye el curso. Sustituyen a las cintas de hover: aquellas escondían el
   * detalle detrás del cursor y no se veían en móvil, y encima eran tres cajas
   * quietas. Estas se leen solas.
   *
   * REGLAS DE ESCRITURA:
   *  · Frases de CUATRO O CINCO PALABRAS. El texto va pasando; lo que no se lee
   *    de un vistazo no se lee.
   *  · Sin verbos de relleno ("aprovecha", "no te lo pierdas"). El dato es el
   *    argumento: la cifra, la fecha, lo que entra.
   *  · `{actual}`, `{referencia}`, `{fecha}`, `{dias}` y `{videos}` se
   *    interpolan desde el config. Ni un número escrito a mano.
   *
   * `{dias}` lo rellena JavaScript en el cliente, que es quien sabe qué día es
   * hoy; sin JavaScript esa frase no se pinta y las demás siguen. Ver
   * `CintaAnuncio.astro`.
   */
  anuncios: {
    precio: {
      es: "Precio de lanzamiento: {actual}",
      en: "Launch price: {actual}",
    },
    sube: {
      es: "Sube a {referencia} el {fecha}",
      en: "Goes up to {referencia} on {fecha}",
    },
    dias: { es: "Quedan {dias} días", en: "{dias} days left" },
    ultimoDia: { es: "Último día", en: "Last day" },
    curso: {
      es: "{videos} videos y tu certificación",
      en: "{videos} videos and your certification",
    },
    garantia: {
      es: "Garantía de {garantiaDias} días",
      en: "{garantiaDias}-day guarantee",
    },
    acceso: { es: "Acceso de por vida", en: "Lifetime access" },
    cuotas: { es: "O {cuotas} mensualidades", en: "Or {cuotas} monthly payments" },
    etiqueta: { es: "Anuncios del curso", en: "Course announcements" },
    /* El mando de parada de la tira. Rótulos propios y no los de la banda de
       testimonios: "Pausar los testimonios" encima de una tira de precios es
       justo el tipo de etiqueta reciclada que deja a quien la escucha sin saber
       qué acaba de parar. */
    pausar: { es: "Pausar los anuncios", en: "Pause the announcements" },
    reanudar: { es: "Reanudar los anuncios", en: "Resume the announcements" },
  },

  cintasIntermedias: {
    garantia: {
      titulo: {
        es: "Pruébalo {dias} días. Si no es para ti, te devolvemos el 100 %",
        en: "Try it for {dias} days. If it's not for you, we refund 100%",
      },
      detalle: {
        es: "Sin formularios, sin llamadas de retención y sin que tengas que justificar nada. Escribes a soporte y ya.",
        en: "No forms, no retention calls, and nothing to justify. You email support and that's it.",
      },
    },
    acceso: {
      titulo: {
        es: "Lo compras una vez y es tuyo para siempre",
        en: "You buy it once and it's yours for good",
      },
      detalle: {
        es: "Acceso de por vida a los diez videos, sin suscripción ni cargos recurrentes. Las actualizaciones futuras entran sin pagar de nuevo.",
        en: "Lifetime access to all ten videos, with no subscription and no recurring charges. Future updates are included at no extra cost.",
      },
    },
    aprovecha: {
      titulo: {
        es: "Todavía estás a tiempo del precio de lanzamiento",
        en: "You're still in time for the launch price",
      },
      detalle: {
        es: "Hoy son {actual}, o {cuotas} mensualidades. El {fecha} pasa a {referencia}, y quien entró antes conserva su precio.",
        en: "Today it's {actual}, or {cuotas} monthly payments. On {fecha} it becomes {referencia}, and whoever got in earlier keeps their price.",
      },
    },
  },

  /**
   * ─── LA BARRA FLOTANTE ───────────────────────────────────────────────────
   *
   * Aparece al dejar atrás el hero y acompaña el resto de la página: teletipo
   * de ofertas a la izquierda y botones a la derecha. Ver `BarraFlotante.astro`.
   *
   * Los textos son CORTOS a propósito. Es una barra de 64 px que convive con el
   * contenido: cada palabra de más le roba sitio al teletipo, que es lo único
   * que ahí dentro se mueve y por tanto lo único que se mira.
   */
  barra: {
    llamar: { es: "Llamar", en: "Call" },
    contacto: { es: "Contacto", en: "Contact us" },
    etiqueta: { es: "Acciones rápidas", en: "Quick actions" },
  },

  /** Vídeo de introducción del hero. Ver `VideoVsl.astro`. */
  vsl: {
    /** Rótulo sobre el póster. Dice qué es antes de que nadie pulse. */
    etiqueta: {
      es: "Míralo en 90 segundos",
      en: "Watch it in 90 seconds",
    },
    /** Lo lee un lector de pantalla al llegar al botón. */
    reproducir: {
      es: "Reproducir el vídeo de introducción a Emprende180",
      en: "Play the Emprende180 introduction video",
    },
    pistaSubtitulos: { es: "Español", en: "Spanish" },
  },

  /**
   * Banda de testimonios. Ver `BandaTestimonios.astro`.
   *
   * Los tres los lee un lector de pantalla, así que van en el idioma de la
   * página como cualquier otro texto. `etiqueta` nombra la lista: sin ella, lo
   * que se anuncia es "lista, doce elementos" y no se sabe de qué.
   */
  /* El rótulo de la banda de logos. Ver 05-Aliados.astro. */
  aliados: {
    rotulo: { es: "Confían en nosotros", en: "Trusted by" },
  },
  banda: {
    etiqueta: { es: "Testimonios de alumnos", en: "Student testimonials" },
    pausar: { es: "Pausar los testimonios", en: "Pause the testimonials" },
    reanudar: { es: "Reanudar los testimonios", en: "Resume the testimonials" },
  },

  /**
   * ⚠️ DE ESTE BLOQUE SOLO QUEDAN EN PIE `aria` Y `foto`. El cierre dejó de
   * ser la isla navy de "Conviértete en Embajador" con el mini-curso al lado:
   * ahora es el formulario simple con la foto a sangre, y todo lo que dice
   * sale de `copy.informes`, que es lo que de verdad se pide ahí.
   *
   * `kicker`, `dudaTitulo` y `dudaTexto` se conservan sin usarse porque
   * describen una alternativa que puede volver: el día que el mini-curso
   * vuelva a ser la segunda salida del final, ya está escrito. Ver 09-Cierre.
   */
  cierre: {
    aria: { es: "Empezar", en: "Get started" },
    /* ⚠️ EL ALT DESCRIBE LA FOTO QUE HAY, NO LA QUE GUSTARÍA TENER. Si se
       cambia el archivo en 09-Cierre.astro, esta frase se cambia con él: un alt
       que no coincide con la imagen es peor que no tener alt. */
    foto: {
      es: "Una mujer escribiendo la semana en una agenda, junto a un teclado",
      en: "A woman writing her week into a planner, next to a keyboard",
    },
    /** Distintivo sobre el titular. Dice dónde está: es el final de la página. */
    kicker: { es: "Último paso", en: "Last step" },
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
    /**
     * ─── LA PUERTA DE QUIEN YA COMPRÓ ──────────────────────────────────
     *
     * Va junto al botón de pedir el precio en el temario, en el cierre y en
     * la barra flotante. Hasta ahora el acceso solo estaba en la cabecera, en
     * letra pequeña, y son dos personas distintas: una viene a decidir y la
     * otra viene a entrar. La segunda no tiene por qué buscar.
     *
     * Es un ENLACE y no un botón a propósito. La regla del proyecto es un
     * solo color de acción: si esto fuera un botón más, competiría con el
     * único que convierte, y quien ya compró no necesita que le griten.
     */
    yaCompraste: {
      es: "¿Ya compraste? Entra al portal",
      en: "Already bought? Go to the portal",
    },
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
    /**
     * Pista de las rejillas que despliegan el detalle al pasar el cursor.
     *
     * Vive en `ui` y no dentro de una sección porque la usan dos (el problema y
     * los resultados) y las va a usar cualquiera que adopte el patrón. Estaba
     * bajo `problema.doloresPista`, y reutilizar desde otra sección una clave
     * que se llama "dolores" es el tipo de acoplamiento que acaba en dos textos
     * distintos para el mismo mecanismo.
     *
     * Solo se pinta donde hay ratón: ver `[data-pista-hover]` en global.css.
     */
    pistaHover: {
      es: "Pasa el cursor por cada uno para ver el detalle",
      en: "Hover over any of them for the detail",
    },
    /**
     * Los dos rótulos del botón que despliega ese mismo detalle EN TÁCTIL.
     *
     * Son la contrapartida de `pistaHover`: uno existe donde hay cursor y el
     * otro donde hay dedo, nunca los dos a la vez. Ver `BotonDetalle.astro`.
     *
     * "Ver más" y no "Leer más": lo que se despliega son dos líneas, y "leer"
     * promete un artículo. La diferencia se nota cuando alguien decide si
     * merece la pena tocar.
     */
    verMas: { es: "Ver más", en: "Show more" },
    verMenos: { es: "Ver menos", en: "Show less" },
    copyright: {
      es: "© {anio} {razonSocial}. Todos los derechos reservados.",
      en: "© {anio} {razonSocial}. All rights reserved.",
    },
    /* ─── Rótulos del pie ──────────────────────────────────────────────────
       El pie era el logo, una frase y dos enlaces sueltos empujados al borde
       derecho: media página de gris vacío en medio. Ahora tiene columnas, y
       las columnas necesitan nombre. */
    pieNavegar: { es: "La página", en: "The page" },
    pieContacto: { es: "Hablar con nosotros", en: "Talk to us" },
    pieLegal: { es: "Legal", en: "Legal" },
    pieLlamar: { es: "Llamar", en: "Call" },
    pieRedes: { es: "Síguenos", en: "Follow us" },

    /* El rótulo de los perfiles que todavía no existen. Estaba escrito a mano
       dentro del pie, con su propio ternario de idioma. */
    proximamente: { es: "Próximamente", en: "Coming soon" },

    /* El enlace del mapa del sitio, en la franja de abajo del pie. */
    pieSitemap: { es: "Mapa del sitio", en: "Sitemap" },

    /* El botón de las tres rayas. Dos rótulos porque el botón hace dos cosas y
       tiene que decir cuál toca: quien lo escucha necesita saber si va a abrir
       o a cerrar. */
    abrirMenu: { es: "Abrir el menú", en: "Open the menu" },
    cerrarMenu: { es: "Cerrar el menú", en: "Close the menu" },

    placeholderAqui: { es: "Aquí va", en: "Goes here" },
    placeholderEnProduccion: {
      es: "Placeholder en producción",
      en: "Placeholder in production",
    },
    pendiente: { es: "Pendiente", en: "Pending" },
  },

  formulario: {
    /* ─── EL CÓDIGO DE DESCUENTO ──────────────────────────────────────────
       Va al FINAL del formulario, plegado tras un enlace, y eso no es timidez:
       un campo de cupón a la vista de todos le dice a quien no tiene ninguno
       que está pagando de más, y se va a buscarlo a Google en vez de dejar su
       correo. Quien tiene uno, lo busca; quien no, ni lo ve. */
    cuponEnlace: { es: "Tengo un código de descuento", en: "I have a discount code" },
    cuponEtiqueta: { es: "Código de descuento", en: "Discount code" },
    cuponPlaceholder: { es: "LAURA20", en: "LAURA20" },
    cuponAyuda: {
      es: "Lo comprobamos al llamarte. Si no es válido, te lo decimos entonces.",
      en: "We check it when we call you. If it isn't valid, we'll tell you then.",
    },
    nombreEtiqueta: { es: "Tu nombre", en: "Your name" },
    nombrePlaceholder: { es: "María", en: "Maria" },
    emailEtiqueta: { es: "Tu email", en: "Your email" },
    emailPlaceholder: { es: "maria@email.com", en: "maria@email.com" },

    /* Los de los formularios SIN rótulo encima. Ahí el marcador hace de
       nombre del campo, así que dice el campo y nada más: un ejemplo como
       "María" dentro de un recuadro sin rótulo parece un valor ya escrito.
       El <label> sigue existiendo en sr-only con el texto largo. */
    nombreCorto: { es: "Nombre", en: "Name" },
    emailCorto: { es: "Email", en: "Email" },
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
  /**
   * La franja de datos que cierra el hero.
   *
   * Los cuatro son HECHOS del producto, no adjetivos: diez videos, diez
   * quizzes, una certificación y acceso de por vida. Es la respuesta a "¿qué
   * me estás vendiendo exactamente?" en cuatro palabras, y va en el hero
   * porque esa pregunta aparece antes que cualquier otra.
   *
   * Aquí NO puede entrar ninguna cifra de alumnos, valoraciones ni resultados:
   * eso vive en `cifras`, va marcado como pendiente y solo sale cuando sea
   * verificable.
   */
  heroDatos: {
    /**
     * LOS CUATRO TIENEN QUE SER LA MISMA CLASE DE COSA.
     *
     * La primera versión mezclaba dos gramáticas: dos con cantidad ("10 videos
     * del curso", "10 quizzes de validación") y dos sin ella ("Certificación de
     * Embajador", "Acceso de por vida"). Leídos en fila se notaba muchísimo:
     * parecían dos datos y dos sobras, no una lista.
     *
     * Ahora los cuatro son la misma frase: algo que te llevas. `{n}` sale de
     * `curso.formato.videos`, así que si el curso pasa a tener doce videos esto
     * lo dice solo.
     */
    videos: { es: "{n} videos, en orden", en: "{n} videos, in order" },
    quizzes: { es: "Un quiz en cada video", en: "A quiz in every video" },
    certificacion: {
      es: "Certificación de Embajador",
      en: "Ambassador Certification",
    },
    acceso: { es: "Acceso de por vida", en: "Lifetime access" },
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
