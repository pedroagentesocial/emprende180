import postgres from "postgres";
import { readFileSync } from "node:fs";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PONER LA BASE DE DATOS AL DÍA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `npm run db:setup` — se conecta, aplica `db/schema.sql` y cuenta lo que hay.
 *
 * Existe porque el otro camino era "instala psql y ejecuta este comando", y
 * `psql` no viene en Windows. Esto usa la misma librería que la aplicación, así
 * que si el script conecta, la aplicación conecta.
 *
 * ⚠️ ES IDEMPOTENTE, COMO EL PROPIO ESQUEMA. Todo son `CREATE TABLE IF NOT
 * EXISTS` y `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, así que se puede
 * ejecutar cada vez que se despliegue algo que añada una columna. No borra
 * nada, no vacía nada y no toca ninguna fila existente.
 *
 * Lee `DATABASE_URL` de tres sitios, en este orden: el argumento, el entorno y
 * el `.env` del proyecto. El argumento es lo cómodo para apuntar a una base de
 * pruebas sin tocar el `.env`:
 *
 *   node scripts/db-setup.mjs "postgres://…"
 */

const desdeArgumento = process.argv[2];
const desdeEntorno = process.env.DATABASE_URL;

/** El `.env` a mano: este script corre fuera de Astro, sin `import.meta.env`. */
function desdeArchivo() {
  try {
    const texto = readFileSync(".env", "utf8");
    const linea = texto
      .split("\n")
      .find((l) => l.trim().startsWith("DATABASE_URL="));
    if (!linea) return null;
    return linea.slice(linea.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  } catch {
    return null;
  }
}

const url = desdeArgumento || desdeEntorno || desdeArchivo();

if (!url) {
  console.error(
    [
      "",
      "  No hay DATABASE_URL.",
      "",
      "  Ponla en el .env del proyecto o pásala como argumento:",
      "    npm run db:setup -- \"postgres://usuario:clave@host/base?sslmode=require\"",
      "",
      "  En Neon o Supabase la cadena está en el panel del proyecto. Usa la",
      "  versión CON POOLER si te dan las dos: en serverless se abren y cierran",
      "  conexiones sin parar y el pooler es lo que evita quedarse sin sitio.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

/* Igual que la aplicación: `prepare: false` por el pooler en modo transacción y
   `max: 1` porque esto es un script de una pasada. Ver `src/lib/data.ts`. */
const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });

/** Oculta la contraseña para poder enseñar a qué host se está conectando. */
const aQue = (u) => {
  try {
    const p = new URL(u);
    return `${p.hostname}${p.pathname}`;
  } catch {
    return "(cadena no reconocible)";
  }
};

console.log(`\n  Conectando a ${aQue(url)}…`);

try {
  await sql`SELECT 1`;
  console.log("  ✓ Conexión correcta");
} catch (error) {
  console.error("\n  ✗ No se pudo conectar:", error.message);
  console.error(
    "\n  Lo más habitual: falta `?sslmode=require` al final, o la cadena es la",
    "\n  directa cuando hacía falta la del pooler.\n",
  );
  await sql.end();
  process.exit(1);
}

/* El esquema entero en UNA llamada. `postgres` admite varias sentencias en un
   `unsafe`, y el archivo está escrito para poder correrse tal cual. */
const esquema = readFileSync("db/schema.sql", "utf8");

try {
  await sql.unsafe(esquema);
  console.log("  ✓ db/schema.sql aplicado");
} catch (error) {
  console.error("\n  ✗ El esquema falló:", error.message);
  await sql.end();
  process.exit(1);
}

/* Y lo que hay dentro, para poder verlo sin abrir otra herramienta. */
const [{ tablas }] = await sql`
  SELECT count(*)::int AS tablas
  FROM information_schema.tables
  WHERE table_schema = 'public'`;

const conteos = await sql`
  SELECT 'alumnos' AS tabla, count(*)::int AS filas FROM alumnos
  UNION ALL SELECT 'cupones', count(*)::int FROM cupones
  UNION ALL SELECT 'sesiones', count(*)::int FROM sesiones
  UNION ALL SELECT 'tokens_acceso', count(*)::int FROM tokens_acceso
  ORDER BY tabla`;

console.log(`\n  ${tablas} tablas en el esquema público:\n`);
for (const c of conteos) {
  console.log(`    ${c.tabla.padEnd(16)} ${c.filas} filas`);
}

const [{ admins }] = await sql`
  SELECT count(*)::int AS admins FROM alumnos WHERE rol = 'admin'`;

if (admins === 0) {
  console.log(
    [
      "",
      "  Todavía no hay ningún admin, y es lo normal en una base recién creada.",
      "  El primero se crea solo: pon tu correo en ADMIN_EMAILS y pide el enlace",
      "  de acceso desde /login. A partir del segundo, se dan de alta desde el",
      "  propio portal.",
    ].join("\n"),
  );
}

console.log("");
await sql.end();
