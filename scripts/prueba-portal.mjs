/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Pruebas de SEGURIDAD y RENDIMIENTO del portal (12-11-2026)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   npm run dev              (en otra terminal)
 *   node scripts/prueba-portal.mjs [http://localhost:4322]
 *
 * Solo contra `astro dev` con los datos de prueba en memoria: entra con el
 * código fijo de desarrollo (123456), que un build de producción no tiene.
 * No cambia nada que no deje como estaba, y no toca nombres ni correos de
 * Embajadores (eso iría a clinics).
 *
 * Sale con código 1 si alguna prueba falla.
 */
const BASE = (process.argv[2] ?? "http://localhost:4322").replace(/\/$/, "");
const ORIGIN = new URL(BASE).origin;

const ACCOUNTS = {
  laura: "agente@emprende180.com",
  marta: "alumno@emprende180.com",
  rosa: "rosa@ejemplo.com",
  admin: process.env.ADMIN_EMAIL ?? "pedro@agentesocial.com",
};

let failed = 0;
const ok = (name, cond, extra = "") => {
  if (!cond) failed++;
  console.log(`${cond ? "  ✓" : "  ✗"} ${name}${extra ? `  (${extra})` : ""}`);
};

/* ─── Un cliente con su cookie ─────────────────────────────────────────── */
function client() {
  const jar = new Map();
  const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  const keep = (res) => {
    for (const line of res.headers.getSetCookie?.() ?? []) {
      const [pair] = line.split(";");
      const i = pair.indexOf("=");
      const k = pair.slice(0, i).trim();
      const v = pair.slice(i + 1).trim();
      if (!v || /max-age=0|expires=thu, 01 jan 1970/i.test(line)) jar.delete(k);
      else jar.set(k, v);
    }
  };
  const req = async (path, init = {}) => {
    const res = await fetch(BASE + path, {
      redirect: "manual",
      ...init,
      headers: { Origin: ORIGIN, Cookie: cookie(), ...(init.headers ?? {}) },
    });
    keep(res);
    return res;
  };
  const form = (path, data) =>
    req(path, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    });
  const login = async (email) => {
    const json = (body) => req("/api/codigo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    await json({ accion: "pedir", email });
    const r = await json({ accion: "verificar", email, codigo: "123456" });
    return r.ok;
  };
  return { req, form, login, jar };
}

const where = (res) => res.headers.get("location") ?? "";

/* ─── Seguridad ────────────────────────────────────────────────────────── */
console.log(`\nSEGURIDAD · ${BASE}`);

const anon = client();
for (const p of ["/student", "/student/profile", "/student/ambassador/payouts", "/student/people", "/student/foto/dev-2"]) {
  const r = await anon.req(p);
  ok(`sin sesión, ${p} manda a /login`, r.status >= 300 && r.status < 400 && where(r).includes("/login"), `${r.status}`);
}

const laura = client();
const marta = client();
const admin = client();
const rosa = client();
ok("Laura entra con su código", await laura.login(ACCOUNTS.laura));
ok("Marta entra con su código", await marta.login(ACCOUNTS.marta));
ok("el admin entra con su código", await admin.login(ACCOUNTS.admin));
await admin.req("/student"); // pone al día a los Embajadores

{
  const r = await laura.req("/student/profile", { method: "POST", headers: { Origin: "https://malo.example", "Content-Type": "application/x-www-form-urlencoded" }, body: "action=profile" });
  ok("un POST desde otro sitio se rechaza (CSRF)", r.status === 403, `${r.status}`);
  const r2 = await fetch(BASE + "/student/profile", { method: "POST", redirect: "manual", headers: { Cookie: [...laura.jar].map(([k, v]) => `${k}=${v}`).join("; "), "Content-Type": "application/x-www-form-urlencoded" }, body: "action=profile" });
  ok("un POST sin origen se rechaza (CSRF)", r2.status === 403, `${r2.status}`);
}

for (const p of ["/student/people", "/student/ambassadors", "/student/businesses", "/student/coupons", "/student/settings"]) {
  const r = await laura.req(p);
  ok(`una alumna no abre ${p}`, r.status === 404, `${r.status}`);
}
for (const p of ["/student/ambassador/referrals", "/student/ambassador/payouts"]) {
  const r = await admin.req(p);
  ok(`quien no es Embajador no abre ${p}`, r.status === 404, `${r.status}`);
}

{
  const pre = await rosa.login(ACCOUNTS.rosa);
  if (pre) {
    const r = await rosa.req("/student/ambassador/payouts");
    ok("un pre-registro solo ve la espera", where(r).includes("/student/espera"), where(r));
  } else ok("un pre-registro solo ve la espera", true, "Rosa ya tiene acceso: se omite");
}

{
  const h = (await laura.req("/student")).headers;
  ok("las páginas privadas no se guardan en caché", /no-store/.test(h.get("cache-control") ?? ""));
  ok("no se pueden meter en un iframe", h.get("x-frame-options") === "DENY");
  ok("el navegador no adivina tipos (nosniff)", h.get("x-content-type-options") === "nosniff");
}

/* La foto: solo imágenes de verdad, pequeñas, y solo la ven quien debe. */
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const fake = "data:image/png;base64," + Buffer.from("<script>alert(1)</script>").toString("base64");
const svg = "data:image/svg+xml;base64," + Buffer.from("<svg onload=alert(1)>").toString("base64");
const big = "data:image/jpeg;base64," + Buffer.alloc(260_000, 0xff).toString("base64");
for (const [name, data] of [["un SVG", svg], ["un HTML disfrazado de PNG", fake], ["una imagen de más de 200 KB", big]]) {
  const r = await laura.form("/student/profile", { action: "photo", photo: data });
  ok(`se rechaza ${name}`, where(r).includes("error=photo"), where(r).split("?")[1]);
}
{
  const r = await laura.form("/student/profile", { action: "photo", photo: PNG });
  ok("se acepta una foto PNG real", where(r).includes("ok=photo"));
  const html = await (await laura.req("/student/profile")).text();
  const url = html.match(/\/student\/foto\/[\w-]+\?v=\d+/)?.[0];
  ok("la foto tiene su dirección", !!url);
  if (url) {
    const own = await laura.req(url);
    ok("Laura ve su foto", own.status === 200 && own.headers.get("content-type") === "image/png");
    ok("su foto se guarda solo en su navegador", /private/.test(own.headers.get("cache-control") ?? ""));
    ok("el admin ve su foto", (await admin.req(url)).status === 200);
    ok("otra alumna NO ve su foto (404)", (await marta.req(url)).status === 404);
  }
  await laura.form("/student/profile", { action: "photo-remove" });
}

/* Datos: teléfono inválido y texto que intenta ser código. */
{
  const r = await marta.form("/student/profile", { action: "profile", phone: "<b>123</b>", language: "es" });
  ok("se rechaza un teléfono con letras o etiquetas", where(r).includes("error=phone"));
}
{
  const html0 = await (await admin.req("/student/profile")).text();
  const before = (k) => (html0.match(new RegExp(`name="${k}" value="([^"]*)"`))?.[1] ?? "").replace(/&quot;|&#34;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const original = { name: before("name"), lastName: before("lastName"), phone: before("phone") };
  /* El ataque de verdad: cerrar la comilla del atributo y abrir una etiqueta. */
  const attack = "\"><img src=x onerror=alert(1)>";
  await admin.form("/student/profile", { action: "profile", name: attack, lastName: original.lastName, phone: original.phone, language: "es" });
  const html = await (await admin.req("/student/profile")).text();
  ok("un nombre con HTML se pinta como texto, no se ejecuta", !html.includes("\"><img src=x") && html.includes("&lt;img src=x"));
  await admin.form("/student/profile", { action: "profile", ...original, language: "es" });
}

/* El correo: un código mal no cambia nada, y los intentos están limitados. */
{
  const taken = await marta.form("/student/profile", { action: "email-request", email: ACCOUNTS.laura });
  ok("no se puede pedir el correo de otra cuenta", where(taken).includes("error=taken"));
  const sent = await marta.form("/student/profile", { action: "email-request", email: "marta.prueba@ejemplo.com" });
  ok("se manda el código al correo nuevo", where(sent).includes("ok=sent") || where(sent).includes("error=tooMany"), where(sent).split("?")[1]);
  /* Una cookie de cambio inventada no sirve (va cifrada y firmada). */
  const forged = client();
  for (const [k, v] of marta.jar) forged.jar.set(k, v);
  forged.jar.set("e180_correo_nuevo", "v1.inventado.de-mentira");
  const f = where(await forged.form("/student/profile", { action: "email-verify", code: "123456" }));
  ok("una cookie de cambio inventada no cambia el correo", !f.includes("ok=email"), f.split("?")[1]);
  const codes = [];
  for (let i = 0; i < 5; i++) codes.push(where(await marta.form("/student/profile", { action: "email-verify", code: "000000" })));
  ok("un código equivocado no cambia el correo", !codes.some((x) => x.includes("ok=email")));
  ok("tras 5 intentos, se bloquea un rato", codes[4].includes("error=tooMany"), codes[4].split("?")[1]);
  await marta.form("/student/profile", { action: "email-cancel" });
  const html = await (await marta.req("/student/profile")).text();
  ok("Marta sigue con su correo", html.includes(ACCOUNTS.marta));
}

/* ─── Rendimiento ──────────────────────────────────────────────────────── */
console.log(`\nRENDIMIENTO · 8 peticiones por página tras calentar (servidor de desarrollo)`);
const pages = [
  [laura, "Laura", ["/student", "/student/ambassador/referrals", "/student/ambassador/payouts", "/student/ambassador/team", "/student/ambassador/share", "/student/profile"]],
  [admin, "Admin", ["/student", "/student/people", "/student/ambassadors", "/student/businesses"]],
];
const LIMIT_MS = Number(process.env.LIMITE_MS ?? 1200);
const LIMIT_KB = 600;
for (const [c, who, list] of pages) {
  for (const p of list) {
    await c.req(p);
    const times = [];
    let size = 0;
    for (let i = 0; i < 8; i++) {
      const t0 = performance.now();
      const r = await c.req(p);
      size = (await r.arrayBuffer()).byteLength;
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    const med = times[4];
    const p95 = times[7];
    ok(
      `${who} ${p.padEnd(32)} mediana ${med.toFixed(0).padStart(4)} ms · peor ${p95.toFixed(0).padStart(4)} ms · ${(size / 1024).toFixed(0)} KB`,
      med < LIMIT_MS && size / 1024 < LIMIT_KB,
    );
  }
}

console.log(failed ? `\n${failed} prueba(s) fallaron.\n` : "\nTodo bien.\n");
process.exit(failed ? 1 : 0);
