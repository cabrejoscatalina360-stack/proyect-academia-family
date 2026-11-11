import test from "node:test";
import assert from "node:assert/strict";
import {
  academy,
  programs,
  whatsappUrl,
  whatsappMessage,
  calendarEvent,
} from "../src/data.js";

test("la consulta apunta al número oficial de WhatsApp mediante HTTPS", () => {
  const url = new URL(whatsappUrl());

  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/51947376012");
  assert.equal(url.pathname, `/${academy.whatsapp}`);
  assert.deepEqual([...url.searchParams.keys()], ["text"]);
});

test("conserva caracteres especiales sin convertirlos en parámetros o fragmentos", () => {
  const name = "  María & José + familia  ";
  const phone = "  +51 947 376 012  ";
  const message =
    "  ¿Hay clases de matemática? Precio: S/ 100 & horario=mañana #2027\nGracias 😊  ";
  const rawUrl = whatsappUrl({ name, phone, program: "primaria", message });
  const url = new URL(rawUrl);
  const text = url.searchParams.get("text");

  assert.equal(url.hash, "");
  assert.deepEqual([...url.searchParams.keys()], ["text"]);
  assert.ok(text.includes("Mi nombre es María & José + familia."));
  assert.ok(text.includes("Mi número de contacto es +51 947 376 012."));
  assert.ok(text.includes(`Consulta: ${message.trim()}`));
  assert.ok(text.includes("\n"));
  assert.ok(rawUrl.includes("%26"));
  assert.ok(rawUrl.includes("%23"));
  assert.ok(rawUrl.includes("%2B"));
  assert.ok(rawUrl.includes("%0A"));
});

for (const program of programs) {
  test(`la consulta identifica el programa ${program.id} y su público`, () => {
    const text = new URL(whatsappUrl({ program: program.id })).searchParams.get(
      "text",
    );

    assert.ok(text.includes(`${program.name} — ${program.audience}`));
    assert.ok(
      text.includes(
        "Quisiera conocer los horarios, costos y pasos para la matrícula.",
      ),
    );
    assert.ok(!text.includes("sobre los programas de verano 2027."));
  });
}

test("una consulta sin programa usa información general y omite campos vacíos", () => {
  const text = new URL(whatsappUrl()).searchParams.get("text");

  assert.equal(
    text,
    "¡Hola, Uniciencia! Me gustaría recibir información sobre los programas de verano 2027.\n" +
      "Quisiera conocer los horarios, costos y pasos para la matrícula.",
  );
  assert.ok(!text.includes("undefined"));
  assert.ok(!text.includes("Mi nombre es"));
  assert.ok(!text.includes("Mi número de contacto es"));
  assert.ok(!text.includes("Consulta:"));
});

test("un programa desconocido y campos con espacios usan una consulta general limpia", () => {
  const fallback = whatsappUrl({
    program: "programa-inexistente",
    name: "  ",
    phone: "\t",
    message: "\n ",
  });

  assert.equal(fallback, whatsappUrl());
});

test("el resumen y el enlace incluyen el grado escolar elegido", () => {
  const data = {
    name: "Ana",
    phone: "+51999888777",
    program: "secundaria",
    grade: "4",
  };
  const message = whatsappMessage(data);
  assert.ok(message.includes("Grado de interés: 4.º año de secundaria."));
  assert.equal(new URL(whatsappUrl(data)).searchParams.get("text"), message);
  assert.ok(
    !whatsappMessage({ program: "preuniversitario", grade: "4" }).includes(
      "Grado de interés",
    ),
  );
});

test("los recordatorios usan la fecha correcta y no inventan horario de clases", () => {
  for (const id of ["preuniversitario", "primaria", "secundaria"]) {
    const event = calendarEvent(id);
    assert.ok(event.startsWith("BEGIN:VCALENDAR\r\n"));
    assert.ok(event.endsWith("END:VCALENDAR\r\n"));
    assert.ok(
      event.includes(
        `DTSTART;VALUE=DATE:202701${id === "preuniversitario" ? "04" : "11"}\r\n`,
      ),
    );
    assert.ok(
      event.includes(
        `DTEND;VALUE=DATE:202701${id === "preuniversitario" ? "05" : "12"}\r\n`,
      ),
    );
    assert.ok(event.includes("LOCATION:I.E."));
    assert.ok(event.includes("Consulta el horario"));
    assert.ok(!event.includes("DTSTART;TZID="));
  }
  assert.throws(() => calendarEvent("unknown"), /desconocido/);
});
