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