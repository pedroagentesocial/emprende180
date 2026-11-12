/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Todo alumno es Embajador (decisión del 11-11-2026)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El curso de Emprende180 CONSISTE en ser Embajador: cada alumno tiene su
 * código y su alta en clinics. Ya no hay un paso de "activar": dar de alta a
 * un alumno lo hace Embajador en el mismo momento, y `ensureAllAmbassadors`
 * pone al día a los que ya existían.
 *
 * Solo el admin da de alta. Un Embajador no da de alta a nadie; su equipo (el
 * nivel 2) es quien el admin le pone como patrocinado.
 *
 * ⚠️ QUIEN SE REGISTRÓ SOLO DESDE /subscribe NO SE VUELVE EMBAJADOR AQUÍ. Su
 * correo no está verificado (ver `api/registro.ts`) y un Embajador cobra
 * dinero y nace en clinics con ese correo. Se le distingue por `source`
 * (solo el registro web lo rellena) y el admin lo confirma a mano desde
 * Alumnos.
 */
import { normaliseCode, repo, type Student } from "@lib/data";
import { clinicsConfigured, linkAmbassadorInClinics } from "@lib/clinicsApi";
import { isAmbassador, isAmbassadorPaused } from "@lib/permissions";

/** Un código a partir del nombre: LAURA27. */
export function suggestCode(s: Student): string {
  const base = normaliseCode((s.name ?? s.email.split("@")[0] ?? "E180").split(/\s+/)[0] ?? "E180")
    .normalize("NFD")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
  const n = String(Math.floor(10 + Math.random() * 90));
  return `${base || "E180"}${n}`;
}

/** ¿Debe ser Embajador ya, sin que nadie lo confirme? */
export const becomesAmbassadorAlone = (s: Student): boolean =>
  s.active && s.role === "student" && !s.source && !isAmbassador(s);

/**
 * Da de alta (o pone al día) al Embajador en clinics. `null` si fue bien.
 *
 * clinics guarda el código de la PRIMERA alta y no lo cambia después: si allí
 * ya tenía otro, se adopta el suyo, para que el código que se dice en la caja
 * de Revivi y el que sale en su portal sean el mismo.
 */
export async function linkInClinics(s: Student, approvedBy?: string): Promise<unknown | null> {
  if (!clinicsConfigured() || !isAmbassador(s)) return null;
  try {
    const res = await linkAmbassadorInClinics({
      externalRef: s.id,
      code: s.ambassadorCode!,
      name: [s.name, s.lastName].filter(Boolean).join(" ") || s.email,
      email: s.email,
      active: !isAmbassadorPaused(s),
    });
    const theirs = normaliseCode(res.code);
    if (theirs && theirs !== s.ambassadorCode) {
      await repo().activateAmbassador(s.id, {
        code: theirs,
        sponsorId: s.sponsorId,
        approvedBy: approvedBy ?? s.id,
      });
    }
    await repo().markClinicsLinked(s.id);
    return null;
  } catch (error) {
    return error;
  }
}

export interface MadeAmbassador {
  ok: boolean;
  code: string | null;
  /** El fallo de clinics, si lo hubo. La activación sigue en pie. */
  clinicsError: unknown | null;
}

/**
 * Lo hace Embajador: código (escrito o generado), patrocinador y alta en
 * clinics. Un código escrito se respeta o se rechaza; uno generado se
 * reintenta con otro número si ya existe.
 */
export async function makeAmbassador(
  target: Student,
  opts: { sponsorId: string | null; approvedBy: string; code?: string | null },
): Promise<MadeAmbassador> {
  const r = repo();
  const sponsorId = opts.sponsorId === target.id ? null : opts.sponsorId;
  const typed = opts.code ? normaliseCode(opts.code) : "";
  let code = typed || suggestCode(target);
  let ok = await r.activateAmbassador(target.id, { code, sponsorId, approvedBy: opts.approvedBy });
  for (let i = 0; !ok && !typed && i < 4; i++) {
    code = suggestCode(target);
    ok = await r.activateAmbassador(target.id, { code, sponsorId, approvedBy: opts.approvedBy });
  }
  if (!ok) return { ok: false, code: null, clinicsError: null };
  const fresh = await r.studentById(target.id);
  const clinicsError = fresh ? await linkInClinics(fresh, opts.approvedBy) : null;
  const final = (await r.studentById(target.id))?.ambassadorCode ?? code;
  return { ok: true, code: final, clinicsError };
}

let running: Promise<number> | null = null;
/* A quien ya era Embajador pero no está en clinics se le intenta una vez por
   arranque del servidor: si clinics lo rechaza, no se reintenta en cada
   página (el botón de su ficha lo hace a mano). */
const triedLink = new Set<string>();

/**
 * Vuelve Embajador a todo alumno que aún no lo es (salvo los del registro
 * web). Su patrocinador es quien lo registró, si es Embajador. Idempotente y
 * barato cuando no queda nadie: se llama al abrir las páginas del admin.
 */
export function ensureAllAmbassadors(approvedBy: string): Promise<number> {
  running ??= (async () => {
    const r = repo();
    const everyone = await r.listStudents();
    const byId = new Map(everyone.map((s) => [s.id, s]));
    let made = 0;
    for (const s of everyone.filter(becomesAmbassadorAlone)) {
      const inviter = s.registeredBy ? byId.get(s.registeredBy) : undefined;
      const sponsorId = inviter && isAmbassador(inviter) ? inviter.id : null;
      const res = await makeAmbassador(s, { sponsorId, approvedBy });
      if (res.ok) made++;
      if (res.clinicsError) console.warn(`[embajadores] ${s.id}: no se pudo dar de alta en clinics`);
    }
    for (const s of everyone) {
      if (!isAmbassador(s) || s.clinicsLinkedAt || triedLink.has(s.id)) continue;
      triedLink.add(s.id);
      if (await linkInClinics(s, approvedBy)) {
        console.warn(`[embajadores] ${s.id}: no se pudo dar de alta en clinics`);
      }
    }
    return made;
  })().finally(() => {
    running = null;
  });
  return running;
}
