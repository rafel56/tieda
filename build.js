// build.js

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const COMPONENTES = path.join(SRC, 'components');

function leerSiExiste(ruta) {
  return fs.existsSync(ruta)
    ? fs.readFileSync(ruta, 'utf8')
    : '';
}

function prepararDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, {
      recursive: true,
      force: true
    });
  }

  fs.mkdirSync(path.join(DIST, 'css'), {
    recursive: true
  });

  fs.mkdirSync(path.join(DIST, 'js'), {
    recursive: true
  });
}

function leerComponentes() {
  const componentes = {};

  if (!fs.existsSync(COMPONENTES)) {
    return componentes;
  }

  for (const nombre of fs.readdirSync(COMPONENTES)) {
    const carpeta = path.join(
      COMPONENTES,
      nombre
    );

    if (!fs.statSync(carpeta).isDirectory()) {
      continue;
    }

    componentes[nombre] = {
      html: leerSiExiste(
        path.join(
          carpeta,
          `${nombre}.html`
        )
      ),
      css: leerSiExiste(
        path.join(
          carpeta,
          `${nombre}.css`
        )
      ),
      js: leerSiExiste(
        path.join(
          carpeta,
          `${nombre}.js`
        )
      )
    };
  }

  return componentes;
}

function construirHtml(componentes) {
  const html = leerSiExiste(
    path.join(SRC, 'index.html')
  );

  return html.replace(
    /<!--\s*include:\s*([\w-]+)\s*-->/g,
    (_, nombre) => {
      if (!componentes[nombre]) {
        console.warn(
          `Aviso: no existe el componente "${nombre}"`
        );
        return '';
      }

      return componentes[nombre].html.trim();
    }
  );
}

function construirCss(componentes) {
  let css = leerSiExiste(
    path.join(SRC, 'global.css')
  );

  for (const nombre in componentes) {
    if (componentes[nombre].css) {
      css +=
        `\n\n/* ===== ${nombre} ===== */\n` +
        componentes[nombre].css.trim();
    }
  }

  return css;
}

function construirJs(componentes) {
  let js = '';

  for (const nombre in componentes) {
    if (componentes[nombre].js) {
      js +=
        `\n\n// ===== ${nombre} =====\n`;

      js +=
        `(function () {\n${componentes[nombre].js.trim()}\n})();`;
    }
  }

  const main = leerSiExiste(
    path.join(SRC, 'main.js')
  );

  if (main) {
    js +=
      '\n\n// ===== main =====\n' +
      main.trim();
  }

  return js;
}

function copiarAssets() {
  const origen = path.join(
    SRC,
    'assets'
  );

  if (fs.existsSync(origen)) {
    fs.cpSync(
      origen,
      path.join(DIST, 'assets'),
      {
        recursive: true
      }
    );
  }
}

function copiarPaginasExtra() {

  const despachoHtml = path.join(
    COMPONENTES,
    'despacho',
    'despacho.html'
  );

  const despachoJs = path.join(
    COMPONENTES,
    'despacho',
    'despacho.js'
  );

  if (fs.existsSync(despachoHtml)) {
    fs.copyFileSync(
      despachoHtml,
      path.join(
        DIST,
        'despacho.html'
      )
    );
  }

  if (fs.existsSync(despachoJs)) {
    fs.copyFileSync(
      despachoJs,
      path.join(
        DIST,
        'js',
        'despacho.js'
      )
    );
  }
}

function build() {

  console.log(
    'Iniciando build...'
  );

  prepararDist();

  const componentes =
    leerComponentes();

  fs.writeFileSync(
    path.join(
      DIST,
      'index.html'
    ),
    construirHtml(
      componentes
    )
  );

  fs.writeFileSync(
    path.join(
      DIST,
      'css',
      'styles.css'
    ),
    construirCss(
      componentes
    )
  );

  fs.writeFileSync(
    path.join(
      DIST,
      'js',
      'app.js'
    ),
    construirJs(
      componentes
    )
  );

  copiarAssets();

  copiarPaginasExtra();

  console.log(
    `Listo. ${
      Object.keys(componentes).length
    } componentes compilados en la carpeta /dist`
  );
}

build();