// build.js
// Script de "build" hecho con Node puro, sin librerias ni frameworks.
// Lee los componentes desde la carpeta /src, los combina y genera la
// carpeta /dist lista para subir a cualquier hosting (despliegue).

const fs = require('fs');
const path = require('path');

// Carpetas principales del proyecto
const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const COMPONENTES = path.join(SRC, 'components');

// Lee un archivo si existe; si no existe devuelve texto vacio
function leerSiExiste(ruta) {
  return fs.existsSync(ruta) ? fs.readFileSync(ruta, 'utf8') : '';
}

// 1. Dejar la carpeta dist limpia y crear las subcarpetas de salida
function prepararDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(DIST, 'css'), { recursive: true });
  fs.mkdirSync(path.join(DIST, 'js'), { recursive: true });
}

// 2. Leer todos los componentes.
//    Cada componente es una carpeta con sus tres archivos: html, css y js.
function leerComponentes() {
  const componentes = {};
  if (!fs.existsSync(COMPONENTES)) return componentes;

  for (const nombre of fs.readdirSync(COMPONENTES)) {
    const carpeta = path.join(COMPONENTES, nombre);
    if (!fs.statSync(carpeta).isDirectory()) continue;

    componentes[nombre] = {
      html: leerSiExiste(path.join(carpeta, nombre + '.html')),
      css: leerSiExiste(path.join(carpeta, nombre + '.css')),
      js: leerSiExiste(path.join(carpeta, nombre + '.js')),
    };
  }

  return componentes;
}

// 3. Armar el HTML final.
//    Busca los marcadores <!-- include: nombre --> en index.html y los
//    reemplaza por el HTML del componente correspondiente.
function construirHtml(componentes) {
  const html = leerSiExiste(path.join(SRC, 'index.html'));

  return html.replace(/<!--\s*include:\s*([\w-]+)\s*-->/g, function (_, nombre) {
    if (!componentes[nombre]) {
      console.warn('Aviso: no existe el componente "' + nombre + '"');
      return '';
    }
    return componentes[nombre].html.trim();
  });
}

// 4. Unir todo el CSS en un solo archivo (primero el global, luego cada componente)
function construirCss(componentes) {
  let css = leerSiExiste(path.join(SRC, 'global.css'));

  for (const nombre in componentes) {
    if (componentes[nombre].css) {
      css += '\n\n/* ===== ' + nombre + ' ===== */\n' + componentes[nombre].css.trim();
    }
  }

  return css;
}

// 5. Unir todo el JS en un solo archivo.
//    Cada componente se envuelve en una funcion anonima para aislar su scope:
//    asi las variables de un componente no chocan con las de otro.
function construirJs(componentes) {
  let js = '';

  for (const nombre in componentes) {
    if (componentes[nombre].js) {
      js += '\n\n// ===== ' + nombre + ' =====\n';
      js += '(function () {\n' + componentes[nombre].js.trim() + '\n})();';
    }
  }

  // El codigo global se ejecuta al final, despues de todos los componentes
  const main = leerSiExiste(path.join(SRC, 'main.js'));
  if (main) {
    js += '\n\n// ===== main =====\n' + main.trim();
  }

  return js;
}

// 6. Copiar la carpeta de recursos (imagenes, iconos, etc.) tal cual a /dist
function copiarAssets() {
  const origen = path.join(SRC, 'assets');
  if (fs.existsSync(origen)) {
    fs.cpSync(origen, path.join(DIST, 'assets'), { recursive: true });
  }
}

// 7. Ejecutar todo el proceso de build
function build() {
  console.log('Iniciando build...');

  prepararDist();
  const componentes = leerComponentes();

  fs.writeFileSync(path.join(DIST, 'index.html'), construirHtml(componentes));
  fs.writeFileSync(path.join(DIST, 'css', 'styles.css'), construirCss(componentes));
  fs.writeFileSync(path.join(DIST, 'js', 'app.js'), construirJs(componentes));
  copiarAssets();

  const total = Object.keys(componentes).length;
  console.log('Listo. ' + total + ' componentes compilados en la carpeta /dist');
}

build();
