

// ===== despacho =====
(function () {
const ventasPendientes =
  JSON.parse(
    localStorage.getItem('ventasPendientes')
  ) || '[]';

function cargarDespachos() {

  const contenedor =
    document.getElementById('despacho');

  if (!contenedor) return;

  contenedor.innerHTML = ''; 

  ventasPendientes.forEach(
    (producto, index) => {

      contenedor.innerHTML += `
        <div class="item">
          <h3>${producto.nombre}</h3>
          <p>Cantidad: ${producto.cantidad}</p>
          <p>Precio: $${producto.valo}</p>

          <button onclick="despachar(${index})">
            Despachar
          </button>
        </div>
      `;

    }
  );

}

window.despachar = function(index) {

  ventasPendientes.splice(index, 1);

  localStorage.setItem(
    'ventasPendientes',
    JSON.stringify(ventasPendientes)
  );

  cargarDespachos();

};

window.despachar = async function(index) {

  const producto = ventasPendientes[index];

  await fetch(
    'http://localhost:3000/api/despachar',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    }
  );

  ventasPendientes.splice(index, 1);

  localStorage.setItem(
    'ventasPendientes',
    JSON.stringify(ventasPendientes)
  );

  cargarDespachos();
};

cargarDespachos ()
})();

// ===== login =====
(function () {
const modal =
  document.getElementById('loginModal');

document
  .getElementById('abrirLogin')
  .addEventListener('click', () => {

    modal.style.display = 'block';

  });

document
  .getElementById('cerrarLogin')
  .addEventListener('click', () => {

    modal.style.display = 'none';

  });

document
  .getElementById('btnRegistro')
  .addEventListener('click', async () => {

    try {

      const usuario =
        document.getElementById(
          'usuarioRegistro'
        ).value;

      const password =
        document.getElementById(
          'passwordRegistro'
        ).value;

      const respuesta =
        await fetch(
          'http://localhost:3000/api/registro',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              usuario,
              password
            })
          }
        );

      const datos =
        await respuesta.json();

      document.getElementById(
        'mensajeLogin'
      ).textContent =
        datos.mensaje;

    } catch (error) {

      console.error(error);

      document.getElementById(
        'mensajeLogin'
      ).textContent =
        'Error conectando al servidor';

    }

  });
  // inicion

document
  .getElementById('btnLogin')
  .addEventListener('click', async () => {

    try {

      const usuario =
        document.getElementById(
          'usuarioLogin'
        ).value;

      const password =
        document.getElementById(
          'passwordLogin'
        ).value;

      const respuesta =
        await fetch(
          'http://localhost:3000/api/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              usuario,
              password
            })
          }
        );

      const datos =
        await respuesta.json();

      console.log(
        'Respuesta login:',
        datos
      );

      if (datos.token) {

        localStorage.setItem(
          'token',
          datos.token
        );

        document.getElementById(
          'mensajeLogin'
        ).textContent =
          'Sesión iniciada correctamente';

        alert(
          'Sesión iniciada'
        );

        modal.style.display =
          'none';

      } else {

        document.getElementById(
          'mensajeLogin'
        ).textContent =
          datos.mensaje ||
          'Usuario o contraseña incorrectos';

      }

    } catch (error) {

      console.error(
        'Error login:',
        error
      );

      document.getElementById(
        'mensajeLogin'
      ).textContent =
        'No se pudo conectar al servidor';

    }

  });
})();

// ===== modal =====
(function () {
(function () {

let productoActual = null;

function abrirProducto(nombre) {

  const producto =
    procdutos.find(
      p => p.nombre === nombre
    );

  if (!producto) return;

  productoActual = nombre;

  document.getElementById('modalImagen').src =
    producto.imagen || '';

  document.getElementById('modalNombre').textContent =
    producto.nombre;

  document.getElementById('modalPrecio').textContent =
    'Precio: $' + producto.valo;

  document.getElementById('modalDescripcion').textContent =
    producto.descripcion || '';

  document.getElementById('modalProducto').style.display =
    'block';
}

function cerrarProducto() {

  document.getElementById('modalProducto').style.display =
    'none';

}

function agregarDesdeModal() {

  if (!productoActual) return;

  mostrarnombre(productoActual);

  cerrarProducto();

}

window.abrirProducto = abrirProducto;
window.cerrarProducto = cerrarProducto;
window.agregarDesdeModal = agregarDesdeModal;

document.addEventListener('DOMContentLoaded', () => {

  const cerrarBtn =
    document.getElementById('cerrarProducto');

  if (cerrarBtn) {

    cerrarBtn.addEventListener(
      'click',
      cerrarProducto
    );

  }

});

})();
})();

// ===== main =====
// import { login } from '../componentes/login.js';

let procdutos = [];

let contadodeproductos = [];
let comprados = [];


// let procdutos = [];

async function cargarProductos() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/productos');
    procdutos = await respuesta.json();
    todoprocductos();
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

function todoprocductos() {
  procdutos.forEach(productos => {
    let espacio = document.querySelector(`.${productos.nombre}`);
    if (espacio) {
      espacio.innerHTML = `
        <div style="padding:5px; font-size:13px; color:#222;">
          Nombre: ${productos.nombre}<br>
          Valor: $${productos.valo}<br>
          Cantidad: ${productos.catida}
        </div>
      `;
    }
  });
}

cargarProductos(); // ¡Esto es necesario para que se ejecute!

// Agregar producto al carrito
function mostrarnombre(nombreproducto) {

  let productoSeleccionado =
    procdutos.find(
      productos => productos.nombre === nombreproducto
    );

  if (!productoSeleccionado) return;

  let existe =
    contadodeproductos.find(
      p => p.nombre === nombreproducto
    );

  if (existe) {

    existe.cantidad++;

  } else {

    contadodeproductos.push({
      ...productoSeleccionado,
      cantidad: 1
    });

  }

  actualizarCarrito();

}



// Dibujar carrito
function actualizarCarrito() {

  let asidecarrito =
    document.getElementById('carrito');

  asidecarrito.innerHTML = '';

  contadodeproductos.forEach(producto => {

    asidecarrito.innerHTML += `
      <div style="margin-bottom:10px;">

        <p>
          <strong>${producto.nombre}</strong>
        </p>

        <p>
          Precio: $${producto.valo}
        </p>

        <button
          onclick="restarCantidad('${producto.nombre}')"
        >
          -
        </button>

        <span style="margin:0 10px;">
          ${producto.cantidad}
        </span>

        <button
          onclick="sumarCantidad('${producto.nombre}')"
        >
          +
        </button>

        <button
          onclick="eliminarProducto('${producto.nombre}')"
        >
          🗑
        </button>

        <hr>

      </div>
    `;

  });

  sumadeprocductos();

}

// Aumentar cantidad
function sumarCantidad(nombre) {

  let producto =
    contadodeproductos.find(
      p => p.nombre === nombre
    );

  if (producto) {

    producto.cantidad++;

    actualizarCarrito();

  }

}

// Disminuir cantidad
function restarCantidad(nombre) {

  let producto =
    contadodeproductos.find(
      p => p.nombre === nombre
    );

  if (!producto) return;

  producto.cantidad--;

  if (producto.cantidad <= 0) {

    eliminarProducto(nombre);

  } else {

    actualizarCarrito();

  }

}

// Eliminar producto
function eliminarProducto(nombre) {

  contadodeproductos =
    contadodeproductos.filter(
      p => p.nombre !== nombre
    );

  actualizarCarrito();

}

// Calcular total
function sumadeprocductos() {

  let total = 0;

  contadodeproductos.forEach(producto => {

    total +=
      producto.valo *
      producto.cantidad;

  });

  let sumaBtn =
    document.getElementById('suma');

  if (sumaBtn) {

    sumaBtn.textContent =
      `Total: $${total}`;

  }

}

// Temas
function cofigurarTema(tema) {

  document.documentElement.setAttribute(
    'data-theme',
    tema
  );

  localStorage.setItem(
    'data-theme',
    tema
  );

}

// Volver arriba
function volverarriba() {

  window.scroll({
    top: 0,
    behavior: 'smooth'
  });

}

// Comprar
function comprarTodo() {

  const token =
    localStorage.getItem('token');

  if (!token) {

    alert(
      'Debes iniciar sesión para comprar'
    );

    return;

  }

  comprados =
    comprados.concat(
      contadodeproductos
    );

  localStorage.setItem(
    'ventasPendientes',
    JSON.stringify(
      contadodeproductos
    )
  );

  contadodeproductos = [];

  actualizarCarrito();

  alert(
    'Compra realizada correctamente'
  );

  console.log(
    'Productos comprados:',
    comprados
  );

  // window.location.href =
  //   'despacho.html';

}
// Buscar productos
function busqueda() {

  let input =
    document.getElementById('input');

  let filtro =
    input.value.toLowerCase();

  let items =
    document.querySelectorAll('#galeria .item');

  items.forEach(item => {

    let titulo =
      item.querySelector('h3')
          .textContent
          .toLowerCase();

    if (titulo.includes(filtro)) {

      item.style.display = '';

    } else {

      item.style.display = 'none';

    }

  });

}

// Inicio
window.onload = function () {

  cargarProductos();

  sumadeprocductos();

  let busquedapornombre =
    document.getElementById(
      'input'
    );

  if (busquedapornombre) {

    busquedapornombre.addEventListener(
      'input',
      busqueda
    );

  }

};