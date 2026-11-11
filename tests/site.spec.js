import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("la página carga sus imágenes y se adapta sin desbordamiento", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await expect(page).toHaveTitle(/Uniciencia.*2027/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Volvemos",
  );
  for (const image of await page.locator(".resource-image img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
      .toBeTruthy();
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test("los filtros muestran únicamente los programas elegidos", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Escolar", exact: true }).click();
  await expect(page.locator(".program-card:visible")).toHaveCount(2);
  await expect(page.locator(".program-card:visible").first()).toContainText(
    "Primaria",
  );
  await page
    .getByRole("button", { name: "Preuniversitario", exact: true })
    .click();
  await expect(page.locator(".program-card:visible")).toHaveCount(1);
  await expect(page.locator(".program-card:visible")).toContainText(
    "04 de enero",
  );
  await page.getByRole("button", { name: /Todos los programas/ }).click();
  await expect(page.locator(".program-card:visible")).toHaveCount(3);
});

test("la consulta valida datos y prepara el WhatsApp del programa elegido", async ({
  page,
}) => {
  await page.locator('[data-program="primaria"]').click();
  await expect(
    page.getByRole("dialog", { name: "Vacaciones útiles" }),
  ).toBeVisible();
  await expect(page.locator("#program-detail")).toContainText(
    "11 de enero de 2027",
  );
  await page.getByRole("button", { name: "Me interesa este programa" }).click();
  await expect(page.locator("#program")).toHaveValue("primaria");
  await page.getByLabel("Tu nombre").fill("Ana Pérez");
  await page.getByLabel("Celular de contacto").fill("abcdefg");
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(page.locator("#phone")).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Celular de contacto").fill("999 888 777");
  await page.getByLabel("Grado de interés").selectOption("3");
  await page
    .getByLabel("¿En qué podemos ayudarte?")
    .fill("¿Cuál es el horario?");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(
    page.getByRole("heading", { name: "Tu mensaje está listo." }),
  ).toBeVisible();
  const link = new URL(
    await page
      .getByRole("link", { name: /Enviar consulta por WhatsApp/ })
      .getAttribute("href"),
  );
  expect(link.hostname).toBe("wa.me");
  expect(link.pathname).toBe("/51947376012");
  expect(link.searchParams.get("text")).toContain("Ana Pérez");
  expect(link.searchParams.get("text")).toContain("Primaria");
  expect(link.searchParams.get("text")).toContain("¿Cuál es el horario?");
  await page.getByRole("button", { name: "Editar mi consulta" }).click();
  await expect(page.getByLabel("Tu nombre")).toHaveValue("Ana Pérez");
  await page.keyboard.press("Escape");
  await expect(page.locator("#enroll-dialog")).not.toBeVisible();
});

test("las pestañas funcionan con teclado y las preguntas muestran sus respuestas", async ({
  page,
}) => {
  const vision = page.getByRole("tab", { name: "Nuestra visión" });
  await vision.click();
  await expect(page.locator("#vision-panel")).toBeVisible();
  await expect(vision).toHaveAttribute("aria-selected", "true");
  await vision.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Nuestra misión" })).toBeFocused();
  await expect(page.locator("#mission-panel")).toBeVisible();
  await page.getByText("¿Cuándo empiezan las clases?", { exact: true }).click();
  await expect(page.locator("details[open]")).toContainText("4 de enero");
  await expect(page.locator("details[open]")).toContainText("11 de enero");
});

test("los afiches pueden ampliarse y descargarse", async ({ page }) => {
  await page
    .getByRole("button", { name: "Ampliar afiche de Ciclo verano 2027" })
    .click();
  await expect(page.locator("#poster-dialog")).toBeVisible();
  await expect(page.locator("#poster-image")).toHaveAttribute(
    "src",
    "/images/ciclo-verano-2027.png",
  );
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Descargar afiche", exact: true })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("ciclo-verano-2027.png");
  expect(await download.failure()).toBeNull();
  await page.keyboard.press("Escape");
  await expect(page.locator("#poster-dialog")).not.toBeVisible();
});

test("navegación móvil y privacidad conservan estados correctos", async ({
  page,
  isMobile,
}) => {
  if (isMobile) {
    const menu = page.locator(".menu-toggle");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await page
      .locator("#main-nav")
      .getByRole("link", { name: "Quiénes somos" })
      .click();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#main-nav")).not.toBeVisible();
  } else {
    await expect(page.locator("#main-nav")).toBeVisible();
  }
  await page.getByRole("button", { name: "Quiero ser parte" }).click();
  await page
    .getByRole("button", { name: "Ver privacidad", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Privacidad de tu consulta" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#enroll-dialog")).toBeVisible();
  await expect(page.locator("body")).toHaveClass(/modal-open/);
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(page.locator("body")).not.toHaveClass(/modal-open/);
});

test("no hay errores automáticos de accesibilidad en página y formulario", async ({
  page,
}) => {
  await page.evaluate(() => document.fonts.ready);
  const scan = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
  expect((await scan()).violations).toEqual([]);
  await page.getByRole("button", { name: "Quiero ser parte" }).click();
  expect((await scan()).violations).toEqual([]);
});
