import { getProductByReference } from '../models/article.model.js';

export const initDetails = async (refProducto) => {
    const productData = await getProductByReference(refProducto);
    if (productData) {
        renderProductHeader(productData);
        renderColorOptions(productData.articulos);
    } else {
        document.getElementById('product-details').innerHTML = "<p>Producto no encontrado</p>";
    }
};

// Función para renderizar el encabezado del producto
function renderProductHeader(product) {
    document.getElementById('main-image').src = product.img_prod;
    document.getElementById('product-name').textContent = product.nom_prod;
    document.getElementById('product-title').textContent = product.titulo;
    document.getElementById('product-price').textContent = "- €";

    // Añadir el botón "Añadir al Carrito" después de que los datos principales están cargados
    const addToCartButton = document.createElement('button');
    addToCartButton.id = 'add-to-cart';
    addToCartButton.disabled = true;
    addToCartButton.textContent = "Añadir al Carrito";
    document.querySelector('.product-info').appendChild(addToCartButton);
}

// Función para renderizar los colores como opciones
function renderColorOptions(articulos) {
    const colorSelector = document.getElementById('color-selector');
    colorSelector.innerHTML = '';

    for (const color in articulos) {
        const colorButton = document.createElement('button');
        colorButton.textContent = color;

        colorButton.addEventListener('click', () => {

            document.querySelectorAll('.color-selector button').forEach(btn => btn.classList.remove('selected'));
            colorButton.classList.add('selected');

            // Actualiza la imagen principal con la primera imagen del primer artículo del color seleccionado
            const firstArticle = articulos[color][0];
            if (firstArticle && firstArticle.img_art) {
                document.getElementById('main-image').src = firstArticle.img_art;
            }

            // Renderiza las opciones de tallas para el color seleccionado
            renderSizeOptions(articulos[color]);
        });

        colorSelector.appendChild(colorButton);
    }
}

// Función para renderizar las opciones de talla dentro de un color específico
function renderSizeOptions(sizes) {
    const sizeList = document.getElementById('size-options');
    sizeList.innerHTML = '';

    sizes.forEach(size => {
        const sizeDiv = document.createElement('div');
        sizeDiv.classList.add('size-option');
        sizeDiv.textContent = `${size.destalla}`;

        sizeDiv.addEventListener('click', () => {
            document.querySelectorAll('.size-options .size-option').forEach(btn => btn.classList.remove('selected'));
            sizeDiv.classList.add('selected');

            document.getElementById('product-price').textContent = `${size.pvp} €`;
            document.getElementById('main-image').src = size.img_art;

            const addToCartButton = document.getElementById('add-to-cart');
            addToCartButton.dataset.barcode = size.barcode;
            addToCartButton.disabled = size.stock <= 0;
            addToCartButton.textContent = size.stock > 0 ? "Añadir al Carrito" : "Agotado";
        });

        sizeList.appendChild(sizeDiv);
    });
}
