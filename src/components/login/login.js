document
  .getElementById('btnLogin')
  .addEventListener('click', async () => {

    const usuario =
      document.getElementById(
        'usuarioLogin'
      ).value;

    const password =
      document.getElementById(
        'passwordLogin'
      ).value;

    const datos =
      await iniciarSesion(
        usuario,
        password
      );

    if (datos.token) {

      document.getElementById(
        'mensajeLogin'
      ).textContent =
        'Sesión iniciada correctamente';

      modal.style.display = 'none';

    } else {

      document.getElementById(
        'mensajeLogin'
      ).textContent =
        datos.mensaje;

    }

  });