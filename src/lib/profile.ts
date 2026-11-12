import type { Student } from "@lib/data";
import type { Txt } from "@i18n/idioma";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL PERFIL DEL ALUMNO: qué tiene, qué le falta y para qué sirve (12-11-2026)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * La guía de "ten tu información al día" sale de aquí: cinco pasos, cada uno
 * con POR QUÉ importa. No es un formulario de burocracia: un Embajador sin
 * teléfono no se entera de que le pagamos, y uno sin foto es un nombre más en
 * la lista de su equipo.
 */
const t = (es: string, en: string): Txt => ({ es, en });

export interface ProfileStep {
  key: "photo" | "name" | "phone" | "whatsapp" | "email";
  done: boolean;
  label: Txt;
  why: Txt;
}

export function profileSteps(s: Student): ProfileStep[] {
  return [
    {
      key: "photo",
      done: !!s.photoAt,
      label: t("Sube tu foto", "Add your photo"),
      why: t("Tu equipo y el de Emprende180 te reconocen a primera vista.", "Your team and the Entrepreneur180 team recognise you at a glance."),
    },
    {
      key: "name",
      done: !!s.name?.trim() && !!s.lastName?.trim(),
      label: t("Escribe tu nombre y apellido", "Add your first and last name"),
      why: t("Es el nombre con el que te damos de alta en los negocios y con el que te pagamos.", "It is the name we register you with at the businesses and pay you under."),
    },
    {
      key: "phone",
      done: !!s.phone?.trim(),
      label: t("Añade tu teléfono", "Add your phone number"),
      why: t("Para avisarte de un pago o de un cliente nuevo sin depender del correo.", "So we can tell you about a payout or a new client without relying on email."),
    },
    {
      key: "whatsapp",
      done: s.whatsapp !== null,
      label: t("Dinos si usas WhatsApp", "Tell us if you use WhatsApp"),
      why: t("Así sabemos por dónde escribirte primero.", "So we know where to message you first."),
    },
    {
      key: "email",
      done: true,
      label: t("Tu correo, confirmado", "Your email, confirmed"),
      why: t("Es con el que entras y donde llegan tus códigos. Si cambias de correo, cámbialo aquí.", "It is how you sign in and where your codes arrive. If you change email, change it here."),
    },
  ];
}

export function profilePercent(s: Student): number {
  const steps = profileSteps(s);
  return Math.round((steps.filter((x) => x.done).length / steps.length) * 100);
}

/** La dirección de su foto, o `null`. Cambia cuando cambia la foto. */
export const photoUrl = (s: Pick<Student, "id" | "photoAt">): string | null =>
  s.photoAt ? `/student/foto/${s.id}?v=${s.photoAt.getTime()}` : null;

/** Nombre y apellido, o el correo si no hay nombre. */
export const displayName = (s: Pick<Student, "name" | "lastName" | "email">): string =>
  [s.name, s.lastName].filter((x) => x?.trim()).join(" ") || s.email;
