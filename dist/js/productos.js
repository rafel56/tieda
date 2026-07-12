async function cargarListaProductos() {

  const contenedor = document.getElementById('lista-productos');

  if (!contenedor) return;

  const respuesta = await fetch('http://localhost:3000/api/productos');

  procdutos = await respuesta.json();

  contenedor.innerHTML = procdutos.map(producto => {

    const imagen = `./assets/${producto.nombre}.jpeg`;

    return `
      <div class="item">

        <img
          src="${imagen}"
          alt="${producto.nombre}"
          onclick="abrirProducto('${producto.nombre}')"
          onerror="this.onerror=null;this.src='./assets/sin-imagen.png';"
        >

        <h3>${producto.nombre}</h3>

        <p>Cantidad: ${producto.catida}</p>

        <p>Precio: $${producto.valo}</p>

        <p>${producto.descripcion || ''}</p>

        <button onclick="mostrarnombre('${producto.nombre}')">
          Agregar al carrito
        </button>

      </div>
    `;

  }).join('');

}


// ============================
// Registro de nuevo producto
// ============================

(function () {

  const form = document.getElementById('form-producto');

  if (!form) return;

  const mensajeEstado = document.getElementById('mensaje-estado');
  const btnGuardar = document.getElementById('btn-guardar');

  function limpiarErrores() {

    document.querySelectorAll('.error-campo').forEach(el => {
      el.textContent = '';
    });

    mensajeEstado.textContent = '';
    mensajeEstado.className = 'mensaje-estado';

  }

  function mostrarError(idCampo, texto) {

    const el = document.getElementById('error-' + idCampo);

    if (el) {
      el.textContent = texto;
    }

  }

  function validar(datos) {

    let valido = true;

    if (!datos.nombre.trim()) {
      mostrarError('nombre', 'El nombre es obligatorio.');
      valido = false;
    }

    if (isNaN(datos.valo) || datos.valo < 0) {
      mostrarError('valor', 'Ingresa un valor válido.');
      valido = false;
    }

    if (isNaN(datos.catida) || datos.catida < 0) {
      mostrarError('cantidad', 'Ingresa una cantidad válida.');
      valido = false;
    }

    return valido;

  }

  form.addEventListener('submit', async function (evento) {

    evento.preventDefault();

    limpiarErrores();

    const datos = {

      nombre: document.getElementById('nombre').value,

      valo: parseFloat(document.getElementById('valor').value),

      catida: parseInt(document.getElementById('cantidad').value, 10),

      descripcion: document.getElementById('descripcion').value

    };

    if (!validar(datos)) return;

    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    try {

      const respuesta = await fetch(
        'http://localhost:3000/api/productos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: datos.nombre.trim(),
            valo: datos.valo,
            catida: datos.catida,
            descripcion: datos.descripcion.trim()
          })
        }
      );

      if (!respuesta.ok) {

        const error = await respuesta.json().catch(() => ({}));

        throw new Error(error.error || 'Error del servidor');

      }

      const productoGuardado = await respuesta.json();

      mensajeEstado.textContent = 'Producto guardado correctamente.';
      mensajeEstado.classList.add('exito');

      form.reset();

// Volver a cargar la lista completa sin duplicados
await cargarListaProductos();

    } catch (error) {

      console.error(error);

      mensajeEstado.textContent = 'No se pudo guardar el producto.';

      mensajeEstado.classList.add('error');

    } finally {

      btnGuardar.disabled = false;

      btnGuardar.textContent = 'Guardar producto';

    }

  });

})();