import { Framework } from '../app.js';
import { updateUser } from '../models/user.model.js';
import { getUserOrders } from '../models/user.model.js';

export const initProfile = () => {
    const framework = new Framework();

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        loadProfileData(user);
    } else {
        framework.loadPage('/login');
    }

    // Eventos de navegación
    document.querySelectorAll('.profile-menu a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const section = event.target.dataset.section;
            showSection(section);

            document.querySelectorAll('.profile-menu a').forEach(a => a.classList.remove('active'));
            event.target.classList.add('active');
        });
    });

    showSection('profile');
};

const loadProfileData = (user) => {
    document.getElementById('profile-picture').src = user.avatar;
    document.getElementById('profile-section').innerHTML = `
        <h2>${user.username}</h2>
        <p>Correo electrónico: ${user.email}</p>
    `;
};

const showSection = (section) => {
    document.querySelectorAll('.profile-section').forEach(div => div.style.display = 'none');
    document.getElementById(`${section}-section`).style.display = 'block';

    if (section === 'orders') renderUserOrders();
    if (section === 'settings') loadSettings();
};

export const renderUserOrders = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const ordersContainer = document.getElementById('orders-section');
    ordersContainer.innerHTML = '<p>Cargando pedidos...</p>';

    const orders = await getUserOrders(user.id);
    console.log('Orders:', orders);

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>No tienes pedidos en tu historial.</p>';
        return;
    }

    ordersContainer.innerHTML = '';
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-card');

        let orderTotal = 0;
        const itemsHtml = order.cart.map(item => {
            orderTotal += item.pvp * item.quantity;
            return `
                    <div class="order-product">
                        <img src="${item.img_art}" alt="${item.nom_prod}" class="product-image">
                        <div class="product-details">
                            <p><strong>Producto:</strong> ${item.nom_prod}</p>
                            <p><strong>Tamaño:</strong> ${item.destalla}</p>
                            <p><strong>Cantidad:</strong> ${item.quantity}</p>
                            <p><strong>Precio Unitario:</strong> ${item.pvp} €</p>
                            <p><strong>Total:</strong> ${(item.pvp * item.quantity).toFixed(2)} €</p>
                        </div>
                    </div>
                `;
        }).join('');

        orderDiv.innerHTML = `
                <h3>Pedido realizado el: ${new Date(order.date).toLocaleDateString()}</h3>
                <div class="order-items">
                    ${itemsHtml}
                </div>
                <p class="order-total"><strong>Total del Pedido:</strong> ${orderTotal.toFixed(2)} €</p>
            `;
        ordersContainer.appendChild(orderDiv);
    });
};

const loadSettings = () => {
    const framework = new Framework();
    const user = JSON.parse(localStorage.getItem('user'));

    document.getElementById('settings-section').innerHTML = `
        <h2>Actualizar Perfil</h2>
        <form id="update-profile-form">
            <label for="username">Nombre de usuario:</label>
            <input type="text" id="username" value="${user.username}">
            
            <button type="submit">Guardar Cambios</button>
        </form>

        <button id="logout-button">Cerrar Sesión</button>
    `;

    document.getElementById('update-profile-form').addEventListener('submit', (event) => {
        event.preventDefault();
        saveProfileChanges();
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        framework.loadPage('/login');
    });
};

const saveProfileChanges = async () => {
    const framework = new Framework();
    const user = JSON.parse(localStorage.getItem('user'));
    const newUsername = document.getElementById('username').value;
    const updatedData = {
        id: user.id,
        username: newUsername,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
        orders: user.orders
    };
    console.log('Updated data:', updatedData);

    if (user) {
        const updatedUser = await updateUser(user.id, updatedData);

        if (updatedUser) {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            framework.showAlert('Perfil actualizado con éxito', goToProfile);
        } else {
            framework.showAlert('Error al actualizar el perfil');
        }
    }
};

const goToProfile = () => {
    const framework = new Framework();
    framework.loadPage('/');
};
