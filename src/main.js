
// import { login } from '../componentes/login.js';

let procdutos = [];

let contadodeproductos = [];
let comprados = [];

async function cargarProductos() {

  try {

    const respuesta =
      await fetch(
        'http://localhost:3000/api/productos'
      );

    procdutos =
      await respuesta.json();

    todoprocductos();

  } catch (error) {

    console.error(
      'Error cargando productos:',
      error
    );

  }

}

// Mostrar productos
function todoprocductos() {

  procdutos.forEach(producto => {

    let espacio =
      document.querySelector(
        `.${producto.nombre}`
      );

    if (espacio) {

      espacio.innerHTML = `
        <div style="padding:5px; font-size:13px; color:#222;">
          Nombre: ${producto.nombre}<br>
          Valor: $${producto.valo}<br>
          Cantidad: ${producto.catida}
        </div>
      `;

    }

  });

}

// Agregar producto al carrito
function mostrarnombre(nombreproducto) {

  let productoSeleccionado =
    procdutos.find(
      producto => producto.nombre === nombreproducto
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

  window.location.href =
    'despacho.html';

}
// Buscar productos
function busqueda() {

  let input =
    document.getElementById('input');

  let filtro =
    input.value.toLowerCase();

  let galeria =
    document.getElementById('galeria');

  let items =
    galeria.getElementsByClassName('item');

  for (let i = 0; i < items.length; i++) {

    let nombre =
      items[i].getAttribute(
        'onclick'
      );

    if (
      nombre &&
      nombre.toLowerCase().includes(
        filtro
      )
    ) {

      items[i].style.display = '';

    } else {

      items[i].style.display = 'none';

    }

  }

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