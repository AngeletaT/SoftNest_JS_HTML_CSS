const express = require('express');
const path = require('path');

const app = express();
const PORT = 3006;

// Configurar la carpeta 'public' para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ruta para archivos .html específicos (evita tratar archivos JS o CSS como HTML)
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `public/${page}.html`);
    console.log('Serving:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) next(); // Si el archivo no existe, pasa al siguiente middleware
    });
});

// Manejar todas las demás rutas y servir index.html
app.get('*', (req, res) => {
    console.log('Ruta no encontrada:', req.url);
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
