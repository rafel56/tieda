// import { login } from '../componentes/login.js';


let procdutos = [];

let contadodeproductos = [];
let comprados = [];


async function cargarProductos() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/productos');

    procdutos = await respuesta.json();

    todoprocductos();

 
  
  } catch (error) {
    console.error('Error cargando productos:', error);
  }
}

// Mostrar productos en la galería
function todoprocductos() {

  procdutos.forEach(producto => {

    let espacio = document.querySelector(`.${producto.nombre}`);

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

function mostrarnombre(nombreproducto) {

  let productoSeleccionado =
    procdutos.find(
      producto => producto.nombre === nombreproducto
    );

  let asidecarrito =
    document.getElementById('carrito');

  if (productoSeleccionado && asidecarrito) {

    contadodeproductos.push(productoSeleccionado);

    asidecarrito.innerHTML += `
      <p><strong>Nombre:</strong> ${productoSeleccionado.nombre}</p>
      <p><strong>Valor:</strong> $${productoSeleccionado.valo}</p>
      <p><strong>Cantidad disponible:</strong> ${productoSeleccionado.catida}</p>
      <hr>
    `;

  }

  sumadeprocductos();

}


function sumadeprocductos() {

  let sumaBtn = document.getElementById('suma');

  let total = 0;

  contadodeproductos.forEach(producto => {
    total += producto.valo;
  });

  if (sumaBtn) {
    sumaBtn.textContent = `Total: $${total}`;
  }

}


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


function volverarriba() {

  window.scroll({
    top: 0,
    behavior: 'smooth'
  });

}

function comprarTodo() {

  const token = localStorage.getItem('token');

  if (!token) {

    alert(
      'Debes iniciar sesión para comprar'
    );

    return;
  }

  let asidecarrito =
    document.getElementById('carrito');

  comprados =
    comprados.concat(contadodeproductos);

  contadodeproductos = [];

  if (asidecarrito) {
    asidecarrito.innerHTML = '';
  }

  let sumaBtn =
    document.getElementById('suma');

  if (sumaBtn) {
    sumaBtn.textContent = 'Total: $0';
  }

  alert('Compra realizada');

  console.log(
    'Productos comprados:',
    comprados
  );
}


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
      items[i].getAttribute('onclick');

    if (
      nombre &&
      nombre.toLowerCase().includes(filtro)
    ) {

      items[i].style.display = '';

    } else {

      items[i].style.display = 'none';

    }

  }

}


window.onload = function () {

  cargarProductos();

  sumadeprocductos();

  let busquedapornombre =
    document.getElementById('input');

  if (busquedapornombre) {

    busquedapornombre.addEventListener(
      'input',
      busqueda
    );

  }

};