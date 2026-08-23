import postgres from "postgres";
/* Only the IN-MEMORY store uses this, to derive the hash of `DEMO_CLAVE`. The
   Postgres store never hashes anything: it receives the finished hash from
   `@lib/auth`. */
import { hashPassword } from "@lib/passwords";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STUDENT AREA DATA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * One contract (`Repo`) with two implementations:
 *
 *   · POSTGRES — the real one. Used as soon as `DATABASE_URL` exists.
 *   · MEMORY   — development only, and only when there is no `DATABASE_URL`.
 *
 * WHY THE MEMORY ONE EXISTS. Without it, the student area couldn't be opened or
 * tested until a database was paid for: all of this work would sit unverified
 * and undemoable. With it, the whole flow — request the link, sign in, see the
 * dashboard, add a student — works today under `npm run dev`.
 *
 * ⚠️ AND WHY IT CAN NEVER REACH PRODUCTION. A memory store empties on every
 * boot and is NOT shared between instances: on Vercel, two consecutive requests
 * can land in different processes, so someone would sign in and be signed out
 * on the next screen. Worse: every instance would start with an empty student
 * list. That is why, in production, a missing `DATABASE_URL` is a hard startup
 * error rather than a silent downgrade.
 *
 * ⚠️ NO PROVIDER SDK IS USED. Just `DATABASE_URL`, which every provider gives:
 * Neon, Supabase, RDS or a local container. Switching provider is switching one
 * environment variable.
 *
 * ─── THE SQL NAMES STAY IN SPANISH, ON PURPOSE ─────────────────────────────
 *
 * The tables and columns (`alumnos`, `clave_hash`, `alta_en`…) keep the names
 * they were created with, and this file is the ONLY place where they appear.
 * Renaming them means an `ALTER TABLE` against a live database — a migration,
 * with a deploy that has to be ordered against it. That is a separate, planned
 * job, not a side effect of tidying the code. Everything above this boundary is
 * English; the mapping happens in `toStudent()` and in the queries below.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = "student" | "agent" | "admin";

export interface Student {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  language: "es" | "en";
  active: boolean;
  createdAt: Date;
  lastSignIn: Date | null;
  /**
   * The sign-in BEFORE this one, or `null` for somebody who has only ever come
   * in once.
   *
   * ⚠️ THIS IS THE ONE WORTH SHOWING. `lastSignIn` is stamped as you come in, so
   * showing it to the person who just arrived says "your last visit: one second
   * ago" — true, and useless. The question anybody actually asks is "when was I
   * here before", and that is this.
   */
  previousSignIn: Date | null;
  /**
   * The agent who registered them, or `null` if Pedro did.
   *
   * It is what makes an agent's list theirs and only theirs, and it is the
   * record of who sold what. See the column note in `db/schema.sql`.
   */
  registeredBy: string | null;
  /**
   * `true` once a password has been set.
   *
   * ⚠️ THE HASH DOES NOT TRAVEL IN HERE, DELIBERATELY. This object ends up in
   * `Astro.locals` and from there it can reach any template; a boolean cannot
   * leak by accident. The hash is only ever read by the password check, which
   * is the one function that needs it.
   */
  hasPassword: boolean;
  /**
   * El código con el que llegó, si llegó con alguno.
   *
   * Texto y no una clave foránea: si algún día se borra el cupón, la ficha tiene
   * que seguir diciendo con qué promesa entró esta persona.
   */
  coupon: string | null;
}

/**
 * Un cupón.
 *
 * ⚠️ NO DESCUENTA NADA POR SÍ MISMO, porque en este sistema no se cobra. Es una
 * promesa con nombre: alguien lo escribe en el formulario de la landing y quien
 * le llame verá qué precio se le prometió. Ver la nota de `cupones` en
 * `db/schema.sql`.
 */
export interface Coupon {
  id: string;
  /** Siempre en mayúsculas. Se normaliza al escribir y al buscar. */
  code: string;
  description: string | null;
  kind: "percent" | "amount";
  value: number;
  active: boolean;
  /** `null` = no caduca. */
  expiresAt: Date | null;
  /** `null` = sin tope. */
  maxUses: number | null;
  /** Cuánta gente lo ha escrito en el formulario. */
  timesRequested: number;
  /** De qué agente es, si es de alguno. */
  agentId: string | null;
  createdAt: Date;
}

export interface Progress {
  number: number;
  watchedAt: Date | null;
  quizPassedAt: Date | null;
  attempts: number;
}

export interface Repo {
  /** `true` if the data survives a restart. The memory one returns false. */
  readonly persistent: boolean;

  studentByEmail(email: string): Promise<Student | null>;
  studentById(id: string): Promise<Student | null>;
  /**
   * The password hash for that email, and nothing else.
   *
   * Kept apart from `studentByEmail` on purpose: the only place that needs the
   * hash is the password check, and the less it travels, the fewer places it
   * can escape from.
   */
  passwordHashOf(email: string): Promise<string | null>;
  savePassword(studentId: string, hash: string): Promise<void>;
  /**
   * The student list.
   *
   * ⚠️ THE FILTER IS AN ARGUMENT AND NOT SOMETHING THE CALLER APPLIES
   * AFTERWARDS. `{ registeredBy }` narrows it to one agent's students, and it
   * is what keeps the rows an agent may not see from ever being loaded. See
   * `visibleStudentsFilter` in `@lib/permissions`.
   */
  listStudents(filter?: {
    registeredBy?: string;
    /**
     * Free text over name and email.
     *
     * It goes in the query for the same reason the permission filter does: with
     * a few hundred students, loading them all to throw most away in the
     * template works; with a few thousand it is the page that gets slow while
     * nobody understands why.
     */
    search?: string;
  }): Promise<Student[]>;
  createStudent(data: {
    email: string;
    name: string | null;
    role: Role;
    language: "es" | "en";
    /** The agent registering them. `null` when it's Pedro or the bootstrap. */
    registeredBy?: string | null;
  }): Promise<Student>;
  setActive(id: string, active: boolean): Promise<void>;
  /**
   * Changes somebody's role.
   *
   * ⚠️ WHOEVER CALLS THIS ALSO HAS TO CLOSE THAT PERSON'S SESSIONS. The role is
   * read from the database on every request, but a session that is already open
   * keeps whatever the middleware resolved for it; without signing them out, a
   * demotion only lands whenever their cookie happens to expire. See the
   * `role` action in `/admin`.
   */
  setRole(id: string, role: Role): Promise<void>;
  markSignIn(id: string): Promise<void>;

  createMagicToken(studentId: string, tokenHash: string, expiresAt: Date): Promise<void>;
  /** Consumes the token if valid and unused. Returns the student. */
  consumeMagicToken(tokenHash: string): Promise<Student | null>;

  createSession(
    studentId: string,
    tokenHash: string,
    expiresAt: Date,
    userAgent: string | null,
  ): Promise<void>;
  studentBySession(tokenHash: string): Promise<Student | null>;
  deleteSession(tokenHash: string): Promise<void>;
  deleteSessionsOf(studentId: string): Promise<void>;

  /**
   * Borra lo que ya no sirve. Ver `@lib/mantenimiento`.
   *
   * ⚠️ LA RAZÓN NO ES EL ESPACIO, ES QUE HAY DATOS QUE NO DEBEN QUEDARSE.
   * Medido contra la base real: un alumno con un año de uso ocupa 6 KB, así que
   * en el medio giga del plan gratuito caben decenas de miles. Nada de esto se
   * hace por sitio.
   *
   * Se hace por `peticiones_acceso`, que guarda el correo de CUALQUIERA que
   * escriba una dirección en "he olvidado mi contraseña" — incluida gente que
   * nunca compró nada y que jamás nos dio permiso para nada. Esa tabla existe
   * solo para contar cinco peticiones por hora; pasada esa hora, la fila es una
   * dirección de correo guardada sin motivo.
   *
   * Devuelve cuántas filas se fueron de cada sitio, para poder verlo en el
   * registro sin abrir la base.
   */
  purgeExpired(): Promise<{ sesiones: number; tokens: number; peticiones: number }>;

  progressOf(studentId: string): Promise<Progress[]>;
  markWatched(studentId: string, number: number): Promise<void>;
  recordQuizAttempt(studentId: string, number: number, passed: boolean): Promise<void>;

  // ─── Cupones ───────────────────────────────────────────────────────────────
  listCoupons(): Promise<Coupon[]>;
  createCoupon(data: {
    code: string;
    description: string | null;
    kind: "percent" | "amount";
    value: number;
    expiresAt: Date | null;
    maxUses: number | null;
    agentId: string | null;
    createdBy: string;
  }): Promise<Coupon>;
  setCouponActive(id: string, active: boolean): Promise<void>;
  /**
   * Busca un cupón USABLE por su código: existe, está activo, no ha caducado y
   * no ha llegado a su tope. Devuelve `null` para todo lo demás.
   *
   * ⚠️ LAS CUATRO CONDICIONES SE COMPRUEBAN AQUÍ Y NO EN LA PÁGINA. Un cupón
   * caducado que la plantilla olvide comprobar es un descuento que alguien
   * reclama por teléfono con razón.
   */
  findUsableCoupon(code: string): Promise<Coupon | null>;
  /** Suma uno a "veces que alguien lo escribió". */
  recordCouponRequest(code: string): Promise<void>;

  /** Magic-link requests for that email inside the given window. */
  countRequests(email: string, since: Date): Promise<number>;
  recordRequest(email: string): Promise<void>;
}

/** Normalises the email. A student's identity depends on this. */
export const normaliseEmail = (email: string) => email.trim().toLowerCase();

/**
 * The role stored in the database still says `alumno`. Translating it here —
 * and only here — is what lets the rest of the code speak English without an
 * `ALTER TABLE`. See the note at the top of this file.
 */
const ROLE_IN_DB: Record<Role, string> = {
  student: "alumno",
  agent: "agente",
  admin: "admin",
};

/**
 * ⚠️ ANYTHING UNKNOWN BECOMES A STUDENT. If a row ever holds a role this build
 * doesn't recognise — a rollback, a hand-typed UPDATE, a role added and then
 * removed — the safe reading is the one with the fewest powers. Falling back to
 * the strongest role, or throwing, would turn a typo in one row into either a
 * hole or a sign-in that fails for everybody.
 */
/**
 * El código, normalizado: mayúsculas y sin espacios. Se aplica al escribir Y al
 * buscar, o "laura20" y "LAURA 20" dejan de ser el mismo cupón.
 *
 * ⚠️ El patrón es `\s` —espacios—, no `s`. Escrito sin la barra, esto borraba
 * todas las eses: "MASSIVE" se guardaba como "MAIVE" y nadie podía canjearlo.
 */
export const normaliseCode = (code: string) =>
  code.trim().toUpperCase().replace(/\s+/g, "");

/** El tipo de cupón, como está en la base. Mismo puente que el de los roles. */
const KIND_IN_DB: Record<Coupon["kind"], string> = {
  percent: "porcentaje",
  amount: "importe",
};
const kindFromDb = (v: unknown): Coupon["kind"] =>
  v === "importe" ? "amount" : "percent";

const toCoupon = (f: Record<string, unknown>): Coupon => ({
  id: f.id as string,
  code: f.codigo as string,
  description: (f.descripcion as string) ?? null,
  kind: kindFromDb(f.tipo),
  value: Number(f.valor),
  active: f.activo as boolean,
  expiresAt: (f.caduca_en as Date) ?? null,
  maxUses: (f.usos_max as number) ?? null,
  timesRequested: Number(f.veces_pedido ?? 0),
  agentId: (f.agente_id as string) ?? null,
  createdAt: f.creado_en as Date,
});

const roleFromDb = (value: unknown): Role =>
  value === "admin" ? "admin" : value === "agente" ? "agent" : "student";

// ─── Postgres implementation ─────────────────────────────────────────────────

function postgresRepo(url: string): Repo {
  /* `prepare: false` is not optional in serverless: with a pooler in front
     (pgBouncer in transaction mode, which is what Supabase and Neon hand you)
     prepared statements are lost between requests and the query fails
     intermittently — the worst kind of failure. `max: 1` because each
     invocation is short-lived and there is no point opening a pool that is
     about to be thrown away.

     ⚠️ `connect_timeout` IS THE DIFFERENCE BETWEEN FAILING AND HANGING. Without
     it, a database that accepts the socket and then says nothing keeps the
     request open until the platform's own limit (300 s on Vercel), and the
     visitor stares at a blank tab the whole time while the function burns. With
     10 s, that turns into the "back in a moment" page — which is a bad minute
     instead of a broken site. See `@lib/downtime`.

     `idle_timeout` returns the connection to the pooler quickly instead of
     holding a slot that this invocation is not going to use again. On a small
     free-tier Postgres, slots are the scarce resource, not queries. */
  const sql = postgres(url, {
    prepare: false,
    max: 1,
    connect_timeout: 10,
    idle_timeout: 20,
  });

  const toStudent = (f: Record<string, unknown>): Student => ({
    id: f.id as string,
    email: f.email as string,
    name: (f.nombre as string) ?? null,
    role: roleFromDb(f.rol),
    language: f.idioma as "es" | "en",
    active: f.activo as boolean,
    createdAt: f.alta_en as Date,
    lastSignIn: (f.ultimo_acceso as Date) ?? null,
    previousSignIn: (f.acceso_anterior as Date) ?? null,
    hasPassword: Boolean(f.clave_hash),
    registeredBy: (f.alta_por as string) ?? null,
    coupon: (f.cupon as string) ?? null,
  });

  return {
    persistent: true,

    async studentByEmail(email) {
      const [f] = await sql`
        SELECT * FROM alumnos WHERE email = ${normaliseEmail(email)} LIMIT 1`;
      return f ? toStudent(f) : null;
    },

    async studentById(id) {
      const [f] = await sql`SELECT * FROM alumnos WHERE id = ${id} LIMIT 1`;
      return f ? toStudent(f) : null;
    },

    async passwordHashOf(email) {
      const [f] = await sql`
        SELECT clave_hash FROM alumnos
        WHERE email = ${normaliseEmail(email)} AND activo = true LIMIT 1`;
      return (f?.clave_hash as string) ?? null;
    },

    async savePassword(studentId, hash) {
      await sql`UPDATE alumnos SET clave_hash = ${hash} WHERE id = ${studentId}`;
    },

    async listStudents(filter) {
      /* The filters go INTO the WHERE and not into a `.filter()` afterwards:
         rows an agent may not see are never read. See `visibleStudentsFilter`.

         `sql` fragments compose: each condition is added only when it exists, and
         the values still travel as parameters, so the search box cannot become an
         injection. */
      const owner = filter?.registeredBy
        ? sql`AND alta_por = ${filter.registeredBy}`
        : sql``;
      const search = filter?.search
        ? sql`AND (nombre ILIKE ${"%" + filter.search + "%"} OR email ILIKE ${"%" + filter.search + "%"})`
        : sql``;

      const rows = await sql`
        SELECT * FROM alumnos
        WHERE true ${owner} ${search}
        ORDER BY alta_en DESC`;
      return rows.map(toStudent);
    },

    async createStudent({ email, name, role, language, registeredBy = null }) {
      const [f] = await sql`
        INSERT INTO alumnos (email, nombre, rol, idioma, alta_por)
        VALUES (
          ${normaliseEmail(email)}, ${name}, ${ROLE_IN_DB[role]}, ${language},
          ${registeredBy}
        )
        RETURNING *`;
      return toStudent(f!);
    },

    async setActive(id, active) {
      await sql`UPDATE alumnos SET activo = ${active} WHERE id = ${id}`;
    },

    async setRole(id, role) {
      await sql`UPDATE alumnos SET rol = ${ROLE_IN_DB[role]} WHERE id = ${id}`;
    },

    async markSignIn(id) {
      /* La de antes se corre a `acceso_anterior` en la MISMA sentencia: en dos,
         dos entradas simultáneas podrían pisarse y dejar las dos fechas iguales. */
      await sql`
        UPDATE alumnos
        SET acceso_anterior = ultimo_acceso, ultimo_acceso = now()
        WHERE id = ${id}`;
    },

    async createMagicToken(studentId, tokenHash, expiresAt) {
      await sql`
        INSERT INTO tokens_acceso (alumno_id, token_hash, expira_en)
        VALUES (${studentId}, ${tokenHash}, ${expiresAt})`;
    },

    async consumeMagicToken(tokenHash) {
      /* Mark and read in ONE statement. Were it two — check, then mark — two
         simultaneous requests carrying the same link could both get through.
         The `usado_en IS NULL` inside the UPDATE is what makes only one win. */
      const [t] = await sql`
        UPDATE tokens_acceso SET usado_en = now()
        WHERE token_hash = ${tokenHash}
          AND usado_en IS NULL
          AND expira_en > now()
        RETURNING alumno_id`;
      if (!t) return null;
      const [f] = await sql`
        SELECT * FROM alumnos WHERE id = ${t.alumno_id} AND activo = true LIMIT 1`;
      return f ? toStudent(f) : null;
    },

    async createSession(studentId, tokenHash, expiresAt, userAgent) {
      await sql`
        INSERT INTO sesiones (alumno_id, token_hash, expira_en, user_agent)
        VALUES (${studentId}, ${tokenHash}, ${expiresAt}, ${userAgent})`;
    },

    async studentBySession(tokenHash) {
      const [f] = await sql`
        SELECT a.* FROM sesiones s
        JOIN alumnos a ON a.id = s.alumno_id
        WHERE s.token_hash = ${tokenHash} AND s.expira_en > now() AND a.activo = true
        LIMIT 1`;
      return f ? toStudent(f) : null;
    },

    async deleteSession(tokenHash) {
      await sql`DELETE FROM sesiones WHERE token_hash = ${tokenHash}`;
    },

    async deleteSessionsOf(studentId) {
      await sql`DELETE FROM sesiones WHERE alumno_id = ${studentId}`;
    },

    async purgeExpired() {
      /* Una sesión caducada ya no abre nada: la fila solo dice en qué navegador
         estuvo alguien hace más de un mes. */
      const s = await sql`DELETE FROM sesiones WHERE expira_en < now()`;

      /* ⚠️ LOS ENLACES YA USADOS NO SE BORRAN EN EL ACTO, y esa semana de más
         tiene un motivo escrito en el esquema: mientras la fila existe se puede
         distinguir "este enlace ya se usó" de "este enlace no existió nunca",
         que son dos mensajes distintos para quien pulsa un enlace viejo. A los
         siete días ya nadie vuelve a pulsarlo. */
      const t = await sql`
        DELETE FROM tokens_acceso
        WHERE creado_en < now() - interval '7 days'
          AND (usado_en IS NOT NULL OR expira_en < now())`;

      /* La ventana del límite es de una hora. Se deja el doble por si algún
         reloj va desacompasado, y lo demás fuera: ver la nota de `purgeExpired`
         en la interfaz. */
      const p = await sql`
        DELETE FROM peticiones_acceso WHERE pedido_en < now() - interval '2 hours'`;

      return { sesiones: s.count, tokens: t.count, peticiones: p.count };
    },

    async progressOf(studentId) {
      const rows = await sql`
        SELECT numero, visto_en, quiz_ok_en, intentos
        FROM progreso WHERE alumno_id = ${studentId} ORDER BY numero`;
      return rows.map((f) => ({
        number: Number(f.numero),
        watchedAt: (f.visto_en as Date) ?? null,
        quizPassedAt: (f.quiz_ok_en as Date) ?? null,
        attempts: Number(f.intentos),
      }));
    },

    async markWatched(studentId, number) {
      await sql`
        INSERT INTO progreso (alumno_id, numero, visto_en)
        VALUES (${studentId}, ${number}, now())
        ON CONFLICT (alumno_id, numero)
        DO UPDATE SET visto_en = COALESCE(progreso.visto_en, now())`;
    },

    async recordQuizAttempt(studentId, number, passed) {
      await sql`
        INSERT INTO progreso (alumno_id, numero, intentos, quiz_ok_en)
        VALUES (${studentId}, ${number}, 1, ${passed ? sql`now()` : null})
        ON CONFLICT (alumno_id, numero) DO UPDATE SET
          intentos   = progreso.intentos + 1,
          -- A pass already earned is never lost: if they try again and fail,
          -- they are still passed.
          quiz_ok_en = COALESCE(progreso.quiz_ok_en, ${passed ? sql`now()` : null})`;
    },

    async listCoupons() {
      const rows = await sql`SELECT * FROM cupones ORDER BY creado_en DESC`;
      return rows.map(toCoupon);
    },

    async createCoupon({ code, description, kind, value, expiresAt, maxUses, agentId, createdBy }) {
      const [f] = await sql`
        INSERT INTO cupones (codigo, descripcion, tipo, valor, caduca_en, usos_max, agente_id, creado_por)
        VALUES (
          ${normaliseCode(code)}, ${description}, ${KIND_IN_DB[kind]}, ${value},
          ${expiresAt}, ${maxUses}, ${agentId}, ${createdBy}
        )
        RETURNING *`;
      return toCoupon(f!);
    },

    async setCouponActive(id, active) {
      await sql`UPDATE cupones SET activo = ${active} WHERE id = ${id}`;
    },

    async findUsableCoupon(code) {
      /* Las cuatro condiciones van en la consulta: un cupón caducado no llega
         siquiera a la aplicación. */
      const [f] = await sql`
        SELECT * FROM cupones
        WHERE codigo = ${normaliseCode(code)}
          AND activo = true
          AND (caduca_en IS NULL OR caduca_en > now())
          AND (usos_max IS NULL OR veces_pedido < usos_max)
        LIMIT 1`;
      return f ? toCoupon(f) : null;
    },

    async recordCouponRequest(code) {
      await sql`
        UPDATE cupones SET veces_pedido = veces_pedido + 1
        WHERE codigo = ${normaliseCode(code)}`;
    },

    async countRequests(email, since) {
      const [f] = await sql`
        SELECT count(*)::int AS n FROM peticiones_acceso
        WHERE email = ${normaliseEmail(email)} AND pedido_en > ${since}`;
      return Number(f?.n ?? 0);
    },

    async recordRequest(email) {
      await sql`INSERT INTO peticiones_acceso (email) VALUES (${normaliseEmail(email)})`;
    },
  };
}

// ─── In-memory implementation (development only) ─────────────────────────────

function memoryRepo(): Repo {
  const students = new Map<string, Student>();
  /* The hash lives apart from the student, exactly as in Postgres it lives in a
     column that `studentByEmail` doesn't return: inside the object it would end
     up in `Astro.locals` and from there in any template. */
  const passwords = new Map<string, string>();
  const tokens = new Map<string, { studentId: string; expires: Date; used: boolean }>();
  const sessions = new Map<string, { studentId: string; expires: Date }>();
  const progress = new Map<string, Progress>();
  const requests: { email: string; at: Date }[] = [];
  /** Por código normalizado, igual que en Postgres manda el UNIQUE. */
  const coupons = new Map<string, Coupon>();

  const progressKey = (a: string, n: number) => `${a}:${n}`;
  let n = 0;
  const newId = () => `dev-${++n}`;

  /* ─── SEEDED ADMINS ────────────────────────────────────────────────────────
     So the panel can be opened in development without anywhere to sign up.
     The ones in `ADMIN_EMAILS` are seeded — the same list Postgres uses — and,
     failing that, the usual one. */
  const adminEmails = String(import.meta.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(normaliseEmail)
    .filter(Boolean);

  if (!adminEmails.length) adminEmails.push("hola@emprende180.com");

  /**
   * ─── THE DEMO PASSWORD ────────────────────────────────────────────────────
   *
   * `DEMO_CLAVE` lets the seeded admins in with a fixed password, without going
   * through the emailed link. It exists so the area can be SHOWN to someone: a
   * demo where you have to go dig a link out of the console every time the
   * server restarts is a demo you cannot give.
   *
   * ⚠️ THE THREE THINGS THAT KEEP THIS FROM BEING A HOLE:
   *
   * 1. IT LIVES IN `memoryRepo`, and the memory store only exists when there is
   *    no `DATABASE_URL`. In production a missing `DATABASE_URL` deliberately
   *    kills startup (see `repo()` below), so this code cannot run on the
   *    published site, not even through a configuration mistake.
   * 2. IT DOESN'T TOUCH `MIN_PASSWORD`. The ten-character minimum enforced by
   *    `validatePassword` stays intact for everyone: that validates when a
   *    password is SET, and nothing is set here — a finished hash is seeded.
   *    Lowering the minimum so "1234" would pass the form would have weakened
   *    every real student's sign-up, forever, in exchange for a demo.
   * 3. IT IS OFF BY DEFAULT. With no `DEMO_CLAVE` in `.env` none of this
   *    happens and the seeded admins are born without a password, as before.
   *
   * The hash is derived LAZILY, inside `passwordHashOf`, because `hashPassword`
   * is async and this function is not. It is computed once and cached.
   */
  const demoPassword = import.meta.env.DEMO_CLAVE || null;

  for (const email of adminEmails) {
    const s: Student = {
      id: newId(),
      email,
      /* This is what shows up in the area's greeting ("Hi, Admin") and in the
         panel list. It used to read "Pedro (desarrollo)", which parsed as a
         person's name with a strange parenthesis when what it meant was
         "development environment account". The role already says everything. */
      name: "Admin",
      role: "admin",
      language: "es",
      active: true,
      createdAt: new Date(),
      lastSignIn: null,
      previousSignIn: null,
      /* With the demo on, the account ALREADY has a password, and saying so
         here is what keeps the dashboard from showing the "set one" notice on a
         screen that is being demoed. */
      hasPassword: !!demoPassword,
      registeredBy: null,
      coupon: null,
    };
    students.set(s.email, s);
  }

  /**
   * ─── ONE ACCOUNT PER ROLE, FOR SEEING THE PORTAL ──────────────────────────
   *
   * The portal shows three different things depending on who signs in, and
   * until now only the admin one could be looked at without registering people
   * by hand and digging their link out of the console after every restart.
   *
   * With `DEMO_CLAVE` set, these two are seeded next to the admin and share the
   * same password:
   *
   *   · `agente@emprende180.com` — an agent, with two students of their own so
   *     the list isn't empty and the counts have something to count.
   *   · `alumno@emprende180.com` — a plain student: the portal with nothing but
   *     the two doors.
   *
   * ⚠️ SAME THREE GUARDS AS THE DEMO PASSWORD ABOVE. This is inside
   * `memoryRepo`, which only exists when there is no `DATABASE_URL`, and
   * production without `DATABASE_URL` refuses to start. These accounts cannot
   * reach the published site.
   *
   * The two students belong to the agent (`registeredBy`), which is what makes
   * their list, their counts and the admin's "sign-ups by agent" table show
   * something real instead of zeros.
   */
  /* Los correos que abren con `DEMO_CLAVE`. Los admins sembrados y estos. */
  const demoEmails = new Set<string>(adminEmails);

  if (demoPassword) {
    const seed = (
      email: string,
      name: string,
      role: Role,
      registeredBy: string | null,
      lastSignIn: Date | null,
    ) => {
      const s: Student = {
        id: newId(),
        email,
        name,
        role,
        language: "es",
        active: true,
        createdAt: new Date(),
        lastSignIn,
        /* Sembrada con una visita anterior para que el "última conexión" del
           portal tenga algo que enseñar en la demo. */
        previousSignIn: lastSignIn ? new Date(Date.now() - 3 * 86_400_000) : null,
        hasPassword: true,
        registeredBy,
        coupon: null,
      };
      students.set(s.email, s);
      demoEmails.add(s.email);
      return s;
    };

    const agent = seed("agente@emprende180.com", "Laura Ruiz", "agent", null, new Date());
    /* Uno ha entrado y el otro no: es la pareja de estados que el panel tiene
       que saber contar, y la que hace visible el aviso de "pagaron y no han
       entrado" sin tener que fabricarlo a mano. */
    seed("carmen@ejemplo.com", "Carmen Vidal", "student", agent.id, new Date());
    seed("javier@ejemplo.com", "Javier Peña", "student", agent.id, null);
    seed("alumno@emprende180.com", "Marta Gil", "student", null, new Date());
  }

  const byId = (id: string) => [...students.values()].find((s) => s.id === id) ?? null;

  return {
    persistent: false,

    async studentByEmail(email) {
      return students.get(normaliseEmail(email)) ?? null;
    },
    async studentById(id) {
      return byId(id);
    },
    async passwordHashOf(email) {
      const e = normaliseEmail(email);
      const s = students.get(e);
      if (!s?.active) return null;

      const stored = passwords.get(e);
      if (stored) return stored;

      /* First time a seeded account's password is asked for with the demo on:
         the hash is derived here and kept. See the `DEMO_CLAVE` note above. */
      if (demoPassword && demoEmails.has(e)) {
        const hash = await hashPassword(demoPassword);
        passwords.set(e, hash);
        return hash;
      }

      return null;
    },
    async savePassword(studentId, hash) {
      const s = byId(studentId);
      if (!s) return;
      passwords.set(s.email, hash);
      students.set(s.email, { ...s, hasPassword: true });
    },
    async listStudents(filter) {
      const needle = filter?.search?.trim().toLowerCase();
      return [...students.values()]
        .sort((a, b) => +b.createdAt - +a.createdAt)
        .filter((s) => !filter?.registeredBy || s.registeredBy === filter.registeredBy)
        .filter(
          (s) =>
            !needle ||
            s.email.includes(needle) ||
            (s.name ?? "").toLowerCase().includes(needle),
        );
    },
    async createStudent({ email, name, role, language, registeredBy = null }) {
      const s: Student = {
        id: newId(),
        email: normaliseEmail(email),
        name,
        role,
        language,
        active: true,
        createdAt: new Date(),
        lastSignIn: null,
        previousSignIn: null,
        hasPassword: false,
        registeredBy,
        coupon: null,
      };
      students.set(s.email, s);
      return s;
    },
    async setActive(id, active) {
      const s = byId(id);
      if (s) students.set(s.email, { ...s, active });
    },
    async setRole(id, role) {
      const s = byId(id);
      if (s) students.set(s.email, { ...s, role });
    },
    async markSignIn(id) {
      const s = byId(id);
      if (s)
        students.set(s.email, {
          ...s,
          previousSignIn: s.lastSignIn,
          lastSignIn: new Date(),
        });
    },

    async createMagicToken(studentId, tokenHash, expiresAt) {
      tokens.set(tokenHash, { studentId, expires: expiresAt, used: false });
    },
    async consumeMagicToken(tokenHash) {
      const t = tokens.get(tokenHash);
      if (!t || t.used || t.expires <= new Date()) return null;
      t.used = true;
      const s = byId(t.studentId);
      return s?.active ? s : null;
    },

    async createSession(studentId, tokenHash, expiresAt) {
      sessions.set(tokenHash, { studentId, expires: expiresAt });
    },
    async studentBySession(tokenHash) {
      const s = sessions.get(tokenHash);
      if (!s || s.expires <= new Date()) return null;
      const student = byId(s.studentId);
      return student?.active ? student : null;
    },
    async deleteSession(tokenHash) {
      sessions.delete(tokenHash);
    },
    async deleteSessionsOf(studentId) {
      for (const [k, v] of sessions) if (v.studentId === studentId) sessions.delete(k);
    },

    /* Mismo criterio que en Postgres. Aquí sobra —esta tienda se borra entera al
       reiniciar— pero existe para que las dos implementaciones se comporten
       igual: una función que solo funciona en producción es una función que se
       prueba en producción. */
    async purgeExpired() {
      const ahora = Date.now();
      const semana = ahora - 7 * 86_400_000;
      const dosHoras = ahora - 2 * 3_600_000;

      let sesiones = 0;
      for (const [k, v] of sessions) {
        if (v.expires.getTime() < ahora) { sessions.delete(k); sesiones++; }
      }

      let borrados = 0;
      for (const [k, v] of tokens) {
        if ((v.used || v.expires.getTime() < ahora) && v.expires.getTime() < semana) {
          tokens.delete(k);
          borrados++;
        }
      }

      const antes = requests.length;
      for (let i = requests.length - 1; i >= 0; i--) {
        if (requests[i]!.at.getTime() < dosHoras) requests.splice(i, 1);
      }

      return { sesiones, tokens: borrados, peticiones: antes - requests.length };
    },

    async progressOf(studentId) {
      return [...progress.entries()]
        .filter(([k]) => k.startsWith(`${studentId}:`))
        .map(([, v]) => v)
        .sort((a, b) => a.number - b.number);
    },
    async markWatched(studentId, number) {
      const k = progressKey(studentId, number);
      const p = progress.get(k) ?? {
        number,
        watchedAt: null,
        quizPassedAt: null,
        attempts: 0,
      };
      progress.set(k, { ...p, watchedAt: p.watchedAt ?? new Date() });
    },
    async recordQuizAttempt(studentId, number, passed) {
      const k = progressKey(studentId, number);
      const p = progress.get(k) ?? {
        number,
        watchedAt: null,
        quizPassedAt: null,
        attempts: 0,
      };
      progress.set(k, {
        ...p,
        attempts: p.attempts + 1,
        quizPassedAt: p.quizPassedAt ?? (passed ? new Date() : null),
      });
    },

    async listCoupons() {
      return [...coupons.values()].sort((a, b) => +b.createdAt - +a.createdAt);
    },
    async createCoupon({ code, description, kind, value, expiresAt, maxUses, agentId }) {
      const c: Coupon = {
        id: newId(),
        code: normaliseCode(code),
        description,
        kind,
        value,
        active: true,
        expiresAt,
        maxUses,
        timesRequested: 0,
        agentId,
        createdAt: new Date(),
      };
      coupons.set(c.code, c);
      return c;
    },
    async setCouponActive(id, active) {
      for (const [k, c] of coupons) {
        if (c.id === id) coupons.set(k, { ...c, active });
      }
    },
    async findUsableCoupon(code) {
      const c = coupons.get(normaliseCode(code));
      if (!c || !c.active) return null;
      if (c.expiresAt && c.expiresAt <= new Date()) return null;
      if (c.maxUses !== null && c.timesRequested >= c.maxUses) return null;
      return c;
    },
    async recordCouponRequest(code) {
      const k = normaliseCode(code);
      const c = coupons.get(k);
      if (c) coupons.set(k, { ...c, timesRequested: c.timesRequested + 1 });
    },

    async countRequests(email, since) {
      const e = normaliseEmail(email);
      return requests.filter((r) => r.email === e && r.at > since).length;
    },
    async recordRequest(email) {
      requests.push({ email: normaliseEmail(email), at: new Date() });
    },
  };
}

// ─── Selection ───────────────────────────────────────────────────────────────

let cached: Repo | null = null;

export function repo(): Repo {
  if (cached) return cached;

  const url = import.meta.env.DATABASE_URL;

  if (url) {
    cached = postgresRepo(url);
    return cached;
  }

  if (import.meta.env.DEV) {
    console.warn(
      "[data] No DATABASE_URL: student area running IN MEMORY. Data is lost on " +
        "restart. The test admins are the ones in ADMIN_EMAILS " +
        (import.meta.env.DEMO_CLAVE
          ? "and they sign in with the DEMO_CLAVE password. "
          : "and they sign in through the link printed in this console. ") +
        "For the real thing: create a Postgres, apply db/schema.sql and set " +
        "DATABASE_URL in .env",
    );
    cached = memoryRepo();
    return cached;
  }

  /* In production there is no possible downgrade. A memory store behind several
     instances isn't "worse", it's incorrect: each one would see a different
     student list. Better a clear error than a student area that works
     sometimes. */
  throw new Error(
    "[data] DATABASE_URL is missing. The student area needs a Postgres " +
      "database; apply db/schema.sql and define the variable in the environment.",
  );
}
