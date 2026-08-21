import postgres from "postgres";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DATOS DEL ÁREA DE ALUMNOS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Un solo contrato (`Repo`) con dos implementaciones:
 *
 *   · POSTGRES — la de verdad. Se activa en cuanto hay `DATABASE_URL`.
 *   · MEMORIA  — solo en desarrollo y solo si NO hay `DATABASE_URL`.
 *
 * POR QUÉ HAY UNA DE MEMORIA. Sin ella, el área de alumnos no se puede abrir ni
 * probar hasta que exista una base de datos contratada: todo el trabajo quedaría
 * sin verificar y sin poder enseñarse. Con ella, los flujos completos —pedir el
 * enlace, entrar, ver el tablero, dar de alta— funcionan hoy en `npm run dev`.
 *
 * ⚠️ Y POR QUÉ NO PUEDE LLEGAR A PRODUCCIÓN. Una tienda en memoria se vacía en
 * cada arranque y NO se comparte entre instancias: en Vercel, dos peticiones
 * seguidas pueden caer en procesos distintos, así que alguien entraría y a la
 * siguiente pantalla estaría fuera. Peor: cada instancia arrancaría con la lista
 * de alumnos vacía. Por eso, en producción, la ausencia de `DATABASE_URL` es un
 * error que revienta el arranque en vez de una degradación silenciosa.
 *
 * ⚠️ NO SE USA EL SDK DE NINGÚN PROVEEDOR. Solo `DATABASE_URL`, que es lo que
 * dan todos: Neon, Supabase, RDS o un contenedor local. Cambiar de proveedor es
 * cambiar una variable de entorno.
 */

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type Rol = "alumno" | "admin";

export interface Alumno {
  id: string;
  email: string;
  nombre: string | null;
  rol: Rol;
  idioma: "es" | "en";
  activo: boolean;
  altaEn: Date;
  ultimoAcceso: Date | null;
  /**
   * `true` si ya se ha puesto contraseña.
   *
   * ⚠️ AQUÍ NO VIAJA EL HASH, Y ES DELIBERADO. Este objeto acaba en
   * `Astro.locals` y de ahí puede colarse en cualquier plantilla; un booleano
   * no se puede filtrar por accidente. El hash solo lo lee `verificarAcceso`,
   * que es la única función que lo necesita.
   */
  tieneClave: boolean;
}

export interface Progreso {
  numero: number;
  vistoEn: Date | null;
  quizOkEn: Date | null;
  intentos: number;
}

export interface Repo {
  /** `true` si los datos sobreviven al reinicio. La de memoria devuelve false. */
  readonly persistente: boolean;

  alumnoPorEmail(email: string): Promise<Alumno | null>;
  alumnoPorId(id: string): Promise<Alumno | null>;
  /**
   * El hash de la contraseña de ese email, y nada más.
   *
   * Separado de `alumnoPorEmail` a propósito: el único sitio que necesita el
   * hash es la comprobación de la contraseña, y cuanto menos circule, menos
   * sitios hay desde los que se pueda escapar.
   */
  claveDe(email: string): Promise<string | null>;
  guardarClave(alumnoId: string, hash: string): Promise<void>;
  listarAlumnos(): Promise<Alumno[]>;
  crearAlumno(datos: {
    email: string;
    nombre: string | null;
    rol: Rol;
    idioma: "es" | "en";
  }): Promise<Alumno>;
  cambiarActivo(id: string, activo: boolean): Promise<void>;
  marcarAcceso(id: string): Promise<void>;

  crearTokenAcceso(alumnoId: string, tokenHash: string, expiraEn: Date): Promise<void>;
  /** Consume el token si es válido y no se ha usado. Devuelve el alumno. */
  consumirTokenAcceso(tokenHash: string): Promise<Alumno | null>;

  crearSesion(
    alumnoId: string,
    tokenHash: string,
    expiraEn: Date,
    userAgent: string | null,
  ): Promise<void>;
  alumnoDeSesion(tokenHash: string): Promise<Alumno | null>;
  borrarSesion(tokenHash: string): Promise<void>;
  borrarSesionesDe(alumnoId: string): Promise<void>;

  progresoDe(alumnoId: string): Promise<Progreso[]>;
  marcarVisto(alumnoId: string, numero: number): Promise<void>;
  registrarIntentoQuiz(alumnoId: string, numero: number, superado: boolean): Promise<void>;

  /** Peticiones de enlace mágico para ese email en la ventana dada. */
  contarPeticiones(email: string, desde: Date): Promise<number>;
  registrarPeticion(email: string): Promise<void>;
}

/** Normaliza el email. La identidad del alumno depende de esto. */
export const normalizarEmail = (email: string) => email.trim().toLowerCase();

// ─── Implementación Postgres ─────────────────────────────────────────────────

function repoPostgres(url: string): Repo {
  /* `prepare: false` no es opcional en serverless: con un pooler por delante
     (pgBouncer en modo transacción, que es lo que dan Supabase y Neon) las
     sentencias preparadas se pierden entre peticiones y la consulta falla de
     forma intermitente — el peor tipo de fallo. `max: 1` porque cada invocación
     es efímera y no tiene sentido abrir un pool que se va a tirar. */
  const sql = postgres(url, { prepare: false, max: 1 });

  const aAlumno = (f: Record<string, unknown>): Alumno => ({
    id: f.id as string,
    email: f.email as string,
    nombre: (f.nombre as string) ?? null,
    rol: f.rol as Rol,
    idioma: f.idioma as "es" | "en",
    activo: f.activo as boolean,
    altaEn: f.alta_en as Date,
    ultimoAcceso: (f.ultimo_acceso as Date) ?? null,
    tieneClave: Boolean(f.clave_hash),
  });

  return {
    persistente: true,

    async alumnoPorEmail(email) {
      const [f] = await sql`
        SELECT * FROM alumnos WHERE email = ${normalizarEmail(email)} LIMIT 1`;
      return f ? aAlumno(f) : null;
    },

    async alumnoPorId(id) {
      const [f] = await sql`SELECT * FROM alumnos WHERE id = ${id} LIMIT 1`;
      return f ? aAlumno(f) : null;
    },

    async claveDe(email) {
      const [f] = await sql`
        SELECT clave_hash FROM alumnos
        WHERE email = ${normalizarEmail(email)} AND activo = true LIMIT 1`;
      return (f?.clave_hash as string) ?? null;
    },

    async guardarClave(alumnoId, hash) {
      await sql`UPDATE alumnos SET clave_hash = ${hash} WHERE id = ${alumnoId}`;
    },

    async listarAlumnos() {
      const filas = await sql`SELECT * FROM alumnos ORDER BY alta_en DESC`;
      return filas.map(aAlumno);
    },

    async crearAlumno({ email, nombre, rol, idioma }) {
      const [f] = await sql`
        INSERT INTO alumnos (email, nombre, rol, idioma)
        VALUES (${normalizarEmail(email)}, ${nombre}, ${rol}, ${idioma})
        RETURNING *`;
      return aAlumno(f!);
    },

    async cambiarActivo(id, activo) {
      await sql`UPDATE alumnos SET activo = ${activo} WHERE id = ${id}`;
    },

    async marcarAcceso(id) {
      await sql`UPDATE alumnos SET ultimo_acceso = now() WHERE id = ${id}`;
    },

    async crearTokenAcceso(alumnoId, tokenHash, expiraEn) {
      await sql`
        INSERT INTO tokens_acceso (alumno_id, token_hash, expira_en)
        VALUES (${alumnoId}, ${tokenHash}, ${expiraEn})`;
    },

    async consumirTokenAcceso(tokenHash) {
      /* Marcar y leer en UNA sentencia. Si fueran dos —comprobar y luego
         marcar—, dos peticiones simultáneas con el mismo enlace podrían pasar
         las dos. El `usado_en IS NULL` dentro del UPDATE hace que solo una gane. */
      const [t] = await sql`
        UPDATE tokens_acceso SET usado_en = now()
        WHERE token_hash = ${tokenHash}
          AND usado_en IS NULL
          AND expira_en > now()
        RETURNING alumno_id`;
      if (!t) return null;
      const [f] = await sql`
        SELECT * FROM alumnos WHERE id = ${t.alumno_id} AND activo = true LIMIT 1`;
      return f ? aAlumno(f) : null;
    },

    async crearSesion(alumnoId, tokenHash, expiraEn, userAgent) {
      await sql`
        INSERT INTO sesiones (alumno_id, token_hash, expira_en, user_agent)
        VALUES (${alumnoId}, ${tokenHash}, ${expiraEn}, ${userAgent})`;
    },

    async alumnoDeSesion(tokenHash) {
      const [f] = await sql`
        SELECT a.* FROM sesiones s
        JOIN alumnos a ON a.id = s.alumno_id
        WHERE s.token_hash = ${tokenHash} AND s.expira_en > now() AND a.activo = true
        LIMIT 1`;
      return f ? aAlumno(f) : null;
    },

    async borrarSesion(tokenHash) {
      await sql`DELETE FROM sesiones WHERE token_hash = ${tokenHash}`;
    },

    async borrarSesionesDe(alumnoId) {
      await sql`DELETE FROM sesiones WHERE alumno_id = ${alumnoId}`;
    },

    async progresoDe(alumnoId) {
      const filas = await sql`
        SELECT numero, visto_en, quiz_ok_en, intentos
        FROM progreso WHERE alumno_id = ${alumnoId} ORDER BY numero`;
      return filas.map((f) => ({
        numero: Number(f.numero),
        vistoEn: (f.visto_en as Date) ?? null,
        quizOkEn: (f.quiz_ok_en as Date) ?? null,
        intentos: Number(f.intentos),
      }));
    },

    async marcarVisto(alumnoId, numero) {
      await sql`
        INSERT INTO progreso (alumno_id, numero, visto_en)
        VALUES (${alumnoId}, ${numero}, now())
        ON CONFLICT (alumno_id, numero)
        DO UPDATE SET visto_en = COALESCE(progreso.visto_en, now())`;
    },

    async registrarIntentoQuiz(alumnoId, numero, superado) {
      await sql`
        INSERT INTO progreso (alumno_id, numero, intentos, quiz_ok_en)
        VALUES (${alumnoId}, ${numero}, 1, ${superado ? sql`now()` : null})
        ON CONFLICT (alumno_id, numero) DO UPDATE SET
          intentos   = progreso.intentos + 1,
          -- Nunca se pierde un aprobado ya conseguido: si vuelve a intentarlo y
          -- falla, sigue aprobado.
          quiz_ok_en = COALESCE(progreso.quiz_ok_en, ${superado ? sql`now()` : null})`;
    },

    async contarPeticiones(email, desde) {
      const [f] = await sql`
        SELECT count(*)::int AS n FROM peticiones_acceso
        WHERE email = ${normalizarEmail(email)} AND pedido_en > ${desde}`;
      return Number(f?.n ?? 0);
    },

    async registrarPeticion(email) {
      await sql`INSERT INTO peticiones_acceso (email) VALUES (${normalizarEmail(email)})`;
    },
  };
}

// ─── Implementación en memoria (solo desarrollo) ─────────────────────────────

function repoMemoria(): Repo {
  const alumnos = new Map<string, Alumno>();
  /* El hash vive aparte del alumno, igual que en Postgres vive en una columna
     que `alumnoPorEmail` no devuelve: si estuviera dentro del objeto, acabaría
     viajando a `Astro.locals` y de ahí a cualquier plantilla. */
  const claves = new Map<string, string>();
  const tokens = new Map<string, { alumnoId: string; expira: Date; usado: boolean }>();
  const sesiones = new Map<string, { alumnoId: string; expira: Date }>();
  const progreso = new Map<string, Progreso>();
  const peticiones: { email: string; en: Date }[] = [];

  const claveProgreso = (a: string, n: number) => `${a}:${n}`;
  let n = 0;
  const nuevoId = () => `dev-${++n}`;

  /* Un admin de partida para poder abrir el panel en desarrollo sin tener a
     dónde ir a darse de alta. Solo existe aquí; en Postgres el primer admin lo
     siembra `ADMIN_EMAILS`. */
  const semilla: Alumno = {
    id: nuevoId(),
    email: "hola@emprende180.com",
    nombre: "Pedro (desarrollo)",
    rol: "admin",
    idioma: "es",
    activo: true,
    altaEn: new Date(),
    ultimoAcceso: null,
    tieneClave: false,
  };
  alumnos.set(semilla.email, semilla);

  const porId = (id: string) => [...alumnos.values()].find((a) => a.id === id) ?? null;

  return {
    persistente: false,

    async alumnoPorEmail(email) {
      return alumnos.get(normalizarEmail(email)) ?? null;
    },
    async alumnoPorId(id) {
      return porId(id);
    },
    async claveDe(email) {
      const e = normalizarEmail(email);
      return alumnos.get(e)?.activo ? (claves.get(e) ?? null) : null;
    },
    async guardarClave(alumnoId, hash) {
      const a = porId(alumnoId);
      if (!a) return;
      claves.set(a.email, hash);
      alumnos.set(a.email, { ...a, tieneClave: true });
    },
    async listarAlumnos() {
      return [...alumnos.values()].sort((a, b) => +b.altaEn - +a.altaEn);
    },
    async crearAlumno({ email, nombre, rol, idioma }) {
      const a: Alumno = {
        id: nuevoId(),
        email: normalizarEmail(email),
        nombre,
        rol,
        idioma,
        activo: true,
        altaEn: new Date(),
        ultimoAcceso: null,
        tieneClave: false,
      };
      alumnos.set(a.email, a);
      return a;
    },
    async cambiarActivo(id, activo) {
      const a = porId(id);
      if (a) alumnos.set(a.email, { ...a, activo });
    },
    async marcarAcceso(id) {
      const a = porId(id);
      if (a) alumnos.set(a.email, { ...a, ultimoAcceso: new Date() });
    },

    async crearTokenAcceso(alumnoId, tokenHash, expiraEn) {
      tokens.set(tokenHash, { alumnoId, expira: expiraEn, usado: false });
    },
    async consumirTokenAcceso(tokenHash) {
      const t = tokens.get(tokenHash);
      if (!t || t.usado || t.expira <= new Date()) return null;
      t.usado = true;
      const a = porId(t.alumnoId);
      return a?.activo ? a : null;
    },

    async crearSesion(alumnoId, tokenHash, expiraEn) {
      sesiones.set(tokenHash, { alumnoId, expira: expiraEn });
    },
    async alumnoDeSesion(tokenHash) {
      const s = sesiones.get(tokenHash);
      if (!s || s.expira <= new Date()) return null;
      const a = porId(s.alumnoId);
      return a?.activo ? a : null;
    },
    async borrarSesion(tokenHash) {
      sesiones.delete(tokenHash);
    },
    async borrarSesionesDe(alumnoId) {
      for (const [k, v] of sesiones) if (v.alumnoId === alumnoId) sesiones.delete(k);
    },

    async progresoDe(alumnoId) {
      return [...progreso.entries()]
        .filter(([k]) => k.startsWith(`${alumnoId}:`))
        .map(([, v]) => v)
        .sort((a, b) => a.numero - b.numero);
    },
    async marcarVisto(alumnoId, numero) {
      const k = claveProgreso(alumnoId, numero);
      const p = progreso.get(k) ?? { numero, vistoEn: null, quizOkEn: null, intentos: 0 };
      progreso.set(k, { ...p, vistoEn: p.vistoEn ?? new Date() });
    },
    async registrarIntentoQuiz(alumnoId, numero, superado) {
      const k = claveProgreso(alumnoId, numero);
      const p = progreso.get(k) ?? { numero, vistoEn: null, quizOkEn: null, intentos: 0 };
      progreso.set(k, {
        ...p,
        intentos: p.intentos + 1,
        quizOkEn: p.quizOkEn ?? (superado ? new Date() : null),
      });
    },

    async contarPeticiones(email, desde) {
      const e = normalizarEmail(email);
      return peticiones.filter((p) => p.email === e && p.en > desde).length;
    },
    async registrarPeticion(email) {
      peticiones.push({ email: normalizarEmail(email), en: new Date() });
    },
  };
}

// ─── Selección ───────────────────────────────────────────────────────────────

let cache: Repo | null = null;

export function repo(): Repo {
  if (cache) return cache;

  const url = import.meta.env.DATABASE_URL;

  if (url) {
    cache = repoPostgres(url);
    return cache;
  }

  if (import.meta.env.DEV) {
    console.warn(
      "[datos] Sin DATABASE_URL: área de alumnos en MEMORIA. Los datos se " +
        "pierden al reiniciar y el admin de prueba es hola@emprende180.com. " +
        "Para la de verdad: crea un Postgres, aplica db/schema.sql y pon " +
        "DATABASE_URL en .env",
    );
    cache = repoMemoria();
    return cache;
  }

  /* En producción no hay degradación posible. Una tienda en memoria detrás de
     varias instancias no es "peor", es incorrecta: cada una vería una lista de
     alumnos distinta. Mejor un error claro que un área de alumnos que a veces
     funciona. */
  throw new Error(
    "[datos] Falta DATABASE_URL. El área de alumnos necesita una base de datos " +
      "Postgres; aplica db/schema.sql y define la variable en el entorno.",
  );
}
