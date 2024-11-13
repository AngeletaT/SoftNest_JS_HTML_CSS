import { Framework } from '../app.js';
import { addOrder } from '../models/user.model.js';

export const initCart = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        checkoutButton.disabled = true;
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.pvp * item.quantity;
        total += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        itemDiv.innerHTML = `
            <div class="item-info">
                <div class="item-left">
                    <img src="${item.img_art}" alt="${item.nom_prod}">
                    <div class="item-name">
                        <h3>${item.nom_prod}</h3>
                        <p>${item.destalla}</p>
                        <p>Precio: ${item.pvp} €</p>
                    </div>
                </div>
                <div class="item-right">
                    <div class="item-quantity">
                        <button class="decrease-button" data-barcode="${item.barcode}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" min="1" data-barcode="${item.barcode}">
                        <button class="increase-button" data-barcode="${item.barcode}">+</button>
                    </div>
                    <p class="item-total" data-barcode="${item.barcode}">${itemTotal.toFixed(2)} €</p>
                    <button class="remove-button" data-barcode="${item.barcode}">Eliminar</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    cartTotalElement.textContent = `${total.toFixed(2)} €`;

    // Eventos para los botones de eliminar y cambiar cantidades
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', (event) => removeFromCart(event.target.dataset.barcode));
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (event) => updateQuantity(event.target.dataset.barcode, event.target.value));
    });

    // Eventos para los botones de incremento y decremento
    document.querySelectorAll('.increase-button').forEach(button => {
        button.addEventListener('click', (event) => changeQuantity(event.target.dataset.barcode, 1));
    });

    document.querySelectorAll('.decrease-button').forEach(button => {
        button.addEventListener('click', (event) => changeQuantity(event.target.dataset.barcode, -1));
    });

    document.getElementById('checkout-button').addEventListener('click', checkout);

    checkoutButton.addEventListener('click', checkout);
};

// Función para cambiar la cantidad con los botones + y -
const changeQuantity = (barcode, change) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.barcode === barcode);

    if (productIndex > -1) {
        cart[productIndex].quantity = Math.max(1, cart[productIndex].quantity + change); // Asegura que la cantidad mínima es 1
        localStorage.setItem('cart', JSON.stringify(cart));
        initCart(); // Recarga el carrito para reflejar los cambios
    }
};

// Función para actualizar la cantidad y el precio total de un producto
const updateQuantity = (barcode, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.barcode === barcode);
    const parsedQuantity = Math.max(1, parseInt(quantity, 10) || 1); // Convierte a número y asegura que la cantidad es al menos 1

    if (productIndex > -1 && parsedQuantity > 0) {
        cart[productIndex].quantity = parsedQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        initCart(); // Recarga el carrito para reflejar los cambios
    }
};

// Función para eliminar un producto del carrito
const removeFromCart = (barcode) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.barcode !== barcode);
    localStorage.setItem('cart', JSON.stringify(cart));
    initCart();
};

// Función para finalizar la compra
const checkout = async () => {
    const framework = new Framework();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        framework.showAlert('Por favor, inicie sesión para finalizar la compra', goToLogin);
        return;
    }

    const order = {
        cart,
        date: new Date().toISOString(),
        total: cart.reduce((acc, item) => acc + item.pvp * item.quantity, 0)
    };

    const updatedUser = await addOrder(user.id, order);

    if (updatedUser) {
        framework.showAlert('Compra realizada con éxito', goToCart);
        localStorage.removeItem('cart');
        window.location.replace('/');

    } else {
        framework.showAlert('Error al procesar la compra');
    }

    function goToLogin() {
        const framework = new Framework();

        framework.loadPage('/login');
        framework.hideAlert();
    }

    function goToCart() {
        const framework = new Framework();

        framework.loadPage('/');
        framework.hideAlert();
    }
};
