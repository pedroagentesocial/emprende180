/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTRAR CON GOOGLE Y CON FACEBOOK
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Una tercera puerta al portal, además del enlace por correo y la contraseña.
 * Las tres acaban en el mismo sitio: `abrirSesionDeProveedor` en `@lib/auth`.
 *
 * ─── LA REGLA QUE MANDA SOBRE TODO LO DEMÁS ────────────────────────────────
 *
 * ⚠️ ENTRAR CON GOOGLE NO CREA CUENTAS. Encuentra la que ya existe, por
 * correo, y nada más.
 *
 * Es la decisión de seguridad de todo el módulo. El portal es de quien compró
 * el curso: si un botón de "entrar con Google" pudiera dar de alta, cualquiera
 * con una cuenta de Gmail —o sea, cualquiera— entraría al área de alumnos en
 * dos clics. Quien no tenga cuenta ve un mensaje que lo dice y se queda en la
 * página de acceso.
 *
 * ─── POR QUÉ SE PUEDE ENLAZAR POR CORREO ───────────────────────────────────
 *
 * Enlazar cuentas por dirección de correo es peligroso EN GENERAL: si el
 * proveedor no ha comprobado esa dirección, cualquiera se registra en él con el
 * correo de otro y se lleva su cuenta. Aquí no pasa porque solo se acepta un
 * perfil cuyo correo venga marcado como verificado:
 *
 *   · Google lo dice explícitamente con `email_verified`, y se exige.
 *   · Facebook solo devuelve el correo cuando está confirmado en su lado; si no
 *     lo está, o si la persona no da el permiso, no viene ningún correo y aquí
 *     se rechaza igual.
 *
 * ─── POR QUÉ NO SE VERIFICA LA FIRMA DEL `id_token` ────────────────────────
 *
 * El `id_token` de Google llega como respuesta DIRECTA de su endpoint de
 * tokens, por TLS, en una petición que hace este servidor. En ese caso la
 * propia especificación de OpenID Connect (§3.1.3.7, punto 6) dice que no hace
 * falta validar la firma: el canal ya garantiza quién lo emitió. Bajar el JWKS
 * de Google y comprobar RS256 solo haría falta si el token llegara por el
 * navegador, que es justo lo que aquí no ocurre.
 *
 * ─── QUÉ HACE FALTA PARA QUE EL BOTÓN APAREZCA ─────────────────────────────
 *
 * Sus dos variables de entorno. Sin ellas el proveedor no está "configurado",
 * el botón no se pinta y sus rutas contestan 404. Así se puede publicar esto
 * antes de tener las credenciales sin que nadie vea un botón que no funciona.
 *
 *   Google    GOOGLE_CLIENT_ID · GOOGLE_CLIENT_SECRET
 *   Facebook  FACEBOOK_APP_ID  · FACEBOOK_APP_SECRET
 *
 * Y la URL de retorno que hay que registrar en cada consola es:
 *
 *   https://<dominio>/api/auth/google/callback
 *   https://<dominio>/api/auth/facebook/callback
 *
 * ⚠️ `import.meta.env` se resuelve al COMPILAR. Añadir las variables en Vercel
 * no basta: hay que volver a desplegar. Está documentado en
 * `docs/puesta-en-marcha.md` y ya nos mordió una vez.
 */

export const PROVEEDORES = ["google", "facebook"] as const;
export type Proveedor = (typeof PROVEEDORES)[number];

export const esProveedor = (v: unknown): v is Proveedor =>
  typeof v === "string" && (PROVEEDORES as readonly string[]).includes(v);

/** Lo único que este módulo necesita saber de una persona. */
export interface PerfilExterno {
  email: string;
  nombre: string | null;
}

interface Ajustes {
  id: string | undefined;
  secreto: string | undefined;
  autorizar: string;
  token: string;
  ambito: string;
  /** Parámetros extra de la URL de autorización, propios del proveedor. */
  extra?: Record<string, string>;
  /**
   * PKCE. Google lo soporta y se usa; Facebook también lo admite, pero su
   * implementación ha ido cambiando y un `code_challenge` que su endpoint no
   * espera rompe el flujo entero. Donde no aporta —el intercambio lo hace el
   * servidor con su secreto, no un cliente público— no se manda.
   */
  pkce: boolean;
}

const AJUSTES: Record<Proveedor, Ajustes> = {
  google: {
    id: import.meta.env.GOOGLE_CLIENT_ID,
    secreto: import.meta.env.GOOGLE_CLIENT_SECRET,
    autorizar: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    ambito: "openid email profile",
    /* `prompt=select_account` para que quien tiene dos cuentas pueda elegir en
       vez de entrar siempre con la última: en un ordenador compartido, entrar
       con la cuenta equivocada y no saber por qué es un caso real. */
    extra: { access_type: "online", prompt: "select_account" },
    pkce: true,
  },
  facebook: {
    id: import.meta.env.FACEBOOK_APP_ID,
    secreto: import.meta.env.FACEBOOK_APP_SECRET,
    autorizar: "https://www.facebook.com/v21.0/dialog/oauth",
    token: "https://graph.facebook.com/v21.0/oauth/access_token",
    ambito: "email",
    pkce: false,
  },
};

/** ¿Están sus dos credenciales? */
export const configurado = (p: Proveedor): boolean =>
  !!AJUSTES[p].id && !!AJUSTES[p].secreto;

/** Los proveedores que hoy se pueden usar. Vacío si no hay ninguno. */
export const proveedoresActivos = (): Proveedor[] =>
  PROVEEDORES.filter(configurado);

/**
 * La URL de retorno.
 *
 * ⚠️ EN PRODUCCIÓN SALE DEL DOMINIO CONFIGURADO, NO DEL DE LA PETICIÓN, y
 * aquí no es una precaución: es que si no, esto NO FUNCIONA.
 *
 * Google y Facebook comparan esta URL, carácter a carácter, con la lista que
 * uno registra en su consola, y rechazan el intento si no es idéntica. Si se
 * construyera con el dominio de la petición, cada despliegue de vista previa
 * —que tiene su propia URL, distinta en cada push— mandaría una `redirect_uri`
 * que no está registrada, y el botón fallaría con un error del proveedor que
 * no dice nada útil (`redirect_uri_mismatch`).
 *
 * Con el dominio configurado, solo hay UNA URL que registrar y siempre es la
 * misma. En desarrollo se usa la petición, o probar en local mandaría a la
 * gente a producción a mitad del flujo.
 *
 * Es la misma decisión, y por el mismo motivo, que la del enlace por correo
 * en `@lib/auth`.
 */
export const urlRetorno = (proveedor: Proveedor, origen: URL): string => {
  const base =
    import.meta.env.PROD && import.meta.env.SITE
      ? new URL(import.meta.env.SITE)
      : origen;

  return new URL(`/api/auth/${proveedor}/callback`, base).href;
};

/* ─── Piezas criptográficas ───────────────────────────────────────────────
   Todo con la WebCrypto del runtime, que es la que hay en la función de
   Vercel: nada de `node:crypto`, que allí no siempre está. */

const base64url = (bytes: ArrayBuffer | Uint8Array): string => {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const byte of b) s += String.fromCharCode(byte);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/** 32 bytes al azar, en base64url. Sirve de `state` y de verificador PKCE. */
export const aleatorio = (): string =>
  base64url(crypto.getRandomValues(new Uint8Array(32)));

const sha256b64url = async (valor: string): Promise<string> =>
  base64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(valor)));

/**
 * La URL a la que se manda al visitante.
 *
 * `state` viaja también en una cookie y se compara al volver: es lo que impide
 * que alguien monte un enlace de callback y meta a otra persona en una sesión
 * que no pidió (CSRF de login).
 */
export async function urlAutorizacion(
  proveedor: Proveedor,
  origen: URL,
  state: string,
  verificador: string,
): Promise<string> {
  const a = AJUSTES[proveedor];
  const url = new URL(a.autorizar);
  url.searchParams.set("client_id", a.id!);
  url.searchParams.set("redirect_uri", urlRetorno(proveedor, origen));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", a.ambito);
  url.searchParams.set("state", state);
  for (const [k, v] of Object.entries(a.extra ?? {})) url.searchParams.set(k, v);

  if (a.pkce) {
    url.searchParams.set("code_challenge", await sha256b64url(verificador));
    url.searchParams.set("code_challenge_method", "S256");
  }

  return url.href;
}

/** Descodifica el cuerpo de un JWT. NO comprueba la firma: ver la cabecera. */
function cuerpoDelToken(jwt: string): Record<string, unknown> | null {
  const parte = jwt.split(".")[1];
  if (!parte) return null;
  try {
    const json = atob(parte.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Cambia el `code` por el perfil de la persona.
 *
 * Devuelve `null` ante cualquier problema —red, credenciales mal puestas,
 * correo sin verificar, permiso denegado— y quien llama enseña siempre el mismo
 * mensaje. Distinguir los casos en pantalla no ayuda a nadie a entrar y le dice
 * a quien prueba cosas dónde está fallando.
 */
export async function perfilDesdeCodigo(
  proveedor: Proveedor,
  codigo: string,
  origen: URL,
  verificador: string,
): Promise<PerfilExterno | null> {
  const a = AJUSTES[proveedor];
  if (!configurado(proveedor)) return null;

  const cuerpo = new URLSearchParams({
    client_id: a.id!,
    client_secret: a.secreto!,
    code: codigo,
    grant_type: "authorization_code",
    redirect_uri: urlRetorno(proveedor, origen),
  });
  if (a.pkce) cuerpo.set("code_verifier", verificador);

  let datos: Record<string, unknown>;
  try {
    const respuesta = await fetch(a.token, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: cuerpo.toString(),
    });
    if (!respuesta.ok) return null;
    datos = (await respuesta.json()) as Record<string, unknown>;
  } catch {
    return null;
  }

  if (proveedor === "google") {
    const idToken = datos.id_token;
    if (typeof idToken !== "string") return null;
    const claims = cuerpoDelToken(idToken);
    if (!claims) return null;

    /* Las tres condiciones, y las tres son de seguridad:
       el token es para NUESTRA app, el correo está verificado, y existe. */
    if (claims.aud !== a.id) return null;
    if (claims.email_verified !== true && claims.email_verified !== "true") return null;
    const email = typeof claims.email === "string" ? claims.email : null;
    if (!email) return null;

    return {
      email: email.trim().toLowerCase(),
      nombre: typeof claims.name === "string" ? claims.name : null,
    };
  }

  /* Facebook no emite `id_token` en este flujo: se pregunta al grafo con el
     token de acceso. Y solo devuelve `email` si la persona dio el permiso Y lo
     tiene confirmado en su cuenta, así que la ausencia del campo ya es el
     rechazo. */
  const acceso = datos.access_token;
  if (typeof acceso !== "string") return null;

  try {
    const url = new URL("https://graph.facebook.com/v21.0/me");
    url.searchParams.set("fields", "name,email");
    url.searchParams.set("access_token", acceso);
    const respuesta = await fetch(url);
    if (!respuesta.ok) return null;
    const perfil = (await respuesta.json()) as { name?: string; email?: string };
    if (!perfil.email) return null;
    return {
      email: perfil.email.trim().toLowerCase(),
      nombre: perfil.name ?? null,
    };
  } catch {
    return null;
  }
}
