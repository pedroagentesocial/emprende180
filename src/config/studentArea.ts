import type { Txt } from "@i18n/idioma";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STUDENT AREA COPY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every word of `/login`, `/student` and `/admin`, in both languages.
 *
 * ─── WHY IT LEFT `curso.config.ts` ─────────────────────────────────────────
 *
 * It used to be a block inside the landing config, and that was the right place
 * while `/login` was a page that only explained that the area was being built.
 * It stopped being right the day it became a real product: the landing config is
 * a sales document — price, testimonials, syllabus, FAQ — and the sign-in screen
 * has nothing to do with any of it. Two things that change for different reasons
 * and at different times should not share a file.
 *
 * ⚠️ THE KEYS ARE ENGLISH, THE VALUES ARE BOTH LANGUAGES. The keys are code; the
 * values are what the student reads. `{ es, en }` is the `Txt` shape the rest of
 * the site uses, and `<T>` paints the one that applies.
 *
 * ─── WHAT IS WRITTEN HERE IS WHAT THE SCREEN ACTUALLY DOES ─────────────────
 *
 * Two of these strings used to promise something else. The sign-in page still
 * said "we'll send you a link to get in, no passwords to remember" while showing
 * a password field, and the page description still said the area was "being
 * built" months after it opened. Copy that contradicts the screen it sits on is
 * a bug: the visitor stops trusting what they read and starts guessing.
 */

export const studentCopy = {
  title: { es: "Acceso de alumnos", en: "Student access" },
  kicker: { es: "Área de alumnos", en: "Student area" },
  intro: {
    es: "Entra con el correo con el que te dimos de alta. Si es tu primera vez o no recuerdas tu contraseña, te mandamos un enlace para ponerla.",
    en: "Sign in with the email we registered you with. If it's your first time or you don't remember your password, we'll send you a link to set it.",
  },

  /** What's inside. All of it is already promised on the sales page. */
  whatsInside: {
    title: { es: "Qué vas a encontrar dentro", en: "What you'll find inside" },
    points: [
      {
        es: "Los 10 videos del curso, en orden y con acceso de por vida",
        en: "The 10 course videos, in order and with lifetime access",
      },
      {
        es: "Los 10 quizzes de validación, uno por video",
        en: "The 10 validation quizzes, one per video",
      },
      {
        es: "Tu Certificación de Embajador Emprende180 al superarlos",
        en: "Your Emprende180 Ambassador Certification once you pass them",
      },
    ] satisfies Txt[],
  },

  /* ─── The left column ──────────────────────────────────────────────────── */
  /**
   * ⚠️ IT SAYS "PORTAL" AND NOT "ENTRA A TU CURSO", and the word was chosen
   * rather than translated. This stopped being a course player the day the
   * Academy moved to an external platform: what is behind the door is the CRM,
   * the training and the certification, so a title promising "your course" is
   * already describing two thirds of it wrong.
   *
   * "Portal" carries in both languages, is what people call this kind of
   * screen, and it is two words instead of a sentence.
   */
  portalTitle: { es: "Portal del alumno", en: "Student portal" },
  portalText: {
    es: "Tu formación y tus contactos, en un solo sitio.",
    en: "Your training and your contacts, in one place.",
  },

  /* ─── The sign-in card ─────────────────────────────────────────────────── */
  cardTitle: { es: "Entrar", en: "Sign in" },
  cardText: {
    es: "Con el correo con el que te dimos de alta.",
    en: "With the email we registered you with.",
  },
  /* Una palabra por etiqueta. "Tu correo" y "Tu contraseña" decían lo mismo con
     un posesivo de más: en un formulario de acceso no hay más correo que el
     tuyo, y el campo ya lleva su icono al lado. */
  emailLabel: { es: "Correo", en: "Email" },
  passwordLabel: { es: "Contraseña", en: "Password" },
  signIn: { es: "Entrar", en: "Sign in" },
  signingIn: { es: "Entrando…", en: "Signing in…" },
  /* One message for all three possible failures. See `/api/login`. */
  errorCredentials: {
    es: "Correo o contraseña incorrectos.",
    en: "Wrong email or password.",
  },
  errorLimit: {
    es: "Demasiados intentos. Espera unos minutos y vuelve a probar.",
    en: "Too many attempts. Wait a few minutes and try again.",
  },

  /* ─── Forgotten password ───────────────────────────────────────────────── */
  /**
   * It sits in the password field's label row, on the right, which is where
   * everybody looks for it. It used to be a full-width line under the button
   * saying "it's my first time or I forgot my password" — long enough to wrap
   * onto two underlined centred lines, so it read as a second, weaker button
   * competing with the real one.
   *
   * ⚠️ THE FIRST-TIME CASE DIDN'T GET LOST WITH THE WORDS. Whoever has never
   * had a password lands on the same screen through the same link, and the
   * recovery panel opens saying it in full: "sirve igual si es la primera vez
   * que entras". The explanation moved to where it is read, instead of living
   * in a link label that had to cover two situations at once.
   */
  forgot: {
    es: "¿La has olvidado?",
    en: "Forgot it?",
  },
  forgotTitle: { es: "Recupera tu acceso", en: "Recover your access" },
  forgotText: {
    es: "Escribe tu correo y te mandamos un enlace para poner tu contraseña. Sirve igual si es la primera vez que entras.",
    en: "Enter your email and we'll send you a link to set your password. Works the same if it's your first time.",
  },
  backToSignIn: { es: "Volver a entrar", en: "Back to sign in" },
  sendLink: { es: "Mandarme el enlace", en: "Send me the link" },
  sending: { es: "Mandando…", en: "Sending…" },

  /* ─── Setting a password ───────────────────────────────────────────────── */
  password: {
    aria: { es: "Tu contraseña", en: "Your password" },
    titleNew: { es: "Ponte una contraseña", en: "Set your password" },
    titleChange: { es: "Cambia tu contraseña", en: "Change your password" },
    text: {
      es: "Es la que usarás para entrar a partir de ahora. Mínimo {min} caracteres: lo que importa es que sea larga, no que lleve símbolos raros.",
      en: "This is what you'll use to sign in from now on. At least {min} characters: what matters is length, not odd symbols.",
    },
    label: { es: "Contraseña nueva", en: "New password" },
    repeat: { es: "Repítela", en: "Repeat it" },
    show: { es: "Ver la contraseña", en: "Show password" },
    hide: { es: "Ocultar la contraseña", en: "Hide password" },
    save: { es: "Guardar y entrar", en: "Save and continue" },
    saving: { es: "Guardando…", en: "Saving…" },
    errorShort: {
      es: "Muy corta: mínimo {min} caracteres.",
      en: "Too short: at least {min} characters.",
    },
    errorLong: { es: "Demasiado larga.", en: "Too long." },
    errorMismatch: { es: "Las dos no coinciden.", en: "The two don't match." },
    /* Notice on the dashboard while there is no password. */
    pendingTitle: {
      es: "Te falta ponerte una contraseña",
      en: "You still need to set a password",
    },
    pendingText: {
      es: "Sin ella tendrás que pedir un enlace por correo cada vez que quieras entrar.",
      en: "Without one you'll have to request an email link every time you want to sign in.",
    },
    pendingCta: { es: "Ponerla ahora", en: "Set it now" },
  },

  /* Deliberately ambiguous: it doesn't confirm whether the email is registered.
     See the note on `POST /api/magic-link`. */
  linkSent: {
    es: "Si ese correo está dado de alta, acabamos de mandarte el enlace. Caduca en 20 minutos.",
    en: "If that email is registered, we've just sent you the link. It expires in 20 minutes.",
  },
  errorEmail: { es: "Revisa el correo.", en: "Check the email address." },
  /* Only reachable with Turnstile switched on. See `src/lib/captcha.ts`. */
  errorCaptcha: {
    es: "Confirma que no eres un robot y vuelve a intentarlo.",
    en: "Confirm you're not a robot and try again.",
  },
  errorGeneral: {
    es: "No hemos podido mandarlo. Inténtalo otra vez o llámame.",
    en: "We couldn't send it. Try again or give me a call.",
  },
  /** When the link has already been used or has expired. */
  errorExpired: {
    es: "Ese enlace ya no vale: o se ha usado o han pasado los 20 minutos. Pide otro, tarda un segundo.",
    en: "That link is no longer valid: either it's been used or the 20 minutes passed. Ask for another one, it takes a second.",
  },
  signedOut: { es: "Has salido de tu cuenta.", en: "You've been signed out." },

  /* ─── Ayuda, en el portal del alumno ───────────────────────────────────────
     Tres salidas para las tres cosas distintas que le pueden pasar a alguien que
     ya está dentro: algo no funciona, tengo una duda, o esto se podría hacer
     mejor. Van juntas y abajo porque son la red de seguridad, no el trabajo.

     ⚠️ NINGUNA PROMETE UN HORARIO NI UN PLAZO. Decir "te contestamos en 24 h"
     es una promesa que hay que cumplir todos los días; decir a dónde escribir es
     cierto siempre. */
  help: {
    title: { es: "¿Necesitas algo?", en: "Need anything?" },
    text: {
      es: "Si algo no funciona, si tienes una duda o si se te ocurre cómo mejorar esto, por aquí llegas a una persona.",
      en: "If something is broken, if you have a question, or if you can think of a way to improve this, these reach a person.",
    },

    callTitle: { es: "Asistencia técnica", en: "Technical help" },
    callText: {
      es: "Algo no carga o no te deja entrar. Llámanos y lo vemos.",
      en: "Something won't load or won't let you in. Call and we'll look at it.",
    },
    callCta: { es: "Llamar", en: "Call" },

    mailTitle: { es: "Escríbenos", en: "Write to us" },
    mailText: {
      es: "Cualquier duda sobre el curso, tu cuenta o tu certificación.",
      en: "Any question about the course, your account or your certification.",
    },
    mailCta: { es: "Mandar un correo", en: "Send an email" },
    mailSubject: {
      es: "Duda desde el portal de alumnos",
      en: "Question from the student portal",
    },

    feedbackTitle: { es: "Tu opinión", en: "Your feedback" },
    feedbackText: {
      es: "Qué te falta, qué te sobra y qué cambiarías. Se lee todo.",
      en: "What's missing, what's in the way, what you'd change. All of it gets read.",
    },
    feedbackCta: { es: "Contar qué mejorarías", en: "Tell us what to improve" },
    feedbackSubject: {
      es: "Sugerencia para el portal",
      en: "Suggestion for the portal",
    },
  },

  /* ─── The portal's navigation ──────────────────────────────────────────── */
  nav: {
    aria: { es: "Secciones del portal", en: "Portal sections" },
    home: { es: "Inicio", en: "Home" },
    people: { es: "Alumnos", en: "Students" },
    agents: { es: "Agentes", en: "Agents" },
    coupons: { es: "Cupones", en: "Coupons" },
    settings: { es: "Ajustes", en: "Settings" },
  },

  /* ─── Cupones ──────────────────────────────────────────────────────────────
     ⚠️ EL TEXTO DICE LO QUE UN CUPÓN HACE DE VERDAD, que no es descontar. Aquí
     no se cobra —el pago se cierra por teléfono—, así que un cupón es una
     promesa con nombre: alguien lo escribe en el formulario y quien le llama ve
     qué precio se le prometió. Escribir "aplica un 20% al pago" sería mentir
     sobre una pasarela que no existe. */
  coupons: {
    title: { es: "Cupones", en: "Coupons" },
    intro: {
      es: "Códigos que alguien escribe en el formulario de la página. No descuentan solos: cuando ese lead entra, ves su cupón en el aviso y en su ficha de GHL, y quien llama ya sabe qué precio prometerle.",
      en: "Codes somebody types into the page's form. They don't discount by themselves: when that lead comes in, you see their coupon in the notification and on their GHL record, so whoever calls already knows what price to offer.",
    },

    newTitle: { es: "Crear un cupón", en: "Create a coupon" },
    fieldCode: { es: "Código", en: "Code" },
    fieldCodeHelp: {
      es: "Se guarda en mayúsculas y sin espacios.",
      en: "Stored uppercase, without spaces.",
    },
    fieldDescription: { es: "Para qué es (opcional)", en: "What it's for (optional)" },
    fieldKind: { es: "Tipo", en: "Type" },
    kindPercent: { es: "Porcentaje", en: "Percentage" },
    kindAmount: { es: "Importe fijo", en: "Fixed amount" },
    fieldValue: { es: "Valor", en: "Value" },
    fieldExpires: { es: "Caduca el (opcional)", en: "Expires on (optional)" },
    fieldMaxUses: { es: "Usos máximos (opcional)", en: "Maximum uses (optional)" },
    fieldAgent: { es: "De qué agente (opcional)", en: "Whose agent code (optional)" },
    agentNone: { es: "De la casa", en: "In-house" },
    create: { es: "Crear cupón", en: "Create coupon" },

    columnCode: { es: "Código", en: "Code" },
    columnDiscount: { es: "Descuento", en: "Discount" },
    columnState: { es: "Estado", en: "State" },
    columnRequested: { es: "Lo han pedido", en: "Requested" },
    columnSales: { es: "Altas", en: "Sign-ups" },

    stateActive: { es: "Activo", en: "Active" },
    stateOff: { es: "Apagado", en: "Off" },
    stateExpired: { es: "Caducado", en: "Expired" },
    stateUsedUp: { es: "Agotado", en: "Used up" },

    turnOff: { es: "Apagar", en: "Turn off" },
    turnOn: { es: "Encender", en: "Turn on" },

    empty: {
      es: "Todavía no hay cupones. Crea uno y ya se puede escribir en el formulario de la página.",
      en: "No coupons yet. Create one and it can be typed into the page's form right away.",
    },

    noticeCreated: { es: "Cupón {code} creado.", en: "Coupon {code} created." },
    noticeExists: { es: "{code} ya existe.", en: "{code} already exists." },
    noticeBadCode: {
      es: "El código necesita al menos tres caracteres, sin espacios.",
      en: "The code needs at least three characters, no spaces.",
    },
    noticeBadValue: {
      es: "El valor tiene que ser un número mayor que cero (y como mucho 100 si es porcentaje).",
      en: "The value has to be a number above zero (and at most 100 for a percentage).",
    },
    noticeOff: { es: "Cupón apagado.", en: "Coupon turned off." },
    noticeOn: { es: "Cupón encendido.", en: "Coupon turned on." },
  },

  /* ─── Ajustes: el estado de las conexiones ─────────────────────────────────
     Esta pantalla no configura nada, INFORMA. Los secretos viven en las
     variables de entorno de Vercel, que es donde tienen que vivir: un panel que
     deja escribir una clave de API es un panel que tiene que guardarla, y ese es
     un sitio más del que puede escaparse.

     Lo que hace es contestar la pregunta que se hace todos los días quien monta
     esto: "¿qué me falta para que funcione?". */
  settings: {
    title: { es: "Ajustes", en: "Settings" },
    intro: {
      es: "Qué está conectado y qué no. Esta pantalla solo mira: las claves se ponen en las variables de entorno del proyecto, nunca desde aquí.",
      en: "What's connected and what isn't. This screen only looks: keys go in the project's environment variables, never from here.",
    },
    on: { es: "Conectado", en: "Connected" },
    off: { es: "Sin configurar", en: "Not set up" },
    varLabel: { es: "Variable", en: "Variable" },

    dbTitle: { es: "Base de datos", en: "Database" },
    dbText: {
      es: "Donde viven los alumnos, las sesiones y los enlaces. Sin ella, el portal no arranca en producción: es a propósito, porque una base en memoria detrás de varias instancias no es peor, es incorrecta.",
      en: "Where students, sessions and links live. Without it the portal refuses to start in production, on purpose: an in-memory store behind several instances isn't worse, it's wrong.",
    },
    mailTitle: { es: "Correo (Resend)", en: "Email (Resend)" },
    mailText: {
      es: "Manda el enlace de entrada al alumno. Sin esto, el enlace se escribe en la consola del servidor y hay que pasarlo a mano.",
      en: "Sends the sign-in link to the student. Without it, the link is written to the server console and has to be passed along by hand.",
    },
    ghlTitle: { es: "GoHighLevel", en: "GoHighLevel" },
    ghlText: {
      es: "Cada alta, baja y reactivación se manda al workflow de GHL para que allí se cree el contacto y se le dé o se le quite el curso. También se avisa de la activación: la primera vez que el alumno entra de verdad, que es otra cosa que darlo de alta. Va sin esperar respuesta: si GHL falla, el alta sigue siendo válida aquí.",
      en: "Every sign-up, deactivation and reactivation is sent to the GHL workflow so the contact is created there and the course granted or revoked. Activation is sent too: the first time the student actually signs in, which is not the same as being registered. It doesn't wait for an answer: if GHL fails, the sign-up still stands here.",
    },
    captchaTitle: { es: "Captcha (Turnstile)", en: "Captcha (Turnstile)" },
    captchaText: {
      es: "Protege el acceso y la petición de enlaces. Al encenderlo, el formulario deja de funcionar sin JavaScript: es un intercambio consciente.",
      en: "Protects sign-in and link requests. Turning it on stops the form working without JavaScript: a deliberate trade.",
    },
    crmTitle: { es: "Las dos puertas del alumno", en: "The student's two doors" },
    crmText: {
      es: "Las direcciones del CRM y de la Academia. Mientras estén vacías, las dos tarjetas del portal salen apagadas con un 'Próximamente' en vez de un botón que no lleva a ningún sitio.",
      en: "The CRM and Academy addresses. While they're empty, both cards show a muted 'coming soon' instead of a button that leads nowhere.",
    },
  },

  /* ─── The dashboard ────────────────────────────────────────────────────── */
  dashboard: {
    aria: { es: "Tu curso", en: "Your course" },
    greeting: { es: "Hola, {name}", en: "Hi {name}" },
    greetingNoName: { es: "Hola", en: "Hi" },
    signOut: { es: "Salir", en: "Sign out" },
    adminPanel: { es: "Panel", en: "Admin" },

    /* ─── EL RECIBIDOR ────────────────────────────────────────────────────
       ⚠️ AQUÍ YA NO HAY TITULAR. Decía "Ya estás dentro", y era una frase que
       le contaba a alguien algo que esa persona ya sabía: acaba de escribir su
       contraseña. Ocupaba la línea más grande de la pantalla para no decir
       nada. Lo que queda es el saludo con su nombre, y debajo lo que sí es
       información: cuándo estuvo aquí la última vez. */
    lastVisit: { es: "Tu última visita fue el {fecha}", en: "You were last here on {fecha}" },
    firstVisit: { es: "Es tu primera visita. Bienvenido.", en: "This is your first visit. Welcome." },
    welcomeText: {
      es: "Tus dos herramientas de Embajador: donde viven tus contactos y donde vive tu formación.",
      en: "Your two Ambassador tools: where your contacts live, and where your training lives.",
    },
    /* Lo que lee un agente, que no tiene las dos puertas: su portal va de la
       gente que da de alta, no del curso. */
    welcomeTextAgent: {
      es: "Aquí llevas a la gente que te compra el curso: das de alta, ves quién ha entrado ya y a quién hay que reenviarle su enlace.",
      en: "This is where you keep the people who buy the course from you: register them, see who is already in, and resend the link to whoever needs it.",
    },
    /* Label on each card's button. Short on purpose: the whole card already says
       where it leads, so the button only has to push. */
    go: { es: "Ir", en: "Go" },
    /* When the card has no address yet. See `plataformas` in the course config. */
    comingSoon: { es: "Próximamente", en: "Coming soon" },
    /* Warning that the link opens outside the site. It goes to the screen
       reader: a link that takes you to another tab without warning disorients. */
    opensOutside: {
      es: "se abre en una pestaña nueva",
      en: "opens in a new tab",
    },
  },

  /* ─── The staff panel ──────────────────────────────────────────────────── */
  admin: {
    title: { es: "Alumnos", en: "Students" },
    intro: {
      es: "Das de alta un correo y esa persona ya puede entrar: le mandamos un enlace, elige su contraseña y a partir de ahí entra con ella.",
      en: "Register an email and that person can get in: we send them a link, they choose their password, and from then on they sign in with it.",
    },
    /** What an agent reads instead: same panel, their own list. */
    introAgent: {
      es: "Aquí das de alta a la gente que te compra el curso. Le mandamos su enlace de entrada y ves quién ha entrado ya y quién no. Esta lista es la tuya: solo salen los que has dado de alta tú.",
      en: "This is where you register the people who buy the course from you. We send them their sign-in link and you can see who has come in and who hasn't. This list is yours: only the people you registered appear here.",
    },

    /* ─── Roles ───────────────────────────────────────────────────────────
       The words the panel uses for each role. `roleStudent` is also what an
       agent's list shows in every row, so it has to read like a person and not
       like a database value. */
    fieldRole: { es: "Qué es", en: "Role" },
    roleStudent: { es: "Alumno", en: "Student" },
    roleAgent: { es: "Agente", en: "Agent" },
    roleAdmin: { es: "Admin", en: "Admin" },
    roleStudentHint: {
      es: "Compró el curso. Entra y ve sus dos accesos.",
      en: "Bought the course. Signs in and sees their two doors.",
    },
    roleAgentHint: {
      es: "Vende. Puede dar de alta a quien le compra y ver SU lista, no la de todos.",
      en: "Sells. Can register their own buyers and see THEIR list, not everyone's.",
    },
    roleAdminHint: {
      es: "Lo ve y lo puede todo. Solo para quien lleva el negocio.",
      en: "Sees and can do everything. Only for whoever runs the business.",
    },

    /* ─── Resending the link ──────────────────────────────────────────────
       The single most common support call — "it never arrived" — and until now
       the only answer was telling the student to use "I forgot my password". */
    resend: { es: "Reenviar enlace", en: "Resend link" },
    noticeResent: {
      es: "Enlace reenviado a {email}. Caduca en 20 minutos.",
      en: "Link resent to {email}. It expires in 20 minutes.",
    },
    columnRegisteredBy: { es: "Alta por", en: "Registered by" },
    registeredByHouse: { es: "La casa", en: "In-house" },
    newTitle: { es: "Dar de alta", en: "Add a student" },
    fieldEmail: { es: "Correo", en: "Email" },
    fieldName: { es: "Nombre (opcional)", en: "Name (optional)" },
    add: { es: "Dar de alta", en: "Add" },
    /** Adding with this button also sends the student their sign-in link. */
    addAndSend: {
      es: "Dar de alta y mandarle el enlace",
      en: "Add and send them the link",
    },
    columnStudent: { es: "Alumno", en: "Student" },
    columnStatus: { es: "Estado", en: "Status" },
    columnLastSignIn: { es: "Último acceso", en: "Last access" },
    active: { es: "Activo", en: "Active" },
    inactive: { es: "Dado de baja", en: "Deactivated" },
    never: { es: "Nunca ha entrado", en: "Never signed in" },
    deactivate: { es: "Dar de baja", en: "Deactivate" },
    reactivate: { es: "Reactivar", en: "Reactivate" },
    empty: { es: "Todavía no hay ningún alumno.", en: "No students yet." },
    /** Warning shown when the area runs with no database. */
    noDatabase: {
      es: "Estás en modo desarrollo SIN base de datos: los alumnos que des de alta se pierden al reiniciar. Define DATABASE_URL para que sea de verdad.",
      en: "You're in development mode WITHOUT a database: any student you add is lost on restart. Set DATABASE_URL to make it real.",
    },
    /* ─── The one-off link, for sending by hand ───────────────────────────
       Only appears with `entregaAcceso.mostrarEnlaceEnPanel` on. It is a key,
       not a piece of the student's record: it is shown once and gone on reload. */
    linkTitle: { es: "Enlace de acceso de esta alta", en: "Sign-in link for this student" },
    linkText: {
      es: "Caduca en 20 minutos y sirve una sola vez. Mándaselo solo a esa persona: quien lo tenga entra en su cuenta.",
      en: "It expires in 20 minutes and works once. Send it only to that person: whoever holds it gets into their account.",
    },
    copy: { es: "Copiar", en: "Copy" },
    copied: { es: "Copiado", en: "Copied" },
    actions: { es: "Acciones", en: "Actions" },

    /* ─── What the panel answers after an action ──────────────────────────
       These used to be Spanish string literals inside the page. They live here
       for the same reason as everything else on this screen: the panel is part
       of a bilingual site, and a notice that is always in one language is the
       one thing that gives away where the copy really lives. `{email}` is
       filled in by `interpolar`. */
    noticeInvalidEmail: {
      es: "Ese correo no es válido.",
      en: "That email address isn't valid.",
    },
    noticeAlreadyExists: {
      es: "{email} ya estaba dado de alta.",
      en: "{email} was already registered.",
    },
    noticeAdded: { es: "{email} dado de alta.", en: "{email} registered." },
    noticeLinkSent: {
      es: "Le hemos mandado el enlace.",
      en: "We've sent them the link.",
    },
    noticeLinkInConsole: {
      es: "El enlace está en la consola del servidor (falta Resend).",
      en: "The link is in the server console (Resend isn't configured).",
    },
    noticeLinkFailed: {
      es: "Pero el correo NO salió: revisa Resend.",
      en: "But the email did NOT go out: check Resend.",
    },
    noticeNotYourself: {
      es: "No puedes darte de baja a ti mismo.",
      en: "You can't deactivate yourself.",
    },
    /* What somebody gets when they aim at a row that isn't theirs, or at an
       action their role doesn't have. It doesn't explain which of the two it
       was: an agent poking at ids doesn't need to be told whether the id
       exists. */
    noticeNotAllowed: {
      es: "No puedes hacer eso.",
      en: "You can't do that.",
    },
    noticeReactivated: { es: "Reactivado.", en: "Reactivated." },
    noticeDeactivated: { es: "Dado de baja.", en: "Deactivated." },
    noticeRoleChanged: {
      es: "{email} ahora es {role}.",
      en: "{email} is now {role}.",
    },

    /* ─── El resumen ──────────────────────────────────────────────────────
       Cuatro cuentas, en una línea, y cada una FILTRA la lista. No son un
       marcador: son la forma más corta de preguntar "enséñame esos". Un número
       que no lleva a ninguna parte se mira una vez y ya. */
    /* "Todos" y no "Alumnos": esta cuenta incluye a los agentes y a ti, así que
       llamarla alumnos sería un número que no cuadra con su propio rótulo. Y
       encima repetía el titular de la página. */
    summaryAll: { es: "Todos", en: "Everyone" },
    summaryIn: { es: "Han entrado", en: "Signed in" },
    summaryNeverIn: { es: "Sin entrar", en: "Never signed in" },
    summaryAgents: { es: "Agentes", en: "Agents" },
    /* Singular, para no escribir "1 Agentes". Los otros tres rótulos valen para
       cualquier número. */
    summaryAgentOne: { es: "Agente", en: "Agent" },
    summaryInactive: { es: "De baja", en: "Deactivated" },

    /* ─── Lo que pide atención ────────────────────────────────────────────
       Solo aparece cuando de verdad hay algo. Un panel que siempre enseña un
       aviso enseña a no mirar los avisos. */
    attentionTitle: {
      es: "{n} pagaron y todavía no han entrado",
      en: "{n} paid and haven't come in yet",
    },
    attentionTitleOne: {
      es: "1 pagó y todavía no ha entrado",
      en: "1 paid and hasn't come in yet",
    },
    attentionText: {
      es: "El enlace de acceso caduca en 20 minutos, así que lo normal es que se les haya pasado. Reenvíaselo desde su fila.",
      en: "The sign-in link expires in 20 minutes, so the usual reason is that it timed out. Resend it from their row.",
    },
    attentionCta: { es: "Ver quiénes son", en: "See who they are" },

    /* ─── Buscar ──────────────────────────────────────────────────────── */
    searchLabel: { es: "Buscar", en: "Search" },
    searchPlaceholder: { es: "Nombre o correo", en: "Name or email" },
    searchClear: { es: "Quitar filtros", en: "Clear filters" },
    noResults: {
      es: "Ningún alumno con esos filtros.",
      en: "No students match those filters.",
    },

    /* ─── Altas por agente ────────────────────────────────────────────────
       La cuenta de quién ha vendido qué. Es la tabla que hará falta el día que
       haya que pagar comisiones, y hoy ya dice qué agente está trabajando. */
    byAgentTitle: { es: "Altas por agente", en: "Sign-ups by agent" },
    byAgentColumnAgent: { es: "Agente", en: "Agent" },
    byAgentColumnTotal: { es: "Ha dado de alta", en: "Registered" },
    byAgentColumnIn: { es: "Han entrado", en: "Signed in" },
    byAgentEmpty: {
      es: "Ningún agente ha dado de alta a nadie todavía.",
      en: "No agent has registered anybody yet.",
    },
    byAgentHouse: { es: "Altas de la casa", en: "In-house sign-ups" },

    /* ─── El estado de cada fila ──────────────────────────────────────────
       Tres estados y no dos: "activo" no distinguía a quien ya está usando el
       curso de quien pagó y sigue fuera, que es justo la diferencia que hay que
       ver de un vistazo. */
    statusIn: { es: "Dentro", en: "Inside" },
    statusWaiting: { es: "Sin entrar", en: "Not in yet" },
    statusInactive: { es: "De baja", en: "Deactivated" },

    /* ─── La lista vacía, que además enseña ───────────────────────────────
       Un agente nuevo abre esto y no tiene a nadie. "No hay alumnos" sería
       cierto e inútil: lo que necesita es saber qué pasa cuando dé de alta al
       primero, que es exactamente la pregunta con la que llega. */
    emptyTitle: { es: "Aquí van tus alumnos", en: "Your students go here" },
    emptyStep1: {
      es: "Escribes su correo aquí arriba y le das a dar de alta.",
      en: "Type their email above and press add.",
    },
    emptyStep2: {
      es: "Le llega un enlace suyo, que caduca en 20 minutos.",
      en: "They get their own link, and it expires in 20 minutes.",
    },
    emptyStep3: {
      es: "Elige su contraseña y ya entra cuando quiera.",
      en: "They choose a password and can get in whenever they like.",
    },

    /* ─── Las métricas del inicio ─────────────────────────────────────────
       Tres frases con un número dentro, no tres cajas con un número gigante.
       Cada una responde una pregunta que alguien que vende se hace de verdad:
       cuánto he movido este mes, cuántos de los míos están usando lo que
       compraron, y cuándo fue la última vez que entró alguien nuevo.

       ⚠️ NINGUNA HABLA DE DINERO. El cobro pasa fuera de este sistema, así que
       cualquier cifra de ingresos sería una suposición con pinta de dato. */
    statsTitle: { es: "Cómo va", en: "How it's going" },
    statMonth: { es: "altas en los últimos 30 días", en: "sign-ups in the last 30 days" },
    statActivation: {
      es: "de {total} han entrado al menos una vez",
      en: "of {total} have signed in at least once",
    },
    statLast: { es: "última alta: {fecha}", en: "latest sign-up: {fecha}" },
    statLastNever: { es: "todavía no has dado de alta a nadie", en: "you haven't registered anybody yet" },
    statLastNeverAdmin: { es: "todavía no hay altas", en: "no sign-ups yet" },

    /* ─── Los botones del inicio ──────────────────────────────────────────
       Lo que se hace desde aquí sin tener que buscarlo. Son atajos a sitios que
       ya existen, no funciones nuevas: un panel se mide por los pasos que
       ahorra, no por los botones que enseña. */
    quickAdd: { es: "Dar de alta", en: "Add someone" },
    quickWaiting: { es: "Ver sin entrar", en: "See who's waiting" },
    quickAll: { es: "Ver la lista", en: "See the list" },
    quickAgents: { es: "Ver agentes", en: "See agents" },

    /* ─── Cambiar el rol ──────────────────────────────────────────────── */
    makeAgent: { es: "Hacer agente", en: "Make agent" },
    makeStudent: { es: "Hacer alumno", en: "Make student" },
  },

  /** For anyone who got here by mistake. */
  notACustomer: {
    /**
     * One line, on the sign-in screen.
     *
     * It replaced a bordered box with a heading, a paragraph and two buttons.
     * That block gave the least frequent visitor on the page the second most
     * furniture on it, and it sat between the form and the footer, where it
     * caught the eye of everybody who had come to do something else.
     */
    line: {
      es: "¿Todavía no lo has comprado?",
      en: "Haven't bought it yet?",
    },
    title: { es: "Todavía no lo he comprado", en: "I haven't bought it yet" },
    text: {
      es: "Entonces esto no es para ti todavía. Vuelve a la página y mira qué incluye.",
      en: "Then this isn't for you yet. Head back to the page and see what's included.",
    },
    cta: { es: "Ver el curso", en: "See the course" },
  },
} as const;
