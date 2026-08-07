import { reabrirPreferencias } from "@lib/consent";
import { cookies } from "@config/legal.config";
import { useIdioma } from "@i18n/react";
import type { Idioma } from "@i18n/idioma";

/**
 * Enlace del pie que vuelve a abrir el banner de cookies.
 *
 * No es un detalle opcional: si el consentimiento no se puede retirar con la
 * misma facilidad con que se dio, no es válido. Aquí es un clic, igual que
 * darlo.
 *
 * Es un <button> y no un <a>: no navega a ninguna parte, ejecuta una acción.
 */
export function CookiePreferences({ lang }: { lang?: Idioma }) {
  const { t } = useIdioma(lang);
  return (
    <button
      type="button"
      onClick={reabrirPreferencias}
      className="inline-flex min-h-11 items-center hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {t(cookies.cambiarPreferencias)}
    </button>
  );
}

export default CookiePreferences;
