import { getProductByReference, getArticleByBarcode } from '../models/article.model.js';
import { Framework } from '../app.js';

// #region INIT DETAILS
export const initDetails = async (refProducto) => {

    const productData = await getProductByReference(refProducto);

    if (productData) {
        renderProductHeader(productData);
        renderColorOptions(productData.articulos);
        addToRecentlyViewed({
            referencia: productData.referencia,
            nom_prod: productData.nom_prod,
            img_prod: productData.img_prod
        });
    } else {
        document.getElementById('product-details').innerHTML = "<p>Producto no encontrado</p>";
    }

    document.getElementById('add-to-cart').addEventListener('click', (event) => {
        const barcode = event.target.dataset.barcode;
        addToCart(barcode);
    });
};

// #region RENDER PRODUCT HEADER
export const renderProductHeader = (product) => {
    document.getElementById('main-image').src = product.img_prod;
    document.getElementById('product-name').textContent = product.nom_prod;
    document.getElementById('product-title').textContent = product.titulo;
    document.getElementById('product-price').textContent = "- €";

    const addToCartButton = document.createElement('button');
    addToCartButton.id = 'add-to-cart';
    addToCartButton.disabled = true;
    addToCartButton.textContent = "Añadir al Carrito";
    document.querySelector('.product-info').appendChild(addToCartButton);
};

// #region RENDER COLOR OPTIONS
export const renderColorOptions = (articulos) => {
    const colorSelector = document.getElementById('color-selector');
    colorSelector.innerHTML = '';

    for (const color in articulos) {
        const colorButton = document.createElement('button');
        colorButton.textContent = color;

        colorButton.addEventListener('click', () => {

            document.querySelectorAll('.color-selector button').forEach(btn => btn.classList.remove('selected'));
            colorButton.classList.add('selected');

            const firstArticle = articulos[color][0];
            if (firstArticle && firstArticle.img_art) {
                document.getElementById('main-image').src = firstArticle.img_art;
            }

            renderSizeOptions(articulos[color]);
        });

        colorSelector.appendChild(colorButton);
    }
};

// #region RENDER SIZE OPTIONS
export const renderSizeOptions = (sizes) => {
    const sizeList = document.getElementById('size-options');
    sizeList.innerHTML = '';

    sizes.forEach(size => {
        const sizeButton = document.createElement('button');
        sizeButton.classList.add('size-option');
        sizeButton.textContent = `${size.destalla}`;

        sizeButton.addEventListener('click', () => {
            document.querySelectorAll('.size-options .size-option').forEach(btn => btn.classList.remove('selected'));
            sizeButton.classList.add('selected');

            document.getElementById('product-price').textContent = `${parseFloat(size.pvp).toFixed(2)} €`;
            document.getElementById('main-image').src = size.img_art;

            const addToCartButton = document.getElementById('add-to-cart');
            addToCartButton.dataset.barcode = size.barcode;
            addToCartButton.disabled = size.stock <= 0;
            addToCartButton.textContent = size.stock > 0 ? "Añadir al Carrito" : "Agotado";
        });

        sizeList.appendChild(sizeButton);
    });
};

// #region ADD TO CART
export const addToCart = (barcode) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const framework = new Framework();
    if (!user) {
        framework.showAlert('Por favor, inicie sesión para agregar productos al carrito', goToLogin);
        return;
    }

    getArticleByBarcode(barcode).then(article => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.barcode === barcode);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...article, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        framework.showAlert('Producto añadido al carrito');
    });
};

function goToLogin() {
    const framework = new Framework();

    framework.loadPage('/login');
    framework.hideAlert();
}

// #region RECENT PRODUCTS
const addToRecentlyViewed = (product) => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

    const exists = recentlyViewed.some(item => item.referencia === product.referencia);
    if (!exists) {
        recentlyViewed.unshift(product);

        if (recentlyViewed.length > 6) {
            recentlyViewed.pop();
        }

        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
};