import { initShop, goBack } from './controllers/shop.controller.js';
import { registerController, loginController } from './controllers/login.controller.js';

export class Framework {
    constructor() {
        this.routes = {
            '/home': '../js/views/home.view.html',
            '/shop': '../js/views/shop.view.html',
            '/about': '../js/views/about.view.html',
            '/contact': '../js/views/contact.view.html',
            '/login': '../js/views/login.view.html',
            '/register': '../js/views/register.view.html',
            '/details/': '../js/views/details.view.html',
            '/cart': '../js/views/cart.view.html',
        };
    }

    showAlert(message, callback) {
        const callbackFunction = callback;
        const alertBox = document.getElementById('custom-alert');
        const alertMessage = document.getElementById('alert-message');
        const closeAlertButton = document.getElementById('close-alert');

        alertMessage.textContent = message;
        alertBox.classList.remove('hidden');

        if (callback == undefined) {
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

    bindEventsLoadPage() {
        document.querySelectorAll('a[data-route]').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const route = link.getAttribute('data-route');
                console.log("Navigating to route:", route);
                window.history.pushState({ path: route }, '', route);
                this.loadPage(route);
            });
        });
    }

    loadPage(route) {
        console.log('Cargando ruta:', route);
        const contentDiv = document.getElementById('content');

        let page;
        if (route.startsWith('/details/')) {
            page = this.routes['/details/'];
        } else {
            page = this.routes[route] || this.routes['/home'];
        }

        console.log('Cargando página:', page);

        this.loadHeader();

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

                if (route.startsWith('/details/')) {
                    const refProducto = route.split('/')[2];
                    console.log('Ref. Producto:', refProducto);
                    import('./controllers/details.controller.js').then(module => {
                        module.initDetails(refProducto);
                    });
                }

                this.bindEventsLoadPage();
            })
            .catch(error => console.error('Error al cargar la página:', error));
    }

    loadHeader() {
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
}

document.addEventListener('DOMContentLoaded', () => {
    const framework = new Framework();

    window.addEventListener('popstate', (event) => {
        framework.loadPage(event.state?.path || window.location.pathname);
    });

    if (!window.location.pathname || window.location.pathname === '/') {
        window.history.replaceState({ path: '/home' }, '', '/');
        framework.loadPage('/home');
    } else {
        framework.loadPage(window.location.pathname);
    }
});
