/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Server-only. Clave de Resend para el envío de emails. */
  readonly RESEND_API_KEY: string;
  /** Server-only. Destinatario del aviso de nuevo lead. */
  readonly NOTIFY_EMAIL_TO: string;
  /** Server-only. Remitente verificado en Resend. */
  readonly NOTIFY_EMAIL_FROM: string;
  /**
   * Server-only. "Inbound Webhook" de GoHighLevel. Cada lead capturado se
   * manda ahí además del correo de aviso. Vacío → no se llama a nadie.
   * ⚠️ Si se activa, el aviso de privacidad debe nombrar a GoHighLevel como
   * encargado del tratamiento: recibe datos identificables.
   */
  readonly GHL_WEBHOOK_URL: string;
  /** Público. ID de medición de GA4. Vacío → sin analítica. */
  readonly PUBLIC_GA4_ID: string;
  /**
   * Server-only. Postgres del área de alumnos. Cualquier proveedor sirve.
   * Sin ella: en desarrollo el área funciona en memoria; en producción, error.
   */
  readonly DATABASE_URL: string;
  /**
   * Server-only. Emails que entran como admin, separados por comas.
   * Resuelve el huevo y la gallina del primer administrador: no puede darse de
   * alta desde un panel al que todavía nadie puede entrar.
   */
  readonly ADMIN_EMAILS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


declare global {
  /**
   * Lo que el middleware deja resuelto para las páginas protegidas.
   *
   * ⚠️ Va DENTRO de `declare global`. Este archivo tiene un `export {}` al
   * final, así que es un módulo: un `declare namespace App` suelto se quedaría
   * dentro del módulo y `Astro.locals.alumno` no existiría para el resto del
   * proyecto. Con cuatro errores de tipo, ni más ni menos.
   */
  namespace App {
    interface Locals {
      /** Lo pone `src/middleware.ts` en las rutas de `/alumno` y `/admin`. */
      alumno?: import("@lib/datos").Alumno;
    }
  }

  interface Window {
    /** Inyectado por GA4. Puede no existir: comprobar antes de llamarlo. */
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export {};
