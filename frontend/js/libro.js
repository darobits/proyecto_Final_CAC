document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Inicia sesión para acceder a esta página');
        window.location.href = 'iniciarSesion.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/libros', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const libros = await response.json();

        const librosTable = document.getElementById('libros-container');
        libros.forEach(libro => {
            const div = document.createElement('div');
            div.classList.add('libro');
            div.innerHTML = `
                <h3>${libro.titulo}</h3>
                <p>Autor: ${libro.autor}</p>
                <p>Descripción: ${libro.descripcion}</p>
                <p>Fecha de Publicación: ${libro.fecha_publicacion}</p>
            `;
            librosTable.appendChild(div);
        });
    } catch (error) {
        console.error('Error al cargar listado de libros:', error);
        alert('Error al cargar listado de libros. Por favor, intenta nuevamente.');
    }
});