import { Framework } from '../app.js';
import { updateUser } from '../models/user.model.js';

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

    if (section === 'orders') loadOrders();
    if (section === 'settings') loadSettings();
};

const loadOrders = () => {

    document.getElementById('orders-section').innerHTML = "<p>Cargando pedidos...</p>";
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
