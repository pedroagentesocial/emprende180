/**
 * Rate limiting por IP — ventana deslizante en memoria.
 *
 * ALCANCE, dicho claro: esto vive en la memoria de UNA instancia de función.
 * Con Fluid Compute las instancias se reutilizan entre peticiones, así que
 * frena de sobra el caso real (un script martilleando el formulario desde una
 * IP), pero NO es un límite global: un atacante repartido entre varias
 * regiones vería su propio contador en cada instancia.
 *
 * Es la decisión correcta para lanzar: cero dependencias, cero latencia, cero
 * coste. Cuando el volumen lo justifique, el punto de cambio es una sola
 * función — `consumir()` — y detrás se pone un contador compartido
 * (Upstash Redis desde el Marketplace, o Vercel Runtime Cache). El resto del
 * código no se entera.
 */

interface Ventana {
  /** Marcas de tiempo de los intentos dentro de la ventana. */
  golpes: number[];
  /** Momento en el que caduca la entrada, para poder barrerla. */
  expira: number;
}

const registro = new Map<string, Ventana>();

/** Barrido perezoso: se limpia al usar, sin temporizadores de fondo. */
function barrer(ahora: number) {
  if (registro.size < 500) return;
  for (const [clave, v] of registro) {
    if (v.expira <= ahora) registro.delete(clave);
  }
}

export interface ResultadoLimite {
  permitido: boolean;
  /** Intentos que quedan en la ventana actual. */
  restantes: number;
  /** Segundos hasta que se libere un hueco. Solo útil si `permitido` es false. */
  reintentarEn: number;
}

/**
 * Consume un intento para `clave`.
 *
 * @param clave     Identificador del emisor (IP, normalmente).
 * @param maximo    Intentos permitidos dentro de la ventana.
 * @param ventanaMs Tamaño de la ventana en milisegundos.
 */
export function consumir(
  clave: string,
  maximo = 5,
  ventanaMs = 10 * 60 * 1000,
): ResultadoLimite {
  const ahora = Date.now();
  barrer(ahora);

  const entrada = registro.get(clave);
  const golpes = (entrada?.golpes ?? []).filter((t) => ahora - t < ventanaMs);

  if (golpes.length >= maximo) {
    const masAntiguo = golpes[0]!;
    return {
      permitido: false,
      restantes: 0,
      reintentarEn: Math.max(1, Math.ceil((ventanaMs - (ahora - masAntiguo)) / 1000)),
    };
  }

  golpes.push(ahora);
  registro.set(clave, { golpes, expira: ahora + ventanaMs });

  return {
    permitido: true,
    restantes: maximo - golpes.length,
    reintentarEn: 0,
  };
}

/**
 * Blindaje de doble envío.
 *
 * El cliente ya bloquea el botón mientras hay una petición en vuelo, pero eso
 * no cubre el doble toque en móvil con red lenta, el reintento del navegador,
 * ni a alguien reenviando a mano. Si el mismo email vuelve dentro de la
 * ventana, se responde éxito sin volver a escribir ni a mandar correos: la
 * operación es idempotente, no un error que el usuario deba entender.
 */
const recientes = new Map<string, number>();
const VENTANA_DUPLICADO_MS = 2 * 60 * 1000;

export function esDuplicadoReciente(email: string): boolean {
  const ahora = Date.now();

  if (recientes.size > 500) {
    for (const [k, t] of recientes) {
      if (ahora - t > VENTANA_DUPLICADO_MS) recientes.delete(k);
    }
  }

  const visto = recientes.get(email);
  if (visto !== undefined && ahora - visto < VENTANA_DUPLICADO_MS) return true;

  recientes.set(email, ahora);
  return false;
}

/** Extrae la IP del cliente respetando las cabeceras de proxy de Vercel. */
export function ipDe(request: Request, fallback?: string): string {
  const cabecera =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "";
  // `x-forwarded-for` puede traer una cadena de proxies: la primera es el cliente.
  const primera = cabecera.split(",")[0]?.trim();
  return primera || fallback || "desconocida";
}
