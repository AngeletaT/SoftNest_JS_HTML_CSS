import { getFamilies, getProducts } from '../models/product.model.js';
import { renderFamilies, renderSubfamilies, renderProducts, resetView } from '../views/shop.view.js';

// Variables para controlar el menú lateral.
let currentLevel = 'families';
let selectedFamily = null;
let selectedSubfamily = null;

// Cargar todos los productos inicialmente
export const initShop = async () => {
    const families = await getFamilies();
    console.log(families);
    if (families) {
        renderFamilies(families, handleFamilyClick);
        currentLevel = 'families';
    }
};

// Manejador para el clic en una familia
const handleFamilyClick = (family) => {
    selectedFamily = family;
    renderSubfamilies(family.subfamilias, handleSubfamilyClick);
    currentLevel = 'subfamilies';
    // Mostrar el botón para regresar
    document.getElementById('back-button').style.display = 'block';
};

// Manejador para el clic en una subfamilia
const handleSubfamilyClick = async (refSubfamilia) => {
    selectedSubfamily = refSubfamilia;
    const products = await getProducts(refSubfamilia);
    renderProducts(products);

    renderSubfamilies(selectedFamily.subfamilias, handleSubfamilyClick, selectedSubfamily);
};

// Función para volver al nivel anterior (familias)
export const goBack = () => {
    initShop();
    document.getElementById('back-button').style.display = 'none';
};

const loadAllProducts = async () => {
};




