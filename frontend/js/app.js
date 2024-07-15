document.addEventListener('DOMContentLoaded', () => {
    // Manejar la lógica para registrar e iniciar sesión
    const registerForm = document.querySelector('#registro-form');
    const loginForm = document.querySelector('#login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3000/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Usuario registrado correctamente');
                    window.location.href = 'iniciarSesion.html';
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    window.location.href = 'index2.html'; // Redireccionar a la página correcta después del inicio de sesión
                } else {
                    alert('Correo o contraseña incorrectos');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Verificar si el usuario está logueado
    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:3000/api/books', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const booksSection = document.querySelector('#booksSection');
            if (booksSection) {
                booksSection.innerHTML = data.map(book => `
                    <div class="book">
                        <img src="${book.imageUrl}" alt="${book.title}">
                        <h3>${book.title}</h3>
                        <p>${book.author}</p>
                        <p>${book.fechaPublicacion}</p>
                        <p>${book.descripcion}</p>
                        <p>${book.subgenero}</p>
                        <p>${book.genero}</p>
                        <button class="edit-btn" data-id="${book.id}">Editar</button>
                        <button class="delete-btn" data-id="${book.id}">Eliminar</button>
                    </div>
                `).join('');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});