let ventasPendientes =
  JSON.parse(
    localStorage.getItem('ventasPendientes')
  ) || [];


function cargarDespachos() {

  const contenedor =
    document.getElementById('despacho');

  if (!contenedor) return;

  contenedor.innerHTML = '';

  ventasPendientes.forEach((producto, index) => {

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

  });

}


// Enviar despacho al backend
window.despachar = async function(index) {

  const producto = ventasPendientes[index];

  try {

    await fetch(
      'http://localhost:3000/api/despachar',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(producto)
      }
    );


    // quitar solo después de guardar
    ventasPendientes.splice(index,1);


    localStorage.setItem(
      'ventasPendientes',
      JSON.stringify(ventasPendientes)
    );


    cargarDespachos();


  } catch(error){

    console.error(
      "Error al despachar:",
      error
    );

  }

};


document.addEventListener(
  "DOMContentLoaded",
  cargarDespachos
);