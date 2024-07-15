const express = require('express');
const cors = require('cors');
const path = require('path');
const bibliotecaRoutes = require('./routes/bibliotecaRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar las rutas definidas en bibliotecaRoutes
app.use('/api/biblioteca', bibliotecaRoutes);

// Configurar ruta estática para el frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Ruta comodín para manejar todas las demás rutas del frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});