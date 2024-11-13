const JSON_USER = 'http://localhost:3005/usuarios';

// Función para registrar un nuevo usuario
export const registerUser = async (user) => {
    try {
        console.log("User", user);
        const response = await fetch(JSON_USER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error('Error al registrar el usuario');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para verificar credenciales de inicio de sesión
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${JSON_USER}?email=${email}&password=${password}`);
        const usuarios = await response.json();
        if (usuarios.length > 0) {
            return usuarios[0];
        } else {
            throw new Error('Usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export const checkIfEmailExists = async (email) => {
    try {
        const response = await fetch(`${JSON_USER}?email=${email}`);
        const users = await response.json();
        return users.length > 0;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const checkIfUserExists = async (username) => {
    try {
        const response = await fetch(`${JSON_USER}?username=${username}`);
        const users = await response.json();
        return users.length > 0;
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getUserById = async (id) => {
    try {
        const response = await fetch(`${JSON_USER}/${id}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
};

export const addOrder = async (userId, order) => {
    try {
        const response = await fetch(`${JSON_USER}/${userId}`);
        if (!response.ok) throw new Error('Error al obtener el usuario');
        const user = await response.json();

        const updatedOrders = [...user.orders, order];

        const updateResponse = await fetch(`${JSON_USER}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...user, orders: updatedOrders })
        });

        if (!updateResponse.ok) throw new Error('Error al actualizar los pedidos del usuario');
        return await updateResponse.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};


export const updateUser = async (userId, updatedData) => {
    try {
        const response = await fetch(`${JSON_USER}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

export const getUserOrders = async (userId) => {
    try {
        const response = await fetch(`${JSON_USER}/${userId}`);
        if (!response.ok) throw new Error('Error al obtener los pedidos del usuario');
        const user = await response.json();
        return user.orders || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

