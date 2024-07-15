document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = e.target.correo.value;
    const contrasenia = e.target.contrasenia.value;

    try {
        const response = await fetch('http://localhost:3000/api/biblioteca/iniciarSesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, contrasenia })
        });

        const result = await response.json();
        alert(result.message);

        if (response.status === 200) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('nombre_usuario', result.nombre);  // Guarda el nombre del usuario
            window.location.href = 'index2.html';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Por favor, intenta nuevamente.');
    }
});