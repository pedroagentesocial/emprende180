import { useState } from "react";
import { copy } from "@config/curso.config";
import type { Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTRAR — correo y contraseña, con recuperación
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Dos modos en un solo componente, no dos páginas:
 *
 *   · ENTRAR    — correo + contraseña. Lo normal.
 *   · RECUPERAR — solo el correo; se manda un enlace para poner otra.
 *
 * Van juntos porque quien pulsa "he olvidado mi contraseña" ya ha escrito su
 * correo: cambiando de modo se conserva, y no tiene que volver a teclearlo. Una
 * página aparte lo obligaría, que es exactamente la fricción que sobra en el
 * momento en que alguien ya está frustrado.
 *
 * ⚠️ EL MENSAJE DE ERROR AL ENTRAR ES UNO SOLO —"correo o contraseña
 * incorrectos"— para los tres fallos posibles. Ver `/api/entrar`.
 *
 * ⚠️ Y EL DE RECUPERAR NO CONFIRMA QUE EL CORREO EXISTA. Dice "si ese correo
 * está dado de alta…", que es lo mismo que responde el servidor en los dos
 * casos. Si dijera "no encontramos ese correo", sería un comprobador de
 * clientes: cualquiera podría averiguar quién compró el curso.
 */

interface Props {
  lang?: Idioma;
  /** A dónde volver después de entrar. Lo pone el middleware. */
  destino?: string;
}

type Modo = "entrar" | "recuperar";
type Estado = "listo" | "trabajando" | "enviado";

const ES_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export function FormAcceso({ lang, destino }: Props) {
  const { t } = useIdioma(lang);
  const [modo, setModo] = useState<Modo>("entrar");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [estado, setEstado] = useState<Estado>("listo");
  const [error, setError] = useState<string | null>(null);

  const campo = [
    "mt-2 min-h-12 w-full rounded-xl border px-4 py-3 text-base",
    "border-line-strong bg-surface text-ink placeholder:text-ink-subtle",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
    "disabled:opacity-60",
  ].join(" ");

  const etiqueta = "block text-sm font-semibold text-ink";

  async function alEnviar(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (estado === "trabajando") return;

    if (!ES_EMAIL.test(email.trim())) {
      setError(t(copy.acceso.formErrorEmail));
      return;
    }

    setError(null);
    setEstado("trabajando");

    try {
      if (modo === "recuperar") {
        const r = await fetch("/api/acceso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), idioma: lang ?? "es", destino }),
        });
        /* Un 429 también se cuenta como enviado: decir "has pedido demasiados"
           confirmaría que ese correo existe. */
        if (r.ok || r.status === 429) {
          setEstado("enviado");
          return;
        }
        setError(t(copy.acceso.formErrorGeneral));
        setEstado("listo");
        return;
      }

      const r = await fetch("/api/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), clave, destino }),
      });
      const datos = await r.json().catch(() => ({}));

      if (r.ok && datos.ok) {
        /* `location.assign` y no `router.push`: la sesión acaba de llegar en una
           cookie y la página de destino se renderiza en el servidor. Hace falta
           una navegación de verdad para que el servidor la vea. */
        window.location.assign(datos.destino ?? "/alumno");
        return;
      }

      setError(
        t(
          r.status === 429
            ? copy.acceso.formErrorLimite
            : copy.acceso.formErrorCredenciales,
        ),
      );
      setEstado("listo");
    } catch {
      setError(t(copy.acceso.formErrorGeneral));
      setEstado("listo");
    }
  }

  if (estado === "enviado") {
    return (
      <div className="rounded-2xl border border-secondary-300 bg-secondary-50 p-6 text-center">
        <p className="text-base text-pretty text-ink">{t(copy.acceso.formEnviado)}</p>
      </div>
    );
  }

  const recuperando = modo === "recuperar";

  return (
    <form onSubmit={alEnviar} noValidate className="text-left">
      {recuperando && (
        <p className="mb-5 text-sm text-pretty text-ink-muted">
          {t(copy.acceso.olvideTexto)}
        </p>
      )}

      <label htmlFor="acceso-email" className={etiqueta}>
        {t(copy.acceso.formEtiqueta)}
      </label>
      <input
        id="acceso-email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail((e.target as HTMLInputElement).value);
          setError(null);
        }}
        required
        autoComplete="email"
        inputMode="email"
        placeholder="maria@email.com"
        disabled={estado === "trabajando"}
        className={campo}
      />

      {!recuperando && (
        <div className="mt-4">
          <label htmlFor="acceso-clave" className={etiqueta}>
            {t(copy.acceso.formClave)}
          </label>
          <input
            id="acceso-clave"
            type="password"
            name="clave"
            value={clave}
            onChange={(e) => {
              setClave((e.target as HTMLInputElement).value);
              setError(null);
            }}
            required
            /* `current-password` para que el gestor de contraseñas ofrezca la
               guardada en vez de proponer una nueva. */
            autoComplete="current-password"
            disabled={estado === "trabajando"}
            className={campo}
          />
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-error-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "trabajando"}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary-700 px-6 text-base font-bold text-ink-inverse transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
      >
        {t(
          estado === "trabajando"
            ? recuperando
              ? copy.acceso.formEnviando
              : copy.acceso.formEntrando
            : recuperando
              ? copy.acceso.formBoton
              : copy.acceso.formEntrar,
        )}
      </button>

      {/* El cambio de modo es un <button> y no un enlace: no navega a ningún
          sitio, solo cambia lo que se ve. Un enlace que no lleva a una URL
          miente al teclado y al lector de pantalla. */}
      <button
        type="button"
        onClick={() => {
          setModo(recuperando ? "entrar" : "recuperar");
          setError(null);
        }}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-semibold text-ink-brand underline underline-offset-4 hover:text-secondary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {t(recuperando ? copy.acceso.volverAEntrar : copy.acceso.olvide)}
      </button>
    </form>
  );
}

export default FormAcceso;
