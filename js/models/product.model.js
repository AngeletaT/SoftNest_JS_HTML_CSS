// Función para obtener las familias desde la API
export const getFamilies = async () => {
    const url = `${API_URL}?r=es/familias&cli=${CLIENT_ID}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        // console.log("familias", response);
        if (!response.ok) throw new Error('Error al obtener las familias');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// Función para obtener los productos de todas las subfamilias de una familia
export const getFamilyProducts = async (family) => {
    const famProducts = [];
    const subfamilias = family.subfamilias;

    // Iterar sobre cada subfamilia y obtener los productos
    for (const subfamily of subfamilias) {
        const products = await getSubfamilyProducts(subfamily.refsubfamilia);
        famProducts.push(...products); // Añadir los productos obtenidos al array total
    }

    return famProducts; // Devolver todos los productos de la familia
};

// Función para obtener productos de una subfamilia
export const getSubfamilyProducts = async (refSubfamilia) => {
    const url = `${API_URL}?r=es/productosEnSubfamilia/${refSubfamilia}&cli=${CLIENT_ID}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        // console.log("productos", response);
        if (!response.ok) throw new Error('Error al obtener los productos');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

export const getAllProducts = async () => {
    const url = `${API_URL}?r=es/familias&cli=${CLIENT_ID}&apikey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener las familias');
        }
        const families = await response.json();

        let allProducts = [];

        // Iterar sobre cada familia para obtener sus subfamilias y productos
        for (const key in families) {
            const family = families[key];
            // console.log("family", family);
            if (family.subfamilias && family.subfamilias.length > 0) {
                // console.log("family.subfamilias", family.subfamilias);
                for (const subfamily of family.subfamilias) {
                    const products = await getSubfamilyProducts(subfamily.refsubfamilia);
                    allProducts = allProducts.concat(products);
                }

            }
        }
        console.log("allProducts", allProducts);

        return allProducts; // Devolver todos los productos de todas las familias
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};


