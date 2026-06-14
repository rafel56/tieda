const ventasPendientes =
  JSON.parse(
    localStorage.getItem('ventasPendientes')
  ) || [];

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

cargarDespachos();