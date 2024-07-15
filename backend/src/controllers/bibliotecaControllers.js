// Importar las dependencias necesarias
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Configurar la conexión a la base de datos
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',  
    database: 'biblioteca_cac'
});
// Funciones de controlador

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { nombre, apellido, dni, telefono, correo, contrasenia } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        const [result] = await pool.query('INSERT INTO usuarios (nombre, apellido, dni, telefono, correo, contrasenia) VALUES (?, ?, ?, ?, ?, ?)', [nombre, apellido, dni, telefono, correo, hashedPassword]);
        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
};
// Función para iniciar sesión de usuario
const loginUser = async (req, res) => {
    const { correo, contrasenia } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
        }
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(contrasenia, user.contrasenia);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
        }

        // Verificar si hay tokens inválidos para este usuario
        const [invalidTokens] = await pool.query('SELECT * FROM tokenInvalido WHERE id_usuario = ?', [user.id_usuario]);
        const token = jwt.sign({ id: user.id_usuario }, 'secret_key', { expiresIn: '1h' });

        if (invalidTokens.some(tokenRecord => tokenRecord.token === token)) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', token, usuario: user });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
};
// Obtener perfil de usuario
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado obtenido del token

        // Obtener datos del usuario desde la base de datos
        const [rows] = await pool.query(
            'SELECT nombre, apellido, dni, correo FROM usuarios WHERE id_usuario = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = rows[0];
        res.json(usuario); // Devuelve los datos del usuario como respuesta

    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        res.status(500).json({ message: 'Error al obtener perfil de usuario', error: error.message });
    }
};

// Actualizar perfil de usuario
const updateUserProfile = async (req, res) => {
    const userId = req.user.id; // ID del usuario autenticado obtenido del token
    const { nombre, apellido } = req.body; // Datos que se pueden actualizar

    try {
        // Actualizar datos del usuario en la base de datos
        await pool.query(
            'UPDATE usuarios SET nombre = ?, apellido = ? WHERE id_usuario = ?',
            [nombre, apellido, userId]
        );

        // Obtener datos actualizados del usuario
        const [rows] = await pool.query(
            'SELECT nombre, apellido FROM usuarios WHERE id_usuario = ?',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuarioActualizado = rows[0];
        res.json(usuarioActualizado); // Devuelve los datos actualizados del usuario como respuesta

    } catch (error) {
        console.error('Error al actualizar perfil de usuario:', error);
        res.status(500).json({ message: 'Error al actualizar perfil de usuario', error: error.message });
    }
};

// Obtener listado de libros
const getLibros = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id_libro, titulo, autor, descripcion, fecha_publicacion FROM libros ORDER BY id_libro ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener listado de libros:', error);
        res.status(500).json({ message: 'Error al obtener listado de libros', error: error.message });
    }
};

//autenticacion

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, 'secret_key');

        // Verificar si el token está en la tabla de tokens inválidos
        const [invalidTokens] = await pool.query('SELECT * FROM tokenInvalido WHERE token = ?', [token]);
        if (invalidTokens.length > 0) {
            return res.sendStatus(403);
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.sendStatus(403);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getLibros, 
    authenticateToken
};