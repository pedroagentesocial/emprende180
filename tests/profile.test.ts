/**
 * La guía del perfil y la dirección de la foto (12-11-2026). `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { displayName, photoUrl, profilePercent, profileSteps } from "../src/lib/profile.ts";

const base = {
  id: "u1",
  email: "laura@x.com",
  name: null as string | null,
  lastName: null as string | null,
  phone: null as string | null,
  whatsapp: null as boolean | null,
  photoAt: null as Date | null,
};

test("un perfil vacío solo tiene hecho el correo (20%)", () => {
  assert.equal(profilePercent(base as never), 20);
  assert.deepEqual(
    profileSteps(base as never).filter((s) => !s.done).map((s) => s.key),
    ["photo", "name", "phone", "whatsapp"],
  );
});

test("nombre sin apellido no cuenta como nombre completo", () => {
  const steps = profileSteps({ ...base, name: "Laura" } as never);
  assert.equal(steps.find((s) => s.key === "name")!.done, false);
});

test("decir que NO usa WhatsApp también es responder", () => {
  assert.equal(profileSteps({ ...base, whatsapp: false } as never).find((s) => s.key === "whatsapp")!.done, true);
});

test("con todo puesto, 100%", () => {
  const full = { ...base, name: "Laura", lastName: "Ruiz", phone: "+1 801 555 0142", whatsapp: true, photoAt: new Date() };
  assert.equal(profilePercent(full as never), 100);
});

test("la foto cambia de dirección cuando cambia la foto (así ninguna caché enseña la vieja)", () => {
  assert.equal(photoUrl(base as never), null);
  const a = photoUrl({ ...base, photoAt: new Date(1000) } as never);
  const b = photoUrl({ ...base, photoAt: new Date(2000) } as never);
  assert.ok(a && b && a !== b);
  assert.ok(a!.startsWith("/student/foto/u1?v="));
});

test("el nombre que se enseña: nombre y apellido, o el correo", () => {
  assert.equal(displayName({ ...base, name: "Laura", lastName: "Ruiz" } as never), "Laura Ruiz");
  assert.equal(displayName({ ...base, name: "  " } as never), "laura@x.com");
});
