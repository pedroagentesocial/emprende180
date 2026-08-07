import { useCallback, useEffect, useRef, useState } from "react";
import { documentos } from "@config/legal.config";
import { copy } from "@config/curso.config";
import { useIdioma } from "@i18n/react";
import type { Txt, Idioma } from "@i18n/idioma";

/**
 * Modal de documentos legales — mejora progresiva sobre enlaces reales.
 *
 * CÓMO FUNCIONA
 * Se monta UNA vez por página y escucha los clics en cualquier enlace con
 * `data-legal`. Intercepta, pide el fragmento a `/legal/parcial/<slug>` y lo
 * muestra. Si algo falla —red caída, 500, JS no cargado— no pasa nada: el
 * enlace sigue siendo un `<a href="/legal/privacidad">` normal y el navegador
 * navega. El contenido legal nunca queda inaccesible.
 *
 * No intercepta si el usuario abre en pestaña nueva (Ctrl/Cmd/click central) ni
 * si hay modificadores: ahí quiere la página entera, no un modal.
 *
 * ACCESIBILIDAD — sobre <dialog> nativo con showModal(), que da gratis y bien
 * hecho lo que a mano sale mal:
 *   · Trampa de foco real: el resto del documento queda inerte de verdad, no
 *     "simulado" con un bucle de tabindex que siempre se escapa por algún lado.
 *   · Esc cierra, sin listener propio.
 *   · Capa superior del navegador: cero peleas de z-index.
 * Encima se añade: bloqueo del scroll del body (iOS no lo hace solo),
 * devolución del foco al enlace que lo abrió, y `aria-busy` mientras carga.
 */

interface DocCargado {
  slug: string;
  titulo: Txt;
  html: string;
}

/* Los títulos salen de los propios documentos: duplicarlos aquí garantizaba
   que un día el modal dijera una cosa y la página otra. */
const TITULOS: Record<string, Txt> = Object.fromEntries(
  documentos.map((d) => [d.slug, d.titulo]),
);

export function LegalModal({ lang: langServidor }: { lang?: Idioma }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contenidoRef = useRef<HTMLDivElement>(null);
  /** Enlace que abrió el modal: hay que devolverle el foco al cerrar. */
  const origenRef = useRef<HTMLElement | null>(null);
  /** Caché en memoria: reabrir el mismo documento no vuelve a pedirlo. */
  /* La caché es POR IDIOMA: el fragmento que devuelve el servidor ya viene
     con los dos idiomas dentro, pero se pide con `?lang` para que el aviso de
     "borrador sin revisar" salga en el idioma correcto. */
  const cacheRef = useRef<Map<string, string>>(new Map());

  const { t, lang } = useIdioma(langServidor);
  const [doc, setDoc] = useState<DocCargado | null>(null);
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const cerrar = useCallback(() => {
    setAbierto(false);
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, []);

  // Abrir/cerrar el <dialog>.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (abierto && !dialog.open) dialog.showModal();
    if (!abierto && dialog.open) dialog.close();
  }, [abierto]);

  /**
   * Bloqueo del scroll de fondo, en su propio efecto.
   *
   * Estaba dentro del `if` del efecto anterior, de modo que la función de
   * limpieza solo se registraba en la rama de apertura. Aquí el `return` es
   * incondicional: el desbloqueo se ejecuta SIEMPRE que `abierto` pase a false
   * o el componente se desmonte. Dejar el <body> en `position: fixed` deja la
   * página entera sin scroll, así que esto no puede depender de que se cumpla
   * una condición.
   *
   * iOS necesita el truco de `position: fixed` + `top` negativo: <dialog> por
   * sí solo no congela el fondo en Safari móvil.
   */
  useEffect(() => {
    if (!abierto) return;
    const y = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${y}px`;
    style.width = "100%";
    return () => {
      style.position = "";
      style.top = "";
      style.width = "";
      // Instantáneo: `html` tiene scroll suave y aquí no queremos una
      // animación de vuelta, queremos estar donde estábamos.
      window.scrollTo({ top: y, behavior: "instant" });
    };
  }, [abierto]);

  /**
   * Cierre nativo: Esc y el botón "atrás" cierran el <dialog> sin pasar por
   * `cerrar()`, así que sin esto el estado de React se quedaría en `abierto`
   * y el <body> bloqueado para siempre.
   *
   * Se escuchan `close` Y `cancel`: `cancel` es el que dispara Esc y llega
   * antes, y en algunos motores `close` no se propaga como se espera. Con los
   * dos, la sincronización no depende de un único evento.
   */
  const sincronizarCierre = useCallback(() => {
    setAbierto(false);
    origenRef.current?.focus();
    origenRef.current = null;
  }, []);

  // Intercepta los enlaces legales de toda la página.
  useEffect(() => {
    const alHacerClic = async (e: MouseEvent) => {
      // Clic con modificador, o botón que no sea el principal → dejar pasar.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const destino = e.target as Element | null;
      const enlace = destino?.closest<HTMLAnchorElement>("a[data-legal]");
      if (!enlace) return;

      const slug = enlace.dataset.legal;
      if (!slug) return;

      e.preventDefault();
      origenRef.current = enlace;

      const titulo = TITULOS[slug] ?? copy.ui.infoLegal;
      const enCache = cacheRef.current.get(slug);

      if (enCache) {
        setDoc({ slug, titulo, html: enCache });
        setAbierto(true);
        return;
      }

      setDoc({ slug, titulo, html: "" });
      setCargando(true);
      setAbierto(true);

      try {
        const res = await fetch(`/legal/parcial/${slug}?lang=${lang}`, {
          headers: { Accept: "text/html" },
        });
        if (!res.ok) throw new Error(String(res.status));
        const html = await res.text();
        cacheRef.current.set(slug, html);
        setDoc({ slug, titulo, html });
      } catch {
        // El documento legal siempre tiene que poder leerse: si el fragmento
        // falla, se navega a la página real en vez de dejar un modal vacío.
        window.location.href = enlace.href;
      } finally {
        setCargando(false);
      }
    };

    document.addEventListener("click", alHacerClic);
    return () => document.removeEventListener("click", alHacerClic);
  }, [lang]);

  // Al terminar de cargar, el foco va al contenido para que un lector de
  // pantalla empiece a leer por el documento y no por el botón de cerrar.
  useEffect(() => {
    if (abierto && !cargando && doc?.html) contenidoRef.current?.focus();
  }, [abierto, cargando, doc?.html]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="legal-modal-titulo"
      onClose={sincronizarCierre}
      onCancel={sincronizarCierre}
      onClick={(e) => {
        if (e.target === dialogRef.current) cerrar();
      }}
      className="m-0 max-h-none max-w-none bg-transparent p-0 backdrop:bg-primary-950/70 backdrop:backdrop-blur-sm"
      style={{ width: "100%", height: "100%" }}
    >
      <div className="grid min-h-full place-items-end sm:place-items-center sm:p-6">
        <div
          className="flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-2xl bg-surface shadow-xl sm:max-h-[85dvh] sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
            <h2
              id="legal-modal-titulo"
              className="text-xl font-bold text-ink sm:text-2xl"
            >
              {t(doc?.titulo ?? copy.ui.infoLegal)}
            </h2>
            <button
              type="button"
              onClick={cerrar}
              aria-label={t(copy.ui.cerrar)}
              className="-mr-2 -mt-1 grid size-11 shrink-0 place-items-center rounded-full text-2xl leading-none text-ink-muted hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              ×
            </button>
          </div>

          <div
            ref={contenidoRef}
            tabIndex={-1}
            aria-busy={cargando}
            className="overflow-y-auto overscroll-contain p-5 focus-visible:outline-none sm:p-6"
          >
            {cargando ? (
              <p className="py-8 text-center text-base text-ink-muted">
                {t(copy.ui.cargando)}
              </p>
            ) : (
              // El HTML viene de nuestro propio endpoint, renderizado por
              // Astro desde `legal.config.ts`. No hay entrada de usuario.
              <div dangerouslySetInnerHTML={{ __html: doc?.html ?? "" }} />
            )}
          </div>

          <div className="border-t border-line p-4 text-center sm:p-5">
            <a
              href={doc ? `/legal/${doc.slug}` : "#"}
              className="text-sm font-medium text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              {t(copy.ui.abrirPaginaCompleta)}
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default LegalModal;
