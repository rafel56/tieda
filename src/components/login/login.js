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