import { registerUser, loginUser, checkIfUserExists, checkIfEmailExists } from '../models/user.model.js';
import { Framework } from '../app.js';

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

                // Validación de correo
                if (!email.includes('@')) {
                    framework.showAlert('Por favor ingresa un correo válido con "@"');
                    return;
                }

                // Validación de contraseñas coincidentes
                if (password !== confirmPassword) {
                    framework.showAlert('Las contraseñas no coinciden');
                    return;
                }

                // Verificar si el usuario ya existe
                const userExists = await checkIfUserExists(username);
                if (userExists) {
                    framework.showAlert('El usuario ya está registrado');
                    return;
                }

                // Verificar si el correo ya está registrado
                const emailExists = await checkIfEmailExists(email);
                if (emailExists) {
                    framework.showAlert('El correo ya está registrado');
                    return;
                }

                // Si las validaciones son correctas, se registra el usuario
                const newUser = { id, username, email, password, avatar, orders: [] };
                const result = await registerUser(newUser);
                if (result) {
                    framework.showAlert('Registro exitoso', this.successRegister);
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
                    framework.showAlert('Inicio de sesión exitoso', this.successLogin);
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
