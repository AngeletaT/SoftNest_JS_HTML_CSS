import { getFamilies, getFamilyProducts, getSubfamilyProducts, getAllProducts } from '../models/product.model.js';
// #region INICIAR SHOP
// Variables para controlar el menú lateral.
let currentLevel = 'families';
let selectedFamily = null;
let selectedSubfamily = null;

// Cargar todos los productos inicialmente
export const initShop = async () => {
    const families = await getFamilies();
    // console.log(families);
    if (families) {
        renderFamilies(families, handleFamilyClick);
        currentLevel = 'families';

        const allProducts = await getAllProducts();
        // console.log(allProducts);
        renderAllProducts(allProducts);
    }
};

// Funcion para renderizar todos los productos
export const renderAllProducts = (products) => {
    const contentDiv = document.getElementById('products');
    contentDiv.innerHTML = '';
    console.log("shopview", products);

    if (products.length > 0) {
        let html = '<h2>Productos</h2><div class="product-cards">';
        products.forEach(product => {
            html += `
                <div class="product-card">
                    <div class="product-image" style="background-image: url('${product.img_ppal_med}');"></div>
                    <div class="product-info">
                        <p>${product.descripcion}</p>
                        <a href="${product.link}" class="view-more">Ver más</a>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;
    } else {
        contentDiv.innerHTML = '<p>No se encontraron productos.</p>';
    }
}

// Función para renderizar las familias en el menú lateral
export const renderFamilies = (families, onClickHandler) => {
    const menuItems = document.getElementById('menu-items');
    if (!menuItems) {
        console.error("El elemento 'menu-items' no se encuentra en el DOM.");
        return;
    }

    menuItems.innerHTML = '';
    Object.values(families).forEach(family => {
        const li = document.createElement('li');
        li.textContent = family.descripcion;
        li.addEventListener('click', () => onClickHandler(family));
        menuItems.appendChild(li);
    });
};

// #region CLIC FAMILIA
// Manejador para el clic en una familia
const handleFamilyClick = (family) => {
    selectedFamily = family;
    renderSubfamilies(family.subfamilias, handleSubfamilyClick);
    currentLevel = 'subfamilies';

    renderFamiliesProducts(family);
    // Mostrar el botón para regresar
    document.getElementById('back-button').style.display = 'flex';
    document.getElementById('title').style.display = 'none';
};

// Función para renderizar las subfamilias
export const renderSubfamilies = (subfamilias, onClickHandler, selectedSubfamily = null) => {
    const menuItems = document.getElementById('menu-items');
    menuItems.innerHTML = '';

    subfamilias.forEach(subfamily => {
        const li = document.createElement('li');
        li.textContent = subfamily.descripcion;

        if (subfamily.refsubfamilia === selectedSubfamily) {
            li.classList.add('selected');
        }

        li.addEventListener('click', () => onClickHandler(subfamily.refsubfamilia));
        menuItems.appendChild(li);
    });
};

// Función para renderizar los productos de la familia
export const renderFamiliesProducts = async (family) => {
    const contentDiv = document.getElementById('products');
    contentDiv.innerHTML = '';

    let allProducts = [];
    for (const subfamily of family.subfamilias) {
        const products = await getSubfamilyProducts(subfamily.refsubfamilia);
        allProducts.push(...products);
    }

    if (allProducts.length > 0) {
        let html = '<h2>Productos  >  Familia</h2><div class="product-cards">';
        allProducts.forEach(product => {
            html += `
            <div class="product-card">
                <div class="product-image" style="background-image: url('${product.img_ppal_med}');"></div>
                <div class="product-info">
                    <p>${product.descripcion}</p>
                    <a href="${product.link}" class="view-more">Ver más</a>
                </div>
            </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;
    } else {
        contentDiv.innerHTML = '<p>No se encontraron productos para esta familia.</p>';
    }
};


// #region CLIC SUBFAMILIA
// Manejador para el clic en una subfamilia
const handleSubfamilyClick = async (refSubfamilia) => {
    selectedSubfamily = refSubfamilia;
    const products = await getSubfamilyProducts(refSubfamilia);
    renderSubfamilyProducts(products);

    renderSubfamilies(selectedFamily.subfamilias, handleSubfamilyClick, selectedSubfamily);
};

// Función para renderizar los productos de una subfamilia
export const renderSubfamilyProducts = (products) => {
    const contentDiv = document.getElementById('products');
    contentDiv.innerHTML = '';
    if (products.length > 0) {
        let html = '<h2>Productos  >  Familia  >  Subfamilia</h2><div class="product-cards">';
        products.forEach(product => {
            html += `
            <div class="product-card">
            <div class="product-image" style="background-image: url('${product.img_ppal_med}');"></div>
            <div class="product-info">
            <p>${product.descripcion}</p>
            <a href="${product.link}" class="view-more">Ver más</a>
            </div>
            </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;
    } else {
        contentDiv.innerHTML = '<p>No se encontraron productos para esta subfamilia.</p>';
    }
};

// #region BOTON VOLVER
// Función para volver al nivel anterior (familias)
export const goBack = () => {
    initShop();
    document.getElementById('back-button').style.display = 'none';
    document.getElementById('title').style.display = 'block';

};