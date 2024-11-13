import { registerUser, loginUser, checkIfUserExists, checkIfEmailExists } from '../models/user.model.js';
import { Framework } from '../app.js';

// #region REGISTER
export const registerController = {
    bindRegisterEvents: function () {
        const framework = new Framework();
        const registerButton = document.getElementById('btnRegister');
        if (registerButton) {
            registerButton.addEventListener('click', async (event) => {
                event.preventDefault();

                const id = Math.floor(Math.random() * 1000);
                const email = document.getElementById('register-email').value;
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                const avatar = `https://i.pravatar.cc/150?u=${id}`;

                if (!email.includes('@')) {
                    framework.showAlert('Por favor ingresa un correo válido con "@"');
                    return;
                }

                if (password !== confirmPassword) {
                    framework.showAlert('Las contraseñas no coinciden');
                    return;
                }

                const userExists = await checkIfUserExists(username);
                if (userExists) {
                    framework.showAlert('El usuario ya está registrado');
                    return;
                }

                const emailExists = await checkIfEmailExists(email);
                if (emailExists) {
                    framework.showAlert('El correo ya está registrado');
                    return;
                }

                const newUser = { id, username, email, password, avatar, orders: [] };
                const result = await registerUser(newUser);
                if (result) {
                    window.location.href = '/index.html';
                } else {
                    framework.showAlert('Datos incorrectos');
                }
            });
        }
    },

    successRegister: function () {
        const framework = new Framework();
        window.location.href = '/index.html';
        framework.hideAlert();
    }
}

// #region LOGIN
export const loginController = {
    bindLoginEvents: function () {
        const framework = new Framework();
        const loginButton = document.getElementById('btnLogin');
        if (loginButton) {
            loginButton.addEventListener('click', async (event) => {
                event.preventDefault();

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                const user = await loginUser(email, password);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '/index.html';
                } else {
                    framework.showAlert('Usuario o contraseña incorrectos');
                }
            });
        }
    },

    successLogin: function () {
        const framework = new Framework();
        window.location.href = '/index.html';
        framework.hideAlert();
    }
};
