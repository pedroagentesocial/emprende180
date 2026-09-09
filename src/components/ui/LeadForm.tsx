import { useId, useRef, useState, type ComponentProps } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  crearLeadSchema,
  formatearErrores,
  HONEYPOT_FIELD,
  TIMESTAMP_FIELD,
  ORDEN_CAMPOS,
  type CampoLead,
  type LeadResponse,
} from "@lib/schema";
import { consentimiento, legalConfig } from "@config/legal.config";
import { copy, curso } from "@config/curso.config";
import type { Txt, Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * Formulario de captura del mini-curso gratuito.
 *
 * Es EL formulario de la página: aparece en varios puntos, pero todos apuntan
 * al mismo imán y al mismo endpoint. Un solo objetivo.
 *
 * Decisiones que están aquí por un motivo concreto:
 *
 *  · Los inputs son de 16 px (`text-base`). Por debajo de 16, iOS hace zoom al
 *    enfocar el campo y descoloca la página entera justo en el momento más
 *    delicado del embudo.
 *  · Al fallar la validación se enfoca el PRIMER campo con error y se anuncia
 *    por `aria-live`. Sin esto, en móvil el error puede quedar fuera de
 *    pantalla y el usuario se queda mirando un botón que "no hace nada".
 *  · Doble envío blindado por partida doble: un ref síncrono (el estado de
 *    React no se actualiza a tiempo entre dos toques rápidos) y el botón
 *    deshabilitado. El servidor además deduplica por email.
 *  · Validación en cliente con el MISMO esquema zod que corre en el servidor:
 *    feedback instantáneo sin ida y vuelta, y cero divergencia entre ambos.
 *  · `noValidate`: se desactiva la validación nativa del navegador para que
 *    los mensajes sean los nuestros, en español y coherentes entre campos.
 */

/* El alias `FormEvent` de @types/react 19 está marcado como obsoleto, así que
   el tipo del evento se deriva de la propia prop `onSubmit` de <form>. */
type EventoEnvio = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

type Origen =
  | "hero"
  | "lead-magnet"
  | "cierre"
  | "modal"
  | "footer"
  | "informes"
  | "guias"
  | "lista";
type Estado = "inactivo" | "enviando" | "exito";

interface LeadFormProps {
  /** Dónde vive este formulario. Se registra para saber qué punto convierte. */
  origen: Origen;
  /** Texto del botón. */
  cta: Txt;
  /** Microcopy bajo el formulario (aviso de privacidad / anti-spam). */
  aviso: Txt;
  /** Estado de éxito. */
  exitoTitulo: Txt;
  exitoTexto: Txt;
  /** Paleta: sobre fondo claro o sobre el navy de marca. */
  tono?: "claro" | "inverso";
  /** Campos en línea en escritorio. Útil en el hero. */
  compacto?: boolean;
  /**
   * Qué formulario es.
   *
   * `minicurso` pide lo mínimo para mandar siete correos: nombre y email.
   * `informes` pide además TELÉFONO y QUIÉN TE RECOMENDÓ, y esconde el
   * cupón: en esa sección el descuento no se escribe como código, se
   * consigue diciendo quién te mandó. Dos campos para lo mismo, uno al lado
   * del otro, solo confunden.
   *
   * Los dos campos nuevos van OPCIONALES. Quien pregunta el precio ya está
   * abajo del embudo: pedirle el teléfono como obligatorio es la forma más
   * rápida de perderlo justo ahí.
   *
   * `lista` es el de las guías y el de la lista: mismos campos que
   * `minicurso`, pero el consentimiento habla de los artículos y no de una
   * secuencia de siete correos que ya no existe.
   *
   * ⚠️ LA VARIANTE NO ES DECORATIVA: DECIDE A QUÉ SE ESTÁ CONSINTIENDO. Un
   * formulario que reparte guías con la casilla del mini-curso pide permiso
   * para una cosa y entrega otra, y ese permiso no vale.
   */
  variante?: "minicurso" | "informes" | "lista";
  /**
   * Deja el formulario en lo mínimo: nombre, correo, casilla y botón.
   *
   * ⚠️ NO CAMBIA A QUÉ SE CONSIENTE. Eso lo sigue decidiendo `variante`: con
   * `informes` la casilla habla del precio aunque el teléfono no esté. Lo que
   * quita son los campos opcionales, y solo son eso, opcionales.
   *
   * Existe para el cierre de la portada, donde el formulario tiene que ser el
   * de la maqueta: dos campos y un botón. Con cuatro campos deja de ser un
   * remate y pasa a ser un trámite, que es justo lo que nadie rellena al final
   * de una página.
   */
  minimo?: boolean;
  /**
   * Esconde los rótulos de los campos y deja el nombre dentro del propio
   * recuadro.
   *
   * ⚠️ ESCONDIDOS DE LA VISTA, NO DEL DOCUMENTO. El `<label>` sigue ahí con
   * `sr-only`: quien usa un lector de pantalla necesita saber qué campo es, y
   * un `placeholder` no cumple ese papel porque desaparece en cuanto se empieza
   * a escribir. Un formulario sin `<label>` es un fallo de accesibilidad, no un
   * estilo minimalista.
   *
   * Y por eso el marcador de posición pasa a ser el rótulo ("Nombre", "Email")
   * y no un ejemplo ("María"): sin rótulo encima, el ejemplo deja de aclarar y
   * empieza a confundir, porque parece un valor ya escrito.
   */
  sinEtiquetas?: boolean;
  /** Idioma resuelto en el servidor (ver src/i18n/react.ts). */
  lang?: Idioma;
}

export function LeadForm({
  origen,
  cta,
  aviso,
  exitoTitulo,
  exitoTexto,
  tono = "claro",
  compacto = false,
  variante = "minicurso",
  minimo = false,
  sinEtiquetas = false,
  lang: langServidor,
}: LeadFormProps) {
  const [estado, setEstado] = useState<Estado>("inactivo");
  const [errores, setErrores] = useState<Partial<Record<CampoLead, string>>>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const reducir = useReducedMotion();
  const baseId = useId();
  // El formulario no puede usar el truco de renderizar los dos idiomas: los
  // placeholders y los aria-label son atributos, no nodos de texto.
  const { lang, t } = useIdioma(langServidor);

  // Guarda síncrona contra el doble toque: `estado` no se ha re-renderizado
  // todavía cuando llega el segundo evento en una pantalla táctil.
  const enVuelo = useRef(false);
  // Instante en que se montó el formulario. Un bot lo rellena en milisegundos.
  const montadoEn = useRef(Date.now());

  const refs = {
    nombre: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    consentimiento: useRef<HTMLInputElement>(null),
  } as const;

  const inverso = tono === "inverso";

  /* A qué se consiente, según el formulario. Ver la nota de `variante`. */
  const textoConsentimiento =
    variante === "informes"
      ? consentimiento.textoAntesInformes
      : variante === "lista"
        ? consentimiento.textoAntesLista
        : consentimiento.textoAntes;

  /** Enfoca el primer campo con error, siguiendo el orden visual. */
  function enfocarPrimerError(errs: Partial<Record<CampoLead, string>>) {
    const primero = ORDEN_CAMPOS.find((c) => errs[c]);
    if (!primero) return;
    const el = refs[primero].current;
    el?.focus();
    // `block: "center"` para que el campo no quede pegado al header sticky.
    el?.scrollIntoView({
      behavior: reducir ? "auto" : "smooth",
      block: "center",
    });
  }

  async function alEnviar(e: EventoEnvio) {
    e.preventDefault();
    if (enVuelo.current) return;

    const form = e.currentTarget;
    const datos = new FormData(form);

    const candidato = {
      nombre: String(datos.get("nombre") ?? ""),
      cupon: String(datos.get("cupon") ?? "").trim() || undefined,
      telefono: String(datos.get("telefono") ?? "").trim() || undefined,
      recomendadoPor:
        String(datos.get("recomendadoPor") ?? "").trim() || undefined,
      email: String(datos.get("email") ?? ""),
      consentimiento: datos.get("consentimiento") === "on",
      origen,
      [HONEYPOT_FIELD]: String(datos.get(HONEYPOT_FIELD) ?? ""),
      [TIMESTAMP_FIELD]: Date.now() - montadoEn.current,
      // Se manda el idioma para que el email de bienvenida salga en el mismo
      // en el que la persona se registró, no en el del servidor.
      idioma: lang,
    };

    // Validación local con el esquema compartido.
    // El esquema se crea con el idioma activo para que los mensajes de
    // validación salgan traducidos, no solo las etiquetas.
    const local = crearLeadSchema(lang).safeParse(candidato);
    if (!local.success) {
      const errs = formatearErrores(local.error);
      setErrores(errs);
      setErrorGeneral(null);
      enfocarPrimerError(errs);
      return;
    }

    enVuelo.current = true;
    setEstado("enviando");
    setErrores({});
    setErrorGeneral(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(local.data),
      });
      const cuerpo: LeadResponse = await res.json();

      if (!res.ok || !cuerpo.ok) {
        if (cuerpo.errores) {
          setErrores(cuerpo.errores);
          enfocarPrimerError(cuerpo.errores);
        } else {
          setErrorGeneral(cuerpo.mensaje ?? t(copy.formulario.errorGenerico));
        }
        setEstado("inactivo");
        return;
      }

      setEstado("exito");
      // Conversión: el evento de GA4 que de verdad importa medir.
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { origen });
      }
    } catch {
      setErrorGeneral(t(copy.formulario.errorRed));
      setEstado("inactivo");
    } finally {
      enVuelo.current = false;
    }
  }

  // ── Estado de éxito ───────────────────────────────────────────────────────
  if (estado === "exito") {
    return (
      <motion.div
        initial={reducir ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reducir ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        role="status"
        aria-live="polite"
        className={[
          "rounded-xl border p-6 text-center",
          inverso
            ? "border-secondary-700 bg-primary-950/60"
            : "border-success-500/30 bg-success-50",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={[
            "mx-auto mb-4 grid size-12 place-items-center rounded-full",
            inverso ? "bg-secondary-500 text-primary-950" : "bg-success-600 text-white",
          ].join(" ")}
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className={["text-xl font-bold", inverso ? "text-ink-inverse" : "text-ink"].join(" ")}>
          {t(exitoTitulo)}
        </p>
        <p
          className={[
            "mx-auto mt-2 max-w-md text-base",
            inverso ? "text-secondary-200" : "text-ink-muted",
          ].join(" ")}
        >
          {t(exitoTexto)}
        </p>
      </motion.div>
    );
  }

  // ── Formulario ────────────────────────────────────────────────────────────
  const enviando = estado === "enviando";

  /* `CampoLead` son los campos que el servidor puede rechazar uno a uno. El
     cupón no es uno de ellos a propósito: no bloquea el envío, así que nunca
     lleva error debajo. Por eso el parámetro admite también su nombre. */
  const claseInput = (campo: CampoLead | "cupon" | "telefono" | "recomendadoPor") =>
    [
      // min-h-11 = 44 px táctil · text-base = 16 px, si no iOS hace zoom
      "min-h-11 w-full rounded-lg border px-4 py-3 text-base",
      "focus-visible:outline-2 focus-visible:outline-offset-2",
      inverso
        ? "border-primary-700 bg-primary-950/50 text-ink-inverse placeholder:text-primary-300 focus-visible:outline-focus-inverse"
        : "border-line-strong bg-surface text-ink placeholder:text-ink-subtle focus-visible:outline-focus",
      campo === "nombre" || campo === "email" || campo === "consentimiento"
        ? errores[campo]
          ? "border-error-500"
          : ""
        : "",
      "disabled:opacity-60",
    ].join(" ");

  const idDe = (campo: string) => `${baseId}-${campo}`;
  const errorIdDe = (campo: string) => `${baseId}-${campo}-error`;

  return (
    <form onSubmit={alEnviar} noValidate className="w-full">
      {/* Trampa para bots. Fuera de pantalla y oculta a lectores de pantalla:
          una persona no lo ve ni con teclado, un bot lo rellena. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-0 overflow-hidden">
        <label htmlFor={idDe(HONEYPOT_FIELD)}>No rellenar este campo</label>
        <input
          id={idDe(HONEYPOT_FIELD)}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className={compacto ? "grid gap-3 sm:grid-cols-2" : "grid gap-4"}>
        {/* Nombre */}
        <div>
          <label
            htmlFor={idDe("nombre")}
            className={[
              sinEtiquetas
                ? "sr-only"
                : "mb-1.5 block text-sm font-medium",
              inverso ? "text-secondary-200" : "text-ink",
            ].join(" ")}
          >
            {t(copy.formulario.nombreEtiqueta)}
          </label>
          <input
            ref={refs.nombre}
            id={idDe("nombre")}
            name="nombre"
            type="text"
            autoComplete="name"
            enterKeyHint="next"
            placeholder={t(
              sinEtiquetas
                ? copy.formulario.nombreCorto
                : copy.formulario.nombrePlaceholder,
            )}
            disabled={enviando}
            aria-invalid={errores.nombre ? true : undefined}
            aria-describedby={errores.nombre ? errorIdDe("nombre") : undefined}
            className={claseInput("nombre")}
          />
          {errores.nombre && (
            <p id={errorIdDe("nombre")} className="mt-1.5 text-sm font-medium text-error-500">
              {errores.nombre}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor={idDe("email")}
            className={[
              sinEtiquetas
                ? "sr-only"
                : "mb-1.5 block text-sm font-medium",
              inverso ? "text-secondary-200" : "text-ink",
            ].join(" ")}
          >
            {t(copy.formulario.emailEtiqueta)}
          </label>
          <input
            ref={refs.email}
            id={idDe("email")}
            name="email"
            type="email"
            // inputMode + autoComplete: teclado con @ y autorrelleno en móvil.
            inputMode="email"
            autoComplete="email"
            enterKeyHint="send"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={t(
              sinEtiquetas
                ? copy.formulario.emailCorto
                : copy.formulario.emailPlaceholder,
            )}
            disabled={enviando}
            aria-invalid={errores.email ? true : undefined}
            aria-describedby={errores.email ? errorIdDe("email") : undefined}
            className={claseInput("email")}
          />
          {errores.email && (
            <p id={errorIdDe("email")} className="mt-1.5 text-sm font-medium text-error-500">
              {errores.email}
            </p>
          )}
        </div>
      </div>

      {/* ─── SOLO EN INFORMES: TELÉFONO Y QUIÉN TE RECOMENDÓ ─────────────────
          El teléfono, porque el precio se da hablando y una llamada resuelve
          en cinco minutos lo que por correo son tres días. Y quién le
          recomendó, porque es LO QUE DECIDE SU PRECIO: es el campo más
          valioso de la página y por eso va a la vista, no plegado.

          Los dos opcionales. Quien llega aquí ya está preguntando cuánto
          cuesta; ponerle un campo obligatorio de más es perderlo en el sitio
          donde más caro sale perderlo. */}
      {variante === "informes" && !minimo && (
        <>
          <div className="mt-4">
            <label
              htmlFor={idDe("telefono")}
              className={[
                "mb-1.5 block text-sm font-medium",
                inverso ? "text-secondary-200" : "text-ink",
              ].join(" ")}
            >
              {t(copy.informes.telefonoEtiqueta)}
            </label>
            <input
              id={idDe("telefono")}
              name="telefono"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              disabled={enviando}
              className={claseInput("telefono")}
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor={idDe("recomendadoPor")}
              className={[
                "mb-1.5 block text-sm font-medium",
                inverso ? "text-secondary-200" : "text-ink",
              ].join(" ")}
            >
              {t(copy.informes.recomendadoEtiqueta)}
            </label>
            <input
              id={idDe("recomendadoPor")}
              name="recomendadoPor"
              type="text"
              autoComplete="off"
              disabled={enviando}
              className={claseInput("recomendadoPor")}
            />
            <p
              className={[
                "mt-1.5 text-xs",
                inverso ? "text-secondary-200/80" : "text-ink-subtle",
              ].join(" ")}
            >
              {t(copy.informes.recomendadoAyuda)}
            </p>
          </div>
        </>
      )}

      {/* ─── EL CÓDIGO DE DESCUENTO ───────────────────────────────────────────
          Plegado dentro de un `<details>`, y eso es la decisión entera: un campo
          de cupón a la vista le dice a quien NO tiene ninguno que está pagando
          de más, y se va a buscarlo a Google en vez de dejar su correo. Quien
          tiene uno lo busca; quien no, ni lo ve.

          `<details>` nativo: se abre y se cierra sin una línea de JavaScript, y
          funciona con teclado y con lector de pantalla sin que haya que
          enseñarle nada.

          El código NO se valida aquí. Lo comprueba el servidor contra la tabla
          de cupones y, si no vale, el lead entra igual: una errata no puede
          costar un contacto. Ver `src/lib/cupones.ts`.

          ⚠️ NO SE PINTA EN LA VARIANTE DE INFORMES. Ahí el descuento se pide
          por el nombre de quien recomienda, no por un código, y tener las dos
          cosas en el mismo formulario obliga a explicar la diferencia entre
          dos campos que hacen lo mismo.

          ⚠️ Y TAMPOCO SE PINTA SIN PRECIO PÚBLICO. Un campo que pide un
          código de descuento a quien no sabe cuánto cuesta el curso no
          descuenta nada: solo le dice que hay un precio que no le enseñan y
          que además otros pagan menos. Vuelve solo el día que
          `curso.precio.publico` vuelva a ser `true`. */}
      {variante === "minicurso" && curso.precio.publico && (
      <details className="mt-4">
        <summary
          className={[
            "inline-flex min-h-11 cursor-pointer list-none items-center text-sm font-medium underline underline-offset-4",
            inverso ? "text-secondary-200" : "text-ink-brand",
          ].join(" ")}
        >
          {t(copy.formulario.cuponEnlace)}
        </summary>

        <div className="mt-2">
          <label
            htmlFor={idDe("cupon")}
            className={[
              "mb-1.5 block text-sm font-medium",
              inverso ? "text-secondary-200" : "text-ink",
            ].join(" ")}
          >
            {t(copy.formulario.cuponEtiqueta)}
          </label>
          <input
            id={idDe("cupon")}
            name="cupon"
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={t(copy.formulario.cuponPlaceholder)}
            disabled={enviando}
            className={claseInput("cupon")}
          />
          <p
            className={[
              "mt-1.5 text-xs",
              inverso ? "text-secondary-200/80" : "text-ink-subtle",
            ].join(" ")}
          >
            {t(copy.formulario.cuponAyuda)}
          </p>
        </div>
      </details>
      )}

      {/* CONSENTIMIENTO DE DATOS.
          Casilla vacía por defecto y obligatoria: bajo RGPD, LGPD, la Ley 1581
          colombiana y la LFPDPPP mexicana el consentimiento tiene que ser una
          acción afirmativa. Premarcarla lo invalida.
          El enlace al aviso de privacidad abre el modal (o navega, si el JS no
          está): sin él, el consentimiento no es informado. */}
      <div className="mt-4">
        <label
          htmlFor={idDe("consentimiento")}
          className={[
            "flex cursor-pointer items-start gap-3 py-1 text-sm",
            inverso ? "text-secondary-200" : "text-ink-muted",
          ].join(" ")}
        >
          <input
            ref={refs.consentimiento}
            id={idDe("consentimiento")}
            name="consentimiento"
            type="checkbox"
            required
            disabled={enviando}
            aria-invalid={errores.consentimiento ? true : undefined}
            aria-describedby={
              errores.consentimiento ? errorIdDe("consentimiento") : undefined
            }
            // La casilla vive dentro de un <label>, así que el área pulsable
            // real es toda la fila y pasa de sobra los 44 px. Aun así sube de
            // 20 a 24 px: la WCAG 2.5.8 mide el objetivo del CONTROL, y hay
            // quien apunta al cuadrito y no al texto. 24 es el mínimo del
            // criterio en nivel AA.
            className={[
              "mt-0.5 size-6 shrink-0 rounded-xs accent-secondary-600",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              inverso ? "focus-visible:outline-focus-inverse" : "focus-visible:outline-focus",
            ].join(" ")}
          />
          <span>
            {t(textoConsentimiento)}
            <a
              href={`/legal/${legalConfig.privacidad.slug}`}
              data-legal={legalConfig.privacidad.slug}
              // El clic en el enlace no debe alternar la casilla.
              onClick={(e) => e.stopPropagation()}
              className={[
                "font-semibold underline underline-offset-2",
                inverso ? "text-ink-inverse hover:text-secondary-300" : "text-ink-brand hover:text-secondary-800",
              ].join(" ")}
            >
              {t(consentimiento.enlaceTexto)}
            </a>
            {t(consentimiento.textoDespues)}
          </span>
        </label>
        {errores.consentimiento && (
          <p
            id={errorIdDe("consentimiento")}
            className="mt-1.5 text-sm font-medium text-error-500"
          >
            {errores.consentimiento}
          </p>
        )}
      </div>

      {/* Error general (red caída, 429, 500). Se anuncia al entrar. */}
      <AnimatePresence>
        {errorGeneral && (
          <motion.p
            role="alert"
            initial={reducir ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reducir ? { duration: 0 } : { duration: 0.2 }}
            className={[
              "mt-4 overflow-hidden rounded-lg px-4 py-3 text-sm font-medium",
              inverso ? "bg-error-700/40 text-error-50" : "bg-error-50 text-error-700",
            ].join(" ")}
          >
            {errorGeneral}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={enviando}
        data-track={`lead-${origen}`}
        className={[
          "mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2",
          "rounded-full px-7 py-4 text-base font-semibold sm:text-lg",
          "bg-cta text-ink-inverse shadow-cta",
          "transition-[background-color,transform,box-shadow] duration-200 ease-out-soft",
          "hover:bg-cta-hover hover:shadow-cta-hover",
          "motion-safe:active:scale-[0.98]",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          inverso ? "focus-visible:outline-focus-inverse" : "focus-visible:outline-focus",
          "disabled:cursor-not-allowed disabled:opacity-70",
        ].join(" ")}
      >
        {enviando ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
            />
            {t(copy.ui.enviando)}
          </>
        ) : (
          t(cta)
        )}
      </button>

      <p
        className={[
          // 13 px en móvil y 12 de `sm` en adelante. Es letra pequeña de
          // verdad —"sin spam, te das de baja en un clic"—, pero es también lo
          // que desactiva el miedo a dejar el correo, y a 12 px en un teléfono
          // no se lee.
          "mt-3 text-center text-[0.8125rem] sm:text-xs",
          inverso ? "text-primary-300" : "text-ink-subtle",
        ].join(" ")}
      >
        {t(aviso)}
      </p>
    </form>
  );
}

export default LeadForm;
