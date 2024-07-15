document.getElementById('registro-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = e.target.nombre.value;
    const apellido = e.target.apellido.value;
    const dni = e.target.dni.value;
    const correo = e.target.correo.value;
    const contrasenia = e.target.contrasenia.value;

    try {
        const response = await fetch('http://localhost:3000/api/biblioteca/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido, dni, correo, contrasenia })
        });

        const result = await response.json();
        alert(result.message);

        if (response.status === 201) {
            window.location.href = 'iniciarSesion.html'; // Redirige a iniciarSesion.html si el registro es exitoso
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario. Por favor, intenta nuevamente.');
    }
});