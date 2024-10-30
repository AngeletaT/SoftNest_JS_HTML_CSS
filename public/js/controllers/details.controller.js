import { JSON_URL } from '../config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const referencia = urlParams.get('referencia');

    if (referencia) {
        try {
            const response = await fetch(`${JSON_URL}?referencia=${referencia}`);
            const productData = await response.json();

            if (productData.length > 0) {
                renderProductInfo(productData[0]);
                renderProductVariants(productData[0].articulos);
            } else {
                document.getElementById('product-info').innerHTML = "<p>Producto no encontrado</p>";
            }
        } catch (error) {
            console.error("Error al cargar el producto:", error);
        }
    }
});

function renderProductInfo(product) {
    const productInfoDiv = document.getElementById('product-info');
    productInfoDiv.innerHTML = `
        <h2>${product.nom_prod}</h2>
        <h3>${product.titulo}</h3>
        <img src="${product.img_prod}" alt="${product.nom_prod}">
    `;
}

function renderProductVariants(articulos) {
    const productVariantsDiv = document.getElementById('product-variants');
    let html = '';

    for (const [color, variantes] of Object.entries(articulos)) {
        html += `<h4>Color: ${color}</h4><div class="variant-group">`;
        variantes.forEach(variant => {
            html += `
                <div class="variant-card">
                    <img src="${variant.img_art}" alt="Imagen de variante">
                    <p>Tamaño: ${variant.destalla}</p>
                    <p>Para cama de: ${variant.paracamade}</p>
                    <p>Stock: ${variant.stock}</p>
                    <p>Precio: ${variant.pvp} €</p>
                </div>
            `;
        });
        html += '</div>';
    }

    productVariantsDiv.innerHTML = html;
}
