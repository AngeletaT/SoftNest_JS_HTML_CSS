// Función para obtener las familias desde la API
export const getFamilies = async () => {
    const url = `${API_URL}?r=es/familias&cli=${CLIENT_ID}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        console.log("familias", response);
        if (!response.ok) throw new Error('Error al obtener las familias');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

// Función para obtener productos de una subfamilia
export const getProducts = async (refSubfamilia) => {
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

// Función para obtener todos los productos

