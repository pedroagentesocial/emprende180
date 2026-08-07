import { forwardRef, useId } from "react";

/**
 * Input de formulario con etiqueta, error y ayuda accesibles.
 *
 * Detalles que importan en móvil:
 *  · `inputMode` y `autoComplete` para que salga el teclado correcto.
 *  · Texto a 16 px mínimo: por debajo, iOS hace zoom al enfocar el campo y
 *    descoloca todo el layout.
 *  · El error se anuncia con `aria-live` y se enlaza con `aria-describedby`.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  ayuda?: string;
  /** Oculta el campo visualmente (honeypot). */
  oculto?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ayuda, oculto = false, className = "", ...props }, ref) => {
    const autoId = useId();
    const id = props.id ?? autoId;
    const errorId = `${id}-error`;
    const ayudaId = `${id}-ayuda`;

    if (oculto) {
      return (
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={id}>{label}</label>
          <input ref={ref} id={id} tabIndex={-1} autoComplete="off" {...props} />
        </div>
      );
    }

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? errorId : null, ayuda ? ayudaId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={[
            // min-h-11 = 44 px táctil · text-base = 16 px evita el zoom de iOS
            "min-h-11 w-full rounded-lg border bg-surface px-4 py-3 text-base text-ink",
            "placeholder:text-ink-subtle",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            error ? "border-error-500" : "border-line-strong",
            className,
          ].join(" ")}
          {...props}
        />

        {ayuda && !error && (
          <p id={ayudaId} className="mt-1.5 text-sm text-ink-subtle">
            {ayuda}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-sm font-medium text-error-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
