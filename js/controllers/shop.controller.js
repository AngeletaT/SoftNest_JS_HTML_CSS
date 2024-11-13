import { getFamilies, getAllProductsJSON, getSubfamilyProducts, getAllProducts } from '../models/product.model.js';
import { Framework } from '../app.js';

// #region VARIABLES
let currentLevel = 'families';
let selectedFamily = null;
let selectedSubfamily = null;

// #region INICIAR SHOP
export const initShop = async () => {
    const families = await getFamilies();
    if (families) {
        renderFamilies(families, handleFamilyClick);
        currentLevel = 'families';

        const allProducts = await getAllProductsJSON();
        renderAllProducts(allProducts);
    }
};

// #region RENDERIZAR TODOS LOS PRODUCTOS
export const renderAllProducts = (products) => {
    const framework = new Framework();
    const contentDiv = document.getElementById('products');
    contentDiv.innerHTML = '';

    if (products.length > 0) {
        let html = '<h2>Productos</h2><div class="product-cards">';
        products.forEach(product => {
            html += `
                <div class="product-card">
                    <div class="product-image" style="background-image: url('${product.img_prod}');"></div>
                    <div class="product-info">
                        <p>${product.nom_prod}</p>
                        <a href="#" data-route="/details/${product.referencia}" id="product-${product.referencia}">Ver más</a>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;
        framework.bindEventsLoadPage();

    } else {
        contentDiv.innerHTML = '<p>No se encontraron productos.</p>';
    }
}

// #region RENDERIZAR FAMILIAS
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
const handleFamilyClick = (family) => {
    selectedFamily = family;
    renderSubfamilies(family.subfamilias, handleSubfamilyClick);
    currentLevel = 'subfamilies';

    renderFamiliesProducts(family);
    
    document.getElementById('back-button').style.display = 'flex';
    document.getElementById('title').style.display = 'none';
};

// #region RENDERIZAR SUBFAMILIAS
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

// #region RENDERIZAR PRODUCTOS DE FAMILIA
export const renderFamiliesProducts = async (family) => {
    const framework = new Framework();
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
                        <a href="#" data-route="/details/${product.refProducto}" id="product-${product.refProducto}">Ver más</a>
                </div>
            </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;
        framework.bindEventsLoadPage();
    } else {
        contentDiv.innerHTML = '<p>No se encontraron productos para esta familia.</p>';
    }
};

// #region CLIC SUBFAMILIA
const handleSubfamilyClick = async (refSubfamilia) => {
    selectedSubfamily = refSubfamilia;
    const products = await getSubfamilyProducts(refSubfamilia);
    renderSubfamilyProducts(products);

    renderSubfamilies(selectedFamily.subfamilias, handleSubfamilyClick, selectedSubfamily);
};

// #region RENDER SUBFAMILIA PRODUCTS
export const renderSubfamilyProducts = (products) => {
    const framework = new Framework();

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
                    <a href="" data-route="/details/${product.refProducto}" id="product-${product.refProducto}">Ver más</a>
                </div>
            </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;

        framework.bindEventsLoadPage();
    } else {
        contentDiv.innerHTML = '<p>No se encontraron productos para esta subfamilia.</p>';
    }
};

// #region BOTON VOLVER
export const goBack = () => {
    initShop();
    document.getElementById('back-button').style.display = 'none';
    document.getElementById('title').style.display = 'block';

};