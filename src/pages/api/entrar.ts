import type { APIRoute } from "astro";
import { z } from "zod";
import { entrarConClave, rutaInterna } from "@lib/acceso";
import { consumir, ipDe } from "@lib/rateLimit";

export const prerender = false;

/**
 * POST /api/entrar — correo y contraseña.
 *
 * ⚠️ UN SOLO MENSAJE DE ERROR PARA LOS TRES FALLOS. No existe, está de baja o
 * la contraseña no es: los tres devuelven "correo o contraseña incorrectos".
 * Decir "contraseña incorrecta" confirmaría que ese correo compró el curso, y
 * eso convierte el formulario en un comprobador de clientes.
 *
 * ⚠️ EL LÍMITE VA POR IP **Y** POR CORREO.
 *
 * Solo por IP, un ataque desde mil direcciones prueba mil contraseñas contra la
 * misma cuenta sin tocar techo. Solo por correo, quien quiera puede bloquear la
 * cuenta de otro fallando diez veces a propósito — por eso el de correo es más
 * generoso y el de IP más estricto: molestar a un tercero tiene que salir caro,
 * pero quedarse fuera de la cuenta propia por culpa de un vecino, no.
 *
 * La derivación scrypt tarda ~100 ms a propósito (ver `src/lib/claves.ts`), así
 * que un ataque por fuerza bruta ya es lentísimo antes de llegar a estos
 * límites. Esto es la segunda barrera, no la primera.
 */

const esquema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  clave: z.string().min(1).max(200),
  destino: z.string().max(200).optional(),
});

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  const ip = ipDe(request, clientAddress);
  if (!consumir(`entrar-ip:${ip}`, 20, 10 * 60 * 1000).permitido) {
    return json({ ok: false, error: "limite" }, 429);
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return json({ ok: false, error: "peticion" }, 400);
  }

  const parsed = esquema.safeParse(cuerpo);
  if (!parsed.success) return json({ ok: false, error: "credenciales" }, 400);

  const { email, clave, destino } = parsed.data;

  if (!consumir(`entrar-email:${email}`, 10, 15 * 60 * 1000).permitido) {
    return json({ ok: false, error: "limite" }, 429);
  }

  const alumno = await entrarConClave(
    email,
    clave,
    cookies,
    request.headers.get("user-agent"),
  );

  if (!alumno) return json({ ok: false, error: "credenciales" }, 401);

  /* El destino lo depura `rutaInterna`: llega del navegador y acaba en una
     redirección, así que no puede ser una URL de otro dominio. */
  return json({ ok: true, destino: rutaInterna(destino ?? null) }, 200);
};

export const ALL: APIRoute = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } });
