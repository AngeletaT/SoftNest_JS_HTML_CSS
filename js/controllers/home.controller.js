import { getRandomProducts, getRecentProducts } from '../models/product.model.js';

export const initHome = async () => {
    await renderFeaturedCarousel();
    renderRecentProducts();
};

// #region CAROUSEL
const renderFeaturedCarousel = async () => {
    const carouselContent = document.getElementById('carousel-content');

    if (!carouselContent) {
        console.error("El elemento con ID 'carousel-content' no se encuentra en el DOM.");
        return;
    }

    const products = await getRandomProducts(15);

    if (products.length === 0) {
        carouselContent.innerHTML = '<p>No hay productos destacados disponibles.</p>';
        return;
    }

    window.carouselProducts = products;
    renderProductAtIndex(0);

    initCarousel();
};

const initCarousel = () => {
    document.querySelector('.carousel-button.left').addEventListener('click', prevSlide);
    document.querySelector('.carousel-button.right').addEventListener('click', nextSlide);
    updateCarouselPosition();
};

let currentIndex = 0;

const updateCarouselPosition = () => {
    const totalSlides = window.carouselProducts.length;

    if (currentIndex < 0) {
        currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
        currentIndex = 0;
    }

    renderProductAtIndex(currentIndex);
};

const renderProductAtIndex = (index) => {
    const carouselContent = document.getElementById('carousel-content');
    const product = window.carouselProducts[index];

    carouselContent.innerHTML = `
        <div class="carousel-product-card" style="background-image: url('${product.img_prod}');">
            <div class="carousel-text">
                <h3>${product.nom_prod}</h3>
                <a href="#" data-route="/details/${product.referencia}" class="view-more">Ver más</a>
            </div>
        </div>
    `;
};

const prevSlide = () => {
    currentIndex--;
    updateCarouselPosition();
};

const nextSlide = () => {
    currentIndex++;
    updateCarouselPosition();
};

// #region RECENT PRODUCTS
const renderRecentProducts = () => {
    const recentContainer = document.getElementById('recent-products');
    const recentProducts = getRecentProducts();

    if (recentProducts.length === 0) {
        recentContainer.innerHTML = '<p>No hay productos recientemente vistos.</p>';
        return;
    }

    // Inserta las cards de los productos recientes en el contenedor
    recentContainer.innerHTML = recentProducts.map(product => `
        <div class="product-card">
            <img src="${product.img_prod}" alt="${product.nom_prod}">
            <h3>${product.nom_prod}</h3>
            <a href="#" data-route="/details/${product.referencia}" class="view-more">Ver más</a>
        </div>
    `).join('');
};
