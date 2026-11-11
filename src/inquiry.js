import { programs } from "./data.js";

/** Remove display punctuation while retaining the international prefix. */
export function normalizePhone(phone) {
  return String(phone ?? "")
    .trim()
    .replace(/[^\d+]/g, "");
}

export function gradesFor(programId) {
  const count =
    programId === "primaria" ? 6 : programId === "secundaria" ? 5 : 0;
  const unit = programId === "primaria" ? "grado" : "año";
  return Array.from({ length: count }, (_, index) => ({
    value: String(index + 1),
    label: `${index + 1}.º ${unit}`,
  }));
}

function validPhone(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  // A plus is allowed once, only as the international prefix. Validate before
  // normalization so letters and other invalid characters cannot disappear.
  if (!/^\+?[\d\s()-]+$/u.test(raw)) return false;
  const normalized = normalizePhone(raw);
  if (!normalized.startsWith("+")) return /^9\d{8}$/.test(normalized);
  if (normalized.startsWith("+51")) return /^\+519\d{8}$/.test(normalized);
  return /^\+[1-9]\d{7,14}$/.test(normalized);
}

/** Return errors keyed by the associated form field; an empty object is valid. */
export function validateInquiry(data = {}) {
  const errors = {};
  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (name.length < 2 || !/\p{L}/u.test(name)) {
    errors.name = "Escribe tu nombre con al menos dos caracteres y una letra.";
  }
  if (!validPhone(data.phone)) {
    errors.phone =
      "Escribe un celular peruano de 9 dígitos que empiece en 9, o un número internacional con + y código de país.";
  }
  const program = programs.find((item) => item.id === data.program);
  if (!program) {
    errors.program = "Selecciona un programa de la lista.";
  } else if (program.category === "escolar") {
    const grades = gradesFor(program.id);
    if (!grades.some((grade) => grade.value === data.grade)) {
      errors.grade = `Selecciona un ${program.id === "primaria" ? "grado de primaria" : "año de secundaria"} válido.`;
    }
  }
  if (data.consent !== true && data.consent !== "on") {
    errors.consent = "Acepta compartir tus datos para preparar la consulta.";
  }
  return errors;
}
