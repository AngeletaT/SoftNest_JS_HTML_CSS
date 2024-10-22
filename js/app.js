import { initShop, goBack } from './controllers/shop.controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        '/home': '/pages/home.view.html',
        '/shop': '/pages/shop.view.html',
        '/about': '/pages/about.view.html',
        '/contact': '/pages/contact.view.html',
        '/login': '/pages/login.view.html',
    };

    function loadPage(route) {
        const contentDiv = document.getElementById('content');
        const page = routes[route] || routes['/home'];

        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html;

                if (route === '/shop') {
                    initShop(); // Iniciar la tienda
                    document.getElementById('go-back').addEventListener('click', goBack); // Añadir manejador para el botón de regresar
                }
            })
            .catch(error => console.error('Error al cargar la página:', error));
    }

    document.querySelectorAll('a[data-route]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const route = event.target.getAttribute('data-route');
            window.history.pushState({}, "", route);
            loadPage(route);
        });
    });

    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });

    loadPage(window.location.pathname);
});
