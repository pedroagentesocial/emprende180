import { useEffect, useRef, useState } from "react";
import { studentCopy } from "@config/studentArea";
import type { Idioma } from "@i18n/idioma";
import { useIdioma } from "@i18n/react";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTRAR — correo y código de seis dígitos
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Dos pasos en la misma pantalla: escribes tu correo, te llega un código, lo
 * tecleas y entras.
 *
 * ─── SE FUE LA CONTRASEÑA (13-10-2026) ─────────────────────────────────────
 *
 * Lo pidió el cliente: "todo será con enlace mágico". Antes esta pantalla
 * tenía dos modos —contraseña y recuperar— con su enlace de "¿la has
 * olvidado?" entre medias. Hoy hay un solo camino, y eso se nota en todo:
 * no hay nada que olvidar, nada que recuperar y nada que robar de una base de
 * datos, porque ya no hay contraseñas que guardar.
 *
 * ⚠️ `clave_hash` SIGUE EN LA BASE y `signInWithPassword` sigue en `auth.ts`.
 * No se borran: hay cuentas que ya tienen contraseña puesta y `/login/password`
 * todavía existe. Lo que se quitó es la puerta, no la cerradura.
 *
 * ─── POR QUÉ UN CÓDIGO Y NO UN ENLACE ──────────────────────────────────────
 *
 * Un enlace se abre donde se abre el correo. Con público que lee el correo en
 * el móvil, el enlace abre el navegador DENTRO de Gmail, que es otro navegador
 * sin la sesión ni el historial. Un código se teclea donde ya estabas.
 *
 * Lo que sostiene un número de seis cifras está en `entrarConCodigo`
 * (`@lib/auth`): cinco intentos contados en la base, diez minutos de vida y el
 * límite por IP de la ruta.
 *
 * ⚠️ SIN JAVASCRIPT ESTO SIGUE SIENDO UN `<form method="POST">` que llega a
 * `/login`, y el servidor manda el enlace mágico de siempre. No es el camino
 * principal, pero es la diferencia entre que alguien entre o se quede fuera.
 */

type Paso = "correo" | "codigo";

const LARGO = 6;

export function LoginForm({
  lang: inicial,
  next = "",
  action = "/login",
  captchaSiteKey = null,
  children = null,
}: {
  lang?: Idioma;
  next?: string;
  /** Sin uso desde que se fue la contraseña; se acepta para no romper la página. */
  initialMode?: string;
  action?: string;
  captchaSiteKey?: string | null;
  /**
   * Lo que la página mete dentro: hoy, el botón de Google.
   *
   * ⚠️ VIENE COMO HIJO Y NO AL LADO A PROPÓSITO. Puesto en la página, debajo
   * del island, salía también en el paso del código: ahí no pinta nada, porque
   * quien ya pidió el código está tecleándolo. Pasándolo como hijo, el island
   * decide en qué paso se ve.
   */
  children?: React.ReactNode;
}) {
  const { lang, t } = useIdioma(inicial);
  const c = studentCopy.codigo;

  const [paso, setPaso] = useState<Paso>("correo");
  const [email, setEmail] = useState("");
  const [digitos, setDigitos] = useState<string[]>(Array(LARGO).fill(""));
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  const [reenviado, setReenviado] = useState(false);

  const casillas = useRef<(HTMLInputElement | null)[]>([]);
  const CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

  /* Al llegar al paso del código, el foco va a la primera casilla: si no, hay
     que buscarla con el dedo justo después de haber escrito el correo. */
  useEffect(() => {
    if (paso === "codigo") casillas.current[0]?.focus();
  }, [paso]);

  async function pedir(e?: { preventDefault: () => void }) {
    e?.preventDefault();
    setError("");
    if (!CORREO.test(email.trim())) {
      setError(t(studentCopy.errorEmail));
      return;
    }
    setOcupado(true);
    try {
      const res = await fetch("/api/codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "pedir", email: email.trim(), idioma: lang }),
      });
      const datos = await res.json().catch(() => ({}));
      if (!res.ok || !datos.ok) {
        setError(t(res.status === 429 ? studentCopy.errorLimit : studentCopy.errorGeneral));
        return;
      }
      /* Solo llega en desarrollo: ver `api/codigo.ts`. Ahorra abrir el correo
         en cada prueba. */
      if (datos.devCodigo) console.info("[login] Código de desarrollo:", datos.devCodigo);
      setDigitos(Array(LARGO).fill(""));
      setPaso("codigo");
    } catch {
      setError(t(studentCopy.errorGeneral));
    } finally {
      setOcupado(false);
    }
  }

  async function verificar(codigo: string) {
    setError("");
    setOcupado(true);
    try {
      const res = await fetch("/api/codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "verificar",
          email: email.trim(),
          codigo,
          ...(next ? { next } : {}),
        }),
      });
      const datos = await res.json().catch(() => ({}));
      if (!res.ok || !datos.ok) {
        setError(t(res.status === 429 ? studentCopy.errorLimit : c.error));
        setDigitos(Array(LARGO).fill(""));
        casillas.current[0]?.focus();
        return;
      }
      window.location.assign(datos.destino || "/student");
    } catch {
      setError(t(studentCopy.errorGeneral));
    } finally {
      setOcupado(false);
    }
  }

  /** Escribe un dígito y salta a la siguiente casilla. */
  function escribir(i: number, valor: string) {
    const limpio = valor.replace(/\D/g, "");
    if (!limpio) return;
    const siguiente = [...digitos];
    /* Si pegan el código entero en una casilla, se reparte por todas. Es lo
       que hace la gente cuando copia el código del correo. */
    for (let k = 0; k < limpio.length && i + k < LARGO; k++) {
      siguiente[i + k] = limpio[k]!;
    }
    setDigitos(siguiente);
    const destino = Math.min(i + limpio.length, LARGO - 1);
    casillas.current[destino]?.focus();
    const completo = siguiente.join("");
    if (completo.length === LARGO && !siguiente.includes("")) verificar(completo);
  }

  function teclear(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const siguiente = [...digitos];
      if (siguiente[i]) siguiente[i] = "";
      else if (i > 0) {
        siguiente[i - 1] = "";
        casillas.current[i - 1]?.focus();
      }
      setDigitos(siguiente);
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) casillas.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < LARGO - 1) casillas.current[i + 1]?.focus();
  }

  const campo =
    "min-h-12 w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus-visible:border-secondary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";
  const boton =
    "mt-5 min-h-12 w-full rounded-full bg-cta px-6 py-3 text-base font-bold text-ink-inverse transition-colors hover:bg-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-45";
  const enlace =
    "font-bold text-ink-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

  /* ─── PASO 2 · EL CÓDIGO ─────────────────────────────────────────────── */
  if (paso === "codigo") {
    return (
      <div className="text-left">
        <h1 className="ap text-3xl font-extrabold tracking-tight text-ink sm:text-4xl" style={{ "--d": 0 } as React.CSSProperties}>
          {t(c.titulo)}
        </h1>
        <p className="ap mt-2 text-sm text-pretty text-ink-muted" style={{ "--d": 90 } as React.CSSProperties}>
          {t(c.texto)}{" "}
          <span className="font-semibold text-ink">{email.trim()}</span>{" "}
          {/* El lápiz de la referencia: vuelve al paso anterior con el correo
              puesto, para quien se equivocó de letra y no quiere repetirlo. */}
          <button
            type="button"
            onClick={() => {
              setPaso("correo");
              setError("");
              setReenviado(false);
            }}
            className={enlace}
          >
            {t(c.cambiar)}
          </button>
        </p>

        {/* ⚠️ `min-w-0` EN EL FIELDSET NO ES DECORATIVO. Un <fieldset> trae de
            fábrica `min-inline-size: min-content`, así que no encoge por debajo
            de lo que midan sus hijos: las seis casillas se salían del panel y
            metían barra horizontal en toda la página. */}
        <fieldset className="ap-der mt-6 min-w-0 border-0 p-0" style={{ "--d": 180 } as React.CSSProperties}>
          <legend className="sr-only">{t(c.etiqueta)}</legend>
          <div className="flex gap-2 sm:gap-2.5">
            {digitos.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  casillas.current[i] = el;
                }}
                value={d}
                onChange={(e) => escribir(i, e.target.value)}
                onKeyDown={(e) => teclear(i, e)}
                onFocus={(e) => e.target.select()}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={LARGO}
                aria-label={`${t(c.etiqueta)} ${i + 1}`}
                disabled={ocupado}
                className="h-14 min-w-0 flex-1 rounded-xl border border-line bg-surface text-center text-xl font-bold text-ink tabular-nums focus-visible:border-secondary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-60"
              />
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-error-500">
            {error}
          </p>
        )}
        {ocupado && (
          <p role="status" className="mt-3 text-sm text-ink-muted">
            {t(c.entrando)}
          </p>
        )}

        <p className="ap-aba mt-6 text-sm text-ink-subtle" style={{ "--d": 300 } as React.CSSProperties}>
          {t(c.noLlego)}{" "}
          <button
            type="button"
            disabled={ocupado}
            onClick={async () => {
              setReenviado(false);
              await pedir();
              setReenviado(true);
            }}
            className={enlace}
          >
            {t(c.reenviar)}
          </button>
          {reenviado && <span className="ml-2 text-ink-muted">{t(c.reenviado)}</span>}
        </p>
      </div>
    );
  }

  /* ─── PASO 1 · EL CORREO ─────────────────────────────────────────────── */
  return (
    /* ⚠️ `method="POST"` y `action` NO son decorativos aunque este componente
       intercepte el envío. Mientras la isla no ha hidratado, el navegador hace
       lo que diga el marcado: sin ellos haría un GET y el correo acabaría en la
       URL. El servidor atiende este POST en `src/pages/login.astro`. */
    <form method="POST" action={action} onSubmit={pedir} noValidate className="text-left">
      {next && <input type="hidden" name="next" value={next} />}

      {/* La cascada del paso del correo: titular, frase, etiqueta, campo y
          botón, en ese orden. El campo llega desde la derecha y el botón desde
          abajo, que es lo que pidió el cliente. */}
      <h1 className="ap text-3xl font-extrabold tracking-tight text-ink sm:text-4xl" style={{ "--d": 0 } as React.CSSProperties}>
        {t(studentCopy.cardTitle)}
      </h1>
      <p className="ap mt-1.5 text-sm text-pretty text-ink-muted" style={{ "--d": 90 } as React.CSSProperties}>
        {t(studentCopy.cardText)}
      </p>

      <label htmlFor="login-email" className="ap mt-6 mb-2 block text-sm font-semibold text-ink" style={{ "--d": 180 } as React.CSSProperties}>
        {t(studentCopy.emailLabel)}
      </label>
      {/* Sin icono dentro del campo: lo quitó el cliente el 13-10-2026. Un
          sobre dibujado al lado de una etiqueta que ya dice "Correo" no añade
          nada y roba sitio al texto en un móvil. */}
      <input
        id="login-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="example@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={error ? true : undefined}
        style={{ "--d": 250 } as React.CSSProperties}
        className={`ap-der ${campo}`}
      />

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-error-500">
          {error}
        </p>
      )}

      {/* El captcha, si está encendido. Se queda donde estaba: es del paso que
          manda el correo, no del que canjea el código. */}
      {captchaSiteKey && (
        <div className="mt-4" data-captcha-sitekey={captchaSiteKey} />
      )}

      <button type="submit" disabled={ocupado} style={{ "--d": 340 } as React.CSSProperties} className={`ap-aba ${boton}`}>
        {t(ocupado ? c.enviando : c.continuar)}
      </button>

      {children}
    </form>
  );
}

export default LoginForm;
