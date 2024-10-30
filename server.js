const express = require('express');
const path = require('path');

const app = express();
const PORT = 3006;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Manejo de rutas básicas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ruta para cada página como login, register, shop, details, etc.
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `public/${page}.html`));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
