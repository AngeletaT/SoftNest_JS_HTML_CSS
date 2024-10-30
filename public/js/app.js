import { initShop, goBack } from './controllers/shop.controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        '/home': '../views/home.view.html',
        '/shop': '../views/shop.view.html',
        '/about': '../views/about.view.html',
        '/contact': '../views/contact.view.html',
        '/login': '../views/login.view.html',
        '/register': '../views/register.view.html',
        '/cart': '../views/cart.view.html',
    };

    function loadPage(route) {
        const contentDiv = document.getElementById('content');
        const page = routes[route] || routes['/home'];

        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html;

                if (route === '/shop') {
                    initShop();
                    document.getElementById('go-back').addEventListener('click', goBack);
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
