const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Importar el módulo mysql2/promise
const { registerUser, getUserProfile, getLibros, authenticateToken, loginUser } = require('../controllers/bibliotecaControllers'); 

// Configurar la conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'biblioteca_cac',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Ruta para iniciar sesión y obtener el perfil del usuario
router.post('/iniciarSesion', async (req, res) => {
    const { correo, contrasenia } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ? AND contrasenia = ?', [correo, contrasenia]);
        if (rows.length > 0) {
            const usuario = rows[0];
            res.json({ message: 'Inicio de sesión exitoso', usuario });
        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

// Ruta para obtener el listado de libros
router.get('/libros', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM libros ORDER BY id_libro ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener el listado de libros:', error);
        res.status(500).json({ message: 'Error al obtener el listado de libros' });
    }
});


// Rutas
router.post('/registro', registerUser);
// Ruta para iniciar sesión de usuario
router.post('/iniciarSesion', loginUser);
router.get('/usuarios/me', authenticateToken, getUserProfile); // Ruta protegida usando authenticateToken
router.get('/libros', authenticateToken, getLibros); // Ruta protegida usando authenticateToken

module.exports = router;