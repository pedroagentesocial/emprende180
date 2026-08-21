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

-- ─── Alumnos ────────────────────────────────────────────────────────────────
-- El email es la identidad; la contraseña, la llave del día a día.
--
-- `clave_hash` es NULL mientras el alumno no se haya puesto contraseña, que es
-- justo lo que pasa entre que se le da de alta y abre el correo de invitación.
-- Ese nulo no es un hueco por rellenar: es un estado con significado, y lo que
-- hace que la pantalla de "ponte una contraseña" sepa cuándo tiene que salir.
--
-- ⚠️ Lo que hay aquí NO es la contraseña: es un scrypt con su sal. Ver
-- `src/lib/claves.ts`.
CREATE TABLE IF NOT EXISTS alumnos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Siempre en minúsculas y sin espacios: lo normaliza la aplicación antes de
  -- escribir, y el UNIQUE de abajo lo garantiza.
  email         text NOT NULL UNIQUE,
  nombre        text,
  -- 'alumno' | 'admin'. Un admin es un alumno que además ve el panel: así el
  -- inicio de sesión es exactamente el mismo y no hay una segunda puerta que
  -- proteger.
  rol           text NOT NULL DEFAULT 'alumno',
  -- Idioma en el que se le escribe. Se hereda del alta.
  idioma        text NOT NULL DEFAULT 'es',
  -- Baja sin borrar: se conserva el progreso por si vuelve, y se conserva el
  -- rastro de que existió. Un DELETE aquí se llevaría por delante su historial.
  activo        boolean NOT NULL DEFAULT true,
  clave_hash    text,
  alta_en       timestamptz NOT NULL DEFAULT now(),
  ultimo_acceso timestamptz
);

-- Para bases creadas antes de que existieran las contraseñas. `IF NOT EXISTS`
-- mantiene este archivo aplicable tantas veces como haga falta.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS clave_hash text;

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
