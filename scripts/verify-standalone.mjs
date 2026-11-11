import { chromium, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const html = await readFile(
  new URL("../deliverables/uniciencia.html", import.meta.url),
  "utf8",
);
const systemBrowser = "/usr/bin/chromium";
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync(systemBrowser) ? systemBrowser : undefined),
});
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    const requests = [],
      errors = [];
    await context.route("**/*", (route) => {
      requests.push(route.request().url());
      return route.abort();
    });
    page.on("pageerror", (error) => errors.push(error.message));
    // The managed Chromium policy blocks file:// navigation. Inject the exact
    // generated document, with ALL external requests blocked, to validate it.
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Volvemos",
    );
    await page.getByRole("button", { name: "Escolar", exact: true }).click();
    await expect(page.locator(".program-card:visible")).toHaveCount(2);
    await page.locator('[data-program="primaria"]').click();
    await expect(page.locator("#program-detail")).toContainText(
      "11 de enero de 2027",
    );
    await page.getByRole("button", { name: "Ver afiche", exact: true }).click();
    await expect(page.locator("#poster-image")).toHaveAttribute(
      "src",
      /^data:image\/png;base64,/,
    );
    const downloadPromise = page.waitForEvent("download");
    await page
      .getByRole("link", { name: "Descargar afiche", exact: true })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("vacaciones-utiles-2027.png");
    expect(await download.failure()).toBeNull();
    await page.keyboard.press("Escape");
    await expect(page.locator("#program-dialog")).toBeVisible();
    await page
      .getByRole("button", { name: "Me interesa este programa" })
      .click();
    await page.getByLabel("Tu nombre").fill("Ana Pérez");
    await page.getByLabel("Celular de contacto").fill("999 888 777");
    await page.getByLabel("Grado de interés").selectOption("2");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Preparar mi consulta" }).click();
    await expect(page.locator("#prepared-message")).toHaveValue(
      /2.º grado de primaria/,
    );
    const whatsapp = new URL(
      await page.locator("#send-whatsapp").getAttribute("href"),
    );
    expect(whatsapp.hostname).toBe("wa.me");
    expect(whatsapp.searchParams.get("text")).toContain("Ana Pérez");
    expect(requests).toEqual([]);
    expect(errors).toEqual([]);
    console.log(
      `HTML autónomo ${width}px: interfaz, afiches, descarga y formulario correctos. Sin cargas externas ni errores JS.`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
