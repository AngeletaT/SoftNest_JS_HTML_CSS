// js/views/shopView.js

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

// Función para renderizar los productos
export const renderProducts = (products) => {
    const contentDiv = document.getElementById('products');
    contentDiv.innerHTML = '';
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
        contentDiv.innerHTML = '<p>No se encontraron productos para esta subfamilia.</p>';
    }
};

// Función para resetear la vista (volver a familias)
export const resetView = () => {
    const menuItems = document.getElementById('menu-items');
    menuItems.innerHTML = '';
    document.getElementById('content').innerHTML = '';
};
