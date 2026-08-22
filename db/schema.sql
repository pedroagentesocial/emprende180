-- ═══════════════════════════════════════════════════════════════════════════
-- ÁREA DE ALUMNOS — esquema
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Postgres a secas. Sirve cualquier proveedor que dé un `DATABASE_URL`: Neon,
-- Supabase, RDS, un contenedor en tu máquina. Esa es la razón de no usar el SDK
-- de ningún proveedor concreto — el día que cambie el hosting de la base, esto
-- no se toca.
--
-- Para aplicarlo:  psql "$DATABASE_URL" -f db/schema.sql
-- Es idempotente: se puede volver a ejecutar sin romper nada.
--
-- ⚠️ LOS NOMBRES DE AQUÍ SIGUEN EN ESPAÑOL Y EL CÓDIGO YA NO. No es un olvido:
-- renombrar una tabla o una columna es un ALTER TABLE contra una base viva, con
-- un despliegue que hay que ordenar respecto a él. Es un trabajo aparte y
-- planificado, no el efecto secundario de ordenar el código. El único sitio del
-- proyecto donde aparecen estos nombres es `src/lib/data.ts`, que es quien
-- traduce: `alumnos.nombre` → `Student.name`, `alta_en` → `createdAt`,
-- `rol='alumno'` → `role: "student"`. De ahí para arriba, todo está en inglés.

-- ─── Alumnos ────────────────────────────────────────────────────────────────
-- El email es la identidad; la contraseña, la llave del día a día.
--
-- `clave_hash` es NULL mientras el alumno no se haya puesto contraseña, que es
-- justo lo que pasa entre que se le da de alta y abre el correo de invitación.
-- Ese nulo no es un hueco por rellenar: es un estado con significado, y lo que
-- hace que la pantalla de "ponte una contraseña" sepa cuándo tiene que salir.
--
-- ⚠️ Lo que hay aquí NO es la contraseña: es un scrypt con su sal. Ver
-- `src/lib/passwords.ts`.
CREATE TABLE IF NOT EXISTS alumnos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Siempre en minúsculas y sin espacios: lo normaliza la aplicación antes de
  -- escribir, y el UNIQUE de abajo lo garantiza.
  email         text NOT NULL UNIQUE,
  nombre        text,
  -- 'alumno' | 'agente' | 'admin'. Los tres entran por la MISMA puerta: un
  -- agente es un alumno que además puede dar de alta, y un admin es un agente
  -- que además lo ve todo. Así el inicio de sesión es exactamente el mismo y no
  -- hay una segunda puerta que proteger.
  --
  -- Sin CHECK a propósito: la lista de roles vive en `src/lib/permissions.ts` y
  -- una restricción aquí obligaría a una migración cada vez que aparezca uno.
  -- Lo que entra en esta columna lo decide la aplicación, no el formulario.
  rol           text NOT NULL DEFAULT 'alumno',
  -- Idioma en el que se le escribe. Se hereda del alta.
  idioma        text NOT NULL DEFAULT 'es',
  -- Baja sin borrar: se conserva el progreso por si vuelve, y se conserva el
  -- rastro de que existió. Un DELETE aquí se llevaría por delante su historial.
  activo        boolean NOT NULL DEFAULT true,
  clave_hash    text,
  alta_en       timestamptz NOT NULL DEFAULT now(),
  ultimo_acceso timestamptz,
  -- ─── LA CONEXIÓN ANTERIOR ─────────────────────────────────────────────────
  -- ⚠️ HACEN FALTA LAS DOS FECHAS, Y ESTA ES LA QUE SE ENSEÑA. `ultimo_acceso`
  -- se actualiza AL ENTRAR, así que a quien acaba de entrar le diría "tu última
  -- conexión: hace un segundo", que es cierto y no sirve para nada. La que
  -- responde a "¿he entrado yo antes?" es la de antes de esta, y por eso se
  -- guarda aparte: al marcar una entrada, la anterior se corre a esta columna.
  acceso_anterior timestamptz,
  -- ─── QUIÉN LO DIO DE ALTA ─────────────────────────────────────────────────
  -- El agente que lo registró, o NULL si lo dio de alta Pedro (o si la cuenta
  -- nació de ADMIN_EMAILS).
  --
  -- Hace DOS trabajos y por eso vale la pena una columna:
  --  1. PERMISOS. Es lo que permite que un agente vea su lista y solo la suya.
  --     Sin esto, un agente o no ve nada —y entonces no puede comprobar si a su
  --     alumno le llegó el enlace— o los ve a todos, que es la lista completa de
  --     clientes en manos de alguien que no es de casa.
  --  2. COMISIONES. Es el registro de quién vendió qué. Va a hacer falta el día
  --     que haya que pagarlas, y reconstruirlo después mirando fechas es
  --     inventárselo.
  --
  -- `ON DELETE SET NULL` y no CASCADE: si algún día se borra a un agente, sus
  -- alumnos NO se borran con él. Siguen siendo alumnos que pagaron.
  alta_por      uuid REFERENCES alumnos(id) ON DELETE SET NULL
);

-- Para bases creadas antes de que existieran las contraseñas y los agentes.
-- `IF NOT EXISTS` mantiene este archivo aplicable tantas veces como haga falta.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS clave_hash text;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS alta_por uuid REFERENCES alumnos(id) ON DELETE SET NULL;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS acceso_anterior timestamptz;

-- La lista del panel de un agente son sus alumnos ordenados por fecha de alta.
CREATE INDEX IF NOT EXISTS alumnos_alta_por ON alumnos (alta_por, alta_en DESC);

-- ─── Tokens de acceso (enlaces mágicos) ─────────────────────────────────────
-- ⚠️ Se guarda el HASH del token, nunca el token. Quien lea esta tabla —una
-- copia de seguridad, un volcado, un empleado— no puede entrar en ninguna
-- cuenta con lo que hay aquí.
CREATE TABLE IF NOT EXISTS tokens_acceso (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id  uuid NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expira_en  timestamptz NOT NULL,
  -- De un solo uso. Se marca al consumirlo en lugar de borrarlo, para poder
  -- distinguir "este enlace ya se usó" de "este enlace nunca existió".
  usado_en   timestamptz,
  creado_en  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tokens_acceso_alumno ON tokens_acceso (alumno_id);

-- ─── Sesiones ───────────────────────────────────────────────────────────────
-- En tabla y no en un JWT firmado, a propósito: con una fila se puede cerrar
-- la sesión de alguien desde el panel. Un JWT válido no se puede revocar sin
-- montar, precisamente, una lista en base de datos.
CREATE TABLE IF NOT EXISTS sesiones (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id  uuid NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expira_en  timestamptz NOT NULL,
  creado_en  timestamptz NOT NULL DEFAULT now(),
  user_agent text
);
CREATE INDEX IF NOT EXISTS sesiones_alumno ON sesiones (alumno_id);

-- ─── Progreso por video ─────────────────────────────────────────────────────
-- Una fila por alumno y video. `numero` es el del temario (1..10) y no una
-- clave foránea: el temario vive en `curso.config.ts`, que es contenido, no
-- datos. Si algún día los videos pasan a la base, esto se convierte en FK.
CREATE TABLE IF NOT EXISTS progreso (
  alumno_id   uuid NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  numero      smallint NOT NULL,
  visto_en    timestamptz,
  -- Quiz superado. Es lo que cuenta para la certificación, no el visionado.
  quiz_ok_en  timestamptz,
  -- Cuántas veces lo ha intentado. Sirve para saber qué video no se entiende.
  intentos    smallint NOT NULL DEFAULT 0,
  PRIMARY KEY (alumno_id, numero)
);

-- ─── Peticiones de acceso ───────────────────────────────────────────────────
-- Para limitar el envío de enlaces mágicos por email, que es el único endpoint
-- que manda correo a una dirección que teclea un desconocido.
CREATE TABLE IF NOT EXISTS peticiones_acceso (
  email     text NOT NULL,
  pedido_en timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS peticiones_acceso_email ON peticiones_acceso (email, pedido_en);
