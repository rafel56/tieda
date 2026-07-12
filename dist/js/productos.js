async function cargarListaProductos() {

  const contenedor = document.getElementById('lista-productos');

  if (!contenedor) return;

  contenedor.innerHTML = '';

  const respuesta = await fetch('http://localhost:3000/api/productos');

  const productos = await respuesta.json();

  // Guardar los productos en el arreglo principal
  procdutos = productos;

  productos.forEach(producto => {
    agregarTarjetaProducto(producto);
  });

}

function agregarTarjetaProducto(producto) {

  const contenedor = document.getElementById('lista-productos');

  if (!contenedor) return;

  // Si el producto es nuevo, lo agrega al arreglo
  if (!procdutos.find(p => p.nombre === producto.nombre)) {
    procdutos.push(producto);
  }

  contenedor.innerHTML += `
    <div class="item">
      <h3>${producto.nombre}</h3>

      <p>Cantidad: ${producto.catida}</p>

      <p>Precio: $${producto.valo}</p>

      <p>${producto.descripcion || ''}</p>

      <button onclick="mostrarnombre('${producto.nombre}')">
        Agregar al carrito
      </button>
    </div>
  `;

}

if (document.getElementById('lista-productos')) {
  cargarListaProductos();
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

      // Mostrar el nuevo producto inmediatamente
      agregarTarjetaProducto(productoGuardado);

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