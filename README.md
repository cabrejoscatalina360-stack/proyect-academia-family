# Uniciencia · Reapertura y verano 2027

Web de la academia Uniciencia para presentar la reapertura, el ciclo preuniversitario y las vacaciones útiles de primaria y secundaria. Incluye filtros de programas, información ampliada, afiches descargables, preguntas frecuentes y consultas por WhatsApp.

## Abrir la web sin instalar nada

La entrega `deliverables/uniciencia-web-interactiva.zip` contiene `uniciencia.html` e instrucciones. Extrae el ZIP y abre el HTML en Chrome, Edge, Firefox o Safari actualizado. El archivo incluye imágenes, tipografías, estilos y JavaScript; puedes recorrer sus secciones y usar el formulario sin ejecutar un servidor. WhatsApp y Google Maps necesitan Internet.

Si el visor del chat muestra código o no ejecuta los botones, descarga el ZIP y abre el archivo desde tu equipo. Una captura de pantalla no permite usar los controles. El servidor de desarrollo del entorno tampoco es accesible desde otro equipo sin la vista previa de la plataforma.

Para regenerar esta entrega desde el código (requiere Python 3 para el ZIP):

```sh
npm run build:standalone
```

## Funciones disponibles

- Navegación por secciones, acceso a Matrículas y menú móvil con control de foco.
- Filtros con recuento de programas; detalles, afiches y recordatorios de inicio en formato `.ics`.
- Formulario con validación de nombre, celular, programa, grado escolar y consentimiento.
- Resumen del mensaje antes de abrir WhatsApp, copia alternativa, edición y nueva consulta. Los datos se conservan solo en la memoria de la pestaña mientras editas.
- Visor de afiches con anterior/siguiente, zoom y descargas con nombres de archivo.
- Preguntas frecuentes con búsqueda que reconoce tildes y estados sin resultados.
- Copia de teléfono y dirección, enlace de llamada y búsqueda de ubicación.

## Desarrollo

### Publicación en GitHub Pages

`npm run deploy:pages` genera la web autónoma y publica únicamente los archivos públicos en la rama `gh-pages` del remoto `origin`, sin sobrescribir el código fuente ni forzar historial. Necesita permiso de escritura en el repositorio.

La primera vez, en **Settings → Pages**, selecciona **Deploy from a branch → gh-pages → / (root) → Save**. La URL del proyecto es `https://cabrejoscatalina360-stack.github.io/proyect-academia-family/`; estará disponible cuando GitHub confirme el despliegue. Publicar la rama no equivale a comprobar que Pages está activado.

El archivo HTML autónomo permite servir la web bajo la ruta del repositorio sin rutas de imágenes rotas. La rama incluye también `uniciencia-web-interactiva.zip` para descargar desde GitHub.

Requisitos: Node.js 24 LTS (o una versión compatible de Node.js desde 22.12) y npm.

Desde la carpeta del repositorio:

```sh
npm ci
npm start
```

Vite muestra en la terminal el puerto del servidor. Para generar y comprobar la versión de producción:

```sh
npm run build
npm run preview
```

El resultado estático se genera en `dist/`. Puede desplegarse en un alojamiento de sitios estáticos. Los recursos usan rutas desde la raíz; para alojar la web en un subdirectorio se deben adaptar esas rutas y la configuración de Vite.

Para ejecutar las pruebas de datos y enlaces de WhatsApp:

```sh
npm test
```

Las pruebas de navegador verifican escritorio y móvil, filtros, formulario, descarga de afiches, navegación con teclado y accesibilidad automática:

```sh
# Solo si no tienes Chromium del sistema ni el navegador de Playwright:
npx playwright install chromium
npm run test:e2e
```

Para comprobar también el HTML autónomo, sin permitir cargas externas:

```sh
npm run test:standalone
```

La política de Chromium de este entorno bloquea navegar a `file://`. La comprobación autónoma inyecta el mismo HTML generado en el navegador y bloquea toda la red; verifica interacciones, imágenes, descarga y consulta en anchos de escritorio y móvil. La apertura directa desde disco se realiza en el navegador del usuario.

Estas pruebas generan y sirven la versión de producción automáticamente. Se puede seleccionar un Chromium instalado con `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Estructura y edición

| Archivo o carpeta | Contenido |
| --- | --- |
| `index.html` | Idioma, título, descripción y metadatos para compartir. |
| `src/data.js` | Datos de contacto, programas, fechas y construcción de los enlaces de WhatsApp. |
| `src/inquiry.js` | Validación de consultas, teléfonos y grados por programa. |
| `src/main.js` | Secciones de la página, promoción, preguntas frecuentes, diálogos y comportamiento del formulario. |
| `src/style.css` | Colores, tipografía, componentes y adaptación a móviles. |
| `public/images/` | Afiches originales extraídos de la presentación proporcionada. |
| `public/favicon.svg` | Icono de la pestaña del navegador. |
| `tests/data.test.js` | Pruebas de destino, programas y codificación de WhatsApp. |
| `tests/site.spec.js` | Pruebas funcionales y de accesibilidad en escritorio y móvil. |
| `tests/features.spec.js` | Pruebas de búsqueda, grados, resumen, galería y herramientas nuevas. |
| `scripts/build-standalone.mjs` | Generador del HTML autocontenido y ZIP descargable. |

Los colores principales se definen con variables CSS como `--navy`, `--coral` y `--cream`. Al modificarlos, comprueba el contraste de botones y textos, además de sus estados de foco y selección.

Para actualizar una campaña, revisa las fechas de `src/data.js` y las referencias al año, promoción y preguntas frecuentes de `src/main.js`, junto con los metadatos de `index.html`. El teléfono visible, los enlaces `tel:` y el texto de privacidad también deben permanecer sincronizados con el número de WhatsApp configurado.

El emblema y las ilustraciones se muestran mediante recortes CSS de los afiches originales. Si se sustituyen las imágenes, ajusta también las posiciones de `.brand-emblem`, `.student-illustration` y `.kids-illustration` en `src/style.css` para conservar un encuadre correcto.

## Contenido y consultas

Las fechas, dirección, teléfono y promoción se tomaron de la presentación: inicio del ciclo preuniversitario el 4 de enero de 2027 e inicio de vacaciones útiles el 11 de enero de 2027. La promoción exime del derecho de matrícula a quienes se matriculen en noviembre o diciembre de 2026; el costo del programa se consulta con la academia.

Los textos de **misión y visión son propuestas editables** para revisión de Uniciencia. No estaban desarrollados en la presentación. Revisa también el contenido institucional antes de publicar.

El formulario prepara un mensaje con los datos introducidos y ofrece abrirlo en WhatsApp. El usuario decide enviarlo desde ese servicio. La web funciona sin backend: no almacena las consultas en una base de datos, no cobra pagos y no confirma una matrícula ni una vacante. Para registrar solicitudes directamente será necesario incorporar un servicio de recepción y revisar el aviso de privacidad.

Las tipografías y los afiches se sirven desde el propio sitio. WhatsApp y Google Maps se abren como servicios externos al usar sus enlaces.
