import { initShop, goBack } from './controllers/shop.controller.js';
import { registerController, loginController } from './controllers/login.controller.js';

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

        loadHeader();

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

                if (route === '/login') {
                    loginController.bindLoginEvents();
                }

                bindEventsLoadPage();
            })
            .catch(error => console.error('Error al cargar la página:', error));
    }

    window.addEventListener('popstate', (event) => {
        loadPage(event.state?.path || window.location.pathname);
    });

    if (!window.location.pathname || window.location.pathname === '/') {
        window.history.replaceState({ path: '/home' }, '', '/');
        loadPage('/home');
    } else {
        loadPage(window.location.pathname);
    }

    // Función para cargar eventos al cargar la página
    function bindEventsLoadPage() {
        document.querySelectorAll('a[data-route]').forEach(link => {
            if (link.id === 'logout-link') {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    localStorage.removeItem('user');
                    const route = link.getAttribute('data-route');
                    window.history.pushState({ path: route }, '', route);
                    loadPage(route);
                });
            } else if (!link.hasEventListener) {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const route = link.getAttribute('data-route');
                    window.history.pushState({ path: route }, '', route);
                    loadPage(route);
                });
                link.hasEventListener = true;
            }
        });
    }

    function loadHeader() {
        const header = document.getElementById('user-options');
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            header.innerHTML = `
                <a href="#" data-route="/profile"><img src="${user.avatar}" alt="${user.username}" class="header-avatar"></img></a>
                <a href="#" data-route="/cart">Carrito</a>
                <a href="#" id="logout-link" data-route="/login">Cerrar sesión</a>
            `;
            
            document.getElementById('logout-link').addEventListener('click', () => {
                localStorage.removeItem('user');
            });

        } else {
            header.innerHTML = `
                <a href="#" data-route="/login">Iniciar sesión</a>
            `;
        }
    }
});

export class Framework {
    constructor() {
    }

    showAlert(message, callback) {
        const callbackFunction = callback;
        const alertBox = document.getElementById('custom-alert');
        const alertMessage = document.getElementById('alert-message');
        const closeAlertButton = document.getElementById('close-alert');

        alertMessage.textContent = message;
        alertBox.classList.remove('hidden');

        if (callback == undefined) {
            //Elimino el evento anterior para evitar que se acumulen
            if (!closeAlertButton.hasEventListener) {
                closeAlertButton.addEventListener('click', this.hideAlert);
                closeAlertButton.hasEventListener = true;
            }
        } else {
            if (!closeAlertButton.hasEventListener) {
                closeAlertButton.addEventListener('click', callbackFunction);
                closeAlertButton.hasEventListener = true;
            }
        }
    }

    hideAlert() {
        const alertBox = document.getElementById('custom-alert');
        alertBox.classList.add('hidden');
    }
}
