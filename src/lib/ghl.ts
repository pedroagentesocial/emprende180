import type { Student } from "@lib/data";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GOHIGHLEVEL — el alta del portal llega al CRM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * En GHL viven dos cosas de este negocio: el CRM donde el Embajador trabaja sus
 * contactos y la plataforma donde está el curso. Este archivo es el hilo que
 * une lo que pasa AQUÍ —dar de alta, dar de baja, reactivar— con lo que tiene
 * que pasar ALLÍ: crear el contacto, etiquetarlo, darle el curso, quitárselo.
 *
 * ─── POR QUÉ UN WEBHOOK Y NO LA API ────────────────────────────────────────
 *
 * Porque es el camino que este proyecto ya usa para los leads de la landing
 * (`GHL_WEBHOOK_URL`, ver `src/pages/api/lead.ts`), y porque no pide
 * credenciales nuevas: en GHL se crea un workflow con disparador "Inbound
 * Webhook", se copia la URL y ya está. Sin OAuth, sin token que rotar, sin
 * app de marketplace que aprobar.
 *
 * ⚠️ LO QUE ESTO NO PUEDE HACER, DICHO ANTES DE QUE HAGA FALTA. Un webhook es
 * de ida: mandamos y no nos contestan. Eso significa que NO podemos:
 *
 *   · guardar el id del contacto de GHL para enlazar desde aquí a su ficha,
 *   · comprobar si el contacto se creó de verdad,
 *   · leer nada de GHL (si compró, si vio el curso, sus etiquetas).
 *
 * Para cualquiera de esas tres hace falta la API v2 con un token privado
 * (Ajustes → Private Integrations en GHL) y una columna nueva para el id. Es un
 * paso perfectamente factible, pero es OTRO paso: este archivo sería entonces
 * el mismo sitio, con `fetch` a `services.leadconnectorhq.com` en vez de al
 * webhook, y el resto del código no se enteraría.
 *
 * ─── LAS DOS REGLAS DE ESTA LLAMADA ────────────────────────────────────────
 *
 * 1. NO BLOQUEA Y NO PUEDE ROMPER UN ALTA. Se llama sin `await` desde el panel:
 *    el alumno ya está en NUESTRA base pase lo que pase con GHL. Si GHL está
 *    caído, el alta funciona igual y el fallo queda en el registro.
 * 2. TIENE PLAZO. Cinco segundos y se corta. Sin eso, un GHL que no contesta
 *    dejaría la petición del panel colgada hasta que el servidor se cansara.
 *
 * ⚠️ Y NO VIAJA NINGUNA CONTRASEÑA NI NINGÚN ENLACE DE ACCESO. Lo que sale de
 * aquí es lo que GHL necesita para tener la ficha al día: quién es, qué es y
 * quién lo dio de alta. El enlace de entrada es una llave y se manda por correo
 * a su dueño, no a un webhook.
 */

/**
 * Lo que le puede pasar a un alumno y a GHL le importa.
 *
 * ⚠️ `alta` Y `activacion` NO SON LO MISMO, y esa distinción es justo la que
 * hacía falta. `alta` es una decisión NUESTRA: el agente lo apunta en el panel.
 * `activacion` es un acto SUYO: la primera vez que entra de verdad.
 *
 * Sin el segundo, en GHL un alumno que nunca ha pulsado su enlace parece
 * exactamente igual que uno que entró el primer día, y no hay forma de saber a
 * quién hay que perseguir. Con los dos, la diferencia entre las dos fechas es
 * literalmente cuánto tarda la gente en empezar.
 */
export type EventoGhl = "alta" | "activacion" | "baja" | "reactivacion";

/** La URL del "Inbound Webhook" del workflow de alumnos, o nada. */
const webhook = (): string | null => import.meta.env.GHL_ALUMNOS_WEBHOOK_URL || null;

/** `true` cuando el enlace con GHL está configurado. Lo usa la pantalla de ajustes. */
export const ghlConectado = (): boolean => !!webhook();

interface Payload {
  event: EventoGhl;
  /** Nuestro id, para que GHL pueda volver a encontrar a esta persona. */
  portalId: string;
  email: string;
  name: string | null;
  role: Student["role"];
  language: Student["language"];
  active: boolean;
  /**
   * El id del agente que lo dio de alta, salga de donde salga el aviso.
   *
   * ⚠️ VA SIEMPRE, TAMBIÉN EN LA BAJA. La atribución no depende de quién esté
   * pulsando el botón: si a un alumno de Laura lo da de baja Pedro, en GHL sigue
   * siendo un alumno de Laura. Sin esto, la baja llegaba con la comisión en
   * blanco y allí parecía de la casa.
   */
  registeredById: string | null;
  /** Y sus datos, cuando quien llama los tiene a mano. Ahorra una consulta allí. */
  registeredBy: { id: string; name: string | null; email: string } | null;
  at: string;
}

/**
 * Avisa a GHL de lo que le acaba de pasar a un alumno.
 *
 * Devuelve `true` si el webhook contestó bien. Nadie está obligado a mirar ese
 * valor: la función no lanza nunca, precisamente para que quien la llama pueda
 * olvidarse de ella.
 */
export async function avisarAGhl(
  evento: EventoGhl,
  alumno: Student,
  agente?: Student | null,
): Promise<boolean> {
  const url = webhook();
  if (!url) return false;

  const payload: Payload = {
    event: evento,
    portalId: alumno.id,
    email: alumno.email,
    name: alumno.name,
    role: alumno.role,
    language: alumno.language,
    active: alumno.active,
    registeredById: alumno.registeredBy ?? agente?.id ?? null,
    registeredBy: agente
      ? { id: agente.id, name: agente.name, email: agente.email }
      : null,
    at: new Date().toISOString(),
  };

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      /* Cinco segundos. Un servidor ajeno que no contesta no puede quedarse con
         la petición del panel. */
      signal: AbortSignal.timeout(5000),
    });

    if (!respuesta.ok) {
      console.error(
        `[ghl] El webhook devolvió ${respuesta.status} para ${alumno.email}`,
      );
      return false;
    }

    console.log(`[ghl] ${evento} enviado para ${alumno.email}`);
    return true;
  } catch (error) {
    /* Se traga el error a propósito: un alta no se cae porque GHL esté caído.
       Queda en el registro para poder repetirlo a mano si hiciera falta. */
    console.error(`[ghl] No se pudo avisar de ${evento} para ${alumno.email}:`, error);
    return false;
  }
}
