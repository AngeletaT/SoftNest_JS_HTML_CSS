document.addEventListener('DOMContentLoaded', () => {
    // Inicializar las rutas
    const routes = {
        '/home': '/pages/home.view.html',
        '/shop': '/pages/shop.view.html',
        '/contact': '/pages/contact.view.html',
        '/login': '/pages/login.view.html',
        '/cart': '/pages/cart.view.html',
    };

    // Función para cargar una página en el contenedor principal
    function loadPage(route) {
        const contentDiv = document.getElementById('content');
        const page = routes[route] || routes['/home']; // Redirige a home si la ruta no existe

        fetch(page)
            .then(response => response.text())
            .then(html => {
                contentDiv.innerHTML = html;
            })
            .catch(error => console.error('Error al cargar la página:', error));
    }

    // Gestión de clicks en los enlaces de navegación
    document.querySelectorAll('a[data-route]').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const route = event.target.getAttribute('data-route');
            window.history.pushState({}, "", route);
            loadPage(route);
        });
    });

    // Manejo de la navegación del historial
    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname);
    });

    // Cargar la página inicial
    loadPage(window.location.pathname);
});
