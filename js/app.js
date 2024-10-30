import { initShop, goBack } from './controllers/shop.controller.js';
import { registerController } from './controllers/login.controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        '/home': '../js/views/home.view.html',
        '/shop': '../js/views/shop.view.html',
        '/about': '../js/views/about.view.html',
        '/contact': '../js/views/contact.view.html',
        '/login': '../js/views/login.view.html',
        '/register': '../js/views/register.view.html',
        '/cart': '../js/views/cart.view.html',
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

                if (route === '/register') {
                    registerController.bindRegisterEvents();
                }

                bindEventsCargaPagina();
            })
            .catch(error => console.error('Error al cargar la página:', error));
    }

    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });

    loadPage(window.location.pathname);

    function bindEventsCargaPagina() {
        document.querySelectorAll('a[data-route]').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const route = event.target.getAttribute('data-route');
                window.history.pushState({}, "", route);
                loadPage(route);
            });
        });
    }
});


