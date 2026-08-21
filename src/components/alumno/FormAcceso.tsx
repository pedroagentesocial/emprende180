import { useState } from "react";
import { copy } from "@config/curso.config";
import type { Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * Formulario de entrada al área de alumnos.
 *
 * ⚠️ UN SOLO CAMPO, Y NINGUNO DE CONTRASEÑA. Ver `src/lib/acceso.ts`: se entra
 * con un enlace que llega al correo. Un campo de contraseña aquí no solo
 * sobraría, sino que pediría una credencial que este sistema no sabe comprobar.
 *
 * ⚠️ EL MENSAJE DE ÉXITO NO CONFIRMA QUE EL CORREO EXISTA. Dice "si ese correo
 * está dado de alta…" y es exactamente lo mismo que responde el servidor exista
 * o no el alumno. Si aquí se dijera "no encontramos ese correo", el formulario
 * sería un comprobador de clientes: cualquiera podría averiguar quién compró.
 *
 * Es una isla de React y no un `<form>` con POST porque el estado de "enviado"
 * tiene que quedarse en pantalla sin recargar: con recarga, el mensaje se
 * perdería o habría que arrastrarlo por la URL.
 */

interface Props {
  lang?: Idioma;
  /** A dónde volver después de entrar. Lo pone el middleware. */
  destino?: string;
}

export function FormAcceso({ lang, destino }: Props) {
  const { t } = useIdioma(lang);
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"listo" | "enviando" | "enviado" | "error">(
    "listo",
  );

  /* El tipo va escrito a mano y no con `FormEvent`: en los tipos de React 19
     está marcado como obsoleto, y lo único que se necesita de ese evento es
     poder cancelarlo. */
  async function alEnviar(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (estado === "enviando") return;

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email.trim())) {
      setEstado("error");
      return;
    }

    setEstado("enviando");
    try {
      const r = await fetch("/api/acceso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), idioma: lang ?? "es", destino }),
      });
      /* Un 429 también se cuenta como "enviado": decir "has pedido demasiados"
         confirmaría que ese correo existe, que es justo lo que no se dice. */
      setEstado(r.ok || r.status === 429 ? "enviado" : "error");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "enviado") {
    return (
      <div className="rounded-2xl border border-secondary-400/40 bg-secondary-500/10 p-6 text-center">
        <p className="text-base text-pretty text-secondary-100">
          {t(copy.acceso.formEnviado)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={alEnviar} noValidate className="text-left">
      <label
        htmlFor="acceso-email"
        className="block text-sm font-semibold text-secondary-200"
      >
        {t(copy.acceso.formEtiqueta)}
      </label>

      <input
        id="acceso-email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail((e.target as HTMLInputElement).value);
          if (estado === "error") setEstado("listo");
        }}
        required
        autoComplete="email"
        inputMode="email"
        autoFocus
        placeholder="maria@email.com"
        aria-invalid={estado === "error" ? true : undefined}
        disabled={estado === "enviando"}
        className={[
          "mt-2 min-h-12 w-full rounded-xl border px-4 py-3 text-base",
          "border-primary-700 bg-primary-950/60 text-ink-inverse placeholder:text-primary-300",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-inverse",
          estado === "error" ? "border-error-500" : "",
          "disabled:opacity-60",
        ].join(" ")}
      />

      {estado === "error" && (
        <p role="alert" className="mt-2 text-sm font-medium text-error-500">
          {t(copy.acceso.formErrorEmail)}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-secondary-500 px-6 text-base font-bold text-primary-950 transition-colors hover:bg-secondary-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-inverse disabled:opacity-60"
      >
        {t(estado === "enviando" ? copy.acceso.formEnviando : copy.acceso.formBoton)}
      </button>
    </form>
  );
}

export default FormAcceso;
