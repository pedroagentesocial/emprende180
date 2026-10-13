import { useId, useState } from "react";
import { consentimiento, legalConfig } from "@config/legal.config";
import { copy } from "@config/curso.config";
import type { Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EL ALTA EN LA PLATAFORMA — /subscribe
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * No es un `LeadForm` con más campos y no debería acabar siéndolo. Un lead va a
 * GoHighLevel para que alguien llame; esto CREA UNA CUENTA y abre sesión. Por
 * eso vive aparte: mezclar los dos haría que un cambio pensado para la landing
 * diera de alta a gente sin querer.
 *
 * ─── LO QUE SE PREGUNTA, Y LO QUE NO ───────────────────────────────────────
 *
 * Nombre, apellido, correo, teléfono y cómo nos encontró. El apellido va
 * aparte porque partirlo después falla con los apellidos compuestos, y la
 * casilla de WhatsApp evita adivinar en cada contacto si ese número es de SMS
 * o de WhatsApp.
 *
 * ⚠️ HUBO CIUDAD Y ESTADO Y DURARON UNA TARDE. Se propusieron por la zona
 * horaria de la llamada de equipo y el cliente los quitó el mismo día: "están
 * de más". Se fueron del formulario, de la ruta y de la base. Si vuelven a
 * hacer falta, que vuelvan con un uso concreto detrás, no por si acaso.
 *
 * ⚠️ NO SE PIDE CONTRASEÑA, Y ES UNA DECISIÓN. La plataforma ya entra por
 * enlace mágico (`api/magic-link`), que es lo que lleva meses funcionando. Una
 * contraseña aquí serían dos campos más, el soporte de los olvidos y una razón
 * de abandono en un formulario al que se llega escaneando un papel.
 *
 * ⚠️ NO SE PIDE NADA QUE NO USE NADIE. Fecha de nacimiento, dirección postal o
 * "¿por qué quieres emprender?" se propusieron y se descartaron: ninguna
 * pantalla de la plataforma las lee, y cada campo de más baja la conversión.
 *
 * ─── EL CÓDIGO DE EMBAJADOR ────────────────────────────────────────────────
 *
 * Aparece sólo si eligen "me lo recomendó alguien", y puede venir ya puesto en
 * la URL (`/subscribe?ref=MARCO7`), que es lo que permite que cada Embajador
 * imprima su propio QR. Si viene en la URL, el canal se marca solo.
 *
 * ⚠️ UN CÓDIGO QUE NO EXISTE NO BLOQUEA EL ALTA. Se guarda tal y como lo
 * escribieron y la cuenta se crea igual. Lo contrario sería dejar fuera a
 * alguien que quiere entrar porque se equivocó al teclear el código de su
 * amigo. Quien mire la ficha verá qué escribió; ver `api/registro.ts`.
 */

type Origen =
  | "revista"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "referido"
  | "otro";

const ORIGENES: { valor: Origen; es: string; en: string }[] = [
  { valor: "revista", es: "Una revista", en: "A magazine" },
  { valor: "facebook", es: "Facebook", en: "Facebook" },
  { valor: "instagram", es: "Instagram", en: "Instagram" },
  { valor: "tiktok", es: "TikTok", en: "TikTok" },
  { valor: "youtube", es: "YouTube", en: "YouTube" },
  { valor: "referido", es: "Me lo recomendó alguien", en: "Someone recommended it" },
  { valor: "otro", es: "De otra forma", en: "Some other way" },
];

type Campo =
  | "nombre"
  | "apellido"
  | "email"
  | "telefono"
  | "origen"
  | "consentimiento";

const CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export function RegistroForm({
  lang: inicial,
  refInicial = "",
}: {
  lang?: Idioma;
  refInicial?: string;
}) {
  const { lang, t } = useIdioma(inicial);
  const baseId = useId();
  const id = (c: string) => `${baseId}-${c}`;
  const r = copy.registro;

  /* Si el QR trae el código, el canal ya está respondido: quien escanea el
     papel de un Embajador no tiene que decir además que se lo recomendó. */
  const [origen, setOrigen] = useState<Origen | "">(refInicial ? "referido" : "");
  const [codigo, setCodigo] = useState(refInicial);
  const [whatsapp, setWhatsapp] = useState(false);
  const [consentido, setConsentido] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [errores, setErrores] = useState<Partial<Record<Campo, boolean>>>({});
  const [estado, setEstado] = useState<"inactivo" | "enviando" | "listo">("inactivo");
  const [fallo, setFallo] = useState("");

  const esp = (es: string, en: string) => (lang === "en" ? en : es);

  const claseInput = (c: Campo | "codigo") =>
    [
      "min-h-11 w-full rounded-lg border px-4 py-3 text-base",
      "bg-surface text-ink placeholder:text-ink-subtle",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
      errores[c as Campo] ? "border-error-500" : "border-line",
    ].join(" ");

  const etiqueta = "mb-1.5 block text-sm font-semibold text-ink";

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFallo("");

    const datos = new FormData(e.currentTarget);
    const v = (k: string) => String(datos.get(k) ?? "").trim();

    const cuerpo = {
      nombre: v("nombre"),
      apellido: v("apellido"),
      email: v("email").toLowerCase(),
      telefono: v("telefono"),
      whatsapp,
      origen,
      codigo: origen === "referido" ? codigo.trim() : "",
      consentimiento: consentido,
      idioma: lang,
      empresa: v("empresa"),
    };

    const malo: Partial<Record<Campo, boolean>> = {
      nombre: !cuerpo.nombre,
      apellido: !cuerpo.apellido,
      email: !CORREO.test(cuerpo.email),
      telefono: cuerpo.telefono.replace(/\D/g, "").length < 7,
      origen: !origen,
      consentimiento: !consentido,
    };
    setErrores(malo);
    if (Object.values(malo).some(Boolean)) return;

    setEstado("enviando");
    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      const datosRes = await res.json().catch(() => ({}));
      if (!res.ok || !datosRes.ok) {
        setEstado("inactivo");
        setFallo(
          res.status === 429
            ? esp(
                "Demasiados intentos. Espera unos minutos y vuelve a probar.",
                "Too many attempts. Wait a few minutes and try again.",
              )
            : esp(
                "No pudimos crear tu cuenta. Inténtalo otra vez en un momento.",
                "We couldn't create your account. Try again in a moment.",
              ),
        );
        return;
      }
      /* Si se abrió sesión, dentro. Si no (una cuenta dada de baja que vuelve),
         se queda la pantalla de "mira tu correo", que es la salida honesta. */
      if (datosRes.entra) {
        window.location.assign("/student");
        return;
      }
      setEstado("listo");
    } catch {
      setEstado("inactivo");
      setFallo(
        esp(
          "No hay conexión. Revísala y vuelve a intentarlo.",
          "No connection. Check it and try again.",
        ),
      );
    }
  }

  if (estado === "listo") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-7 text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-ink">
          {t(r.exitoTitulo)}
        </h2>
        <p className="mt-2 text-ink-muted">{t(r.exitoTexto)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="w-full">
      {/* Trampa para bots: fuera de pantalla y oculta a lectores de pantalla. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-0 overflow-hidden">
        <label htmlFor={id("empresa")}>No rellenar este campo</label>
        <input id={id("empresa")} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id("nombre")} className={etiqueta}>
            {esp("Nombre", "First name")}
          </label>
          <input
            id={id("nombre")}
            name="nombre"
            type="text"
            autoComplete="given-name"
            aria-invalid={errores.nombre || undefined}
            className={claseInput("nombre")}
          />
        </div>
        <div>
          <label htmlFor={id("apellido")} className={etiqueta}>
            {esp("Apellido", "Last name")}
          </label>
          <input
            id={id("apellido")}
            name="apellido"
            type="text"
            autoComplete="family-name"
            aria-invalid={errores.apellido || undefined}
            className={claseInput("apellido")}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor={id("email")} className={etiqueta}>
          {esp("Correo electrónico", "Email address")}
        </label>
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={errores.email || undefined}
          className={claseInput("email")}
        />
        <p className="mt-1.5 text-sm text-ink-subtle">
          {esp(
            "Aquí te mandamos tu acceso a la plataforma.",
            "This is where we send your access to the platform.",
          )}
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor={id("telefono")} className={etiqueta}>
          {esp("Teléfono", "Phone")}
        </label>
        <input
          id={id("telefono")}
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          aria-invalid={errores.telefono || undefined}
          className={claseInput("telefono")}
        />
        {/* Una casilla ahorra adivinar en cada contacto si ese número es de
            SMS o de WhatsApp, que con público hispano en EE. UU. va mitad y
            mitad. */}
        <label className="mt-2.5 flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={whatsapp}
            onChange={(e) => setWhatsapp(e.target.checked)}
            className="size-5 shrink-0 rounded-xs accent-secondary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
          {esp("Este número recibe WhatsApp", "This number is on WhatsApp")}
        </label>
      </div>

      <div className="mt-4">
        <label htmlFor={id("origen")} className={etiqueta}>
          {esp("¿Cómo nos encontraste?", "How did you find us?")}
        </label>
        <select
          id={id("origen")}
          name="origen"
          value={origen}
          onChange={(e) => setOrigen(e.target.value as Origen)}
          aria-invalid={errores.origen || undefined}
          className={claseInput("origen")}
        >
          <option value="">{esp("Elige una opción", "Pick one")}</option>
          {ORIGENES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {esp(o.es, o.en)}
            </option>
          ))}
        </select>

        {/* El campo del código sólo aparece si hace falta: un campo escondido
            hasta que es pertinente no cuenta como un campo más. */}
        {origen === "referido" && (
          <div className="mt-3">
            <label htmlFor={id("codigo")} className={etiqueta}>
              {esp("Código de quien te recomendó", "Your referrer's code")}{" "}
              <span className="font-normal text-ink-subtle">
                {esp("(opcional)", "(optional)")}
              </span>
            </label>
            <input
              id={id("codigo")}
              name="codigo"
              type="text"
              autoCapitalize="characters"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className={`${claseInput("codigo")} uppercase`}
            />
            <p className="mt-1.5 text-sm text-ink-subtle">
              {esp(
                "Si no lo tienes, déjalo vacío y entra igual.",
                "If you don't have it, leave it empty and sign up anyway.",
              )}
            </p>
          </div>
        )}
      </div>

      {/* ⚠️ EL CONSENTIMIENTO ES EL MISMO TEXTO QUE EN TODOS LOS FORMULARIOS,
          leído de `legal.config`. Plegado a dos renglones y entero al
          desplegar: nada de resumen. Ver la nota en `LeadForm`. */}
      <label
        htmlFor={id("consentimiento")}
        className="mt-6 flex cursor-pointer items-start gap-3 text-left text-[0.8125rem] leading-snug text-ink-muted"
      >
        <input
          id={id("consentimiento")}
          name="consentimiento"
          type="checkbox"
          checked={consentido}
          onChange={(e) => setConsentido(e.target.checked)}
          aria-invalid={errores.consentimiento || undefined}
          className="mt-0.5 size-6 shrink-0 rounded-xs accent-secondary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        />
        <span className="min-w-0 flex-1">
          <span id={id("condiciones")} className={abierto ? "line-clamp-none" : "line-clamp-2"}>
            {t(consentimiento.texto)}
            <a
              href={`/legal/${legalConfig.privacidad.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-ink-brand underline underline-offset-2"
            >
              {t(consentimiento.enlacePrivacidad)}
            </a>
            {t(consentimiento.conector)}
            <a
              href={`/legal/${legalConfig.terminos.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-ink-brand underline underline-offset-2"
            >
              {t(consentimiento.enlaceTerminos)}
            </a>
            {t(consentimiento.textoDespues)}
          </span>
          <button
            type="button"
            aria-expanded={abierto}
            aria-controls={id("condiciones")}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAbierto((v) => !v);
            }}
            className="mt-1 block cursor-pointer text-[0.8125rem] font-semibold text-ink-brand underline underline-offset-2"
          >
            {t(abierto ? consentimiento.verMenos : consentimiento.verMas)}
          </button>
        </span>
      </label>

      {fallo && (
        <p role="alert" className="mt-4 text-sm font-medium text-error-500">
          {fallo}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando" || !consentido}
        className="mt-6 min-h-12 w-full rounded-full bg-cta px-6 py-3 text-base font-bold text-ink-inverse transition-colors hover:bg-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-45"
      >
        {estado === "enviando" ? esp("Creando tu cuenta…", "Creating your account…") : t(r.cta)}
      </button>

      <p className="mt-3 text-center text-sm text-ink-subtle">
        {esp("¿Ya tienes cuenta? ", "Already have an account? ")}
        <a href="/login" className="font-semibold text-ink-brand underline underline-offset-2">
          {esp("Entra aquí", "Sign in")}
        </a>
      </p>
    </form>
  );
}

export default RegistroForm;
