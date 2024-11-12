// Función para obtener un producto específico por su referencia
export const getProductByReference = async (refProducto) => {
    console.log("refProducto:", refProducto);
    const url = `${JSON_PRODUCTOS}?referencia=${refProducto}`;
    console.log("url:", url);

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener el producto');

        const products = await response.json();
        console.log("products:", products);

        return products.length > 0 ? products[0] : null;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};
