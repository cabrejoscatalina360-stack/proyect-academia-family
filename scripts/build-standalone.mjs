#!/usr/bin/env node
/**
 * Package the Vite production build as a single file that works with file://.
 * Run `npm run build` first. No remote requests are needed to load the page.
 */
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import { spawnSync } from "node:child_process";

const repository = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const buildDirectory = path.join(repository, "dist");
const outputDirectory = path.join(repository, "deliverables");
const outputFile = path.join(outputDirectory, "uniciencia.html");
const mediaTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".avif": "image/avif",
};

async function filesWithin(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map(async (entry) => {
      const filename = path.join(directory, entry.name);
      return entry.isDirectory() ? filesWithin(filename) : [filename];
    }),
  );
  return groups.flat();
}

function buildFile(reference) {
  const filename = path.resolve(buildDirectory, reference.replace(/^\//, ""));
  if (!filename.startsWith(buildDirectory + path.sep)) {
    throw new Error(`Asset is outside dist: ${reference}`);
  }
  return filename;
}

let html;
try {
  html = await readFile(path.join(buildDirectory, "index.html"), "utf8");
} catch (error) {
  throw new Error(
    "No se encontró dist/index.html. Ejecuta npm run build antes de generar el HTML autónomo.",
    { cause: error },
  );
}

const embeddedMedia = new Map();
for (const filename of await filesWithin(buildDirectory)) {
  const type = mediaTypes[path.extname(filename).toLowerCase()];
  if (!type) continue;
  const relative = path
    .relative(buildDirectory, filename)
    .split(path.sep)
    .join("/");
  const contents = await readFile(filename);
  embeddedMedia.set(
    `/${relative}`,
    `data:${type};base64,${contents.toString("base64")}`,
  );
}

function embedMedia(source) {
  // Replace exact build paths instead of parsing JavaScript, so template strings,
  // regular expressions, apostrophes and Unicode content remain untouched.
  for (const [reference, dataUri] of embeddedMedia) {
    source = source.replaceAll(reference, dataUri);
  }
  return source;
}

const scripts = [
  ...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*<\/script>/gi),
];
if (scripts.length !== 1) {
  throw new Error(
    `Se esperaba un único bundle de JavaScript; se encontraron ${scripts.length}. Revisa la configuración del build.`,
  );
}
for (const [tag, reference] of scripts) {
  let javascript = embedMedia(await readFile(buildFile(reference), "utf8"));
  // Validate that the bundle has no remaining module imports or exports before
  // turning it into a classic script, which also works when opened from disk.
  new Script(javascript, { filename: reference });
  // HTML parsers recognize closing script tags even inside JavaScript strings.
  javascript = javascript.replace(/<\/script/gi, "<\\/script");
  html = html.replace(tag, "");
  html = html.replace(
    "</body>",
    `<script>\n(() => { "use strict";\n${javascript}\n})();\n</script>\n</body>`,
  );
}

const stylesheets = [
  ...html.matchAll(
    /<link\b(?=[^>]*\brel="stylesheet")[^>]*\bhref="([^"]+)"[^>]*>/gi,
  ),
];
for (const [tag, reference] of stylesheets) {
  const css = embedMedia(await readFile(buildFile(reference), "utf8"));
  html = html.replace(
    tag,
    `<style>\n${css.replace(/<\/style/gi, "<\\/style")}\n</style>`,
  );
}
html = html.replace(/<link\b(?=[^>]*\brel="modulepreload")[^>]*>/gi, "");
html = embedMedia(html);
html = html.replace(
  "<!doctype html>",
  "<!doctype html>\n<!-- Uniciencia: versión autónoma. Guarda este archivo y ábrelo en tu navegador. -->",
);

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, html, "utf8");
await writeFile(
  path.join(outputDirectory, "INSTRUCCIONES.txt"),
  `UNICIENCIA — WEB INTERACTIVA\n\n1. Extrae el ZIP en una carpeta de tu equipo.\n2. Abre uniciencia.html con Chrome, Edge, Firefox o Safari actualizado.\n3. Recorre las secciones del menú. Puedes filtrar programas, ampliar y descargar afiches y preparar una consulta de matrícula.\n\nNo necesitas instalar Node.js ni ejecutar un servidor. Las imágenes, fuentes, estilos y funciones están dentro del archivo HTML. Si una vista previa de archivos muestra solo el código o bloquea botones, descarga el archivo y ábrelo desde tu navegador.\n\nEl formulario no guarda tus datos en esta web ni confirma una matrícula. Solo prepara un mensaje; tú decides enviarlo por WhatsApp. WhatsApp y Google Maps requieren conexión a Internet. No incluyas datos sensibles.\n\nEste archivo no publica la web en Internet ni modifica la configuración del entorno.\n`,
  "utf8",
);
const archive = spawnSync(
  "python3",
  [
    "-c",
    `import pathlib, sys, zipfile
directory = pathlib.Path(sys.argv[1])
with zipfile.ZipFile(directory / 'uniciencia-web-interactiva.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for filename in ['uniciencia.html', 'INSTRUCCIONES.txt']:
        z.write(directory / filename, filename)
`,
    outputDirectory,
  ],
  { encoding: "utf8" },
);
if (archive.error || archive.status !== 0) {
  throw new Error(
    `El HTML se generó, pero no se pudo crear el ZIP con Python 3: ${archive.error?.message || archive.stderr}`,
  );
}
console.log(`HTML autónomo generado: ${outputFile}`);
console.log(
  `ZIP interactivo generado: ${path.join(outputDirectory, "uniciencia-web-interactiva.zip")}`,
);
console.log(
  `${embeddedMedia.size} recursos locales incorporados; ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB.`,
);
console.log(
  "Puede abrirse con doble clic. WhatsApp y Google Maps requieren conexión a Internet.",
);
