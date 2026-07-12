


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