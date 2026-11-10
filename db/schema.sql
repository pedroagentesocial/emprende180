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
-- ─── EL CONTADOR DE INTENTOS ────────────────────────────────────────────────
-- ⚠️ ESTO ES LO QUE HACE QUE UN CÓDIGO DE SEIS DÍGITOS SEA SEGURO, y sin ello
-- el cambio de enlace a código habría sido un paso atrás.
--
-- Un enlace mágico es una cadena larga al azar: adivinarla no es una opción.
-- Un código de seis dígitos tiene un millón de combinaciones, que para una
-- máquina no es nada. Lo que lo salva no es el código, es que solo se pueda
-- fallar unas pocas veces: con cinco intentos, la probabilidad de acertar a
-- ciegas es de cinco entre un millón.
--
-- Va en la fila del código y no en memoria del servidor a propósito: en
-- serverless hay varias instancias y un contador en memoria se reinicia o se
-- reparte, que es como no tenerlo. Ver entrarConCodigo en src/lib/auth.ts.
ALTER TABLE tokens_acceso ADD COLUMN IF NOT EXISTS intentos smallint NOT NULL DEFAULT 0;

-- Buscar el código vivo de alguien es la consulta de cada intento de entrada.
CREATE INDEX IF NOT EXISTS tokens_alumno ON tokens_acceso (alumno_id, creado_en DESC);

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

-- ─── Cupones ────────────────────────────────────────────────────────────────
-- ⚠️ UN CUPÓN AQUÍ NO DESCUENTA NADA, PORQUE AQUÍ NO SE COBRA. El pago se hace
-- por teléfono, fuera de este sistema. Lo que un cupón es de verdad en este
-- negocio es una PROMESA con nombre: alguien lo escribe en el formulario, y
-- quien le llama ve en la ficha del lead qué precio le prometieron y por qué
-- canal llegó. Esa es toda su función, y por eso no hay ninguna columna que
-- hable de importes cobrados.
--
-- Las dos cuentas están separadas a propósito:
--  · `veces_pedido` — cuánta gente lo escribió. Mide el alcance del canal.
--  · las altas con ese código — cuántas de esas se convirtieron en cliente.
-- Juntarlas en un solo número escondería justo lo que hay que saber: un cupón
-- con cuarenta peticiones y dos ventas es un cupón que atrae y no cierra.
CREATE TABLE IF NOT EXISTS cupones (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Siempre en MAYÚSCULAS y sin espacios: lo normaliza la aplicación antes de
  -- escribir y antes de buscar, así que "laura20" y "LAURA20" son el mismo.
  codigo       text NOT NULL UNIQUE,
  descripcion  text,
  -- 'porcentaje' | 'importe'. Sin CHECK, por lo mismo que en `rol`: la lista
  -- vive en el código y una restricción aquí obligaría a migrar para ampliarla.
  tipo         text NOT NULL DEFAULT 'porcentaje',
  valor        numeric(10,2) NOT NULL,
  activo       boolean NOT NULL DEFAULT true,
  -- Nulo = no caduca. Nulo = sin tope de usos. Un cupón sin límites es una
  -- decisión válida y frecuente; obligar a poner fechas inventadas no lo es.
  caduca_en    timestamptz,
  usos_max     integer,
  veces_pedido integer NOT NULL DEFAULT 0,
  -- De qué agente es, si es de alguno. Sirve para saber a quién atribuir el
  -- lead que llegue con él.
  agente_id    uuid REFERENCES alumnos(id) ON DELETE SET NULL,
  creado_por   uuid REFERENCES alumnos(id) ON DELETE SET NULL,
  creado_en    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cupones_activo ON cupones (activo, creado_en DESC);

-- El código con el que llegó cada alumno, si llegó con alguno. Se guarda el
-- TEXTO y no una clave foránea: si algún día se borra el cupón, la ficha del
-- alumno tiene que seguir diciendo con qué promesa entró.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS cupon text;

-- ─── LO QUE PIDE EL ALTA DESDE LA WEB (13-10-2026) ──────────────────────────
-- Hasta hoy las cuentas las creaba un agente desde el panel y con el correo
-- bastaba. Con /subscribe se da de alta la propia persona, y estas son las
-- columnas de lo que escribe.
--
-- ⚠️ EL APELLIDO VA APARTE DE `nombre` Y NO PEGADO A ÉL. Partir "Ana Ruiz
-- Pérez" después, adivinando dónde acaba el nombre, falla con cualquier
-- apellido compuesto, que en esta clientela son la mitad. Se pregunta en dos
-- campos y se guarda en dos.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS apellido text;

-- ⚠️ EL TELÉFONO SE GUARDA TAL Y COMO LO ESCRIBEN. Nada de normalizar a E.164
-- aquí: esta gente escribe "(385) 588-3717", "385 588 3717" y "+1 385…", y una
-- normalización a medias deja números que no se pueden marcar. Lo arregla quien
-- lo vaya a marcar, o el día que haya envío de SMS de verdad.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS telefono text;

-- Si ese número recibe WhatsApp. Lo pregunta el formulario con una casilla.
-- Con público hispano en EE. UU. la mitad de los números son de WhatsApp y la
-- otra mitad de SMS, y sin esto se adivina en cada contacto.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS whatsapp boolean;

-- ⚠️ AQUÍ HUBO `ciudad` Y `estado` Y NO LLEGARON A PRODUCCIÓN. Se añadieron el
-- 13-10-2026 por la zona horaria de la llamada de equipo y el cliente los
-- quitó el mismo día, antes de correr la migración. No hay nada que revertir;
-- si vuelven a hacer falta, que vuelvan con un uso concreto detrás.

-- Cómo nos encontró: 'revista' | 'facebook' | 'instagram' | 'tiktok' |
-- 'youtube' | 'referido' | 'otro'.
--
-- Sin CHECK, por lo mismo que `rol` y `tipo`: la lista vive en el código y una
-- restricción aquí obligaría a migrar cada vez que se abra un canal nuevo.
--
-- ⚠️ NO ES LO MISMO QUE `cupon` NI LO SUSTITUYE. Esto dice por dónde llegó;
-- `cupon` dice con qué código, y `alta_por` a qué Embajador se le atribuye.
-- Alguien puede decir "me lo contó un amigo" sin traer código, y eso es un dato
-- distinto de no haber dicho nada.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS origen text;

-- Para contar de dónde viene la gente sin recorrer la tabla entera.
CREATE INDEX IF NOT EXISTS alumnos_origen ON alumnos (origen, alta_en DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- PORTAL DE EMBAJADORES (10-11-2026)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Los Embajadores refieren clientes a varios negocios (Revivi, Venture, las
-- clínicas, Lira Medical, Señor de las Casas...). Cada negocio solo nos cuenta
-- HECHOS: llegó un lead, asistió a su cita, compró, renovó, se reembolsó. Aquí
-- se guardan esos hechos y las reglas, y la comisión se CALCULA al leer
-- (`src/lib/commissions.ts`). No hay tabla de comisiones a propósito: una
-- cifra guardada se queda mal con el primer reembolso, y una calculada no.
--
-- Por eso las reglas NO se editan: cambiar un porcentaje es añadir una regla
-- nueva con su fecha de vigencia. Una venta cobra la regla que estaba en vigor
-- el día que pasó, así que un cambio nunca toca lo ya ganado.

-- ─── El Embajador es un alumno con rol 'agente' ─────────────────────────────
-- Su código es el mismo en todos los negocios. Lo genera el admin al
-- activarlo; nulo = todavía no es Embajador.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS codigo_embajador text;
CREATE UNIQUE INDEX IF NOT EXISTS alumnos_codigo_embajador
  ON alumnos (codigo_embajador) WHERE codigo_embajador IS NOT NULL;

-- ⚠️ EL PATROCINADOR SE FIJA AL ACTIVAR Y NO SIGUE A `alta_por`. `alta_por` es
-- quién dio de alta la cuenta; esto es quién cobra el nivel 2 de sus ventas.
-- Nacen iguales, pero esta columna solo la cambia el admin: de ella depende
-- dinero, y no puede moverse como efecto de otra cosa.
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS patrocinador_id uuid
  REFERENCES alumnos(id) ON DELETE SET NULL;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS embajador_desde timestamptz;
ALTER TABLE alumnos ADD COLUMN IF NOT EXISTS embajador_aprobado_por uuid
  REFERENCES alumnos(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS alumnos_patrocinador ON alumnos (patrocinador_id);

-- ─── Negocios ───────────────────────────────────────────────────────────────
-- Cada aliado que nos manda hechos. `fuente` dice por dónde llegan: 'ghl'
-- (webhook de un workflow de GoHighLevel) o 'clinics' (los pedimos nosotros).
-- Cuando Lira pase de GHL a clinics se cambia esta columna y nada más.
--
-- ⚠️ DEL SECRETO SOLO SE GUARDA EL HASH. El secreto se enseña una vez al
-- crearlo, se pega en el workflow de GHL y aquí no queda nada que robar.
CREATE TABLE IF NOT EXISTS negocios (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Minúsculas, números y guiones: va en la dirección del webhook.
  slug              text NOT NULL UNIQUE,
  nombre            text NOT NULL,
  fuente            text NOT NULL DEFAULT 'ghl',
  -- El enlace que comparte el Embajador, con {codigo} donde va su código.
  -- Nulo = este negocio no tiene enlace propio (se refiere de palabra).
  enlace_plantilla  text,
  secreto_hash      text,
  secreto_creado_en timestamptz,
  activo            boolean NOT NULL DEFAULT true,
  creado_en         timestamptz NOT NULL DEFAULT now()
);

-- ─── Reglas de comisión ─────────────────────────────────────────────────────
-- Una fila por (negocio, nivel, clase de hecho, desde qué pago), con su fecha.
--   · nivel 1 = el Embajador que trajo al cliente; nivel 2 = su patrocinador.
--   · clase 'venta' (compra y renovación) cobra un porcentaje del importe;
--     clase 'cita' (cita asistida) cobra un importe fijo.
--   · `pago_desde`: 1 = primera compra, 2 = desde la primera renovación... La
--     regla de un pago es la de mayor `pago_desde` que no lo pase, y así el
--     porcentaje puede ir bajando con cada renovación.
CREATE TABLE IF NOT EXISTS reglas_comision (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id            uuid NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  nivel                 smallint NOT NULL,
  clase                 text NOT NULL DEFAULT 'venta',
  pago_desde            integer NOT NULL DEFAULT 1,
  porcentaje            numeric(5,2),
  importe_fijo_centavos integer,
  vigente_desde         timestamptz NOT NULL DEFAULT now(),
  creado_por            uuid REFERENCES alumnos(id) ON DELETE SET NULL,
  creado_en             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reglas_comision_negocio
  ON reglas_comision (negocio_id, nivel, clase, vigente_desde);

-- ─── Referidos ──────────────────────────────────────────────────────────────
-- Un cliente de un negocio que llegó por un Embajador.
--
-- ⚠️ EL UNIQUE (negocio_id, ref_externa) ES LA REGLA "EL PRIMERO GANA". El
-- primer hecho que llega con ese cliente lo ata a su Embajador y ningún hecho
-- posterior lo mueve. Es por negocio: el mismo cliente puede ser de Ana en
-- Lira y de Luis en Revivi.
--
-- `ref_externa` es el id del cliente EN SU NEGOCIO (el contacto de GHL, el
-- referido de clinics), opaco: nunca un correo ni un número de paciente.
--
-- ⚠️ EL NOMBRE VA CIFRADO Y SOLO CON CONSENTIMIENTO. En los negocios médicos,
-- decirle al Embajador que alguien es cliente es información protegida. Llega
-- solo si el cliente lo autorizó (`consentimiento_en`) y se guarda con
-- AES-256-GCM (`src/lib/sealed.ts`). Sin consentimiento el portal dice
-- "Cliente #4" y la comisión se cobra igual.
CREATE TABLE IF NOT EXISTS referidos (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id         uuid NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  ref_externa        text NOT NULL,
  embajador_id       uuid NOT NULL REFERENCES alumnos(id) ON DELETE RESTRICT,
  -- 'enlace' | 'cupon' | 'formulario' | 'mostrador' | 'otro'
  canal              text,
  primer_contacto_en timestamptz NOT NULL,
  nombre_cifrado     text,
  consentimiento_en  timestamptz,
  creado_en          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (negocio_id, ref_externa)
);
CREATE INDEX IF NOT EXISTS referidos_embajador
  ON referidos (embajador_id, primer_contacto_en DESC);

-- ─── Hechos ─────────────────────────────────────────────────────────────────
-- Lo que nos contó cada negocio: 'lead' | 'attended' | 'purchase' |
-- 'renewal' | 'refund' | 'cancel'. Los dos últimos restan y apuntan con
-- `original_id` al hecho que deshacen.
--
-- ⚠️ EL UNIQUE (negocio_id, evento_externo) HACE INOFENSIVO REPETIR. GHL
-- reintenta y clinics se relee desde el último cursor: el mismo hecho dos
-- veces se guarda una.
CREATE TABLE IF NOT EXISTS hechos (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id       uuid NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  evento_externo   text NOT NULL,
  referido_id      uuid NOT NULL REFERENCES referidos(id) ON DELETE CASCADE,
  tipo             text NOT NULL,
  importe_centavos integer,
  numero_pago      integer,
  ocurrido_en      timestamptz NOT NULL,
  original_id      uuid REFERENCES hechos(id) ON DELETE SET NULL,
  recibido_en      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (negocio_id, evento_externo)
);
CREATE INDEX IF NOT EXISTS hechos_referido ON hechos (referido_id, ocurrido_en);

-- ─── Pagos a Embajadores ────────────────────────────────────────────────────
-- Lo que se le pagó a cada uno: 'dinero' (por fuera, el admin lo anota) o
-- 'credito_revivi' (crédito para gastar en Revivi; `ref_clinics` es el abono
-- en clinics una vez hecho, nulo mientras no se haya abonado).
CREATE TABLE IF NOT EXISTS pagos_embajador (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  embajador_id     uuid NOT NULL REFERENCES alumnos(id) ON DELETE RESTRICT,
  metodo           text NOT NULL DEFAULT 'dinero',
  importe_centavos integer NOT NULL,
  pagado_en        timestamptz NOT NULL DEFAULT now(),
  nota             text,
  ref_clinics      text,
  registrado_por   uuid REFERENCES alumnos(id) ON DELETE SET NULL,
  creado_en        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pagos_embajador_embajador
  ON pagos_embajador (embajador_id, pagado_en DESC);

-- ─── Quién vio los nombres ──────────────────────────────────────────────────
-- Una fila cada vez que alguien abre una lista con nombres de clientes: el
-- rastro que se pide al enseñar información protegida (quién, de quién,
-- cuándo).
CREATE TABLE IF NOT EXISTS registro_vistas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quien_id     uuid REFERENCES alumnos(id) ON DELETE SET NULL,
  embajador_id uuid REFERENCES alumnos(id) ON DELETE SET NULL,
  que          text NOT NULL,
  cuando       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS registro_vistas_cuando ON registro_vistas (cuando DESC);
