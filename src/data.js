export const academy = {
  name: "Uniciencia",
  phone: "947 376 012",
  whatsapp: "51947376012",
  address: "Av. Miguel Iglesias s/n, San Juan de Miraflores",
  venue: "I.E. «Virgen Inmaculada» 7211",
};

export const programs = [
  {
    id: "preuniversitario",
    category: "preuniversitario",
    number: "01",
    name: "Ciclo preuniversitario",
    subtitle: "Tu meta está más cerca.",
    audience: "Escolares de últimos años y egresados",
    date: "4 de enero de 2027",
    shortDate: "04 de enero",
    icon: "graduation-cap",
    description:
      "Dale dirección a tus ganas de ingresar. Empieza el verano enfocado en tu próxima gran meta: la universidad.",
    features: [
      "Preparación para admisión universitaria",
      "UNI, UNMSM, PUCP, UNE y más",
      "También fuerzas armadas y policiales",
    ],
    poster: "/images/ciclo-verano-2027.png",
    color: "blue",
  },
  {
    id: "primaria",
    category: "escolar",
    number: "02",
    name: "Vacaciones útiles",
    subtitle: "Pequeños pasos, grandes logros.",
    audience: "Primaria · De 1.º a 6.º grado",
    date: "11 de enero de 2027",
    shortDate: "11 de enero",
    icon: "pencil-ruler",
    description:
      "Un verano para seguir descubriendo. Refuerza lo aprendido y empieza el nuevo año escolar con más confianza.",
    features: [
      "Dirigido a estudiantes de primaria",
      "Desde 1.º hasta 6.º grado",
      "Colegios públicos y privados",
    ],
    poster: "/images/vacaciones-utiles-2027.png",
    color: "peach",
  },
  {
    id: "secundaria",
    category: "escolar",
    number: "03",
    name: "Vacaciones útiles",
    subtitle: "Un verano que suma a tu futuro.",
    audience: "Secundaria · De 1.º a 5.º año",
    date: "11 de enero de 2027",
    shortDate: "11 de enero",
    icon: "notebook-pen",
    description:
      "Aprovecha tus vacaciones para fortalecer tus conocimientos y volver a clases con una nueva motivación.",
    features: [
      "Dirigido a estudiantes de secundaria",
      "Desde 1.º hasta 5.º año",
      "Colegios públicos y privados",
    ],
    poster: "/images/vacaciones-utiles-2027.png",
    color: "mint",
  },
];

export function whatsappMessage({
  name = "",
  phone = "",
  program = "",
  grade = "",
  message = "",
} = {}) {
  const selected = programs.find((item) => item.id === program);
  const interest = selected
    ? `${selected.name} — ${selected.audience}`
    : "los programas de verano 2027";
  const lines = [
    `¡Hola, Uniciencia! Me gustaría recibir información sobre ${interest}.`,
    name.trim() && `Mi nombre es ${name.trim()}.`,
    phone.trim() && `Mi número de contacto es ${phone.trim()}.`,
    selected?.category === "escolar" &&
      grade &&
      `Grado de interés: ${grade}.º ${program === "primaria" ? "grado de primaria" : "año de secundaria"}.`,
    message.trim() && `Consulta: ${message.trim()}`,
    "Quisiera conocer los horarios, costos y pasos para la matrícula.",
  ].filter(Boolean);
  return lines.join("\n");
}

export function whatsappUrl(data = {}) {
  return `https://wa.me/${academy.whatsapp}?text=${encodeURIComponent(whatsappMessage(data))}`;
}

// All-day reminder only: no class timetable or course duration is implied.
export function calendarEvent(programId) {
  const program = programs.find((p) => p.id === programId);
  if (!program) throw new Error("Programa desconocido");
  const day = programId === "preuniversitario" ? "04" : "11";
  const endDay = programId === "preuniversitario" ? "05" : "12";
  const escape = (text) =>
    text
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Uniciencia//Verano 2027//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:verano2027-${programId}@uniciencia.local`,
    "DTSTAMP:20261111T000000Z",
    `DTSTART;VALUE=DATE:202701${day}`,
    `DTEND;VALUE=DATE:202701${endDay}`,
    `SUMMARY:${escape(`Inicio Uniciencia: ${program.name} (${programId})`)}`,
    `LOCATION:${escape(`${academy.venue}, ${academy.address}`)}`,
    "DESCRIPTION:Recordatorio del inicio. Consulta el horario y confirma tu matrícula con Uniciencia al +51 947 376 012.",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
