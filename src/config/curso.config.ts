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
  /**
   * ⚠️ LAS QUE HABLAN DE PRECIO, PAGO O GARANTÍA NO SALEN EN LA PORTADA. La
   * página dejó de vender el curso —no hay cifra en ninguna sección— y una
   * pregunta sobre "pagar en partes" debajo de una página sin precio es una
   * pregunta que nadie se hizo. Se quedan escritas para el área de alumnos y
   * para el día que vuelva el precio.
   */
  soloCurso?: boolean;
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
  /**
   * ⚠️ LA MARCA CAMBIA DE NOMBRE CON EL IDIOMA, y por eso esto dejó de ser una
   * cadena. En inglés no es "Emprende180": es **Entrepreneur180**, con su
   * propio logotipo. La grafía sale del ARTE que pasó el cliente
   * (`logo-english.jpeg`), que es la autoridad sobre cómo se escribe una marca.
   *
   * ⚠️ ESTO NO ES LA RAZÓN SOCIAL. El nombre legal de quien responde vive en
   * `legal.config.ts` y NO se traduce: una sociedad se llama como está inscrita,
   * en el idioma que sea. Aquí solo está la marca comercial.
   *
   * Se usa en 26 sitios y casi todos ya resolvían idioma —van dentro de un
   * `construirTxt((l) => …)`— así que el cambio fue mecánico: `sitio.nombre`
   * pasa a `sitio.nombre[l]`.
   */
  nombre: { es: "Emprende180", en: "Entrepreneur180" } as Txt,
  claim: {
    es: "Tu giro de 180° empieza aquí",
    en: "Your 180° turn starts here",
  },
  url: "https://emprende180.vercel.app", // SWAP: dominio definitivo

  titulo: {
    /* Con punto medio y no con guion largo: la regla del sitio en español,
       y en un `<title>` el guion largo además se parte raro en la pestaña. */
    es: "Emprende180 · Conviértete en Embajador",
    en: "Entrepreneur180 · Become an Ambassador",
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
    en: "The Entrepreneur180 method for building something of your own from home: the 90 day plan, the Academy with its programs, and a CRM so you never lose track of anyone.",
  },

  ogImagen: "/imagenes/og/og.jpg",
  themeColor: "#0D2B4D",

  logoDisponible: true,
  logo: { src: "/identidad/logo.png", w: 320, h: 308 },
  logoBlanco: { src: "/identidad/logo-blanco.png", w: 320, h: 308 },
  logoHorizontal: { src: "/identidad/logo-horizontal.png", w: 573, h: 120 },
  logoHorizontalBlanco: { src: "/identidad/logo-horizontal-blanco.png", w: 573, h: 120 },

  /**
   * ─── EL LOCKUP INGLÉS ────────────────────────────────────────────────────
   *
   * Mismo arte, otra palabra. Es más ANCHO que el español (628 contra 573)
   * porque "ENTREPRENEUR" tiene cuatro letras más que "EMPRENDE": el alto es
   * el mismo, y como la cabecera fija el alto y deja el ancho en `auto`, entra
   * sin tocar nada. Los `w`/`h` tienen que ser los reales o el navegador
   * reserva el hueco equivocado y la barra da un salto al cargar.
   *
   * ⚠️ ESTÁ RECONSTRUIDO, NO EXPORTADO. El archivo que llegó era un JPEG
   * apaisado de 1280x720, sin transparencia y con el logotipo APILADO. La
   * cabecera necesita el horizontal y con alfa, así que se compuso: la
   * bombilla sale del lockup español —es el mismo dibujo en los dos idiomas y
   * ya venía limpia— y la palabra se recortó del arte inglés quitándole el
   * fondo blanco.
   *
   * Funciona y a tamaño de cabecera no se nota, pero pesa 22 KB contra los 5
   * del español porque arrastra el ruido del JPEG en los bordes. Con un
   * export vectorial del logotipo inglés bajaría a los mismos 5 KB y sería
   * nítido a cualquier tamaño. Merece pedirlo.
   */
  logoHorizontalEn: { src: "/identidad/logo-horizontal-en.png", w: 628, h: 120 },
  logoHorizontalBlancoEn: { src: "/identidad/logo-horizontal-blanco-en.png", w: 628, h: 120 },
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
    en: "Become an Entrepreneur180 Ambassador",
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
  /**
   * ⚠️ EL NOMBRE DEL CURSO NO SE TRADUCE, y es una decisión tomada, no un
   * olvido. Se llama "Fundamentos de Emprende180" en los dos idiomas.
   *
   * Sí, la MARCA cambia con el idioma (Entrepreneur180 en inglés) y aquí no.
   * No es una incoherencia: es la regla de siempre de este archivo —los
   * nombres de PRODUCTO no se traducen, porque traducirlos crea dos nombres
   * para una misma cosa— y el cliente la confirmó para este caso. Ver la nota
   * de `proximosCursos`, que dice lo mismo del curso 2.
   */
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
        en: "What Entrepreneur180 is, what being an Ambassador means, and how the whole ecosystem works. Who does what, and which part is yours.",
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
      en: "Understand the Entrepreneur180 ecosystem and the Ambassador role",
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
        en: "Entrepreneur180 Ambassador Certification once you pass all 10 quizzes",
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
      /* Sin "pago único ni mensualidades" desde el 16-09-2026: ver la nota de
         `informes`. El precio no se publica, así que esto no se pinta. */
      es: "Los impuestos dependen de tu país y se calculan al pagar, así que ves el total antes de confirmar.",
      en: "Taxes depend on your country and are calculated at checkout, so you see the total before confirming.",
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
          en: "From what Entrepreneur180 is through to your 90-Day Plan, in the order you need to watch them. Come back to any of them whenever you need to, and future updates are included at no extra cost.",
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
          en: "The Entrepreneur180 Ambassador certification",
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
    en: "Entrepreneur180 isn't an idea on paper: the ecosystem already runs with real businesses, and they're the ones who handle the opportunities you spot.",
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
    en: "Founder of Entrepreneur180",
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
    en: "I'm Pedro Lira and I founded Entrepreneur180. The ecosystem exists because the waste was always the same: people with a big, good network, standing in front of situations they could have solved, doing nothing because nobody had explained what to do or where their part ended. It isn't a lack of drive, it's a lack of method. I know because my other job is financing homes in Utah, and I see it there every week: someone with the opportunity right in front of them who doesn't know who to call, and someone else who does — which is why it reaches them instead. I teach the ten videos myself because I designed the Ambassador role, and I'd rather explain it first-hand than let everyone interpret it their own way.",
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
        en: "Founder of Entrepreneur180 and of the ecosystem every opportunity runs through",
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
      en: "How the Entrepreneur180 ecosystem works and which part is yours",
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
   * ⚠️ LAS CINCO FOTOS SON DE PEDRO, Y SE USAN LAS CINCO. Aquí decía que en
   * tres de ellas salía "una persona distinta" y por eso solo se publicaban
   * dos; el cliente lo desmintió el 16-09-2026 ("no has usado todas las
   * imágenes de Pedro") y pidió que se usaran. Los originales siguen en
   * /originales/instructor (113 MB en bruto); aquí viven las versiones de
   * 45-115 KB.
   *
   * Dónde va cada una, para no repetir la misma cara dos veces en una
   * pantalla:
   *
   *   pedro-retrato       la carta del about (retrato con la planta)
   *   instructor          la barra de hechos del about (estudio, gafas)
   *   instructor-cuadrado el avatar de autor del blog (about y recursos)
   *   pedro-oficina       la foto del blog en recursos (escritorio, ciudad)
   *   pedro-de-pie        el fondo de la Academia en la portada
   *   pedro-sentado       la duda que no está, en las preguntas frecuentes
   *   pedro-escritorio    la fila de la Academia en /programs
   */
  foto: "/imagenes/instructor/pedro-retrato.webp",
  fotoCuadrada: "/imagenes/instructor/instructor-cuadrado.webp",
  /** Horizontal, con su oficina detrás. Para los huecos anchos. */
  fotoOficina: "/imagenes/instructor/pedro-oficina.webp",
  /** Los demás retratos, cada uno con su `alt`: describen la escena, no solo el nombre. */
  retratos: {
    estudio: {
      src: "/imagenes/instructor/instructor.webp",
      ancho: 800,
      alto: 1000,
      alt: {
        es: "Pedro Lira, de traje y con gafas, en un retrato de estudio",
        en: "Pedro Lira in a suit and glasses, studio portrait",
      },
    },
    dePie: {
      src: "/imagenes/instructor/pedro-de-pie.webp",
      ancho: 1800,
      alto: 1200,
      alt: {
        es: "Pedro Lira de pie en su oficina, sonriendo con las manos juntas",
        en: "Pedro Lira standing in his office, smiling with his hands together",
      },
    },
    sentado: {
      src: "/imagenes/instructor/pedro-sentado.webp",
      ancho: 1800,
      alto: 1200,
      alt: {
        es: "Pedro Lira sentado en su oficina, escuchando con la mano en la barbilla",
        en: "Pedro Lira sitting in his office, listening with his hand on his chin",
      },
    },
    escritorio: {
      src: "/imagenes/instructor/pedro-escritorio.webp",
      ancho: 1500,
      alto: 1000,
      alt: {
        es: "Pedro Lira trabajando en su escritorio, frente al monitor",
        en: "Pedro Lira working at his desk, in front of the monitor",
      },
    },
  },
  fotoAlt: {
    es: "Retrato de Pedro Lira, fundador de Emprende180",
    en: "Portrait of Pedro Lira, founder of Entrepreneur180",
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
      en: "What Entrepreneur180 is",
    },
    logras: {
      es: "Entiendes qué es Emprende180, qué problema resuelve y qué lugar ocupas tú dentro. Es la base sobre la que se apoyan los nueve videos siguientes.",
      en: "You understand what Entrepreneur180 is, what problem it solves and where you fit into it. This is the base the other nine videos stand on.",
    },
  },
  {
    numero: 2,
    titulo: {
      es: "Qué es ser Embajador Emprende180",
      en: "What being an Entrepreneur180 Ambassador means",
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
      en: "How the Entrepreneur180 ecosystem works",
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
     de Pedro. Sigue existiendo en el tipo y en `TarjetaTestimonio`: es opcional,
     y cuando llegue un testimonio con un resultado de verdad —una cifra o un
     plazo que la persona haya dicho— basta con añadirle el campo y su tarjeta
     lo pinta. Lo que NO se hace es rellenarlo con algo que el alumno no dijo. */
  {
    nombre: "María González",
    contexto: { es: "Utah", en: "Utah" },
    cita: {
      es: "Emprende180 me ayudó a entender mejor cómo acercarme a las personas, crear relaciones y generar nuevas oportunidades. Aprendí estrategias que puedo aplicar todos los días. Lo recomiendo para quienes quieren crecer y aprender a prospectar de una manera más profesional.",
      en: "Entrepreneur180 helped me understand how to approach people, build relationships and create new opportunities. I learned strategies I can put to use every day. I recommend it to anyone who wants to grow and learn to prospect more professionally.",
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
      en: "What I liked most is that the training is practical and easy to follow. I learned how to organize my contacts, follow up, and get more out of my social media. I definitely recommend Entrepreneur180.",
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
      en: "It's been an excellent experience. I learned that prospecting isn't only about selling: it's about building trust and keeping a good relationship with people. Entrepreneur180 gave me tools I can now use with a lot more confidence.",
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
      en: "Entrepreneur180 changed the way I look at business opportunities. I learned how to communicate better, follow up, and stay present with my contacts. I really recommend the program to anyone who wants to grow professionally.",
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
      en: "Before, I had no idea how to start a conversation with a possible prospect without feeling like I was trying to sell them something. At Entrepreneur180 I learned to build connections in a way that's more natural and more professional. It's been really useful and I recommend it 100%.",
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
 * ⚠️ CUATRO PREGUNTAS, LAS QUE DICTÓ EL CLIENTE EL 16-09-2026. Había once
 * (qué es esto, experiencia en ventas, tiempo a la semana, comunidad, CRM,
 * atorarse, dejar el trabajo, cómo se gana dinero, ciudad, pagar en partes y
 * garantía); el cliente las sustituyó por estas cuatro y pidió que se
 * respondieran. La respuesta de la primera es suya, palabra por palabra; las
 * otras tres se escribieron sobre lo que el sitio ya afirma y nada más:
 *
 *   · tiempo     — los tres bloques del plan (60 · 45 · 15) y el reparto
 *                  final (35 · 70 · 15), de `copy.plan90.dia`;
 *   · inversión  — "sin inversión inicial", que es lo que dice el hero por
 *                  decisión del cliente (16-09-2026);
 *   · día 90     — los hitos del plan (día 78 escribes tus tareas, día 90
 *                  eliges qué sigue) y la comunidad, que no se acaba.
 *
 * Sin cifras de resultados ni de ingresos (regla 3). Sin guion largo en
 * español. Las once anteriores están en el historial de git.
 *
 * Se pintan las cuatro en la portada y en /resources; la primera va abierta.
 */
export const faqs: Faq[] = [
  {
    pregunta: {
      es: "¿Necesito experiencia previa?",
      en: "Do I need previous experience?",
    },
    respuesta: {
      es: "No. El programa empieza desde cero y te guía paso a paso para construir conversaciones reales sin técnicas de venta invasivas.",
      en: "No. The program starts from zero and guides you step by step to build real conversations, without pushy sales techniques.",
    },
  },
  {
    pregunta: {
      es: "¿Cuánto tiempo requiere al día?",
      en: "How much time does it take each day?",
    },
    respuesta: {
      es: "Dos horas. Al principio se reparten en sesenta minutos de prospección, cuarenta y cinco de seguimiento y quince para cerrar el día en el CRM. Hacia el final el reparto cambia: menos gente nueva y más seguimiento, porque ya hay algo que cuidar. La constancia vence a la intensidad: dos horas todos los días construyen más que ocho un sábado.",
      en: "Two hours. At the start they split into sixty minutes of prospecting, forty-five of follow-up and fifteen to close the day in the CRM. Towards the end the split changes: fewer new people and more follow-up, because by then there is something to look after. Consistency beats intensity: two hours every day build more than eight on a Saturday.",
    },
  },
  {
    pregunta: {
      es: "¿Hay inversión inicial?",
      en: "Is there an upfront investment?",
    },
    respuesta: {
      es: "No. Entras sin inversión inicial. Lo que pones es tiempo, dos horas al día durante noventa días, y la decisión de hacerlo con método. El plan, el CRM y el acompañamiento del equipo van con el programa.",
      en: "No. There is no upfront investment. What you put in is time, two hours a day for ninety days, and the decision to do it with method. The plan, the CRM and the team's support come with the program.",
    },
  },
  {
    pregunta: {
      es: "¿Qué ocurre después del Día 90?",
      en: "What happens after Day 90?",
    },
    respuesta: {
      es: "El Día 90 no es un final. Desde el Día 78 ya escribes tus propias tareas, y el Día 90 miras tus números y decides qué sigue. Lo que construiste se queda contigo: tu base de contactos organizada, tu sistema de seguimiento y tus fuentes de referidos. Y la comunidad sigue ahí, con la llamada de equipo cada semana.",
      en: "Day 90 is not an ending. From Day 78 you are already writing your own tasks, and on Day 90 you look at your numbers and decide what comes next. What you built stays with you: your organized contact base, your follow-up system and your referral sources. And the community is still there, with the team call every week.",
    },
  },
];

// ─── Contacto ────────────────────────────────────────────────────────────────

export const contacto = {
  /* ⚠️ contact@ Y NO hola@. Lo fijó el cliente el 15-09-2026. Es el que se
     enseña en las preguntas frecuentes, el del pie, el del schema y el de
     respuesta de los correos de acceso: cambia aquí y cambia en todos. */
  email: "contact@emprende180.com",
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
    en: "Hi, I have a question about the Entrepreneur180 course",
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
  /**
   * La dirección física. La dio el cliente el 15-09-2026. Se pinta en el pie
   * y en el bloque "Visítanos" del about; el enlace del mapa se construye
   * con la búsqueda de Google Maps, que no necesita clave ni coordenadas y
   * abre la app nativa en el teléfono.
   */
  direccion: {
    calle: "1515 East Fort Union Blvd",
    ciudad: "Cottonwood Heights, UT 84121",
    pais: { es: "EE. UU.", en: "USA" },
  },
  mapaUrl:
    "https://www.google.com/maps/search/?api=1&query=1515+East+Fort+Union+Blvd%2C+Cottonwood+Heights%2C+UT+84121",
} as const;

/**
 * Las CINCO redes de la marca, siempre en este orden y siempre visibles en el
 * pie. Sin url se muestran pero no enlazan: nunca publicamos un perfil que no
 * existe ni apuntamos a la portada de la red.
 */
export const redesMarca = [
  /* Las dos que existen, dadas por el cliente el 16-09-2026. Las demás siguen
     vacías y no se pintan hasta que haya perfil. */
  { key: "facebook", label: "Facebook", url: "https://www.facebook.com/Emprende180s" },
  { key: "instagram", label: "Instagram", url: "https://www.instagram.com/emprende180academy/" },
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
    /* ⚠️ A LA PÁGINA, Y YA NO AL ANCLA "#como-trabajar" DE LA PORTADA. Desde
       el 14-09-2026 /programs cuenta las tres piezas enteras; la sección de
       la portada las resume y sigue existiendo, pero el menú lleva a la
       versión completa. */
    { texto: { es: "Programas", en: "Programs" }, href: "/programs" },
    /* ⚠️ LAS RUTAS VAN EN INGLÉS: /programs, /resources, /about, /blog. El
       idioma del contenido lo pone `?lang=`; el path es uno solo y es el
       inglés. Las viejas /programas y /recursos redirigen en astro.config. */
    { texto: { es: "Recursos", en: "Resources" }, href: "/resources" },
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
      en: "Every video closes with its validation quiz. Pass all {n} and we issue your Entrepreneur180 Ambassador Certification.",
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
    /* "La comunidad de Embajadores" desde el 16-09-2026 (antes "No serías la
       primera"): los testimonios son la comunidad hablando, y el cliente pidió
       que se la nombrara. */
    kicker: { es: "La comunidad de Embajadores", en: "The Ambassador community" },
    /* ⚠️ DECÍA "MUJERES COMO TÚ" Y ERA FALSO. De los seis testimonios que hay,
       tres son de hombres: José, Carlos y Miguel. Un titular que solo nombra a
       las mujeres encima de una rejilla donde sale medio pueblo no es un matiz
       de tono, es una frase que el propio contenido desmiente.

       "Gente" los cubre a los dos sin tener que decir "mujeres y hombres",
       que es la solución que suena a formulario. */
    titulo: [
      { es: "Gente como tú,", en: "People like you," },
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
       * ⚠️ AQUÍ IBA EL VÍDEO PROMOCIONAL COMO PRIMERA PANTALLA, y se quitó el
       * 15-09-2026 a petición del cliente. Era la única pantalla con sonido y
       * la única sin texto nuestro encima. El archivo (/video/prom.mp4, con
       * su póster) sigue en /public/video por si vuelve; el botón de sonido y
       * la lógica de `subtitulos` del slider siguen escritos y se encienden
       * solos si algún día una pantalla vuelve a declarar `sonido: true`.
       *
       * El slider pasa a tres pantallas, cada una con su propio vídeo de
       * fondo: el díptico, la del dolor y el manifiesto.
       */

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
       * ⚠️ LOS DOS TITULARES SE PINTAN IGUAL, Y ESTO ESTUVO AL REVÉS. Hubo una
       * `voz` por lado —una en caja baja con peso medio y remate en Fraunces,
       * otra apretada en extrabold— y se quitó después de verla montada: dos
       * sistemas tipográficos en la misma pantalla no se leían como dos
       * públicos, se leían como dos plantillas distintas pegadas por la mitad.
       *
       * Lo único que sigue siendo distinto es el LADO: cada texto se pega al
       * borde de fuera de su mitad, que es donde el velo es opaco y donde no
       * está la cara. Eso es composición, no tipografía. Ver `HeroDiptico`.
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
            /* Pexels 30539348, recortada a 1400x1800 y VOLTEADA en horizontal
               para que ella quede en la mitad interior: sin voltearla, su cara
               caía en el borde donde el velo es opaco y se la comía. El lado
               que queda libre —pared y flores— es donde cae el texto.
               Sin `encuadre`: la foto ya viene cortada a la vertical que pide
               el díptico. */
            foto: "/imagenes/hero/banco-casa-oficina.webp",
            /* ⚠️ EL `encuadre` ES PARA EL MÓVIL, no para el escritorio. En
               pantalla grande la mitad mide 720x900 y la foto 1400x1800: casi
               la misma proporción, así que se recorta poquísimo y este número
               apenas se nota. En un teléfono la foto se queda en una franja de
               ~145 px de alto y el recorte se come el 70 % del alto, así que
               SIN esto se ven cuerpos sin cabeza. El número es la altura a la
               que está la cara en el archivo. */
            encuadre: "center 65%",
            alt: {
              es: "Una mujer trabajando con su portátil en la mesa de su casa",
              en: "A woman working on her laptop at her dining table at home",
            },
            /**
             * ⚠️ DOS RENGLONES, UNA FRASE CADA UNO, Y EL CORTE NO ES LIBRE.
             * Antes eran tres —un antetítulo pequeño y dos líneas grandes— y
             * en pantallas medias el antetítulo se partía, así que se veían
             * cuatro. Ahora son dos y el corte cae donde cae el punto.
             *
             * ⚠️ Y LA LONGITUD DE ESTAS DOS FRASES ES LO QUE DECIDE EL TAMAÑO
             * DE LETRA, no al revés. Cada titular vive en MEDIA pantalla: el
             * renglón largo (36 caracteres) solo cabe entero a 32 px en un
             * monitor de 1440, a 43 en uno de 1920 y a 59 en uno de 2560. Si
             * alguien alarga una de estas frases, el titular no se parte: se
             * encoge. Y si la acorta, crece. Está medido en `HeroDiptico`.
             */
            titulo: [
              [
                {
                  es: "Tu casa ya es tu oficina.",
                  en: "Your home is already your office.",
                },
              ],
              [
                { es: "Que también sea", en: "Make it your" },
                {
                  es: "tu punto de partida.",
                  en: "starting line too.",
                  acento: true,
                },
              ],
            ],
          },
          {
            lado: "el",
            /* Pexels 5917337. Su cara está a un tercio de altura, muy por
               encima de la banda donde cae el texto, así que no hace falta ni
               voltearla. */
            foto: "/imagenes/hero/banco-llamada.webp",
            /* Su cara está a media altura del archivo. Ver la nota de arriba. */
            encuadre: "center 50%",
            alt: {
              es: "Un hombre gesticulando mientras habla por teléfono en la calle",
              en: "A man gesturing while talking on the phone in the street",
            },
            /* Los dos renglones de él son de 29 caracteres, más cortos que el
               largo de ella. Como los dos titulares comparten tamaño, manda el
               largo de ella: es el que fija el cuerpo de letra de los dos. */
            titulo: [
              [
                {
                  es: "Si sabes hablar con la gente,",
                  en: "If you know how to talk to people,",
                },
              ],
              [
                { es: "ya tienes", en: "you already have" },
                {
                  es: "lo que se necesita.",
                  en: "what it takes.",
                  acento: true,
                },
              ],
            ],
          },
        ],

        /**
         * ⚠️ EL FONDO ES UN VÍDEO Y LAS DOS FOTOS DEJARON DE VERSE. Siguen
         * escritas arriba a propósito: son la RED. Si algún día falta el mp4,
         * esta imagen vuelve al díptico de fotos en vez de quedarse en negro.
         */
        video: "/video/hero-1.mp4",
        poster: "/video/hero-1-poster.webp",
        /* Medido sobre el fotograma: ella está en el tercio derecho, con la
           cara sobre el 67 % del ancho. Centrado se quedaba con el sofá vacío
           de la izquierda y la cortaba por el borde. */
        encuadreVertical: "67% 50%",
        videoAlt: {
          es: "Una mujer trabajando de noche en el sofá de su casa, con el portátil",
          en: "A woman working at night on her sofa at home, with her laptop",
        },

        /**
         * ⚠️ ESTA PANTALLA HA PASADO POR LAS TRES COMPOSICIONES, y el recorrido
         * merece quedar escrito para que nadie lo repita:
         *
         *   1. "lados" con las dos fotos. Cada titular sobre su mitad, que era
         *      el díptico original.
         *   2. "lados" sobre vídeo. Sin fotos no hay mitades, así que los dos
         *      titulares se sacaron a una capa propia, al 80 % del ancho y
         *      escalonados —uno pegado a la izquierda, el otro abajo a la
         *      derecha— porque dos bloques tan anchos no caben a la misma
         *      altura. Ahí el titular llegaba a 43 px.
         *   3. Esto: "centro" dentro del bloque de la DERECHA, igual que la
         *      pantalla siguiente.
         *
         * ⚠️ EL PRECIO DEL PASO 3 SON UNOS 8 PX DE TITULAR, y se paga a
         * cambio de dos cosas: los dos titulares vuelven a estar a la misma
         * altura —se leen como una pareja y no como una escalera— y las dos
         * pantallas de texto del slider comparten por fin una sola
         * composición. Antes cada una tenía la suya y el salto se notaba al
         * rotar.
         *
         * El código del paso 2 sigue ahí (`ladosSinFoto` en `HeroDiptico`):
         * no se borra porque esta decisión ya se ha dado la vuelta dos veces.
         *
         * ⚠️ Y DESDE EL 15-09-2026 EL BLOQUE VA ARRIBA A LA IZQUIERDA, alineado
         * al borde. Con el promocional fuera del slider esta pasó a ser la
         * primera pantalla, y el cliente la quiso así. Encaja con el vídeo: la
         * persona está en el tercio derecho, y el texto cae donde no hay nadie.
         */
        composicion: "centro",
        bloque: "izquierda",

        /**
         * ─── EL TEXTO ENTERO LO DICTÓ EL CLIENTE EL 16-09-2026 ─────────────
         *
         * "Cambia todo el texto por esto": un titular en dos renglones, un
         * párrafo, el botón y una línea debajo del botón. Con eso la primera
         * pantalla deja de ser un díptico de dos ganchos y pasa a ser un hero
         * clásico; los dos titulares de los paneles de arriba ya no se
         * pintan (`titular` manda), pero sus fotos siguen siendo la red del
         * vídeo.
         *
         * "Tu Giro de 180°" va como renglón de apoyo, en Montserrat, y
         * "Empieza Aquí" grande y en Fraunces: el cliente pidió "diferentes
         * tipografías", y es el mismo gesto de remate de todo el sitio.
         *
         * ⚠️ "SIN INVERSIÓN INICIAL" ES UNA AFIRMACIÓN QUE HAY QUE PODER
         * SOSTENER. El resto del sitio habla de "un solo pago" y de "pagar en
         * partes" (`informes.hechos`, la FAQ del curso). Si el programa de
         * Embajadores tiene coste de entrada, esta línea es falsa y hay que
         * quitarla o matizarla ("sin inventario", "sin cuota mensual"…). Va
         * tal cual se dictó; se le avisó al cliente.
         *
         * "Negocio propio" y "acompañamiento real" describen la oportunidad,
         * no un resultado: siguen del lado seguro de la regla 3.
         */
        titular: [
          [{ es: "Tu Giro de 180°", en: "Your 180° Turn" }],
          [{ es: "Empieza Aquí", en: "Starts Here", acento: true }],
        ],
        subtitulo: {
          es: "Un programa de 90 días para construir un negocio propio con método, constancia y acompañamiento real.",
          en: "A 90-day program to build a business of your own, with method, consistency and real support.",
        },
        cta: {
          texto: { es: "Comenzar el Día 1", en: "Start Day 1" },
          href: "#empezar",
        },
        nota: {
          es: "Solo 2 horas al día. Sin inversión inicial.",
          en: "Just 2 hours a day. No upfront investment.",
        },
      },
      /**
       * ─── 2 · EL DOLOR, O MÁS BIEN LA FRUSTRACIÓN ────────────────────────
       *
       * Segundo díptico, mismo mecanismo que el primero y a propósito: quien
       * se reconoció en la primera pantalla vuelve a encontrar su lado en el
       * mismo sitio. Lo que cambia es a qué le habla.
       *
       * ⚠️ ESTA IMAGEN NOMBRA LA FRUSTRACIÓN, NO VENDE LA SOLUCIÓN. Es su
       * único trabajo, y por eso ninguna de las dos frases dice lo que
       * ofrecemos: dicen lo que la persona YA TIENE y no ha podido usar. La
       * solución llega después; si se adelanta aquí, la frase deja de sonar a
       * "esto me pasa a mí" y pasa a sonar a anuncio.
       *
       *   ella — "tienes tiempo, contactos y ganas": las tres cosas que sí
       *          tiene, y que nadie le ha dicho que valgan nada.
       *   él   — "conoces a medio pueblo": lo mismo, dicho como se dice en un
       *          pueblo. La pregunta del final es el giro entero.
       *
       * ⚠️ EL PRIMER RENGLÓN DE ELLA SE COMPRIMIÓ, y conviene saberlo por si
       * alguien lo quiere devolver. El cliente lo escribió como "tienes
       * tiempo, tienes contactos, tienes ganas", con la repetición, y son 46
       * caracteres: no caben en el renglón de apoyo de media pantalla a
       * ningún cuerpo legible (el techo son 45). Con la repetición el renglón
       * se parte en dos y el titular pasa de dos líneas a tres. Se conservan
       * las tres cosas y se pierde la anáfora.
       *
       * ⚠️ Y LA RAYA DEL ORIGINAL NO ESTÁ. El cliente separaba las dos mitades
       * con un guión largo; DESIGN.md lo prohíbe en texto de cara al usuario y
       * manda usar coma, dos puntos o punto. Aquí el corte de renglón hace ese
       * trabajo mejor que cualquier signo.
       */
      {
        tipo: "diptico",
        paneles: [
          {
            lado: "ella-2",
            /* Pexels 6612273, recortada por arriba para subirle la cara por
               encima de la banda donde cae el texto. */
            foto: "/imagenes/hero/banco-tiempo.webp",
            /* Cara alta en el archivo, al 35 %. Ver la nota de la primera. */
            encuadre: "center 35%",
            alt: {
              es: "Una mujer hablando por teléfono sentada junto a la ventana de su casa",
              en: "A woman on the phone sitting by the window at home",
            },
            titulo: [
              [
                {
                  es: "Tienes tiempo, contactos y aspiración.",
                  en: "You have time, contacts and drive.",
                },
              ],
              [
                { es: "Lo que no tenías era", en: "What you didn't have was" },
                { es: "la oportunidad.", en: "the chance.", acento: true },
              ],
            ],
          },
          {
            lado: "el-2",
            /* Pexels 35085731. Es la más oscura de las cuatro y la única sin
               retoque de luz: dos hombres hablando en la calle, sin pose. Las
               dos caras están en el tercio de arriba, lejos del texto. */
            foto: "/imagenes/hero/banco-charla.webp",
            /* Las dos caras están muy arriba, al 27 %. Sin esto, en el móvil
               esta mitad enseña dos torsos y ninguna cara. */
            encuadre: "center 27%",
            alt: {
              es: "Dos hombres conversando sentados a una mesa en la calle",
              en: "Two men talking at a table out in the street",
            },
            titulo: [
              [
                {
                  es: "Conoces a media ciudad.",
                  en: "You know half the town.",
                },
              ],
              [
                /* ⚠️ EL RENGLÓN MÁS LARGO DE LAS CUATRO SON ESTOS DOS TROZOS
                   JUNTOS: "¿Y si esas conversaciones también pagaran?", 42
                   caracteres. Ese número —y no otro— es el que fija el cuerpo de
                   los DOS titulares de esta pantalla, porque comparten escala.
                   Era de 36 y al alargarse obligó a ensanchar la columna del
                   texto. Ver la escala `ancho` en `HeroTitular.astro`. */
                { es: "¿Y si esas conversaciones", en: "What if those talks" },
                { es: "también pagaran?", en: "paid you too?", acento: true },
              ],
            ],
          },
        ],

        /**
         * ⚠️ EL FONDO ES UN VÍDEO Y LAS DOS FOTOS DEJARON DE VERSE. Siguen
         * escritas arriba a propósito: son la RED. Si algún día falta el mp4,
         * esta imagen vuelve al díptico de fotos en vez de quedarse en negro.
         *
         * Y con el vídeo se fue el díptico, que era la pareja titular-foto.
         * Por eso esta pantalla pasa a `composicion: "centro"` aunque no lo
         * pidiera antes: con un fondo único, dos titulares pegados a los
         * bordes ya no emparejan con nada, solo se separan.
         */
        video: "/video/hero-2.mp4",
        poster: "/video/hero-2-poster.webp",
        /* Aquí hay DOS personas, en el 31 % y en el 84 %, y en vertical no
           caben las dos: se ve poco más de un tercio del fotograma. El 55 %
           es el punto que salva al de la derecha entero y deja el grupo del
           medio de fondo, que es lo que sostiene la escena. */
        encuadreVertical: "55% 50%",
        videoAlt: {
          es: "Dos hombres conversando de pie en un encuentro con más gente alrededor",
          en: "Two men talking at an event with other people around",
        },

        /**
         * ⚠️ LOS DOS TITULARES NO VAN SOBRE SU FOTO: van apilados en el
         * centro. Es lo que distingue esta pantalla de la primera y no es
         * decoración.
         *
         * En la primera, cada frase le habla a una persona DISTINTA, así que
         * tiene que estar al lado de la suya: ahí la pareja titular-foto ES el
         * mecanismo. Aquí las dos dicen lo MISMO en dos voces —la misma
         * frustración contada por ella y por él— así que se pueden leer
         * seguidas, y al salir de media pantalla caben bastante más grandes.
         *
         * Ver `composicion` en `HeroDiptico.astro`.
         */
        composicion: "centro",
        /**
         * ⚠️ Y APOYADO A LA DERECHA. El texto sigue centrado dentro de su
         * caja; lo que se mueve es la caja, que arranca al 20 % del ancho.
         *
         * ⚠️ Y ESO CUESTA TAMAÑO DE TITULAR, que conviene saberlo antes de
         * pedir las dos cosas a la vez: la caja pierde un 20 % de ancho y el
         * renglón largo, que no se parte solo, obliga a bajar el cuerpo de 49
         * a 44 px a 1440. Ver la nota de `bloque` en `HeroDiptico.astro`.
         */
        bloque: "derecha",

        /**
         * ⚠️ EL TEXTO DE ESTA PANTALLA LO DICTÓ EL CLIENTE EL 16-09-2026, en la
         * misma anatomía que la primera (titular en dos renglones, párrafo) y
         * SIN BOTÓN ni nota: arriba a la derecha, al mismo tamaño que la
         * primera. Le habla a quien lleva una casa: el negocio entra "al ritmo
         * de tu casa", no al revés. Los dos ganchos de los paneles ("Tienes
         * tiempo, contactos y aspiración" / "Conoces a media ciudad") se
         * quedan escritos arriba como red del vídeo, pero con `titular` puesto
         * no se pintan.
         *
         * "Fuente de ingresos propia" describe la oportunidad, sin cifra ni
         * plazo: sigue del lado seguro de la regla 3. El inglés no es calco:
         * "chores" es lo que se dice para "tareas" de la casa, y "the pace of
         * your home" conserva la idea de que el ritmo lo pone la casa.
         */
        titular: [
          [{ es: "Tu Familia Primero", en: "Your Family First" }],
          [{ es: "Tu Negocio También", en: "Your Business Too", acento: true }],
        ],
        subtitulo: {
          es: "Construye tu fuente de ingresos propia al ritmo de tu casa: entre desayunos, tareas y todo lo que haces todos los días.",
          en: "Build your own source of income at the pace of your home: between breakfasts, chores and everything you already do every day.",
        },

        /* ⚠️ SIN `cta`, Y QUE FALTE NO ES UN DESCUIDO. Solo la primera imagen
           pide algo; esta y la siguiente cuentan y dejan seguir bajando. Tres
           botones en tres pantallas que rotan solas son la misma decisión
           repetida cada seis segundos, y la que importa es la primera. */
      },
      /**
       * ─── 3 · QUÉ SIGNIFICA SER EMBAJADOR ────────────────────────────────
       *
       * La tercera plantilla del slider, y la única que no va de una persona
       * sino de una IDENTIDAD. Se reconoce por `manifiesto`, igual que los
       * dípticos se reconocen por `paneles`.
       *
       * ⚠️ LAS TRES PALABRAS NO SON UNA LISTA DE TAREAS, y es lo que más fácil
       * se pierde al reescribirlas. No dicen lo que un Embajador HACE: dicen
       * lo que un Embajador ES. El método ya se cuenta más abajo, con su
       * sección entera; aquí lo que se juega es si la persona se quiere llamar
       * así. Si alguien las convierte en "paso 1, paso 2, paso 3", esta
       * pantalla deja de tener motivo para existir.
       *
       * ⚠️ Y CADA UNA LLEVA UNA FRASE, NO UN PÁRRAFO. Si necesita dos
       * renglones largos para entenderse, es que la palabra está mal elegida.
       *
       * ⚠️ SIN BOTÓN. Ver la nota de la imagen anterior.
       *
       * ⚠️ LA FOTO ES DE BANCO, como las cuatro del díptico. Esta es la única
       * horizontal de las cinco porque ocupa la pantalla entera y no media.
       * Ver el README de /public/imagenes/hero.
       */
      {
        tipo: "manifiesto",
        /* Pexels 7642037, bajada de luz y de saturación. Enseña el RESULTADO
           —una familia con las llaves de su casa— y no al Embajador, que es
           deliberado: el manifiesto ya dice quién eres, y la foto dice para
           qué. Las caras están en el tercio de arriba, lejos del texto. */
        /* ⚠️ EL FONDO ES UN VÍDEO. La foto de las llaves se queda escrita como
           RED: si falta el mp4, esta pantalla vuelve a ella en vez de quedarse
           en negro. */
        video: "/video/hero-3.mp4",
        poster: "/video/hero-3-poster.webp",
        /* El corro: la mujer rubia en el 27 % y el hombre sentado en el 62 %.
           El 45 % es lo que mete a los dos dentro de la ventana. */
        encuadreVertical: "45% 50%",
        videoAlt: {
          es: "Un grupo de personas escuchando a alguien en una reunión",
          en: "A group of people listening to someone at a meeting",
        },
        foto: "/imagenes/hero/banco-llaves.webp",
        alt: {
          es: "Una familia en el salón de su casa nueva, sosteniendo las llaves",
          en: "A family in the living room of their new home, holding the keys",
        },

        /**
         * ⚠️ ESTE TEXTO ESTÁ COMPLETO Y ES DEL CLIENTE. Aquí hubo un
         * `[COMPLETAR: …]` esperando un remate que nunca hizo falta: la frase
         * ES el manifiesto entero, no su arranque.
         *
         * Lo único que se ha decidido aquí es el CORTE: dónde parte el
         * renglón y qué mitad lleva el remate en Fraunces itálica. Eso es
         * tipografía, no redacción, y por eso no lleva marca de pendiente.
         */
        /**
         * ⚠️ EL TEXTO LO DICTÓ EL CLIENTE EL 16-09-2026, y cambia la
         * naturaleza de la pantalla: ya no es la definición de "Embajador"
         * ("Ser Embajador de Emprende180 significa trabajo, dedicación,
         * autonomía y responsabilidad") sino un titular en dos renglones
         * como los de las otras dos pantallas, un párrafo y, debajo, "Lo que
         * nos define" en cinco claves con icono. El manifiesto anterior queda
         * en el historial (commit anterior a esta nota).
         *
         * Titular y párrafo dictados por el cliente el 16-09-2026 (segunda
         * versión del día: la primera repetía el de la pantalla 2 y la cambió
         * por esta). Habla de lo que más frena a quien empieza —no saber qué
         * decir— y contesta con el plan: misiones exactas para cada día. "Plan
         * de 90 días" es el nombre del plan del cliente, con mayúsculas suyas.
         */
        manifiesto: [
          [{ es: "Sin improvisar:", en: "No improvising:" }],
          [{ es: "Te damos un plan diario.", en: "We give you a daily plan.", acento: true }],
        ],
        cuerpo: {
          es: "¿No sabes qué publicar ni qué decir? Nuestro Plan de 90 días te da las misiones exactas para cada día.",
          en: "Not sure what to post or what to say? Our 90-Day Plan gives you the exact missions for each day.",
        },

        /**
         * "Lo que nos define": cinco palabras, cinco iconos, una frase cada
         * una, dictadas por el cliente. Los iconos salen de la tabla cerrada
         * de `Icono.astro`:
         *
         *   enfoque        diana       — un mensaje, una persona, un resultado
         *   acción         reloj       — dos horas diarias
         *   comunidad      personas    — la red de embajadores
         *   crecimiento    flecha      — un paso más en cada fase
         *   transformación actualizar  — el giro: quien empieza y quien acaba
         *
         * ⚠️ NINGUNA HABLA DE DINERO (regla 3). "Algo real" y "fuente de
         * ingresos propia" describen la oportunidad, no una cifra.
         */
        clavesTitulo: { es: "Lo que nos define", en: "What defines us" },
        claves: [
          {
            icono: "diana",
            palabra: { es: "Enfoque", en: "Focus" },
            frase: {
              es: "Sin distracciones. Un mensaje, una persona, un resultado a la vez.",
              en: "No distractions. One message, one person, one result at a time.",
            },
          },
          {
            icono: "reloj",
            palabra: { es: "Acción", en: "Action" },
            frase: {
              es: "La constancia vence a la intensidad. Dos horas diarias construyen algo real.",
              en: "Consistency beats intensity. Two hours a day build something real.",
            },
          },
          {
            icono: "personas",
            palabra: { es: "Comunidad", en: "Community" },
            frase: {
              es: "No trabajas solo. Tienes una red activa de embajadores en cada fase.",
              en: "You don't work alone. You have an active network of ambassadors at every phase.",
            },
          },
          {
            icono: "flecha",
            palabra: { es: "Crecimiento", en: "Growth" },
            frase: {
              es: "Cada fase te acerca un paso más a dejar de improvisar.",
              en: "Every phase takes you one step closer to leaving improvisation behind.",
            },
          },
          {
            icono: "actualizar",
            palabra: { es: "Transformación", en: "Transformation" },
            frase: {
              es: "El Día 90 eres una versión diferente de quien empezó el Día 1.",
              en: "On Day 90 you are a different version of the person who started on Day 1.",
            },
          },
        ],
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
    /* El botón de sonido del vídeo de presentación. Dice lo que VA A PASAR al
       pulsarlo, no el estado en el que está: "activar el sonido" y no "está
       mudo". Es la diferencia entre un botón y un cartel. */
    activarSonido: { es: "Activar el sonido", en: "Turn the sound on" },
    silenciarSonido: { es: "Silenciar", en: "Mute" },

    pausar: { es: "Pausar la presentación", en: "Pause the slideshow" },
    reanudar: { es: "Reanudar la presentación", en: "Resume the slideshow" },
    irASlide: { es: "Ver la imagen {n}", en: "Show image {n}" },
  },

  /**
   * ─── IDENTIDAD · "SER EMBAJADOR ES ESTO" ─────────────────────────────────
   *
   * Va justo detrás del hero y antes de que se explique nada. Y ese sitio es
   * la mitad de su trabajo: nombra al ARQUETIPO antes de que empiece la venta.
   *
   * ⚠️ AQUÍ NO SE EXPLICA EL MÉTODO, y es la regla que más fácil se rompe. Lo
   * único que hace esta sección es que alguien se reconozca: "esa persona a la
   * que todos le preguntan cosas". Si se le mete un beneficio, un paso o una
   * cifra, deja de ser un espejo y pasa a ser un argumento, y el argumento ya
   * viene en la sección siguiente.
   *
   * ⚠️ Y NO DISTINGUE ENTRE ELLA Y ÉL. Los dos dípticos del hero sí lo hacen
   * —cada mitad le habla a uno— y por eso esta NO puede: el trabajo de esta es
   * juntarlos otra vez en la misma descripción. De ahí "todos tienen alguien
   * así": vale igual para la que trabaja desde casa y para el que conoce a
   * medio pueblo.
   *
   * Las dos fotos dicen lo mismo sin decirlo: una mujer y un hombre, los dos
   * al teléfono, los dos en la calle. Es el mismo par del hero, en foto fija.
   */
  identidad: {
    aria: { es: "Qué es ser Embajador", en: "What being an Ambassador is" },

    /* ⚠️ SIN RENGLÓN DE ENTRADA desde el 15-09-2026: el cliente reemplazó
       todo el texto de la sección por el titular y un párrafo, y un kicker
       encima de "El programa Emprende180" repetiría lo que ya dice el título.
       Se deja vacío en vez de borrarse para que la sección no tenga que
       cambiar de forma si algún día vuelve. */
    kicker: { es: "", en: "" },

    /* ⚠️ EL TITULAR VA EN MONTSERRAT Y LA SEGUNDA LÍNEA EN FRAUNCES ITÁLICA,
       no al revés. La primera describe a un tercero —"todos tienen alguien
       así"— y la segunda te señala a ti. El cambio de tipografía ES ese giro:
       si las dos fueran iguales, la frase se leería como una sola idea. */
    /* ⚠️ EL TEXTO LO DICTÓ EL CLIENTE el 15-09-2026 y sustituye al de
       identidad ("Todos tienen alguien así / Tú eres esa persona"). El título
       "El programa Emprende180" se parte en dos renglones para conservar el
       gesto de la sección: Montserrat arriba y el remate en Fraunces, que
       aquí es el nombre.

       El guion largo que traía el texto ("…trabajan para ti — todo sin dejar
       de vivir tu vida") pasa a punto y seguido: es la regla de todo el sitio
       en español. El inglés no es traducción literal. */
    titulo: { es: "El programa", en: "The program" },
    subtitulo: { es: "Emprende180.", en: "Entrepreneur180." },

    cuerpo: [
      {
        es: "Emprende180 es un plan estructurado de prospección diaria para embajadores. En 90 días construyes una base de contactos organizada, un sistema de seguimiento que funciona solo y fuentes de referidos que trabajan para ti. Todo sin dejar de vivir tu vida.",
        en: "Entrepreneur180 is a structured daily prospecting plan for ambassadors. In 90 days you build an organized contact base, a follow-up system that runs on its own, and referral sources that work for you. All without putting your life on hold.",
      },
      /* ─── LA COMUNIDAD ───────────────────────────────────────────────────
         Pedido por el cliente el 16-09-2026: "más uso de comunidad" en los
         puntos estratégicos. Este párrafo sale aquí y en el método de
         /programs (leen el mismo texto). Lo que afirma es lo confirmado: el
         mismo método para todos, la llamada de equipo semanal
         (`plan90.acompanamiento`) y alguien que contesta. Y la segunda idea que
         pidió: quien ya tiene una comunidad, aquí aprende a activarla. Sin
         cifras de miembros, que no las tenemos. */
      {
        es: "Y no lo haces solo. Entras en una comunidad de Embajadores que trabaja con el mismo método, con una llamada de equipo cada semana y alguien que contesta. Si ya tienes una comunidad, aquí aprendes a activarla.",
        en: "And you are not on your own. You join a community of Ambassadors working with the same method, with a team call every week and someone who answers. If you already have a community, this is where you learn to activate it.",
      },
    ],

    /**
     * ─── LOS CUATRO DATOS DEL PROGRAMA ──────────────────────────────────
     *
     * Los pidió el cliente el 15-09-2026, debajo del párrafo. Los tres primeros
     * salen del documento del plan de 90 días, tal cual están en `plan90`: 90
     * días, 2 horas al día (60 de prospección + 45 de seguimiento + 15 de CRM)
     * y cuatro fases (Fundación, Sistematización, Red y base viva,
     * Consolidación).
     *
     * ⚠️ EL CUARTO NO LLEVA NÚMERO, Y ES A PROPÓSITO. El documento fija una
     * meta de 450 contactos, y la regla del propio `plan90` —que sale de la
     * regla 5 del documento del cliente— es que las metas de actividad NO se
     * publican: en una página de venta, cualquier número junto a "contactos"
     * se lee como una promesa. Lo que sí es verdad por diseño es que TODOS los
     * contactos viven organizados en el CRM ("si no está en el CRM, no
     * existió"), y eso es lo que dice la casilla.
     */
    datos: [
      { valor: { es: "90", en: "90" }, etiqueta: { es: "días de plan", en: "days of plan" } },
      { valor: { es: "2", en: "2" }, etiqueta: { es: "horas al día", en: "hours a day" } },
      { valor: { es: "4", en: "4" }, etiqueta: { es: "fases de crecimiento", en: "growth phases" } },
      {
        valor: { es: "Todos", en: "All" },
        etiqueta: { es: "tus contactos, organizados en el CRM", en: "your contacts, organized in the CRM" },
      },
    ],

    /**
     * ⚠️ EL TEXTO NO DESCRIBE EL DESTINO, Y ES DELIBERADO. Lleva a /about, o
     * sea a "quiénes somos", pero no dice "conócenos": dice qué pasa si
     * pulsas. Después de dos párrafos que solo describen a la persona, el
     * botón es la primera frase de la sección que mira hacia delante.
     *
     * De paso resuelve un choque: la sección de abajo tiene su propio botón a
     * /about, y con los dos diciendo "Conócenos" se leían como el mismo enlace
     * repetido.
     *
     * Sigue sin ser conversión —no pide nada, no hay formulario— y por eso el
     * destino no cambia.
     */
    cta: {
      texto: { es: "Así empieza el cambio", en: "This is how the change starts" },
      href: "/about",
    },

    /* ⚠️ LAS DOS FOTOS SON DE BANCO, como las del hero. La segunda se reutiliza
       a propósito: es la misma que sostiene la mitad de él en la primera
       imagen del slider, y repetirla cose las dos secciones. */
    /**
     * ⚠️ UNA FOTO, Y ANTES ERAN DOS SUPERPUESTAS. El montaje en diagonal
     * funcionaba cuando la columna de imagen era el 55 % de la sección. Con el
     * reparto nuevo —30 para la foto y 70 para el texto— esa columna mide unos
     * 368 px de ancho por 480 de alto, y dentro iban dos fotos APAISADAS al
     * 75 % y al 60 % de ese ancho: dos recuadros casi cuadrados de 276 y 221
     * px, recortados de originales horizontales. No es que se vieran pequeños;
     * es que el montaje pedía anchura y la columna había dejado de tenerla.
     *
     * ⚠️ Y LA FOTO NUEVA ES VERTICAL DE ORIGEN, que es la otra mitad del
     * arreglo. Sale de `banco-tiempo` (1400x1800) recortada a 800x1040, o sea
     * la misma proporción que la columna: `cover` casi no tiene que tirar
     * nada. Estirar una horizontal para llenar un hueco vertical es lo que
     * hacía que se viera raro.
     *
     * ⚠️ SE PIERDE LA FOTO DEL HOMBRE, y es deliberado. Esta sección dice "tú
     * eres esa persona" y la pareja mujer-hombre ya vive en dos sitios: el
     * díptico del héroe y el collage del cierre. Aquí una sola persona mirando
     * a cámara sostiene mejor la frase que dos sellos recortados.
     */
    foto: {
      src: "/imagenes/identidad/mujer-vertical.webp",
      alt: {
        es: "Una mujer hablando por teléfono sentada junto a la ventana de su casa",
        en: "A woman on the phone sitting by the window at home",
      },
      /* Vertical contra hueco vertical: el recorte es mínimo y la cara cae
         sobre el tercio de arriba, así que la ventana sube un punto. */
      encuadre: "50% 35%",
    },
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
    kicker: { es: "La lista de Emprende180", en: "The Entrepreneur180 list" },
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
    kicker: { es: "Ser Embajadora Emprende180 es esto", en: "Being an Entrepreneur180 Ambassador is this" },
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
   * LA PÁGINA DE QUIÉNES SOMOS — /about
   * ═══════════════════════════════════════════════════════════════════════
   *
   * Reescrita entera el 14 de septiembre de 2026. La anterior seguía el orden
   * de una referencia y se quedó en credenciales; ésta sigue el brief del
   * cliente, sección por sección, y cada texto se aprobó antes de escribirse.
   *
   * ─── LO QUE HAY AQUÍ Y LO QUE NO ─────────────────────────────────────────
   *
   * ⚠️ NI UN NÚMERO INVENTADO. Los cuatro de la barra son los cuatro que se
   * pudieron confirmar: tres empresas (están abajo, con nombre y web), más de
   * veinte años de oficio detrás (lo dio el cliente el 9 de septiembre), Utah
   * (lo confirmó el 14) y los cuatro servicios que salen de los `rubro` de
   * las tres empresas. No hay cifra de Embajadores porque no la hay: la
   * empresa lleva menos de un año, y una barra que dice "3" y "+20" sin
   * adornos se lee como honestidad. Una que dice "+500" sin serlo se lee
   * hasta que alguien pregunta.
   *
   * ⚠️ LAS CITAS DE LAS MARCAS SON PROPUESTAS, NO CITAS. Van en `citaPropuesta`
   * y NO se publican: en producción la tarjeta enseña logotipo, rubro y
   * enlace. Se escribieron para que el cliente se las lleve a cada empresa y
   * las firme quien las firme; el día que vuelvan aprobadas, se copian a
   * `cita` con nombre y cargo, y la tarjeta las pinta sola.
   *
   * ⚠️ EL INGLÉS NO ES UNA TRADUCCIÓN. Cada texto se escribió dos veces: el
   * español con su tono y el inglés con el suyo. Donde el calco sonaba raro
   * —"don de gente", "carne asada"— se buscó lo que diría alguien que escribe
   * en inglés de negocios, no lo que dice el diccionario.
   */
  about: {
    aria: { es: "Quiénes somos", en: "About us" },
    kicker: { es: "Quiénes somos", en: "About us" },
    descripcion: {
      es: "Qué es Emprende180, quién está detrás y a quién le sirve. Sin cifras que no tengamos.",
      en: "What Entrepreneur180 is, who's behind it, and who it's for. No numbers we don't have.",
    },

    /* ─── 1 · EL HERO ────────────────────────────────────────────────────
       Composición de la referencia (bossbabe.com/about): a la izquierda, en
       una columna estrecha con aire a la derecha, título grande pero no
       enorme, SOLO el remate de la frase en Fraunces, un subtítulo menor y el
       botón separado. De la referencia se copia la proporción y la
       disposición; la tipografía y el color son los del sitio.

       El título lo fijó el cliente por escrito el 14-09-2026, con el remate
       en énfasis. Ya no da por hecho a quién le habla —"conectar a tu gente"
       lo hace cualquiera, con muchos contactos o con pocos— y "por fin valga
       algo" es la idea de toda la página: lo que ya hacías gratis, ahora
       cuenta. El inglés no es traducción: "finally get paid" dice lo mismo
       que "por fin valga algo" con las palabras que se usan en inglés, y
       "actually works" es el "ya funciona" sin sonar a eslogan.

       Sin signos "+" ni guion largo en español: regla del cliente.

       ⚠️ EL SUBTÍTULO HABLA DEL MÉTODO Y DE LO QUE TE LLEVAS, NO DE
       CREDENCIALES. Pasó por dos versiones que no valían: una decía que la
       empresa "acaba de empezar" (restar antes de sumar) y otra enumeraba
       las tres empresas y los 21 años, que ya están en la barra y en la
       carta dos pantallas más abajo. El hero no tiene que demostrar nada:
       tiene que decir qué gana quien lee. Tres beneficios en el orden en que
       los vive quien entra —aprendes, no cargas con el trámite, cobras— y la
       pregunta final, que es el gesto de la referencia ("Are you next?").
       Sin guion largo en español. */
    hero: {
      titulo: [
        {
          es: "Ayudamos a que conectar a tu gente por fin valga algo,",
          en: "We help you finally get paid for connecting your people,",
        },
        {
          es: "con un método que ya funciona.",
          en: "with a method that actually works.",
          enfasis: true,
        },
      ],
      /* ⚠️ SIN AÑO DE ARRANQUE A PROPÓSITO. La empresa lleva menos de un año
         y una fecha aquí sonaría a poco; lo que se cuenta es que lo nuevo es
         la marca, no la experiencia. Los 21 son los años de oficio de Pedro,
         confirmados como cifra exacta el 14 de septiembre de 2026.

         ⚠️ "21 AÑOS DE OFICIO CONVERTIDOS EN UN MÉTODO" Y NO "EL MÉTODO LLEVA
         21 AÑOS": lo segundo sería mentira. El método es nuevo; lo que tiene
         21 años es el oficio del que sale. */
      anos: {
        es: "Un método que te enseña qué decir y cuándo, se encarga del resto y convierte cada recomendación en un ingreso. ¿Empezamos?",
        en: "A method that shows you what to say and when, handles the rest, and turns every recommendation into income. Ready to start?",
      },
      cta: { es: "Quiero ser Embajador", en: "I want to be an Ambassador" },
      ctaHref: "/#empezar",

      /* ⚠️ DESDE EL 15-09-2026 EL HERO NO PINTA NADA DE LO DE ARRIBA. El
         cliente pidió meter el vídeo de presentación de Pedro en el hero y
         quitar el texto: "ya veremos qué hacemos con ese texto". Título,
         subtítulo y botón se quedan aquí, aprobados, para cuando se decida.
         Lo único que el hero usa ahora es esto: */
      video: {
        src: "/video/prom.mp4",
        poster: "/video/prom-poster.webp",
        alt: {
          es: "Vídeo de presentación de Emprende180",
          en: "Entrepreneur180 introduction video",
        },
      },
    },

    /* ─── 3 · LA INTRODUCCIÓN ─────────────────────────────────────────────
       ⚠️ NO DA POR HECHO QUE EL LECTOR YA SEA "LA PERSONA A LA QUE TODOS LE
       PREGUNTAN". La primera versión sí lo hacía ("Todos conocen a alguien
       así. Aquí esa persona cobra") y dejaba fuera a quien no se ve así,
       que es el mismo fallo que se corrigió en la identidad de la portada.

       Y hace una segunda cosa a la vez: dar seguridad. Quien llega al about
       está decidiendo, y lo que busca no es que le digan que puede, sino ver
       quién hay detrás. Por eso el segundo párrafo enumera lo comprobable y
       remata con "para eso está esta página". Se eligió entre tres variantes
       el 14-09-2026. */
    intro: {
      titulo: {
        es: "No hace falta ser la persona más conectada.",
        en: "You don't need to be the best-connected person in the room.",
      },
      subtitulo: {
        es: "Hace falta un método, y ese lo ponemos nosotros.",
        en: "You need a method — and that part is on us.",
      },
      parrafos: [
        {
          es: "Hay quien conoce a medio mundo y hay quien conoce a cinco personas de verdad. Los dos pueden hacer esto, porque lo que se recomienda no es a ti: es a una empresa que lleva años haciendo bien su trabajo.",
          en: "Some people know half the town; some people know five people well. Both can do this, because what gets recommended isn't you — it's a company that has been doing its job well for years.",
        },
        {
          es: "Detrás de cada presentación hay tres empresas reales, una formación escrita por quien lleva 21 años en esto, y alguien que contesta. No tienes que fiarte de una promesa; tienes que ver quién hay detrás, y para eso está esta página.",
          en: "Behind every introduction there are three real companies, a training program written by someone with 21 years in the trade, and a person who answers. You don't have to trust a promise; you get to see who's behind it — and that's what this page is for.",
        },
      ],
      /* ⚠️ EL ORDEN ES ÉL, ELLA, y la segunda es la que baja. El desnivel lo
         lleva siempre la segunda foto de la lista, así que invertir el orden
         aquí es lo que cambia cuál queda arriba. Estuvo al revés y se pidió
         invertirlo el 14-09-2026. */
      fotos: [
        {
          /* ⚠️ EN CASA, COMO ELLA. La primera era él delante de un edificio de
             cristal, y al lado de ella en su sofá se leía como "la que está en
             casa y el que va a la oficina": justo el reparto que el sitio no
             quiere hacer. Esta sale de resultados/05 —un original apaisado de
             800x600, recortado a vertical— y en pantallas de alta densidad se
             ve algo blanda. Se aceptó a cambio de que las dos fotos tengan la
             misma temperatura. */
          src: "/imagenes/about/hombre-vertical.webp",
          alt: {
            es: "Un hombre en el sofá de su casa, hablando a la cámara de su teléfono",
            en: "A man on his couch at home, talking to his phone camera",
          },
        },
        {
          src: "/imagenes/identidad/mujer-vertical.webp",
          alt: {
            es: "Una mujer hablando por teléfono sentada junto a la ventana de su casa",
            en: "A woman on the phone sitting by the window at home",
          },
        },
      ],
    },

    /* ─── 3 · LA BARRA ────────────────────────────────────────────────────
       Cuatro hechos verificables con el formato de cuatro contadores. Ver
       la nota de la cabecera: ninguno es una estimación. */
    barra: {
      kicker: { es: "Lo que hay hoy, sin redondear.", en: "Where we stand today, unrounded." },
      datos: [
        {
          valor: "3",
          etiqueta: { es: "Empresas que representamos", en: "Companies we represent" },
        },
        {
          /* Cifra exacta y no "+20": el cliente la confirmó el 14-09-2026. */
          valor: "21",
          etiqueta: { es: "Años de oficio detrás", en: "Years of experience behind it" },
        },
        {
          valor: "Utah",
          etiqueta: { es: "Donde operamos hoy", en: "Where we operate today" },
        },
        {
          /* Hipoteca, obra y remodelación, eléctrico, atención tras un
             accidente: los `rubro` de las tres empresas de abajo. Se quedó en
             contador y no en lista para que las cuatro casillas pesen igual;
             el detalle lo dan las tarjetas de las marcas. */
          valor: "4",
          etiqueta: { es: "Rubros distintos", en: "Different sectors" },
        },
      ],
    },

    /* ─── 4 · CONFÍAN EN NOSOTROS ─────────────────────────────────────────
       Las tres empresas salen de `about.aliados`, que ya existía. Aquí solo
       va el titular y el rótulo de "propuesta" que se ve en local. */
    confian: {
      /* El titular dice POR QUÉ confían, no solo QUIÉNES: la versión anterior
         listaba las marcas sin dar la razón, y la razón es el método. */
      kicker: { es: "Las marcas", en: "The brands" },
      titulo: { es: "Ya usan el método. Por eso confían en él.", en: "They already use the method. That's why they trust it." },
      texto: {
        es: "Tres empresas con años de trabajo detrás. Cada presentación que hace un Embajador acaba en una de ellas.",
        en: "Three companies with years of work behind them. Every introduction an Ambassador makes ends up with one of them.",
      },
      pendiente: {
        es: "Propuesta de cita, pendiente de que la empresa la apruebe. No se publica.",
        en: "Proposed quote, pending the company's approval. Not published.",
      },
      visitar: { es: "Ver su web", en: "Visit their site" },
    },

    /* ─── 5 · LOS VALORES ─────────────────────────────────────────────────
       Las seis palabras del manifiesto del héroe. Tres frases son
       LITERALMENTE las de allí —autonomía, carisma, solidaridad— y los tres
       iconos también; las otras tres se escribieron en esa misma voz. */
    valores: {
      /* ⚠️ EL SUJETO ES EMPRENDE180, NO EL LECTOR. La versión anterior ("Ser
         Embajador significa seis cosas") convertía los valores de la empresa
         en una prueba de identidad para quien lee: si no eres así, no eres
         Embajador. Ésta dice en qué cree la empresa, que es lo que una
         sección de valores tiene que decir, y deja al lector fuera del
         examen. */
      titulo: { es: "Lo que creemos en Emprende180.", en: "What we believe at Entrepreneur180." },
      subtitulo: { es: "Seis ideas que no cambian.", en: "Six ideas that don't change." },
      lista: [
        {
          icono: "reloj",
          palabra: { es: "Trabajo", en: "Work" },
          frase: {
            es: "Aquí se cobra por lo que ayudas a que pase, no por estar en una lista.",
            en: "Here you get paid for what you help make happen, not for being on a list.",
          },
        },
        {
          icono: "infinito",
          palabra: { es: "Dedicación", en: "Dedication" },
          frase: {
            es: "No va de un mes bueno. Va de volver a la conversación la semana siguiente, sin prisa.",
            en: "It isn't about one good month. It's about coming back to the conversation the following week, at your own pace.",
          },
        },
        {
          icono: "brujula",
          palabra: { es: "Autonomía", en: "Autonomy" },
          frase: {
            es: "Tú pones el horario y tú llevas el ritmo. Nadie te empuja, y nadie lo hace por ti.",
            en: "You set the hours and you set the pace. Nobody pushes you — and nobody does it for you.",
          },
        },
        {
          icono: "escudo",
          palabra: { es: "Responsabilidad", en: "Responsibility" },
          frase: {
            es: "Cada presentación lleva tu nombre. Por eso se hace con cuidado.",
            en: "Every introduction carries your name. That's why it's done with care.",
          },
        },
        {
          icono: "bocadillos",
          palabra: { es: "Carisma", en: "Charisma" },
          frase: {
            es: "Tu herramienta es la conversación, no un guion.",
            en: "Your tool is the conversation, not a script.",
          },
        },
        {
          icono: "personas",
          palabra: { es: "Solidaridad", en: "Solidarity" },
          frase: {
            es: "Cada caso es alguien que conoces. Por eso se hace bien.",
            en: "Every case is someone you know. That's why it gets done right.",
          },
        },
      ],
    },

    /* ─── 6 · PROPÓSITO Y A QUIÉN SERVIMOS ────────────────────────────────
       Los cuatro públicos son los cuatro que ya se habían segmentado. Cada
       bloque empieza por "Si…" para que cada lector encuentre el suyo sin
       leer los otros tres. */
    proposito: {
      /* ⚠️ EL KICKER Y "A QUIÉN LE SIRVE" YA NO SE PINTAN. El cliente pidió el
         15-09-2026 quitar las cejas de esta sección y centrar el título. El
         kicker se queda solo como etiqueta accesible de la sección. */
      kicker: { es: "Por qué existimos", en: "Why we exist" },
      /* La frase, en dos trozos: el arranque en Montserrat y el remate en
         Fraunces teal, el gesto de todos los titulares del sitio (es el mismo
         partido que "Los 90 días / que cambian tu rutina" en la portada, que
         es la sección a la que esta se parece ahora). */
      frase: {
        es: "Emprende180 existe para que conocer gente deje de ser un gasto de tiempo",
        en: "Entrepreneur180 exists so that knowing people stops being a way to spend your time",
      },
      remate: {
        es: "y pase a ser un oficio.",
        en: "and starts being a trade.",
      },
      /* ⚠️ LAS CUATRO FOTOS SON DE BANCO (Pexels, licencia libre sin
         atribución), bajadas el 15-09-2026 a petición del cliente: "imágenes,
         representación gráfica, que tengan contexto con esto". Cada una
         retrata la escena de SU público —no un concepto—: la cocina con el
         cuaderno y el teléfono, el corrillo de amigos, el mostrador con la
         clienta, el portátil de noche. Ninguna es de un Embajador de verdad;
         PRODUCT.md prohíbe el stock por nombre y estas cuatro se cambian en
         cuanto haya sesión. Originales: pexels.com/photo/8902216, 6340713,
         7679721 y 6578426. 1200x900, 4:3, menos de 100 KB cada una. */
      publicos: [
        {
          titulo: { es: "Si administras tu casa", en: "If you run a household" },
          imagen: {
            src: "/imagenes/about/proposito-casa.webp",
            alt: {
              es: "Una mujer en su cocina, al teléfono, apuntando en un cuaderno",
              en: "A woman in her kitchen, on the phone, jotting in a notebook",
            },
          },
          texto: {
            es: "Tienes la agenda más llena de todos y nadie te paga por ella. Esto encaja en los huecos que ya tienes, no en los que no tienes.",
            en: "Your calendar is the fullest of anyone's, and nobody pays you for it. This fits in the gaps you already have, not the ones you don't.",
          },
        },
        {
          titulo: { es: "Si eres el alma de tu círculo", en: "If you're the one everyone calls" },
          imagen: {
            src: "/imagenes/about/proposito-circulo.webp",
            alt: {
              es: "Tres amigos conversando con un café junto a una ventana",
              en: "Three friends chatting over coffee by a window",
            },
          },
          texto: {
            es: "Ya te preguntan a ti primero. La diferencia es que ahora hay algo detrás de tu respuesta. Y si ya tienes una comunidad, aquí se potencia: aprendes a activarla con método y sin forzarla.",
            en: "People already come to you first. The difference is that now there's something behind your answer. And if you already have a community, this is where it gets stronger: you learn to activate it with method, without forcing it.",
          },
        },
        {
          titulo: { es: "Si ya vives de vender o de atender", en: "If you already work in sales or service" },
          imagen: {
            src: "/imagenes/about/proposito-atender.webp",
            alt: {
              es: "El dueño de una tienda de ropa atendiendo a una clienta en el mostrador",
              en: "A clothing shop owner helping a customer at the counter",
            },
          },
          texto: {
            es: "Sabes leer una conversación. Aquí eso se cobra aparte de tu sueldo.",
            en: "You know how to read a conversation. Here that earns on top of your paycheck.",
          },
        },
        {
          titulo: { es: "Si tu empleo te queda corto", en: "If your job has stopped fitting" },
          imagen: {
            src: "/imagenes/about/proposito-empleo.webp",
            alt: {
              es: "Un hombre trabajando en su portátil por la noche, con una lámpara y un café",
              en: "A man working on his laptop at night, with a lamp and a coffee",
            },
          },
          texto: {
            es: "No hace falta renunciar el lunes. Hace falta empezar el martes por la noche.",
            en: "You don't need to quit on Monday. You need to start on Tuesday night.",
          },
        },
      ],
    },

    /* ─── 2 · LA CARTA DE PEDRO ───────────────────────────────────────────
       Va JUSTO DESPUÉS DEL HERO, y antes iba casi al final: en una página de
       "quiénes somos", quién habla es lo primero. Cinco párrafos, escritos
       por el cliente el 14-09-2026 y transcritos tal cual.

       ⚠️ LA VERSIÓN ANTERIOR SE DESECHÓ, Y CONVIENE SABER POR QUÉ. Llevaba una
       anécdota ("una frase en una carne asada") que se sentía forzada y le
       quitaba a la carta el sentido de propósito. Ésta vuelve a la idea
       original: la persona que dice tu nombre lo hace toda la vida gratis, y
       Emprende180 nace para cambiar eso.

       ⚠️ SIN GUION LARGO EN ESPAÑOL, aquí y en todo el about. Es una regla del
       cliente: coma o punto y seguido. El inglés sí puede llevarlo, porque
       ahí es natural, y por eso "alguien, yo, que contesta" es "someone — me
       — who answers".

       ⚠️ "ALGUIEN, YO, QUE CONTESTA CUANDO ESCRIBES" ES UNA PROMESA
       OPERATIVA, no una frase. Si Pedro no va a contestar en persona, hay
       que quitarla antes de publicar. */
    carta: {
      kicker: { es: "Una carta de Pedro", en: "A letter from Pedro" },
      parrafos: [
        {
          es: "Llevo 21 años en esto, y lo que más me costó entender es lo simple que era.",
          en: "I've been in this for 21 years, and the hardest thing to understand was how simple it actually is.",
        },
        {
          es: "El negocio nunca estuvo en tener el mejor producto. Estuvo en que alguien de confianza dijera tu nombre en el momento correcto. Eso vale más que cualquier campaña que haya pagado.",
          en: "The business was never in having the best product. It was in someone people trust saying your name at the right moment. That's worth more than any campaign I've ever paid for.",
        },
        {
          es: "El problema es que esa persona casi nunca gana nada por decirlo. Lo hace toda la vida, gratis, sin que nadie se lo reconozca. Emprende180 nace para cambiar eso: un método real, con empresas reales detrás, para que lo único que tengas que hacer sea lo que ya hacías sin cobrar.",
          en: "The problem is that the person saying it almost never gets anything for it. They do it their whole life, for free, and nobody gives them credit for it. Entrepreneur180 exists to change that: a real method, with real companies behind it, so the only thing you have to do is what you were already doing unpaid.",
        },
        {
          es: "No te voy a prometer cifras que no tengo. Te puedo decir qué hay del otro lado: 21 años de oficio, una formación que escribí yo mismo, y alguien, yo, que contesta cuando escribes.",
          en: "I won't promise you numbers I don't have. What I can tell you is what's on the other side: 21 years in the trade, a training program I wrote myself, and someone — me — who answers when you write.",
        },
        {
          /* ⚠️ "CONOZCAS A MEDIO MUNDO O A CINCO PERSONAS", y no solo lo
             primero. La versión anterior cerraba con "si conoces a medio
             mundo", que volvía a dejar fuera a quien no se ve así: justo lo
             que la introducción de arriba se esfuerza en no hacer. El cierre
             tiene que sonar igual de bien para las dos personas. */
          es: "Conozcas a medio mundo o a cinco personas que confían en ti, creo que esto te va a gustar.",
          en: "Whether you know half the town or five people who trust you, I think you're going to like this.",
        },
      ],
      firma: { es: "Pedro Lira", en: "Pedro Lira" },
      fotoAlt: {
        es: "Retrato de Pedro Lira, fundador de Emprende180",
        en: "Portrait of Pedro Lira, founder of Entrepreneur180",
      },
    },

    /* ─── 8 · EL BLOG ─────────────────────────────────────────────────────
       El mismo bloque de autor que la portada, con dos artículos y no tres. */
    blog: {
      /* La ceja y el botón los pidió el cliente el 15-09-2026: "mete ceja de
         el blog y un botón para mandar a recursos". El botón va a /resources
         y no a /blog porque la portada del blog se mudó a Recursos; /blog
         sigue existiendo para los artículos sueltos. */
      kicker: { es: "El blog", en: "The blog" },
      titulo: { es: "Escribo lo que voy aprendiendo.", en: "I write down what I'm figuring out." },
      subtitulo: { es: "Sin adornos.", en: "No polish." },
      irARecursos: { es: "Ir a Recursos", en: "Go to Resources" },
      verTodos: { es: "Ver todos los artículos", en: "See all articles" },
      vacio: {
        es: "Todavía no hay artículos publicados. El primero está en camino.",
        en: "No articles published yet. The first one is on its way.",
      },
    },

    /* ─── LAS EMPRESAS QUE REPRESENTAMOS ──────────────────────────────────
     *
     * ⚠️ `cita` ESTÁ VACÍA Y NO SE INVENTA. Poner palabras en boca de otro
     * negocio, con su nombre y su logotipo al lado, no es solo un problema
     * nuestro. Mientras falte, la tarjeta enseña logotipo, rubro y enlace.
     *
     * ⚠️ `citaPropuesta` ES UN BORRADOR PARA LLEVÁRSELO A LA EMPRESA. Se ve
     * en local con su rótulo de "propuesta"; en producción no se pinta. Sin
     * cifras y sin promesas de resultado a propósito: una cita con números
     * obliga a la marca a respaldarlos. El día que vuelva aprobada, se copia
     * a `cita` con `firma` (nombre y cargo de quien la firma) y sale sola.
     */
    aliados: [
      {
        nombre: "Broker Lenders",
        queResuelve: {
          es: "Cuando alguien de tu agenda necesita una hipoteca, la trabajan ellos. Tú solo hiciste la presentación.",
          en: "When someone in your contacts needs a mortgage, they handle it. All you did was make the introduction.",
        },
        logo: "/imagenes/aliados/brokerlenders.webp",
        logoClaro: false,
        url: "https://www.brokerlenders.com",
        rubro: { es: "Préstamos hipotecarios", en: "Mortgage lending" },
        cita: null as { es: string; en: string } | null,
        firma: null as { nombre: string; cargo: { es: string; en: string } } | null,
        citaPropuesta: {
          es: "Las referencias que llegan por Emprende180 vienen con la conversación ya hecha. La persona no llega preguntando qué es una hipoteca: llega sabiendo por qué está aquí.",
          en: "The referrals that come through Entrepreneur180 arrive with the conversation already had. People don't show up asking what a mortgage is — they show up knowing why they're there.",
        },
      },
      {
        nombre: "BoltWatts",
        queResuelve: {
          es: "Obra, reforma y eléctrico. Lo que en una conversación normal acaba en «conozco a alguien», aquí acaba resuelto.",
          en: "Building, remodeling and electrical. What in a normal conversation ends in a vague promise, here ends solved.",
        },
        logo: "/imagenes/aliados/boltwatts.webp",
        logoClaro: false,
        url: "https://www.boltwatts.com",
        rubro: { es: "Construcción y remodelación", en: "Construction and remodeling" },
        cita: null as { es: string; en: string } | null,
        firma: null as { nombre: string; cargo: { es: string; en: string } } | null,
        citaPropuesta: {
          es: "En obra, el cliente que viene recomendado por alguien de confianza es otro cliente. Decide antes, pregunta mejor y se queda.",
          en: "In construction, a client who comes recommended by someone they trust is a completely different client. They decide sooner, ask better questions, and they stay.",
        },
      },
      {
        nombre: "Car Injury Clinics",
        queResuelve: {
          es: "Atención médica y apoyo legal después de un accidente, en el mismo sitio. Es de lo primero que aprende un Embajador a reconocer.",
          en: "Medical care and legal support after an accident, in one place. It's one of the first things an Ambassador learns to spot.",
        },
        logo: "/imagenes/aliados/carinjuryclinics.webp",
        /* Su logotipo es blanco: está dibujado para fondos oscuros. Sobre la
           placa blanca de los otros dos desaparecía, así que su placa es navy. */
        logoClaro: true,
        url: "https://carinjuryclinics.com",
        rubro: { es: "Atención médica y apoyo legal", en: "Medical care and legal support" },
        cita: null as { es: string; en: string } | null,
        firma: null as { nombre: string; cargo: { es: string; en: string } } | null,
        citaPropuesta: {
          es: "Después de un accidente la gente no busca en Google: le pregunta a quien tiene cerca. Que esa persona sepa a dónde mandarla cambia las primeras 48 horas.",
          en: "After a crash, people don't search online — they ask whoever's nearby. Having that person know where to send them changes the first 48 hours.",
        },
      },
    ],
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
    aria: { es: "Cómo trabajar con Emprende180", en: "How to work with Entrepreneur180" },
    kicker: { es: "Cómo se trabaja", en: "How it works" },
    titulo: [
      { es: "Tres piezas.", en: "Three pieces." },
      { es: "Una forma de trabajar.", en: "One way of working.", enfasis: true },
    ],
    /**
     * ⚠️ SE FUE LA NUMERACIÓN (01 / 02 / 03), y con ella la idea de que esto
     * era una secuencia. No lo es: son tres piezas que funcionan a la vez, no
     * tres pasos que se hacen en orden. El número invitaba a leerlas como un
     * itinerario y a preguntarse por dónde se empieza.
     *
     * ⚠️ Y LA TERCERA ES OTRA COSA, no la misma con otras palabras. Era "el
     * reto de 90 días" —un plan— y ahora es "el seguimiento", que es una
     * persona revisando tu avance cada semana. El reto sigue existiendo y se
     * cuenta en la sección de la Academia; lo que faltaba aquí era decir que
     * hay alguien detrás.
     */
    piezas: [
      {
        icono: "academia",
        titulo: { es: "La Academia", en: "The Academy" },
        texto: {
          es: "Los programas y el método que los sostiene, en videos cortos y en orden. Aprendes a tu ritmo, con contenido diseñado para que cada módulo construya sobre el anterior. Si te atoras, alguien del equipo contesta.",
          en: "The programs and the method behind them, in short videos and in order. You learn at your own pace, with content designed so each module builds on the one before. If you get stuck, someone on the team answers.",
        },
        cta: { es: "Ver la Academia", en: "See the Academy" },
        href: "#academia",
      },
      {
        icono: "agenda",
        titulo: { es: "El CRM", en: "The CRM" },
        texto: {
          es: "Tus contactos y tus oportunidades centralizados, con su estado siempre actualizado. Incluido en el programa, con seguimiento del equipo en las llamadas periódicas.",
          en: "Your contacts and opportunities in one place, with their status always up to date. Included in the program, with the team following up on the regular calls.",
        },
        cta: { es: "Quiero mi acceso", en: "I want my access" },
        href: "#empezar",
      },
      {
        icono: "seguimiento",
        titulo: { es: "El seguimiento", en: "The follow-up" },
        texto: {
          es: "No es un video más. Cada semana, alguien del equipo revisa tu avance contigo. Así nunca dependes de adivinar si vas bien.",
          en: "It isn't one more video. Every week, someone on the team goes over your progress with you. So you never have to guess whether you're on track.",
        },
        cta: { es: "Ver el seguimiento", en: "See the follow-up" },
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
    /* ⚠️ EL TÍTULO CAMBIÓ CON LA MUDANZA. "Preguntas que ya conoces /
       Respuestas que te faltaban" era el titular cuando la sección vivía en
       la portada; el 15-09-2026 pasó a /resources y su sitio en la portada lo
       ocupan las preguntas frecuentes, así que un titular que empezaba por
       "Preguntas" habría chocado con la sección que la sustituye. Este habla
       de lo que es: 21 años de oficio, contados en corto. */
    titulo: [
      { es: "Lo que he aprendido en 21 años,", en: "What 21 years taught me," },
      {
        es: "en artículos cortos.",
        en: "in short articles.",
        enfasis: true,
      },
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
    /* ⚠️ LA FOTO DE ESTA SECCIÓN ES LA DE OFICINA, no el retrato vertical. El
       retrato se quedó, pero en el avatar de 40 px del bloque de autor: para
       el hueco apaisado de la columna hace falta una horizontal.

       Y es un retrato corporativo de día, no "el autor escribiendo de noche",
       que es lo que pedía el encargo. Se eligió a sabiendas: no existe esa
       foto, y aquí pesa más que la cara sea la de Pedro de verdad que la
       escena sea la correcta con un desconocido de banco. Cuando haya una
       suya trabajando, se cambia esta línea. */
    foto: {
      es: "Pedro Lira en su oficina",
      en: "Pedro Lira in his office",
    },
    /* El avatar del bloque de autor. Es el mismo nombre que firma los
       artículos, así que sale del config del instructor y no se escribe aquí. */
    autorAlt: {
      es: "Retrato de Pedro Lira",
      en: "Portrait of Pedro Lira",
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
      { es: "Sin horario fijo.", en: "No fixed schedule." },
      { es: "Solo el tuyo.", en: "Only yours.", enfasis: true },
    ],
    texto: [
      {
        es: "Los programas de Emprende180 y el método que los sostiene, en videos cortos y en orden. Sin clases en vivo, sin horario que cumplir: avanzas cuando puedes, y si hoy no puedes, mañana sigue ahí.",
        en: "The Entrepreneur180 programs and the method that holds them together, in short videos and in order. No live classes, no schedule to keep: you move forward when you can, and if today isn't the day, it's still there tomorrow.",
      },
      {
        es: "Cada programa cierra con un quiz que confirma que lo tienes.",
        en: "Each program closes with a quiz that confirms you've got it.",
      },
    ],

    /**
     * ⚠️ EL BOTÓN YA NO VA A `/login`, y el cambio importa más de lo que parece.
     * Decía "Entrar" y llevaba a la puerta de quien YA pagó, pero esta sección
     * no le habla a ese: le habla a alguien que todavía no tiene cuenta y está
     * decidiendo. Mandarlo a un formulario de acceso es pedirle una contraseña
     * que no tiene.
     *
     * Ahora lleva a `#como-trabajar`, que es lo que el menú llama "Programas" y
     * lo único del sitio donde se ven sin identificarse. La puerta de los
     * Embajadores sigue en "Acceso", arriba en la barra, que es su sitio.
     */
    cta: { es: "Ver los programas", en: "See the programs" },
    ctaHref: "#como-trabajar",
    /* ⚠️ Desde el 16-09-2026 la foto de fondo es Pedro de pie en su oficina
       (`instructor.retratos.dePie`), no la de banco del hombre en la cocina: la
       Academia la da él, y esta era la única sección que hablaba de la
       formación sin enseñar a quien la escribió. El `alt` vive con la foto. */
  },

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * LOS 90 DÍAS, EN LA PORTADA — la sección que va detrás del programa
   * ═══════════════════════════════════════════════════════════════════════
   *
   * La pidió el cliente el 15-09-2026: el título y, debajo, las cuatro fases
   * como un collage de filas alternas —foto a un lado, texto al otro, y al
   * revés en la siguiente—, sin aire entre ellas y a todo el ancho.
   *
   * ⚠️ LOS TEXTOS DE LA FASE 1 Y LA 4 LOS DICTÓ EL CLIENTE tal cual, con sus
   * cifras ("100 contactos", "más de 150 contactos organizados", "25
   * conversaciones profundas"). Conviene saber que eso contradice la regla
   * que él mismo fijó en `plan90` —las metas de actividad no se publican—.
   * Se ponen porque las dictó por escrito para esta sección; si algún día se
   * quiere volver a la regla, son dos frases.
   *
   * ⚠️ LAS FASES 2 Y 3 LAS ESCRIBIÓ CLAUDE a partir de los objetivos que ya
   * estaban en `plan90.fases` y del corte del día 45, porque el cliente pegó
   * la fase 1 tres veces y solo dictó la 1 y la 4. Van sin la línea de
   * minutos: el documento da el reparto del principio (60·45·15) y el del
   * final (35·70·15), y el de las fases de en medio no está escrito en ningún
   * sitio. Inventarlo sería inventar un dato. Pendientes de que el cliente
   * las apruebe o las reescriba.
   *
   * Sin guion largo en español: el que traía la fase 4 pasa a dos puntos.
   */
  plan90Portada: {
    aria: { es: "Los 90 días", en: "The 90 days" },
    /* El título en dos trozos: "Los 90 días" en Montserrat y el remate en
       Fraunces teal, que es el gesto de todos los titulares del sitio. Se pidió
       "darle color y cambiar la tipografía" y era esto lo que faltaba: el
       titular iba entero en Montserrat negro. */
    titulo: { es: "Los 90 días", en: "The 90 days" },
    remate: { es: "que cambian tu rutina", en: "that change your routine" },
    fases: [
      {
        numero: "01",
        rango: { es: "Días 1–20", en: "Days 1–20" },
        nombre: { es: "Fundación", en: "Foundation" },
        reparto: {
          es: "60 min prospección · 45 min seguimiento · 15 min cierre",
          en: "60 min prospecting · 45 min follow-up · 15 min wrap-up",
        },
        texto: {
          es: "Empiezas desde cero y eso está bien. Construyes tu lista de 100 contactos, la cargas al CRM y aprendes a sostener conversaciones reales. Al final de esta fase tienes más de 150 contactos organizados y 25 conversaciones profundas.",
          en: "You start from zero, and that's fine. You build your list of 100 contacts, load it into the CRM and learn to hold real conversations. By the end of this phase you have more than 150 organized contacts and 25 deep conversations.",
        },
        imagen: {
          src: "/imagenes/resultados/01.webp",
          ancho: 800,
          alto: 600,
          encuadre: "center 40%",
          alt: {
            es: "Una mano escribiendo una lista en una libreta, con un café al lado",
            en: "A hand writing a list in a notebook, with a coffee beside it",
          },
        },
      },
      {
        numero: "02",
        rango: { es: "Días 21–45", en: "Days 21–45" },
        nombre: { es: "Sistematización", en: "Systematizing" },
        reparto: null,
        texto: {
          es: "Lo que hacías de memoria pasa a tener un sitio. Cada contacto queda con su etapa, su etiqueta y su próximo paso, y el seguimiento deja de depender de que te acuerdes. El día 45 te sientas con tu líder y decidís juntos: sigues, ajustas o pausas.",
          en: "What you did from memory now has a place. Every contact gets its stage, its tag and its next step, and follow-up stops depending on you remembering. On day 45 you sit down with your leader and decide together: carry on, adjust or pause.",
        },
        imagen: {
          src: "/imagenes/resultados/04.webp",
          ancho: 800,
          alto: 600,
          encuadre: "center 45%",
          alt: {
            es: "Una agenda abierta con la semana escrita a mano, junto a un teclado",
            en: "An open planner with the week written out by hand, next to a keyboard",
          },
        },
      },
      {
        numero: "03",
        rango: { es: "Días 46–70", en: "Days 46–70" },
        nombre: { es: "Red y base viva", en: "Network and living base" },
        reparto: null,
        texto: {
          es: "Sales de tu agenda. Abres alianzas con negocios de tu zona que ven a la misma gente que tú, y vuelves sobre todo lo que sembraste en las semanas anteriores: los contactos que se enfriaron, las conversaciones que quedaron a medias. La base deja de ser una lista y empieza a moverse sola.",
          en: "You step outside your own contacts. You open alliances with local businesses that see the same people you do, and you go back over everything you planted in the previous weeks: the contacts that went cold, the conversations left half-finished. The base stops being a list and starts moving on its own.",
        },
        imagen: {
          src: "/imagenes/hero/banco-charla.webp",
          ancho: 1400,
          alto: 1800,
          encuadre: "center 35%",
          alt: {
            es: "Dos personas conversando sentadas a una mesa en la calle",
            en: "Two people talking at a table out in the street",
          },
        },
      },
      {
        numero: "04",
        rango: { es: "Días 71–90", en: "Days 71–90" },
        nombre: { es: "Consolidación", en: "Consolidation" },
        reparto: {
          es: "35 min prospección · 70 min seguimiento · 15 min cierre",
          en: "35 min prospecting · 70 min follow-up · 15 min wrap-up",
        },
        texto: {
          es: "Demuestras que lo que construiste se sostiene solo. El día 78 empiezas a escribir tus propias tareas. El día 90 no es un final: es el punto de partida para los siguientes 90.",
          en: "You prove that what you built holds on its own. On day 78 you start writing your own tasks. Day 90 isn't an ending: it's the starting point for the next 90.",
        },
        imagen: {
          src: "/imagenes/resultados/06.webp",
          ancho: 800,
          alto: 600,
          encuadre: "center 30%",
          alt: {
            es: "Una mujer hablando por teléfono al aire libre, con el agua de fondo",
            en: "A woman on the phone outdoors, with water in the background",
          },
        },
      },
    ],
  },

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * LA PÁGINA DE PROGRAMAS — /programs
   * ═══════════════════════════════════════════════════════════════════════
   *
   * Nueva el 14 de septiembre de 2026. Hasta entonces "Programas" en el menú
   * era un ancla a la sección "Cómo se trabaja" de la portada, que resume las
   * tres piezas en tres tarjetas; esta página las cuenta enteras, una por
   * sección, con su imagen y su botón.
   *
   * ─── LAS TRES REGLAS DE TONO, Y POR QUÉ ────────────────────────────────
   *
   * ⚠️ SIN PRECIOS NI COSTES. En ninguna sección. La única mención al dinero
   * es que el CRM va "incluido en el programa, sin costo aparte", que dice lo
   * contrario de un precio.
   *
   * ⚠️ SIN "PARA QUIÉN SÍ / PARA QUIÉN NO". Ninguna sección segmenta ni
   * filtra al lector: la página invita a aprender, no evalúa si califica. Si
   * algún día alguien mete un "esto es para ti si…", que sepa que se quitó a
   * propósito.
   *
   * ⚠️ SIN GUION LARGO EN ESPAÑOL: coma o punto y seguido. El inglés sí puede
   * llevarlo, y no es traducción: cada texto se escribió dos veces.
   *
   * ─── LOS TRES BOTONES VAN AL MISMO SITIO ───────────────────────────────
   *
   * Los tres llevan al formulario de "Empezar" de la portada, que es la única
   * puerta que hay hoy: las plataformas de verdad (`plataformas.academia.url`,
   * `plataformas.crm.url`) todavía no tienen dirección, y hasta que la tengan
   * no se enlazan desde fuera del área de alumnos. Ver la nota de
   * `comoTrabajar`. El día que la tengan, `ctaHref` cambia aquí y ya.
   */
  programas: {
    aria: { es: "Programas", en: "Programs" },
    kicker: { es: "Programas", en: "Programs" },
    descripcion: {
      es: "La Academia, el CRM y el seguimiento de Emprende180, explicados enteros y en un solo lugar.",
      en: "The Entrepreneur180 Academy, CRM and follow-up, explained in full, all in one place.",
    },

    /* ─── EL HERO ─────────────────────────────────────────────────────────
       El mismo hero que el about: a la izquierda, columna estrecha, título
       con el remate en Fraunces, un párrafo y el botón. El botón no vende:
       baja a la primera sección. */
    hero: {
      titulo: {
        es: "Todo lo que necesitas para trabajar en serio,",
        en: "Everything you need to actually get to work,",
      },
      remate: { es: "en un solo lugar.", en: "all in one place." },
      texto: {
        es: "La Academia, el CRM, el seguimiento y la comunidad que avanza contigo, sin resumir nada.",
        en: "The Academy, the CRM, the follow-up and the community moving with you, with nothing left out.",
      },
      cta: { es: "Ver cómo funciona", en: "See how it works" },
      ctaHref: "#academia",
    },

    /* ─── LA NAVEGACIÓN RÁPIDA ────────────────────────────────────────────
       Tres tarjetas que son tres enlaces a las tres secciones de abajo. La
       numeración aquí SÍ va, al revés que en "Cómo se trabaja" de la
       portada: allí se quitó porque leía como itinerario; aquí es un índice,
       y un índice se numera. */
    indice: [
      {
        numero: "01",
        ancla: "#academia",
        titulo: { es: "La Academia", en: "The Academy" },
        texto: {
          es: "El método, en videos cortos y en orden.",
          en: "The method, in short videos, in order.",
        },
      },
      {
        numero: "02",
        ancla: "#crm",
        titulo: { es: "El CRM", en: "The CRM" },
        texto: {
          es: "Tus contactos y oportunidades, siempre al día.",
          en: "Your contacts and leads, always up to date.",
        },
      },
      {
        numero: "03",
        ancla: "#seguimiento",
        titulo: { es: "El seguimiento", en: "The follow-up" },
        texto: {
          es: "Alguien del equipo revisa tu avance cada semana.",
          en: "Someone from the team checks your progress every week.",
        },
      },
    ],

    /* ─── LAS TRES SECCIONES ──────────────────────────────────────────────
       Cada una: categoría numerada, título, uno o dos párrafos, botón e
       imagen. El lado de la imagen alterna —derecha, izquierda, derecha—
       para que no se lean como tres copias de la misma plantilla.

       ⚠️ LAS IMÁGENES SON LAS QUE HAY EN EL PROYECTO, y dos de las tres son
       un apaño honesto:
         · Academia: Pedro en su escritorio (`instructor/pedro-escritorio`),
           desde el 16-09-2026. Antes iba `secciones/temario.webp`, un hombre
           de banco estudiando; quien escribió la Academia es mejor foto que
           quien la estudia, y además es real.
         · CRM: NO HAY captura ni foto del CRM en el repositorio. Va una
           agenda con la semana escrita a mano (`resultados/04`), que dice
           "contactos al día" sin enseñar una pantalla que no existe. El día
           que haya captura real, se cambia aquí.
         · Seguimiento: `resultados/03`, dos personas conversando con un
           café. Es la escena del "no lo haces solo". */
    /* ─── EL MÉTODO DE LOS 90 DÍAS ───────────────────────────────────────
       Sección nueva del 15-09-2026, a petición del cliente: "mete también el
       método de los 90 días, datos, por ahí algún vídeo en vertical". El
       título es nuevo; el párrafo y los cuatro datos son los de
       `copy.identidad`, y se leen de ahí para que haya UNA sola versión del
       texto del programa. El vídeo vertical es el de introducción
       (/video/vsl.mp4, 9:16), que estaba grabado y sin usar desde que el hero
       pasó a slider. */
    metodo: {
      aria: { es: "El método de los 90 días", en: "The 90-day method" },
      titulo: { es: "El método de los", en: "The" },
      remate: { es: "90 días.", en: "90-day method." },
    },

    secciones: [
      {
        id: "academia",
        numero: "01",
        categoria: { es: "La Academia", en: "The Academy" },
        titulo: {
          es: "El método, explicado paso a paso.",
          en: "The method, explained step by step.",
        },
        parrafos: [
          {
            es: "Aprendes a tu ritmo, en videos cortos y en orden, con contenido diseñado para que cada módulo construya sobre el anterior. Cada programa incluye un quiz al final que confirma que lo tienes.",
            en: "You learn at your own pace, through short videos in order, with content designed so each module builds on the last. Every program ends with a quiz that confirms you've got it.",
          },
          {
            es: "No hay clases en vivo ni horarios que cumplir. Si te atoras, alguien del equipo contesta.",
            en: "There are no live classes or fixed schedules. If you get stuck, someone from the team answers.",
          },
        ],
        cta: { es: "Empezar la Academia", en: "Start the Academy" },
        ctaHref: "#empezar",
        imagenLado: "derecha",
        imagen: {
          src: "/imagenes/instructor/pedro-escritorio.webp",
          ancho: 1500,
          alto: 1000,
          encuadre: "center 50%",
          alt: {
            es: "Un hombre estudiando con el portátil en la mesa de su casa",
            en: "A man studying on his laptop at his kitchen table",
          },
        },
      },
      {
        id: "crm",
        numero: "02",
        categoria: { es: "El CRM", en: "The CRM" },
        titulo: {
          es: "Tus contactos, siempre al día.",
          en: "Your contacts, always up to date.",
        },
        parrafos: [
          {
            es: "Cada oportunidad queda registrada con su estado actual, desde el primer contacto hasta la comisión pagada. Incluido en el programa, sin costo aparte.",
            en: "Every lead is logged with its current status, from first contact through to the commission paid. Included in the program, at no extra cost.",
          },
        ],
        cta: { es: "Quiero mi acceso", en: "I want access" },
        ctaHref: "#empezar",
        imagenLado: "izquierda",
        imagen: {
          src: "/imagenes/resultados/04.webp",
          ancho: 800,
          alto: 600,
          encuadre: "center 45%",
          alt: {
            es: "Una agenda abierta con la semana escrita a mano, junto a un teclado",
            en: "An open planner with the week written out by hand, next to a keyboard",
          },
        },
      },
      {
        id: "seguimiento",
        numero: "03",
        categoria: { es: "El seguimiento", en: "The follow-up" },
        titulo: {
          es: "No es un video más.",
          en: "It's not just another video.",
        },
        parrafos: [
          {
            es: "Cada semana, alguien del equipo revisa tu avance contigo: qué se movió, qué no, y qué sigue.",
            en: "Every week, someone from the team goes over your progress with you: what moved, what didn't, and what's next.",
          },
          {
            es: "Así nunca dependes de adivinar si vas bien. Y no lo haces solo: compartes ese espacio con otros Embajadores en el mismo punto que tú.",
            en: "That way you never have to guess whether you're on track. And you're not doing it alone: you share that space with other Ambassadors at the same stage as you.",
          },
        ],
        cta: { es: "Ver el seguimiento", en: "See the follow-up" },
        ctaHref: "#empezar",
        imagenLado: "derecha",
        imagen: {
          src: "/imagenes/resultados/03.webp",
          ancho: 800,
          alto: 600,
          encuadre: "center 30%",
          alt: {
            es: "Dos mujeres conversando con un café en la mano, en la calle",
            en: "Two women talking over coffee, outdoors",
          },
        },
      },
    ],
  },

  /**
   * ─── LOS RECURSOS ──────────────────────────────────────────────────────
   *
   * La franja oscura que manda a `/resources`. El enlace del menú apunta ahí
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
   * ⚠️ Y TIENE QUE SEGUIR SIENDO VERDAD. En `/resources` los artículos se leen
   * sin formulario; el que hay al final es opcional y solo sirve para avisar de
   * los siguientes. El día que algo de esa página se ponga detrás de un correo,
   * esta frase pasa a ser mentira y hay que cambiarla.
   */
  recursos: {
    aria: { es: "Recursos gratis", en: "Free resources" },
    kicker: { es: "Recursos", en: "Resources" },
    titulo: [
      { es: "Para cuando no hay tiempo,", en: "For when there's no time" },
      { es: "de dar la vuelta larga.", en: "to take the long way round.", enfasis: true },
    ],
    texto: {
      es: "El paso a paso, sin rodeos. Se abren y se leen. Ni registro, ni prueba gratis.",
      en: "Step by step, no detours. You open them and read. No sign-up, no free trial.",
    },
    cta: { es: "Explorar recursos", en: "Explore resources" },

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

    /* ─── LO QUE HAY EN LA PÁGINA, DESDE EL 15-09-2026 ────────────────────
       El cliente pidió "darle amor, contenido, mejorar mucho esta página". La
       regla de arriba sigue en pie —nada que no exista—, así que lo que se
       añade es lo que ya existe y estaba repartido por el sitio o guardado en
       el config sin pintarse:

         · el plan de 90 días, de un vistazo: el día en tres bloques, las
           cuatro fases y los tres hitos (`copy.plan90`, escrito sobre el
           documento del cliente y quitado de la portada el 10-09-2026);
         · las preguntas frecuentes, las mismas de la portada;
         · el aviso del siguiente artículo.

       El índice del hero es la lista de esas piezas, en el orden de la
       página. Si una se quita, se quita de aquí. */
    indice: [
      { texto: { es: "Los artículos", en: "The articles" }, ancla: "#blog" },
      { texto: { es: "El plan de 90 días", en: "The 90-day plan" }, ancla: "#plan" },
      { texto: { es: "Preguntas frecuentes", en: "Common questions" }, ancla: "#faq" },
      { texto: { es: "Avísame del siguiente", en: "Tell me about the next one" }, ancla: "#avisame" },
    ],
    masArticulos: { es: "Más artículos", en: "More articles" },
    planTitulo: { es: "El plan de 90 días,", en: "The 90-day plan," },
    planRemate: { es: "de un vistazo.", en: "at a glance." },
    /* Reglas de tono de la tarjeta navy: son las tres frases del plan que ya
       estaban aprobadas (la regla del CRM, el límite de tu parte y el
       acompañamiento). Se rotulan como "lo que no cambia" porque eso es lo
       que son: las tres cosas que valen los 90 días enteros. */
    planReglas: { es: "Lo que no cambia", en: "What doesn't change" },
    /* Las tres fotos del bloque del aviso, montadas como las del cierre de la
       portada (una grande y dos acompañantes).

       ⚠️ RECORTADAS A LA PROPORCIÓN DE SU HUECO, NO LAS VERTICALES DEL HERO.
       La primera versión reutilizaba las fotos de banco del hero (1400x1800,
       verticales) y `cover` las metía en cajas apaisadas: en la grande salía
       una lámpara y ni una cara. El cliente lo vio (15-09-2026: "que se vean
       bien las caras"). Ahora cada archivo viene ya cortado al hueco que
       ocupa —5:3, 5:4 y 16:9—, con la persona donde no la tapa la foto de
       encima; la del café va volteada para que la mujer caiga a la
       izquierda, lejos del solape. Pexels 36765293, 6248760 y 8937482; ver
       /public/imagenes/recursos/README.md. Ninguna es de una Embajadora de
       verdad. */
    fotos: {
      principal: {
        src: "/imagenes/recursos/aviso-cafe.webp",
        ancho: 1100,
        alto: 660,
        alt: {
          es: "Una mujer sonriendo mientras habla por teléfono en la terraza de un café",
          en: "A woman smiling on the phone at a café terrace",
        },
      },
      secundaria: {
        src: "/imagenes/recursos/aviso-sofa.webp",
        ancho: 900,
        alto: 720,
        alt: {
          es: "Una pareja conversando con una taza en el sofá de su casa",
          en: "A couple chatting over a cup of coffee on their sofa at home",
        },
      },
      terciaria: {
        src: "/imagenes/recursos/aviso-charla.webp",
        ancho: 960,
        alto: 540,
        alt: {
          es: "Dos amigos charlando animadamente en una cafetería",
          en: "Two friends in a lively conversation at a coffee shop",
        },
      },
    },
    paginaVacio: {
      es: "Todavía no hay nada publicado. Déjame tu correo y te aviso con lo primero.",
      en: "Nothing published yet. Leave me your email and I'll let you know about the first one.",
    },
  },

  /**
   * ─── LA COMUNIDAD, EN INSTAGRAM ────────────────────────────────────────
   *
   * Seis publicaciones elegidas a mano, con su imagen y su enlace. Ver
   * `05-Instagram.astro` para el porqué de que no sea un feed en vivo, y
   * /public/imagenes/instagram/README.md para cómo se cambia una.
   *
   * ⚠️ LAS SEIS SON PLACEHOLDERS (16-09-2026): cuadrados de marca que
   * enlazan al perfil, hasta que el cliente pase las publicaciones reales
   * con sus enlaces. Se sustituyen una a una: imagen, `url` y `alt`.
   *
   * Sin promesa de cadencia en el título ("lo que compartimos", no "cada
   * semana"): la regla de no prometer lo que no se puede sostener.
   */
  instagram: {
    aria: { es: "La comunidad en Instagram", en: "The community on Instagram" },
    kicker: { es: "La comunidad, en Instagram", en: "The community, on Instagram" },
    titulo: { es: "Lo que compartimos", en: "What we share" },
    remate: { es: "con la comunidad.", en: "with the community." },
    usuario: "@emprende180academy",
    tambienFacebook: { es: "también en Facebook", en: "also on Facebook" },
    cta: { es: "Seguir en Instagram", en: "Follow on Instagram" },
    publicaciones: [1, 2, 3, 4, 5, 6].map((n) => ({
      imagen: `/imagenes/instagram/0${n}.webp`,
      url: "https://www.instagram.com/emprende180academy/",
      alt: {
        es: `Publicación ${n} de Emprende180 en Instagram`,
        en: `Entrepreneur180 Instagram post ${n}`,
      },
    })),
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
    /* "Únete a la comunidad" desde el 16-09-2026 (antes "Empezar"): el
       formulario es la puerta de la comunidad de Embajadores, y es lo que el
       cliente quiere que se lea al llegar aquí. */
    kicker: { es: "Únete a la comunidad", en: "Join the community" },
    titulo: [
      { es: "El primer paso", en: "The first step" },
      { es: "lo das tú, cuando quieras.", en: "is yours, whenever you want.", enfasis: true },
    ],
    /* El porqué, sin rodeos: es lo que separa "reservado" de "sospechoso". */
    porQue: {
      es: "Déjanos tu nombre y tu correo. Te escribimos, te contamos cómo se entra en la comunidad de Embajadores y decides tú.",
      en: "Leave us your name and your email. We'll write, tell you how to join the Ambassador community, and you decide.",
    },
    /* ⚠️ AQUÍ HABÍA TRES "HECHOS" DE DINERO ("un solo pago", "se puede pagar en
       partes", "el acceso no caduca") y se quitaron el 16-09-2026 a petición
       del cliente: el hero dice "sin inversión inicial" y nada del sitio puede
       contradecirlo. No se pintaban en ningún sitio (el formulario del cierre
       va en `minimo`), pero estaban a un cambio de prop de volver. */
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
      en: "First and last name of whoever told you about Entrepreneur180.",
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
      es: "El curso completo, los diez quizzes y tu Certificación de Embajador al superarlos. El acceso es tuyo para siempre.",
      en: "The complete course, all ten quizzes and your Ambassador Certification once you pass them. The access is yours for good.",
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
    /* A secas, a petición del cliente (15-09-2026). Decía "Preguntas que
       probablemente te estás haciendo". */
    titulo: {
      es: "Preguntas frecuentes",
      en: "Frequently asked questions",
    },

    /**
     * La columna del título es lo único que se ve mientras se recorren las
     * preguntas, así que no puede ser solo el título: tiene que decir qué son
     * estas respuestas y quién las escribe. `entradilla` hace ese trabajo.
     */
    entradilla: {
      es: "Las que más me llegan por teléfono, contestadas sin rodeos. Si algo aquí no te cuadra, prefiero que lo sepas antes de empezar y no después.",
      en: "The ones I get most on the phone, answered straight. If something here doesn't add up for you, I'd rather you knew before you start, not after.",
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
      en: "Play the Entrepreneur180 introduction video",
    },
    pistaSubtitulos: { es: "Español", en: "Spanish" },
  },

  /**
   * Los testimonios: rótulos de la banda que hubo y del carrusel que la
   * sustituyó el 15-09-2026. Ver `CarruselTestimonios.astro`.
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
    /* El carrusel de una tarjeta que sustituyó a la banda el 15-09-2026. Ver
       `CarruselTestimonios.astro`. */
    anterior: { es: "Testimonio anterior", en: "Previous testimonial" },
    siguiente: { es: "Testimonio siguiente", en: "Next testimonial" },
    irA: { es: "Ver el testimonio {n}", en: "Show testimonial {n}" },
    posicion: { es: "Testimonio {n} de {total}", en: "Testimonial {n} of {total}" },
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
       cambian los archivos en 09-Cierre.astro, estas frases se cambian con
       ellos: un alt que no coincide con la imagen es peor que no tener alt.

       Son las dos mismas personas de la primera pantalla, recortadas otra vez
       desde su original. La página cierra con las caras con las que abrió. */
    foto: {
      es: "Una mujer sonriendo mientras habla por teléfono en su casa",
      en: "A woman smiling while talking on the phone at home",
    },
    fotoSecundaria: {
      es: "Un hombre gesticulando mientras habla por teléfono en la calle",
      en: "A man gesturing while talking on the phone in the street",
    },
    /* La tercera no es ninguna de las dos caras del héroe: es una
       conversación entre dos, que es de lo que va la sección. */
    fotoTerciaria: {
      es: "Dos personas conversando sentadas en una mesa",
      en: "Two people talking at a table",
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
    /* ─── EL CHAT ─────────────────────────────────────────────────────────
       El botón flotante de abajo a la derecha y su panel. Lo pidió el
       cliente el 16-09-2026: "un chat widget, será de GHL; por el momento
       solo pon el botón y todo, después te paso el embebido". Así que esto
       es la MAQUETA: el botón, el panel con un texto honesto (no finge que
       haya nadie al otro lado en tiempo real) y las dos salidas que sí
       funcionan hoy: el formulario y el correo. Ver `ChatWidget.astro` para
       dónde va el embebido de GoHighLevel cuando llegue. */
    chat: {
      abrir: { es: "Abrir el chat", en: "Open chat" },
      cerrar: { es: "Cerrar el chat", en: "Close chat" },
      titulo: { es: "¿Hablamos?", en: "Shall we talk?" },
      texto: {
        es: "Cuéntanos qué buscas y te contestamos. Si prefieres, déjanos tus datos y te escribe alguien del equipo.",
        en: "Tell us what you are looking for and we will get back to you. Or leave your details and someone from the team will write to you.",
      },
      cta: { es: "Dejar mis datos", en: "Leave my details" },
      aviso: {
        es: "Aquí irá el chat de GoHighLevel. Mientras, este es el camino.",
        en: "The GoHighLevel chat will live here. In the meantime, this is the way.",
      },
    },
    /* La página de "no encontrado". Antes salía la de Astro por defecto, en
       inglés, sin barra ni pie y con "404: Not Found" de título. */
    noEncontrada: {
      titulo: { es: "Esta página no existe", en: "This page doesn't exist" },
      remate: { es: "o ya no está aquí.", en: "or it isn't here anymore." },
      texto: {
        es: "Puede que el enlace esté mal escrito o que hayamos movido la página. Lo que buscas seguramente está en uno de estos sitios.",
        en: "The link may be misspelled, or we may have moved the page. What you are looking for is probably in one of these places.",
      },
      volver: { es: "Ir a la portada", en: "Go to the home page" },
      codigo: { es: "Error 404", en: "Error 404" },
    },
    visitanos: { es: "Visítanos", en: "Visit us" },
    comoLlegar: { es: "Cómo llegar", en: "Get directions" },
    visitanosTexto: {
      es: "Si estás por Salt Lake, pasa a vernos. Una conversación en persona vale más que veinte correos.",
      en: "If you're around Salt Lake, come by. A conversation in person is worth more than twenty emails.",
    },
    /* ⚠️ ESTOS DOS RÓTULOS NO SE PINTAN DESDE EL 15-09-2026. El mapa de Google
       nació detrás de un botón "Ver el mapa", porque un `<iframe>` de Maps pone
       cookies de Google al pintarse y la regla de la web es no conectar con
       terceros sin que el visitante lo pida (ver `lib/consent.ts`). El cliente
       pidió que el mapa se viera directamente y el botón se quitó; se dejan
       por si vuelve. Pendiente: Google Maps en la política de privacidad. */
    mapaCargar: { es: "Ver el mapa", en: "Show the map" },
    mapaAviso: {
      es: "Al verlo se conecta con Google Maps.",
      en: "Showing it connects to Google Maps.",
    },
    mapaTitulo: {
      es: "Mapa de Google con la dirección de Emprende180",
      en: "Google map with the Entrepreneur180 address",
    },
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
