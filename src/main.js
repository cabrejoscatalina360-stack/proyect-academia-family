import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-800.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import {
  createIcons,
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  X,
  Menu,
  MapPin,
  Phone,
  GraduationCap,
  PencilRuler,
  NotebookPen,
  BookOpen,
  Sparkles,
  Download,
  MessageCircle,
  Heart,
  Target,
  Eye,
  Sun,
  Plus,
  ExternalLink,
} from "lucide";
import {
  academy,
  programs,
  whatsappUrl,
  whatsappMessage,
  calendarEvent,
} from "./data.js";
import { validateInquiry, normalizePhone, gradesFor } from "./inquiry.js";
import "./style.css";

const icon = (name, cls = "") =>
  `<i data-lucide="${name}" ${cls ? `class="${cls}"` : ""} aria-hidden="true"></i>`;
const brand = `<span class="brand-emblem" role="img" aria-label="Emblema original de Uniciencia"></span><span class="brand-type">UNIC<span>I</span>ENCIA<small>CÍRCULO DE ESTUDIO PREUNIVERSITARIO</small></span>`;
const consult = whatsappUrl();

document.querySelector("#app").innerHTML = `
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <div class="announcement"><span class="announcement-dot"></span><span>¡Volvemos a encontrarnos! <strong>Reapertura · Verano 2027</strong></span><a href="#promocion">Conoce la promoción ${icon("arrow-up-right")}</a></div>
  <header class="header">
    <div class="container header-inner">
      <a class="brand" href="#inicio" aria-label="Uniciencia, inicio">${brand}</a>
      <button class="menu-toggle icon-button" aria-label="Abrir menú" aria-expanded="false" aria-controls="main-nav">${icon("menu")}</button>
      <nav class="nav" id="main-nav" aria-label="Navegación principal">
        <a class="nav-link active" href="#ciclos">Ciclos</a>
        <a class="nav-link" href="#nosotros">Quiénes somos</a>
        <a class="nav-link" href="#filosofia">Misión y visión</a>
        <a class="nav-link" href="#materiales">Materiales</a><a class="nav-link" href="#matriculas">Matrículas y contacto</a>
        <button class="button button-small" data-enroll>Matricúlate ${icon("arrow-up-right")}</button>
      </nav>
    </div>
  </header>
  <main id="contenido">
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow"><span class="tiny-star">${icon("sparkles")}</span> UN NUEVO COMIENZO. LA MISMA PASIÓN.</span>
          <h1 id="hero-title">Volvemos para<br>ir <span class="coral-word">más lejos.<svg viewBox="0 0 340 15" aria-hidden="true"><path d="M3 10Q156-5 334 7"/></svg></span><br>Contigo.</h1>
          <p>Este verano, dale un nuevo impulso a tus metas.<br class="desktop-break"> Reabrimos nuestras puertas para acompañarte<br class="desktop-break"> en el camino hacia tu mejor versión.</p>
          <div class="hero-actions"><button class="button" data-enroll>Quiero ser parte ${icon("arrow-up-right")}</button><a class="text-link" href="#ciclos">Explorar los ciclos ${icon("arrow-down")}</a></div>
          <div class="hero-footnote"><span>${icon("check")}</span> Matrícula gratis en noviembre y diciembre</div>
        </div>
        <div class="hero-art">
          <div class="hero-art-top"><span class="pill">EL FUTURO EMPIEZA AQUÍ</span><span class="art-star">${icon("sparkles")}</span></div>
          <span class="year-art" aria-hidden="true">2027</span>
          <div class="student-illustration" role="img" aria-label="Tres estudiantes aprendiendo juntos, ilustración original de la presentación de Uniciencia"></div>
          <div class="floating-note"><span class="note-icon">${icon("graduation-cap")}</span><div>Tu próxima gran historia<small>comienza con un primer paso.</small></div>${icon("sparkles")}</div>
          <div class="art-bottom"><span>MENOS LÍMITES.<br><strong>MÁS POSIBILIDADES.</strong></span><span class="circle-arrow">${icon("arrow-up-right")}</span></div>
          <span class="art-doodle" aria-hidden="true">↗</span>
        </div>
      </div>
      <div class="container"><div class="hero-highlights"><span>${icon("graduation-cap")} Preparación preuniversitaria</span><span>${icon("book-open")} Primaria y secundaria</span><span>${icon("map-pin")} San Juan de Miraflores</span><a href="#ciclos">Descubre tu camino ${icon("arrow-right")}</a></div></div>
    </section>

    <section class="section cycles" id="ciclos" aria-labelledby="cycles-title">
      <div class="container">
        <div class="section-heading"><div><span class="eyebrow">UN VERANO. MUCHAS POSIBILIDADES.</span><h2 id="cycles-title">Tu siguiente paso<br>empieza en <span class="serif-accent">Uniciencia.</span></h2></div><p>Encuentra el programa para ti.<br>Nosotros te acompañamos en el camino.</p></div>
        <div class="cycles-toolbar"><div class="filters" role="group" aria-label="Filtrar programas"><button class="filter active" data-filter="all" aria-pressed="true">Todos los programas <span>03</span></button><button class="filter" data-filter="preuniversitario" aria-pressed="false">Preuniversitario</button><button class="filter" data-filter="escolar" aria-pressed="false">Escolar</button></div><span class="season">${icon("sun")} VERANO 2027</span></div>
        <div class="program-grid">${programs
          .map(
            (p) => `
          <article class="program-card ${p.color}" data-category="${p.category}">
            <div class="program-card-top"><span class="program-icon">${icon(p.icon)}</span><span class="program-number">/${p.number}</span></div>
            <span class="program-audience">${p.audience}</span><h3>${p.name}</h3><p>${p.subtitle}</p>
            <div class="program-start">${icon("calendar-days")} Inicio: <strong>${p.shortDate}</strong><span>2027</span></div>
            <button class="program-link" data-program="${p.id}" aria-label="Conocer ${p.name}, ${p.audience}">Conocer el programa <span>${icon("arrow-up-right")}</span></button>
          </article>`,
          )
          .join("")}</div>
        <p id="program-count" class="program-count" role="status">3 programas disponibles</p><p class="program-note">${icon("heart")} Para estudiantes de colegios públicos y privados. Para metas de todos los tamaños.</p>
      </div>
    </section>

    <section class="promotion container" id="promocion" aria-labelledby="promo-title">
      <div class="promo-seal"><span>ESTE VERANO</span><strong>S/ 0</strong><span>EN MATRÍCULA</span><svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="69"/></svg></div>
      <div class="promo-copy"><span class="eyebrow">VOLVEMOS CON UNA BUENA NOTICIA</span><h2 id="promo-title">El primer paso va por nosotros.</h2><p>Matricúlate en <strong>noviembre o diciembre de 2026</strong><br>y empieza tu verano 2027 <strong>sin pagar matrícula.</strong></p><small>Promoción sobre el derecho de matrícula. Consulta el costo del programa.</small></div>
      <button class="button button-cream" data-enroll>Aprovechar promoción ${icon("arrow-up-right")}</button>
      <span class="promo-spark" aria-hidden="true">${icon("sparkles")}</span>
    </section>

    <section class="university-section section" aria-label="Preparación para universidades">
      <div class="container"><span class="eyebrow">TÚ ELIGES LA META. NOSOTROS TE AYUDAMOS A PREPARARTE.</span><div class="university-list"><div class="university"><strong class="uni-word">UNI</strong><span>Universidad Nacional<br>de Ingeniería</span></div><div class="university"><strong class="san-marcos">UNMSM</strong><span>Universidad Nacional<br>Mayor de San Marcos</span></div><div class="university"><strong class="pucp">PUCP<span>${icon("sparkles")}</span></strong><span>Pontificia Universidad<br>Católica del Perú</span></div><div class="university"><strong class="lima">Ulima<span>✦</span></strong><span>Universidad<br>de Lima</span></div><div class="university"><strong class="une">UNE</strong><span>Universidad Nacional<br>de Educación</span></div><div class="university"><strong class="urp">URP</strong><span>Universidad<br>Ricardo Palma</span></div></div><p>Preparación para admisión. Las instituciones mencionadas no implican convenios.</p></div>
    </section>

    <section class="about section" id="nosotros" aria-labelledby="about-title">
      <div class="container about-grid">
        <div class="about-visual"><div class="about-label"><span class="live-dot"></span> UNA NUEVA ETAPA JUNTOS</div><div class="kids-illustration" role="img" aria-label="Niños junto a una torre de libros, ilustración de las vacaciones útiles de Uniciencia"></div><div class="about-quote">Las grandes metas<br>se construyen <em>juntos.</em><span>¡TU MEJOR OPCIÓN!</span></div><span class="about-star" aria-hidden="true">${icon("sparkles")}</span></div>
        <div class="about-copy"><span class="eyebrow">SOMOS UNICIENCIA</span><h2 id="about-title">Una academia.<br>Muchas historias<br><span class="serif-accent">por comenzar.</span></h2><p>Somos un círculo de estudio preuniversitario en San Juan de Miraflores. Creemos en las ganas de aprender y en el poder de dar el siguiente paso.</p><p>Hoy volvemos a abrir nuestras puertas para que escolares y futuros universitarios encuentren un espacio para avanzar hacia sus metas.</p>
          <div class="philosophy" id="filosofia"><div class="philosophy-tabs" role="tablist" aria-label="Nuestra filosofía"><button id="mission-tab" role="tab" aria-selected="true" aria-controls="mission-panel" tabindex="0">${icon("target")} Nuestra misión</button><button id="vision-tab" role="tab" aria-selected="false" aria-controls="vision-panel" tabindex="-1">${icon("eye")} Nuestra visión</button></div><div class="philosophy-panel" id="mission-panel" role="tabpanel" aria-labelledby="mission-tab"><p>Acompañar a cada estudiante en su aprendizaje, fortaleciendo sus conocimientos y su confianza para afrontar nuevos retos académicos.</p></div><div class="philosophy-panel" id="vision-panel" role="tabpanel" aria-labelledby="vision-tab" hidden><p>Ser un espacio de preparación y crecimiento en nuestra comunidad, donde cada estudiante encuentre oportunidades para construir su futuro.</p></div></div>
        </div>
      </div>
    </section>

    <section class="materials section" id="materiales" aria-labelledby="materials-title"><div class="container"><div class="section-heading"><div><span class="eyebrow">LA INFORMACIÓN, A TU ALCANCE</span><h2 id="materials-title">Conoce lo que<br>preparamos <span class="serif-accent">para ti.</span></h2></div><p>Explora nuestros afiches oficiales.<br>Descárgalos y compártelos con tu familia.</p></div><div class="resource-grid">${[
      {
        name: "Ciclo verano 2027",
        tag: "PREUNIVERSITARIO",
        image: programs[0].poster,
        filename: "ciclo-verano-2027.png",
        date: "Inicio · 04 de enero",
      },
      {
        name: "Vacaciones útiles 2027",
        tag: "PRIMARIA Y SECUNDARIA",
        image: programs[1].poster,
        filename: "vacaciones-utiles-2027.png",
        date: "Inicio · 11 de enero",
      },
    ]
      .map(
        (r) =>
          `<article class="resource-card"><button class="resource-image" data-poster="${r.image}" data-title="${r.name}" aria-label="Ampliar afiche de ${r.name}"><img src="${r.image}" alt="Afiche oficial de Uniciencia: ${r.name}, fechas, promoción y contacto" loading="lazy" width="1452" height="819"><span>${icon("plus")} Ver afiche</span></button><div class="resource-info"><div><span class="eyebrow">${r.tag}</span><h3>${r.name}</h3><p>${r.date}</p></div><a class="download-button" href="${r.image}" download="${r.filename}" aria-label="Descargar afiche de ${r.name}">${icon("download")}</a></div></article>`,
      )
      .join("")}</div></div></section>

    <section class="faq-section section"><div class="container faq-grid"><div><span class="eyebrow">RESOLVEMOS TUS DUDAS</span><h2>Un paso más cerca<br>de <span class="serif-accent">empezar.</span></h2><p>¿Tienes otra pregunta? Estamos para ayudarte.</p><a class="text-link" href="${consult}" target="_blank" rel="noopener noreferrer">Conversemos por WhatsApp ${icon("arrow-up-right")}</a></div><div><label class="faq-search-label" for="faq-search">Busca una respuesta</label><input id="faq-search" type="search" placeholder="Por ejemplo: matrícula o inicio" autocomplete="off"><p id="faq-count" role="status" class="faq-count">5 respuestas disponibles</p><div class="faq-list">${[
      [
        "¿Cuándo empiezan las clases?",
        "El ciclo preuniversitario de verano 2027 inicia el 4 de enero. Vacaciones útiles para primaria y secundaria inicia el 11 de enero de 2027.",
      ],
      [
        "¿Cómo funciona la matrícula gratuita?",
        "Si te matriculas en noviembre o diciembre de 2026, no pagas el derecho de matrícula para verano 2027. La promoción no incluye el costo del programa; consúltalo con nuestro equipo.",
      ],
      [
        "¿Quiénes pueden participar en vacaciones útiles?",
        "Estudiantes de colegios públicos y privados: de 1.º a 6.º grado de primaria y de 1.º a 5.º año de secundaria.",
      ],
      [
        "¿Dónde está ubicada la academia?",
        `${academy.venue}, ${academy.address}. Puedes comunicarte al ${academy.phone} para recibir indicaciones.`,
      ],
      [
        "¿Cómo consulto horarios, costos y matrícula?",
        "Escríbenos por WhatsApp al 947 376 012. Nuestro equipo te orientará sobre horarios disponibles, costos y los pasos para completar tu matrícula.",
      ],
    ]
      .map(
        ([q, a]) =>
          `<details><summary>${q}<span>${icon("plus")}</span></summary><p>${a}</p></details>`,
      )
      .join(
        "",
      )}</div><div id="faq-empty" class="faq-empty" hidden><p>No encontramos una respuesta. Prueba otra palabra o escríbenos.</p><button class="text-link" id="clear-faq">Ver todas las preguntas</button></div></div></div></section>

    <section class="contact section" id="matriculas" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><span class="eyebrow">LAS PUERTAS ESTÁN ABIERTAS</span><h2 id="contact-title">Tu futuro tiene<br>un nuevo <span>punto<br>de partida.</span></h2><p>Nos reencontramos en San Juan de Miraflores.<br>Ven, pregunta y da el primer paso con nosotros.</p><ol class="enrollment-steps"><li><span>01</span><div><strong>Elige tu programa</strong><p>Preuniversitario, primaria o secundaria.</p></div></li><li><span>02</span><div><strong>Consulta con nuestro equipo</strong><p>Confirma horarios, costos y requisitos.</p></div></li><li><span>03</span><div><strong>Completa tu matrícula</strong><p>El equipo te indicará cómo confirmar tu inscripción.</p></div></li></ol><button class="button" data-enroll>Quiero información ${icon("arrow-up-right")}</button></div><div class="contact-card"><span class="contact-card-tag">TE ESPERAMOS EN</span><h3>Uniciencia<span>San Juan de Miraflores</span></h3><div class="contact-row">${icon("map-pin")}<div><strong>${academy.venue}</strong><p>${academy.address}</p></div></div><div class="contact-row">${icon("phone")}<div><a href="tel:+51947376012">${academy.phone}</a><p>Informes y matrículas</p></div><button class="copy-contact" data-copy-phone aria-label="Copiar teléfono">Copiar</button></div><button class="copy-address" data-copy-address>Copiar dirección</button><a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(academy.venue + " " + academy.address)}" target="_blank" rel="noopener noreferrer">Buscar ubicación en Google Maps ${icon("external-link")}</a><a class="whatsapp-contact" href="${consult}" target="_blank" rel="noopener noreferrer">${icon("message-circle")} Escríbenos por WhatsApp ${icon("arrow-up-right")}</a></div></div></section>
  </main>
  <footer class="footer"><div class="container"><div class="footer-top"><a class="brand footer-brand" href="#inicio" aria-label="Uniciencia, volver al inicio">${brand}</a><p>Un nuevo comienzo.<br><strong>Un futuro lleno de posibilidades.</strong></p><a href="#inicio" class="back-to-top">Volver arriba ${icon("arrow-up-right")}</a></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Uniciencia. Todos los derechos reservados.</span><span>Hecho para aprender. Diseñado para avanzar.</span><button data-privacy>Privacidad</button></div></div></footer>
  <a class="whatsapp-float" href="${consult}" target="_blank" rel="noopener noreferrer" aria-label="Contactar a Uniciencia por WhatsApp">${icon("message-circle")}<span>¿Conversamos?</span></a>

  <div id="action-status" class="action-status" role="status" aria-live="polite"></div>
  <dialog id="enroll-dialog" class="modal enroll-modal" aria-labelledby="enroll-title">
    <button class="modal-close icon-button" data-close aria-label="Cerrar formulario">${icon("x")}</button>
    <div class="modal-heading"><span class="eyebrow">TU PRIMER PASO EMPIEZA AQUÍ</span><h2 id="enroll-title">Hablemos de <span class="serif-accent">tu futuro.</span></h2><p>Prepara tu consulta y envíala a nuestro equipo por WhatsApp.</p></div>
    <ol class="inquiry-steps" aria-label="Pasos de la consulta"><li id="step-data" aria-current="step">1. Tus datos</li><li id="step-review">2. Revisa y envía</li></ol>
    <form id="enroll-form" novalidate>
      <p id="form-errors" class="form-error-summary" role="alert" hidden>Revisa los campos indicados antes de continuar.</p>
      <label for="name">Tu nombre <span>*</span></label><input id="name" name="name" placeholder="¿Cómo te llamas?" autocomplete="name" minlength="2" maxlength="80" aria-describedby="name-error" required><span id="name-error" class="field-error"></span>
      <label for="phone">Celular de contacto <span>*</span></label><input id="phone" name="phone" type="tel" inputmode="tel" placeholder="Ej. 947 376 012 o +51 947 376 012" autocomplete="tel" maxlength="24" aria-describedby="phone-hint phone-error" required><small id="phone-hint" class="field-hint">Perú: 9 dígitos. Otro país: incluye el prefijo +.</small><span id="phone-error" class="field-error"></span>
      <label for="program">¿Qué programa te interesa? <span>*</span></label><select id="program" name="program" aria-describedby="program-hint program-error" required><option value="">Selecciona un programa</option>${programs.map((p) => `<option value="${p.id}">${p.name} — ${p.id === "preuniversitario" ? "Verano 2027" : p.id === "primaria" ? "Primaria" : "Secundaria"}</option>`).join("")}</select><small id="program-hint" class="field-hint"></small><span id="program-error" class="field-error"></span>
      <div id="grade-field" class="grade-field" hidden><label for="grade">Grado de interés <span>*</span></label><select id="grade" name="grade" aria-describedby="grade-error" disabled></select><span id="grade-error" class="field-error"></span></div>
      <label for="message">¿En qué podemos ayudarte? <span class="optional">Opcional</span></label><textarea id="message" name="message" rows="2" maxlength="500" placeholder="Quisiera conocer los horarios…"></textarea>
      <label class="consent"><input id="consent" name="consent" type="checkbox" aria-describedby="consent-error" required><span>Acepto compartir estos datos con Uniciencia al enviar mi mensaje por WhatsApp.</span></label><span id="consent-error" class="field-error"></span><button class="form-privacy" type="button" data-privacy>Ver privacidad</button>
      <button class="button form-submit" type="submit">Preparar mi consulta ${icon("arrow-right")}</button><p class="form-note">Esta consulta no confirma una vacante ni realiza un pago.</p>
    </form>
    <div id="enroll-success" hidden><div class="success-icon">${icon("check-check")}</div><h3>Tu mensaje está listo.</h3><p>Revisa tu mensaje. Después, abre WhatsApp y pulsa enviar para que nuestro equipo lo reciba.</p><label class="prepared-label" for="prepared-message">Mensaje que vas a enviar</label><textarea id="prepared-message" rows="7" readonly></textarea><a class="button" id="send-whatsapp" target="_blank" rel="noopener noreferrer">Enviar consulta por WhatsApp ${icon("arrow-up-right")}</a><button class="secondary-button" id="copy-inquiry" type="button">Copiar mensaje</button><p id="copy-inquiry-status" role="status" class="field-hint"></p><div class="inquiry-edit-actions"><button class="edit-inquiry" type="button">Editar mi consulta</button><button class="new-inquiry" type="button">Nueva consulta</button></div></div>
  </dialog>
  <dialog id="program-dialog" class="modal program-modal" aria-labelledby="program-dialog-title"><button class="modal-close icon-button" data-close aria-label="Cerrar información del programa">${icon("x")}</button><div id="program-detail"></div></dialog>
  <dialog id="poster-dialog" class="modal poster-modal" aria-labelledby="poster-title"><div class="poster-modal-top"><h2 id="poster-title">Afiche del programa</h2><button class="icon-button" data-close aria-label="Cerrar afiche">${icon("x")}</button></div><div class="poster-controls"><button class="secondary-button" data-poster-prev aria-label="Ver afiche anterior">Anterior</button><span id="poster-index" role="status"></span><button class="secondary-button" data-poster-next aria-label="Ver siguiente afiche">Siguiente</button><button class="secondary-button" data-poster-zoom aria-pressed="false">Ampliar imagen</button></div><div class="poster-canvas"><img id="poster-image" alt=""></div><a id="poster-download" class="button" download>Descargar afiche ${icon("download")}</a></dialog>
  <dialog id="privacy-dialog" class="modal privacy-modal" aria-labelledby="privacy-title"><button class="modal-close icon-button" data-close aria-label="Cerrar privacidad">${icon("x")}</button><span class="eyebrow">TUS DATOS</span><h2 id="privacy-title">Privacidad de tu consulta</h2><p>Los datos del formulario se utilizan únicamente en tu navegador para preparar un mensaje. Esta web no guarda el formulario en una base de datos ni lo envía automáticamente.</p><p>Al pulsar «Enviar consulta por WhatsApp», se abrirá el servicio de WhatsApp con el texto que preparaste. Solo si lo envías, compartirás tu nombre, celular y consulta con Uniciencia al +51 947 376 012, bajo las condiciones de privacidad de WhatsApp.</p><p>No incluyas documentos de identidad, información de pago ni datos sensibles. Si consultas por un menor de edad, recomendamos que lo haga su madre, padre o apoderado.</p><button class="button" data-close>Entendido ${icon("check")}</button></dialog>
`;

function refreshIcons() {
  createIcons({
    icons: {
      ArrowUpRight,
      ArrowRight,
      ArrowDown,
      CalendarDays,
      Check,
      CheckCheck,
      ChevronDown,
      X,
      Menu,
      MapPin,
      Phone,
      GraduationCap,
      PencilRuler,
      NotebookPen,
      BookOpen,
      Sparkles,
      Download,
      MessageCircle,
      Heart,
      Target,
      Eye,
      Sun,
      Plus,
      ExternalLink,
    },
  });
}
refreshIcons();

const dialogs = [...document.querySelectorAll("dialog")];
function openDialog(dialog) {
  if (dialog.open) return;
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add("modal-open");
}
function closeDialog(dialog) {
  dialog.close();
  if (!dialogs.some((d) => d.open))
    document.body.classList.remove("modal-open");
}
dialogs.forEach((dialog) => {
  dialog.addEventListener("close", () => {
    if (!dialogs.some((d) => d.open))
      document.body.classList.remove("modal-open");
  });
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        closeDialog(dialog);
    }
  });
  dialog
    .querySelectorAll("[data-close]")
    .forEach((b) => b.addEventListener("click", () => closeDialog(dialog)));
});
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  menuButton.setAttribute("aria-label", "Abrir menú");
}
menuButton.addEventListener("click", () => {
  const opened = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opened));
  menuButton.setAttribute("aria-label", opened ? "Cerrar menú" : "Abrir menú");
  nav.classList.toggle("is-open", opened);
});
nav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".header")) closeMenu();
});

function enroll(id = "") {
  closeMenu();
  if (document.querySelector("#program-dialog").open)
    closeDialog(document.querySelector("#program-dialog"));
  document.querySelector("#enroll-form").hidden = false;
  document.querySelector("#enroll-success").hidden = true;
  if (id) document.querySelector("#program").value = id;
  updateProgramFields();
  setInquiryStep(false);
  openDialog(document.querySelector("#enroll-dialog"));
}
document
  .querySelectorAll("[data-enroll]")
  .forEach((b) => b.addEventListener("click", () => enroll(b.dataset.enroll)));
document
  .querySelectorAll("[data-privacy]")
  .forEach((b) =>
    b.addEventListener("click", () =>
      openDialog(document.querySelector("#privacy-dialog")),
    ),
  );
document.querySelectorAll("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((f) => {
      const active = f === b;
      f.classList.toggle("active", active);
      f.setAttribute("aria-pressed", String(active));
    });
    document
      .querySelectorAll("[data-category]")
      .forEach(
        (c) =>
          (c.hidden =
            b.dataset.filter !== "all" &&
            c.dataset.category !== b.dataset.filter),
      );
    const count = document.querySelectorAll(
      "[data-category]:not([hidden])",
    ).length;
    document.querySelector("#program-count").textContent =
      `${count} ${count === 1 ? "programa disponible" : "programas disponibles"}`;
  }),
);
document.querySelectorAll("[data-program]").forEach((b) =>
  b.addEventListener("click", () => {
    const p = programs.find((p) => p.id === b.dataset.program);
    document.querySelector("#program-detail").innerHTML =
      `<span class="program-icon ${p.color}">${icon(p.icon)}</span><span class="eyebrow">VERANO 2027 · ${p.id === "preuniversitario" ? "PREUNIVERSITARIO" : "VACACIONES ÚTILES"}</span><h2 id="program-dialog-title">${p.name}</h2><p class="detail-audience">${p.audience}</p><p>${p.description}</p><div class="detail-date">${icon("calendar-days")}<div>Inicio de clases<strong>${p.date}</strong></div></div><ul class="detail-features">${p.features.map((f) => `<li>${icon("check")} ${f}</li>`).join("")}</ul><div class="detail-promo">Matrícula gratis en noviembre y diciembre de 2026.<small>Consulta horarios y costo del programa con nuestro equipo.</small></div><div class="detail-tools"><a class="secondary-button" href="data:text/calendar;charset=utf-8,${encodeURIComponent(calendarEvent(p.id))}" download="uniciencia-${p.id}-2027.ics">${icon("calendar-days")} Recordar inicio</a><button class="secondary-button detail-poster">${icon("book-open")} Ver afiche</button></div><p class="calendar-note">Recordatorio de la fecha de inicio. Confirma el horario con la academia.</p><button class="button detail-enroll">Me interesa este programa ${icon("arrow-up-right")}</button>`;
    document
      .querySelector(".detail-enroll")
      .addEventListener("click", () => enroll(p.id));
    document
      .querySelector(".detail-poster")
      .addEventListener("click", () => showPoster(p.poster));
    refreshIcons();
    openDialog(document.querySelector("#program-dialog"));
  }),
);
const posters = [
  {
    image: programs[0].poster,
    title: "Ciclo verano 2027",
    filename: "ciclo-verano-2027.png",
  },
  {
    image: programs[1].poster,
    title: "Vacaciones útiles 2027",
    filename: "vacaciones-utiles-2027.png",
  },
];
let posterIndex = 0;
function showPoster(image) {
  posterIndex = Math.max(
    0,
    posters.findIndex((p) => p.image === image),
  );
  const poster = posters[posterIndex];
  document.querySelector("#poster-title").textContent = poster.title;
  const img = document.querySelector("#poster-image");
  img.src = poster.image;
  img.alt = `Afiche oficial de ${poster.title} de Uniciencia`;
  const download = document.querySelector("#poster-download");
  download.href = poster.image;
  download.download = poster.filename;
  document.querySelector("#poster-index").textContent =
    `${posterIndex + 1} de ${posters.length}`;
  document.querySelector(".poster-canvas").classList.remove("is-zoomed");
  document
    .querySelector("[data-poster-zoom]")
    .setAttribute("aria-pressed", "false");
  document.querySelector("[data-poster-zoom]").textContent = "Ampliar imagen";
  openDialog(document.querySelector("#poster-dialog"));
}
document
  .querySelectorAll("[data-poster]")
  .forEach((b) =>
    b.addEventListener("click", () => showPoster(b.dataset.poster)),
  );
document
  .querySelector("[data-poster-prev]")
  .addEventListener("click", () =>
    showPoster(
      posters[(posterIndex + posters.length - 1) % posters.length].image,
    ),
  );
document
  .querySelector("[data-poster-next]")
  .addEventListener("click", () =>
    showPoster(posters[(posterIndex + 1) % posters.length].image),
  );
document.querySelector("[data-poster-zoom]").addEventListener("click", (e) => {
  const zoomed = document
    .querySelector(".poster-canvas")
    .classList.toggle("is-zoomed");
  e.currentTarget.setAttribute("aria-pressed", String(zoomed));
  e.currentTarget.textContent = zoomed ? "Ajustar imagen" : "Ampliar imagen";
});
const philosophyTabs = [
  ...document.querySelectorAll('.philosophy-tabs [role="tab"]'),
];
function selectTab(tab) {
  philosophyTabs.forEach((t) => {
    const active = t === tab;
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
  });
}
philosophyTabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const next =
        philosophyTabs[
          e.key === "Home" ? 0 : e.key === "End" ? 1 : (i + 1) % 2
        ];
      selectTab(next);
      next.focus();
    }
  });
});
const form = document.querySelector("#enroll-form");
function inquiryData() {
  return Object.fromEntries(new FormData(form));
}
function setInquiryStep(review) {
  for (const [id, active] of [
    ["step-data", !review],
    ["step-review", review],
  ]) {
    const step = document.getElementById(id);
    if (active) step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  }
}
function showFieldError(name, message) {
  const field = form.elements.namedItem(name);
  const hint = document.getElementById(`${name}-error`);
  if (!field || !hint) return;
  hint.textContent = message || "";
  field.setAttribute("aria-invalid", String(Boolean(message)));
}
function updateProgramFields() {
  const program = form.elements.program.value;
  const options = gradesFor(program);
  const grade = form.elements.grade;
  const previous = grade.value;
  document.querySelector("#grade-field").hidden = !options.length;
  grade.disabled = !options.length;
  grade.required = Boolean(options.length);
  grade.replaceChildren(
    new Option("Selecciona el grado", ""),
    ...options.map((g) => new Option(g.label, g.value)),
  );
  if (options.some((g) => g.value === previous)) grade.value = previous;
  showFieldError("grade", "");
  const selected = programs.find((p) => p.id === program);
  document.querySelector("#program-hint").textContent = selected
    ? `Inicio: ${selected.date}. Consulta horarios y costo con nuestro equipo.`
    : "";
}
form.elements.program.addEventListener("change", updateProgramFields);
for (const name of ["name", "phone", "program", "grade", "consent"]) {
  const field = form.elements.namedItem(name);
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true")
      showFieldError(name, validateInquiry(inquiryData())[name]);
  });
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = inquiryData();
  const errors = validateInquiry(data);
  for (const name of ["name", "phone", "program", "grade", "consent"])
    showFieldError(name, errors[name]);
  document.querySelector("#form-errors").hidden = !Object.keys(errors).length;
  if (Object.keys(errors).length) {
    form.elements.namedItem(Object.keys(errors)[0]).focus();
    return;
  }
  const cleaned = {
    ...data,
    name: data.name.trim(),
    phone: normalizePhone(data.phone),
  };
  document.querySelector("#send-whatsapp").href = whatsappUrl(cleaned);
  document.querySelector("#prepared-message").value = whatsappMessage(cleaned);
  document.querySelector("#copy-inquiry-status").textContent = "";
  form.hidden = true;
  document.querySelector("#enroll-success").hidden = false;
  setInquiryStep(true);
  document.querySelector("#enroll-dialog").scrollTop = 0;
  document.querySelector("#send-whatsapp").focus();
});
document.querySelector(".edit-inquiry").addEventListener("click", () => {
  form.hidden = false;
  document.querySelector("#enroll-success").hidden = true;
  setInquiryStep(false);
  form.elements.name.focus();
});
document.querySelector(".new-inquiry").addEventListener("click", () => {
  form.reset();
  for (const name of ["name", "phone", "program", "grade", "consent"])
    showFieldError(name, "");
  document.querySelector("#form-errors").hidden = true;
  form.hidden = false;
  document.querySelector("#enroll-success").hidden = true;
  document.querySelector("#prepared-message").value = "";
  document.querySelector("#send-whatsapp").removeAttribute("href");
  updateProgramFields();
  setInquiryStep(false);
  form.elements.name.focus();
});
async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {}
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
  const parent = dialogs.findLast((d) => d.open) || document.body;
  const focused = document.activeElement;
  parent.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {}
  textarea.remove();
  focused?.focus();
  return copied;
}
let noticeTimer;
function notifyAction(message) {
  const notice = document.querySelector("#action-status");
  notice.textContent = message;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    notice.textContent = "";
  }, 5000);
}
document.querySelector("#copy-inquiry").addEventListener("click", async () => {
  const ok = await copyText(document.querySelector("#prepared-message").value);
  document.querySelector("#copy-inquiry-status").textContent = ok
    ? "Mensaje copiado. Puedes pegarlo en WhatsApp."
    : "Selecciona el mensaje de arriba y cópialo manualmente.";
  if (!ok) {
    document.querySelector("#prepared-message").focus();
    document.querySelector("#prepared-message").select();
  }
});
document
  .querySelector("[data-copy-phone]")
  .addEventListener("click", async () =>
    notifyAction(
      (await copyText(academy.phone))
        ? "Teléfono copiado."
        : `Teléfono: ${academy.phone}`,
    ),
  );
document
  .querySelector("[data-copy-address]")
  .addEventListener("click", async () =>
    notifyAction(
      (await copyText(`${academy.venue}, ${academy.address}`))
        ? "Dirección copiada."
        : `${academy.venue}, ${academy.address}`,
    ),
  );
const normalizeSearch = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
const faqSearch = document.querySelector("#faq-search");
function searchFaq() {
  const query = normalizeSearch(faqSearch.value);
  let count = 0;
  document.querySelectorAll(".faq-list details").forEach((d) => {
    d.hidden = !normalizeSearch(d.textContent).includes(query);
    if (!d.hidden) count++;
  });
  document.querySelector("#faq-count").textContent =
    `${count} ${count === 1 ? "respuesta disponible" : "respuestas disponibles"}`;
  document.querySelector("#faq-empty").hidden = count > 0;
}
faqSearch.addEventListener("input", searchFaq);
document.querySelector("#clear-faq").addEventListener("click", () => {
  faqSearch.value = "";
  searchFaq();
  faqSearch.focus();
});
// Move keyboard focus to the destination, so the next Tab starts in that section.
document.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener("click", () => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }),
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const link = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`,
        );
        if (link) {
          document
            .querySelectorAll(".nav-link")
            .forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
          document
            .querySelectorAll(".nav-link")
            .forEach((a) => a.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "location");
        }
      }
    });
  },
  { rootMargin: "-15% 0px -60% 0px" },
);
["ciclos", "nosotros", "filosofia", "materiales", "matriculas"].forEach((id) =>
  observer.observe(document.getElementById(id)),
);
