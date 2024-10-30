import { registerUser, checkIfUserExists, checkIfEmailExists } from '../models/user.model.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    // Manejador para el registro de usuario
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const id = Math.floor(Math.random() * 1000);
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const avatar = `https://i.pravatar.cc/150?u=${id}`;

            // Validación de correo
            if (!email.includes('@')) {
                alert('Por favor ingresa un correo válido con "@"');
                return;
            }

            // Validación de contraseñas coincidentes
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Verificar si el usuario ya existe
            const userExists = await checkIfUserExists(username);
            if (userExists) {
                alert('El usuario ya está registrado');
                return;
            }

            // Verificar si el correo ya está registrado
            const emailExists = await checkIfEmailExists(email);
            if (emailExists) {
                alert('El correo ya está registrado');
                return;
            }

            // Si las validaciones son correctas, se registra el usuario
            const newUser = { id, username, email, password, avatar, orders: [] };
            const result = await registerUser(newUser);

            if (result) {
                alert('Usuario registrado con éxito');
                window.location.href = 'index.html';
            }
        });
    }
});
