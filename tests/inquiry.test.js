import test from "node:test";
import assert from "node:assert/strict";
import { gradesFor, normalizePhone, validateInquiry } from "../src/inquiry.js";

const valid = {
  name: "Ana Pérez",
  phone: "947 376 012",
  program: "preuniversitario",
  consent: "on",
};

test("acepta una consulta preuniversitaria completa sin grado escolar", () => {
  assert.deepEqual(validateInquiry(valid), {});
});

test("normaliza teléfonos sin perder el prefijo internacional", () => {
  assert.equal(normalizePhone(" +51 (947) 376-012 "), "+51947376012");
  assert.equal(normalizePhone("947 376 012"), "947376012");
  assert.equal(normalizePhone(null), "");
});

test("acepta celulares peruanos con puntuación y números internacionales", () => {
  for (const phone of [
    "947376012",
    "+51 (947) 376-012",
    "(947) 376-012",
    "+1 (202) 555-0123",
    "+34 612 345 678",
    "+12345678",
    "+123456789012345",
  ]) {
    assert.equal(validateInquiry({ ...valid, phone }).phone, undefined, phone);
  }
});

test("rechaza símbolos sin dígitos, letras y múltiples signos más", () => {
  for (const phone of [
    "+++++++",
    "       ",
    "abcdefg",
    "947abc376012",
    "++51947376012",
    "9+47376012",
    "+51.947376012",
  ]) {
    assert.ok(validateInquiry({ ...valid, phone }).phone, phone);
  }
});

test("exige el formato y longitud del celular peruano", () => {
  for (const phone of [
    "847376012",
    "94737601",
    "9473760123",
    "51947376012",
    "+51847376012",
    "+5194737601",
    "+519473760123",
  ]) {
    assert.ok(validateInquiry({ ...valid, phone }).phone, phone);
  }
});

test("limita internacionales a entre 8 y 15 dígitos con prefijo +", () => {
  for (const phone of [
    "+1234567",
    "+1234567890123456",
    "+012345678",
    "2025550123",
  ]) {
    assert.ok(validateInquiry({ ...valid, phone }).phone, phone);
  }
});

test("rechaza nombres vacíos y valores sin letras", () => {
  for (const name of ["", "   ", " A ", "12", "--", undefined, 123]) {
    assert.ok(validateInquiry({ ...valid, name }).name, String(name));
  }
});

test("acepta nombres con letras Unicode y recorta espacios", () => {
  for (const name of ["  Ana  ", "José", "María-José", "李明", "Zoë"]) {
    assert.equal(validateInquiry({ ...valid, name }).name, undefined, name);
  }
});

test("programas desconocidos no se convierten en una consulta válida", () => {
  for (const program of ["", undefined, "otro", "Primaria"]) {
    assert.ok(validateInquiry({ ...valid, program }).program);
  }
});

test("los grados corresponden al nivel escolar y son valores independientes", () => {
  assert.deepEqual(
    gradesFor("primaria"),
    [1, 2, 3, 4, 5, 6].map((n) => ({
      value: String(n),
      label: `${n}.º grado`,
    })),
  );
  assert.deepEqual(
    gradesFor("secundaria"),
    [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}.º año` })),
  );
  assert.deepEqual(gradesFor("preuniversitario"), []);
  assert.deepEqual(gradesFor("desconocido"), []);
  const changed = gradesFor("primaria");
  changed[0].label = "cambio local";
  assert.equal(gradesFor("primaria")[0].label, "1.º grado");
});

test("valida todos los grados permitidos de primaria y secundaria", () => {
  for (const program of ["primaria", "secundaria"]) {
    for (const { value: grade } of gradesFor(program)) {
      assert.deepEqual(validateInquiry({ ...valid, program, grade }), {});
    }
  }
});

test("exige grado escolar y rechaza valores fuera de rango o ambiguos", () => {
  for (const program of ["primaria", "secundaria"]) {
    for (const grade of [undefined, "", "0", "7", "01", 1]) {
      assert.ok(validateInquiry({ ...valid, program, grade }).grade);
    }
  }
  assert.ok(
    validateInquiry({ ...valid, program: "secundaria", grade: "6" }).grade,
  );
});

test("el consentimiento requiere true o el valor on del formulario", () => {
  assert.deepEqual(validateInquiry({ ...valid, consent: true }), {});
  for (const consent of [false, undefined, "", "true", "off", 1]) {
    assert.ok(validateInquiry({ ...valid, consent }).consent);
  }
});

test("retorna todos los errores de una consulta incompleta", () => {
  assert.deepEqual(Object.keys(validateInquiry()).sort(), [
    "consent",
    "name",
    "phone",
    "program",
  ]);
  assert.deepEqual(
    Object.keys(validateInquiry({ program: "primaria" })).sort(),
    ["consent", "grade", "name", "phone"],
  );
});
