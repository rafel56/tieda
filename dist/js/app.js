

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
const modal = document.getElementById('loginModal');

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


//registro


document
  .getElementById('btnRegistro')
  .addEventListener('click', async () => {

    try {

      const usuario =
        document.getElementById('usuarioRegistro').value;

      const password =
        document.getElementById('passwordRegistro').value;

      const respuesta = await fetch(
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

      const datos = await respuesta.json();

      document.getElementById('mensajeLogin').textContent =
        datos.mensaje;

    } catch (error) {

      console.error(error);

      document.getElementById('mensajeLogin').textContent =
        'Error conectando al servidor';

    }

  });


//inicio de sesion

document
  .getElementById('btnLogin')
  .addEventListener('click', async () => {

    try {

      const usuario =
        document.getElementById('usuarioLogin').value;

      const password =
        document.getElementById('passwordLogin').value;

      const respuesta = await fetch(
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

      const datos = await respuesta.json();

      console.log(datos);

      if (datos.token) {

        localStorage.setItem(
          'token',
          datos.token
        );

        localStorage.setItem(
          'administrador',
          datos.administrador
        );

        document.getElementById('mensajeLogin').textContent =
          'Sesión iniciada correctamente';

        modal.style.display = 'none';

        actualizarMenu();

        alert('Sesión iniciada');

      } else {

        document.getElementById('mensajeLogin').textContent =
          datos.mensaje;

      }

    } catch (error) {

      console.error(error);

      document.getElementById('mensajeLogin').textContent =
        'No se pudo conectar al servidor';

    }

  });


//ocultar modal al hacer clic fuera de él

function actualizarMenu() {

  const administrador =
    localStorage.getItem("administrador") === "true";

  const linkProductos =
    document.getElementById("linkProductos");

  const linkDespacho =
    document.getElementById("linkDespacho");

  if (linkProductos) {
    linkProductos.style.display =
      administrador ? "" : "none";
  }

  if (linkDespacho) {
    linkDespacho.style.display =
      administrador ? "" : "none";
  }

}

document.addEventListener("DOMContentLoaded", actualizarMenu);
})();

// ===== modal =====
(function () {
let productoActual = null;

async function cargarListaProductos() {

    const contenedor = document.getElementById("galeria");

    if (!contenedor) return;

    try {

        const respuesta = await fetch("http://localhost:3000/api/productos");
        procdutos = await respuesta.json();

        contenedor.innerHTML = procdutos.map(producto => `
            <div class="item">

                <img
                    src="./assets/${producto.nombre}.jpeg"
                    alt="${producto.nombre}"
                    onclick="abrirProducto('${producto.nombre}')"
                    onerror="this.onerror=null;this.src='./assets/sin-imagen.png';">

                <h3>${producto.nombre}</h3>

                <p>Cantidad: ${producto.catida}</p>

                <p>Precio: $${producto.valo}</p>

                <button onclick="mostrarnombre('${producto.nombre}')">
                    Agregar al carrito
                </button>

            </div>
        `).join("");

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function abrirProducto(nombre) {

    const producto = procdutos.find(p => p.nombre === nombre);

    if (!producto) return;

    productoActual = nombre;

    document.getElementById("modalImagen").src =
        `./assets/${producto.nombre}.jpeg`;

    document.getElementById("modalNombre").textContent =
        producto.nombre;

    document.getElementById("modalPrecio").textContent =
        "Precio: $" + producto.valo;

    document.getElementById("modalDescripcion").textContent =
        producto.descripcion || "";

    document.getElementById("modalProducto").style.display = "block";
}

function agregarDesdeModal() {

    if (productoActual) {
        mostrarnombre(productoActual);
    }

    document.getElementById("modalProducto").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {

    cargarListaProductos();

    const cerrar = document.getElementById("cerrarProducto");

    if (cerrar) {
        cerrar.onclick = function () {
            document.getElementById("modalProducto").style.display = "none";
        };
    }

    window.onclick = function (e) {
        const modal = document.getElementById("modalProducto");

        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

});
})();

// ===== productos =====
(function () {
// ============================
// Registro de nuevo producto
// ============================

(function () {

  const form = document.getElementById("form-producto");

  if (!form) return;

  const mensajeEstado = document.getElementById("mensaje-estado");
  const btnGuardar = document.getElementById("btn-guardar");

  function limpiarErrores() {

    document.querySelectorAll(".error-campo").forEach(el => {
      el.textContent = "";
    });

    mensajeEstado.textContent = "";
    mensajeEstado.className = "mensaje-estado";
  }

  function mostrarError(idCampo, texto) {

    const el = document.getElementById("error-" + idCampo);

    if (el) {
      el.textContent = texto;
    }

  }

  function validar(datos) {

    let valido = true;

    if (!datos.nombre.trim()) {
      mostrarError("nombre", "El nombre es obligatorio.");
      valido = false;
    }

    if (isNaN(datos.valo) || datos.valo < 0) {
      mostrarError("valor", "Ingresa un valor válido.");
      valido = false;
    }

    if (isNaN(datos.catida) || datos.catida < 0) {
      mostrarError("cantidad", "Ingresa una cantidad válida.");
      valido = false;
    }

    return valido;
  }

  form.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    limpiarErrores();

    const datos = {

      nombre: document.getElementById("nombre").value,
      valo: parseFloat(document.getElementById("valor").value),
      catida: parseInt(document.getElementById("cantidad").value, 10),
      descripcion: document.getElementById("descripcion").value

    };

    if (!validar(datos)) return;

    btnGuardar.disabled = true;
    btnGuardar.textContent = "Guardando...";

    try {

      const respuesta = await fetch("http://localhost:3000/api/productos", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          nombre: datos.nombre.trim(),
          valo: datos.valo,
          catida: datos.catida,
          descripcion: datos.descripcion.trim()
        })

      });

      if (!respuesta.ok) {

        const error = await respuesta.json().catch(() => ({}));

        throw new Error(error.error || "Error del servidor");
      }

      await respuesta.json();

      mensajeEstado.textContent = "Producto guardado correctamente.";
      mensajeEstado.className = "mensaje-estado exito";

      form.reset();

      // Solo recarga la lista si la función existe
      if (typeof cargarListaProductos === "function") {
        await cargarListaProductos();
      }

    } catch (error) {

      console.error(error);

      mensajeEstado.textContent = "No se pudo guardar el producto.";
      mensajeEstado.className = "mensaje-estado error";

    } finally {

      btnGuardar.disabled = false;
      btnGuardar.textContent = "Guardar producto";

    }

  });

})();
})();

// ===== main =====
// import { login } from '../componentes/login.js';

let procdutos = [];

let contadodeproductos = [];
let comprados = [];



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
// Comprar
async function comprarTodo() {

  const token = localStorage.getItem('token');

  if (!token) {
    alert('Debes iniciar sesión para comprar');
    return;
  }

  if (contadodeproductos.length === 0) {
    alert('No hay productos en el carrito');
    return;
  }

  try {

    // Mandamos cada producto del carrito al backend
    for (const producto of contadodeproductos) {

      const respuesta = await fetch('http://localhost:3000/api/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ productoId: producto.id })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al registrar la compra');
      }

      console.log('Compra registrada:', datos);
    }

    // Solo si TODO salió bien, actualizamos el estado local
    comprados = comprados.concat(contadodeproductos);

    localStorage.setItem(
      'ventasPendientes',
      JSON.stringify(contadodeproductos)
    );

    contadodeproductos = [];

    actualizarCarrito();

    alert('Compra realizada correctamente'); 

  } catch (error) {
    console.error('Error al comprar:', error);
    alert('No se pudo completar la compra: ' + error.message);
  }
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

    cargarListaProductos();

    sumadeprocductos();

    const busquedapornombre = document.getElementById("input");

    if (busquedapornombre) {
        busquedapornombre.addEventListener("input", busqueda);
    }

};