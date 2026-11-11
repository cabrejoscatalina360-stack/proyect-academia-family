import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("el formulario rechaza espacios y signos como datos de contacto", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Quiero ser parte" }).click();
  await page.getByLabel("Tu nombre").fill("   ");
  await page.getByLabel("Celular de contacto").fill("+++++++");
  await page.locator("#program").selectOption("preuniversitario");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(page.locator("#form-errors")).toBeVisible();
  await expect(page.locator("#name-error")).toContainText("nombre");
  await expect(page.locator("#phone-error")).toContainText("celular");
  await expect(page.locator("#name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#name")).toBeFocused();
  await expect(page.locator("#enroll-success")).not.toBeVisible();
  await page.getByLabel("Tu nombre").fill("Ana Pérez");
  await page.getByLabel("Celular de contacto").fill("947 376 012");
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(page.locator("#enroll-success")).toBeVisible();
});

test("el grado depende del programa y se conserva al volver a la consulta", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Quiero ser parte" }).click();
  await page.getByLabel("Tu nombre").fill("Ana Pérez");
  await page.getByLabel("Celular de contacto").fill("947376012");
  await page.getByRole("checkbox").check();
  await page.locator("#program").selectOption("primaria");
  await expect(page.locator("#grade-field")).toBeVisible();
  await expect(page.locator("#grade option")).toHaveCount(7);
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(page.locator("#grade-error")).toContainText("primaria");
  await expect(page.locator("#grade")).toBeFocused();
  await page.locator("#grade").selectOption("6");
  await page.locator("#program").selectOption("secundaria");
  await expect(page.locator("#grade option")).toHaveCount(6);
  await expect(page.locator("#grade")).toHaveValue("");
  await page.locator("#grade").selectOption("5");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Quiero ser parte" }).click();
  await expect(page.locator("#program")).toHaveValue("secundaria");
  await expect(page.locator("#grade")).toHaveValue("5");
  await page.locator("#program").selectOption("preuniversitario");
  await expect(page.locator("#grade-field")).not.toBeVisible();
  await expect(page.locator("#grade")).toBeDisabled();
});

test("el resumen permite revisar el mismo mensaje que abrirá WhatsApp", async ({
  page,
}) => {
  await page.locator('[data-program="primaria"]').click();
  await page.getByRole("button", { name: "Me interesa este programa" }).click();
  await page.getByLabel("Tu nombre").fill("  María Gómez  ");
  await page.getByLabel("Celular de contacto").fill("+51 (947) 376-012");
  await page.getByLabel("Grado de interés").selectOption("3");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  const summary = page.getByLabel("Mensaje que vas a enviar");
  await expect(summary).toHaveAttribute("readonly", "");
  const message = await summary.inputValue();
  expect(message).toContain("María Gómez");
  expect(message).toContain("+51947376012");
  expect(message).toContain("3.º grado de primaria");
  const url = new URL(
    await page.locator("#send-whatsapp").getAttribute("href"),
  );
  expect(url.searchParams.get("text")).toBe(message);
  await expect(page.locator("#step-review")).toHaveAttribute(
    "aria-current",
    "step",
  );
  await page.getByRole("button", { name: "Editar mi consulta" }).click();
  await expect(page.getByLabel("Grado de interés")).toHaveValue("3");
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await page.getByRole("button", { name: "Nueva consulta" }).click();
  await expect(page.locator("#name")).toHaveValue("");
  await expect(page.locator("#program")).toHaveValue("");
  await expect(page.getByRole("checkbox")).not.toBeChecked();
});

test("la búsqueda de preguntas ignora tildes y recupera resultados al limpiar", async ({
  page,
}) => {
  const search = page.getByLabel("Busca una respuesta");
  await search.fill("matrícula");
  const accented = await page
    .locator(".faq-list details:not([hidden]) summary")
    .allTextContents();
  expect(accented.length).toBeGreaterThan(0);
  await search.fill("matricula");
  expect(
    await page
      .locator(".faq-list details:not([hidden]) summary")
      .allTextContents(),
  ).toEqual(accented);
  await search.fill("xyzsinresultados");
  await expect(page.locator("#faq-empty")).toBeVisible();
  await expect(page.locator(".faq-list details:visible")).toHaveCount(0);
  await expect(page.locator("#faq-count")).toContainText("0 respuestas");
  await page.getByRole("button", { name: "Ver todas las preguntas" }).click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(page.locator(".faq-list details:visible")).toHaveCount(5);
});

test("el visor recorre ambos afiches y cambia el nivel de ampliación", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Ampliar afiche de Ciclo verano 2027" })
    .click();
  await expect(page.locator("#poster-index")).toHaveText("1 de 2");
  await page.getByRole("button", { name: "Ver siguiente afiche" }).click();
  await expect(page.locator("#poster-title")).toHaveText(
    "Vacaciones útiles 2027",
  );
  await expect(page.locator("#poster-index")).toHaveText("2 de 2");
  await expect(page.locator("#poster-download")).toHaveAttribute(
    "download",
    "vacaciones-utiles-2027.png",
  );
  await page
    .getByRole("button", { name: "Ampliar imagen", exact: true })
    .click();
  await expect(page.locator("[data-poster-zoom]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.locator(".poster-canvas")).toHaveClass(/is-zoomed/);
  await page
    .getByRole("button", { name: "Ajustar imagen", exact: true })
    .click();
  await expect(page.locator(".poster-canvas")).not.toHaveClass(/is-zoomed/);
  await page.getByRole("button", { name: "Ver afiche anterior" }).click();
  await expect(page.locator("#poster-index")).toHaveText("1 de 2");
  await page.getByRole("button", { name: "Ver afiche anterior" }).click();
  await expect(page.locator("#poster-index")).toHaveText("2 de 2");
});

test("el recordatorio escolar descarga un calendario con la fecha oficial", async ({
  page,
}) => {
  await page.locator('[data-program="secundaria"]').click();
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "Recordar inicio" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("uniciencia-secundaria-2027.ics");
  expect(await download.failure()).toBeNull();
  const calendar = await readFile(await download.path(), "utf8");
  expect(calendar).toContain("BEGIN:VCALENDAR");
  expect(calendar).toContain("DTSTART;VALUE=DATE:20270111");
  expect(calendar).toContain("DTEND;VALUE=DATE:20270112");
  expect(calendar).toContain("Vacaciones útiles");
});

test("copiar teléfono informa el número cuando el portapapeles no está disponible", async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Permiso no disponible");
        },
      },
    });
    document.execCommand = () => false;
  });
  await page.getByRole("button", { name: "Copiar teléfono" }).click();
  await expect(page.locator("#action-status")).toHaveText(
    "Teléfono: 947 376 012",
  );
  await expect(
    page.getByRole("button", { name: "Copiar teléfono" }),
  ).toBeFocused();
});

test("Matrículas es accesible y Escape devuelve el foco al menú móvil", async ({
  page,
  isMobile,
}) => {
  const toggle = page.locator(".menu-toggle");
  const contactLink = page.locator('#main-nav a[href="#matriculas"]');
  if (isMobile) {
    await toggle.click();
    await contactLink.focus();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    await toggle.click();
  }
  await expect(contactLink).toHaveAccessibleName("Matrículas y contacto");
  await contactLink.click();
  await expect(page).toHaveURL(/#matriculas$/);
  await expect(page.locator("#matriculas")).toBeFocused();
  await expect(
    page.getByRole("heading", { name: /Tu futuro tiene/ }),
  ).toBeInViewport();
});
