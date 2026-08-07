/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Server-only. Clave de Resend para el envío de emails. */
  readonly RESEND_API_KEY: string;
  /** Server-only. Destinatario del aviso de nuevo lead. */
  readonly NOTIFY_EMAIL_TO: string;
  /** Server-only. Remitente verificado en Resend. */
  readonly NOTIFY_EMAIL_FROM: string;
  /** Público. ID de medición de GA4. Vacío → sin analítica. */
  readonly PUBLIC_GA4_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    /** Inyectado por GA4. Puede no existir: comprobar antes de llamarlo. */
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export {};
