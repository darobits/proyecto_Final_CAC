document.addEventListener('DOMContentLoaded', () => {
  const cerrarSesionBtn = document.getElementById('cerrar-sesion');
  if (cerrarSesionBtn) {
      cerrarSesionBtn.addEventListener('click', () => {
          localStorage.removeItem('token');
          window.location.href = 'index.html';
      });
  }

  // Mostrar nombre de usuario en el perfil
  const nombreUsuario = localStorage.getItem('nombre_usuario');
  if (nombreUsuario) {
      document.getElementById('perfil-usuario').textContent = nombreUsuario;
  }

  // Cargar datos del usuario al hacer clic en el body
  document.body.addEventListener('click', async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          alert('Inicia sesión para acceder a esta página');
          window.location.href = 'iniciarSesion.html';
      }

      try {
          const response = await fetch('http://localhost:3000/api/usuarios/me', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          const usuario = await response.json();
          document.getElementById('usuario-nombre').textContent = usuario.nombre;
          document.getElementById('usuario-apellido').textContent = usuario.apellido;
          document.getElementById('usuario-dni').textContent = usuario.dni;
          document.getElementById('usuario-telefono').textContent = usuario.telefono;
          document.getElementById('usuario-correo').textContent = usuario.correo;
          document.getElementById('usuario-contrasenia').textContent = usuario.contrasenia;
      } catch (error) {
          console.error('Error al cargar datos de usuario:', error);
          alert('Error al cargar datos de usuario. Por favor, intenta nuevamente.');
      }
  });

  // Funcionalidad de edición
  document.getElementById('editar-nombre').addEventListener('click', () => {
      const nombre = prompt('Editar nombre:', document.getElementById('usuario-nombre').textContent);
      if (nombre !== null) {
          actualizarUsuario({ nombre });
      }
  });

  document.getElementById('editar-apellido').addEventListener('click', () => {
      const apellido = prompt('Editar apellido:', document.getElementById('usuario-apellido').textContent);
      if (apellido !== null) {
          actualizarUsuario({ apellido });
      }
  });

  // Función para actualizar el usuario en la base de datos
  async function actualizarUsuario(datosActualizados) {
      const token = localStorage.getItem('token');
      try {
          const response = await fetch('http://localhost:3000/api/usuarios/me', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(datosActualizados)
          });
          if (response.ok) {
              const usuarioActualizado = await response.json();
              if (usuarioActualizado.nombre) {
                  document.getElementById('usuario-nombre').textContent = usuarioActualizado.nombre;
              }
              if (usuarioActualizado.apellido) {
                  document.getElementById('usuario-apellido').textContent = usuarioActualizado.apellido;
              }
              alert('Datos actualizados correctamente');
          } else {
              const error = await response.json();
              alert('Error al actualizar datos: ' + error.message);
          }
      } catch (error) {
          console.error('Error al actualizar datos:', error);
          alert('Error al actualizar datos. Por favor, intenta nuevamente.');
      }
  }
});