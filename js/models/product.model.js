// #region GET FAMILIES
export const getFamilies = async () => {
    const url = `${API_URL}?r=es/familias&cli=${CLIENT_ID}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener las familias');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// #region GET FAMILY PRODUCTS
export const getFamilyProducts = async (family) => {
    const famProducts = [];
    const subfamilias = family.subfamilias;

    for (const subfamily of subfamilias) {
        const products = await getSubfamilyProducts(subfamily.refsubfamilia);
        famProducts.push(...products);
    }

    return famProducts;
};

// #region GET SUBFAMILY PRODUCTS
export const getSubfamilyProducts = async (refSubfamilia) => {
    const url = `${API_URL}?r=es/productosEnSubfamilia/${refSubfamilia}&cli=${CLIENT_ID}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error('Error al obtener los productos');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

// #region GET ALL PRODUCTS API
export const getAllProducts = async () => {
    const url = `${API_URL}?r=es/familias&cli=${CLIENT_ID}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener las familias');
        }
        const families = await response.json();

        let allProducts = [];

        for (const key in families) {
            const family = families[key];
            if (family.subfamilias && family.subfamilias.length > 0) {
                for (const subfamily of family.subfamilias) {
                    const products = await getSubfamilyProducts(subfamily.refsubfamilia);
                    allProducts = allProducts.concat(products);
                }

            }
        }

        return allProducts;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

// #region GET ALL PRODUCTS JSON
export const getAllProductsJSON = async () => {
    try {
        const response = await fetch(JSON_PRODUCTOS);
        if (!response.ok) throw new Error('Error al obtener todos los productos desde JSON Server');

        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

// #region GET RANDOM PRODUCTS
export const getRandomProducts = async (count) => {
    try {
        const response = await fetch(JSON_PRODUCTOS);
        if (!response.ok) throw new Error('Error en la respuesta de la API');

        const products = await response.json();
        const randomProducts = [];

        while (randomProducts.length < count && products.length > 0) {
            const randomIndex = Math.floor(Math.random() * products.length);
            randomProducts.push(products.splice(randomIndex, 1)[0]);
        }

        return randomProducts;
    } catch (error) {
        console.error('Error obteniendo productos aleatorios:', error);
        return [];
    }
};

// #region GET RECENT PRODUCTS
export const getRecentProducts = () => {
    try {
        return JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    } catch (error) {
        console.error('Error obteniendo productos recientes:', error);
        return [];
    }
};

