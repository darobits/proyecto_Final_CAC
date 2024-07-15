document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar los libros desde la API
    const cargarLibros = async () => {
      try {
        const response = await fetch('/libros', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Error al cargar listado de libros.');
        }
        const libros = await response.json();
        const librosTableBody = document.querySelector('#libros-table tbody');
        librosTableBody.innerHTML = ''; // Limpiar contenido anterior
        libros.forEach(libro => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${libro.id_libro}</td>
            <td>${libro.titulo}</td>
            <td>${libro.autor}</td>
            <td>${libro.descripcion}</td>
            <td>${libro.fecha_publicacion}</td>
          `;
          librosTableBody.appendChild(row);
        });
      } catch (error) {
        console.error('Error al cargar listado de libros:', error);
        alert('Error al cargar listado de libros. Por favor, intenta nuevamente.');
      }
    };
  
    // Llamar a la función para cargar libros al cargar la página
    cargarLibros();
  });